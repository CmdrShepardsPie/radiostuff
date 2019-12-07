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
    //   `../data/repeaters/results/CO/Colorado Springs.json`,
    //   `../data/repeaters/groups/CO/Colorado Springs - Call`);
    await doIt('Call', `../data/repeaters/combined/CO.json`, `../data/repeaters/groups/combined/CO - Call`);
}
exports.default = start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZ3JvdXAtYnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBdUU7QUFDdkUsOENBQWtEO0FBQ2xELHNEQUFpRDtBQUVqRCxrREFBMEI7QUFFMUIsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFM0QsS0FBSyxVQUFVLElBQUksQ0FBQyxPQUEyQixFQUFFLFVBQWtCLEVBQUUsV0FBbUI7SUFDdEYsTUFBTSxRQUFRLEdBQVcsTUFBTSwwQkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0ZBQWtGO0lBQzVJLE1BQU0sU0FBUyxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBRWxFLGtHQUFrRztJQUNsRyxvRUFBb0U7SUFDcEUsNEJBQTRCO0lBQzVCLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDMUgsTUFBTSxPQUFPLEdBQW1CLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUQsTUFBTSw4QkFBaUIsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsSUFBSTtBQUNOLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxPQUEyQixFQUFFLFNBQXlCO0lBQ25FLE1BQU0sV0FBVyxHQUF3QyxFQUFFLENBQUM7SUFDNUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQXNCLEVBQUUsRUFBRTtRQUMzQyxNQUFNLE1BQU0sR0FBZ0MsUUFBUSxD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O0lBQ2hDLHFCQUFxQjtJQUNyQiwwREFBMEQ7SUFDMUQsNERBQTREO0lBQzVELE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFDZixvQ0FBb0MsRUFDcEMsNkNBQTZDLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRUQsa0JBQWUsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHsgcmVhZEZpbGVBc3luYywgd3JpdGVUb0pzb25BbmRDc3YgfSBmcm9tICdAaGVscGVycy9mcy1oZWxwZXJzJztcbmltcG9ydCB7IG51bWJlclRvU3RyaW5nIH0gZnJvbSAnQGhlbHBlcnMvaGVscGVycyc7XG5pbXBvcnQgeyBjcmVhdGVMb2cgfSBmcm9tICdAaGVscGVycy9sb2ctaGVscGVycyc7XG5pbXBvcnQgeyBJUmVwZWF0ZXJSYXcgfSBmcm9tICdAaW50ZXJmYWNlcy9pLXJlcGVhdGVyLXJhdyc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuXG5jb25zdCBsb2c6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkID0gY3JlYXRlTG9nKCdHcm91cCBCeScpO1xuXG5hc3luYyBmdW5jdGlvbiBkb0l0KGdyb3VwQnk6IGtleW9mIElSZXBlYXRlclJhdywgaW5GaWxlTmFtZTogc3RyaW5nLCBvdXRGaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGZpbGVEYXRhOiBCdWZmZXIgPSBhd2FpdCByZWFkRmlsZUFzeW5jKGluRmlsZU5hbWUpOyAvLyBhd2FpdCBnZXRBbGxGaWxlc0Zyb21EaXJlY3RvcnkoXCIuL3JlcGVhdGVycy9kYXRhL0NPL1wiLCBcIi5qc29uXCIpIGFzIElSZXBlYXRlcltdO1xuICBjb25zdCByZXBlYXRlcnM6IElSZXBlYXRlclJhd1tdID0gSlNPTi5wYXJzZShmaWxlRGF0YS50b1N0cmluZygpKTtcblxuICAvLyBPbmx5IGdyb3VwaW5nIGJ5IHRoZSBrZXlzIGluIHRoZSBmaXJzdCByb3cuIEl0J3Mgbm90IGNvbXByZWhlbnNpdmUgYnV0IGNvbnRhaW5zIHRoZSBlc3NlbnRpYWxzLlxuICAvLyBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVwZWF0ZXJzWzBdKSBhcyBBcnJheTxrZXlvZiBJUmVwZWF0ZXI+O1xuICAvLyBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gIGxvZyhjaGFsay5ncmVlbignUHJvY2VzcycpLCBjaGFsay5ibHVlKCdHcm91cCcpLCBncm91cEJ5LCBjaGFsay55ZWxsb3coJ0luJyksIGluRmlsZU5hbWUsIGNoYWxrLmN5YW4oJ091dCcpLCBvdXRGaWxlTmFtZSk7XG4gIGNvbnN0IGdyb3VwZWQ6IElSZXBlYXRlclJhd1tdID0gZ3JvdXAoZ3JvdXBCeSwgcmVwZWF0ZXJzKTtcbiAgYXdhaXQgd3JpdGVUb0pzb25BbmRDc3Yob3V0RmlsZU5hbWUsIGdyb3VwZWQpO1xuICAvLyB9XG59XG5cbmZ1bmN0aW9uIGdyb3VwKGdyb3VwQnk6IGtleW9mIElSZXBlYXRlclJhdywgcmVwZWF0ZXJzOiBJUmVwZWF0ZXJSYXdbXSk6IElSZXBlYXRlclJhd1tdIHtcbiAgY29uc3Qga2V5ZWRHcm91cHM6IHsgWyBrZXk6IHN0cmluZyBdOiBJUmVwZWF0ZXJSYXdbXSB9ID0ge307XG4gIHJlcGVhdGVycy5mb3JFYWNoKChyZXBlYXRlcjogSVJlcGVhdGVyUmF3KSA9PiB7XG4gICAgY29uc3Qga2V5VmFsOiBudW1iZXIgfCB1bmRlZmluZWQgfCBzdHJpbmcgPSByZXBlYXRlcltncm91cEJ5XTtcbiAgICBpZiAoa2V5VmFsICE9PSB1bmRlZmluZWQgJiYga2V5VmFsICE9PSBudWxsICYmIGtleVZhbCAhPT0gJycpIHtcbiAgICAgIGlmICgha2V5ZWRHcm91cHNba2V5VmFsXSkge1xuICAgICAgICBrZXllZEdyb3Vwc1trZXlWYWxdID0gW107XG4gICAgICB9XG4gICAgICBrZXllZEdyb3Vwc1trZXlWYWxdLnB1c2gocmVwZWF0ZXIpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHNvcnRpbmc6IEFycmF5PFtzdHJpbmcsIElSZXBlYXRlclJhd1tdXT4gPSBPYmplY3QuZW50cmllcyhrZXllZEdyb3Vwcyk7XG4gIHNvcnRpbmcuc29ydCgoYTogW3N0cmluZywgSVJlcGVhdGVyUmF3W11dLCBiOiBbc3RyaW5nLCBJUmVwZWF0ZXJSYXdbXV0pID0+IHtcbiAgICBjb25zdCBhTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGFbMV1bMF0uTWkgfHwgMCwgNSwgMjQpO1xuICAgIGNvbnN0IGJNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYlsxXVswXS5NaSB8fCAwLCA1LCAyNCk7XG4gICAgY29uc3QgYU51bVJlcGVhdGVyczogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoMTAwIC0gYVsxXS5sZW5ndGgsIDQsIDEpO1xuICAgIGNvbnN0IGJOdW1SZXBlYXRlcnM6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKDEwMCAtIGJbMV0ubGVuZ3RoLCA0LCAxKTtcbiAgICBjb25zdCBhR3JvdXBOYW1lOiBzdHJpbmcgPSBhWzBdO1xuICAgIGNvbnN0IGJHcm91cE5hbWU6IHN0cmluZyA9IGJbMF07XG4gICAgY29uc3QgYUZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYVsxXVswXS5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XG4gICAgY29uc3QgYkZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYlsxXVswXS5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XG4gICAgLy8gU29ydCBieSBkaXN0YW5jZSwgdGhlbiBudW1iZXIgb2YgcmVwZWF0ZXJzIGluIGdyb3VwLCB0aGVuIGdyb3VwIG5hbWVcbiAgICBjb25zdCBhU3RyOiBzdHJpbmcgPSBgJHthTWl9ICR7YU51bVJlcGVhdGVyc30gJHthR3JvdXBOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICBjb25zdCBiU3RyOiBzdHJpbmcgPSBgJHtiTWl9ICR7Yk51bVJlcGVhdGVyc30gJHtiR3JvdXBOYW1lfSAke2JGcmVxdWVuY3l9YDtcbiAgICAvLyBTb3J0IGJ5IG51bWJlciBvZiByZXBlYXRlcnMgaW4gZ3JvdXAsIHRoZW4gZGlzdGFuY2UsIHRoZW4gZ3JvdXAgbmFtZVxuICAgIC8vIGNvbnN0IGFTdHIgPSBgJHthTnVtUmVwZWF0ZXJzfSAke2FNaX0gJHthR3JvdXBOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICAvLyBjb25zdCBiU3RyID0gYCR7Yk51bVJlcGVhdGVyc30gJHtiTWl9ICR7Ykdyb3VwTmFtZX0gJHtiRnJlcXVlbmN5fWA7XG5cbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XG4gIH0pO1xuICByZXR1cm4gc29ydGluZy5yZWR1Y2UoKHByZXY6IElSZXBlYXRlclJhd1tdLCBjdXJyOiBbc3RyaW5nLCBJUmVwZWF0ZXJSYXdbXV0pID0+IFsuLi5wcmV2LCAuLi5jdXJyWzFdXSwgW10gYXMgSVJlcGVhdGVyUmF3W10pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdGFydCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gYXdhaXQgZG9JdChcIkNhbGxcIiwgXCJyZXBlYXRlcnMvZGF0YS9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25cIiwgXCJyZXBlYXRlcnMvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBcInJlcGVhdGVycy9kYXRhL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvblwiLCBcInJlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGxcIik7XG4gIC8vIGNvbnN0IGNvRmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy9DTy9cIikpLm1hcCgoZikgPT4gYENPLyR7Zn1gKTtcbiAgLy8gY29uc3QgdXRGaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL1VUL1wiKSkubWFwKChmKSA9PiBgVVQvJHtmfWApO1xuICAvLyBjb25zdCBubUZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2RhdGEvTk0vXCIpKS5tYXAoKGYpID0+IGBOTS8ke2Z9YCk7XG4gIC8vIGNvbnN0IGFsbEZpbGVzID0gLyogWy4uLmNvRmlsZXMsIC4uLnV0RmlsZXMsIC4uLm5tRmlsZXNdICovIGNvRmlsZXMuZmlsdGVyKChmKSA9PiAvXFwuanNvbiQvLnRlc3QoZikpLm1hcCgoZikgPT4gZi5yZXBsYWNlKFwiLmpzb25cIiwgXCJcIikpO1xuICAvLyBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcbiAgLy8gICBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBgcmVwZWF0ZXJzL2RhdGEvJHtmaWxlfS5qc29uYCwgYHJlcGVhdGVycy9ncm91cHMvJHtmaWxlfSAtIENhbGxgKTtcbiAgLy8gfVxuICAvLyBhd2FpdCBkb0l0KFwiQ29sb3JhZG8gU3ByaW5nc1wiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkRlbnZlclwiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkdyYW5kIEp1bmN0aW9uXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLFxuICAvLyAgIGAuLi9kYXRhL3JlcGVhdGVycy9yZXN1bHRzL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvbmAsXG4gIC8vICAgYC4uL2RhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbGApO1xuICBhd2FpdCBkb0l0KCdDYWxsJyxcbiAgICBgLi4vZGF0YS9yZXBlYXRlcnMvY29tYmluZWQvQ08uanNvbmAsXG4gICAgYC4uL2RhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9jb21iaW5lZC9DTyAtIENhbGxgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnQoKTtcbiJdfQ==