"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const csv_helpers_1 = require("@helpers/csv-helpers");
const fs_helpers_1 = require("@helpers/fs-helpers");
const helpers_1 = require("@helpers/helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const chalk_1 = __importDefault(require("chalk"));
const scraper_1 = __importDefault(require("./modules/scraper"));
const log = log_helpers_1.createLog('Get Repeaters');
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
exports.default = (async () => {
    const countyFileData = await fs_helpers_1.readFileAsync('../data/Colorado_County_Seats.csv');
    const countyData = await csv_helpers_1.parseAsync(countyFileData, { columns: true });
    const cities = countyData.map((c) => `${c['County Seat']}, CO`);
    while (cities.length) {
        const name = cities.shift();
        if (name) {
            await save(name, 200);
        }
    }
})();
// export default start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXQtcmVwZWF0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaUNBQStCO0FBRS9CLHNEQUFrRDtBQUNsRCxvREFBdUU7QUFDdkUsOENBQWtEO0FBQ2xELHNEQUFpRDtBQUdqRCxrREFBMEI7QUFDMUIsZ0VBQXdDO0FBRXhDLE1BQU0sR0FBRyxHQUE0Qix1QkFBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRWhFLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBc0IsRUFBRSxRQUFnQjtJQUMxRCxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFMUMsTUFBTSxPQUFPLEdBQVksSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUV0RCxNQUFNLE1BQU0sR0FBbUIsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFdkQsYUFBYTtJQUNiLE1BQU0sT0FBTyxHQUFxRSxFQUFFLENBQUM7SUFDckYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQWlCLEVBQUUsRUFBRTtRQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQThDLEVBQUUsRUFBRTtZQUM3RSxNQUFNLEdBQUcsR0FBdUIsS0FBSyxDQUFDLENBQUMsQ0FBdUIsQ0FBQztZQUMvRCxNQUFNLEtBQUssR0FBZ0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDbkI7WUFDRCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FB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Q0FBQztJQUN4RixNQUFNLFVBQVUsR0FBa0IsTUFBTSx3QkFBVSxDQUFDLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3RGLE1BQU0sTUFBTSxHQUFhLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFjLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDcEIsTUFBTSxJQUFJLEdBQXVCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoRCxJQUFJLElBQUksRUFBRTtZQUNSLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN2QjtLQUNGO0FBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVMLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnbW9kdWxlLWFsaWFzL3JlZ2lzdGVyJztcblxuaW1wb3J0IHsgcGFyc2VBc3luYyB9IGZyb20gJ0BoZWxwZXJzL2Nzdi1oZWxwZXJzJztcbmltcG9ydCB7IHJlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XG5pbXBvcnQgeyBudW1iZXJUb1N0cmluZyB9IGZyb20gJ0BoZWxwZXJzL2hlbHBlcnMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xuaW1wb3J0IHsgSUNvdW50eVNlYXQgfSBmcm9tICdAaW50ZXJmYWNlcy9pLWNvdW50eS1zZWF0JztcbmltcG9ydCB7IElSZXBlYXRlclJhdyB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktcmVwZWF0ZXItcmF3JztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgU2NyYXBlciBmcm9tICcuL21vZHVsZXMvc2NyYXBlcic7XG5cbmNvbnN0IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQgPSBjcmVhdGVMb2coJ0dldCBSZXBlYXRlcnMnKTtcblxuYXN5bmMgZnVuY3Rpb24gc2F2ZShwbGFjZTogc3RyaW5nIHwgbnVtYmVyLCBkaXN0YW5jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIGxvZyhjaGFsay5ncmVlbignU2F2ZScpLCBwbGFjZSwgZGlzdGFuY2UpO1xuXG4gIGNvbnN0IHNjcmFwZXI6IFNjcmFwZXIgPSBuZXcgU2NyYXBlcihwbGFjZSwgZGlzdGFuY2UpO1xuXG4gIGNvbnN0IHJlc3VsdDogSVJlcGVhdGVyUmF3W10gPSBhd2FpdCBzY3JhcGVyLnByb2Nlc3MoKTtcblxuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IGNvbHVtbnM6IHsgW2tleSBpbiBrZXlvZiBJUmVwZWF0ZXJSYXddOiAoc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkKVtdIH0gPSB7fTtcbiAgcmVzdWx0LmZvckVhY2goKHJvdzogSVJlcGVhdGVyUmF3KSA9PiB7XG4gICAgT2JqZWN0LmVudHJpZXMocm93KS5mb3JFYWNoKChlbnRyeTogW3N0cmluZywgKHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCldKSA9PiB7XG4gICAgICBjb25zdCBrZXk6IGtleW9mIElSZXBlYXRlclJhdyA9IGVudHJ5WzBdIGFzIGtleW9mIElSZXBlYXRlclJhdztcbiAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgPSBlbnRyeVsxXTtcbiAgICAgIGlmICghY29sdW1uc1trZXldKSB7XG4gICAgICAgIGNvbHVtbnNba2V5XSA9IFtdO1xuICAgICAgfVxuICAgICAgaWYgKGNvbHVtbnNba2V5XSEuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4gICAgICAgIGNvbHVtbnNba2V5XSEucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJlc3VsdC5mb3JFYWNoKChyb3c6IElSZXBlYXRlclJhdykgPT4ge1xuICAgIE9iamVjdC5lbnRyaWVzKHJvdykuZm9yRWFjaCgoZW50cnk6IFtzdHJpbmcsIChzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQpXSkgPT4ge1xuICAgICAgY29uc3Qga2V5OiBrZXlvZiBJUmVwZWF0ZXJSYXcgPSBlbnRyeVswXSBhcyBrZXlvZiBJUmVwZWF0ZXJSYXc7XG4gICAgICBjb25zdCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkID0gZW50cnlbMV07XG4gICAgICBpZiAoY29sdW1uc1trZXldIS5sZW5ndGggPT09IDEgJiYgY29sdW1uc1trZXldIVswXSA9PT0gJycgJiYgdmFsdWUgPT09ICcnKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcm93W2tleV0gPSAneWVzJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmVzdWx0LnNvcnQoKGE6IElSZXBlYXRlclJhdywgYjogSVJlcGVhdGVyUmF3KSA9PiB7XG4gICAgY29uc3QgYU1pOiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhhLk1pIHx8IDAsIDQsIDUpO1xuICAgIGNvbnN0IGJNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYi5NaSB8fCAwLCA0LCA1KTtcbiAgICBjb25zdCBhTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYS5DYWxsO1xuICAgIGNvbnN0IGJOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBiLkNhbGw7XG4gICAgY29uc3QgYUZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XG4gICAgY29uc3QgYkZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYi5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XG4gICAgY29uc3QgYVN0cjogc3RyaW5nID0gYCR7YU1pfSAke2FOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICBjb25zdCBiU3RyOiBzdHJpbmcgPSBgJHtiTWl9ICR7Yk5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xuICAgIHJldHVybiBhU3RyID4gYlN0ciA/IDEgOiBhU3RyIDwgYlN0ciA/IC0xIDogMDtcbiAgfSk7XG4gIC8vIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7KGEuQ2FsbCA+IGIuQ2FsbCA/IDEgOiBhLkNhbGwgPCBiLkNhbGwgPyAtMSA6IDApKTtcbiAgLy8gcmVzdWx0LnNvcnQoKGEsIGIpID0+IChhLkZyZXF1ZW5jeSAtIGIuRnJlcXVlbmN5KSk7XG4gIC8vIHJlc3VsdC5zb3J0KChhLCBiKSA9PiAoYS5NaSAtIGIuTWkpKTtcblxuICAvLyBjb25zb2xlLmxvZyhwbGFjZSwgZGlzdGFuY2UsIHJlc3VsdC5sZW5ndGgpO1xuXG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IHBsYWNlLnRvU3RyaW5nKCkuc3BsaXQoYCxgKTtcbiAgY29uc3Qgc3ViUGxhY2U6IHN0cmluZyA9IGAkeyhwYXJ0c1sxXSB8fCAnLicpLnRyaW0oKX0vJHtwYXJ0c1swXS50cmltKCl9YDtcblxuICBsb2coY2hhbGsueWVsbG93KCdSZXN1bHRzJyksIHJlc3VsdC5sZW5ndGgsIHN1YlBsYWNlKTtcblxuICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdihgLi4vZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy8ke3N1YlBsYWNlfWAsIHJlc3VsdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IChhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IGNvdW50eUZpbGVEYXRhOiBCdWZmZXIgPSBhd2FpdCByZWFkRmlsZUFzeW5jKCcuLi9kYXRhL0NvbG9yYWRvX0NvdW50eV9TZWF0cy5jc3YnKTtcbiAgY29uc3QgY291bnR5RGF0YTogSUNvdW50eVNlYXRbXSA9IGF3YWl0IHBhcnNlQXN5bmMoY291bnR5RmlsZURhdGEsIHsgY29sdW1uczogdHJ1ZSB9KTtcbiAgY29uc3QgY2l0aWVzOiBzdHJpbmdbXSA9IGNvdW50eURhdGEubWFwKChjOiBJQ291bnR5U2VhdCkgPT4gYCR7Y1snQ291bnR5IFNlYXQnXX0sIENPYCk7XG4gIHdoaWxlIChjaXRpZXMubGVuZ3RoKSB7XG4gICAgY29uc3QgbmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gY2l0aWVzLnNoaWZ0KCk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGF3YWl0IHNhdmUobmFtZSwgMjAwKTtcbiAgICB9XG4gIH1cbn0pKCk7XG5cbi8vIGV4cG9ydCBkZWZhdWx0IHN0YXJ0KCk7XG4iXX0=