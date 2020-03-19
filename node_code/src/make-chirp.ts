import 'module-alias/register';

import { readFileAsync, writeToJsonAndCsv } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { ChirpDuplex, ChirpMode, ChirpTone, IChirp } from '@interfaces/i-chirp';
import { IRepeaterStructured, RepeaterStatus, RepeaterUse } from '@interfaces/i-repeater-structured';
import { ISimplexFrequency } from '@interfaces/i-simplex-frequency';
import gpsDistance, { Point } from 'gps-distance';

const log: (...msg: any[]) => void = createLog('Make Chirp');

const chirp: IChirp = {
  Location: null as any,
  Name: '',
  Frequency: null as any,
  Duplex: '',
  Offset: null as any,
  Tone: '',
  rToneFreq: null as any,
  cToneFreq: null as any,
  DtcsCode: null as any,
  DtcsRxCode: null as any,
  DtcsPolarity: 'NN',
  Mode: 'FM',
  TStep: 5,
  Comment: '',
};

const myPoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St
// const myPoint: Point = [39.742043, -104.991531]; // Denver

async function doIt(inFileName: string, outFileName: string): Promise<void> {
  const simplex: IRepeaterStructured[] =
    JSON.parse((await readFileAsync('../data/frequencies.json')).toString())
      .map((map: ISimplexFrequency) =>
        ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
      .filter((filter: IRepeaterStructured) => /FM|Voice|Simplex/i.test(filter.Callsign))
      .filter((filter: IRepeaterStructured) => !(/Data|Digital|Packet/i.test(filter.Callsign)));

  const repeaters: IRepeaterStructured[] =
    JSON.parse((await readFileAsync(inFileName)).toString());

  repeaters.forEach((each: IRepeaterStructured) => {
    each.Location.Distance = gpsDistance([myPoint, [each.Location.Latitude, each.Location.Longitude]]);
  });

  repeaters.sort((a: IRepeaterStructured, b: IRepeaterStructured) =>
    a.Location.Distance! > b.Location.Distance! ? 1 :
      a.Location.Distance! < b.Location.Distance! ? -1 : 0);
  const mapped: IChirp[] = [
    ...simplex,
    ...repeaters
      .filter((filter: IRepeaterStructured) =>
        (filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
        (filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
        (filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450))
      .filter((filter: IRepeaterStructured) =>
        !filter.Digital &&
        filter.Status !== RepeaterStatus.OffAir &&
        filter.Use === RepeaterUse.Open),
  ]
    .map((map: IRepeaterStructured, index: number): IChirp => ({ ...convertToRadio(map), Location: index }));

  const short: IChirp[] = mapped
    .slice(0, 128)
    // .sort((a: IChirp, b: IChirp) => a.Frequency - b.Frequency)
    .map((map: IChirp, index: number): IChirp => ({ ...map, Location: index }));

  const long: IChirp[] = mapped
    .slice(0, 200)
    // .sort((a: IChirp, b: IChirp) => a.Frequency - b.Frequency)
    .map((map: IChirp, index: number): IChirp => ({ ...map, Location: index }));

  await writeToJsonAndCsv(outFileName + '-short', short);
  await writeToJsonAndCsv(outFileName + '-long', long);
}

function convertToRadio(repeater: IRepeaterStructured): IChirp {
  let Name: string = '';

  if (repeater.Callsign) {
    Name += repeater.Callsign.trim();
  }

  if (repeater.Location && repeater.Location.Local) {
    Name += (Name ? ' ' : '') + repeater.Location.Local.trim();
  }

  if (repeater.Frequency && repeater.Frequency.Output) {
    Name += (Name ? ' ' : '') + repeater.Frequency.Output.toString().trim();
  }

  Name = Name.replace(/[^0-9.a-zA-Z \/]/g, '').trim();
  Name = Name.replace(/[ ]+/g, ' ').trim();
  Name = Name.substr(0, 8).trim();

  const Frequency: number = repeater.Frequency.Output;
  let Offset: number = repeater.Frequency.Input - repeater.Frequency.Output;
  const Duplex: ChirpDuplex = Offset > 0 ? '+' : Offset < 0 ? '-' : '';
  Offset = Math.abs(Math.round(Offset * 100) / 100);
  let rToneFreq: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Input);
  let cToneFreq: number | undefined = (repeater.SquelchTone && repeater.SquelchTone.Output);
  let DtcsCode: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Input);
  let DtcsRxCode: number | undefined = (repeater.DigitalTone && repeater.DigitalTone.Output);
  let Tone: ChirpTone = '';
  const Mode: ChirpMode = 'FM';
  let Comment: string = `${repeater.StateID} ${repeater.ID} ${repeater.Location && repeater.Location.Distance && repeater.Location.Distance.toFixed(2)} ${repeater.Location && repeater.Location.State} ${repeater.Location && repeater.Location.County} ${repeater.Location && repeater.Location.Local} ${repeater.Callsign}`;
  Comment = Comment.replace(/undefined/g, ' ').replace(/\s+/g, ' ').trim();
  // `${item['ST/PR'] || ''} ${item.County || ''} ${item.Location || ''} ${item.Call || ''} ${item.Sponsor || ''} ${item.Affiliate || ''} ${item.Frequency} ${item.Use || ''} ${item['Op Status'] || ''} ${item.Comment || ''}`.replace(/\s+/g, ' ');
  // Comment = Comment.trim().replace(",", "").substring(0, 31).trim();

  if (rToneFreq) {
    Tone = 'Tone';
  } else if (DtcsCode) {
    Tone = 'DTCS';
  }

  if (cToneFreq) {
    Tone = 'TSQL';
  } else if (DtcsRxCode) {
    Tone = 'DTCS';
  }

  if ((rToneFreq && cToneFreq && (rToneFreq !== cToneFreq))) {
    Tone = 'Cross';
  }

  cToneFreq = cToneFreq || 88.5;
  rToneFreq = rToneFreq || 88.5;
  DtcsCode = DtcsCode || 23;
  DtcsRxCode = DtcsRxCode || 23;

// log(chalk.green("Made Row"), row);
  return {
    ...chirp,
// Location,
    Name,
    Frequency,
    Duplex,
    Offset,
    rToneFreq,
    cToneFreq,
    DtcsCode,
    DtcsRxCode,
    Tone,
    Mode,
    Comment,
  };
}

async function start(): Promise<void> {
// const coFiles = (await readdirAsync("./repeaters/data/CO/")).map((f) => `../data/CO/${f}`);
// const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `../data/UT/${f}`);
// const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `../data/NM/${f}`);
// const coGroups = (await readdirAsync("./repeaters/groups/CO/")).map((f) => `groups/CO/${f}`);
// const utGroups = (await readdirAsync("./repeaters/groups/UT/")).map((f) => `groups/UT/${f}`);
// const nmGroups = (await readdirAsync("./repeaters/groups/NM/")).map((f) => `groups/NM/${f}`);
// const allFiles = [...coFiles, ...utFiles, ...nmFiles, ...coGroups, ...utGroups, ...nmGroups].filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
// for (const file of allFiles) {
//   await doIt(file);
// }

// await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
// await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
  await doIt('../data/repeaters/converted/CO.json', '../data/repeaters/chirp/CO');
  // await doIt('../data/repeaters/groups/combined/CO - Call.json', '../data/repeaters/chirp/groups/CO - Call');
}

export default start();
