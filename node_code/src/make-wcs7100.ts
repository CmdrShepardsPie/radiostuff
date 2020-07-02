import 'module-alias/register';

import { getAllFilesInDirectory, readFileAsync, readFromCsv, writeToCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterStructured } from '@interfaces/repeater-structured';
import { SimplexFrequency } from '@interfaces/simplex-frequency';
import {
  Wcs7100,
  Wcs7100CtcssTone,
  Wcs7100DcsTone,
  Wcs7100OffsetDirection,
  Wcs7100OffsetFrequency,
  Wcs7100OperatingMode,
  Wcs7100ToneMode,
  Wcs7100YourCallsign,
} from '@interfaces/wcs7100';
import chalk from 'chalk';
import {
  buildComment,
  buildDCS,
  buildName,
  filterFrequencies,
  filterMode,
  FrequencyBand,
  getRepeaterSuffix,
  Mode
} from '@helpers/radio-helpers';
import { program } from 'commander';
import gpsDistance from 'gps-distance';

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
      const latLong: gpsDistance.Point = location.split(',').map((l: string): number => parseFloat(l)) as gpsDistance.Point;
      await doIt(latLong,`../data/repeaters/wcs7100/${name}`);
    }
  });

log('Program Parse Args');

program.parse(process.argv);

