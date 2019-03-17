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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/csv-helpers", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "chalk", "./modules/scraper"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    var csv_helpers_1 = require("@helpers/csv-helpers");
    var fs_helpers_1 = require("@helpers/fs-helpers");
    var helpers_1 = require("@helpers/helpers");
    var log_helpers_1 = require("@helpers/log-helpers");
    var chalk_1 = require("chalk");
    var scraper_1 = require("./modules/scraper");
    var log = log_helpers_1.createLog("Get Repeaters");
    function save(place, distance) {
        return __awaiter(this, void 0, void 0, function () {
            var scraper, result, columns, parts, subPlace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log(chalk_1.default.green("Save"), place, distance);
                        scraper = new scraper_1.default(place, distance);
                        return [4 /*yield*/, scraper.process()];
                    case 1:
                        result = _a.sent();
                        columns = {};
                        result.forEach(function (row) {
                            Object.entries(row).forEach(function (entry) {
                                var key = entry[0];
                                var value = entry[1];
                                if (!columns[key]) {
                                    columns[key] = [];
                                }
                                if (columns[key].indexOf(value) === -1) {
                                    columns[key].push(value);
                                }
                            });
                        });
                        result.forEach(function (row) {
                            Object.entries(row).forEach(function (entry) {
                                var key = entry[0];
                                var value = entry[1];
                                if (columns[key].length === 1 && columns[key][0] === "" && value === "") {
                                    // @ts-ignore
                                    row[key] = "yes";
                                }
                            });
                        });
                        result.sort(function (a, b) {
                            var aMi = helpers_1.numberToString(a.Mi, 4, 5);
                            var bMi = helpers_1.numberToString(b.Mi, 4, 5);
                            var aName = a.Call;
                            var bName = b.Call;
                            var aFrequency = helpers_1.numberToString(a.Frequency, 4, 5);
                            var bFrequency = helpers_1.numberToString(b.Frequency, 4, 5);
                            var aStr = aMi + " " + aName + " " + aFrequency;
                            var bStr = bMi + " " + bName + " " + bFrequency;
                            return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
                        });
                        parts = place.toString().split(",");
                        subPlace = (parts[1] || ".").trim() + "/" + parts[0].trim();
                        log(chalk_1.default.yellow("Results"), result.length, subPlace);
                        return [4 /*yield*/, fs_helpers_1.writeToJsonAndCsv("data/repeaters/results/" + subPlace, result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.default = (function () { return __awaiter(_this, void 0, void 0, function () {
        var countyFileData, countyData, cities, name_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_helpers_1.readFileAsync("data/Colorado_County_Seats.csv")];
                case 1:
                    countyFileData = _a.sent();
                    return [4 /*yield*/, csv_helpers_1.parseAsync(countyFileData, { columns: true })];
                case 2:
                    countyData = _a.sent();
                    cities = countyData.map(function (c) { return c["County Seat"] + ", CO"; });
                    _a.label = 3;
                case 3:
                    if (!cities.length) return [3 /*break*/, 6];
                    name_1 = cities.shift();
                    if (!name_1) return [3 /*break*/, 5];
                    return [4 /*yield*/, save(name_1, 200)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    }); })();
});
// export default start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2dldC1yZXBlYXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsaUJBaUZBOztJQWpGQSxpQ0FBK0I7SUFFL0Isb0RBQWdEO0lBQ2hELGtEQUFxRTtJQUNyRSw0Q0FBZ0Q7SUFDaEQsb0RBQStDO0lBQy9DLCtCQUEwQjtJQUMxQiw2Q0FBd0M7SUFFeEMsSUFBTSxHQUFHLEdBQUcsdUJBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUV2QyxTQUFlLElBQUksQ0FBQyxLQUFzQixFQUFFLFFBQWdCOzs7Ozs7d0JBQzFELEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFFcEMsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBRTlCLHFCQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQTs7d0JBQWhDLE1BQU0sR0FBRyxTQUF1Qjt3QkFFaEMsT0FBTyxHQUFRLEVBQUUsQ0FBQzt3QkFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7NEJBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztnQ0FDaEMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNyQixJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7b0NBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7aUNBQ25CO2dDQUNELElBQUksT0FBTyxDQUFDLEdBQUcs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bUQ7b0JBQ2hFLE1BQU0sR0FBYSxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBTSxJQUFLLE9BQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFNLEVBQXpCLENBQXlCLENBQUMsQ0FBQzs7O3lCQUN4RSxNQUFNLENBQUMsTUFBTTtvQkFDWixTQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzt5QkFDeEIsTUFBSSxFQUFKLHdCQUFJO29CQUNOLHFCQUFNLElBQUksQ0FBQyxNQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUE7O29CQUFyQixTQUFxQixDQUFDOzs7Ozs7U0FHM0IsQ0FBQyxFQUFFLENBQUM7O0FBRUwsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwibW9kdWxlLWFsaWFzL3JlZ2lzdGVyXCI7XG5cbmltcG9ydCB7cGFyc2VBc3luY30gZnJvbSBcIkBoZWxwZXJzL2Nzdi1oZWxwZXJzXCI7XG5pbXBvcnQge3JlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2fSBmcm9tIFwiQGhlbHBlcnMvZnMtaGVscGVyc1wiO1xuaW1wb3J0IHtudW1iZXJUb1N0cmluZ30gZnJvbSBcIkBoZWxwZXJzL2hlbHBlcnNcIjtcbmltcG9ydCB7Y3JlYXRlTG9nfSBmcm9tIFwiQGhlbHBlcnMvbG9nLWhlbHBlcnNcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCBTY3JhcGVyIGZyb20gXCIuL21vZHVsZXMvc2NyYXBlclwiO1xuXG5jb25zdCBsb2cgPSBjcmVhdGVMb2coXCJHZXQgUmVwZWF0ZXJzXCIpO1xuXG5hc3luYyBmdW5jdGlvbiBzYXZlKHBsYWNlOiBzdHJpbmcgfCBudW1iZXIsIGRpc3RhbmNlOiBudW1iZXIpIHtcbiAgbG9nKGNoYWxrLmdyZWVuKFwiU2F2ZVwiKSwgcGxhY2UsIGRpc3RhbmNlKTtcblxuICBjb25zdCBzY3JhcGVyID0gbmV3IFNjcmFwZXIocGxhY2UsIGRpc3RhbmNlKTtcblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBzY3JhcGVyLnByb2Nlc3MoKTtcblxuICBjb25zdCBjb2x1bW5zOiBhbnkgPSB7fTtcbiAgcmVzdWx0LmZvckVhY2goKHJvdykgPT4ge1xuICAgIE9iamVjdC5lbnRyaWVzKHJvdykuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IGVudHJ5WzBdO1xuICAgICAgY29uc3QgdmFsdWUgPSBlbnRyeVsxXTtcbiAgICAgIGlmICghY29sdW1uc1trZXldKSB7XG4gICAgICAgIGNvbHVtbnNba2V5XSA9IFtdO1xuICAgICAgfVxuICAgICAgaWYgKGNvbHVtbnNba2V5XS5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICAgICAgY29sdW1uc1trZXldLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXN1bHQuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgT2JqZWN0LmVudHJpZXMocm93KS5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gZW50cnlbMF07XG4gICAgICBjb25zdCB2YWx1ZSA9IGVudHJ5WzFdO1xuICAgICAgaWYgKGNvbHVtbnNba2V5XS5sZW5ndGggPT09IDEgJiYgY29sdW1uc1trZXldWzBdID09PSBcIlwiICYmIHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcm93W2tleV0gPSBcInllc1wiO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xuICAgIGNvbnN0IGFNaSA9IG51bWJlclRvU3RyaW5nKGEuTWksIDQsIDUpO1xuICAgIGNvbnN0IGJNaSA9IG51bWJlclRvU3RyaW5nKGIuTWksIDQsIDUpO1xuICAgIGNvbnN0IGFOYW1lID0gYS5DYWxsO1xuICAgIGNvbnN0IGJOYW1lID0gYi5DYWxsO1xuICAgIGNvbnN0IGFGcmVxdWVuY3kgPSBudW1iZXJUb1N0cmluZyhhLkZyZXF1ZW5jeSwgNCwgNSk7XG4gICAgY29uc3QgYkZyZXF1ZW5jeSA9IG51bWJlclRvU3RyaW5nKGIuRnJlcXVlbmN5LCA0LCA1KTtcbiAgICBjb25zdCBhU3RyID0gYCR7YU1pfSAke2FOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICBjb25zdCBiU3RyID0gYCR7Yk1pfSAke2JOYW1lfSAke2JGcmVxdWVuY3l9YDtcbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XG4gIH0pO1xuICAvLyByZXN1bHQuc29ydCgoYTogYW55LCBiOiBhbnkpID0+IHsoYS5DYWxsID4gYi5DYWxsID8gMSA6IGEuQ2FsbCA8IGIuQ2FsbCA/IC0xIDogMCkpO1xuICAvLyByZXN1bHQuc29ydCgoYTogYW55LCBiOiBhbnkpID0+IChhLkZyZXF1ZW5jeSAtIGIuRnJlcXVlbmN5KSk7XG4gIC8vIHJlc3VsdC5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4gKGEuTWkgLSBiLk1pKSk7XG5cbiAgLy8gY29uc29sZS5sb2cocGxhY2UsIGRpc3RhbmNlLCByZXN1bHQubGVuZ3RoKTtcblxuICBjb25zdCBwYXJ0cyA9IHBsYWNlLnRvU3RyaW5nKCkuc3BsaXQoYCxgKTtcbiAgY29uc3Qgc3ViUGxhY2UgPSBgJHsocGFydHNbMV0gfHwgXCIuXCIpLnRyaW0oKX0vJHtwYXJ0c1swXS50cmltKCl9YDtcblxuICBsb2coY2hhbGsueWVsbG93KFwiUmVzdWx0c1wiKSwgcmVzdWx0Lmxlbmd0aCwgc3ViUGxhY2UpO1xuXG4gIGF3YWl0IHdyaXRlVG9Kc29uQW5kQ3N2KGBkYXRhL3JlcGVhdGVycy9yZXN1bHRzLyR7c3ViUGxhY2V9YCwgcmVzdWx0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgKGFzeW5jICgpID0+IHtcbiAgY29uc3QgY291bnR5RmlsZURhdGEgPSBhd2FpdCByZWFkRmlsZUFzeW5jKFwiZGF0YS9Db2xvcmFkb19Db3VudHlfU2VhdHMuY3N2XCIpO1xuICBjb25zdCBjb3VudHlEYXRhID0gYXdhaXQgcGFyc2VBc3luYyhjb3VudHlGaWxlRGF0YSwgeyBjb2x1bW5zOiB0cnVlIH0pO1xuICBjb25zdCBjaXRpZXM6IHN0cmluZ1tdID0gY291bnR5RGF0YS5tYXAoKGM6IGFueSkgPT4gYCR7Y1tcIkNvdW50eSBTZWF0XCJdfSwgQ09gKTtcbiAgd2hpbGUgKGNpdGllcy5sZW5ndGgpIHtcbiAgICBjb25zdCBuYW1lID0gY2l0aWVzLnNoaWZ0KCk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGF3YWl0IHNhdmUobmFtZSwgMjAwKTtcbiAgICB9XG4gIH1cbn0pKCk7XG5cbi8vIGV4cG9ydCBkZWZhdWx0IHN0YXJ0KCk7XG4iXX0=