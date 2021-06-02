import 'module-alias/register';

import { writeToCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterStructured } from '@interfaces/repeater-structured';
import {
  Wcs7100,
  Wcs7100OffsetDirection,
  Wcs7100OperatingMode,
  Wcs7100ToneMode,
  Wcs7100YourCallsign,
} from '@interfaces/wcs7100';
import chalk from 'chalk';
import {
  buildDCS,
  convertOffsetFrequency,
  filterOutputFrequencies,
  filterMode,
  FrequencyBand,
  loadRepeaters,
  loadSimplex,
  Mode,
  RadioCommon,
  radioCommon, filterInputFrequencies
} from '@helpers/radio-helpers';
import { program } from 'commander';
import gpsDistance from 'gps-distance';
import { checkCoordinates, splitCoordinates } from '@helpers/helpers';
import { RtSystemsCtcssTone, RtSystemsDcsTone } from '@interfaces/rt-systems';

const log: (...msg: any[]) => void = createLog('Make Wcs7100');

// const homePoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St
// const DenverPoint: Point = [39.742043, -104.991531];
// const ColoradoSpringsPoint: Point = [38.846127, -104.800644];

log('Program Setup');

program
  .version('0.0.1')
  .arguments('<location> <name>')
  .action(async (location: string, name: string): Promise<void> => {
    log('Program Action', location, name);
    if (location) {
      const latLong: gpsDistance.Point = splitCoordinates(location);
      if (checkCoordinates(latLong)) {
        await doIt(latLong, `../data/repeaters/wcs7100/${ name }`);
      }
    }
  });

log('Program Parse Args');

program.parse(process.argv);

