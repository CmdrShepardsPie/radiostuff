var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/log-helpers", "@interfaces/wcs7100", "chalk", "@helpers/radio-helpers", "commander"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const wcs7100_1 = require("@interfaces/wcs7100");
    const chalk_1 = __importDefault(require("chalk"));
    const radio_helpers_1 = require("@helpers/radio-helpers");
    const commander_1 = require("commander");
    const log = log_helpers_1.createLog('Make Wcs7100');
    // const homePoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St
    // const DenverPoint: Point = [39.742043, -104.991531];
    // const ColoradoSpringsPoint: Point = [38.846127, -104.800644];
    log('Program Setup');
    commander_1.program
        .version('0.0.1')
        .arguments('<location>')
        .action(async (location) => {
        log('Program Action');
        if (location) {
            await doIt(`../data/repeaters/converted/json/${location}.json`, `../data/repeaters/wcs7100/${location}`);
        }
    });
    log('Program Parse Args');
    commander_1.program.parse(process.argv);
    async function doIt(inFileName, outFileName) {
        const promises = [];
        const simplex = JSON.parse((await fs_helpers_1.readFileAsync('../data/frequencies.json')).toString())
            .map((map) => ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
            .filter((filter) => /FM|Voice|Simplex/i.test(filter.Callsign))
            .filter((filter) => !(/Data|Digital|Packet/i.test(filter.Callsign)));
        const repeaters = JSON.parse((await fs_helpers_1.readFileAsync(inFileName)).toString());
        // repeaters.forEach((each: RepeaterStructured): void => {
        //   each.Location.Distance = Math.min(
        //     gpsDistance([homePoint, [each.Location.Latitude, each.Location.Longitude]]),
        //     // gpsDistance([DenverPoint, [each.Location.Latitude, each.Location.Longitude]]),
        //     // gpsDistance([ColoradoSpringsPoint, [each.Location.Latitude, each.Location.Longitude]]),
        //   );
        // });
        // repeaters.sort((a: RepeaterStructured, b: RepeaterStructured): number => a.Location.Distance! - b.Location.Distance!);
        const unique = {};
        const mapped = [
            ...simplex
                .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm)),
            ...repeaters
                // .filter(filterMinimumRepeaterCount(3, repeaters))
                .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm))
                // .filter(filterDistance(100))
                .filter(radio_helpers_1.filterMode(radio_helpers_1.Mode.FM, radio_helpers_1.Mode.DStar)),
        ]
            .map((map, index) => ({ ...convertToRadio(map), 'Channel Number': index + 1 }))
            .filter((filter) => {
            const name = `${filter['Receive Frequency']} ${filter['Transmit Frequency']} ${filter['Tone Mode']} ${filter.CTCSS} ${filter['Rx CTCSS']} ${filter.DCS}`;
            if (unique[name]) {
                return false;
            }
            unique[name] = true;
            return true;
        })
            .slice(0, 500)
            .sort((a, b) => parseFloat(a.CTCSS) - parseFloat(b.CTCSS))
            .sort((a, b) => a['Receive Frequency'] - b['Receive Frequency'])
            .sort((a, b) => parseFloat(a.CTCSS) - parseFloat(b.CTCSS))
            .sort((a, b) => a['Receive Frequency'] - b['Receive Frequency'])
            .map((map, index) => ({ ...map, 'Channel Number': index + 1 }));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-A`, mapped.slice(0, 99).map((map, index) => ({ ...map, 'Channel Number': index + 1 }))));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-B`, mapped.slice(99, 198).map((map, index) => ({ ...map, 'Channel Number': index + 1 }))));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-C`, mapped.slice(198, 297).map((map, index) => ({ ...map, 'Channel Number': index + 1 }))));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-D`, mapped.slice(297, 396).map((map, index) => ({ ...map, 'Channel Number': index + 1 }))));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-E`, mapped.slice(396, 495).map((map, index) => ({ ...map, 'Channel Number': index + 1 }))));
        await Promise.all(promises);
    }
    function convertToRadio(repeater) {
        const Name = `${radio_helpers_1.buildName(repeater)} ${radio_helpers_1.getRepeaterSuffix(repeater)}`;
        const Receive = repeater.Frequency.Output;
        const Transmit = repeater.Frequency.Input;
        const OffsetFrequency = repeater.Frequency.Input - repeater.Frequency.Output;
        const TransmitSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Input);
        const ReceiveSquelchTone = (repeater.SquelchTone && repeater.SquelchTone.Output);
        const TransmitDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Input);
        const ReceiveDigitalTone = (repeater.DigitalTone && repeater.DigitalTone.Output);
        const Comment = radio_helpers_1.buildComment(repeater);
        let OperatingMode = wcs7100_1.Wcs7100OperatingMode.FM; // (repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) ? Wcs7100OperatingMode.DV : Wcs7100OperatingMode.FM;
        let YourCallsign = wcs7100_1.Wcs7100YourCallsign.None; // OperatingMode === Wcs7100OperatingMode.DV ? Wcs7100YourCallsign.CQCQCQ : Wcs7100YourCallsign.None;
        let Rpt1CallSign = '';
        if (repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) {
            OperatingMode = wcs7100_1.Wcs7100OperatingMode.DV;
            YourCallsign = wcs7100_1.Wcs7100YourCallsign.CQCQCQ;
            Rpt1CallSign = convertDStarCallSign(repeater.Callsign, repeater.Digital.DStar.Node);
        }
        let ToneMode = wcs7100_1.Wcs7100ToneMode.None;
        if (TransmitSquelchTone) {
            ToneMode = wcs7100_1.Wcs7100ToneMode.Tone; // "TONE ENC";
        }
        else if (TransmitDigitalTone) {
            ToneMode = wcs7100_1.Wcs7100ToneMode.DTCS; // "DCS";
        }
        if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
            ToneMode = wcs7100_1.Wcs7100ToneMode.T_Sql; // "TONE SQL";
        }
        else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
            ToneMode = wcs7100_1.Wcs7100ToneMode.DTCS; // "DCS";
        }
        const CTCSS = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz');
        const Rx_CTCSS = ((ReceiveSquelchTone || 100).toFixed(1) + ' Hz');
        const DCS = radio_helpers_1.buildDCS(TransmitDigitalTone);
        return new wcs7100_1.Wcs7100({
            'Receive Frequency': Receive.toFixed(5),
            'Transmit Frequency': Transmit.toFixed(5),
            'Offset Frequency': convertOffsetFrequency(OffsetFrequency),
            'Offset Direction': convertOffsetDirection(OffsetFrequency),
            'Operating Mode': OperatingMode,
            Name,
            'Tone Mode': ToneMode,
            CTCSS,
            'Rx CTCSS': Rx_CTCSS,
            DCS,
            Comment,
            'Your Callsign': YourCallsign,
            'Rpt-1 CallSign': Rpt1CallSign,
        });
    }
    function convertOffsetFrequency(OffsetFrequency) {
        switch (Math.abs(Math.round(OffsetFrequency * 10)) / 10) {
            case 0:
                return wcs7100_1.Wcs7100OffsetFrequency.None;
            case 0.1:
                return wcs7100_1.Wcs7100OffsetFrequency.$100_kHz;
            case 0.4:
                return wcs7100_1.Wcs7100OffsetFrequency.$400_kHz;
            case 0.5:
                return wcs7100_1.Wcs7100OffsetFrequency.$500_kHz;
            case 0.6:
                return wcs7100_1.Wcs7100OffsetFrequency.$600_kHz;
            case 1:
                return wcs7100_1.Wcs7100OffsetFrequency.$1_MHz;
            case 1.6:
                return wcs7100_1.Wcs7100OffsetFrequency.$1_60_MHz;
            case 2.5:
                return wcs7100_1.Wcs7100OffsetFrequency.$2_50_MHz;
            case 3:
                return wcs7100_1.Wcs7100OffsetFrequency.$3_MHz;
            case 5:
                return wcs7100_1.Wcs7100OffsetFrequency.$5_MHz;
            case 5.05:
                return wcs7100_1.Wcs7100OffsetFrequency.$5_05_MHz;
            case 7.6:
                return wcs7100_1.Wcs7100OffsetFrequency.$7_60_MHz;
        }
        log(chalk_1.default.red('ERROR'), 'convertOffsetFrequency', 'unknown', OffsetFrequency);
        return wcs7100_1.Wcs7100OffsetFrequency.None;
    }
    function convertOffsetDirection(OffsetFrequency) {
        if (OffsetFrequency === 0) {
            return wcs7100_1.Wcs7100OffsetDirection.Simplex;
        }
        else if (OffsetFrequency < 0) {
            return wcs7100_1.Wcs7100OffsetDirection.Minus;
        }
        else if (OffsetFrequency > 0) {
            return wcs7100_1.Wcs7100OffsetDirection.Plus;
        }
        log(chalk_1.default.red('ERROR'), 'convertOffsetDirection', 'unknown', OffsetFrequency);
        return wcs7100_1.Wcs7100OffsetDirection.Simplex;
    }
    function convertDStarCallSign(callsign, node) {
        if (callsign && node) {
            const callSignModuleRegex = new RegExp(`${callsign}? ?\\(?([ABCDEFG])\\)?`);
            const callSignModule = node.match(callSignModuleRegex);
            log('convertDStarCallSign', 'callsign', callsign, 'node', node, 'callSignModule', callSignModule, `${callsign} ${callSignModule[1]}`);
            const callsignPadded = `${callsign}        `;
            return `${callsignPadded.substr(0, 7)}${callSignModule[1]}`;
        }
        return '';
    }
});
