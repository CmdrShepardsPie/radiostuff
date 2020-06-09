"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const fs_helpers_1 = require("@helpers/fs-helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const i_repeater_structured_1 = require("@interfaces/i-repeater-structured");
const gps_distance_1 = __importDefault(require("gps-distance"));
const log = log_helpers_1.createLog('Make Adms7');
const Adms7 = {
    Number: null,
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
const myPoint = [39.627071500, -104.893322500]; // 4982 S Ulster St
async function doIt(inFileName, outFileName) {
    const simplex = JSON.parse((await fs_helpers_1.readFileAsync('../data/frequencies.json')).toString())
        .map((map) => ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
        .filter((filter) => /FM|Voice|Simplex/i.test(filter.Callsign))
        .filter((filter) => !(/Data|Digital|Packet/i.test(filter.Callsign)));
    const repeaters = JSON.parse((await fs_helpers_1.readFileAsync(inFileName)).toString());
    repeaters.forEach((each) => {
        each.Location.Distance = gps_distance_1.default([myPoint, [each.Location.Latitude, each.Location.Longitude]]);
    });
    repeaters.sort((a, b) => a.Location.Distance > b.Location.Distance ? 1 :
        a.Location.Distance < b.Location.Distance ? -1 : 0);
    const unique = {};
    const mapped = [
        ...simplex,
        ...repeaters
            .filter((filter) => (filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
            // (filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
            (filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450))
            .filter((filter) => (!filter.Digital || filter.Digital.YSF) &&
            filter.Status !== i_repeater_structured_1.RepeaterStatus.OffAir &&
            filter.Use === i_repeater_structured_1.RepeaterUse.Open),
    ]
        .map((map, index) => ({ ...convertToRadio(map), Number: index + 1 }))
        .filter((filter) => {
        if (unique[filter.Name]) {
            return false;
        }
        unique[filter.Name] = true;
        return true;
    })
        .slice(0, 500)
        // .sort((a: IAdms7, b: IAdms7) => parseFloat(a.Receive) - parseFloat(b.Receive))
        .sort((a, b) => a.Name > b.Name ? 1 : b.Name < a.Name ? -1 : 0)
        .map((map, index) => ({ ...map, Number: index + 1 }));
    return fs_helpers_1.writeToJsonAndCsv(outFileName, mapped, mapped, false);
}
function convertToRadio(repeater) {
    let Name = '';
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
    const Receive = repeater.Frequency.Output.toFixed(5);
    const Transmit = repeater.Frequency.Input.toFixed(5);
    const OffsetNumber = repeater.Frequency.Input - repeater.Frequency.Output;
    const Direction = OffsetNumber > 0 ? '+RPT' : OffsetNumber < 0 ? '-RPT' : 'OFF';
    const Offset = Math.abs(Math.round(OffsetNumber * 100) / 100).toFixed(5);
    const TransmitSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Input);
    const ReceiveSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Output);
    const TransmitDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Input);
    const ReceiveDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Output);
    let ToneMode = 'OFF';
    const Mode = 'FM';
    let Comment = `${repeater.StateID} ${repeater.ID} ${repeater.Location && repeater.Location.Distance && repeater.Location.Distance.toFixed(2)} ${repeater.Location && repeater.Location.State} ${repeater.Location && repeater.Location.County} ${repeater.Location && repeater.Location.Local} ${repeater.Callsign}`;
    Comment = Comment.replace(/undefined/g, ' ').replace(/\s+/g, ' ').trim();
    if (TransmitSquelchTone) {
        ToneMode = 'TONE ENC';
    }
    else if (TransmitDigitalTone) {
        ToneMode = 'DCS';
    }
    // if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
    //   ToneMode = "TONE SQL";
    // } else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
    //   ToneMode = "DCS";
    // }
    const CTCSS = (TransmitSquelchTone || 100).toFixed(1) + ' Hz';
    const DCSNumber = (TransmitDigitalTone || 23);
    const DCS = DCSNumber < 100 ? '0' + DCSNumber : '' + DCSNumber;
    return {
        ...Adms7,
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
    // await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/Adms7/groups/CO/Colorado Springs - Call");
    // await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/Adms7/CO/Colorado Springs");
    await doIt('../data/repeaters/converted/CO.json', '../data/repeaters/adms7/CO');
    // await doIt("../data/repeaters/groups/combined/CO - Call.json", "../data/repeaters/Adms7/groups/CO - Call");
}
exports.default = start();