async function doIt(location: gpsDistance.Point, outFileName: string): Promise<void> {
  const promises: Promise<void>[] = [];

  const bands = [
    // FrequencyBand.$160_m,
    // FrequencyBand.$80_m,
    // FrequencyBand.$60_m,
    FrequencyBand.$40_m,
    FrequencyBand.$30_m,
    FrequencyBand.$20_m,
    FrequencyBand.$17_m,
    FrequencyBand.$15_m,
    FrequencyBand.$12_m,
    FrequencyBand.$10_m,
    FrequencyBand.$6_m,
    FrequencyBand.$2_m,
    FrequencyBand.$70_cm
  ];

  const dedupe = new Set();

  const simplex: RepeaterStructured[] =
    (await loadSimplex(/^((?!(Fusion|Mixed|CW|RTTY|(Digital Simplex))).)*$/i))
      .filter(filterOutputFrequencies(...bands))
      .filter(filterInputFrequencies(...bands))
      .filter((filter: RepeaterStructured) => {
        const fingerprint = `${filter.Frequency.Input}${filter.Frequency.Output}${filter.Callsign.substring(0, 3)}`;
        if (!dedupe.has(fingerprint)) {
          dedupe.add(fingerprint);
          return true;
        }
        return false;
      });

  const repeaters: RepeaterStructured[] = await loadRepeaters(location);

  const mapped: Wcs7100[] = [
    ...simplex,
    ...repeaters
      .filter(filterOutputFrequencies(...bands))
      .filter(filterInputFrequencies(...bands))
      .filter(filterMode(Mode.FM, Mode.DStar)),
  ]
    .map((map: RepeaterStructured, index: number): Wcs7100 => convertToRadio(map))
  // The lower frequencies are very noisy and have to turn the SQL up high which cuts out low signals in the higher frequencies
  // .filter((filter: Wcs7100): boolean =>
  //   filter['Operating Mode'] === Wcs7100OperatingMode.FM ||
  //   filter['Operating Mode'] === Wcs7100OperatingMode.DV ||
  //   filter['Receive Frequency'] >= 10);

  const rfiFrequencies = [
    144.585,
    445.725,
    445.775,
    445.850,
    445.925,
    445.975,
    446.175,
    446.250
  ];
  const rfiFilter = (filter: Wcs7100): boolean => rfiFrequencies.includes(filter['Receive Frequency']);

  const filtered = mapped
    .filter((filter: Wcs7100): boolean => !rfiFilter(filter));

  // const simplexFilter = (filter: Wcs7100): boolean => filter['Offset Direction'] === Wcs7100OffsetDirection.Simplex && filter['Tone Mode'] === Wcs7100ToneMode.None;
  const duplexFilter = (filter: Wcs7100): boolean => filter['Offset Direction'] !== Wcs7100OffsetDirection.Simplex || filter['Tone Mode'] !== Wcs7100ToneMode.None;
  const fmOrDVFilter = (filter: Wcs7100): boolean => filter['Operating Mode'] === Wcs7100OperatingMode.FM || filter['Operating Mode'] === Wcs7100OperatingMode.DV;
  const issOrSatFilter = (filter: Wcs7100): boolean => /^[A-Z]* ISS/.test(filter.Name) || /^[A-Z]* SAT/.test(filter.Name);
  const sotaOrWarcFilter = (filter: Wcs7100): boolean => /^[A-Z]* SOTA/.test(filter.Name) || /^[A-Z]* WARC/.test(filter.Name);
  const finalProcess = (map: Wcs7100, index: number): Wcs7100 => ({
    ...map,
    'Channel Number': index + 1,
    'Receive Frequency': map['Receive Frequency'].toFixed(5) as any,
    'Transmit Frequency': map['Transmit Frequency'].toFixed(5) as any
  });

  const A: Wcs7100[] = filtered
    .filter((filter: Wcs7100): boolean => !fmOrDVFilter(filter))
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .sort((a: Wcs7100, b: Wcs7100): number => a['Transmit Frequency'] - b['Transmit Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a['Receive Frequency'] - b['Receive Frequency'])
    .slice(0, 99)
    .map(finalProcess);

  const B: Wcs7100[] = filtered
    .filter((filter: Wcs7100): boolean => (!duplexFilter(filter) || issOrSatFilter(filter) || sotaOrWarcFilter(filter)) && fmOrDVFilter(filter))
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .sort((a: Wcs7100, b: Wcs7100): number => a['Transmit Frequency'] - b['Transmit Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a['Receive Frequency'] - b['Receive Frequency'])
    .slice(0, 99)
    .map(finalProcess);

  const C: Wcs7100[] = filtered
    .filter((filter: Wcs7100): boolean => duplexFilter(filter) && !issOrSatFilter(filter) && !sotaOrWarcFilter(filter))
    .slice(0, 99)
    .sort((a: Wcs7100, b: Wcs7100): number => a['Transmit Frequency'] - b['Transmit Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a['Receive Frequency'] - b['Receive Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .map(finalProcess);

  const D: Wcs7100[] = filtered
    .filter((filter: Wcs7100): boolean => duplexFilter(filter) && !issOrSatFilter(filter) && !sotaOrWarcFilter(filter))
    .slice(99, 198)
    .sort((a: Wcs7100, b: Wcs7100): number => a['Transmit Frequency'] - b['Transmit Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a['Receive Frequency'] - b['Receive Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .map(finalProcess);

  const E: Wcs7100[] = filtered
    .filter((filter: Wcs7100): boolean => duplexFilter(filter) && !issOrSatFilter(filter) && !sotaOrWarcFilter(filter))
    .slice(198, 297)
    .sort((a: Wcs7100, b: Wcs7100): number => a['Transmit Frequency'] - b['Transmit Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a['Receive Frequency'] - b['Receive Frequency'])
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .map(finalProcess);

  promises.push(writeToCsv(`${outFileName}-A`, A));
  promises.push(writeToCsv(`${outFileName}-B`, B));
  promises.push(writeToCsv(`${outFileName}-C`, C));
  promises.push(writeToCsv(`${outFileName}-D`, D));
  promises.push(writeToCsv(`${outFileName}-E`, E));

  await Promise.all(promises);
}

function convertToRadio(repeater: RepeaterStructured): Wcs7100 {
  const {
    Name,
    Receive,
    Transmit,
    OffsetFrequency,
    TransmitSquelchTone,
    ReceiveSquelchTone,
    TransmitDigitalTone,
    ReceiveDigitalTone,
    Comment,
  }: RadioCommon = radioCommon(repeater);

  let OperatingMode: Wcs7100OperatingMode = Wcs7100OperatingMode.FM; // (repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) ? Wcs7100OperatingMode.DV : Wcs7100OperatingMode.FM;
  let YourCallSign: Wcs7100YourCallsign = Wcs7100YourCallsign.None; // OperatingMode === Wcs7100OperatingMode.DV ? Wcs7100YourCallsign.CQCQCQ : Wcs7100YourCallsign.None;
  let Rpt1CallSign: string = '';
  let Rpt2CallSign: string = '';

  if ((repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) || /^Digital/.test(repeater.Callsign) || /^D[ -]?Star/.test(repeater.Callsign)) {
    OperatingMode = Wcs7100OperatingMode.DV;
    YourCallSign = Wcs7100YourCallsign.CQCQCQ;
    if (repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) {
      Rpt1CallSign = convertDStarCallSign(repeater.Callsign, repeater.Digital.DStar.Node);
      Rpt2CallSign = convertDStarCallSign(repeater.Callsign, 'G');
    }
  } else if (/^AM/.test(repeater.Callsign)) {
    OperatingMode = Wcs7100OperatingMode.AM;
  } else if (/^SSB/.test(repeater.Callsign)) {
    if (repeater.Frequency.Output <= 10) {
      OperatingMode = Wcs7100OperatingMode.LSB;
    } else {
      OperatingMode = Wcs7100OperatingMode.USB;
    }
  } else if (/^USB/.test(repeater.Callsign)) {
    OperatingMode = Wcs7100OperatingMode.USB;
  } else if (/^LSB/.test(repeater.Callsign)) {
    OperatingMode = Wcs7100OperatingMode.LSB;
  } else if (/^CW/.test(repeater.Callsign)) {
    OperatingMode = Wcs7100OperatingMode.CW;
  } else if (/^RTTY/.test(repeater.Callsign)) {
    OperatingMode = Wcs7100OperatingMode.RTTY;
  }

  let ToneMode: Wcs7100ToneMode = Wcs7100ToneMode.None;

  if (TransmitSquelchTone) {
    ToneMode = Wcs7100ToneMode.Tone; // "TONE ENC";
  } else if (TransmitDigitalTone) {
    ToneMode = Wcs7100ToneMode.DTCS; // "DCS";
  }

  if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
    ToneMode = Wcs7100ToneMode.T_Sql; // "TONE SQL";
  } else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
    ToneMode = Wcs7100ToneMode.DTCS; // "DCS";
  }

  const CTCSS: RtSystemsCtcssTone = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz') as RtSystemsCtcssTone;
  // tslint:disable-next-line:variable-name
  const Rx_CTCSS: RtSystemsCtcssTone = ((ReceiveSquelchTone || TransmitSquelchTone || 100).toFixed(1) + ' Hz') as RtSystemsCtcssTone;
  const DCS: RtSystemsDcsTone = buildDCS(TransmitDigitalTone) as RtSystemsDcsTone;

  return new Wcs7100({
    'Receive Frequency': Receive, // .toFixed(5) as any,
    'Transmit Frequency': Transmit, // .toFixed(5) as any,
    'Offset Frequency': convertOffsetFrequency(OffsetFrequency),
    'Offset Direction': convertOffsetDirection(OffsetFrequency),
    'Operating Mode': OperatingMode,
    Name,
    'Tone Mode': ToneMode,
    CTCSS,
    'Rx CTCSS': Rx_CTCSS,
    DCS,
    Comment,
    'Your Callsign': YourCallSign,
    'Rpt-1 CallSign': Rpt1CallSign,
    'Rpt-2 CallSign': Rpt2CallSign,
  });
}

function convertOffsetDirection(OffsetFrequency: number): Wcs7100OffsetDirection {
  if (OffsetFrequency === 0) {
    return Wcs7100OffsetDirection.Simplex;
  } else if (OffsetFrequency < 0) {
    return Wcs7100OffsetDirection.Minus;
  } else if (OffsetFrequency > 0) {
    return Wcs7100OffsetDirection.Plus;
  }
  log(chalk.red('ERROR'), 'convertOffsetDirection', 'unknown', OffsetFrequency);
  return Wcs7100OffsetDirection.Simplex;
}

function convertDStarCallSign(callSign: string, node: string): string {
  if (callSign && node) {
    const callSignModuleRegex: RegExp = new RegExp(`(${ callSign } )?\\(?([ABCDEFG])\\)?`);
    const callSignModule: RegExpMatchArray | null = node.match(callSignModuleRegex);
    const callSignPadded: string = `${ callSign }        `;
    return `${ callSignPadded.substr(0, 7) }${ callSignModule![callSignModule!.length - 1] }`;
  }
  return '';
}
