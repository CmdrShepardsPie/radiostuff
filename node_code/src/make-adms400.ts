import 'module-alias/register';

import { writeToCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterStructured } from '@interfaces/repeater-structured';
import {
  Adms400,
  Adms400OffsetDirection,
  Adms400ToneMode,
} from '@interfaces/adms400';
import chalk from 'chalk';
import {
  buildDCS, convertOffsetFrequency,
  filterFrequencies,
  filterMode,
  FrequencyBand, RadioCommon, loadRepeaters, loadSimplex, Mode, radioCommon,
} from '@helpers/radio-helpers';
import { program } from 'commander';
import gpsDistance from 'gps-distance';
import { RtSystemsCtcssTone, RtSystemsDcsTone } from '@interfaces/rt-systems';
import { checkCoordinates, splitCoordinates } from '@helpers/helpers';
import { Chirp } from '@interfaces/chirp';

const log: (...msg: any[]) => void = createLog('Make Adms400');

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
        await doIt(latLong, `../data/repeaters/adms400/${ name }`);
      }
    }
  });

log('Program Parse Args');

program.parse(process.argv);

async function doIt(location: gpsDistance.Point, outFileName: string): Promise<void> {
  const simplex: RepeaterStructured[] = await loadSimplex(/FM|(Digital Simplex)|Mixed|Fusion/i);
  const repeaters: RepeaterStructured[] = await loadRepeaters(location);

  const mapped: Adms400[] = [
    ...simplex
      .filter(filterFrequencies(
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      )),
    ...repeaters
      .filter(filterFrequencies(
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      ))
      .filter(filterMode(Mode.FM, Mode.YSF)),
  ]
    .map((map: RepeaterStructured): Adms400 => convertToRadio(map))
    .slice(0, 500);

  const simplexAdms400: Adms400[] = mapped
    .filter((filter: Adms400): boolean => filter['Offset Direction'] === Adms400OffsetDirection.Simplex && filter['Tone Mode'] === Adms400ToneMode.None);

  const duplexAdms400: Adms400[] = mapped
    .filter((filter: Adms400): boolean => filter['Offset Direction'] !== Adms400OffsetDirection.Simplex || filter['Tone Mode'] !== Adms400ToneMode.None)
    .sort((a: Adms400, b: Adms400): number => a['Receive Frequency'] - b['Receive Frequency'])
    .sort((a: Adms400, b: Adms400): number => a.Name > b.Name ? 1 : a.Name < b.Name ? - 1 : 0);

  const recombine: Adms400[] = [...simplexAdms400, ...duplexAdms400]
    .map((map: Adms400, index: number): Adms400 => ({ ...map, 'Channel Number': index + 1 }));

  return writeToCsv(outFileName, recombine);
}

function convertToRadio(repeater: RepeaterStructured): Adms400 {
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

  let ToneMode: Adms400ToneMode = Adms400ToneMode.None;

  if (TransmitSquelchTone) {
    ToneMode = Adms400ToneMode.Tone; // "TONE ENC";
  } else if (TransmitDigitalTone) {
    ToneMode = Adms400ToneMode.T_DCS; // "DCS";
  }

  if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
    ToneMode = Adms400ToneMode.T_Sql; // "TONE SQL";
  } else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
    ToneMode = Adms400ToneMode.DCS; // "DCS";
  }

  const CTCSS: RtSystemsCtcssTone = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz') as RtSystemsCtcssTone;
  const DCS: RtSystemsDcsTone = buildDCS(TransmitDigitalTone) as RtSystemsDcsTone;

  return new Adms400({
    'Receive Frequency': Receive.toFixed(5) as any,
    'Transmit Frequency': Transmit.toFixed(5) as any,
    'Offset Frequency': convertOffsetFrequency(OffsetFrequency),
    'Offset Direction': convertOffsetDirection(OffsetFrequency),
    Name,
    'Tone Mode': ToneMode,
    CTCSS,
    DCS,
    Comment,
  });
}

function convertOffsetDirection(OffsetFrequency: number): Adms400OffsetDirection {
  if (OffsetFrequency === 0) {
    return Adms400OffsetDirection.Simplex;
  } else if (OffsetFrequency < 0) {
    return Adms400OffsetDirection.Minus;
  } else if (OffsetFrequency > 0) {
    return Adms400OffsetDirection.Plus;
  }
  log(chalk.red('ERROR'), 'convertOffsetDirection', 'unknown', OffsetFrequency);
  return Adms400OffsetDirection.Simplex;
}
