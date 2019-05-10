"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const fs_helpers_1 = require("@helpers/fs-helpers");
const helpers_1 = require("@helpers/helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const chalk_1 = require("chalk");
const log = log_helpers_1.createLog("Group By");
async function doIt(groupBy, inFileName, outFileName) {
    const fileData = await fs_helpers_1.readFileAsync(inFileName); // await getAllFilesFromDirectory("./repeaters/data/CO/", ".json") as IRepeater[];
    const repeaters = JSON.parse(fileData.toString());
    // Only grouping by the keys in the first row. It's not comprehensive but contains the essentials.
    // const keys = Object.keys(repeaters[0]) as Array<keyof IRepeater>;
    // for (const key of keys) {
    log(chalk_1.default.green("Process"), chalk_1.default.blue("Group"), groupBy, chalk_1.default.yellow("In"), inFileName, chalk_1.default.cyan("Out"), outFileName);
    const grouped = group(groupBy, repeaters);
    await fs_helpers_1.writeToJsonAndCsv(outFileName, grouped);
    // }
}
function group(groupBy, repeaters) {
    const keyedGroups = {};
    repeaters.forEach((repeater) => {
        const keyVal = repeater[groupBy];
        if (keyVal !== undefined && keyVal !== null && keyVal !== "") {
            if (!keyedGroups[keyVal]) {
                keyedGroups[keyVal] = [];
            }
            keyedGroups[keyVal].push(repeater);
        }
    });
    const sorting = Object.entries(keyedGroups);
    sorting.sort((a, b) => {
        const aMi = helpers_1.numberToString(a[1][0].Mi * 100, 3, 24);
        const bMi = helpers_1.numberToString(b[1][0].Mi * 100, 3, 24);
        const aNumRepeaters = helpers_1.numberToString(100 - a[1].length, 4, 1);
        const bNumRepeaters = helpers_1.numberToString(100 - b[1].length, 4, 1);
        const aGroupName = a[0];
        const bGroupName = b[0];
        const aFrequency = helpers_1.numberToString(a[1][0].Frequency, 4, 5);
        const bFrequency = helpers_1.numberToString(b[1][0].Frequency, 4, 5);
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
    await doIt("Call", `data/repeaters/combined/CO.json`, `data/repeaters/groups/combined/CO - Call`);
}
exports.default = start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9ncm91cC1ieS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUErQjtBQUUvQixvREFBcUU7QUFDckUsOENBQWdEO0FBQ2hELHNEQUErQztBQUMvQyxpQ0FBMEI7QUFHMUIsTUFBTSxHQUFHLEdBQUcsdUJBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVsQyxLQUFLLFVBQVUsSUFBSSxDQUFDLE9BQXdCLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjtJQUNuRixNQUFNLFFBQVEsR0FBRyxNQUFNLDBCQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrRkFBa0Y7SUFDcEksTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQWdCLENBQUM7SUFFakUsa0dBQWtHO0lBQ2xHLG9FQUFvRTtJQUNwRSw0QkFBNEI7SUFDNUIsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxSCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sOEJBQWlCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLElBQUk7QUFDTixDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsT0FBd0IsRUFBRSxTQUFzQjtJQUM3RCxNQUFNLFdBQVcsR0FBcUMsRUFBRSxDQUFDO0lBQ3pELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUM3QixNQUFN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QkFBcUI7SUFDckIsdURBQXVEO0lBQ3ZELHlEQUF5RDtJQUN6RCxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQ2YsaUNBQWlDLEVBQ2pDLDBDQUEwQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVELGtCQUFlLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwibW9kdWxlLWFsaWFzL3JlZ2lzdGVyXCI7XG5cbmltcG9ydCB7cmVhZEZpbGVBc3luYywgd3JpdGVUb0pzb25BbmRDc3Z9IGZyb20gXCJAaGVscGVycy9mcy1oZWxwZXJzXCI7XG5pbXBvcnQge251bWJlclRvU3RyaW5nfSBmcm9tIFwiQGhlbHBlcnMvaGVscGVyc1wiO1xuaW1wb3J0IHtjcmVhdGVMb2d9IGZyb20gXCJAaGVscGVycy9sb2ctaGVscGVyc1wiO1xuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IHtJUmVwZWF0ZXJ9IGZyb20gXCIuL21vZHVsZXMvaS5yZXBlYXRlclwiO1xuXG5jb25zdCBsb2cgPSBjcmVhdGVMb2coXCJHcm91cCBCeVwiKTtcblxuYXN5bmMgZnVuY3Rpb24gZG9JdChncm91cEJ5OiBrZXlvZiBJUmVwZWF0ZXIsIGluRmlsZU5hbWU6IHN0cmluZywgb3V0RmlsZU5hbWU6IHN0cmluZykge1xuICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoaW5GaWxlTmFtZSk7IC8vIGF3YWl0IGdldEFsbEZpbGVzRnJvbURpcmVjdG9yeShcIi4vcmVwZWF0ZXJzL2RhdGEvQ08vXCIsIFwiLmpzb25cIikgYXMgSVJlcGVhdGVyW107XG4gIGNvbnN0IHJlcGVhdGVycyA9IEpTT04ucGFyc2UoZmlsZURhdGEudG9TdHJpbmcoKSkgYXMgSVJlcGVhdGVyW107XG5cbiAgLy8gT25seSBncm91cGluZyBieSB0aGUga2V5cyBpbiB0aGUgZmlyc3Qgcm93LiBJdCdzIG5vdCBjb21wcmVoZW5zaXZlIGJ1dCBjb250YWlucyB0aGUgZXNzZW50aWFscy5cbiAgLy8gY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJlcGVhdGVyc1swXSkgYXMgQXJyYXk8a2V5b2YgSVJlcGVhdGVyPjtcbiAgLy8gZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICBsb2coY2hhbGsuZ3JlZW4oXCJQcm9jZXNzXCIpLCBjaGFsay5ibHVlKFwiR3JvdXBcIiksIGdyb3VwQnksIGNoYWxrLnllbGxvdyhcIkluXCIpLCBpbkZpbGVOYW1lLCBjaGFsay5jeWFuKFwiT3V0XCIpLCBvdXRGaWxlTmFtZSk7XG4gIGNvbnN0IGdyb3VwZWQgPSBncm91cChncm91cEJ5LCByZXBlYXRlcnMpO1xuICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdihvdXRGaWxlTmFtZSwgZ3JvdXBlZCk7XG4gIC8vIH1cbn1cblxuZnVuY3Rpb24gZ3JvdXAoZ3JvdXBCeToga2V5b2YgSVJlcGVhdGVyLCByZXBlYXRlcnM6IElSZXBlYXRlcltdKSB7XG4gIGNvbnN0IGtleWVkR3JvdXBzOiB7IFtpbmRleDogc3RyaW5nXTogSVJlcGVhdGVyW10gfSA9IHt9O1xuICByZXBlYXRlcnMuZm9yRWFjaCgocmVwZWF0ZXIpID0+IHtcbiAgICBjb25zdCBrZXlWYWwgPSByZXBlYXRlcltncm91cEJ5XTtcbiAgICBpZiAoa2V5VmFsICE9PSB1bmRlZmluZWQgJiYga2V5VmFsICE9PSBudWxsICYmIGtleVZhbCAhPT0gXCJcIikge1xuICAgICAgaWYgKCFrZXllZEdyb3Vwc1trZXlWYWxdKSB7XG4gICAgICAgIGtleWVkR3JvdXBzW2tleVZhbF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIGtleWVkR3JvdXBzW2tleVZhbF0ucHVzaChyZXBlYXRlcik7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgc29ydGluZyA9IE9iamVjdC5lbnRyaWVzKGtleWVkR3JvdXBzKTtcbiAgc29ydGluZy5zb3J0KChhLCBiKSA9PiB7XG4gICAgY29uc3QgYU1pID0gbnVtYmVyVG9TdHJpbmcoYVsxXVswXS5NaSAqIDEwMCwgMywgMjQpO1xuICAgIGNvbnN0IGJNaSA9IG51bWJlclRvU3RyaW5nKGJbMV1bMF0uTWkgKiAxMDAsIDMsIDI0KTtcbiAgICBjb25zdCBhTnVtUmVwZWF0ZXJzID0gbnVtYmVyVG9TdHJpbmcoMTAwIC0gYVsxXS5sZW5ndGgsIDQsIDEpO1xuICAgIGNvbnN0IGJOdW1SZXBlYXRlcnMgPSBudW1iZXJUb1N0cmluZygxMDAgLSBiWzFdLmxlbmd0aCwgNCwgMSk7XG4gICAgY29uc3QgYUdyb3VwTmFtZSA9IGFbMF07XG4gICAgY29uc3QgYkdyb3VwTmFtZSA9IGJbMF07XG4gICAgY29uc3QgYUZyZXF1ZW5jeSA9IG51bWJlclRvU3RyaW5nKGFbMV1bMF0uRnJlcXVlbmN5LCA0LCA1KTtcbiAgICBjb25zdCBiRnJlcXVlbmN5ID0gbnVtYmVyVG9TdHJpbmcoYlsxXVswXS5GcmVxdWVuY3ksIDQsIDUpO1xuICAgIC8vIFNvcnQgYnkgZGlzdGFuY2UsIHRoZW4gbnVtYmVyIG9mIHJlcGVhdGVycyBpbiBncm91cCwgdGhlbiBncm91cCBuYW1lXG4gICAgY29uc3QgYVN0ciA9IGAke2FNaX0gJHthTnVtUmVwZWF0ZXJzfSAke2FHcm91cE5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xuICAgIGNvbnN0IGJTdHIgPSBgJHtiTWl9ICR7Yk51bVJlcGVhdGVyc30gJHtiR3JvdXBOYW1lfSAke2JGcmVxdWVuY3l9YDtcbiAgICAvLyBTb3J0IGJ5IG51bWJlciBvZiByZXBlYXRlcnMgaW4gZ3JvdXAsIHRoZW4gZGlzdGFuY2UsIHRoZW4gZ3JvdXAgbmFtZVxuICAgIC8vIGNvbnN0IGFTdHIgPSBgJHthTnVtUmVwZWF0ZXJzfSAke2FNaX0gJHthR3JvdXBOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICAvLyBjb25zdCBiU3RyID0gYCR7Yk51bVJlcGVhdGVyc30gJHtiTWl9ICR7Ykdyb3VwTmFtZX0gJHtiRnJlcXVlbmN5fWA7XG5cbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XG4gIH0pO1xuICByZXR1cm4gc29ydGluZy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IFsuLi5wcmV2LCAuLi5jdXJyWzFdXSwgW10gYXMgSVJlcGVhdGVyW10pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdGFydCgpIHtcbiAgLy8gYXdhaXQgZG9JdChcIkNhbGxcIiwgXCJyZXBlYXRlcnMvZGF0YS9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25cIiwgXCJyZXBlYXRlcnMvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBcInJlcGVhdGVycy9kYXRhL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvblwiLCBcInJlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGxcIik7XG4gIC8vIGNvbnN0IGNvRmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy9DTy9cIikpLm1hcCgoZikgPT4gYENPLyR7Zn1gKTtcbiAgLy8gY29uc3QgdXRGaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL1VUL1wiKSkubWFwKChmKSA9PiBgVVQvJHtmfWApO1xuICAvLyBjb25zdCBubUZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2RhdGEvTk0vXCIpKS5tYXAoKGYpID0+IGBOTS8ke2Z9YCk7XG4gIC8vIGNvbnN0IGFsbEZpbGVzID0gLyogWy4uLmNvRmlsZXMsIC4uLnV0RmlsZXMsIC4uLm5tRmlsZXNdICovIGNvRmlsZXMuZmlsdGVyKChmKSA9PiAvXFwuanNvbiQvLnRlc3QoZikpLm1hcCgoZikgPT4gZi5yZXBsYWNlKFwiLmpzb25cIiwgXCJcIikpO1xuICAvLyBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcbiAgLy8gICBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBgcmVwZWF0ZXJzL2RhdGEvJHtmaWxlfS5qc29uYCwgYHJlcGVhdGVycy9ncm91cHMvJHtmaWxlfSAtIENhbGxgKTtcbiAgLy8gfVxuICAvLyBhd2FpdCBkb0l0KFwiQ29sb3JhZG8gU3ByaW5nc1wiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkRlbnZlclwiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkdyYW5kIEp1bmN0aW9uXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLFxuICAvLyAgIGBkYXRhL3JlcGVhdGVycy9yZXN1bHRzL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvbmAsXG4gIC8vICAgYGRhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbGApO1xuICBhd2FpdCBkb0l0KFwiQ2FsbFwiLFxuICAgIGBkYXRhL3JlcGVhdGVycy9jb21iaW5lZC9DTy5qc29uYCxcbiAgICBgZGF0YS9yZXBlYXRlcnMvZ3JvdXBzL2NvbWJpbmVkL0NPIC0gQ2FsbGApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydCgpO1xuIl19