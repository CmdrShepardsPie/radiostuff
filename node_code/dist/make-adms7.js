var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/log-helpers", "@helpers/radio-helpers", "chalk", "@interfaces/adms7", "commander", "@helpers/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const radio_helpers_1 = require("@helpers/radio-helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const adms7_1 = require("@interfaces/adms7");
    const commander_1 = require("commander");
    const helpers_1 = require("@helpers/helpers");
    const log = log_helpers_1.createLog('Make Adms7');
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
                await doIt(latLong, `../data/repeaters/adms7/${name}`);
            }
        }
    });
    log('Program Parse Args');
    commander_1.program.parse(process.argv);
    async function doIt(location, outFileName) {
        const simplex = await radio_helpers_1.loadSimplex(/FM|Digital|Mixed|Fusion/i);
        const repeaters = await radio_helpers_1.loadRepeaters(location);
        const mapped = [
            ...simplex
                .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm)),
            ...repeaters
                .filter(radio_helpers_1.filterFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$70_cm))
                .filter(radio_helpers_1.filterMode(radio_helpers_1.Mode.FM, radio_helpers_1.Mode.YSF)),
        ]
            .map((map, index) => ({ ...convertToRadio(map), Number: index + 1 }))
            .concat([...new Array(500)].map(() => ({ ClockShift: adms7_1.Adms7ClockShift.Off, Bank: adms7_1.Adms7Bank.A })))
            .slice(0, 500)
            .map((map, index) => ({ ...map, Number: index + 1 }));
        return fs_helpers_1.writeToCsv(outFileName, mapped, false);
    }
    function convertToRadio(repeater) {
        const { Name, TransmitSquelchTone, ReceiveSquelchTone, TransmitDigitalTone, ReceiveDigitalTone, Comment, } = radio_helpers_1.rtSystemsCommon(repeater);
        const Receive = repeater.Frequency.Output.toFixed(5);
        const Transmit = repeater.Frequency.Input.toFixed(5);
        const OffsetFrequency = repeater.Frequency.Input - repeater.Frequency.Output;
        const Offset = Math.abs(Math.round(OffsetFrequency * 100) / 100).toFixed(5);
        let ToneMode = adms7_1.Adms7ToneMode.Off;
        if (TransmitSquelchTone) {
            ToneMode = adms7_1.Adms7ToneMode.Tone_Enc; // "TONE ENC";
        }
        else if (TransmitDigitalTone) {
            ToneMode = adms7_1.Adms7ToneMode.DCS; // "DCS";
        }
        if (TransmitSquelchTone && ReceiveSquelchTone && TransmitSquelchTone === ReceiveSquelchTone) {
            ToneMode = adms7_1.Adms7ToneMode.Tone_Sql; // "TONE SQL";
        }
        else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
            ToneMode = adms7_1.Adms7ToneMode.DCS; // "DCS";
        }
        const CTCSS = ((TransmitSquelchTone || 100).toFixed(1) + ' Hz');
        const DCS = radio_helpers_1.buildDCS(TransmitDigitalTone);
        return new adms7_1.Adms7({
            Receive,
            Transmit,
            Offset,
            Direction: convertOffsetDirection(OffsetFrequency),
            Name,
            ToneMode,
            CTCSS,
            DCS,
            Comment,
        });
    }
    function convertOffsetDirection(OffsetFrequency) {
        if (OffsetFrequency === 0) {
            return adms7_1.Adms7OffsetDirection.Off;
        }
        else if (OffsetFrequency < 0) {
            return adms7_1.Adms7OffsetDirection.Minus;
        }
        else if (OffsetFrequency > 0) {
            return adms7_1.Adms7OffsetDirection.Plus;
        }
        log(chalk_1.default.red('ERROR'), 'convertOffsetDirection', 'unknown', OffsetFrequency);
        return adms7_1.Adms7OffsetDirection.Off;
    }
});
