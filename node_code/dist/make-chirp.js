var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/log-helpers", "@interfaces/chirp", "chalk", "@helpers/radio-helpers", "commander", "@helpers/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const chirp_1 = require("@interfaces/chirp");
    const chalk_1 = __importDefault(require("chalk"));
    const radio_helpers_1 = require("@helpers/radio-helpers");
    const commander_1 = require("commander");
    const helpers_1 = require("@helpers/helpers");
    const log = log_helpers_1.createLog('Make Chirp');
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
                await doIt(latLong, `../data/repeaters/chirp/${name}`);
            }
        }
    });
    log('Program Parse Args');
    commander_1.program.parse(process.argv);
    async function doIt(location, outFileName) {
        const simplex = await radio_helpers_1.loadSimplex(/FM|SAT|ISS|MURS|GMRS|FRS/i);
        const repeaters = await radio_helpers_1.loadRepeaters(location);
        const mapped = [
            ...simplex
                .filter(radio_helpers_1.filterOutputFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$1_25_m, radio_helpers_1.FrequencyBand.$70_cm, radio_helpers_1.FrequencyBand.MURS, radio_helpers_1.FrequencyBand.GMRS))
                .filter(radio_helpers_1.filterInputFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$1_25_m, radio_helpers_1.FrequencyBand.$70_cm, radio_helpers_1.FrequencyBand.MURS, radio_helpers_1.FrequencyBand.GMRS)),
            // .filter((filter) => filter.Callsign !== 'FM Simplex'),
            ...repeaters
                .filter(radio_helpers_1.filterOutputFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$1_25_m, radio_helpers_1.FrequencyBand.$70_cm, radio_helpers_1.FrequencyBand.MURS, radio_helpers_1.FrequencyBand.GMRS))
                .filter(radio_helpers_1.filterInputFrequencies(radio_helpers_1.FrequencyBand.$2_m, radio_helpers_1.FrequencyBand.$1_25_m, radio_helpers_1.FrequencyBand.$70_cm, radio_helpers_1.FrequencyBand.MURS, radio_helpers_1.FrequencyBand.GMRS))
                .filter(radio_helpers_1.filterMode(radio_helpers_1.Mode.FM)),
        ]
            .map((map) => convertToRadio(map));
        await saveSubset(mapped, 128, `${outFileName}-128`);
        await saveSubset(mapped, 200, `${outFileName}-200`);
    }
    async function saveSubset(mapped, length, fileName) {
        const subset = mapped.slice(0, length);
        const duplexFilter = (filter) => filter.Duplex !== chirp_1.ChirpDuplex.Simplex || filter.Tone !== chirp_1.ChirpToneMode.None;
        // const fmOrDVFilter = (filter: Chirp): boolean => filter['Operating Mode'] === ChirpOperatingMode.FM || filter['Operating Mode'] === ChirpOperatingMode.DV;
        const issOrSatFilter = (filter) => /^[A-Z]* ISS/.test(filter.Name) || /^[A-Z]* SAT/.test(filter.Name);
        const sotaOrWarcFilter = (filter) => /^[A-Z]* SOTA/.test(filter.Name) || /^[A-Z]* WARC/.test(filter.Name);
        const gmrsFilter = (filter) => /^GMRS/.test(filter.Name) || /^FRS/.test(filter.Name);
        const mursFilter = (filter) => /^MURS/.test(filter.Name);
        const simplexChirp = subset
            .filter((filter) => !duplexFilter(filter) && !issOrSatFilter(filter) && !sotaOrWarcFilter(filter) && !gmrsFilter(filter) && !mursFilter(filter))
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .sort((a, b) => a.Frequency - b.Frequency);
        const sotaChirp = subset
            .filter((filter) => sotaOrWarcFilter(filter))
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .sort((a, b) => a.Frequency - b.Frequency);
        const issChirp = subset
            .filter((filter) => issOrSatFilter(filter))
            .sort((a, b) => a.Frequency - b.Frequency)
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);
        const mursChirp = subset
            .filter((filter) => mursFilter(filter))
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0)
            .sort((a, b) => a.Frequency - b.Frequency);
        const gmrsChirp = subset
            .filter((filter) => gmrsFilter(filter))
            .sort((a, b) => a.Frequency - b.Frequency)
            .sort((a, b) => parseFloat(a.Name.replace(/[^\d]*/, '')) - parseFloat(b.Name.replace(/[^\d]*/, '')));
        const duplexChirp = subset
            .filter((filter) => duplexFilter(filter) && !issOrSatFilter(filter) && !sotaOrWarcFilter(filter))
            .sort((a, b) => a.Frequency - b.Frequency)
            .sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);
        const recombine = [...simplexChirp, ...mursChirp, ...gmrsChirp, ...sotaChirp, ...issChirp, ...duplexChirp]
            .map((map, index) => ({ ...map, Name: map.Name.replace(/^FM /, '').trim().replace(/^SAT /, '').trim(), Location: index }));
        return fs_helpers_1.writeToCsv(fileName, recombine);
    }
    function convertToRadio(repeater) {
        const { Name, Receive, Transmit, OffsetFrequency, TransmitSquelchTone, ReceiveSquelchTone, TransmitDigitalTone, ReceiveDigitalTone, Comment, } = radio_helpers_1.radioCommon(repeater);
        let ToneMode = chirp_1.ChirpToneMode.None;
        if (TransmitSquelchTone) {
            ToneMode = chirp_1.ChirpToneMode.Tone; // "TONE ENC";
        }
        else if (TransmitDigitalTone) {
            ToneMode = chirp_1.ChirpToneMode.DTCS; // "DCS";
        }
        if (TransmitSquelchTone && ReceiveSquelchTone) {
            if (TransmitSquelchTone === ReceiveSquelchTone) {
                ToneMode = chirp_1.ChirpToneMode.T_Sql; // "TONE SQL";
            }
            else {
                ToneMode = chirp_1.ChirpToneMode.Cross;
            }
        }
        else if (TransmitDigitalTone && ReceiveDigitalTone && TransmitDigitalTone === ReceiveDigitalTone) {
            if (TransmitDigitalTone === ReceiveDigitalTone) {
                ToneMode = chirp_1.ChirpToneMode.DTCS; // "TONE SQL";
            }
            else {
                ToneMode = chirp_1.ChirpToneMode.Cross;
            }
        }
        const CTCSS = TransmitSquelchTone || 100;
        const Rx_CTCSS = ReceiveSquelchTone || TransmitSquelchTone || 100;
        const DCS = parseInt(radio_helpers_1.buildDCS(TransmitDigitalTone), 10);
        const Rx_DCS = parseInt(radio_helpers_1.buildDCS(ReceiveDigitalTone || TransmitDigitalTone), 10);
        return new chirp_1.Chirp({
            Name,
            Frequency: Receive,
            Duplex: convertOffsetDirection(OffsetFrequency),
            Offset: Transmit,
            Tone: ToneMode,
            rToneFreq: CTCSS,
            cToneFreq: Rx_CTCSS,
            DtcsCode: DCS,
            DtcsRxCode: Rx_DCS,
            Comment,
        });
    }
    function convertOffsetDirection(OffsetFrequency) {
        if (OffsetFrequency === 0) {
            return chirp_1.ChirpDuplex.Simplex;
            // } else if (OffsetFrequency < 0) {
            //   return ChirpDuplex.Minus;
            // } else if (OffsetFrequency > 0) {
            //   return ChirpDuplex.Plus;
        }
        else {
            return chirp_1.ChirpDuplex.Split;
        }
        log(chalk_1.default.red('ERROR'), 'convertOffsetDirection', 'unknown', OffsetFrequency);
        return chirp_1.ChirpDuplex.Simplex;
    }
});
