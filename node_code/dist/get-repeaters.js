var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "commander", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "chalk", "./modules/scraper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const commander_1 = require("commander");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const helpers_1 = require("@helpers/helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const scraper_1 = __importDefault(require("./modules/scraper"));
    const log = log_helpers_1.createLog('Get Repeaters');
    log('program');
    commander_1.program
        .version('0.0.1')
        .arguments('<location>')
        .action(async (location) => {
        if (location) {
            await save(location, 200);
        }
    });
    commander_1.program.parse(process.argv);
    async function save(place, distance) {
        log(chalk_1.default.green('Save'), place, distance);
        const scraper = new scraper_1.default(place, distance);
        const result = await scraper.process();
        // @ts-ignore
        const columns = {};
        result.forEach((row) => {
            Object.entries(row).forEach((entry) => {
                const key = entry[0];
                const value = entry[1];
                if (!columns[key]) {
                    columns[key] = [];
                }
                if (columns[key].indexOf(value) === -1) {
                    columns[key].push(value);
                }
            });
        });
        result.forEach((row) => {
            Object.entries(row).forEach((entry) => {
                const key = entry[0];
                const value = entry[1];
                if (columns[key].length === 1 && columns[key][0] === '' && value === '') {
                    // @ts-ignore
                    row[key] = 'yes';
                }
            });
        });
        result.sort((a, b) => {
            const aMi = helpers_1.numberToString(a.Mi || 0, 4, 5);
            const bMi = helpers_1.numberToString(b.Mi || 0, 4, 5);
            const aName = a.Call;
            const bName = b.Call;
            const aFrequency = helpers_1.numberToString(a.Frequency || 0, 4, 5);
            const bFrequency = helpers_1.numberToString(b.Frequency || 0, 4, 5);
            const aStr = `${aMi} ${aName} ${aFrequency}`;
            const bStr = `${bMi} ${bName} ${bFrequency}`;
            return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
        });
        // result.sort((a, b) => {(a.Call > b.Call ? 1 : a.Call < b.Call ? -1 : 0));
        // result.sort((a, b) => (a.Frequency - b.Frequency));
        // result.sort((a, b) => (a.Mi - b.Mi));
        // console.log(place, distance, result.length);
        const parts = place.toString().split(`,`);
        const subPlace = `${(parts[1] || '.').trim()}/${parts[0].trim()}`;
        log(chalk_1.default.yellow('Results'), result.length, subPlace);
        await fs_helpers_1.writeToJsonAndCsv(`../data/repeaters/results/${subPlace}`, result);
    }
});
