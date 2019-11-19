var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/csv-helpers", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "chalk", "./modules/scraper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        await fs_helpers_1.writeToJsonAndCsv(`data/repeaters/results/${subPlace}`, result);
    }
    exports.default = (async () => {
        const countyFileData = await fs_helpers_1.readFileAsync('data/Colorado_County_Seats.csv');
        const countyData = await csv_helpers_1.parseAsync(countyFileData, { columns: true });
        const cities = countyData.map((c) => `${c['County Seat']}, CO`);
        while (cities.length) {
            const name = cities.shift();
            if (name) {
                await save(name, 200);
            }
        }
    })();
});
// export default start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2dldC1yZXBlYXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxzREFBa0Q7SUFDbEQsb0RBQXVFO0lBQ3ZFLDhDQUFrRDtJQUNsRCxzREFBaUQ7SUFHakQsa0RBQTBCO0lBQzFCLGdFQUF3QztJQUV4QyxNQUFNLEdBQUcsR0FBNEIsdUJBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUVoRSxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQXNCLEVBQUUsUUFBZ0I7UUFDMUQsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sT0FBTyxHQUFZLElBQUksaUJBQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEQsTUFBTSxNQUFNLEdBQW1CLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXZELE1BQU0sT0FBTyxHQUF3RSxFQUFFLENBQUM7UUFDeEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQWlCLEVBQUUsRUFBRTtZQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQThDLEVBQUUsRUFBRTtnQkFDN0UsTUFBTSxHQUFHLEdBQVcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLEtBQUssR0FBZ0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNuQjtnQkFDRCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FB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QUMsQ0FBQztRQUNyRixNQUFNLFVBQVUsR0FBa0IsTUFBTSx3QkFBVSxDQUFDLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sTUFBTSxHQUFhLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFjLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RixPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEdBQXVCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoRCxJQUFJLElBQUksRUFBRTtnQkFDUixNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDdkI7U0FDRjtJQUNILENBQUMsQ0FBQyxFQUFFLENBQUM7O0FBRUwsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGFyc2VBc3luYyB9IGZyb20gJ0BoZWxwZXJzL2Nzdi1oZWxwZXJzJztcbmltcG9ydCB7IHJlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XG5pbXBvcnQgeyBudW1iZXJUb1N0cmluZyB9IGZyb20gJ0BoZWxwZXJzL2hlbHBlcnMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xuaW1wb3J0IHsgSUNvdW50eVNlYXQgfSBmcm9tICdAaW50ZXJmYWNlcy9pLWNvdW50eS1zZWF0JztcbmltcG9ydCB7IElSZXBlYXRlclJhdyB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktcmVwZWF0ZXItcmF3JztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgU2NyYXBlciBmcm9tICcuL21vZHVsZXMvc2NyYXBlcic7XG5cbmNvbnN0IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQgPSBjcmVhdGVMb2coJ0dldCBSZXBlYXRlcnMnKTtcblxuYXN5bmMgZnVuY3Rpb24gc2F2ZShwbGFjZTogc3RyaW5nIHwgbnVtYmVyLCBkaXN0YW5jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIGxvZyhjaGFsay5ncmVlbignU2F2ZScpLCBwbGFjZSwgZGlzdGFuY2UpO1xuXG4gIGNvbnN0IHNjcmFwZXI6IFNjcmFwZXIgPSBuZXcgU2NyYXBlcihwbGFjZSwgZGlzdGFuY2UpO1xuXG4gIGNvbnN0IHJlc3VsdDogSVJlcGVhdGVyUmF3W10gPSBhd2FpdCBzY3JhcGVyLnByb2Nlc3MoKTtcblxuICBjb25zdCBjb2x1bW5zOiB7IFtrZXkgaW4ga2V5b2YgSVJlcGVhdGVyUmF3XTogQXJyYXk8c3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkPiB9ID0ge307XG4gIHJlc3VsdC5mb3JFYWNoKChyb3c6IElSZXBlYXRlclJhdykgPT4ge1xuICAgIE9iamVjdC5lbnRyaWVzKHJvdykuZm9yRWFjaCgoZW50cnk6IFtzdHJpbmcsIChzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQpXSkgPT4ge1xuICAgICAgY29uc3Qga2V5OiBzdHJpbmcgPSBlbnRyeVswXTtcbiAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgPSBlbnRyeVsxXTtcbiAgICAgIGlmICghY29sdW1uc1trZXldKSB7XG4gICAgICAgIGNvbHVtbnNba2V5XSA9IFtdO1xuICAgICAgfVxuICAgICAgaWYgKGNvbHVtbnNba2V5XS5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICAgICAgY29sdW1uc1trZXldLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXN1bHQuZm9yRWFjaCgocm93OiBJUmVwZWF0ZXJSYXcpID0+IHtcbiAgICBPYmplY3QuZW50cmllcyhyb3cpLmZvckVhY2goKGVudHJ5OiBbc3RyaW5nLCAoc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkKV0pID0+IHtcbiAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gZW50cnlbMF07XG4gICAgICBjb25zdCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkID0gZW50cnlbMV07XG4gICAgICBpZiAoY29sdW1uc1trZXldLmxlbmd0aCA9PT0gMSAmJiBjb2x1bW5zW2tleV1bMF0gPT09ICcnICYmIHZhbHVlID09PSAnJykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJvd1trZXldID0gJ3llcyc7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJlc3VsdC5zb3J0KChhOiBJUmVwZWF0ZXJSYXcsIGI6IElSZXBlYXRlclJhdykgPT4ge1xuICAgIGNvbnN0IGFNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5NaSB8fCAwLCA0LCA1KTtcbiAgICBjb25zdCBiTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGIuTWkgfHwgMCwgNCwgNSk7XG4gICAgY29uc3QgYU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGEuQ2FsbDtcbiAgICBjb25zdCBiTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYi5DYWxsO1xuICAgIGNvbnN0IGFGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGEuRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xuICAgIGNvbnN0IGJGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGIuRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xuICAgIGNvbnN0IGFTdHI6IHN0cmluZyA9IGAke2FNaX0gJHthTmFtZX0gJHthRnJlcXVlbmN5fWA7XG4gICAgY29uc3QgYlN0cjogc3RyaW5nID0gYCR7Yk1pfSAke2JOYW1lfSAke2JGcmVxdWVuY3l9YDtcbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XG4gIH0pO1xuICAvLyByZXN1bHQuc29ydCgoYSwgYikgPT4geyhhLkNhbGwgPiBiLkNhbGwgPyAxIDogYS5DYWxsIDwgYi5DYWxsID8gLTEgOiAwKSk7XG4gIC8vIHJlc3VsdC5zb3J0KChhLCBiKSA9PiAoYS5GcmVxdWVuY3kgLSBiLkZyZXF1ZW5jeSkpO1xuICAvLyByZXN1bHQuc29ydCgoYSwgYikgPT4gKGEuTWkgLSBiLk1pKSk7XG5cbiAgLy8gY29uc29sZS5sb2cocGxhY2UsIGRpc3RhbmNlLCByZXN1bHQubGVuZ3RoKTtcblxuICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBwbGFjZS50b1N0cmluZygpLnNwbGl0KGAsYCk7XG4gIGNvbnN0IHN1YlBsYWNlOiBzdHJpbmcgPSBgJHsocGFydHNbMV0gfHwgJy4nKS50cmltKCl9LyR7cGFydHNbMF0udHJpbSgpfWA7XG5cbiAgbG9nKGNoYWxrLnllbGxvdygnUmVzdWx0cycpLCByZXN1bHQubGVuZ3RoLCBzdWJQbGFjZSk7XG5cbiAgYXdhaXQgd3JpdGVUb0pzb25BbmRDc3YoYGRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvJHtzdWJQbGFjZX1gLCByZXN1bHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCAoYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCBjb3VudHlGaWxlRGF0YTogQnVmZmVyID0gYXdhaXQgcmVhZEZpbGVBc3luYygnZGF0YS9Db2xvcmFkb19Db3VudHlfU2VhdHMuY3N2Jyk7XG4gIGNvbnN0IGNvdW50eURhdGE6IElDb3VudHlTZWF0W10gPSBhd2FpdCBwYXJzZUFzeW5jKGNvdW50eUZpbGVEYXRhLCB7IGNvbHVtbnM6IHRydWUgfSk7XG4gIGNvbnN0IGNpdGllczogc3RyaW5nW10gPSBjb3VudHlEYXRhLm1hcCgoYzogSUNvdW50eVNlYXQpID0+IGAke2NbJ0NvdW50eSBTZWF0J119LCBDT2ApO1xuICB3aGlsZSAoY2l0aWVzLmxlbmd0aCkge1xuICAgIGNvbnN0IG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGNpdGllcy5zaGlmdCgpO1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBhd2FpdCBzYXZlKG5hbWUsIDIwMCk7XG4gICAgfVxuICB9XG59KSgpO1xuXG4vLyBleHBvcnQgZGVmYXVsdCBzdGFydCgpO1xuIl19