"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_helpers_1 = require("@helpers/fs-helpers");
const helpers_1 = require("@helpers/helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const chalk_1 = __importDefault(require("chalk"));
const log = log_helpers_1.createLog('Group By');
async function doIt(groupBy, inFileName, outFileName) {
    const fileData = await fs_helpers_1.readFileAsync(inFileName); // await getAllFilesFromDirectory("./repeaters/data/CO/", ".json") as IRepeater[];
    const repeaters = JSON.parse(fileData.toString());
    // Only grouping by the keys in the first row. It's not comprehensive but contains the essentials.
    // const keys = Object.keys(repeaters[0]) as Array<keyof IRepeater>;
    // for (const key of keys) {
    log(chalk_1.default.green('Process'), chalk_1.default.blue('Group'), groupBy, chalk_1.default.yellow('In'), inFileName, chalk_1.default.cyan('Out'), outFileName);
    const grouped = group(groupBy, repeaters);
    await fs_helpers_1.writeToJsonAndCsv(outFileName, grouped);
    // }
}
function group(groupBy, repeaters) {
    const keyedGroups = {};
    repeaters.forEach((repeater) => {
        const keyVal = repeater[groupBy];
        if (keyVal !== undefined && keyVal !== null && keyVal !== '') {
            if (!keyedGroups[keyVal]) {
                keyedGroups[keyVal] = [];
            }
            keyedGroups[keyVal].push(repeater);
        }
    });
    const sorting = Object.entries(keyedGroups);
    sorting.sort((a, b) => {
        const aMi = helpers_1.numberToString(a[1][0].Mi || 0, 5, 24);
        const bMi = helpers_1.numberToString(b[1][0].Mi || 0, 5, 24);
        const aNumRepeaters = helpers_1.numberToString(100 - a[1].length, 4, 1);
        const bNumRepeaters = helpers_1.numberToString(100 - b[1].length, 4, 1);
        const aGroupName = a[0];
        const bGroupName = b[0];
        const aFrequency = helpers_1.numberToString(a[1][0].Frequency || 0, 4, 5);
        const bFrequency = helpers_1.numberToString(b[1][0].Frequency || 0, 4, 5);
        // Sort by distance, then number of repeaters in group, then group name
        const aStr = `${aMi} ${aNumRepeaters} ${aGroupName} ${aFrequency}`;
        const bStr = `${bMi} ${bNumRepeaters} ${bGroupName} ${bFrequency}`;
        // Sort by number of repeaters in group, then distance, then group name
        // const aStr = `${aNumRepeaters} ${aMi} ${aGroupName} ${aFrequency}`;
        // const bStr = `${bNumRepeaters} ${bMi} ${bGroupName} ${bFrequency}`;
        return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
    });
    return sorting.reduce((prev, curr) => [...prev, ...curr[1]], []);
}
async function start() {
    // await doIt("Call", "repeaters/data/CO/Colorado Springs.json", "repeaters/groups/CO/Colorado Springs - Call");
    // await doIt("Call", "repeaters/data/CO/Colorado Springs.json", "repeaters/groups/CO/Colorado Springs - Call");
    // const coFiles = (await readdirAsync("data/repeaters/results/CO/")).map((f) => `CO/${f}`);
    // const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `UT/${f}`);
    // const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `NM/${f}`);
    // const allFiles = /* [...coFiles, ...utFiles, ...nmFiles] */ coFiles.filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
    // for (const file of allFiles) {
    //   await doIt("Call", `repeaters/data/${file}.json`, `repeaters/groups/${file} - Call`);
    // }
    // await doIt("Colorado Springs");
    // await doIt("Denver");
    // await doIt("Grand Junction");
    // await doIt("Call",
    //   `data/repeaters/results/CO/Colorado Springs.json`,
    //   `data/repeaters/groups/CO/Colorado Springs - Call`);
    await doIt('Call', `data/repeaters/combined/CO.json`, `data/repeaters/groups/combined/CO - Call`);
}
exports.default = start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9ncm91cC1ieS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLG9EQUF1RTtBQUN2RSw4Q0FBa0Q7QUFDbEQsc0RBQWlEO0FBRWpELGtEQUEwQjtBQUUxQixNQUFNLEdBQUcsR0FBNEIsdUJBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUUzRCxLQUFLLFVBQVUsSUFBSSxDQUFDLE9BQTJCLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjtJQUN0RixNQUFNLFFBQVEsR0FBVyxNQUFNLDBCQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrRkFBa0Y7SUFDNUksTUFBTSxTQUFTLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFbEUsa0dBQWtHO0lBQ2xHLG9FQUFvRTtJQUNwRSw0QkFBNEI7SUFDNUIsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxSCxNQUFNLE9BQU8sR0FBbUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxRCxNQUFNLDhCQUFpQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5QyxJQUFJO0FBQ04sQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLE9BQTJCLEVBQUUsU0FBeUI7SUFDbkUsTUFBTSxXQUFXLEdBQXdDLEVBQUUsQ0FBQztJQUM1RCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBc0IsRUFBRSxFQUFFO1FBQzNDLE1BQU0sTUFBTSxH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QUN4QixnQ0FBZ0M7SUFDaEMscUJBQXFCO0lBQ3JCLHVEQUF1RDtJQUN2RCx5REFBeUQ7SUFDekQsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUNmLGlDQUFpQyxFQUNqQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxrQkFBZSxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuaW1wb3J0IHsgcmVhZEZpbGVBc3luYywgd3JpdGVUb0pzb25BbmRDc3YgfSBmcm9tICdAaGVscGVycy9mcy1oZWxwZXJzJztcclxuaW1wb3J0IHsgbnVtYmVyVG9TdHJpbmcgfSBmcm9tICdAaGVscGVycy9oZWxwZXJzJztcclxuaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xyXG5pbXBvcnQgeyBJUmVwZWF0ZXJSYXcgfSBmcm9tICdAaW50ZXJmYWNlcy9pLXJlcGVhdGVyLXJhdyc7XHJcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XHJcblxyXG5jb25zdCBsb2c6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkID0gY3JlYXRlTG9nKCdHcm91cCBCeScpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gZG9JdChncm91cEJ5OiBrZXlvZiBJUmVwZWF0ZXJSYXcsIGluRmlsZU5hbWU6IHN0cmluZywgb3V0RmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gIGNvbnN0IGZpbGVEYXRhOiBCdWZmZXIgPSBhd2FpdCByZWFkRmlsZUFzeW5jKGluRmlsZU5hbWUpOyAvLyBhd2FpdCBnZXRBbGxGaWxlc0Zyb21EaXJlY3RvcnkoXCIuL3JlcGVhdGVycy9kYXRhL0NPL1wiLCBcIi5qc29uXCIpIGFzIElSZXBlYXRlcltdO1xyXG4gIGNvbnN0IHJlcGVhdGVyczogSVJlcGVhdGVyUmF3W10gPSBKU09OLnBhcnNlKGZpbGVEYXRhLnRvU3RyaW5nKCkpO1xyXG5cclxuICAvLyBPbmx5IGdyb3VwaW5nIGJ5IHRoZSBrZXlzIGluIHRoZSBmaXJzdCByb3cuIEl0J3Mgbm90IGNvbXByZWhlbnNpdmUgYnV0IGNvbnRhaW5zIHRoZSBlc3NlbnRpYWxzLlxyXG4gIC8vIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXBlYXRlcnNbMF0pIGFzIEFycmF5PGtleW9mIElSZXBlYXRlcj47XHJcbiAgLy8gZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xyXG4gIGxvZyhjaGFsay5ncmVlbignUHJvY2VzcycpLCBjaGFsay5ibHVlKCdHcm91cCcpLCBncm91cEJ5LCBjaGFsay55ZWxsb3coJ0luJyksIGluRmlsZU5hbWUsIGNoYWxrLmN5YW4oJ091dCcpLCBvdXRGaWxlTmFtZSk7XHJcbiAgY29uc3QgZ3JvdXBlZDogSVJlcGVhdGVyUmF3W10gPSBncm91cChncm91cEJ5LCByZXBlYXRlcnMpO1xyXG4gIGF3YWl0IHdyaXRlVG9Kc29uQW5kQ3N2KG91dEZpbGVOYW1lLCBncm91cGVkKTtcclxuICAvLyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdyb3VwKGdyb3VwQnk6IGtleW9mIElSZXBlYXRlclJhdywgcmVwZWF0ZXJzOiBJUmVwZWF0ZXJSYXdbXSk6IElSZXBlYXRlclJhd1tdIHtcclxuICBjb25zdCBrZXllZEdyb3VwczogeyBbIGtleTogc3RyaW5nIF06IElSZXBlYXRlclJhd1tdIH0gPSB7fTtcclxuICByZXBlYXRlcnMuZm9yRWFjaCgocmVwZWF0ZXI6IElSZXBlYXRlclJhdykgPT4ge1xyXG4gICAgY29uc3Qga2V5VmFsOiBudW1iZXIgfCB1bmRlZmluZWQgfCBzdHJpbmcgPSByZXBlYXRlcltncm91cEJ5XTtcclxuICAgIGlmIChrZXlWYWwgIT09IHVuZGVmaW5lZCAmJiBrZXlWYWwgIT09IG51bGwgJiYga2V5VmFsICE9PSAnJykge1xyXG4gICAgICBpZiAoIWtleWVkR3JvdXBzW2tleVZhbF0pIHtcclxuICAgICAgICBrZXllZEdyb3Vwc1trZXlWYWxdID0gW107XHJcbiAgICAgIH1cclxuICAgICAga2V5ZWRHcm91cHNba2V5VmFsXS5wdXNoKHJlcGVhdGVyKTtcclxuICAgIH1cclxuICB9KTtcclxuICBjb25zdCBzb3J0aW5nOiBBcnJheTxbc3RyaW5nLCBJUmVwZWF0ZXJSYXdbXV0+ID0gT2JqZWN0LmVudHJpZXMoa2V5ZWRHcm91cHMpO1xyXG4gIHNvcnRpbmcuc29ydCgoYTogW3N0cmluZywgSVJlcGVhdGVyUmF3W11dLCBiOiBbc3RyaW5nLCBJUmVwZWF0ZXJSYXdbXV0pID0+IHtcclxuICAgIGNvbnN0IGFNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYVsxXVswXS5NaSB8fCAwLCA1LCAyNCk7XHJcbiAgICBjb25zdCBiTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGJbMV1bMF0uTWkgfHwgMCwgNSwgMjQpO1xyXG4gICAgY29uc3QgYU51bVJlcGVhdGVyczogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoMTAwIC0gYVsxXS5sZW5ndGgsIDQsIDEpO1xyXG4gICAgY29uc3QgYk51bVJlcGVhdGVyczogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoMTAwIC0gYlsxXS5sZW5ndGgsIDQsIDEpO1xyXG4gICAgY29uc3QgYUdyb3VwTmFtZTogc3RyaW5nID0gYVswXTtcclxuICAgIGNvbnN0IGJHcm91cE5hbWU6IHN0cmluZyA9IGJbMF07XHJcbiAgICBjb25zdCBhRnJlcXVlbmN5OiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhhWzFdWzBdLkZyZXF1ZW5jeSB8fCAwLCA0LCA1KTtcclxuICAgIGNvbnN0IGJGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGJbMV1bMF0uRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xyXG4gICAgLy8gU29ydCBieSBkaXN0YW5jZSwgdGhlbiBudW1iZXIgb2YgcmVwZWF0ZXJzIGluIGdyb3VwLCB0aGVuIGdyb3VwIG5hbWVcclxuICAgIGNvbnN0IGFTdHI6IHN0cmluZyA9IGAke2FNaX0gJHthTnVtUmVwZWF0ZXJzfSAke2FHcm91cE5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xyXG4gICAgY29uc3QgYlN0cjogc3RyaW5nID0gYCR7Yk1pfSAke2JOdW1SZXBlYXRlcnN9ICR7Ykdyb3VwTmFtZX0gJHtiRnJlcXVlbmN5fWA7XHJcbiAgICAvLyBTb3J0IGJ5IG51bWJlciBvZiByZXBlYXRlcnMgaW4gZ3JvdXAsIHRoZW4gZGlzdGFuY2UsIHRoZW4gZ3JvdXAgbmFtZVxyXG4gICAgLy8gY29uc3QgYVN0ciA9IGAke2FOdW1SZXBlYXRlcnN9ICR7YU1pfSAke2FHcm91cE5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xyXG4gICAgLy8gY29uc3QgYlN0ciA9IGAke2JOdW1SZXBlYXRlcnN9ICR7Yk1pfSAke2JHcm91cE5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xyXG5cclxuICAgIHJldHVybiBhU3RyID4gYlN0ciA/IDEgOiBhU3RyIDwgYlN0ciA/IC0xIDogMDtcclxuICB9KTtcclxuICByZXR1cm4gc29ydGluZy5yZWR1Y2UoKHByZXY6IElSZXBlYXRlclJhd1tdLCBjdXJyOiBbc3RyaW5nLCBJUmVwZWF0ZXJSYXdbXV0pID0+IFsuLi5wcmV2LCAuLi5jdXJyWzFdXSwgW10gYXMgSVJlcGVhdGVyUmF3W10pO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzdGFydCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBcInJlcGVhdGVycy9kYXRhL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvblwiLCBcInJlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGxcIik7XHJcbiAgLy8gYXdhaXQgZG9JdChcIkNhbGxcIiwgXCJyZXBlYXRlcnMvZGF0YS9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25cIiwgXCJyZXBlYXRlcnMvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsXCIpO1xyXG4gIC8vIGNvbnN0IGNvRmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy9DTy9cIikpLm1hcCgoZikgPT4gYENPLyR7Zn1gKTtcclxuICAvLyBjb25zdCB1dEZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2RhdGEvVVQvXCIpKS5tYXAoKGYpID0+IGBVVC8ke2Z9YCk7XHJcbiAgLy8gY29uc3Qgbm1GaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL05NL1wiKSkubWFwKChmKSA9PiBgTk0vJHtmfWApO1xyXG4gIC8vIGNvbnN0IGFsbEZpbGVzID0gLyogWy4uLmNvRmlsZXMsIC4uLnV0RmlsZXMsIC4uLm5tRmlsZXNdICovIGNvRmlsZXMuZmlsdGVyKChmKSA9PiAvXFwuanNvbiQvLnRlc3QoZikpLm1hcCgoZikgPT4gZi5yZXBsYWNlKFwiLmpzb25cIiwgXCJcIikpO1xyXG4gIC8vIGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlcykge1xyXG4gIC8vICAgYXdhaXQgZG9JdChcIkNhbGxcIiwgYHJlcGVhdGVycy9kYXRhLyR7ZmlsZX0uanNvbmAsIGByZXBlYXRlcnMvZ3JvdXBzLyR7ZmlsZX0gLSBDYWxsYCk7XHJcbiAgLy8gfVxyXG4gIC8vIGF3YWl0IGRvSXQoXCJDb2xvcmFkbyBTcHJpbmdzXCIpO1xyXG4gIC8vIGF3YWl0IGRvSXQoXCJEZW52ZXJcIik7XHJcbiAgLy8gYXdhaXQgZG9JdChcIkdyYW5kIEp1bmN0aW9uXCIpO1xyXG4gIC8vIGF3YWl0IGRvSXQoXCJDYWxsXCIsXHJcbiAgLy8gICBgZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25gLFxyXG4gIC8vICAgYGRhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbGApO1xyXG4gIGF3YWl0IGRvSXQoJ0NhbGwnLFxyXG4gICAgYGRhdGEvcmVwZWF0ZXJzL2NvbWJpbmVkL0NPLmpzb25gLFxyXG4gICAgYGRhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9jb21iaW5lZC9DTyAtIENhbGxgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RhcnQoKTtcclxuIl19