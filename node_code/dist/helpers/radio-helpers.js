var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@interfaces/repeater-structured", "@helpers/fs-helpers", "gps-distance", "@interfaces/rt-systems"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertOffsetFrequency = exports.radioCommon = exports.loadRepeaters = exports.loadSimplex = exports.sortStructuredRepeaters = exports.buildDCS = exports.buildComment = exports.getRepeaterCount = exports.getRepeaterSuffix = exports.buildName = exports.filterMinimumRepeaterCount = exports.filterMode = exports.filterDistance = exports.filterFrequencies = exports.Mode = exports.FrequencyBand = void 0;
    const repeater_structured_1 = require("@interfaces/repeater-structured");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const gps_distance_1 = __importDefault(require("gps-distance"));
    const rt_systems_1 = require("@interfaces/rt-systems");
    var FrequencyBand;
    (function (FrequencyBand) {
        FrequencyBand[FrequencyBand["$160_m"] = 0] = "$160_m";
        FrequencyBand[FrequencyBand["$80_m"] = 1] = "$80_m";
        FrequencyBand[FrequencyBand["$60_m"] = 2] = "$60_m";
        FrequencyBand[FrequencyBand["$40_m"] = 3] = "$40_m";
        FrequencyBand[FrequencyBand["$30_m"] = 4] = "$30_m";
        FrequencyBand[FrequencyBand["$20_m"] = 5] = "$20_m";
        FrequencyBand[FrequencyBand["$17_m"] = 6] = "$17_m";
        FrequencyBand[FrequencyBand["$15_m"] = 7] = "$15_m";
        FrequencyBand[FrequencyBand["$12_m"] = 8] = "$12_m";
        FrequencyBand[FrequencyBand["$10_m"] = 9] = "$10_m";
        FrequencyBand[FrequencyBand["$6_m"] = 10] = "$6_m";
        FrequencyBand[FrequencyBand["$2_m"] = 11] = "$2_m";
        FrequencyBand[FrequencyBand["$1_25_m"] = 12] = "$1_25_m";
        FrequencyBand[FrequencyBand["$70_cm"] = 13] = "$70_cm";
    })(FrequencyBand = exports.FrequencyBand || (exports.FrequencyBand = {}));
    var Mode;
    (function (Mode) {
        Mode[Mode["FM"] = 0] = "FM";
        Mode[Mode["ATV"] = 1] = "ATV";
        Mode[Mode["DMR"] = 2] = "DMR";
        Mode[Mode["P25"] = 3] = "P25";
        Mode[Mode["DStar"] = 4] = "DStar";
        Mode[Mode["YSF"] = 5] = "YSF";
    })(Mode = exports.Mode || (exports.Mode = {}));
    function filterFrequencies(...bands) {
        return (filter) => (bands.includes(FrequencyBand.$160_m) && filter.Frequency.Output >= 1.8 && filter.Frequency.Output <= 2.0) ||
            (bands.includes(FrequencyBand.$80_m) && filter.Frequency.Output >= 3.5 && filter.Frequency.Output <= 4.0) ||
            (bands.includes(FrequencyBand.$60_m) && filter.Frequency.Output >= 5.3305 && filter.Frequency.Output <= 5.405) ||
            (bands.includes(FrequencyBand.$40_m) && filter.Frequency.Output >= 7.0 && filter.Frequency.Output <= 7.3) ||
            (bands.includes(FrequencyBand.$30_m) && filter.Frequency.Output >= 10.1 && filter.Frequency.Output <= 10.15) ||
            (bands.includes(FrequencyBand.$20_m) && filter.Frequency.Output >= 14.0 && filter.Frequency.Output <= 14.35) ||
            (bands.includes(FrequencyBand.$17_m) && filter.Frequency.Output >= 18.068 && filter.Frequency.Output <= 18.168) ||
            (bands.includes(FrequencyBand.$15_m) && filter.Frequency.Output >= 21.0 && filter.Frequency.Output <= 21.45) ||
            (bands.includes(FrequencyBand.$12_m) && filter.Frequency.Output >= 24.89 && filter.Frequency.Output <= 24.99) ||
            (bands.includes(FrequencyBand.$10_m) && filter.Frequency.Output >= 28 && filter.Frequency.Output <= 29.7) ||
            (bands.includes(FrequencyBand.$6_m) && filter.Frequency.Output >= 50 && filter.Frequency.Output <= 54) ||
            (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
            (bands.includes(FrequencyBand.$1_25_m) && filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
            (bands.includes(FrequencyBand.$70_cm) && filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450);
    }
    exports.filterFrequencies = filterFrequencies;
    function filterDistance(distance) {
        return (filter) => !filter.Location || filter.Location.Distance < distance;
    }
    exports.filterDistance = filterDistance;
    function filterMode(...modes) {
        return (filter) => filter.Status !== repeater_structured_1.RepeaterStatus.OffAir &&
            filter.Use === repeater_structured_1.RepeaterUse.Open &&
            ((modes.includes(Mode.FM) && !filter.Digital) ||
                (modes.includes(Mode.ATV) && filter.Digital != null && filter.Digital.ATV != null) ||
                (modes.includes(Mode.DMR) && filter.Digital != null && filter.Digital.DMR != null) ||
                (modes.includes(Mode.P25) && filter.Digital != null && filter.Digital.P25 != null) ||
                (modes.includes(Mode.DStar) && filter.Digital != null && filter.Digital.DStar != null) ||
                (modes.includes(Mode.YSF) && filter.Digital != null && filter.Digital.YSF != null));
    }
    exports.filterMode = filterMode;
    function filterMinimumRepeaterCount(count, repeaters) {
        return (filter) => !!filter.Callsign && getRepeaterCount(filter.Callsign, repeaters) >= count;
    }
    exports.filterMinimumRepeaterCount = filterMinimumRepeaterCount;
    function buildName(repeater) {
        let Name = '';
        if (repeater.Callsign) {
            Name += repeater.Callsign.trim();
        }
        else if (repeater.Location && repeater.Location.Local) {
            Name += repeater.Location.Local.trim();
        }
        else if (repeater.Frequency && repeater.Frequency.Output) {
            Name += repeater.Frequency.Output.toString().trim();
        }
        Name = Name.replace(/\s+/g, ' ').trim();
        Name = Name.substr(0, 16).trim();
        return Name;
    }
    exports.buildName = buildName;
    function getRepeaterSuffix(repeater) {
        let Name = '';
        if (!repeater.Digital && repeater.Location) {
            Name += 'F';
        }
        if (repeater.Digital && repeater.Digital.YSF) {
            Name += 'Y';
        }
        if (repeater.Digital && repeater.Digital.DStar) {
            Name += 'S';
        }
        if (repeater.Digital && repeater.Digital.ATV) {
            Name += 'T';
        }
        if (repeater.Digital && repeater.Digital.DMR) {
            Name += 'M';
        }
        if (repeater.Digital && repeater.Digital.P25) {
            Name += 'P';
        }
        if (repeater.VOIP && repeater.VOIP.Wires) {
            Name += 'W';
        }
        if (repeater.VOIP && repeater.VOIP.AllStar) {
            Name += 'L';
        }
        if (repeater.VOIP && repeater.VOIP.EchoLink) {
            Name += 'E';
        }
        if (repeater.VOIP && repeater.VOIP.IRLP) {
            Name += 'I';
        }
        return Name;
    }
    exports.getRepeaterSuffix = getRepeaterSuffix;
    function getRepeaterCount(name, all) {
        return all.filter((a) => a.Callsign.trim() === name).length;
    }
    exports.getRepeaterCount = getRepeaterCount;
    function buildComment(repeater) {
        let Comment = `${repeater.StateID} ${repeater.ID} ${repeater.Location && (repeater.Location.Distance != null) && repeater.Location.Distance.toFixed(2) || ''} ${repeater.Location && repeater.Location.State || ''} ${repeater.Location && repeater.Location.County || ''} ${repeater.Location && repeater.Location.Local || ''} ${repeater.Callsign}`;
        Comment = Comment.replace(/undefined/g, ' ').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
        return Comment;
    }
    exports.buildComment = buildComment;
    function buildDCS(code) {
        const DCSa = (code || 23).toString().split('');
        const DCS = ['0', '0', '0'];
        DCS.splice(DCS.length - DCSa.length, DCSa.length, ...DCSa);
        return DCS.join('');
    }
    exports.buildDCS = buildDCS;
    function sortStructuredRepeaters(repeaters) {
        return repeaters
            .sort((a, b) => a.Callsign > b.Callsign ? 1 : a.Callsign < b.Callsign ? -1 : 0)
            .sort((a, b) => (a.DigitalTone && a.DigitalTone.Input || 0) - (b.DigitalTone && b.DigitalTone.Input || 0))
            .sort((a, b) => (a.SquelchTone && a.SquelchTone.Input || 0) - (b.SquelchTone && b.SquelchTone.Input || 0))
            .sort((a, b) => a.Frequency.Input - b.Frequency.Input)
            .sort((a, b) => a.Location.Distance - b.Location.Distance);
    }
    exports.sortStructuredRepeaters = sortStructuredRepeaters;
    async function loadSimplex(filterSimplex) {
        return (await fs_helpers_1.readFromCsv('../data/simplex-frequencies.csv'))
            .map((map) => ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
            .filter((filter) => filterSimplex.test(filter.Callsign)); // TODO: Make a function and enum
    }
    exports.loadSimplex = loadSimplex;
    async function loadRepeaters(location) {
        const files = await fs_helpers_1.getAllFilesInDirectory('../data/repeaters/converted/json', 'json', 1);
        return sortStructuredRepeaters(await Promise.all(files.map(async (file) => {
            const fileBuffer = await fs_helpers_1.readFileAsync(file);
            const fileString = fileBuffer.toString();
            const fileData = JSON.parse(fileString);
            fileData.Location.Distance = Math.round(gps_distance_1.default([location, [fileData.Location.Latitude, fileData.Location.Longitude]]));
            return fileData;
        })));
    }
    exports.loadRepeaters = loadRepeaters;
    function radioCommon(repeater) {
        const Name = `${buildName(repeater)}`;
        const Receive = repeater.Frequency.Output;
        const Transmit = repeater.Frequency.Input;
        const OffsetFrequency = repeater.Frequency.Input - repeater.Frequency.Output;
        const TransmitSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Input);
        const ReceiveSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Output);
        const TransmitDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Input);
        const ReceiveDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Output);
        const Comment = buildComment(repeater);
        return {
            Name,
            Receive,
            Transmit,
            OffsetFrequency,
            TransmitSquelchTone,
            ReceiveSquelchTone,
            TransmitDigitalTone,
            ReceiveDigitalTone,
            Comment,
        };
    }
    exports.radioCommon = radioCommon;
    function convertOffsetFrequency(offsetFrequency) {
        const roundFrequency = Math.abs(Math.round(offsetFrequency * 10)) / 10;
        switch (roundFrequency) {
            case 0:
                return rt_systems_1.RtSystemsOffsetFrequency.None;
            case 0.1:
                return rt_systems_1.RtSystemsOffsetFrequency.$100_kHz;
            case 0.4:
                return rt_systems_1.RtSystemsOffsetFrequency.$400_kHz;
            case 0.5:
                return rt_systems_1.RtSystemsOffsetFrequency.$500_kHz;
            case 0.6:
                return rt_systems_1.RtSystemsOffsetFrequency.$600_kHz;
            case 1:
                return rt_systems_1.RtSystemsOffsetFrequency.$1_MHz;
            case 1.6:
                return rt_systems_1.RtSystemsOffsetFrequency.$1_60_MHz;
            case 2.5:
                return rt_systems_1.RtSystemsOffsetFrequency.$2_50_MHz;
            case 3:
                return rt_systems_1.RtSystemsOffsetFrequency.$3_MHz;
            case 5:
                return rt_systems_1.RtSystemsOffsetFrequency.$5_MHz;
            case 5.05:
                return rt_systems_1.RtSystemsOffsetFrequency.$5_05_MHz;
            case 7.6:
                return rt_systems_1.RtSystemsOffsetFrequency.$7_60_MHz;
        }
        return rt_systems_1.RtSystemsOffsetFrequency.None;
    }
    exports.convertOffsetFrequency = convertOffsetFrequency;
});
