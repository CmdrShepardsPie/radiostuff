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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZ3JvdXAtYnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBdUU7QUFDdkUsOENBQWtEO0FBQ2xELHNEQUFpRDtBQUVqRCxrREFBMEI7QUFFMUIsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFM0QsS0FBSyxVQUFVLElBQUksQ0FBQyxPQUEyQixFQUFFLFVBQWtCLEVBQUUsV0FBbUI7SUFDdEYsTUFBTSxRQUFRLEdBQVcsTUFBTSwwQkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0ZBQWtGO0lBQzVJLE1BQU0sU0FBUyxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBRWxFLGtHQUFrRztJQUNsRyxvRUFBb0U7SUFDcEUsNEJBQTRCO0lBQzVCLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDMUgsTUFBTSxPQUFPLEdBQW1CLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUQsTUFBTSw4QkFBaUIsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsSUFBSTtBQUNOLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxPQUEyQixFQUFFLFNBQXlCO0lBQ25FLE1BQU0sV0FBVyxHQUF3QyxFQUFFLENBQUM7SUFDNUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQXNCLEVBQUUsRUFBRTtRQUMzQyxNQUFNLE1BQU0sR0FBZ0MsUUFBUSxD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O0lBQ2hDLHFCQUFxQjtJQUNyQiwwREFBMEQ7SUFDMUQsNERBQTREO0lBQzVELE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFDZixvQ0FBb0MsRUFDcEMsNkNBQTZDLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRUQsa0JBQWUsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmltcG9ydCB7IHJlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XHJcbmltcG9ydCB7IG51bWJlclRvU3RyaW5nIH0gZnJvbSAnQGhlbHBlcnMvaGVscGVycyc7XHJcbmltcG9ydCB7IGNyZWF0ZUxvZyB9IGZyb20gJ0BoZWxwZXJzL2xvZy1oZWxwZXJzJztcclxuaW1wb3J0IHsgSVJlcGVhdGVyUmF3IH0gZnJvbSAnQGludGVyZmFjZXMvaS1yZXBlYXRlci1yYXcnO1xyXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5cclxuY29uc3QgbG9nOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCA9IGNyZWF0ZUxvZygnR3JvdXAgQnknKTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGRvSXQoZ3JvdXBCeToga2V5b2YgSVJlcGVhdGVyUmF3LCBpbkZpbGVOYW1lOiBzdHJpbmcsIG91dEZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBmaWxlRGF0YTogQnVmZmVyID0gYXdhaXQgcmVhZEZpbGVBc3luYyhpbkZpbGVOYW1lKTsgLy8gYXdhaXQgZ2V0QWxsRmlsZXNGcm9tRGlyZWN0b3J5KFwiLi9yZXBlYXRlcnMvZGF0YS9DTy9cIiwgXCIuanNvblwiKSBhcyBJUmVwZWF0ZXJbXTtcclxuICBjb25zdCByZXBlYXRlcnM6IElSZXBlYXRlclJhd1tdID0gSlNPTi5wYXJzZShmaWxlRGF0YS50b1N0cmluZygpKTtcclxuXHJcbiAgLy8gT25seSBncm91cGluZyBieSB0aGUga2V5cyBpbiB0aGUgZmlyc3Qgcm93LiBJdCdzIG5vdCBjb21wcmVoZW5zaXZlIGJ1dCBjb250YWlucyB0aGUgZXNzZW50aWFscy5cclxuICAvLyBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVwZWF0ZXJzWzBdKSBhcyBBcnJheTxrZXlvZiBJUmVwZWF0ZXI+O1xyXG4gIC8vIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcclxuICBsb2coY2hhbGsuZ3JlZW4oJ1Byb2Nlc3MnKSwgY2hhbGsuYmx1ZSgnR3JvdXAnKSwgZ3JvdXBCeSwgY2hhbGsueWVsbG93KCdJbicpLCBpbkZpbGVOYW1lLCBjaGFsay5jeWFuKCdPdXQnKSwgb3V0RmlsZU5hbWUpO1xyXG4gIGNvbnN0IGdyb3VwZWQ6IElSZXBlYXRlclJhd1tdID0gZ3JvdXAoZ3JvdXBCeSwgcmVwZWF0ZXJzKTtcclxuICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdihvdXRGaWxlTmFtZSwgZ3JvdXBlZCk7XHJcbiAgLy8gfVxyXG59XHJcblxyXG5mdW5jdGlvbiBncm91cChncm91cEJ5OiBrZXlvZiBJUmVwZWF0ZXJSYXcsIHJlcGVhdGVyczogSVJlcGVhdGVyUmF3W10pOiBJUmVwZWF0ZXJSYXdbXSB7XHJcbiAgY29uc3Qga2V5ZWRHcm91cHM6IHsgWyBrZXk6IHN0cmluZyBdOiBJUmVwZWF0ZXJSYXdbXSB9ID0ge307XHJcbiAgcmVwZWF0ZXJzLmZvckVhY2goKHJlcGVhdGVyOiBJUmVwZWF0ZXJSYXcpID0+IHtcclxuICAgIGNvbnN0IGtleVZhbDogbnVtYmVyIHwgdW5kZWZpbmVkIHwgc3RyaW5nID0gcmVwZWF0ZXJbZ3JvdXBCeV07XHJcbiAgICBpZiAoa2V5VmFsICE9PSB1bmRlZmluZWQgJiYga2V5VmFsICE9PSBudWxsICYmIGtleVZhbCAhPT0gJycpIHtcclxuICAgICAgaWYgKCFrZXllZEdyb3Vwc1trZXlWYWxdKSB7XHJcbiAgICAgICAga2V5ZWRHcm91cHNba2V5VmFsXSA9IFtdO1xyXG4gICAgICB9XHJcbiAgICAgIGtleWVkR3JvdXBzW2tleVZhbF0ucHVzaChyZXBlYXRlcik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgY29uc3Qgc29ydGluZzogQXJyYXk8W3N0cmluZywgSVJlcGVhdGVyUmF3W11dPiA9IE9iamVjdC5lbnRyaWVzKGtleWVkR3JvdXBzKTtcclxuICBzb3J0aW5nLnNvcnQoKGE6IFtzdHJpbmcsIElSZXBlYXRlclJhd1tdXSwgYjogW3N0cmluZywgSVJlcGVhdGVyUmF3W11dKSA9PiB7XHJcbiAgICBjb25zdCBhTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGFbMV1bMF0uTWkgfHwgMCwgNSwgMjQpO1xyXG4gICAgY29uc3QgYk1pOiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhiWzFdWzBdLk1pIHx8IDAsIDUsIDI0KTtcclxuICAgIGNvbnN0IGFOdW1SZXBlYXRlcnM6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKDEwMCAtIGFbMV0ubGVuZ3RoLCA0LCAxKTtcclxuICAgIGNvbnN0IGJOdW1SZXBlYXRlcnM6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKDEwMCAtIGJbMV0ubGVuZ3RoLCA0LCAxKTtcclxuICAgIGNvbnN0IGFHcm91cE5hbWU6IHN0cmluZyA9IGFbMF07XHJcbiAgICBjb25zdCBiR3JvdXBOYW1lOiBzdHJpbmcgPSBiWzBdO1xyXG4gICAgY29uc3QgYUZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYVsxXVswXS5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XHJcbiAgICBjb25zdCBiRnJlcXVlbmN5OiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhiWzFdWzBdLkZyZXF1ZW5jeSB8fCAwLCA0LCA1KTtcclxuICAgIC8vIFNvcnQgYnkgZGlzdGFuY2UsIHRoZW4gbnVtYmVyIG9mIHJlcGVhdGVycyBpbiBncm91cCwgdGhlbiBncm91cCBuYW1lXHJcbiAgICBjb25zdCBhU3RyOiBzdHJpbmcgPSBgJHthTWl9ICR7YU51bVJlcGVhdGVyc30gJHthR3JvdXBOYW1lfSAke2FGcmVxdWVuY3l9YDtcclxuICAgIGNvbnN0IGJTdHI6IHN0cmluZyA9IGAke2JNaX0gJHtiTnVtUmVwZWF0ZXJzfSAke2JHcm91cE5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xyXG4gICAgLy8gU29ydCBieSBudW1iZXIgb2YgcmVwZWF0ZXJzIGluIGdyb3VwLCB0aGVuIGRpc3RhbmNlLCB0aGVuIGdyb3VwIG5hbWVcclxuICAgIC8vIGNvbnN0IGFTdHIgPSBgJHthTnVtUmVwZWF0ZXJzfSAke2FNaX0gJHthR3JvdXBOYW1lfSAke2FGcmVxdWVuY3l9YDtcclxuICAgIC8vIGNvbnN0IGJTdHIgPSBgJHtiTnVtUmVwZWF0ZXJzfSAke2JNaX0gJHtiR3JvdXBOYW1lfSAke2JGcmVxdWVuY3l9YDtcclxuXHJcbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHNvcnRpbmcucmVkdWNlKChwcmV2OiBJUmVwZWF0ZXJSYXdbXSwgY3VycjogW3N0cmluZywgSVJlcGVhdGVyUmF3W11dKSA9PiBbLi4ucHJldiwgLi4uY3VyclsxXV0sIFtdIGFzIElSZXBlYXRlclJhd1tdKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgLy8gYXdhaXQgZG9JdChcIkNhbGxcIiwgXCJyZXBlYXRlcnMvZGF0YS9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25cIiwgXCJyZXBlYXRlcnMvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsXCIpO1xyXG4gIC8vIGF3YWl0IGRvSXQoXCJDYWxsXCIsIFwicmVwZWF0ZXJzL2RhdGEvQ08vQ29sb3JhZG8gU3ByaW5ncy5qc29uXCIsIFwicmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbFwiKTtcclxuICAvLyBjb25zdCBjb0ZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcImRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvQ08vXCIpKS5tYXAoKGYpID0+IGBDTy8ke2Z9YCk7XHJcbiAgLy8gY29uc3QgdXRGaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL1VUL1wiKSkubWFwKChmKSA9PiBgVVQvJHtmfWApO1xyXG4gIC8vIGNvbnN0IG5tRmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiLi9yZXBlYXRlcnMvZGF0YS9OTS9cIikpLm1hcCgoZikgPT4gYE5NLyR7Zn1gKTtcclxuICAvLyBjb25zdCBhbGxGaWxlcyA9IC8qIFsuLi5jb0ZpbGVzLCAuLi51dEZpbGVzLCAuLi5ubUZpbGVzXSAqLyBjb0ZpbGVzLmZpbHRlcigoZikgPT4gL1xcLmpzb24kLy50ZXN0KGYpKS5tYXAoKGYpID0+IGYucmVwbGFjZShcIi5qc29uXCIsIFwiXCIpKTtcclxuICAvLyBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcclxuICAvLyAgIGF3YWl0IGRvSXQoXCJDYWxsXCIsIGByZXBlYXRlcnMvZGF0YS8ke2ZpbGV9Lmpzb25gLCBgcmVwZWF0ZXJzL2dyb3Vwcy8ke2ZpbGV9IC0gQ2FsbGApO1xyXG4gIC8vIH1cclxuICAvLyBhd2FpdCBkb0l0KFwiQ29sb3JhZG8gU3ByaW5nc1wiKTtcclxuICAvLyBhd2FpdCBkb0l0KFwiRGVudmVyXCIpO1xyXG4gIC8vIGF3YWl0IGRvSXQoXCJHcmFuZCBKdW5jdGlvblwiKTtcclxuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLFxyXG4gIC8vICAgYC4uL2RhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvQ08vQ29sb3JhZG8gU3ByaW5ncy5qc29uYCxcclxuICAvLyAgIGAuLi9kYXRhL3JlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGxgKTtcclxuICBhd2FpdCBkb0l0KCdDYWxsJyxcclxuICAgIGAuLi9kYXRhL3JlcGVhdGVycy9jb21iaW5lZC9DTy5qc29uYCxcclxuICAgIGAuLi9kYXRhL3JlcGVhdGVycy9ncm91cHMvY29tYmluZWQvQ08gLSBDYWxsYCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0YXJ0KCk7XHJcbiJdfQ==