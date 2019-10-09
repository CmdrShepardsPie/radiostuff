"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const fs_helpers_1 = require("@helpers/fs-helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const log = log_helpers_1.createLog("Make Yaesu");
const yaesu = {
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
};
const simplexFilter = (prev, curr, index) => {
    const last = prev[prev.length - 1];
    if (last && last.Frequency === curr.Frequency) {
        if (last.Comment && curr.Comment) {
            last.Comment = last.Comment.substr(0, 3) + "/" + curr.Comment.substr(0, 3);
        }
        return prev;
    }
    return [...prev, curr];
};
async function doIt(inFileName, outFileName) {
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
    const all = JSON.parse((await fs_helpers_1.readFileAsync("data/frequencies.json")).toString());
    const fileData = await fs_helpers_1.readFileAsync(inFileName);
    const repeaters = JSON.parse(fileData.toString());
    // const repeaters: IRepeater[] = [...twom, ...sevcm, ...fileData];
    // const repeaters: IRepeater[] = [...all, ...fileData];
    const mapped = [...all, ...repeaters]
        // const mapped = all
        .filter((r) => (r.Frequency >= 144 && r.Frequency <= 148) || (r.Frequency >= 420 && r.Frequency <= 450))
        // .filter((r: IRepeater) => all.find((f: IRepeater) => f.Frequency === r.Frequency) || (r.Call && r.Use === "OPEN" && r["Op Status"] !== "Off-Air"))
        .map((d, i) => ({ ...makeRow(d), Number: i + 1 }))
        .filter((d) => d.Mode === "FM" || d.Mode === "NFM" || d.Mode === "MAYBE" || d.Mode === "DIG")
        .slice(0, 500)
        .sort((a, b) => parseFloat(a.Receive) - parseFloat(b.Receive))
        .map((d, i) => ({ ...d, Number: i + 1, Mode: 
        // Math.round((parseFloat(d.Receive) * 100000) % (0.025 * 100000)) === 0 ? "FM" :
        Math.round(Math.round(parseFloat(d.Receive) * 100000) % Math.round(0.005 * 100000)) === 0 ? "FM" :
            Math.round(Math.round(parseFloat(d.Receive) * 100000) % Math.round(0.00625 * 100000)) === 0 ? "NFM" :
                "FM",
    }));
    return await fs_helpers_1.writeToJsonAndCsv(outFileName, mapped, mapped, false);
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
    const Receive = item.Frequency.toFixed(5);
    const Direction = item.Offset > 0 ? "+RPT" : item.Offset < 0 ? "-RPT" : "OFF";
    const Offset = Math.abs(item.Offset || 0).toFixed(5);
    const Transmit = (item.Frequency + (item.Offset || 0)).toFixed(5);
    const UplinkTone = item["Uplink Tone"] || item.Tone;
    const DownlinkTone = item["Downlink Tone"];
    let CTCSS = "";
    let DCS = "";
    let ToneMode = "OFF";
    const Mode = isDigital ? isDigital : isNarrow ? "NFM" : "FM";
    let Comment = `${item["ST/PR"] || ""} ${item.County || ""} ${item.Location || ""} ${item.Call || ""} ${item.Sponsor || ""} ${item.Affiliate || ""} ${item.Frequency} ${item.Use || ""} ${item["Op Status"] || ""} ${item.Comment || ""}`.replace(/\s+/g, " ");
    Comment = Comment.replace(",", "").substring(0, 31);
    if (typeof UplinkTone === "number") {
        CTCSS = UplinkTone;
        // ToneMode = "TONE SQL";
        ToneMode = "TONE ENC";
    }
    else if (UplinkTone !== undefined) {
        const d = DTCS.exec(UplinkTone);
        if (d && d[1]) {
            const n = parseInt(d[1], 10);
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
        }
        else if (DownlinkTone !== undefined) {
            const d = DTCS.exec(DownlinkTone);
            if (d && d[1]) {
                const n = parseInt(d[1], 10);
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
exports.default = start();
