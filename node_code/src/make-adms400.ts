import 'module-alias/register';

import { getAllFilesInDirectory, readFileAsync, readFromCsv, writeToCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterStructured } from '@interfaces/repeater-structured';
import { SimplexFrequency } from '@interfaces/simplex-frequency';
import {
  Adms400,
  Adms400CtcssTone,
  Adms400DcsTone,
  Adms400OffsetDirection,
  Adms400OffsetFrequency,
  Adms400ToneMode,
} from '@interfaces/adms400';
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
      const latLong: gpsDistance.Point = location.split(',').map((l: string): number => parseFloat(l)) as gpsDistance.Point;
      await doIt(latLong,`../data/repeaters/adms400/${name}`);
    }
  });

log('Program Parse Args');

program.parse(process.argv);

async function doIt(location: gpsDistance.Point, outFileName: string): Promise<void> {
  const repeaters: RepeaterStructured[] = [];

  const simplex: RepeaterStructured[] =
    (await readFromCsv<SimplexFrequency>('../data/simplex-frequencies.csv'))
      .map((map: SimplexFrequency): RepeaterStructured =>
        ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }) as RepeaterStructured)
      .filter((filter: RepeaterStructured): boolean => /FM|Digital|Mixed|Fusion/i.test(filter.Callsign)); // TODO: Make a function and enum

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
      fileData.Location.Distance = gpsDistance([location, [fileData.Location.Latitude, fileData.Location.Longitude]]);
      repeaters.push(fileData);
    }
  }));

  log('Got', repeaters.length, 'Repeaters');

  repeaters
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.DigitalTone && a.DigitalTone.Input || 0) - (b.DigitalTone && b.DigitalTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.SquelchTone && a.SquelchTone.Input || 0) - (b.SquelchTone && b.SquelchTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Frequency.Input - b.Frequency.Input)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Location.Distance! - b.Location.Distance!)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.DigitalTone && a.DigitalTone.Input || 0) - (b.DigitalTone && b.DigitalTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.SquelchTone && a.SquelchTone.Input || 0) - (b.SquelchTone && b.SquelchTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Frequency.Input - b.Frequency.Input)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Location.Distance! - b.Location.Distance!);

  const uniqueRouterId: { [key: string]: boolean } = {};
  const mapped: Adms400[] = [
    ...simplex
      .filter(filterFrequencies(
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      )),
    ...repeaters
      // .filter(filterMinimumRepeaterCount(3, repeaters))
      .filter(filterFrequencies(
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      ))
      // .filter(filterDistance(100))
      .filter(filterMode(Mode.FM, Mode.YSF)),
  ]
    .map((map: RepeaterStructured, index: number): Adms400 => ({ ...convertToRadio(map), 'Channel Number': index + 1 }))
    .filter((filter: Adms400): boolean => {
      const name: string = `${filter['Receive Frequency']} ${filter['Transmit Frequency']} ${filter['Tone Mode']} ${filter.CTCSS} ${filter.DCS}`;
      if (uniqueRouterId[name]) {
        return false;
      }
      uniqueRouterId[name] = true;
      return true;
    })
    .slice(0, 500)
    .map((map: Adms400, index: number): Adms400 => ({ ...map, 'Channel Number': index + 1 }));

  return writeToCsv(outFileName, mapped);
}

function convertToRadio(repeater: RepeaterStructured): Adms400 {
  const Name: string = `${buildName(repeater)} ${getRepeaterSuffix(repeater)}`;

  const Receive: number = repeater.Frequency.Output;
  const Transmit: number = repeater.Frequency.Input;
  const OffsetFrequency: number = repeater.Frequency.Input - repeater.Frequency.Output;
  const TransmitSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Input);
  const ReceiveSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Output);
  const TransmitDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Input);
  const ReceiveDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Output);
  const Comment: string = buildComment(repeater);

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

  const CTCSS: Adms400CtcssTone = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz') as Adms400CtcssTone;
  const DCS: Adms400DcsTone = buildDCS(TransmitDigitalTone) as Adms400DcsTone;

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

function convertOffsetFrequency(OffsetFrequency: number): Adms400OffsetFrequency {
  switch (Math.abs(Math.round(OffsetFrequency * 10)) / 10) {
    case 0:
      return Adms400OffsetFrequency.None;
    case 0.1:
      return Adms400OffsetFrequency.$100_kHz;
    case 0.5:
      return Adms400OffsetFrequency.$500_kHz;
    case 0.6:
      return Adms400OffsetFrequency.$600_kHz;
    case 1:
      return Adms400OffsetFrequency.$1_MHz;
    case 1.6:
      return Adms400OffsetFrequency.$1_60_MHz;
    case 3:
      return Adms400OffsetFrequency.$3_MHz;
    case 5:
      return Adms400OffsetFrequency.$5_MHz;
    case 7.6:
      return Adms400OffsetFrequency.$7_60_MHz;
  }
  log(chalk.red('ERROR'), 'convertOffsetFrequency', 'unknown', OffsetFrequency);
  return Adms400OffsetFrequency.None;
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
