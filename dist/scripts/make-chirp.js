"use strict";
//
//
// import { readFileAsync, writeToJsonAndCsv } from '@helpers/fs-helpers';
// import { createLog } from '@helpers/log-helpers';
// import { IChirp } from '@interfaces/i-chirp';
// import { IRepeaterRaw } from '@interfaces/i-repeater-raw';
//
// const log: (...msg: any[]) => void = createLog('Make Chirp');
//
// const chirp: IChirp = {
//   Location: '' as any,
//   Name: '',
//   Frequency: '' as any,
//   Duplex: '',
//   Offset: '' as any,
//   Tone: '',
//   rToneFreq: '' as any,
//   cToneFreq: '' as any,
//   DtcsCode: '',
//   DtcsRxCode: '',
//   DtcsPolarity: 'NN',
//   Mode: 'FM',
//   TStep: 5,
//   Comment: ''
// };
//
// async function doIt(inFileName: string, outFileName: string): Promise<void> {
//   const all: IRepeaterRaw[] = JSON.parse((await readFileAsync('data/frequencies.json')).toString());
//
//   const fileData: Buffer = await readFileAsync(inFileName);
//   const repeaters: IRepeaterRaw[] = JSON.parse(fileData.toString()) as IRepeaterRaw[];
//
//   const mapped: IChirp[] = [...all.filter((d: IRepeaterRaw) => /Voice|Simplex/i.test(d.Comment!)), ...repeaters]
//     .filter((r: IRepeaterRaw) => (r.Frequency >= 144 && r.Frequency <= 148) || (r.Frequency >= 222 && r.Frequency <= 225) || (r.Frequency >= 420 && r.Frequency <= 450))
//     .filter((r: IRepeaterRaw) => all.find((f: IRepeaterRaw) => f.Frequency === r.Frequency) || (r.Call && r.Use === 'OPEN' && r['Op Status'] !== 'Off-Air'))
//     .map((d: IRepeaterRaw, i): IChirp => ({ ...makeRow(d), Location: i }))
//     .filter((d: IChirp) => d.Mode === 'FM' || d.Mode === 'NFM')
//     .slice(0, 128)
//     // .sort((a: IChirp, b: IChirp) => a.Frequency - b.Frequency)
//     .map((d: IChirp, index: number): IChirp => ({
//       ...d, Location: index, Mode:
//         Math.round(Math.round(d.Frequency * 100000) % Math.round(0.005 * 100000)) === 0 ? 'FM' :
//           Math.round(Math.round(d.Frequency * 100000) % Math.round(0.00625 * 100000)) === 0 ? 'NFM' :
//             'FM'
//     }));
//
//   return writeToJsonAndCsv(outFileName, mapped);
// }
//
// function makeRow(item: IRepeaterRaw): IChirp {
//   const DTCS: RegExp = /D(\d+)/;
//
// // Doesn't account for multiple digital modes, uses the first one it finds
//   let isDigital = Object.entries(item)
//     .filter(([key, value]: [string, string]) => /\s*(Enabled|Digital|Data)\s*/i.test(key) || /\s*(Enabled|Digital|Data)\s*/i.test(value))
//     .map(([key, value]: [string, string]) => (key.match(/(.*)\s*(Enabled|Digital|Data)\s*/i) || value.match(/(.*)\s*(Enabled|Digital|Data)/i) || [])[1])
//     .join('');
//   if (isDigital) {
// // log("IS DIGITAL", isDigital);
// // isDigital = isDigital.replace(/\s*(Enabled|Digital|Data)\s*/i, "").trim();
//     if (/YSF/i.test(isDigital)) {
//       isDigital = 'DIG';
//     } else if (/D-?STAR/i.test(isDigital)) {
//       isDigital = 'DV';
//     } else if (/DMR/i.test(isDigital)) {
//       isDigital = 'DMR';
//     } else if (/P-?25/i.test(isDigital)) {
//       isDigital = 'P25';
//     } else if (/NXDN/i.test(isDigital)) {
//       isDigital = 'FSK';
//     } else {
//       isDigital = 'MAYBE';
//     }
// // log("IS DIGITAL", isDigital);
//   }
//
//   const isNarrow: boolean = Object.entries(item)
//     .filter(([key, value]: [string, string]) => /Narrow/i.test(key) || /Narrow/i.test(value)).length > 0;
//
//   let Name = '';
//
//   if (item.Call) {
//     Name += (Name ? ' ' : '') + item.Call.toUpperCase().trim().substr(-3);
//   }
//
// // if (item.Mi !== undefined) {
// //   Name += " " + (item.Mi);
// // }
//   if (item.Location) {
//     Name += (Name ? ' ' : '') + item.Location.trim().toLowerCase();
//   }
//
//   if (item.Name) {
//     Name += (Name ? ' ' : '') + item.Name.trim();
//   }
//
//   if (item.Comment) {
//     Name += (Name ? ' ' : '') + item.Comment.trim();
//   }
//
//   if (item.Frequency) {
//     Name += (Name ? ' ' : '') + item.Frequency.toString().trim();
//   }
//
//   Name = Name.replace(/[^0-9.a-zA-Z\/]/g, '').trim();
//   Name = Name.substring(0, 7);
//
// // const Name =
// //
// //   ((
// //       (item.Call || "")
// //         .toLocaleUpperCase()
// //         .trim()
// //         .substr(-3)
// //     )
// //     + "" +
// //     (
// //       (item.Location || "")
// //         .toLocaleLowerCase()
// //         .trim()
// //     ))
// //   ||  item.Frequency
// //     .toString()
// //     .replace(/\s+/g, "");
//
//   const Frequency = item.Frequency;
//   const Duplex = item.Offset > 0 ? '+' : item.Offset < 0 ? '-' : '';
//   const Offset = Math.abs(item.Offset) || 0;
//   const UplinkTone; | string; = item['Uplink Tone'] || item.Tone;
//   const DownlinkTone; | string | undefined; = item['Downlink Tone'];
//   let cToneFreq = 0;
//   let rToneFreq = 0;
//   let DtcsCode = 0;
//   let DtcsRxCode = 0;
//   let Tone: '' | 'Tone' | 'DTCS' = '';
//   const Mode = isDigital ? isDigital : isNarrow ? 'NFM' : 'FM';
//   const Comment = `${item['ST/PR'] || ''} ${item.County || ''} ${item.Location || ''} ${item.Call || ''} ${item.Sponsor || ''} ${item.Affiliate || ''} ${item.Frequency} ${item.Use || ''} ${item['Op Status'] || ''} ${item.Comment || ''}`.replace(/\s+/g, ' ');
//   // Comment = Comment.trim().replace(",", "").substring(0, 31).trim();
//
//   if (typeof UplinkTone === 'number') {
//     rToneFreq = UplinkTone;
//     cToneFreq = UplinkTone;
//     Tone = 'Tone';
//   } else if (UplinkTone !== undefined) {
//     const d: RegExpExecArray | null = DTCS.exec(UplinkTone);
//     if (d && d[1]) {
//       const n = parseInt(d[1], 10);
//       if (!isNaN(n)) {
//         DtcsCode = n;
//         DtcsRxCode = n;
//         Tone = 'DTCS';
//       }
//     }
//   }
//
//   if (typeof DownlinkTone === 'number') {
//     cToneFreq = DownlinkTone;
// // Tone = "TSQL";
//   } else if (DownlinkTone !== undefined) {
//     const d: RegExpExecArray | null = DTCS.exec(DownlinkTone);
//     if (d && d[1]) {
//       const n = parseInt(d[1], 10);
//       if (!isNaN(n)) {
//         DtcsRxCode = n;
//         Tone = 'DTCS';
//       }
//     }
//   }
//
//   if (rToneFreq !== cToneFreq) {
// // Tone = "Cross";
//   }
//
//   cToneFreq = cToneFreq || 88.5;
//   rToneFreq = rToneFreq || 88.5;
//   DtcsCode = DtcsCode || 23;
//   DtcsRxCode = DtcsRxCode || 23;
//
// // log(chalk.green("Made Row"), row);
//   return {
//     ...chirp,
// // Location,
//     Name,
//     Frequency,
//     Duplex,
//     Offset,
//     rToneFreq,
//     cToneFreq,
//     DtcsCode,
//     DtcsRxCode,
//     Tone,
//     Mode,
//     Comment
//   };
// }
//
// async function start() {
// // const coFiles = (await readdirAsync("./repeaters/data/CO/")).map((f) => `data/CO/${f}`);
// // const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `data/UT/${f}`);
// // const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `data/NM/${f}`);
// // const coGroups = (await readdirAsync("./repeaters/groups/CO/")).map((f) => `groups/CO/${f}`);
// // const utGroups = (await readdirAsync("./repeaters/groups/UT/")).map((f) => `groups/UT/${f}`);
// // const nmGroups = (await readdirAsync("./repeaters/groups/NM/")).map((f) => `groups/NM/${f}`);
// // const allFiles = [...coFiles, ...utFiles, ...nmFiles, ...coGroups, ...utGroups, ...nmGroups].filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
// // for (const file of allFiles) {
// //   await doIt(file);
// // }
//
// // await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
// // await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
//   await doIt('data/repeaters/combined/CO.json', 'data/repeaters/chirp/combined/CO');
//   await doIt('data/repeaters/groups/combined/CO - Call.json', 'data/repeaters/chirp/groups/CO - Call');
// }
//
// export default start();
//# sourceMappingURL=make-chirp.js.map