async function doIt(location: gpsDistance.Point, outFileName: string): Promise<void> {
  const promises: Promise<void>[] = [];
  const repeaters: RepeaterStructured[] = [];

  const simplex: RepeaterStructured[] =
    (await readFromCsv<SimplexFrequency>('../data/simplex-frequencies.csv'))
      .map((map: SimplexFrequency): RepeaterStructured =>
        ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }) as RepeaterStructured)
      .filter((filter: RepeaterStructured): boolean => !/Fusion|Mixed|QRP|CW/i.test(filter.Callsign)); // TODO: Make a function and enum

  const files: string[] = await getAllFilesInDirectory('../data/repeaters/converted/json', 'json', 1);

  const uniqueFileName: { [key: string]: boolean } = {};

  await Promise.all(files.map(async (file: string): Promise<void> => {
    // log('Read File', file);
    const fileBuffer: Buffer = await readFileAsync(file);
    const fileString: string = fileBuffer.toString();
    const fileData: RepeaterStructured = JSON.parse(fileString);
    const name: string = `${fileData.StateID} ${fileData.ID}`;
    if (!uniqueFileName[name]) {
      uniqueFileName[name] = true;
      fileData.Location.Distance = Math.round(gpsDistance([location, [fileData.Location.Latitude, fileData.Location.Longitude]]));
      repeaters.push(fileData);
    }
  }));

  log('Got', repeaters.length, 'Repeaters');

  repeaters
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Callsign > b.Callsign ? 1 : a.Callsign < b.Callsign ? - 1 : 0)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.DigitalTone && a.DigitalTone.Input || 0) - (b.DigitalTone && b.DigitalTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.SquelchTone && a.SquelchTone.Input || 0) - (b.SquelchTone && b.SquelchTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Frequency.Input - b.Frequency.Input)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Location.Distance! - b.Location.Distance!)

    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Callsign > b.Callsign ? 1 : a.Callsign < b.Callsign ? - 1 : 0)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.DigitalTone && a.DigitalTone.Input || 0) - (b.DigitalTone && b.DigitalTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.SquelchTone && a.SquelchTone.Input || 0) - (b.SquelchTone && b.SquelchTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Frequency.Input - b.Frequency.Input)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Location.Distance! - b.Location.Distance!);

  // const uniqueRouterId: { [key: string]: boolean } = {};
  const mapped: Wcs7100[] = [
    ...simplex
      .filter(filterFrequencies(
        FrequencyBand.$160_m,
        FrequencyBand.$80_m,
        FrequencyBand.$60_m,
        FrequencyBand.$40_m,
        FrequencyBand.$30_m,
        FrequencyBand.$20_m,
        FrequencyBand.$17_m,
        FrequencyBand.$15_m,
        FrequencyBand.$12_m,
        FrequencyBand.$10_m,
        FrequencyBand.$6_m,
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      )),
    ...repeaters
      // .filter(filterMinimumRepeaterCount(3, repeaters))
      .filter(filterFrequencies(
        FrequencyBand.$160_m,
        FrequencyBand.$80_m,
        FrequencyBand.$60_m,
        FrequencyBand.$40_m,
        FrequencyBand.$30_m,
        FrequencyBand.$20_m,
        FrequencyBand.$17_m,
        FrequencyBand.$15_m,
        FrequencyBand.$12_m,
        FrequencyBand.$10_m,
        FrequencyBand.$6_m,
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      ))
      // .filter(filterDistance(100))
      .filter(filterMode(Mode.FM, Mode.DStar)),
  ]
    .map((map: RepeaterStructured, index: number): Wcs7100 => ({ ...convertToRadio(map), 'Channel Number': index + 1 }));
    // .filter((filter: Wcs7100): boolean => {
    //   const name: string = `${filter['Operating Mode']} ${filter['Receive Frequency']} ${filter['Transmit Frequency']} ${filter['Tone Mode']} ${filter.CTCSS} ${filter['Rx CTCSS']} ${filter.DCS}`;
    //   if (uniqueRouterId[name]) {
    //     return false;
    //   }
    //   uniqueRouterId[name] = true;
    //   return true;
    // });
    // .slice(0, 500);

  const simplexWcs7100: Wcs7100[] = mapped
    .filter((filter: Wcs7100): boolean => filter['Offset Direction'] === Wcs7100OffsetDirection.Simplex && filter['Tone Mode'] === Wcs7100ToneMode.None)
    .slice(0, 99)
    .map((map: Wcs7100, index: number): Wcs7100 => ({ ...map, 'Channel Number': index + 1 }));

  const duplexWcs7100: Wcs7100[] = mapped
    .filter((filter: Wcs7100): boolean => filter['Offset Direction'] !== Wcs7100OffsetDirection.Simplex || filter['Tone Mode'] !== Wcs7100ToneMode.None);

  const B: Wcs7100[] = duplexWcs7100
    .slice(0, 99)
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .map((map: Wcs7100, index: number): Wcs7100 => ({ ...map, 'Channel Number': index + 1 }));
  const C: Wcs7100[] = duplexWcs7100
    .slice(99, 198)
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .map((map: Wcs7100, index: number): Wcs7100 => ({ ...map, 'Channel Number': index + 1 }));
  const D: Wcs7100[] = duplexWcs7100
    .slice(198, 297)
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .map((map: Wcs7100, index: number): Wcs7100 => ({ ...map, 'Channel Number': index + 1 }));
  const E: Wcs7100[] = duplexWcs7100
    .slice(297, 396)
    .sort((a: Wcs7100, b: Wcs7100): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0)
    .map((map: Wcs7100, index: number): Wcs7100 => ({ ...map, 'Channel Number': index + 1 }));

  promises.push(writeToCsv(`${outFileName}-A`, simplexWcs7100));
  promises.push(writeToCsv(`${outFileName}-B`, B));
  promises.push(writeToCsv(`${outFileName}-C`, C));
  promises.push(writeToCsv(`${outFileName}-D`, D));
  promises.push(writeToCsv(`${outFileName}-E`, E));

  await Promise.all(promises);
}

