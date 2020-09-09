var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/log-helpers", "@interfaces/wcs7100", "chalk", "@helpers/radio-helpers", "commander", "@helpers/helpers"], factory);
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
    const helpers_1 = require("@helpers/helpers");
    const log = log_helpers_1.createLog('Make Wcs7100');
    // const homePoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St
    // const DenverPoint: Point = [39.742043, -104.991531];
    // const ColoradoSpringsPoint: Point = [38.846127, -104.800644];
    log('Program Setup');
    commander_1.program
        .version('0.0.1')
        .arguments('<location> <name>')
        .action(async (location, name) => {
        log('Program Action', location, name);
        if (location) {
            const latLong = helpers_1.splitCoordinates(location);
            if (helpers_1.checkCoordinates(latLong)) {
                await doIt(latLong, `../data/repeaters/wcs7100/${name}`);
            }
        }
    });
    log('Program Parse Args');
    commander_1.program.parse(process.argv);
    async function doIt(location, outFileName) {
        const promises = [];
        const simplex = await radio_helpers_1.loadSimplex(/^((?!(Fusion|Mixed|CW|RTTY)).)*$/i);
        const repeaters = await radio_helpers_1.loadRepeaters(location);
        const mapped = [
            ...simplex
                .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$160_m, radio_helpers_1.FrequencyBand.$80_m, radio_helpers_1.FrequencyBand.$60_m, radio_helpers_1.FrequencyBand.$40_m, radio_helpers_1.FrequencyBand.$30_m, radio_helpers_1.FrequencyBand.$20_m, radio_helpers_1.FrequencyBand.$17_m, radio_helpers_1.FrequencyBand.$15_m, radio_helpers_1.FrequencyBand.$12_m, radio_helpers_1.FrequencyBand.$10_m, radio_helpers_1.FrequencyBand.$6_m, radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm)),
            ...repeaters
                .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$160_m, radio_helpers_1.FrequencyBand.$80_m, radio_helpers_1.FrequencyBand.$60_m, radio_helpers_1.FrequencyBand.$40_m, radio_helpers_1.FrequencyBand.$30_m, radio_helpers_1.FrequencyBand.$20_m, radio_helpers_1.FrequencyBand.$17_m, radio_helpers_1.FrequencyBand.$15_m, radio_helpers_1.FrequencyBand.$12_m, radio_helpers_1.FrequencyBand.$10_m, radio_helpers_1.FrequencyBand.$6_m, radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm))
                .filter(radio_helpers_1.filterMode(radio_helpers_1.Mode.FM, radio_helpers_1.Mode.DStar)),
        ]
            .map((map, index) => convertToRadio(map))
            // The lower frequencies are very noisy and have to turn the SQL up high which cuts out low signals in the higher frequencies
            .filter((filter) => filter['Operating Mode'] === wcs7100_1.Wcs7100OperatingMode.FM ||
            filter['Operating Mode'] === wcs7100_1.Wcs7100OperatingMode.DV ||
            filter['Receive Frequency'] >= 10);
        // const simplexFilter = (filter: Wcs7100): boolean => filter['Offset Direction'] === Wcs7100OffsetDirection.Simplex && filter['Tone Mode'] === Wcs7100ToneMode.None;
        const duplexFilter = (filter) => filter['Offset Direction'] !== wcs7100_1.Wcs7100OffsetDirection.Simplex || filter['Tone Mode'] !== wcs7100_1.Wcs7100ToneMode.None;
        const fmOrDVFilter = (filter) => filter['Operating Mode'] === wcs7100_1.Wcs7100OperatingMode.FM || filter['Operating Mode'] === wcs7100_1.Wcs7100OperatingMode.DV;
        const issOrSatFilter = (filter) => /^[A-Z]* ISS/.test(filter.Name) || /^[A-Z]* SAT/.test(filter.Name);
        const sotaOrWarcFilter = (filter) => /^[A-Z]* SOTA/.test(filter.Name) || /^[A-Z]* WARC/.test(filter.Name);
        const A = mapped
            .filter((filter) => (issOrSatFilter(filter) || sotaOrWarcFilter(filter) || !fmOrDVFilter(filter)))
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .sort((a, b) => a['Transmit Frequency'] - b['Transmit Frequency'])
            .sort((a, b) => a['Receive Frequency'] - b['Receive Frequency'])
            .slice(0, 99)
            .map((map, index) => ({ ...map, 'Channel Number': index + 1 }));
        const B = mapped
            .filter((filter) => !duplexFilter(filter) && !issOrSatFilter(filter) && !sotaOrWarcFilter(filter) && fmOrDVFilter(filter))
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .sort((a, b) => a['Transmit Frequency'] - b['Transmit Frequency'])
            .sort((a, b) => a['Receive Frequency'] - b['Receive Frequency'])
            .slice(0, 99)
            .map((map, index) => ({ ...map, 'Channel Number': index + 1 }));
        const C = mapped
            .filter((filter) => duplexFilter(filter) && !issOrSatFilter(filter))
            .slice(0, 99)
            .sort((a, b) => a['Transmit Frequency'] - b['Transmit Frequency'])
            .sort((a, b) => a['Receive Frequency'] - b['Receive Frequency'])
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .map((map, index) => ({ ...map, 'Channel Number': index + 1 }));
        const D = mapped
            .filter((filter) => duplexFilter(filter) && !issOrSatFilter(filter))
            .slice(99, 198)
            .sort((a, b) => a['Transmit Frequency'] - b['Transmit Frequency'])
            .sort((a, b) => a['Receive Frequency'] - b['Receive Frequency'])
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .map((map, index) => ({ ...map, 'Channel Number': index + 1 }));
        const E = mapped
            .filter((filter) => duplexFilter(filter) && !issOrSatFilter(filter))
            .slice(198, 297)
            .sort((a, b) => a['Transmit Frequency'] - b['Transmit Frequency'])
            .sort((a, b) => a['Receive Frequency'] - b['Receive Frequency'])
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .map((map, index) => ({ ...map, 'Channel Number': index + 1 }));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-A`, A));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-B`, B));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-C`, C));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-D`, D));
        promises.push(fs_helpers_1.writeToCsv(`${outFileName}-E`, E));
        await Promise.all(promises);
    }
    function convertToRadio(repeater) {
        const { Name, Receive, Transmit, OffsetFrequency, TransmitSquelchTone, ReceiveSquelchTone, TransmitDigitalTone, ReceiveDigitalTone, Comment, } = radio_helpers_1.radioCommon(repeater);
        let OperatingMode = wcs7100_1.Wcs7100OperatingMode.FM; // (repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) ? Wcs7100OperatingMode.DV : Wcs7100OperatingMode.FM;
        let YourCallSign = wcs7100_1.Wcs7100YourCallsign.None; // OperatingMode === Wcs7100OperatingMode.DV ? Wcs7100YourCallsign.CQCQCQ : Wcs7100YourCallsign.None;
        let Rpt1CallSign = '';
        let Rpt2CallSign = '';
        if ((repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) || /^Digital/.test(repeater.Callsign) || /^D[ -]?Star/.test(repeater.Callsign)) {
            OperatingMode = wcs7100_1.Wcs7100OperatingMode.DV;
            YourCallSign = wcs7100_1.Wcs7100YourCallsign.CQCQCQ;
            if (repeater.Digital && repeater.Digital.DStar && repeater.Digital.DStar.Node) {
                Rpt1CallSign = convertDStarCallSign(repeater.Callsign, repeater.Digital.DStar.Node);
                Rpt2CallSign = convertDStarCallSign(repeater.Callsign, 'G');
            }
        }
        else if (/^AM/.test(repeater.Callsign)) {
            OperatingMode = wcs7100_1.Wcs7100OperatingMode.AM;
        }
        else if (/^SSB/.test(repeater.Callsign)) {
            if (repeater.Frequency.Output <= 10) {
                OperatingMode = wcs7100_1.Wcs7100OperatingMode.LSB;
            }
            else {
                OperatingMode = wcs7100_1.Wcs7100OperatingMode.USB;
            }
        }
        else if (/^USB/.test(repeater.Callsign)) {
            OperatingMode = wcs7100_1.Wcs7100OperatingMode.USB;
        }
        else if (/^LSB/.test(repeater.Callsign)) {
            OperatingMode = wcs7100_1.Wcs7100OperatingMode.LSB;
        }
        else if (/^CW/.test(repeater.Callsign)) {
            OperatingMode = wcs7100_1.Wcs7100OperatingMode.CW;
        }
        else if (/^RTTY/.test(repeater.Callsign)) {
            OperatingMode = wcs7100_1.Wcs7100OperatingMode.RTTY;
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
        // tslint:disable-next-line:variable-name
        const Rx_CTCSS = ((ReceiveSquelchTone || TransmitSquelchTone || 100).toFixed(1) + ' Hz');
        const DCS = radio_helpers_1.buildDCS(TransmitDigitalTone);
        return new wcs7100_1.Wcs7100({
            'Receive Frequency': Receive.toFixed(5),
            'Transmit Frequency': Transmit.toFixed(5),
            'Offset Frequency': radio_helpers_1.convertOffsetFrequency(OffsetFrequency),
            'Offset Direction': convertOffsetDirection(OffsetFrequency),
            'Operating Mode': OperatingMode,
            Name,
            'Tone Mode': ToneMode,
            CTCSS,
            'Rx CTCSS': Rx_CTCSS,
            DCS,
            Comment,
            'Your Callsign': YourCallSign,
            'Rpt-1 CallSign': Rpt1CallSign,
            'Rpt-2 CallSign': Rpt2CallSign,
        });
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
    function convertDStarCallSign(callSign, node) {
        if (callSign && node) {
            const callSignModuleRegex = new RegExp(`(${callSign} )?\\(?([ABCDEFG])\\)?`);
            const callSignModule = node.match(callSignModuleRegex);
            const callSignPadded = `${callSign}        `;
            return `${callSignPadded.substr(0, 7)}${callSignModule[callSignModule.length - 1]}`;
        }
        return '';
    }
});
