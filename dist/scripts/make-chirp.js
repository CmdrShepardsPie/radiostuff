"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const fs_helpers_1 = require("@helpers/fs-helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const log = log_helpers_1.createLog("Make Chirp");
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
async function doIt(inFileName, outFileName) {
    const all = JSON.parse((await fs_helpers_1.readFileAsync("data/frequencies.json")).toString());
    const fileData = await fs_helpers_1.readFileAsync(inFileName);
    const repeaters = JSON.parse(fileData.toString());
    const mapped = [...all.filter((d) => /Voice|Simplex/i.test(d.Comment)), ...repeaters]
        // const mapped = all
        .filter((r) => (r.Frequency >= 144 && r.Frequency <= 148) || (r.Frequency >= 222 && r.Frequency <= 225) || (r.Frequency >= 420 && r.Frequency <= 450))
        // .filter((r: IRepeater) => all.find((f: IRepeater) => f.Frequency === r.Frequency) || (r.Call && r.Use === "OPEN" && r["Op Status"] !== "Off-Air"))
        .map((d, i) => ({ ...makeRow(d), Location: i }))
        .filter((d) => d.Mode === "FM" || d.Mode === "NFM")
        .slice(0, 128)
        .sort((a, b) => a.Frequency - b.Frequency)
        .map((d, i) => ({ ...d, Location: i, Mode: 
        // Math.round((d.Frequency * 100000) % (0.025 * 100000)) === 0 ? "FM" :
        Math.round(Math.round(d.Frequency * 100000) % Math.round(0.005 * 100000)) === 0 ? "FM" :
            Math.round(Math.round(d.Frequency * 100000) % Math.round(0.00625 * 100000)) === 0 ? "NFM" :
                "FM",
    }));
    return await fs_helpers_1.writeToJsonAndCsv(outFileName, mapped);
}
function makeRow(item) {
    const DTCS = /D(\d+)/;
    // Doesn't account for multiple digital modes, uses the first one it finds
    let isDigital = Object.entries(item)
        .filter(([key, value]) => /\s*(Enabled|Digital|Data)\s*/i.test(key) || /\s*(Enabled|Digital|Data)\s*/i.test(value))
        .map(([key, value]) => (key.match(/(.*)\s*(Enabled|Digital|Data)\s*/i) || value.match(/(.*)\s*(Enabled|Digital|Data)/i) || [])[1])
        .join("");
    if (isDigital) {
        // log("IS DIGITAL", isDigital);
        // isDigital = isDigital.replace(/\s*(Enabled|Digital|Data)\s*/i, "").trim();
        if (/YSF/i.test(isDigital)) {
            isDigital = "DIG";
        }
        else if (/D-?STAR/i.test(isDigital)) {
            isDigital = "DV";
        }
        else if (/DMR/i.test(isDigital)) {
            isDigital = "DMR";
        }
        else if (/P-?25/i.test(isDigital)) {
            isDigital = "P25";
        }
        else if (/NXDN/i.test(isDigital)) {
            isDigital = "FSK";
        }
        else {
            isDigital = "MAYBE";
        }
        // log("IS DIGITAL", isDigital);
    }
    const isNarrow = Object.entries(item)
        .filter(([key, value]) => /Narrow/i.test(key) || /Narrow/i.test(value)).length > 0;
    let Name = "";
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
    const Frequency = item.Frequency;
    const Duplex = item.Offset > 0 ? "+" : item.Offset < 0 ? "-" : "";
    const Offset = Math.abs(item.Offset) || 0;
    const UplinkTone = item["Uplink Tone"] || item.Tone;
    const DownlinkTone = item["Downlink Tone"];
    let cToneFreq = 0;
    let rToneFreq = 0;
    let DtcsCode = 0;
    let DtcsRxCode = 0;
    let Tone = "";
    const Mode = isDigital ? isDigital : isNarrow ? "NFM" : "FM";
    let Comment = `${item["ST/PR"] || ""} ${item.County || ""} ${item.Location || ""} ${item.Call || ""} ${item.Sponsor || ""} ${item.Affiliate || ""} ${item.Frequency} ${item.Use || ""} ${item["Op Status"] || ""} ${item.Comment || ""}`.replace(/\s+/g, " ");
    Comment = Comment.replace(",", "").substring(0, 31);
    if (typeof UplinkTone === "number") {
        rToneFreq = UplinkTone;
        cToneFreq = UplinkTone;
        Tone = "Tone";
    }
    else if (UplinkTone !== undefined) {
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
    }
    else if (DownlinkTone !== undefined) {
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
    // await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
    // await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
    await doIt("data/repeaters/combined/CO.json", "data/repeaters/chirp/combined/CO");
    await doIt("data/repeaters/groups/combined/CO - Call.json", "data/repeaters/chirp/groups/CO - Call");
}
exports.default = start();
