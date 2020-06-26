import 'module-alias/register';

import { readFileAsync, readFromCsv, writeToCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterStructured } from '@interfaces/repeater-structured';
import { SimplexFrequency } from '@interfaces/simplex-frequency';
import gpsDistance, { Point } from 'gps-distance';
import {
  buildComment, buildDCS,
  buildName,
  filterFrequencies,
  filterMode,
  FrequencyBand,
  getRepeaterSuffix,
  Mode
} from '@helpers/radio-helpers';
import chalk from 'chalk';
import {
  Adms7,
  Adms7Bank,
  Adms7ClockShift,
  Adms7CtcssTone,
  Adms7DcsTone,
  Adms7OffsetDirection,
  Adms7ToneMode
} from '@interfaces/adms7';
import { program } from 'commander';

const log: (...msg: any[]) => void = createLog('Make Adms7');

// const homePoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St
// const DenverPoint: Point = [39.742043, -104.991531];
// const ColoradoSpringsPoint: Point = [38.846127, -104.800644];

log('Program Setup');

program
  .version('0.0.1')
  .arguments('<location>')
  .action(async (location: string): Promise<void> => {
    log('Program Action');
    if (location) {
      await doIt(`../data/repeaters/converted/json/${location}.json`, `../data/repeaters/adms7/${location}`);
    }
  });

log('Program Parse Args');

program.parse(process.argv);

async function doIt(inFileName: string, outFileName: string): Promise<void> {
  const simplex: RepeaterStructured[] =
    (await readFromCsv<SimplexFrequency>('../data/simplex-frequencies.csv'))
      .map((map: SimplexFrequency): RepeaterStructured =>
        ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }) as RepeaterStructured)
      .filter((filter: RepeaterStructured): boolean => /FM|Digital|Mixed/i.test(filter.Callsign)); // TODO: Make a function and enum


  const repeaters: RepeaterStructured[] =
    JSON.parse((await readFileAsync(inFileName)).toString());

  // repeaters.forEach((each: RepeaterStructured): void => {
  //   each.Location.Distance = Math.min(
  //     gpsDistance([homePoint, [each.Location.Latitude, each.Location.Longitude]]),
  //     // gpsDistance([DenverPoint, [each.Location.Latitude, each.Location.Longitude]]),
  //     // gpsDistance([ColoradoSpringsPoint, [each.Location.Latitude, each.Location.Longitude]]),
  //   );
  // });

  repeaters.sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Location.Distance! - b.Location.Distance!);
  const unique: { [key: string]: boolean } = {};
  const mapped: Adms7[] = [
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
    .map((map: RepeaterStructured, index: number): Adms7 => ({ ...convertToRadio(map), Number: index + 1 }))
    .filter((filter: Adms7): boolean => {
      const name: string = `${filter.Receive} ${filter.Transmit} ${filter.ToneMode} ${filter.CTCSS} ${filter.DCS}`;
      if (unique[name]) {
        return false;
      }
      unique[name] = true;
      return true;
    })
    .concat([...new Array(500)].map((): Adms7 => ({ ClockShift: Adms7ClockShift.Off, Bank: Adms7Bank.A } as Adms7)))
    .slice(0, 500)
    .sort((a: Adms7, b: Adms7): number => parseFloat(a.CTCSS) - parseFloat(b.CTCSS))
    .sort((a: Adms7, b: Adms7): number => parseFloat(a.Receive) - parseFloat(b.Receive))
    .sort((a: Adms7, b: Adms7): number => parseFloat(a.CTCSS) - parseFloat(b.CTCSS))
    .sort((a: Adms7, b: Adms7): number => parseFloat(a.Receive) - parseFloat(b.Receive))
    .map((map: Adms7, index: number): Adms7 => ({ ...map, Number: index + 1 }));

  return writeToCsv(outFileName, mapped, false);
}

function convertToRadio(repeater: RepeaterStructured): Adms7 {
  const Name: string = `${buildName(repeater)} ${getRepeaterSuffix(repeater)}`;

  const Receive: string = repeater.Frequency.Output.toFixed(5);
  const Transmit: string = repeater.Frequency.Input.toFixed(5);
  const OffsetFrequency: number = repeater.Frequency.Input - repeater.Frequency.Output;
  const Offset: string = Math.abs(Math.round(OffsetFrequency * 100) / 100).toFixed(5);
  const TransmitSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Input);
  const ReceiveSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Output);
  const TransmitDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Input);
  const ReceiveDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Output);
  const Comment: string = buildComment(repeater);

  let ToneMode: Adms7ToneMode = Adms7ToneMode.Off;

  if (TransmitSquelchTone) {
    ToneMode = Adms7ToneMode.Tone_Enc; // "TONE ENC";
  } else if (TransmitDigitalTone) {
    ToneMode = Adms7ToneMode.DCS; // "DCS";
  }

  if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
    ToneMode = Adms7ToneMode.Tone_Sql; // "TONE SQL";
  } else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
    ToneMode = Adms7ToneMode.DCS; // "DCS";
  }

  const CTCSS: Adms7CtcssTone = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz') as Adms7CtcssTone;
  const DCS: Adms7DcsTone = buildDCS(TransmitDigitalTone) as Adms7DcsTone;

  return new Adms7({
    Receive,
    Transmit,
    Offset,
    Direction: convertOffsetDirection(OffsetFrequency),
    Name,
    ToneMode,
    CTCSS,
    DCS,
    Comment,
  });
}

function convertOffsetDirection(OffsetFrequency: number): Adms7OffsetDirection {
  if (OffsetFrequency === 0) {
    return Adms7OffsetDirection.Off;
  } else if (OffsetFrequency < 0) {
    return Adms7OffsetDirection.Minus;
  } else if (OffsetFrequency > 0) {
    return Adms7OffsetDirection.Plus;
  }
  log(chalk.red('ERROR'), 'convertOffsetDirection', 'unknown', OffsetFrequency);
  return Adms7OffsetDirection.Off;
}
