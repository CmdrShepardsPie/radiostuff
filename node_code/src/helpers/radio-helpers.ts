import { RepeaterStructured, RepeaterStatus, RepeaterUse } from '@interfaces/repeater-structured';

export enum FrequencyBand {
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

export function filterFrequencies(...bands: FrequencyBand[]): (filter: RepeaterStructured) => boolean {
  return (filter: RepeaterStructured): boolean =>
    (bands.includes(FrequencyBand.$10_m) && filter.Frequency.Output >= 28 && filter.Frequency.Output <= 29.7) ||
    (bands.includes(FrequencyBand.$6_m) && filter.Frequency.Output >= 50 && filter.Frequency.Output <= 54) ||
    (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
    (bands.includes(FrequencyBand.$1_25_m) && filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
    (bands.includes(FrequencyBand.$70_cm) && filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450);
}

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
      (
        modes.includes(Mode.YSF) &&
        (
          (filter.Digital != null && filter.Digital.YSF != null) ||
          (filter.VOIP != null && filter.VOIP.Wires != null)
        )
      )
    );
}

export function filterMinimumRepeaterCount(count: number, repeaters: RepeaterStructured[]): (filter: RepeaterStructured) => boolean {
  return (filter: RepeaterStructured): boolean =>
    !!filter.Callsign && getRepeaterCount(filter.Callsign, repeaters) >= count;
}

export function buildName(repeater: RepeaterStructured): string {
  let Name: string = '';

  if (repeater.Callsign) {
    Name += repeater.Callsign.trim();
  } else if (repeater.Location && repeater.Location.Local) {
    Name += repeater.Location.Local.trim();
  } else if (repeater.Frequency && repeater.Frequency.Output) {
    Name += repeater.Frequency.Output.toString().trim();
  }

  // Name += repeater.Frequency.Output.toString().trim().substr(1, 6);
  // if (repeater.SquelchTone != null && repeater.SquelchTone.Input != null) {
  //   Name += " " + repeater.SquelchTone.Input.toString().trim().substr(0, 6);
  // }
  // if (repeater.DigitalTone != null && repeater.DigitalTone.Input != null) {
  //   Name += " " + repeater.DigitalTone.Input.toString().trim().substr(0, 6);
  // }
  Name = Name.replace(/[^0-9.a-zA-Z \/]/g, ' ').trim();
  // Name = Name.replace(/[^0-9 ]/g, "").trim();
  Name = Name.replace(/,/g, '').replace(/\s+/g, ' ').trim();
  Name = Name.substr(0, 16).trim();

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
  if (repeater.Digital && repeater.Digital.ATV) {
    Name += 'T';
  }
  if (repeater.Digital && repeater.Digital.DMR) {
    Name += 'M';
  }
  if (repeater.Digital && repeater.Digital.DStar) {
    Name += 'S';
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
