import "module-alias/register";

import {readdirAsync, readFileAsync, writeToJsonAndCsv} from "@helpers/fs-helpers";
import {createLog} from "@helpers/log-helpers";
import {IRepeater} from "./modules/i.repeater";

const log: (...msg: any[]) => void = createLog("Make Chirp");

interface IChirp {
  Location: number;
  Name: string;
  Frequency: number;
  Duplex: string;
  Offset: number;
  Tone: "" | "Tone" | "DTCS";
  rToneFreq: number;
  cToneFreq: number;
  DtcsCode: number;
  DtcsRxCode: number;
  DtcsPolarity: string;
  Mode: string;
  TStep: number;
  Comment: string;
  // [index: string]: any;
}

const chirp: IChirp = {
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
} as any;

async function doIt(inFileName: string, outFileName: string): Promise<void> {
  const all: IRepeater[] = JSON.parse((await readFileAsync("data/frequencies.json")).toString());

  const fileData: Buffer = await readFileAsync(inFileName);
  const repeaters: IRepeater[] = JSON.parse(fileData.toString()) as IRepeater[];

  const mapped: IChirp[] = [...all.filter((d: IRepeater) => /Voice|Simplex/i.test(d.Comment!)), ...repeaters]
  // const mapped = all
    .filter((r: IRepeater) => (r.Frequency >= 144 && r.Frequency <= 148) || (r.Frequency >= 222 && r.Frequency <= 225) || (r.Frequency >= 420 && r.Frequency <= 450))
    // .filter((r: IRepeater) => all.find((f: IRepeater) => f.Frequency === r.Frequency) || (r.Call && r.Use === "OPEN" && r["Op Status"] !== "Off-Air"))
    .map((d: IRepeater, i: number): IChirp => ({ ...makeRow(d), Location: i }))
    .filter((d: IChirp) => d.Mode === "FM" || d.Mode === "NFM")
    .slice(0, 128)
    .sort((a: IChirp, b: IChirp) => a.Frequency - b.Frequency)
    .map((d: IChirp, i: number): IChirp => ({ ...d, Location: i, Mode:
        // Math.round((d.Frequency * 100000) % (0.025 * 100000)) === 0 ? "FM" :
          Math.round(Math.round(d.Frequency * 100000) % Math.round(0.005 * 100000)) === 0 ? "FM" :
            Math.round(Math.round(d.Frequency * 100000) % Math.round(0.00625 * 100000)) === 0 ? "NFM" :
              "FM",
      // d.Mode,
    }));

  return await writeToJsonAndCsv(outFileName, mapped);
}

function makeRow(item: IRepeater): IChirp {
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

  // const Name: string =
  //
  //   ((
  //       (item.Call || "")
  //         .toLocaleUpperCase()
  //         .trim()
  //         .substr(-3)
  //     )
  //     + "" +
  //     (
  //       (item.Location || "")
  //         .toLocaleLowerCase()
  //         .trim()
  //     ))
  //   ||  item.Frequency
  //     .toString()
  //     .replace(/\s+/g, "");

  const Frequency: number = item.Frequency;
  const Duplex: string = item.Offset > 0 ? "+" : item.Offset < 0 ? "-" : "";
  const Offset: number = Math.abs(item.Offset) || 0;
  const UplinkTone: number | string = item["Uplink Tone"] || item.Tone;
  const DownlinkTone: number | string | undefined = item["Downlink Tone"];
  let cToneFreq: number = 0;
  let rToneFreq: number = 0;
  let DtcsCode: number = 0;
  let DtcsRxCode: number = 0;
  let Tone: "" | "Tone" | "DTCS" = "";
  const Mode: string = isDigital ? isDigital : isNarrow ? "NFM" : "FM";
  let Comment: string = `${item["ST/PR"] || ""} ${item.County || ""} ${item.Location || ""} ${item.Call || ""} ${item.Sponsor || ""} ${item.Affiliate || ""} ${item.Frequency} ${item.Use || ""} ${item["Op Status"] || ""} ${item.Comment || ""}`.replace(/\s+/g, " ");
  Comment = Comment.replace(",", "").substring(0, 31);

  if (typeof UplinkTone === "number") {
    rToneFreq = UplinkTone;
    cToneFreq = UplinkTone;
    Tone = "Tone";
  } else if (UplinkTone !== undefined) {
    const d: RegExpExecArray | null = DTCS.exec(UplinkTone);
    if (d && d[1]) {
      const n: number = parseInt(d[1], 10);
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
    const d: RegExpExecArray | null = DTCS.exec(DownlinkTone);
    if (d && d[1]) {
      const n: number = parseInt(d[1], 10);
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

  // await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
  // await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
  await doIt("data/repeaters/combined/CO.json", "data/repeaters/chirp/combined/CO");
  await doIt("data/repeaters/groups/combined/CO - Call.json", "data/repeaters/chirp/groups/CO - Call");
}

export default start();
