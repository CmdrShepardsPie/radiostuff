var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "commander", "@helpers/log-helpers", "chalk", "./modules/scraper", "@helpers/fs-helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const commander_1 = require("commander");
    const log_helpers_1 = require("@helpers/log-helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const scraper_1 = __importDefault(require("./modules/scraper"));
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log = log_helpers_1.createLog('Get Repeaters');
    log('Program Setup');
    commander_1.program
        .version('0.0.1')
        .arguments('<location>')
        .action(async (location) => {
        log('Program Action');
        if (location) {
            await getRepeaters(location, 200);
        }
    });
    log('Program Parse Args');
    commander_1.program.parse(process.argv);
    async function getRepeaters(place, distance) {
        log(chalk_1.default.green('getRepeaters'), place, distance);
        const scraper = new scraper_1.default(place, distance);
        const repeaters = await scraper.scrape();
        const columns = {};
        repeaters.forEach((row) => {
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
        await Promise.all(repeaters.map(async (row) => {
            Object.entries(row).forEach((entry) => {
                const key = entry[0];
                const value = entry[1];
                if (columns[key].length === 1 && columns[key][0] === '' && value === '') {
                    // @ts-ignore
                    row[key] = true;
                }
            });
            await fs_helpers_1.writeToJson(`../data/repeaters/scraped/json/${row.state_id}/${row.ID}`, row);
            await fs_helpers_1.writeToCsv(`../data/repeaters/scraped/csv/${row.state_id}/${row.ID}`, row);
        }));
        const stateCity = place.toString().split(`,`);
        const placePath = `${(stateCity[1] || '.').trim()}/${stateCity[0].trim()}`;
        log(chalk_1.default.yellow('Scraped'), repeaters.length, placePath);
        await fs_helpers_1.writeToJson(`../data/repeaters/scraped/json/${placePath}`, repeaters);
        await fs_helpers_1.writeToCsv(`../data/repeaters/scraped/csv/${placePath}`, repeaters);
    }
});
