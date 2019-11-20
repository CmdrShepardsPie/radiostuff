import 'module-alias/register';

import { readFileAsync, writeToJsonAndCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { IRepeaterStructured, RepeaterStatus, RepeaterUse } from '@interfaces/i-repeater-structured';
import { ISimplexFrequency } from '@interfaces/i-simplex-frequency';
import { IYaesu, YaesuDirection, YaesuMode, YaesuToneMode } from '@interfaces/i-yaesu';
import gpsDistance, { Point } from 'gps-distance';

const log: (...msg: any[]) => void = createLog('Make Yaesu');

const yaesu: IYaesu = {
  Number: null as any,
  Receive: '',
  Transmit: '',
  Offset: (0).toFixed(5),
  Direction: 'OFF',
  Mode: 'FM',
  Name: '',
  ToneMode: 'OFF',
  CTCSS: '100 Hz',
  DCS: '023',
  UserCTCSS: '1500 Hz',
  Power: 'HIGH',
  Skip: 'OFF',
  Step: '25.0KHz',
  ClockShift: 0,
  Comment: '',
  Bank: 0,
};

const myPoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St

async function doIt(inFileName: string, outFileName: string): Promise<void> {
  const simplex: IRepeaterStructured[] =
    JSON.parse((await readFileAsync('data/frequencies.json')).toString())
      .map((map: ISimplexFrequency) =>
        ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
      .filter((filter: IRepeaterStructured) => /FM|Voice|Simplex/i.test(filter.Callsign));
  // .filter((filter: IRepeaterStructured) => !(/Data|Digital|Packet/i.test(filter.Callsign)));

  const repeaters: IRepeaterStructured[] =
    JSON.parse((await readFileAsync(inFileName)).toString());

  repeaters.forEach((each: IRepeaterStructured) => {
    each.Location.Distance = gpsDistance([myPoint, [each.Location.Latitude, each.Location.Longitude]]);
  });

  repeaters.sort((a: IRepeaterStructured, b: IRepeaterStructured) =>
    a.Location.Distance! > b.Location.Distance! ? 1 :
      a.Location.Distance! < b.Location.Distance! ? -1 : 0);
  const mapped: IYaesu[] = [
    ...simplex,
    ...repeaters
      .filter((filter: IRepeaterStructured) =>
        (filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
        // (filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
        (filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450))
      .filter((filter: IRepeaterStructured) =>
        (!filter.Digital || filter.Digital.YSF) &&
        filter.Status !== RepeaterStatus.OffAir &&
        filter.Use === RepeaterUse.Open),
  ]
    .map((map: IRepeaterStructured, index: number): IYaesu => ({ ...convertToRadio(map), Number: index + 1 }))
    .slice(0, 500)
    .sort((a: IYaesu, b: IYaesu) => parseFloat(a.Receive) - parseFloat(b.Receive))
    .map((map: IYaesu, index: number): IYaesu => ({ ...map, Number: index + 1 }));

  return writeToJsonAndCsv(outFileName, mapped, mapped, false);
}

function convertToRadio(repeater: IRepeaterStructured): IYaesu {
  let Name: string = '';

  if (repeater.Callsign) {
    Name += repeater.Callsign.trim();
    if (repeater.ID !== undefined) {
      Name = Name.substr(-3).trim().toUpperCase();
    }
  }

  if (repeater.Location && repeater.Location.Local) {
    Name += (Name ? ' ' : '') + repeater.Location.Local.trim().toLowerCase();
  }

  if (repeater.Frequency && repeater.Frequency.Output) {
    Name += (Name ? ' ' : '') + repeater.Frequency.Output.toString().trim();
  }

  Name = Name.replace(/[^0-9.a-zA-Z\/]/g, '').trim();
  Name = Name.substring(0, 7).trim();

  const Receive: string = repeater.Frequency.Output.toFixed(5);
  const Transmit: string = repeater.Frequency.Input.toFixed(5);
  const OffsetNumber: number = repeater.Frequency.Input - repeater.Frequency.Output;
  const Direction: YaesuDirection = OffsetNumber > 0 ? '+RPT' : OffsetNumber < 0 ? '-RPT' : 'OFF';
  const Offset: string = Math.abs(Math.round(OffsetNumber * 100) / 100).toFixed(5);
  const TransmitSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Input);
  const ReceiveSquelchTone: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Output);
  const TransmitDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Input);
  const ReceiveDigitalTone: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Output);
  let ToneMode: YaesuToneMode = 'OFF';
  const Mode: YaesuMode = 'FM';
  let Comment: string = `${repeater.StateID} ${repeater.ID} ${repeater.Location && repeater.Location.Distance && repeater.Location.Distance.toFixed(2)} ${repeater.Location && repeater.Location.State} ${repeater.Location && repeater.Location.County} ${repeater.Location && repeater.Location.Local} ${repeater.Callsign}`;
  Comment = Comment.replace(/undefined/g, ' ').replace(/\s+/g, ' ').trim();

  if (TransmitSquelchTone) {
    ToneMode = 'TONE ENC';
  } else if (TransmitDigitalTone) {
    ToneMode = 'DCS';
  }

  if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
    ToneMode = 'TONE SQL';
  } else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
    ToneMode = 'DCS';
  }

  const CTCSS: string = (TransmitSquelchTone || 100).toFixed(1) + ' Hz';
  const DCSNumber: number = (TransmitDigitalTone || 23);
  const DCS: string = DCSNumber < 100 ? '0' + DCSNumber : '' + DCSNumber;

  return {
    ...yaesu,
    Receive,
    Transmit,
    Offset,
    Direction,
    Name,
    ToneMode,
    CTCSS,
    DCS,
    Mode,
    Comment,
  };
}

async function start(): Promise<void> {
// const coFiles = (await readdirAsync("./repeaters/data/CO/")).map((f) => `data/CO/${f}`);
// const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `data/UT/${f}`);
// const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `data/NM/${f}`);
// const coGroups = (await readdirAsync("./repeaters/groups/CO/")).map((f) => `groups/CO/${f}`);
// const utGroups = (await readdirAsync("./repeaters/groups/UT/")).map((f) => `groups/UT/${f}`);
// const nmGroups = (await readdirAsync("./repeaters/groups/NM/")).map((f) => `groups/NM/${f}`);
// const allFiles = [...coFiles, ...utFiles, ...nmFiles, ...coGroups, ...utGroups, ...nmGroups].filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
// for (const file of allFiles) {
//   await doIt(file);
// }

// await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/yaesu/groups/CO/Colorado Springs - Call");
// await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/yaesu/CO/Colorado Springs");
  await doIt('data/repeaters/converted/CO.json', 'data/repeaters/yaesu/CO');
  // await doIt('data/repeaters/groups/combined/CO - Call.json', 'data/repeaters/yaesu/groups/CO - Call');
}

export default start();
