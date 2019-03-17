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
    exports.__esModule = true;
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
                        log(chalk_1["default"].green("Save"), place, distance);
                        scraper = new scraper_1["default"](place, distance);
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
                        log(chalk_1["default"].yellow("Results"), result.length, subPlace);
                        return [4 /*yield*/, fs_helpers_1.writeToJsonAndCsv("data/repeaters/results/" + subPlace, result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports["default"] = (function () { return __awaiter(_this, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2dldC1yZXBlYXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsaUJBaUZBOztJQWpGQSxpQ0FBK0I7SUFFL0Isb0RBQWdEO0lBQ2hELGtEQUFxRTtJQUNyRSw0Q0FBZ0Q7SUFDaEQsb0RBQStDO0lBQy9DLCtCQUEwQjtJQUMxQiw2Q0FBd0M7SUFFeEMsSUFBTSxHQUFHLEdBQUcsdUJBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUV2QyxTQUFlLElBQUksQ0FBQyxLQUFzQixFQUFFLFFBQWdCOzs7Ozs7d0JBQzFELEdBQUcsQ0FBQyxrQkFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBRXBDLE9BQU8sR0FBRyxJQUFJLG9CQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUU5QixxQkFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUFoQyxNQUFNLEdBQUcsU0FBdUI7d0JBRWhDLE9BQU8sR0FBUSxFQUFFLENBQUM7d0JBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHOzRCQUNqQixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7Z0NBQ2hDLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDckIsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29DQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lDQUNuQjtnQ0FDRCxJQUFJLE9BQU8sQ0FBQyxHQUFH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QUFtRDtvQkFDaEUsTUFBTSxHQUFhLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFNLElBQUssT0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQU0sRUFBekIsQ0FBeUIsQ0FBQyxDQUFDOzs7eUJBQ3hFLE1BQU0sQ0FBQyxNQUFNO29CQUNaLFNBQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO3lCQUN4QixNQUFJLEVBQUosd0JBQUk7b0JBQ04scUJBQU0sSUFBSSxDQUFDLE1BQUksRUFBRSxHQUFHLENBQUMsRUFBQTs7b0JBQXJCLFNBQXFCLENBQUM7Ozs7OztTQUczQixDQUFDLEVBQUUsQ0FBQzs7QUFFTCwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJtb2R1bGUtYWxpYXMvcmVnaXN0ZXJcIjtcblxuaW1wb3J0IHtwYXJzZUFzeW5jfSBmcm9tIFwiQGhlbHBlcnMvY3N2LWhlbHBlcnNcIjtcbmltcG9ydCB7cmVhZEZpbGVBc3luYywgd3JpdGVUb0pzb25BbmRDc3Z9IGZyb20gXCJAaGVscGVycy9mcy1oZWxwZXJzXCI7XG5pbXBvcnQge251bWJlclRvU3RyaW5nfSBmcm9tIFwiQGhlbHBlcnMvaGVscGVyc1wiO1xuaW1wb3J0IHtjcmVhdGVMb2d9IGZyb20gXCJAaGVscGVycy9sb2ctaGVscGVyc1wiO1xuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IFNjcmFwZXIgZnJvbSBcIi4vbW9kdWxlcy9zY3JhcGVyXCI7XG5cbmNvbnN0IGxvZyA9IGNyZWF0ZUxvZyhcIkdldCBSZXBlYXRlcnNcIik7XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmUocGxhY2U6IHN0cmluZyB8IG51bWJlciwgZGlzdGFuY2U6IG51bWJlcikge1xuICBsb2coY2hhbGsuZ3JlZW4oXCJTYXZlXCIpLCBwbGFjZSwgZGlzdGFuY2UpO1xuXG4gIGNvbnN0IHNjcmFwZXIgPSBuZXcgU2NyYXBlcihwbGFjZSwgZGlzdGFuY2UpO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIucHJvY2VzcygpO1xuXG4gIGNvbnN0IGNvbHVtbnM6IGFueSA9IHt9O1xuICByZXN1bHQuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgT2JqZWN0LmVudHJpZXMocm93KS5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gZW50cnlbMF07XG4gICAgICBjb25zdCB2YWx1ZSA9IGVudHJ5WzFdO1xuICAgICAgaWYgKCFjb2x1bW5zW2tleV0pIHtcbiAgICAgICAgY29sdW1uc1trZXldID0gW107XG4gICAgICB9XG4gICAgICBpZiAoY29sdW1uc1trZXldLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgICBjb2x1bW5zW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJlc3VsdC5mb3JFYWNoKChyb3cpID0+IHtcbiAgICBPYmplY3QuZW50cmllcyhyb3cpLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSBlbnRyeVswXTtcbiAgICAgIGNvbnN0IHZhbHVlID0gZW50cnlbMV07XG4gICAgICBpZiAoY29sdW1uc1trZXldLmxlbmd0aCA9PT0gMSAmJiBjb2x1bW5zW2tleV1bMF0gPT09IFwiXCIgJiYgdmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByb3dba2V5XSA9IFwieWVzXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XG4gICAgY29uc3QgYU1pID0gbnVtYmVyVG9TdHJpbmcoYS5NaSwgNCwgNSk7XG4gICAgY29uc3QgYk1pID0gbnVtYmVyVG9TdHJpbmcoYi5NaSwgNCwgNSk7XG4gICAgY29uc3QgYU5hbWUgPSBhLkNhbGw7XG4gICAgY29uc3QgYk5hbWUgPSBiLkNhbGw7XG4gICAgY29uc3QgYUZyZXF1ZW5jeSA9IG51bWJlclRvU3RyaW5nKGEuRnJlcXVlbmN5LCA0LCA1KTtcbiAgICBjb25zdCBiRnJlcXVlbmN5ID0gbnVtYmVyVG9TdHJpbmcoYi5GcmVxdWVuY3ksIDQsIDUpO1xuICAgIGNvbnN0IGFTdHIgPSBgJHthTWl9ICR7YU5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xuICAgIGNvbnN0IGJTdHIgPSBgJHtiTWl9ICR7Yk5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xuICAgIHJldHVybiBhU3RyID4gYlN0ciA/IDEgOiBhU3RyIDwgYlN0ciA/IC0xIDogMDtcbiAgfSk7XG4gIC8vIHJlc3VsdC5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4geyhhLkNhbGwgPiBiLkNhbGwgPyAxIDogYS5DYWxsIDwgYi5DYWxsID8gLTEgOiAwKSk7XG4gIC8vIHJlc3VsdC5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4gKGEuRnJlcXVlbmN5IC0gYi5GcmVxdWVuY3kpKTtcbiAgLy8gcmVzdWx0LnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiAoYS5NaSAtIGIuTWkpKTtcblxuICAvLyBjb25zb2xlLmxvZyhwbGFjZSwgZGlzdGFuY2UsIHJlc3VsdC5sZW5ndGgpO1xuXG4gIGNvbnN0IHBhcnRzID0gcGxhY2UudG9TdHJpbmcoKS5zcGxpdChgLGApO1xuICBjb25zdCBzdWJQbGFjZSA9IGAkeyhwYXJ0c1sxXSB8fCBcIi5cIikudHJpbSgpfS8ke3BhcnRzWzBdLnRyaW0oKX1gO1xuXG4gIGxvZyhjaGFsay55ZWxsb3coXCJSZXN1bHRzXCIpLCByZXN1bHQubGVuZ3RoLCBzdWJQbGFjZSk7XG5cbiAgYXdhaXQgd3JpdGVUb0pzb25BbmRDc3YoYGRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvJHtzdWJQbGFjZX1gLCByZXN1bHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCAoYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjb3VudHlGaWxlRGF0YSA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoXCJkYXRhL0NvbG9yYWRvX0NvdW50eV9TZWF0cy5jc3ZcIik7XG4gIGNvbnN0IGNvdW50eURhdGEgPSBhd2FpdCBwYXJzZUFzeW5jKGNvdW50eUZpbGVEYXRhLCB7IGNvbHVtbnM6IHRydWUgfSk7XG4gIGNvbnN0IGNpdGllczogc3RyaW5nW10gPSBjb3VudHlEYXRhLm1hcCgoYzogYW55KSA9PiBgJHtjW1wiQ291bnR5IFNlYXRcIl19LCBDT2ApO1xuICB3aGlsZSAoY2l0aWVzLmxlbmd0aCkge1xuICAgIGNvbnN0IG5hbWUgPSBjaXRpZXMuc2hpZnQoKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgYXdhaXQgc2F2ZShuYW1lLCAyMDApO1xuICAgIH1cbiAgfVxufSkoKTtcblxuLy8gZXhwb3J0IGRlZmF1bHQgc3RhcnQoKTtcbiJdfQ==