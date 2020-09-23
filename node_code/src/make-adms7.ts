import 'module-alias/register';

import { writeToCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterStructured } from '@interfaces/repeater-structured';
import gpsDistance from 'gps-distance';
import {
  buildDCS,
  filterOutputFrequencies,
  filterMode,
  FrequencyBand,
  RadioCommon, loadRepeaters, loadSimplex,
  Mode, radioCommon
} from '@helpers/radio-helpers';
import chalk from 'chalk';
import {
  Adms7,
  Adms7Bank,
  Adms7ClockShift,
  Adms7OffsetDirection,
  Adms7ToneMode
} from '@interfaces/adms7';
import { program } from 'commander';
import { checkCoordinates, splitCoordinates } from '@helpers/helpers';
import { RtSystemsCtcssTone, RtSystemsDcsTone } from '@interfaces/rt-systems';

const log: (...msg: any[]) => void = createLog('Make Adms7');

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
        await doIt(latLong, `../data/repeaters/adms7/${ name }`);
      }
    }
  });

log('Program Parse Args');

program.parse(process.argv);

async function doIt(location: gpsDistance.Point, outFileName: string): Promise<void> {
  const simplex: RepeaterStructured[] = await loadSimplex(/FM|(Digital Simplex)|Mixed|Fusion/i);
  const repeaters: RepeaterStructured[] = await loadRepeaters(location);

  const mapped: Adms7[] = [
    ...simplex
      .filter(filterOutputFrequencies(
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      )),
    ...repeaters
      .filter(filterOutputFrequencies(
        FrequencyBand.$2_m,
        FrequencyBand.$70_cm,
      ))
      .filter(filterMode(Mode.FM, Mode.YSF)),
  ]
    .map((map: RepeaterStructured, index: number): Adms7 => ({ ...convertToRadio(map), Number: index + 1 }))
    .concat([...new Array(500)].map((): Adms7 => ({ ClockShift: Adms7ClockShift.Off, Bank: Adms7Bank.A } as Adms7)))
    .slice(0, 500)
    .map((map: Adms7, index: number): Adms7 => ({ ...map, Number: index + 1 }));

  return writeToCsv(outFileName, mapped, false);
}

function convertToRadio(repeater: RepeaterStructured): Adms7 {
  const {
    Name,
    TransmitSquelchTone,
    ReceiveSquelchTone,
    TransmitDigitalTone,
    ReceiveDigitalTone,
    Comment,
  }: RadioCommon = radioCommon(repeater);

  const Receive: string = repeater.Frequency.Output.toFixed(5);
  const Transmit: string = repeater.Frequency.Input.toFixed(5);
  const OffsetFrequency: number = repeater.Frequency.Input - repeater.Frequency.Output;
  const Offset: string = Math.abs(Math.round(OffsetFrequency * 100) / 100).toFixed(5);

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

  const CTCSS: RtSystemsCtcssTone = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz') as RtSystemsCtcssTone;
  const DCS: RtSystemsDcsTone = buildDCS(TransmitDigitalTone) as RtSystemsDcsTone;

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
