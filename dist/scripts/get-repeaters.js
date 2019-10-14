(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/csv-helpers", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "chalk", "module-alias/register", "./modules/scraper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const csv_helpers_1 = require("@helpers/csv-helpers");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const helpers_1 = require("@helpers/helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const chalk_1 = require("chalk");
    require("module-alias/register");
    const scraper_1 = require("./modules/scraper");
    const log = log_helpers_1.createLog("Get Repeaters");
    async function save(place, distance) {
        log(chalk_1.default.green("Save"), place, distance);
        const scraper = new scraper_1.default(place, distance);
        const result = await scraper.process();
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
                if (columns[key].length === 1 && columns[key][0] === "" && value === "") {
                    // @ts-ignore
                    row[key] = "yes";
                }
            });
        });
        result.sort((a, b) => {
            const aMi = helpers_1.numberToString(a.Mi, 4, 5);
            const bMi = helpers_1.numberToString(b.Mi, 4, 5);
            const aName = a.Call;
            const bName = b.Call;
            const aFrequency = helpers_1.numberToString(a.Frequency, 4, 5);
            const bFrequency = helpers_1.numberToString(b.Frequency, 4, 5);
            const aStr = `${aMi} ${aName} ${aFrequency}`;
            const bStr = `${bMi} ${bName} ${bFrequency}`;
            return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
        });
        // result.sort((a: any, b: any) => {(a.Call > b.Call ? 1 : a.Call < b.Call ? -1 : 0));
        // result.sort((a: any, b: any) => (a.Frequency - b.Frequency));
        // result.sort((a: any, b: any) => (a.Mi - b.Mi));
        // console.log(place, distance, result.length);
        const parts = place.toString().split(`,`);
        const subPlace = `${(parts[1] || ".").trim()}/${parts[0].trim()}`;
        log(chalk_1.default.yellow("Results"), result.length, subPlace);
        await fs_helpers_1.writeToJsonAndCsv(`data/repeaters/results/${subPlace}`, result);
    }
    exports.default = (async () => {
        const countyFileData = await fs_helpers_1.readFileAsync("data/Colorado_County_Seats.csv");
        const countyData = await csv_helpers_1.parseAsync(countyFileData, { columns: true });
        const cities = countyData.map((c) => `${c["County Seat"]}, CO`);
        while (cities.length) {
            const name = cities.shift();
            if (name) {
                await save(name, 200);
            }
        }
    })();
});
// export default start();
//# sourceMappingURL=get-repeaters.js.map