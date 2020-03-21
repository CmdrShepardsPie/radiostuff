import "module-alias/register";

import { readFileAsync, writeToJsonAndCsv } from "@helpers/fs-helpers";
import { createLog } from "@helpers/log-helpers";
import { IRepeaterStructured } from "@interfaces/i-repeater-structured";
import { ISimplexFrequency } from "@interfaces/i-simplex-frequency";
import {
  Adms400,
  Adms400CtcssTone,
  Adms400DcsTone,
  Adms400OffsetDirection,
  Adms400OffsetFrequency,
  Adms400ToneMode,
  IAdms400,
} from "@interfaces/i-adms400";
import gpsDistance, { Point } from "gps-distance";
import chalk from "chalk";
import {
  buildComment,
  buildDCS,
  buildName,
  filterDistance,
  filterFrequencies,
  filterMode,
  filterMinimumRepeaterCount,
  FrequencyBand,
  Mode, getRepeaterSuffix
} from "@helpers/radio-helpers";

const log: (...msg: any[]) => void = createLog("Make Adms400");

const homePoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St
const DenverPoint: Point = [39.742043, -104.991531];
const ColoradoSpringsPoint: Point = [38.846127, -104.800644];

async function doIt(inFileName: string, outFileName: string): Promise<void> {
  const simplex: IRepeaterStructured[] =
    JSON.parse((await readFileAsync("../data/frequencies.json")).toString())
      .map((map: ISimplexFrequency): IRepeaterStructured =>
        ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }) as IRepeaterStructured)
      .filter((filter: IRepeaterStructured): boolean => /FM|Voice|Simplex/i.test(filter.Callsign));
  // .filter((filter: IRepeaterStructured) => !(/Data|Digital|Packet/i.test(filter.Callsign)));

  const repeaters: IRepeaterStructured[] =
    JSON.parse((await readFileAsync(inFileName)).toString());

  repeaters.forEach((each: IRepeaterStructured): void => {
    each.Location.Distance = Math.min(
      gpsDistance([homePoint, [each.Location.Latitude, each.Location.Longitude]]),
      // gpsDistance([DenverPoint, [each.Location.Latitude, each.Location.Longitude]]),
      // gpsDistance([ColoradoSpringsPoint, [each.Location.Latitude, each.Location.Longitude]]),
    );
  });

  repeaters.sort((a: IRepeaterStructured, b: IRepeaterStructured): number => a.Location.Distance! - b.Location.Distance!);

  const mapped: IAdms400[] = [
    ...simplex
      .filter(filterFrequencies(FrequencyBand.$2_m, FrequencyBand.$70_cm)),
    ...repeaters
      // .filter(filterMinimumRepeaterCount(3, repeaters))
      .filter(filterFrequencies(FrequencyBand.$2_m, FrequencyBand.$70_cm))
      .filter(filterDistance(100))
      .filter(filterMode(Mode.FM, Mode.YSF)),
  ]
    .map((map: IRepeaterStructured, index: number): IAdms400 => ({ ...convertToRadio(map), "Channel Number": index + 1 }))
    .slice(0, 500)
    .sort((a: IAdms400, b: IAdms400): number => a["Receive Frequency"] - b["Receive Frequency"])
    .map((map: IAdms400, index: number): IAdms400 => ({ ...map, "Channel Number": index + 1 }));

  return writeToJsonAndCsv(outFileName, mapped, mapped);
}

function convertToRadio(repeater: IRepeaterStructured): IAdms400 {
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
    ToneMode = Adms400ToneMode.DCS; // "DCS";
  }

  if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
    ToneMode = Adms400ToneMode.T_Sql; // "TONE SQL";
  } else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
    // ToneMode = Adms400ToneMode.T_DCS; // "DCS";
  }

  const CTCSS: Adms400CtcssTone = ((TransmitSquelchTone || 100).toFixed(1) + " Hz") as Adms400CtcssTone;
  const DCS: Adms400DcsTone = buildDCS(TransmitDigitalTone) as Adms400DcsTone;

  return new Adms400({
    // "Channel Number": number;
    "Receive Frequency": Receive.toFixed(5) as any,
    "Transmit Frequency": Transmit.toFixed(5) as any,
    "Offset Frequency": convertOffsetFrequency(OffsetFrequency),
    "Offset Direction": convertOffsetDirection(OffsetFrequency),
    // "Operating Mode": Adms400OperatingMode,
    Name,
    // "Show Name": Adms400ShowName,
    "Tone Mode": ToneMode,
    CTCSS,
    DCS,
    // "Tx Power": Adms400TxPower,
    // Skip: Adms400Skip,
    // Step: Adms400Step,
    // "Clock Shift": Adms400ClockShift,
    Comment,
    // "User CTCSS": Adms400UserCtcss,
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
      return Adms400OffsetFrequency.$1_00_MHz;
    case 1.6:
      return Adms400OffsetFrequency.$1_60_MHz;
    case 3:
      return Adms400OffsetFrequency.$3_00_MHz;
    case 5:
      return Adms400OffsetFrequency.$5_00_MHz;
    case 7.6:
      return Adms400OffsetFrequency.$7_60_MHz;
  }
  log(chalk.red("ERROR"), "convertOffsetFrequency", "unknown", OffsetFrequency);
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
  log(chalk.red("ERROR"), "convertOffsetDirection", "unknown", OffsetFrequency);
  return Adms400OffsetDirection.Simplex;
}

export = doIt("../data/repeaters/converted/CO.json", "../data/repeaters/adms400/CO");
