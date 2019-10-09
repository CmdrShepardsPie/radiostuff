import "module-alias/register";

import {readdirAsync, readFileAsync, writeToJsonAndCsv} from "@helpers/fs-helpers";
import {createLog} from "@helpers/log-helpers";
import {IRepeater} from "./modules/i.repeater";

const log: (...msg: any[]) => void = createLog("Make Yaesu");

type TDirection = "OFF" | "-RPT" | "+RPT" | "-/+";

// type Mode = "FM" | "NFM" | "AM";

// type TToneMode = "OFF" | "TONE ENC" | "TONE SQL" | "REV TONE" | "DCS" | "PR FREQ" | "PAGER";
type TToneMode = "OFF" | "TONE ENC" | "DCS";

// type Power = "HIGH";

// type Skip = "OFF";

interface IYaesu {
  Number: number;
  Receive: string;
  Transmit: string;
  Offset: string;
  Direction: TDirection;
  Mode: string;
  Name: string;
  ToneMode: TToneMode;
  CTCSS: string;
  DCS: string;
  UserCTCSS: "1500 Hz";
  Power: "HIGH";
  Skip: "OFF";
  Step: "25.0KHz";
  ClockShift: 0;
  Comment: string;
  Bank: 0; // 0 = A, 1 = B
}

const yaesu: IYaesu = {
  Number: "",
  Receive: "",
  Transmit: "",
  Offset: 0.6,
  Direction: "OFF",
  Mode: "FM",
  Name: "",
  ToneMode: "OFF",
  CTCSS: "100 Hz",
  DCS: "023",
  UserCTCSS: "1500 Hz",
  Power: "HIGH",
  Skip: "OFF",
  Step: "25.0KHz",
  ClockShift: 0,
  Comment: "",
  Bank: 0,
} as any;

const simplexFilter: (prev: IRepeater[], curr: IRepeater, index: number) => (IRepeater[]) = (prev: IRepeater[], curr: IRepeater, index: number): IRepeater[] => {
  const last: IRepeater = prev[prev.length - 1];
  if (last && last.Frequency === curr.Frequency) {
    if (last.Comment && curr.Comment) {
      last.Comment = last.Comment.substr(0, 3) + "/" + curr.Comment.substr(0, 3);
    }
    return prev;
  }
  return [...prev, curr];
};

async function doIt(inFileName: string, outFileName: string): Promise<void> {
// const APRS: IRepeater = {
//   Frequency: 144.390,
//   Name: "APRS",
// } as any;
// let twom: IRepeater[] = JSON.parse((await readFileAsync("data/2m.json")).toString());
// twom = twom
//   .sort((a, b) => a.Frequency - b.Frequency)
//   .reduce(simplexFilter, [] as IRepeater[]);

// let sevcm: IRepeater[] = JSON.parse((await readFileAsync("data/70cm.json")).toString());
// sevcm = sevcm
//   .sort((a, b) => a.Frequency - b.Frequency)
//   .reduce(simplexFilter, [] as IRepeater[]);

  const all: IRepeater[] = JSON.parse((await readFileAsync("data/frequencies.json")).toString());

  const fileData: Buffer = await readFileAsync(inFileName);
  const repeaters: IRepeater[] = JSON.parse(fileData.toString()) as IRepeater[];

  const mapped: IYaesu[] = [...all, ...repeaters]
    .filter((r: IRepeater) => (r.Frequency >= 144 && r.Frequency <= 148) || (r.Frequency >= 420 && r.Frequency <= 450))
    .filter((r: IRepeater) => all.find((f: IRepeater) => f.Frequency === r.Frequency) || (r.Call && r.Use === "OPEN" && r["Op Status"] !== "Off-Air"))
    .map((d: IRepeater, i: number): IYaesu => ({ ...makeRow(d), Number: i + 1 }))
    .filter((d: IYaesu) => d.Mode === "FM" || d.Mode === "NFM" || d.Mode === "MAYBE" || d.Mode === "DIG")
    .slice(0, 500)
    .sort((a: IYaesu, b: IYaesu) => parseFloat(a.Receive) - parseFloat(b.Receive))
    .map((d: IYaesu, i: number): IYaesu => ({ ...d, Number: i + 1, Mode:
        Math.round(Math.round(parseFloat(d.Receive) * 100000) % Math.round(0.005 * 100000)) === 0 ? "FM" :
          Math.round(Math.round(parseFloat(d.Receive) * 100000) % Math.round(0.00625 * 100000)) === 0 ? "NFM" :
            "FM",
    }));

  return await writeToJsonAndCsv(outFileName, mapped, mapped, false);
}