function convertToRadio(repeater: RepeaterStructured): Wcs7100 {
  // const Name: string = `${buildName(repeater)} ${getRepeaterSuffix(repeater)}`;
  const Name: string = `${buildName(repeater)}`;

  const Receive: number = repeater.Frequency.Output;
  const Transmit: number = repeater.Frequency.Input;
  const OffsetFrequency: number = repeater.Frequency.Input - repeater.Frequency.Output;
  const TransmitSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Input);
  const ReceiveSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Output);
  const TransmitDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Input);
  const ReceiveDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Output);
  const Comment: string = buildComment(repeater);

  let OperatingMode: Wcs7100OperatingMode = Wcs7100OperatingMode.FM; // (repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) ? Wcs7100OperatingMode.DV : Wcs7100OperatingMode.FM;
  let YourCallsign: Wcs7100YourCallsign = Wcs7100YourCallsign.None; // OperatingMode === Wcs7100OperatingMode.DV ? Wcs7100YourCallsign.CQCQCQ : Wcs7100YourCallsign.None;
  let Rpt1CallSign: string = '';
  let Rpt2CallSign: string = '';

  if ((repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) || /^Digital/.test(repeater.Callsign) || /^D[ -]?Star/.test(repeater.Callsign)) {
    OperatingMode = Wcs7100OperatingMode.DV;
    YourCallsign = Wcs7100YourCallsign.CQCQCQ;
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

  const CTCSS: Wcs7100CtcssTone = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz') as Wcs7100CtcssTone;
  const Rx_CTCSS: Wcs7100CtcssTone = ((ReceiveSquelchTone || 100).toFixed(1) + ' Hz') as Wcs7100CtcssTone;
  const DCS: Wcs7100DcsTone = buildDCS(TransmitDigitalTone) as Wcs7100DcsTone;

  return new Wcs7100({
    'Receive Frequency': Receive.toFixed(5) as any,
    'Transmit Frequency': Transmit.toFixed(5) as any,
    'Offset Frequency': convertOffsetFrequency(OffsetFrequency),
    'Offset Direction': convertOffsetDirection(OffsetFrequency),
    'Operating Mode': OperatingMode,
    Name,
    'Tone Mode': ToneMode,
    CTCSS,
    'Rx CTCSS': Rx_CTCSS,
    DCS,
    Comment,
    'Your Callsign': YourCallsign,
    'Rpt-1 CallSign': Rpt1CallSign,
    'Rpt-2 CallSign': Rpt2CallSign,
  });
}

function convertOffsetFrequency(offsetFrequency: number): Wcs7100OffsetFrequency {
  const roundFrequency: number = Math.abs(Math.round(offsetFrequency * 10)) / 10;
  switch (roundFrequency) {
    case 0:
      return Wcs7100OffsetFrequency.None;
    case 0.1:
      return Wcs7100OffsetFrequency.$100_kHz;
    case 0.4:
      return Wcs7100OffsetFrequency.$400_kHz;
    case 0.5:
      return Wcs7100OffsetFrequency.$500_kHz;
    case 0.6:
      return Wcs7100OffsetFrequency.$600_kHz;
    case 1:
      return Wcs7100OffsetFrequency.$1_MHz;
    case 1.6:
      return Wcs7100OffsetFrequency.$1_60_MHz;
    case 2.5:
      return Wcs7100OffsetFrequency.$2_50_MHz;
    case 3:
      return Wcs7100OffsetFrequency.$3_MHz;
    case 5:
      return Wcs7100OffsetFrequency.$5_MHz;
    case 5.05:
      return Wcs7100OffsetFrequency.$5_05_MHz;
    case 7.6:
      return Wcs7100OffsetFrequency.$7_60_MHz;
  }
  log(chalk.red('ERROR'), 'convertOffsetFrequency', 'unknown', roundFrequency);
  return Wcs7100OffsetFrequency.None;
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

function convertDStarCallSign(callsign: string, node: string): string {
  // log('convertDStarCallSign', 'callsign', callsign, 'node', node);
  if (callsign && node) {
    const callSignModuleRegex: RegExp = new RegExp(`(${ callsign } )?\\(?([ABCDEFG])\\)?`);
    const callSignModule: RegExpMatchArray | null = node.match(callSignModuleRegex);
    // log('convertDStarCallSign', 'callsign', callsign, 'node', node, 'callSignModule', callSignModule);

    const callsignPadded: string = `${ callsign }        `;
    const result: string = `${ callsignPadded.substr(0, 7) }${ callSignModule![callSignModule!.length - 1] }`;

    // log('convertDStarCallSign', 'callsign', callsign, 'node', node, 'callSignModule', callSignModule, 'result', result);

    return result;
  }
  return '';
}
