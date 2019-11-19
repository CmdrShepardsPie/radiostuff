var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9ncm91cC1ieS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUVBLG9EQUF1RTtJQUN2RSw4Q0FBa0Q7SUFDbEQsc0RBQWlEO0lBRWpELGtEQUEwQjtJQUUxQixNQUFNLEdBQUcsR0FBNEIsdUJBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUUzRCxLQUFLLFVBQVUsSUFBSSxDQUFDLE9BQTJCLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjtRQUN0RixNQUFNLFFBQVEsR0FBVyxNQUFNLDBCQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrRkFBa0Y7UUFDNUksTUFBTSxTQUFTLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFbEUsa0dBQWtHO1FBQ2xHLG9FQUFvRTtRQUNwRSw0QkFBNEI7UUFDNUIsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMxSCxNQUFNLE9BQU8sR0FBbUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxRCxNQUFNLDhCQUFpQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFJO0lBQ04sQ0FBQztJQUVELFNBQVMsS0FBSyxDQUFDLE9BQTJCLEVBQUUsU0FBeUI7UUFDbkUsTUFBTSxXQUFXLEdBQXdDLEVBQUUsQ0FBQztRQUM1RCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBc0IsRUFBRSxFQUFFO1lBQzNDLE1B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Q2xDLHdCQUF3QjtRQUN4QixnQ0FBZ0M7UUFDaEMscUJBQXFCO1FBQ3JCLHVEQUF1RDtRQUN2RCx5REFBeUQ7UUFDekQsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUNmLGlDQUFpQyxFQUNqQywwQ0FBMEMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxrQkFBZSxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5pbXBvcnQgeyByZWFkRmlsZUFzeW5jLCB3cml0ZVRvSnNvbkFuZENzdiB9IGZyb20gJ0BoZWxwZXJzL2ZzLWhlbHBlcnMnO1xuaW1wb3J0IHsgbnVtYmVyVG9TdHJpbmcgfSBmcm9tICdAaGVscGVycy9oZWxwZXJzJztcbmltcG9ydCB7IGNyZWF0ZUxvZyB9IGZyb20gJ0BoZWxwZXJzL2xvZy1oZWxwZXJzJztcbmltcG9ydCB7IElSZXBlYXRlclJhdyB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktcmVwZWF0ZXItcmF3JztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmNvbnN0IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQgPSBjcmVhdGVMb2coJ0dyb3VwIEJ5Jyk7XG5cbmFzeW5jIGZ1bmN0aW9uIGRvSXQoZ3JvdXBCeToga2V5b2YgSVJlcGVhdGVyUmF3LCBpbkZpbGVOYW1lOiBzdHJpbmcsIG91dEZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZmlsZURhdGE6IEJ1ZmZlciA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoaW5GaWxlTmFtZSk7IC8vIGF3YWl0IGdldEFsbEZpbGVzRnJvbURpcmVjdG9yeShcIi4vcmVwZWF0ZXJzL2RhdGEvQ08vXCIsIFwiLmpzb25cIikgYXMgSVJlcGVhdGVyW107XG4gIGNvbnN0IHJlcGVhdGVyczogSVJlcGVhdGVyUmF3W10gPSBKU09OLnBhcnNlKGZpbGVEYXRhLnRvU3RyaW5nKCkpO1xuXG4gIC8vIE9ubHkgZ3JvdXBpbmcgYnkgdGhlIGtleXMgaW4gdGhlIGZpcnN0IHJvdy4gSXQncyBub3QgY29tcHJlaGVuc2l2ZSBidXQgY29udGFpbnMgdGhlIGVzc2VudGlhbHMuXG4gIC8vIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXBlYXRlcnNbMF0pIGFzIEFycmF5PGtleW9mIElSZXBlYXRlcj47XG4gIC8vIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgbG9nKGNoYWxrLmdyZWVuKCdQcm9jZXNzJyksIGNoYWxrLmJsdWUoJ0dyb3VwJyksIGdyb3VwQnksIGNoYWxrLnllbGxvdygnSW4nKSwgaW5GaWxlTmFtZSwgY2hhbGsuY3lhbignT3V0JyksIG91dEZpbGVOYW1lKTtcbiAgY29uc3QgZ3JvdXBlZDogSVJlcGVhdGVyUmF3W10gPSBncm91cChncm91cEJ5LCByZXBlYXRlcnMpO1xuICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdihvdXRGaWxlTmFtZSwgZ3JvdXBlZCk7XG4gIC8vIH1cbn1cblxuZnVuY3Rpb24gZ3JvdXAoZ3JvdXBCeToga2V5b2YgSVJlcGVhdGVyUmF3LCByZXBlYXRlcnM6IElSZXBlYXRlclJhd1tdKTogSVJlcGVhdGVyUmF3W10ge1xuICBjb25zdCBrZXllZEdyb3VwczogeyBbIGtleTogc3RyaW5nIF06IElSZXBlYXRlclJhd1tdIH0gPSB7fTtcbiAgcmVwZWF0ZXJzLmZvckVhY2goKHJlcGVhdGVyOiBJUmVwZWF0ZXJSYXcpID0+IHtcbiAgICBjb25zdCBrZXlWYWw6IG51bWJlciB8IHVuZGVmaW5lZCB8IHN0cmluZyA9IHJlcGVhdGVyW2dyb3VwQnldO1xuICAgIGlmIChrZXlWYWwgIT09IHVuZGVmaW5lZCAmJiBrZXlWYWwgIT09IG51bGwgJiYga2V5VmFsICE9PSAnJykge1xuICAgICAgaWYgKCFrZXllZEdyb3Vwc1trZXlWYWxdKSB7XG4gICAgICAgIGtleWVkR3JvdXBzW2tleVZhbF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIGtleWVkR3JvdXBzW2tleVZhbF0ucHVzaChyZXBlYXRlcik7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgc29ydGluZzogQXJyYXk8W3N0cmluZywgSVJlcGVhdGVyUmF3W11dPiA9IE9iamVjdC5lbnRyaWVzKGtleWVkR3JvdXBzKTtcbiAgc29ydGluZy5zb3J0KChhOiBbc3RyaW5nLCBJUmVwZWF0ZXJSYXdbXV0sIGI6IFtzdHJpbmcsIElSZXBlYXRlclJhd1tdXSkgPT4ge1xuICAgIGNvbnN0IGFNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYVsxXVswXS5NaSB8fCAwLCA1LCAyNCk7XG4gICAgY29uc3QgYk1pOiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhiWzFdWzBdLk1pIHx8IDAsIDUsIDI0KTtcbiAgICBjb25zdCBhTnVtUmVwZWF0ZXJzOiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZygxMDAgLSBhWzFdLmxlbmd0aCwgNCwgMSk7XG4gICAgY29uc3QgYk51bVJlcGVhdGVyczogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoMTAwIC0gYlsxXS5sZW5ndGgsIDQsIDEpO1xuICAgIGNvbnN0IGFHcm91cE5hbWU6IHN0cmluZyA9IGFbMF07XG4gICAgY29uc3QgYkdyb3VwTmFtZTogc3RyaW5nID0gYlswXTtcbiAgICBjb25zdCBhRnJlcXVlbmN5OiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhhWzFdWzBdLkZyZXF1ZW5jeSB8fCAwLCA0LCA1KTtcbiAgICBjb25zdCBiRnJlcXVlbmN5OiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhiWzFdWzBdLkZyZXF1ZW5jeSB8fCAwLCA0LCA1KTtcbiAgICAvLyBTb3J0IGJ5IGRpc3RhbmNlLCB0aGVuIG51bWJlciBvZiByZXBlYXRlcnMgaW4gZ3JvdXAsIHRoZW4gZ3JvdXAgbmFtZVxuICAgIGNvbnN0IGFTdHI6IHN0cmluZyA9IGAke2FNaX0gJHthTnVtUmVwZWF0ZXJzfSAke2FHcm91cE5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xuICAgIGNvbnN0IGJTdHI6IHN0cmluZyA9IGAke2JNaX0gJHtiTnVtUmVwZWF0ZXJzfSAke2JHcm91cE5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xuICAgIC8vIFNvcnQgYnkgbnVtYmVyIG9mIHJlcGVhdGVycyBpbiBncm91cCwgdGhlbiBkaXN0YW5jZSwgdGhlbiBncm91cCBuYW1lXG4gICAgLy8gY29uc3QgYVN0ciA9IGAke2FOdW1SZXBlYXRlcnN9ICR7YU1pfSAke2FHcm91cE5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xuICAgIC8vIGNvbnN0IGJTdHIgPSBgJHtiTnVtUmVwZWF0ZXJzfSAke2JNaX0gJHtiR3JvdXBOYW1lfSAke2JGcmVxdWVuY3l9YDtcblxuICAgIHJldHVybiBhU3RyID4gYlN0ciA/IDEgOiBhU3RyIDwgYlN0ciA/IC0xIDogMDtcbiAgfSk7XG4gIHJldHVybiBzb3J0aW5nLnJlZHVjZSgocHJldjogSVJlcGVhdGVyUmF3W10sIGN1cnI6IFtzdHJpbmcsIElSZXBlYXRlclJhd1tdXSkgPT4gWy4uLnByZXYsIC4uLmN1cnJbMV1dLCBbXSBhcyBJUmVwZWF0ZXJSYXdbXSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBcInJlcGVhdGVycy9kYXRhL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvblwiLCBcInJlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGxcIik7XG4gIC8vIGF3YWl0IGRvSXQoXCJDYWxsXCIsIFwicmVwZWF0ZXJzL2RhdGEvQ08vQ29sb3JhZG8gU3ByaW5ncy5qc29uXCIsIFwicmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbFwiKTtcbiAgLy8gY29uc3QgY29GaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCJkYXRhL3JlcGVhdGVycy9yZXN1bHRzL0NPL1wiKSkubWFwKChmKSA9PiBgQ08vJHtmfWApO1xuICAvLyBjb25zdCB1dEZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2RhdGEvVVQvXCIpKS5tYXAoKGYpID0+IGBVVC8ke2Z9YCk7XG4gIC8vIGNvbnN0IG5tRmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiLi9yZXBlYXRlcnMvZGF0YS9OTS9cIikpLm1hcCgoZikgPT4gYE5NLyR7Zn1gKTtcbiAgLy8gY29uc3QgYWxsRmlsZXMgPSAvKiBbLi4uY29GaWxlcywgLi4udXRGaWxlcywgLi4ubm1GaWxlc10gKi8gY29GaWxlcy5maWx0ZXIoKGYpID0+IC9cXC5qc29uJC8udGVzdChmKSkubWFwKChmKSA9PiBmLnJlcGxhY2UoXCIuanNvblwiLCBcIlwiKSk7XG4gIC8vIGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlcykge1xuICAvLyAgIGF3YWl0IGRvSXQoXCJDYWxsXCIsIGByZXBlYXRlcnMvZGF0YS8ke2ZpbGV9Lmpzb25gLCBgcmVwZWF0ZXJzL2dyb3Vwcy8ke2ZpbGV9IC0gQ2FsbGApO1xuICAvLyB9XG4gIC8vIGF3YWl0IGRvSXQoXCJDb2xvcmFkbyBTcHJpbmdzXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiRGVudmVyXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiR3JhbmQgSnVuY3Rpb25cIik7XG4gIC8vIGF3YWl0IGRvSXQoXCJDYWxsXCIsXG4gIC8vICAgYGRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvQ08vQ29sb3JhZG8gU3ByaW5ncy5qc29uYCxcbiAgLy8gICBgZGF0YS9yZXBlYXRlcnMvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsYCk7XG4gIGF3YWl0IGRvSXQoJ0NhbGwnLFxuICAgIGBkYXRhL3JlcGVhdGVycy9jb21iaW5lZC9DTy5qc29uYCxcbiAgICBgZGF0YS9yZXBlYXRlcnMvZ3JvdXBzL2NvbWJpbmVkL0NPIC0gQ2FsbGApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydCgpO1xuIl19