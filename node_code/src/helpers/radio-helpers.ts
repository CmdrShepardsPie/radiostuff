import { RepeaterStatus, RepeaterStructured, RepeaterUse } from '@interfaces/repeater-structured';
import { getAllFilesInDirectory, readFileAsync, readFromCsv } from '@helpers/fs-helpers';
import { SimplexFrequency } from '@interfaces/simplex-frequency';
import gpsDistance from 'gps-distance';
import { RtSystemsOffsetFrequency } from '@interfaces/rt-systems';

export enum FrequencyBand {
  $160_m,
  $80_m,
  $60_m,
  $40_m,
  $30_m,
  $20_m,
  $17_m,
  $15_m,
  $12_m,
  $10_m,
  $6_m,
  $2_m,
  $1_25_m,
  $70_cm,
}

export enum Mode {
  FM,
  ATV,
  DMR,
  P25,
  DStar,
  YSF,
}

export interface RadioCommon {
  TransmitSquelchTone: number | undefined;
  TransmitDigitalTone: number | undefined;
  Comment: string;
  Transmit: number;
  OffsetFrequency: number;
  ReceiveDigitalTone: number | undefined;
  Receive: number;
  ReceiveSquelchTone: number | undefined;
  Name: string;
}

// SEMI-LIMITED BANDS - GENERAL CLASS
export function filterOutputFrequencies(...bands: FrequencyBand[]): (filter: RepeaterStructured) => boolean {
  return (filter: RepeaterStructured): boolean =>
    (bands.includes(FrequencyBand.$160_m) && filter.Frequency.Output >= 1.8 && filter.Frequency.Output <= 2.0) ||

    (bands.includes(FrequencyBand.$80_m) && filter.Frequency.Output >= 3.525 && filter.Frequency.Output <= 3.6 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||
    (bands.includes(FrequencyBand.$80_m) && filter.Frequency.Output >= 3.8 && filter.Frequency.Output <= 4.0) ||

    (bands.includes(FrequencyBand.$60_m) && filter.Frequency.Output >= 5.3305 && filter.Frequency.Output <= 5.405 && !filter.Callsign.includes('FM') && !filter.Callsign.includes('D-Star')) ||

    (bands.includes(FrequencyBand.$40_m) && filter.Frequency.Output >= 7.025 && filter.Frequency.Output <= 7.125 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||
    (bands.includes(FrequencyBand.$40_m) && filter.Frequency.Output >= 7.175 && filter.Frequency.Output <= 7.3) ||

    (bands.includes(FrequencyBand.$30_m) && filter.Frequency.Output >= 10.1 && filter.Frequency.Output <= 10.15 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||

    (bands.includes(FrequencyBand.$20_m) && filter.Frequency.Output >= 14.025 && filter.Frequency.Output <= 14.150 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||
    (bands.includes(FrequencyBand.$20_m) && filter.Frequency.Output >= 14.225 && filter.Frequency.Output <= 14.350) ||

    (bands.includes(FrequencyBand.$17_m) && filter.Frequency.Output >= 18.068 && filter.Frequency.Output <= 18.110 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||
    (bands.includes(FrequencyBand.$17_m) && filter.Frequency.Output >= 18.110 && filter.Frequency.Output <= 18.168) ||

    (bands.includes(FrequencyBand.$15_m) && filter.Frequency.Output >= 21.025 && filter.Frequency.Output <= 21.2 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||
    (bands.includes(FrequencyBand.$15_m) && filter.Frequency.Output >= 21.275 && filter.Frequency.Output <= 21.450) ||

    (bands.includes(FrequencyBand.$12_m) && filter.Frequency.Output >= 24.89 && filter.Frequency.Output <= 24.93 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||
    (bands.includes(FrequencyBand.$12_m) && filter.Frequency.Output >= 24.93 && filter.Frequency.Output <= 24.99) ||

    (bands.includes(FrequencyBand.$10_m) && filter.Frequency.Output >= 28 && filter.Frequency.Output <= 28.3 && (filter.Callsign.includes('CW') || filter.Callsign.includes('RTTY'))) ||
    (bands.includes(FrequencyBand.$10_m) && filter.Frequency.Output >= 28.3 && filter.Frequency.Output <= 29.7) ||

    (bands.includes(FrequencyBand.$6_m) && filter.Frequency.Output >= 50 && filter.Frequency.Output <= 50.1 && filter.Callsign.includes('CW')) ||
    (bands.includes(FrequencyBand.$6_m) && filter.Frequency.Output >= 50.1 && filter.Frequency.Output <= 54) ||

    (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Output >= 144 && filter.Frequency.Output <= 144.1 && filter.Callsign.includes('CW')) ||
    (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Output >= 144.1 && filter.Frequency.Output <= 148) ||

    (bands.includes(FrequencyBand.$1_25_m) && filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
    (bands.includes(FrequencyBand.$70_cm) && filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450);
}

export function filterInputFrequencies(...bands: FrequencyBand[]): (filter: RepeaterStructured) => boolean {
  return (filter: RepeaterStructured): boolean =>
    (bands.includes(FrequencyBand.$160_m) && filter.Frequency.Input >= 1.8 && filter.Frequency.Input <= 2.0) ||

    (bands.includes(FrequencyBand.$80_m) && filter.Frequency.Input >= 3.525 && filter.Frequency.Input <= 3.6) ||
    (bands.includes(FrequencyBand.$80_m) && filter.Frequency.Input >= 3.8 && filter.Frequency.Input <= 4.0) ||

    (bands.includes(FrequencyBand.$60_m) && filter.Frequency.Input >= 5.3305 && filter.Frequency.Input <= 5.405) ||

    (bands.includes(FrequencyBand.$40_m) && filter.Frequency.Input >= 7.025 && filter.Frequency.Input <= 7.125) ||
    (bands.includes(FrequencyBand.$40_m) && filter.Frequency.Input >= 7.175 && filter.Frequency.Input <= 7.3) ||

    (bands.includes(FrequencyBand.$30_m) && filter.Frequency.Input >= 10.1 && filter.Frequency.Input <= 10.15) ||

    (bands.includes(FrequencyBand.$20_m) && filter.Frequency.Input >= 14.025 && filter.Frequency.Input <= 14.150) ||
    (bands.includes(FrequencyBand.$20_m) && filter.Frequency.Input >= 14.225 && filter.Frequency.Input <= 14.350) ||

    (bands.includes(FrequencyBand.$17_m) && filter.Frequency.Input >= 18.068 && filter.Frequency.Input <= 18.168) ||

    (bands.includes(FrequencyBand.$15_m) && filter.Frequency.Input >= 21.025 && filter.Frequency.Input <= 21.2) ||
    (bands.includes(FrequencyBand.$15_m) && filter.Frequency.Input >= 21.275 && filter.Frequency.Input <= 21.450) ||

    (bands.includes(FrequencyBand.$12_m) && filter.Frequency.Input >= 24.89 && filter.Frequency.Input <= 24.99) ||
    (bands.includes(FrequencyBand.$10_m) && filter.Frequency.Input >= 28 && filter.Frequency.Input <= 29.7) ||
    (bands.includes(FrequencyBand.$6_m) && filter.Frequency.Input >= 50 && filter.Frequency.Input <= 54) ||
    (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Input >= 144 && filter.Frequency.Input <= 148) ||
    (bands.includes(FrequencyBand.$1_25_m) && filter.Frequency.Input >= 222 && filter.Frequency.Input <= 225) ||
    (bands.includes(FrequencyBand.$70_cm) && filter.Frequency.Input >= 420 && filter.Frequency.Input <= 450);
}


// FULL BANDS - EXTRA CLASS
// export function filterOutputFrequencies(...bands: FrequencyBand[]): (filter: RepeaterStructured) => boolean {
//   return (filter: RepeaterStructured): boolean =>
//     (bands.includes(FrequencyBand.$160_m) && filter.Frequency.Output >= 1.8 && filter.Frequency.Output <= 2.0) ||
//     (bands.includes(FrequencyBand.$80_m) && filter.Frequency.Output >= 3.5 && filter.Frequency.Output <= 4.0) ||
//     (bands.includes(FrequencyBand.$60_m) && filter.Frequency.Output >= 5.3305 && filter.Frequency.Output <= 5.405) ||
//     (bands.includes(FrequencyBand.$40_m) && filter.Frequency.Output >= 7.0 && filter.Frequency.Output <= 7.3) ||
//     (bands.includes(FrequencyBand.$30_m) && filter.Frequency.Output >= 10.1 && filter.Frequency.Output <= 10.15) ||
//     (bands.includes(FrequencyBand.$20_m) && filter.Frequency.Output >= 14.0 && filter.Frequency.Output <= 14.35) ||
//     (bands.includes(FrequencyBand.$17_m) && filter.Frequency.Output >= 18.068 && filter.Frequency.Output <= 18.168) ||
//     (bands.includes(FrequencyBand.$15_m) && filter.Frequency.Output >= 21.0 && filter.Frequency.Output <= 21.45) ||
//     (bands.includes(FrequencyBand.$12_m) && filter.Frequency.Output >= 24.89 && filter.Frequency.Output <= 24.99) ||
//     (bands.includes(FrequencyBand.$10_m) && filter.Frequency.Output >= 28 && filter.Frequency.Output <= 29.7) ||
//     (bands.includes(FrequencyBand.$6_m) && filter.Frequency.Output >= 50 && filter.Frequency.Output <= 54) ||
//     (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
//     (bands.includes(FrequencyBand.$1_25_m) && filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
//     (bands.includes(FrequencyBand.$70_cm) && filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450);
// }
//
// export function filterInputFrequencies(...bands: FrequencyBand[]): (filter: RepeaterStructured) => boolean {
//   return (filter: RepeaterStructured): boolean =>
//     (bands.includes(FrequencyBand.$160_m) && filter.Frequency.Input >= 1.8 && filter.Frequency.Input <= 2.0) ||
//     (bands.includes(FrequencyBand.$80_m) && filter.Frequency.Input >= 3.5 && filter.Frequency.Input <= 4.0) ||
//     (bands.includes(FrequencyBand.$60_m) && filter.Frequency.Input >= 5.3305 && filter.Frequency.Input <= 5.405) ||
//     (bands.includes(FrequencyBand.$40_m) && filter.Frequency.Input >= 7.0 && filter.Frequency.Input <= 7.3) ||
//     (bands.includes(FrequencyBand.$30_m) && filter.Frequency.Input >= 10.1 && filter.Frequency.Input <= 10.15) ||
//     (bands.includes(FrequencyBand.$20_m) && filter.Frequency.Input >= 14.0 && filter.Frequency.Input <= 14.35) ||
//     (bands.includes(FrequencyBand.$17_m) && filter.Frequency.Input >= 18.068 && filter.Frequency.Input <= 18.168) ||
//     (bands.includes(FrequencyBand.$15_m) && filter.Frequency.Input >= 21.0 && filter.Frequency.Input <= 21.45) ||
//     (bands.includes(FrequencyBand.$12_m) && filter.Frequency.Input >= 24.89 && filter.Frequency.Input <= 24.99) ||
//     (bands.includes(FrequencyBand.$10_m) && filter.Frequency.Input >= 28 && filter.Frequency.Input <= 29.7) ||
//     (bands.includes(FrequencyBand.$6_m) && filter.Frequency.Input >= 50 && filter.Frequency.Input <= 54) ||
//     (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Input >= 144 && filter.Frequency.Input <= 148) ||
//     (bands.includes(FrequencyBand.$1_25_m) && filter.Frequency.Input >= 222 && filter.Frequency.Input <= 225) ||
//     (bands.includes(FrequencyBand.$70_cm) && filter.Frequency.Input >= 420 && filter.Frequency.Input <= 450);
// }

export function filterDistance(distance: number): (filter: RepeaterStructured) => boolean {
  return (filter: RepeaterStructured): boolean => !filter.Location || filter.Location.Distance! < distance;
}

export function filterMode(...modes: Mode[]): (filter: RepeaterStructured) => boolean {
  return (filter: RepeaterStructured): boolean =>
    filter.Status !== RepeaterStatus.OffAir &&
    filter.Use === RepeaterUse.Open &&
    (
      (modes.includes(Mode.FM) && !filter.Digital) ||
      (modes.includes(Mode.ATV) && filter.Digital != null && filter.Digital.ATV != null) ||
      (modes.includes(Mode.DMR) && filter.Digital != null && filter.Digital.DMR != null) ||
      (modes.includes(Mode.P25) && filter.Digital != null && filter.Digital.P25 != null) ||
      (modes.includes(Mode.DStar) && filter.Digital != null && filter.Digital.DStar != null) ||
      (modes.includes(Mode.YSF) && filter.Digital != null && filter.Digital.YSF != null)
    );
}

export function filterMinimumRepeaterCount(count: number, repeaters: RepeaterStructured[]): (filter: RepeaterStructured) => boolean {
  return (filter: RepeaterStructured): boolean =>
    !!filter.Callsign && getRepeaterCount(filter.Callsign, repeaters) >= count;
}

export function buildName(repeater: RepeaterStructured): string {
  let Name: string = '';

  if (repeater.Callsign) {
    if (repeater.Location && repeater.Location.Local) {
      Name += repeater.Callsign.trim().substr(-3);
    } else {
      Name += repeater.Callsign.trim();
    }
  }
  if (repeater.Location && repeater.Location.Local) {
    if (Name) Name += ' ';
    Name += repeater.Location.Local.trim();
  }
  if (!Name && repeater.Frequency && repeater.Frequency.Output) {
    if (Name) Name += ' ';
    Name += repeater.Frequency.Output.toString().trim();
  }
  Name = Name.replace(/,\s+/g, ' ').replace(/,\s+/g, ' ').trim();
  Name = Name.substr(0, 32).trim();

  return Name;
}

export function getRepeaterSuffix(repeater: RepeaterStructured): string {
  let Name: string = '';
  if (!repeater.Digital && repeater.Location) {
    Name += 'F';
  }
  if (repeater.Digital && repeater.Digital.YSF) {
    Name += 'Y';
  }
  if (repeater.Digital && repeater.Digital.DStar) {
    Name += 'S';
  }
  if (repeater.Digital && repeater.Digital.ATV) {
    Name += 'T';
  }
  if (repeater.Digital && repeater.Digital.DMR) {
    Name += 'M';
  }
  if (repeater.Digital && repeater.Digital.P25) {
    Name += 'P';
  }
  if (repeater.VOIP && repeater.VOIP.Wires) {
    Name += 'W';
  }
  if (repeater.VOIP && repeater.VOIP.AllStar) {
    Name += 'L';
  }
  if (repeater.VOIP && repeater.VOIP.EchoLink) {
    Name += 'E';
  }
  if (repeater.VOIP && repeater.VOIP.IRLP) {
    Name += 'I';
  }
  return Name;
}

export function getRepeaterCount(name: string, all: RepeaterStructured[]): number {
  return all.filter((a: RepeaterStructured): boolean => a.Callsign.trim() === name).length;
}

export function buildComment(repeater: RepeaterStructured): string {
  let Comment: string = `${repeater.StateID} ${repeater.ID} ${repeater.Location && (repeater.Location.Distance != null) && repeater.Location.Distance.toFixed(2) || ''} ${repeater.Location && repeater.Location.State || ''} ${repeater.Location && repeater.Location.County || ''} ${repeater.Location && repeater.Location.Local || ''} ${repeater.Callsign}`;
  Comment = Comment.replace(/undefined/g, ' ').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  return Comment;
}

export function buildDCS(code: number | undefined): string {
  const DCSa: string[] = (code || 23).toString().split('');
  const DCS: string[] = ['0', '0', '0'];
  DCS.splice(DCS.length - DCSa.length, DCSa.length, ...DCSa);
  return DCS.join('');
}

export function sortStructuredRepeaters(repeaters: RepeaterStructured[]): RepeaterStructured[] {
  return repeaters
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Callsign > b.Callsign ? 1 : a.Callsign < b.Callsign ? - 1 : 0)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.DigitalTone && a.DigitalTone.Input || 0) - (b.DigitalTone && b.DigitalTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => (a.SquelchTone && a.SquelchTone.Input || 0) - (b.SquelchTone && b.SquelchTone.Input || 0))
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Frequency.Input - b.Frequency.Input)
    .sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Location.Distance! - b.Location.Distance!);
}

export async function loadSimplex(filterSimplex: RegExp): Promise<RepeaterStructured[]> {
  return (await readFromCsv<SimplexFrequency>('../data/simplex-frequencies.csv'))
    .map((map: SimplexFrequency): RepeaterStructured =>
      ({
        Callsign: map.Name,
        Frequency: {
          Output: map.Frequency,
          Input: map.Input || map.Frequency,
        },
        ...(map.Tone ? {SquelchTone: {
            Input: map.Tone
          }} : {})
      }) as RepeaterStructured)
    .filter((filter: RepeaterStructured): boolean => filterSimplex.test(filter.Callsign)); // TODO: Make a function and enum
}

export async function loadRepeaters(location: gpsDistance.Point): Promise<RepeaterStructured[]> {
  const files: string[] = await getAllFilesInDirectory('../data/repeaters/converted/json', 'json', 1);

  return sortStructuredRepeaters(
    await Promise.all(
      files.map(async (file: string): Promise<RepeaterStructured> => {
        const fileBuffer: Buffer = await readFileAsync(file);
        const fileString: string = fileBuffer.toString();
        const fileData: RepeaterStructured = JSON.parse(fileString);
        fileData.Location.Distance = Math.round(gpsDistance([location, [fileData.Location.Latitude, fileData.Location.Longitude]]));
        return fileData;
      })
    )
  );
}

export function radioCommon(repeater: RepeaterStructured): RadioCommon {
  const Name: string = `${buildName(repeater)}`;
  const Receive: number = repeater.Frequency.Output;
  const Transmit: number = repeater.Frequency.Input;
  const OffsetFrequency: number = repeater.Frequency.Input - repeater.Frequency.Output;
  const TransmitSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Input);
  const ReceiveSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Output);
  const TransmitDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Input);
  const ReceiveDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Output);
  const Comment: string = buildComment(repeater);
  return {
    Name,
    Receive,
    Transmit,
    OffsetFrequency,
    TransmitSquelchTone,
    ReceiveSquelchTone,
    TransmitDigitalTone,
    ReceiveDigitalTone,
    Comment,
  };
}

export function convertOffsetFrequency(offsetFrequency: number): RtSystemsOffsetFrequency {
  const roundFrequency: number = Math.abs(Math.round(offsetFrequency * 10)) / 10;
  switch (roundFrequency) {
    case 0:
      return RtSystemsOffsetFrequency.None;
    case 0.1:
      return RtSystemsOffsetFrequency.$100_kHz;
    case 0.4:
      return RtSystemsOffsetFrequency.$400_kHz;
    case 0.5:
      return RtSystemsOffsetFrequency.$500_kHz;
    case 0.6:
      return RtSystemsOffsetFrequency.$600_kHz;
    case 1:
      return RtSystemsOffsetFrequency.$1_MHz;
    case 1.6:
      return RtSystemsOffsetFrequency.$1_60_MHz;
    case 2.5:
      return RtSystemsOffsetFrequency.$2_50_MHz;
    case 3:
      return RtSystemsOffsetFrequency.$3_MHz;
    case 5:
      return RtSystemsOffsetFrequency.$5_MHz;
    case 5.05:
      return RtSystemsOffsetFrequency.$5_05_MHz;
    case 7.6:
      return RtSystemsOffsetFrequency.$7_60_MHz;
  }
  return RtSystemsOffsetFrequency.None;
}
