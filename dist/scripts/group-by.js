var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    var fs_helpers_1 = require("@helpers/fs-helpers");
    var helpers_1 = require("@helpers/helpers");
    var log_helpers_1 = require("@helpers/log-helpers");
    var chalk_1 = require("chalk");
    var log = log_helpers_1.createLog("Group By");
    function doIt(groupBy, inFileName, outFileName) {
        return __awaiter(this, void 0, void 0, function () {
            var fileData, repeaters, grouped;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_helpers_1.readFileAsync(inFileName)];
                    case 1:
                        fileData = _a.sent();
                        repeaters = JSON.parse(fileData.toString());
                        // Only grouping by the keys in the first row. It's not comprehensive but contains the essentials.
                        // const keys = Object.keys(repeaters[0]) as Array<keyof IRepeater>;
                        // for (const key of keys) {
                        log(chalk_1.default.green("Process"), chalk_1.default.blue("Group"), groupBy, chalk_1.default.yellow("In"), inFileName, chalk_1.default.cyan("Out"), outFileName);
                        grouped = group(groupBy, repeaters);
                        return [4 /*yield*/, fs_helpers_1.writeToJsonAndCsv(outFileName, grouped)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function group(groupBy, repeaters) {
        var keyedGroups = {};
        repeaters.forEach(function (repeater) {
            var keyVal = repeater[groupBy];
            if (keyVal !== undefined && keyVal !== null && keyVal !== "") {
                if (!keyedGroups[keyVal]) {
                    keyedGroups[keyVal] = [];
                }
                keyedGroups[keyVal].push(repeater);
            }
        });
        var sorting = Object.entries(keyedGroups);
        sorting.sort(function (a, b) {
            var aMi = helpers_1.numberToString(a[1][0].Mi * 100, 3, 24);
            var bMi = helpers_1.numberToString(b[1][0].Mi * 100, 3, 24);
            var aNumRepeaters = helpers_1.numberToString(100 - a[1].length, 4, 1);
            var bNumRepeaters = helpers_1.numberToString(100 - b[1].length, 4, 1);
            var aGroupName = a[0];
            var bGroupName = b[0];
            var aFrequency = helpers_1.numberToString(a[1][0].Frequency, 4, 5);
            var bFrequency = helpers_1.numberToString(b[1][0].Frequency, 4, 5);
            // Sort by distance, then number of repeaters in group, then group name
            var aStr = aMi + " " + aNumRepeaters + " " + aGroupName + " " + aFrequency;
            var bStr = bMi + " " + bNumRepeaters + " " + bGroupName + " " + bFrequency;
            // Sort by number of repeaters in group, then distance, then group name
            // const aStr = `${aNumRepeaters} ${aMi} ${aGroupName} ${aFrequency}`;
            // const bStr = `${bNumRepeaters} ${bMi} ${bGroupName} ${bFrequency}`;
            return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
        });
        return sorting.reduce(function (prev, curr) { return __spread(prev, curr[1]); }, []);
    }
    function start() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
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
                    return [4 /*yield*/, doIt("Call", "data/repeaters/combined/CO.json", "data/repeaters/groups/combined/CO - Call")];
                    case 1:
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
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.default = start();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9ncm91cC1ieS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBK0I7SUFFL0Isa0RBQXFFO0lBQ3JFLDRDQUFnRDtJQUNoRCxvREFBK0M7SUFDL0MsK0JBQTBCO0lBRzFCLElBQU0sR0FBRyxHQUFHLHVCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFbEMsU0FBZSxJQUFJLENBQUMsT0FBd0IsRUFBRSxVQUFrQixFQUFFLFdBQW1COzs7Ozs0QkFDbEUscUJBQU0sMEJBQWEsQ0FBQyxVQUFVLENBQUMsRUFBQTs7d0JBQTFDLFFBQVEsR0FBRyxTQUErQjt3QkFDMUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFnQixDQUFDO3dCQUVqRSxrR0FBa0c7d0JBQ2xHLG9FQUFvRTt3QkFDcEUsNEJBQTRCO3dCQUM1QixHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO3dCQUNwSCxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDMUMscUJBQU0sOEJBQWlCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxFQUFBOzt3QkFBN0MsU0FBNkMsQ0FBQzs7Ozs7S0FFL0M7SUFFRCxTQUFTLEtBQUssQ0FBQyxPQUF3QixFQUFFLFNBQXNCO1FBQzdELElBQU0sV0FBVyxHQUFx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Qyx3QkFBd0I7b0JBQ3hCLGdDQUFnQztvQkFDaEMscUJBQXFCO29CQUNyQix1REFBdUQ7b0JBQ3ZELHlEQUF5RDtvQkFDekQscUJBQU0sSUFBSSxDQUFDLE1BQU0sRUFDZixpQ0FBaUMsRUFDakMsMENBQTBDLENBQUMsRUFBQTs7d0JBakI3QyxnSEFBZ0g7d0JBQ2hILGdIQUFnSDt3QkFDaEgsNEZBQTRGO3dCQUM1RixzRkFBc0Y7d0JBQ3RGLHNGQUFzRjt3QkFDdEYsMklBQTJJO3dCQUMzSSxpQ0FBaUM7d0JBQ2pDLDBGQUEwRjt3QkFDMUYsSUFBSTt3QkFDSixrQ0FBa0M7d0JBQ2xDLHdCQUF3Qjt3QkFDeEIsZ0NBQWdDO3dCQUNoQyxxQkFBcUI7d0JBQ3JCLHVEQUF1RDt3QkFDdkQseURBQXlEO3dCQUN6RCxTQUU2QyxDQUFDOzs7OztLQUMvQztJQUVELGtCQUFlLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwibW9kdWxlLWFsaWFzL3JlZ2lzdGVyXCI7XG5cbmltcG9ydCB7cmVhZEZpbGVBc3luYywgd3JpdGVUb0pzb25BbmRDc3Z9IGZyb20gXCJAaGVscGVycy9mcy1oZWxwZXJzXCI7XG5pbXBvcnQge251bWJlclRvU3RyaW5nfSBmcm9tIFwiQGhlbHBlcnMvaGVscGVyc1wiO1xuaW1wb3J0IHtjcmVhdGVMb2d9IGZyb20gXCJAaGVscGVycy9sb2ctaGVscGVyc1wiO1xuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IHtJUmVwZWF0ZXJ9IGZyb20gXCIuL21vZHVsZXMvaS5yZXBlYXRlclwiO1xuXG5jb25zdCBsb2cgPSBjcmVhdGVMb2coXCJHcm91cCBCeVwiKTtcblxuYXN5bmMgZnVuY3Rpb24gZG9JdChncm91cEJ5OiBrZXlvZiBJUmVwZWF0ZXIsIGluRmlsZU5hbWU6IHN0cmluZywgb3V0RmlsZU5hbWU6IHN0cmluZykge1xuICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoaW5GaWxlTmFtZSk7IC8vIGF3YWl0IGdldEFsbEZpbGVzRnJvbURpcmVjdG9yeShcIi4vcmVwZWF0ZXJzL2RhdGEvQ08vXCIsIFwiLmpzb25cIikgYXMgSVJlcGVhdGVyW107XG4gIGNvbnN0IHJlcGVhdGVycyA9IEpTT04ucGFyc2UoZmlsZURhdGEudG9TdHJpbmcoKSkgYXMgSVJlcGVhdGVyW107XG5cbiAgLy8gT25seSBncm91cGluZyBieSB0aGUga2V5cyBpbiB0aGUgZmlyc3Qgcm93LiBJdCdzIG5vdCBjb21wcmVoZW5zaXZlIGJ1dCBjb250YWlucyB0aGUgZXNzZW50aWFscy5cbiAgLy8gY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJlcGVhdGVyc1swXSkgYXMgQXJyYXk8a2V5b2YgSVJlcGVhdGVyPjtcbiAgLy8gZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICBsb2coY2hhbGsuZ3JlZW4oXCJQcm9jZXNzXCIpLCBjaGFsay5ibHVlKFwiR3JvdXBcIiksIGdyb3VwQnksIGNoYWxrLnllbGxvdyhcIkluXCIpLCBpbkZpbGVOYW1lLCBjaGFsay5jeWFuKFwiT3V0XCIpLCBvdXRGaWxlTmFtZSk7XG4gIGNvbnN0IGdyb3VwZWQgPSBncm91cChncm91cEJ5LCByZXBlYXRlcnMpO1xuICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdihvdXRGaWxlTmFtZSwgZ3JvdXBlZCk7XG4gIC8vIH1cbn1cblxuZnVuY3Rpb24gZ3JvdXAoZ3JvdXBCeToga2V5b2YgSVJlcGVhdGVyLCByZXBlYXRlcnM6IElSZXBlYXRlcltdKSB7XG4gIGNvbnN0IGtleWVkR3JvdXBzOiB7IFtpbmRleDogc3RyaW5nXTogSVJlcGVhdGVyW10gfSA9IHt9O1xuICByZXBlYXRlcnMuZm9yRWFjaCgocmVwZWF0ZXIpID0+IHtcbiAgICBjb25zdCBrZXlWYWwgPSByZXBlYXRlcltncm91cEJ5XTtcbiAgICBpZiAoa2V5VmFsICE9PSB1bmRlZmluZWQgJiYga2V5VmFsICE9PSBudWxsICYmIGtleVZhbCAhPT0gXCJcIikge1xuICAgICAgaWYgKCFrZXllZEdyb3Vwc1trZXlWYWxdKSB7XG4gICAgICAgIGtleWVkR3JvdXBzW2tleVZhbF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIGtleWVkR3JvdXBzW2tleVZhbF0ucHVzaChyZXBlYXRlcik7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgc29ydGluZyA9IE9iamVjdC5lbnRyaWVzKGtleWVkR3JvdXBzKTtcbiAgc29ydGluZy5zb3J0KChhLCBiKSA9PiB7XG4gICAgY29uc3QgYU1pID0gbnVtYmVyVG9TdHJpbmcoYVsxXVswXS5NaSAqIDEwMCwgMywgMjQpO1xuICAgIGNvbnN0IGJNaSA9IG51bWJlclRvU3RyaW5nKGJbMV1bMF0uTWkgKiAxMDAsIDMsIDI0KTtcbiAgICBjb25zdCBhTnVtUmVwZWF0ZXJzID0gbnVtYmVyVG9TdHJpbmcoMTAwIC0gYVsxXS5sZW5ndGgsIDQsIDEpO1xuICAgIGNvbnN0IGJOdW1SZXBlYXRlcnMgPSBudW1iZXJUb1N0cmluZygxMDAgLSBiWzFdLmxlbmd0aCwgNCwgMSk7XG4gICAgY29uc3QgYUdyb3VwTmFtZSA9IGFbMF07XG4gICAgY29uc3QgYkdyb3VwTmFtZSA9IGJbMF07XG4gICAgY29uc3QgYUZyZXF1ZW5jeSA9IG51bWJlclRvU3RyaW5nKGFbMV1bMF0uRnJlcXVlbmN5LCA0LCA1KTtcbiAgICBjb25zdCBiRnJlcXVlbmN5ID0gbnVtYmVyVG9TdHJpbmcoYlsxXVswXS5GcmVxdWVuY3ksIDQsIDUpO1xuICAgIC8vIFNvcnQgYnkgZGlzdGFuY2UsIHRoZW4gbnVtYmVyIG9mIHJlcGVhdGVycyBpbiBncm91cCwgdGhlbiBncm91cCBuYW1lXG4gICAgY29uc3QgYVN0ciA9IGAke2FNaX0gJHthTnVtUmVwZWF0ZXJzfSAke2FHcm91cE5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xuICAgIGNvbnN0IGJTdHIgPSBgJHtiTWl9ICR7Yk51bVJlcGVhdGVyc30gJHtiR3JvdXBOYW1lfSAke2JGcmVxdWVuY3l9YDtcbiAgICAvLyBTb3J0IGJ5IG51bWJlciBvZiByZXBlYXRlcnMgaW4gZ3JvdXAsIHRoZW4gZGlzdGFuY2UsIHRoZW4gZ3JvdXAgbmFtZVxuICAgIC8vIGNvbnN0IGFTdHIgPSBgJHthTnVtUmVwZWF0ZXJzfSAke2FNaX0gJHthR3JvdXBOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICAvLyBjb25zdCBiU3RyID0gYCR7Yk51bVJlcGVhdGVyc30gJHtiTWl9ICR7Ykdyb3VwTmFtZX0gJHtiRnJlcXVlbmN5fWA7XG5cbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XG4gIH0pO1xuICByZXR1cm4gc29ydGluZy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IFsuLi5wcmV2LCAuLi5jdXJyWzFdXSwgW10gYXMgSVJlcGVhdGVyW10pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdGFydCgpIHtcbiAgLy8gYXdhaXQgZG9JdChcIkNhbGxcIiwgXCJyZXBlYXRlcnMvZGF0YS9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25cIiwgXCJyZXBlYXRlcnMvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBcInJlcGVhdGVycy9kYXRhL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvblwiLCBcInJlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGxcIik7XG4gIC8vIGNvbnN0IGNvRmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy9DTy9cIikpLm1hcCgoZikgPT4gYENPLyR7Zn1gKTtcbiAgLy8gY29uc3QgdXRGaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL1VUL1wiKSkubWFwKChmKSA9PiBgVVQvJHtmfWApO1xuICAvLyBjb25zdCBubUZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2RhdGEvTk0vXCIpKS5tYXAoKGYpID0+IGBOTS8ke2Z9YCk7XG4gIC8vIGNvbnN0IGFsbEZpbGVzID0gLyogWy4uLmNvRmlsZXMsIC4uLnV0RmlsZXMsIC4uLm5tRmlsZXNdICovIGNvRmlsZXMuZmlsdGVyKChmKSA9PiAvXFwuanNvbiQvLnRlc3QoZikpLm1hcCgoZikgPT4gZi5yZXBsYWNlKFwiLmpzb25cIiwgXCJcIikpO1xuICAvLyBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcbiAgLy8gICBhd2FpdCBkb0l0KFwiQ2FsbFwiLCBgcmVwZWF0ZXJzL2RhdGEvJHtmaWxlfS5qc29uYCwgYHJlcGVhdGVycy9ncm91cHMvJHtmaWxlfSAtIENhbGxgKTtcbiAgLy8gfVxuICAvLyBhd2FpdCBkb0l0KFwiQ29sb3JhZG8gU3ByaW5nc1wiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkRlbnZlclwiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkdyYW5kIEp1bmN0aW9uXCIpO1xuICAvLyBhd2FpdCBkb0l0KFwiQ2FsbFwiLFxuICAvLyAgIGBkYXRhL3JlcGVhdGVycy9yZXN1bHRzL0NPL0NvbG9yYWRvIFNwcmluZ3MuanNvbmAsXG4gIC8vICAgYGRhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbGApO1xuICBhd2FpdCBkb0l0KFwiQ2FsbFwiLFxuICAgIGBkYXRhL3JlcGVhdGVycy9jb21iaW5lZC9DTy5qc29uYCxcbiAgICBgZGF0YS9yZXBlYXRlcnMvZ3JvdXBzL2NvbWJpbmVkL0NPIC0gQ2FsbGApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydCgpO1xuIl19