function makeRow(item: IRepeater): IYaesu {
  const DTCS: RegExp = /D(\d+)/;

// Doesn't account for multiple digital modes, uses the first one it finds
  let isDigital: string = Object.entries(item)
    .filter(([key, value]: [string, string]) => /\s*(Enabled|Digital|Data)\s*/i.test(key) || /\s*(Enabled|Digital|Data)\s*/i.test(value))
    .map(([key, value]: [string, string]) => (key.match(/(.*)\s*(Enabled|Digital|Data)\s*/i) || value.match(/(.*)\s*(Enabled|Digital|Data)/i) || [])[1])
    .join("");
  if (isDigital) {
// log("IS DIGITAL", isDigital);
// isDigital = isDigital.replace(/\s*(Enabled|Digital|Data)\s*/i, "").trim();
    if (/YSF/i.test(isDigital)) { isDigital = "DIG"; }
    else if (/D-?STAR/i.test(isDigital)) { isDigital = "DV"; }
    else if (/DMR/i.test(isDigital)) { isDigital = "DMR"; }
    else if (/P-?25/i.test(isDigital)) { isDigital = "P25"; }
    else if (/NXDN/i.test(isDigital)) { isDigital = "FSK"; }
    else { isDigital = "MAYBE"; }
// log("IS DIGITAL", isDigital);
  }

  const isNarrow: boolean = Object.entries(item)
    .filter(([key, value]: [string, string]) => /Narrow/i.test(key) || /Narrow/i.test(value)).length > 0;

  let Name: string = "";

  if (item.Call) {
    Name += (Name ? " " : "") + item.Call.toUpperCase().trim().substr(-3);
  }

// if (item.Mi !== undefined) {
//   Name += " " + (item.Mi);
// }
  if (item.Location) {
    Name += (Name ? " " : "") + item.Location.trim().toLowerCase();
  }

  if (item.Name) {
    Name += (Name ? " " : "") + item.Name.trim();
  }

  if (item.Comment) {
    Name += (Name ? " " : "") + item.Comment.trim();
  }

  if (item.Frequency) {
    Name += (Name ? " " : "") + item.Frequency.toString().trim();
  }

  Name = Name.replace(/[^0-9.a-zA-Z\/]/g, "").trim();
  Name = Name.substring(0, 7);

  const Receive: string = item.Frequency.toFixed(5);
  const Direction: TDirection = item.Offset > 0 ? "+RPT" : item.Offset < 0 ? "-RPT" : "OFF";
  const Offset: string = Math.abs(item.Offset || 0).toFixed(5);
  const Transmit: string = (item.Frequency + (item.Offset || 0)).toFixed(5);
  const UplinkTone: number | string = item["Uplink Tone"] || item.Tone;
  const DownlinkTone: number | string | undefined = item["Downlink Tone"];

  let CTCSS: string | number = "";
  let DCS: string | number  = "";

  let ToneMode: TToneMode = "OFF";
  const Mode: string = isDigital ? isDigital : isNarrow ? "NFM" : "FM";
  let Comment: string = `${item["ST/PR"] || ""} ${item.County || ""} ${item.Location || ""} ${item.Call || ""} ${item.Sponsor || ""} ${item.Affiliate || ""} ${item.Frequency} ${item.Use || ""} ${item["Op Status"] || ""} ${item.Comment || ""}`.replace(/\s+/g, " ");
  // Comment = Comment.trim().replace(",", "").substring(0, 31).trim();

  if (typeof UplinkTone === "number") {
    CTCSS = UplinkTone;
// ToneMode = "TONE SQL";
    ToneMode = "TONE ENC";
  } else if (UplinkTone !== undefined) {
    const d: RegExpExecArray | null = DTCS.exec(UplinkTone);
    if (d && d[1]) {
      const n: number = parseInt(d[1], 10);
      if (!isNaN(n)) {
        DCS = n;
        ToneMode = "DCS";
      }
    }
  }

  if (UplinkTone === DownlinkTone) {
    if (typeof DownlinkTone === "number") {
// CTCSS = DownlinkTone;
// ToneMode = "TONE SQL";
// ToneMode = "TONE ENC";
    } else if (DownlinkTone !== undefined) {
      const d: RegExpExecArray | null = DTCS.exec(DownlinkTone);
      if (d && d[1]) {
        const n: number = parseInt(d[1], 10);
        if (!isNaN(n)) {
// DCS = n;
// ToneMode = "DCS";
        }
      }
    }
  }

  CTCSS = ((typeof CTCSS === "number" && CTCSS) || 100).toFixed(1) + " Hz";
  DCS = (DCS || 23);
  DCS = DCS < 100 ? "0" + DCS : "" + DCS;

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
  await doIt("data/repeaters/combined/CO.json", "data/repeaters/yaesu/combined/CO");
  await doIt("data/repeaters/groups/combined/CO - Call.json", "data/repeaters/yaesu/groups/CO - Call");
}

export default start();
