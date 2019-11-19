var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/log-helpers", "@interfaces/i-repeater-structured", "gps-distance"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const i_repeater_structured_1 = require("@interfaces/i-repeater-structured");
    const gps_distance_1 = __importDefault(require("gps-distance"));
    const log = log_helpers_1.createLog('Make Chirp');
    const chirp = {
        Location: null,
        Name: '',
        Frequency: null,
        Duplex: '',
        Offset: null,
        Tone: '',
        rToneFreq: null,
        cToneFreq: null,
        DtcsCode: null,
        DtcsRxCode: null,
        DtcsPolarity: 'NN',
        Mode: 'FM',
        TStep: 5,
        Comment: '',
    };
    const myPoint = [39.627071500, -104.893322500]; // 4982 S Ulster St
    async function doIt(inFileName, outFileName) {
        const simplex = JSON.parse((await fs_helpers_1.readFileAsync('data/frequencies.json')).toString())
            .map((map) => ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
            .filter((filter) => /FM|Voice|Simplex/i.test(filter.Callsign))
            .filter((filter) => !(/Data|Digital|Packet/i.test(filter.Callsign)));
        const repeaters = JSON.parse((await fs_helpers_1.readFileAsync(inFileName)).toString());
        repeaters.forEach((each) => {
            each.Location.Distance = gps_distance_1.default([myPoint, [each.Location.Latitude, each.Location.Longitude]]);
        });
        repeaters.sort((a, b) => a.Location.Distance > b.Location.Distance ? 1 :
            a.Location.Distance < b.Location.Distance ? -1 : 0);
        const mapped = [
            ...simplex,
            ...repeaters
                .filter((filter) => (filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
                (filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
                (filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450))
                .filter((filter) => !filter.Digital &&
                filter.Status !== i_repeater_structured_1.RepeaterStatus.OffAir &&
                filter.Use === i_repeater_structured_1.RepeaterUse.Open),
        ]
            .map((d, i) => ({ ...convertToRadio(d), Location: i }))
            .slice(0, 200)
            .sort((a, b) => a.Frequency - b.Frequency)
            .map((d, index) => ({ ...d, Location: index }));
        return fs_helpers_1.writeToJsonAndCsv(outFileName, mapped);
    }
    function convertToRadio(repeater) {
        let Name = '';
        if (repeater.Callsign) {
            Name += repeater.Callsign.trim();
            if (repeater.ID !== undefined) {
                Name = Name.substr(-3).trim().toUpperCase();
            }
        }
        if (repeater.Location && repeater.Location.Local) {
            Name += (Name ? ' ' : '') + repeater.Location.Local.trim().toLowerCase();
        }
        if (repeater.Frequency && repeater.Frequency.Output) {
            Name += (Name ? ' ' : '') + repeater.Frequency.Output.toString().trim();
        }
        Name = Name.replace(/[^0-9.a-zA-Z\/]/g, '').trim();
        Name = Name.substring(0, 7).trim();
        const Frequency = repeater.Frequency.Output;
        let Offset = repeater.Frequency.Input - repeater.Frequency.Output;
        const Duplex = Offset > 0 ? '+' : Offset < 0 ? '-' : '';
        Offset = Math.abs(Math.round(Offset * 100) / 100);
        let rToneFreq = (repeater.SquelchTone && repeater.SquelchTone.Input);
        let cToneFreq = (repeater.SquelchTone && repeater.SquelchTone.Output);
        let DtcsCode = (repeater.DigitalTone && repeater.DigitalTone.Input);
        let DtcsRxCode = (repeater.DigitalTone && repeater.DigitalTone.Output);
        let Tone = '';
        const Mode = 'FM';
        let Comment = `${repeater.StateID} ${repeater.ID} ${repeater.Location && repeater.Location.Distance && repeater.Location.Distance.toFixed(2)} ${repeater.Location && repeater.Location.State} ${repeater.Location && repeater.Location.County} ${repeater.Location && repeater.Location.Local} ${repeater.Callsign}`;
        Comment = Comment.replace(/undefined/g, ' ').replace(/\s+/g, ' ').trim();
        // `${item['ST/PR'] || ''} ${item.County || ''} ${item.Location || ''} ${item.Call || ''} ${item.Sponsor || ''} ${item.Affiliate || ''} ${item.Frequency} ${item.Use || ''} ${item['Op Status'] || ''} ${item.Comment || ''}`.replace(/\s+/g, ' ');
        // Comment = Comment.trim().replace(",", "").substring(0, 31).trim();
        if (rToneFreq) {
            Tone = 'Tone';
        }
        else if (DtcsCode) {
            Tone = 'DTCS';
        }
        if (cToneFreq) {
            Tone = 'TSQL';
        }
        else if (DtcsRxCode) {
            Tone = 'DTCS';
        }
        if ((rToneFreq && cToneFreq && (rToneFreq !== cToneFreq))) {
            Tone = 'Cross';
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
        await doIt('data/repeaters/converted/CO.json', 'data/repeaters/chirp/CO');
        // await doIt('data/repeaters/groups/combined/CO - Call.json', 'data/repeaters/chirp/groups/CO - Call');
    }
    exports.default = start();
});
//# sourceMappingURL=make-chirp.js.map