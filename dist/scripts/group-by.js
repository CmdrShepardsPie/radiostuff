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
    exports.__esModule = true;
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
                        log(chalk_1["default"].green("Process"), chalk_1["default"].blue("Group"), groupBy, chalk_1["default"].yellow("In"), inFileName, chalk_1["default"].cyan("Out"), outFileName);
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
    exports["default"] = start();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9ncm91cC1ieS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBK0I7SUFFL0Isa0RBQXFFO0lBQ3JFLDRDQUFnRDtJQUNoRCxvREFBK0M7SUFDL0MsK0JBQTBCO0lBRzFCLElBQU0sR0FBRyxHQUFHLHVCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFbEMsU0FBZSxJQUFJLENBQUMsT0FBd0IsRUFBRSxVQUFrQixFQUFFLFdBQW1COzs7Ozs0QkFDbEUscUJBQU0sMEJBQWEsQ0FBQyxVQUFVLENBQUMsRUFBQTs7d0JBQTFDLFFBQVEsR0FBRyxTQUErQjt3QkFDMUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFnQixDQUFDO3dCQUVqRSxrR0FBa0c7d0JBQ2xHLG9FQUFvRTt3QkFDcEUsNEJBQTRCO3dCQUM1QixHQUFHLENBQUMsa0JBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsa0JBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLGtCQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxrQkFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQzt3QkFDcEgsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQzFDLHFCQUFNLDhCQUFpQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsRUFBQTs7d0JBQTdDLFNBQTZDLENBQUM7Ozs7O0tBRS9DO0lBRUQsU0FBUyxLQUFLLENBQUMsT0FBd0IsRUFBRSxTQUFzQjtRQUM3RCxJQUFNLFdBQVcs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QkFDbEMsd0JBQXdCO29CQUN4QixnQ0FBZ0M7b0JBQ2hDLHFCQUFxQjtvQkFDckIsdURBQXVEO29CQUN2RCx5REFBeUQ7b0JBQ3pELHFCQUFNLElBQUksQ0FBQyxNQUFNLEVBQ2YsaUNBQWlDLEVBQ2pDLDBDQUEwQyxDQUFDLEVBQUE7O3dCQWpCN0MsZ0hBQWdIO3dCQUNoSCxnSEFBZ0g7d0JBQ2hILDRGQUE0Rjt3QkFDNUYsc0ZBQXNGO3dCQUN0RixzRkFBc0Y7d0JBQ3RGLDJJQUEySTt3QkFDM0ksaUNBQWlDO3dCQUNqQywwRkFBMEY7d0JBQzFGLElBQUk7d0JBQ0osa0NBQWtDO3dCQUNsQyx3QkFBd0I7d0JBQ3hCLGdDQUFnQzt3QkFDaEMscUJBQXFCO3dCQUNyQix1REFBdUQ7d0JBQ3ZELHlEQUF5RDt3QkFDekQsU0FFNkMsQ0FBQzs7Ozs7S0FDL0M7SUFFRCxxQkFBZSxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcIm1vZHVsZS1hbGlhcy9yZWdpc3RlclwiO1xuXG5pbXBvcnQge3JlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2fSBmcm9tIFwiQGhlbHBlcnMvZnMtaGVscGVyc1wiO1xuaW1wb3J0IHtudW1iZXJUb1N0cmluZ30gZnJvbSBcIkBoZWxwZXJzL2hlbHBlcnNcIjtcbmltcG9ydCB7Y3JlYXRlTG9nfSBmcm9tIFwiQGhlbHBlcnMvbG9nLWhlbHBlcnNcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB7SVJlcGVhdGVyfSBmcm9tIFwiLi9tb2R1bGVzL2kucmVwZWF0ZXJcIjtcblxuY29uc3QgbG9nID0gY3JlYXRlTG9nKFwiR3JvdXAgQnlcIik7XG5cbmFzeW5jIGZ1bmN0aW9uIGRvSXQoZ3JvdXBCeToga2V5b2YgSVJlcGVhdGVyLCBpbkZpbGVOYW1lOiBzdHJpbmcsIG91dEZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCByZWFkRmlsZUFzeW5jKGluRmlsZU5hbWUpOyAvLyBhd2FpdCBnZXRBbGxGaWxlc0Zyb21EaXJlY3RvcnkoXCIuL3JlcGVhdGVycy9kYXRhL0NPL1wiLCBcIi5qc29uXCIpIGFzIElSZXBlYXRlcltdO1xuICBjb25zdCByZXBlYXRlcnMgPSBKU09OLnBhcnNlKGZpbGVEYXRhLnRvU3RyaW5nKCkpIGFzIElSZXBlYXRlcltdO1xuXG4gIC8vIE9ubHkgZ3JvdXBpbmcgYnkgdGhlIGtleXMgaW4gdGhlIGZpcnN0IHJvdy4gSXQncyBub3QgY29tcHJlaGVuc2l2ZSBidXQgY29udGFpbnMgdGhlIGVzc2VudGlhbHMuXG4gIC8vIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXBlYXRlcnNbMF0pIGFzIEFycmF5PGtleW9mIElSZXBlYXRlcj47XG4gIC8vIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgbG9nKGNoYWxrLmdyZWVuKFwiUHJvY2Vzc1wiKSwgY2hhbGsuYmx1ZShcIkdyb3VwXCIpLCBncm91cEJ5LCBjaGFsay55ZWxsb3coXCJJblwiKSwgaW5GaWxlTmFtZSwgY2hhbGsuY3lhbihcIk91dFwiKSwgb3V0RmlsZU5hbWUpO1xuICBjb25zdCBncm91cGVkID0gZ3JvdXAoZ3JvdXBCeSwgcmVwZWF0ZXJzKTtcbiAgYXdhaXQgd3JpdGVUb0pzb25BbmRDc3Yob3V0RmlsZU5hbWUsIGdyb3VwZWQpO1xuICAvLyB9XG59XG5cbmZ1bmN0aW9uIGdyb3VwKGdyb3VwQnk6IGtleW9mIElSZXBlYXRlciwgcmVwZWF0ZXJzOiBJUmVwZWF0ZXJbXSkge1xuICBjb25zdCBrZXllZEdyb3VwczogeyBbaW5kZXg6IHN0cmluZ106IElSZXBlYXRlcltdIH0gPSB7fTtcbiAgcmVwZWF0ZXJzLmZvckVhY2goKHJlcGVhdGVyKSA9PiB7XG4gICAgY29uc3Qga2V5VmFsID0gcmVwZWF0ZXJbZ3JvdXBCeV07XG4gICAgaWYgKGtleVZhbCAhPT0gdW5kZWZpbmVkICYmIGtleVZhbCAhPT0gbnVsbCAmJiBrZXlWYWwgIT09IFwiXCIpIHtcbiAgICAgIGlmICgha2V5ZWRHcm91cHNba2V5VmFsXSkge1xuICAgICAgICBrZXllZEdyb3Vwc1trZXlWYWxdID0gW107XG4gICAgICB9XG4gICAgICBrZXllZEdyb3Vwc1trZXlWYWxdLnB1c2gocmVwZWF0ZXIpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHNvcnRpbmcgPSBPYmplY3QuZW50cmllcyhrZXllZEdyb3Vwcyk7XG4gIHNvcnRpbmcuc29ydCgoYSwgYikgPT4ge1xuICAgIGNvbnN0IGFNaSA9IG51bWJlclRvU3RyaW5nKGFbMV1bMF0uTWkgKiAxMDAsIDMsIDI0KTtcbiAgICBjb25zdCBiTWkgPSBudW1iZXJUb1N0cmluZyhiWzFdWzBdLk1pICogMTAwLCAzLCAyNCk7XG4gICAgY29uc3QgYU51bVJlcGVhdGVycyA9IG51bWJlclRvU3RyaW5nKDEwMCAtIGFbMV0ubGVuZ3RoLCA0LCAxKTtcbiAgICBjb25zdCBiTnVtUmVwZWF0ZXJzID0gbnVtYmVyVG9TdHJpbmcoMTAwIC0gYlsxXS5sZW5ndGgsIDQsIDEpO1xuICAgIGNvbnN0IGFHcm91cE5hbWUgPSBhWzBdO1xuICAgIGNvbnN0IGJHcm91cE5hbWUgPSBiWzBdO1xuICAgIGNvbnN0IGFGcmVxdWVuY3kgPSBudW1iZXJUb1N0cmluZyhhWzFdWzBdLkZyZXF1ZW5jeSwgNCwgNSk7XG4gICAgY29uc3QgYkZyZXF1ZW5jeSA9IG51bWJlclRvU3RyaW5nKGJbMV1bMF0uRnJlcXVlbmN5LCA0LCA1KTtcbiAgICAvLyBTb3J0IGJ5IGRpc3RhbmNlLCB0aGVuIG51bWJlciBvZiByZXBlYXRlcnMgaW4gZ3JvdXAsIHRoZW4gZ3JvdXAgbmFtZVxuICAgIGNvbnN0IGFTdHIgPSBgJHthTWl9ICR7YU51bVJlcGVhdGVyc30gJHthR3JvdXBOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICBjb25zdCBiU3RyID0gYCR7Yk1pfSAke2JOdW1SZXBlYXRlcnN9ICR7Ykdyb3VwTmFtZX0gJHtiRnJlcXVlbmN5fWA7XG4gICAgLy8gU29ydCBieSBudW1iZXIgb2YgcmVwZWF0ZXJzIGluIGdyb3VwLCB0aGVuIGRpc3RhbmNlLCB0aGVuIGdyb3VwIG5hbWVcbiAgICAvLyBjb25zdCBhU3RyID0gYCR7YU51bVJlcGVhdGVyc30gJHthTWl9ICR7YUdyb3VwTmFtZX0gJHthRnJlcXVlbmN5fWA7XG4gICAgLy8gY29uc3QgYlN0ciA9IGAke2JOdW1SZXBlYXRlcnN9ICR7Yk1pfSAke2JHcm91cE5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xuXG4gICAgcmV0dXJuIGFTdHIgPiBiU3RyID8gMSA6IGFTdHIgPCBiU3RyID8gLTEgOiAwO1xuICB9KTtcbiAgcmV0dXJuIHNvcnRpbmcucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBbLi4ucHJldiwgLi4uY3VyclsxXV0sIFtdIGFzIElSZXBlYXRlcltdKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3RhcnQoKSB7XG4gIC8vIGF3YWl0IGRvSXQoXCJDYWxsXCIsIFwicmVwZWF0ZXJzL2RhdGEvQ08vQ29sb3JhZG8gU3ByaW5ncy5qc29uXCIsIFwicmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbFwiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkNhbGxcIiwgXCJyZXBlYXRlcnMvZGF0YS9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25cIiwgXCJyZXBlYXRlcnMvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsXCIpO1xuICAvLyBjb25zdCBjb0ZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcImRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvQ08vXCIpKS5tYXAoKGYpID0+IGBDTy8ke2Z9YCk7XG4gIC8vIGNvbnN0IHV0RmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiLi9yZXBlYXRlcnMvZGF0YS9VVC9cIikpLm1hcCgoZikgPT4gYFVULyR7Zn1gKTtcbiAgLy8gY29uc3Qgbm1GaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL05NL1wiKSkubWFwKChmKSA9PiBgTk0vJHtmfWApO1xuICAvLyBjb25zdCBhbGxGaWxlcyA9IC8qIFsuLi5jb0ZpbGVzLCAuLi51dEZpbGVzLCAuLi5ubUZpbGVzXSAqLyBjb0ZpbGVzLmZpbHRlcigoZikgPT4gL1xcLmpzb24kLy50ZXN0KGYpKS5tYXAoKGYpID0+IGYucmVwbGFjZShcIi5qc29uXCIsIFwiXCIpKTtcbiAgLy8gZm9yIChjb25zdCBmaWxlIG9mIGFsbEZpbGVzKSB7XG4gIC8vICAgYXdhaXQgZG9JdChcIkNhbGxcIiwgYHJlcGVhdGVycy9kYXRhLyR7ZmlsZX0uanNvbmAsIGByZXBlYXRlcnMvZ3JvdXBzLyR7ZmlsZX0gLSBDYWxsYCk7XG4gIC8vIH1cbiAgLy8gYXdhaXQgZG9JdChcIkNvbG9yYWRvIFNwcmluZ3NcIik7XG4gIC8vIGF3YWl0IGRvSXQoXCJEZW52ZXJcIik7XG4gIC8vIGF3YWl0IGRvSXQoXCJHcmFuZCBKdW5jdGlvblwiKTtcbiAgLy8gYXdhaXQgZG9JdChcIkNhbGxcIixcbiAgLy8gICBgZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy9DTy9Db2xvcmFkbyBTcHJpbmdzLmpzb25gLFxuICAvLyAgIGBkYXRhL3JlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGxgKTtcbiAgYXdhaXQgZG9JdChcIkNhbGxcIixcbiAgICBgZGF0YS9yZXBlYXRlcnMvY29tYmluZWQvQ08uanNvbmAsXG4gICAgYGRhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9jb21iaW5lZC9DTyAtIENhbGxgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnQoKTtcbiJdfQ==