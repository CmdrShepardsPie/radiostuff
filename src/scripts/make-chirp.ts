import "module-alias/register";

import {readdirAsync, readFileAsync, writeToJsonAndCsv} from "@helpers/fs-helpers";
import {createLog} from "@helpers/log-helpers";
import {IRepeater} from "./modules/i.repeater";

const log = createLog("Make Chirp");

interface IChirp {
  Location: number;
  Name: string;
  Frequency: number;
  Duplex: string;
  Offset: number;
  Tone: string;
  rToneFreq: number;
  cToneFreq: number;
  DtcsCode: number;
  DtcsRxCode: number;
  DtcsPolarity: string;
  Mode: string;
  TStep: number;
  Comment: string;
  [index: string]: any;
}

const chirp = {
  Location: "",
  Name: "",
  Frequency: "",
  Duplex: "",
  Offset: "",
  Tone: "",
  rToneFreq: "",
  cToneFreq: "",
  DtcsCode: "",
  DtcsRxCode: "",
  DtcsPolarity: "NN",
  Mode: "FM",
  TStep: 5,
  Comment: "",
};

async function doIt(inFileName: string, outFileName: string) {
  const fileData = await readFileAsync(inFileName);
  const repeaters = JSON.parse(fileData.toString()) as IRepeater[];

  const mapped = repeaters
    // .filter((r) => r.Call && r.Use === "OPEN" && r["Op Status"] !== "Off-Air")
    .map((d, i) => ({ ...makeRow(d), Location: i }));

  return await writeToJsonAndCsv(outFileName, mapped);
}

function makeRow(item: IRepeater) {
  const DTCS = /D(\d+)/;

  const isDigital = Object.entries(item).filter((a) => /Enabled/.test(a[0])).length > 0;
  const isNarrow = Object.entries(item).filter((a) => /Narrow/i.test(a[1] as string)).length > 0;

  const Name =
    // item.Frequency
    //   .toString()
    item.Call
      .toLocaleUpperCase()
      .trim()
      .substr(-3)
    + "" +
    item.Location
      .replace(" ", "")
      .toLocaleLowerCase()
      .trim();

  const Frequency = item.Frequency;
  const Duplex = item.Offset > 0 ? "+" : item.Offset < 0 ? "-" : "";
  const Offset = Math.abs(item.Offset);
  const UplinkTone = item["Uplink Tone"] || item.Tone;
  const DownlinkTone = item["Downlink Tone"];
  let cToneFreq: any = "";
  let rToneFreq: any = "";
  let DtcsCode: any = "";
  let DtcsRxCode: any = "";
  let Tone = "";
  const Mode = isDigital ? "DIG" : isNarrow ? "NFM" : "FM";
  const Comment = `${item["ST/PR"]} ${item.County} ${item.Location} ${item.Call} ${item.Frequency} ${item.Use || ""} ${item["Op Status"] || ""}`;

  if (typeof UplinkTone === "number") {
    rToneFreq = UplinkTone;
    cToneFreq = UplinkTone;
    Tone = "Tone";
  } else if (UplinkTone !== undefined) {
    const d = DTCS.exec(UplinkTone);
    if (d && d[1]) {
      const n = parseInt(d[1], 10);
      if (!isNaN(n)) {
        DtcsCode = n;
        DtcsRxCode = n;
        Tone = "DTCS";
      }
    }
  }

  if (typeof DownlinkTone === "number") {
    cToneFreq = DownlinkTone;
    // Tone = "TSQL";
  } else if (DownlinkTone !== undefined) {
    const d = DTCS.exec(DownlinkTone);
    if (d && d[1]) {
      const n = parseInt(d[1], 10);
      if (!isNaN(n)) {
        DtcsRxCode = n;
        Tone = "DTCS";
      }
    }
  }

  if (rToneFreq !== cToneFreq) {
    // Tone = "Cross";
  }

  cToneFreq = cToneFreq || 88.5;
  rToneFreq = rToneFreq || 88.5;
  DtcsCode = DtcsCode || 23;
  DtcsRxCode = DtcsRxCode || 23;

  // log(chalk.green("Made Row"), row);
  return {
    ...chirp as any,
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

  await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
  await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
}

export default start();
