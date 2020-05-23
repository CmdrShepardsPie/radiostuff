"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
require("module-alias/register");
const fs_helpers_1 = require("@helpers/fs-helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const i_adms400_1 = require("@interfaces/i-adms400");
const gps_distance_1 = __importDefault(require("gps-distance"));
const chalk_1 = __importDefault(require("chalk"));
const radio_helpers_1 = require("@helpers/radio-helpers");
const log = log_helpers_1.createLog("Make Adms400");
const homePoint = [39.627071500, -104.893322500]; // 4982 S Ulster St
const DenverPoint = [39.742043, -104.991531];
const ColoradoSpringsPoint = [38.846127, -104.800644];
async function doIt(inFileName, outFileName) {
    const simplex = JSON.parse((await fs_helpers_1.readFileAsync("../data/frequencies.json")).toString())
        .map((map) => ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
        .filter((filter) => /FM|Voice|Simplex/i.test(filter.Callsign))
        .filter((filter) => !(/Data|Digital|Packet/i.test(filter.Callsign)));
    const repeaters = JSON.parse((await fs_helpers_1.readFileAsync(inFileName)).toString());
    repeaters.forEach((each) => {
        each.Location.Distance = Math.min(gps_distance_1.default([homePoint, [each.Location.Latitude, each.Location.Longitude]]));
    });
    repeaters.sort((a, b) => a.Location.Distance - b.Location.Distance);
    const unique = {};
    const mapped = [
        ...simplex
            .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm)),
        ...repeaters
            // .filter(filterMinimumRepeaterCount(3, repeaters))
            .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm))
            // .filter(filterDistance(100))
            .filter(radio_helpers_1.filterMode(radio_helpers_1.Mode.FM, radio_helpers_1.Mode.YSF)),
    ]
        .map((map, index) => ({ ...convertToRadio(map), "Channel Number": index + 1 }))
        .filter((filter) => {
        if (unique[filter.Name]) {
            return false;
        }
        unique[filter.Name] = true;
        return true;
    })
        .slice(0, 500)
        .sort((a, b) => parseFloat(a.CTCSS) - parseFloat(b.CTCSS))
        .sort((a, b) => a["Receive Frequency"] - b["Receive Frequency"])
        .sort((a, b) => parseFloat(a.CTCSS) - parseFloat(b.CTCSS))
        .sort((a, b) => a["Receive Frequency"] - b["Receive Frequency"])
        // .sort((a: IAdms400, b: IAdms400) => a.Name > b.Name ? 1 : b.Name < a.Name ? -1 : 0)
        .map((map, index) => ({ ...map, "Channel Number": index + 1 }));
    return fs_helpers_1.writeToJsonAndCsv(outFileName, mapped, mapped);
}
function convertToRadio(repeater) {
    const Name = `${radio_helpers_1.buildName(repeater)}`; // ${getRepeaterSuffix(repeater)}`;
    const Receive = repeater.Frequency.Output;
    const Transmit = repeater.Frequency.Input;
    const OffsetFrequency = repeater.Frequency.Input - repeater.Frequency.Output;
    const TransmitSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Input);
    const ReceiveSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Output);
    const TransmitDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Input);
    const ReceiveDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Output);
    const Comment = radio_helpers_1.buildComment(repeater);
    let ToneMode = i_adms400_1.Adms400ToneMode.None;
    if (TransmitSquelchTone) {
        ToneMode = i_adms400_1.Adms400ToneMode.Tone; // "TONE ENC";
    }
    else if (TransmitDigitalTone) {
        ToneMode = i_adms400_1.Adms400ToneMode.DCS; // "DCS";
    }
    // if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
    //   ToneMode = Adms400ToneMode.T_Sql; // "TONE SQL";
    // } else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
    //   ToneMode = Adms400ToneMode.T_DCS; // "DCS";
    // }
    const CTCSS = ((TransmitSquelchTone || 100).toFixed(1) + " Hz");
    const DCS = radio_helpers_1.buildDCS(TransmitDigitalTone);
    return new i_adms400_1.Adms400({
        // "Channel Number": number;
        "Receive Frequency": Receive.toFixed(5),
        "Transmit Frequency": Transmit.toFixed(5),
        "Offset Frequency": convertOffsetFrequency(OffsetFrequency),
        "Offset Direction": convertOffsetDirection(OffsetFrequency),
        // "Operating Mode": Adms400OperatingMode,
        Name,
        // "Show Name": Adms400ShowName,
        "Tone Mode": ToneMode,
        CTCSS,
        DCS,
        // "Tx Power": Adms400TxPower,
        // Skip: Adms400Skip,
        // Step: Adms400Step,
        // "Clock Shift": Adms400ClockShift,
        Comment,
    });
}
function convertOffsetFrequency(OffsetFrequency) {
    switch (Math.abs(Math.round(OffsetFrequency * 10)) / 10) {
        case 0:
            return i_adms400_1.Adms400OffsetFrequency.None;
        case 0.1:
            return i_adms400_1.Adms400OffsetFrequency.$100_kHz;
        case 0.5:
            return i_adms400_1.Adms400OffsetFrequency.$500_kHz;
        case 0.6:
            return i_adms400_1.Adms400OffsetFrequency.$600_kHz;
        case 1:
            return i_adms400_1.Adms400OffsetFrequency.$1_00_MHz;
        case 1.6:
            return i_adms400_1.Adms400OffsetFrequency.$1_60_MHz;
        case 3:
            return i_adms400_1.Adms400OffsetFrequency.$3_00_MHz;
        case 5:
            return i_adms400_1.Adms400OffsetFrequency.$5_00_MHz;
        case 7.6:
            return i_adms400_1.Adms400OffsetFrequency.$7_60_MHz;
    }
    log(chalk_1.default.red("ERROR"), "convertOffsetFrequency", "unknown", OffsetFrequency);
    return i_adms400_1.Adms400OffsetFrequency.None;
}
function convertOffsetDirection(OffsetFrequency) {
    if (OffsetFrequency === 0) {
        return i_adms400_1.Adms400OffsetDirection.Simplex;
    }
    else if (OffsetFrequency < 0) {
        return i_adms400_1.Adms400OffsetDirection.Minus;
    }
    else if (OffsetFrequency > 0) {
        return i_adms400_1.Adms400OffsetDirection.Plus;
    }
    log(chalk_1.default.red("ERROR"), "convertOffsetDirection", "unknown", OffsetFrequency);
    return i_adms400_1.Adms400OffsetDirection.Simplex;
}
module.exports = doIt("../data/repeaters/converted/CO.json", "../data/repeaters/adms400/CO");
