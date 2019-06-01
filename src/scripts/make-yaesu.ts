import "module-alias/register";

import {readdirAsync, readFileAsync, writeToJsonAndCsv} from "@helpers/fs-helpers";
import {createLog} from "@helpers/log-helpers";
import {IRepeater} from "./modules/i.repeater";

const log = createLog("Make Yaesu");

type TDirection = "OFF" | "-RPT" | "+RPT" | "-/+";

// type Mode = "FM" | "NFM" | "AM";

type TToneMode = "OFF" | "TONE ENC" | "TONE SQL" | "REV TONE" | "DCS" | "PR FREQ" | "PAGER";

// type Power = "HIGH";

// type Skip = "OFF";

interface IYaesu {
  Number: number;
  Receive: number;
  Transmit: number;
  Offset: number;
  Direction: TDirection;
  Mode: "FM";
  Name: string;
  ToneMode: TToneMode;
  CTCSS: string;
  DCS: number;
  UserCTCSS: "1500 Hz";
  Power: "LOW";
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
  Power: "LOW",
  Skip: "OFF",
  Step: "25.0KHz",
  ClockShift: 0,
  Comment: "",
  Bank: 0,
} as any;

async function doIt(inFileName: string, outFileName: string) {
  const APRS: IRepeater = {
    Frequency: 144.390,
    Name: "APRS",
  } as any;
  let twom: IRepeater[] = JSON.parse((await readFileAsync("data/2m.json")).toString());
  twom = twom.sort((a, b) => a.Frequency - b.Frequency);
  let sevcm: IRepeater[] = JSON.parse((await readFileAsync("data/70cm.json")).toString());
  sevcm = sevcm.sort((a, b) => a.Frequency - b.Frequency);
  const fileData: IRepeater[] = JSON.parse((await readFileAsync(inFileName)).toString());
  const repeaters: IRepeater[] = [APRS, ...twom, ...sevcm, ...fileData];

  const mapped = repeaters
    .filter((r) => (r.Frequency > 100 && r.Frequency < 200) || (r.Frequency > 400 && r.Frequency < 500))
    .map((d, i) => ({ ...makeRow(d), Number: i + 1 }))
    .slice(0, 500);

  return await writeToJsonAndCsv(outFileName, mapped, mapped, false);
}

function makeRow(item: IRepeater) {
  const DTCS = /D(\d+)/;

  let Name = "";
  if (item.Call) {
    Name += (item.Call || "")
      .toLocaleUpperCase()
      .trim()
      .substr(-3)
      .trim();
  }
  // if (item.Mi !== undefined) {
  //   Name += " " + (item.Mi);
  // }
  if (item.Location) {
    Name += (item.Location || "")
      .toLocaleLowerCase()
      .trim();
  }

  if (!Name) {
    if (item.Name) {
      Name = item.Name;
    } else {
      Name += item.Frequency.toString().trim();
      if (item.Comment) {
        Name += item.Comment.trim();
      }
    }
  }

  Name = Name.replace(/[^0-9.a-zA-Z ]/g, "").trim();
  Name = Name.substring(0, 7);

  const Receive = item.Frequency.toFixed(5);
  const Direction = item.Offset > 0 ? "+RPT" : item.Offset < 0 ? "-RPT" : "OFF";
  const Offset = Math.abs(item.Offset || 0).toFixed(5);
  const Transmit = (item.Frequency + (item.Offset || 0)).toFixed(5);
  const UplinkTone = item["Uplink Tone"] || item.Tone;

  let CTCSS: any = "";
  let DCS: any = "";

  let ToneMode = "OFF";

  let Comment = `${item["ST/PR"] || ""} ${item.County || ""} ${item.Location || ""} ${item.Call || ""} ${item.Sponsor || ""} ${item.Affiliate || ""} ${item.Frequency} ${item.Use || ""} ${item["Op Status"] || ""}`.replace(/\s+/g, " ");
  Comment = Comment.replace(",", "").substring(0, 31);

  if (typeof UplinkTone === "number") {
    CTCSS = UplinkTone;
    ToneMode = "TONE ENC";
  } else if (UplinkTone !== undefined) {
    const d = DTCS.exec(UplinkTone);
    if (d && d[1]) {
      const n = parseInt(d[1], 10);
      if (!isNaN(n)) {
        DCS = n;
        ToneMode = "DCS";
      }
    }
  }

  CTCSS = (CTCSS || 100).toFixed(1) + " Hz";
  DCS = (DCS || 23);
  DCS = DCS < 100 ? "0" + DCS : DCS;

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
    Comment,
  };
}

async function start() {
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
