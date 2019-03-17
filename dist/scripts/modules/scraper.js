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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "axios", "chalk", "jsdom", "./helper"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var fs_helpers_1 = require("@helpers/fs-helpers");
    var helpers_1 = require("@helpers/helpers");
    var log_helpers_1 = require("@helpers/log-helpers");
    var axios_1 = require("axios");
    var chalk_1 = require("chalk");
    var jsdom_1 = require("jsdom");
    var helper_1 = require("./helper");
    var _a = log_helpers_1.createOut("Scraper"), log = _a.log, write = _a.write;
    // const write = createWrite("Scraper");
    var Scraper = /** @class */ (function () {
        function Scraper(location, distance) {
            this.location = location;
            this.distance = distance;
            this.data = [];
            log(chalk_1["default"].green("New Scraper"), location, distance);
            this.url = "https://www.repeaterbook.com/repeaters/prox_result.php?city=" + encodeURIComponent(location.toString()) + "&distance=" + distance + "&Dunit=m&band1=%25&band2=&freq=&call=&features=&status_id=%25&use=%25&order=%60state_id%60%2C+%60loc%60%2C+%60call%60+ASC";
        }
        Scraper.prototype.process = function () {
            return __awaiter(this, void 0, void 0, function () {
                var parts, baseKey, page, dom;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log(chalk_1["default"].green("Process"));
                            parts = this.location.toString().split(",");
                            baseKey = (parts[1] || ".").trim() + "/" + parts[0].trim() + ".html";
                            return [4 /*yield*/, this.getUrl(this.url, baseKey)];
                        case 1:
                            page = _a.sent();
                            dom = new jsdom_1.JSDOM(page);
                            return [4 /*yield*/, this.getRepeaterList(dom.window.document)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.data];
                    }
                });
            });
        };
        Scraper.prototype.getRepeaterList = function (document) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1, _a, table, rows, headerRow, headerCells, headers_1, _loop_1, this_1, rows_1, rows_1_1, row, e_1_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // const promises = [];
                            log(chalk_1["default"].green("Get Repeater List"));
                            table = document.querySelector("table.w3-table.w3-striped.w3-responsive");
                            if (!table) return [3 /*break*/, 8];
                            rows = Array.prototype.slice.apply(table.querySelectorAll("tbody > tr"));
                            headerRow = rows.shift();
                            if (!headerRow) return [3 /*break*/, 8];
                            headerCells = __spread(headerRow.querySelectorAll("th"));
                            headers_1 = headerCells.map(function (th) { return helper_1.getText(th); });
                            _loop_1 = function (row) {
                                var data, cells, link, _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            data = {};
                                            cells = __spread(row.querySelectorAll("td"));
                                            cells.forEach(function (td, index) { return data[headers_1[index]] = helper_1.getTextOrNumber(td); });
                                            link = cells[0].querySelector("a");
                                            if (!link) return [3 /*break*/, 2];
                                            write("^");
                                            // promises.push(this.getRepeaterDetails(link.href).then((d) => {
                                            //   write("_");
                                            //   Object.assign(data, d);
                                            // }));
                                            _b = (_a = Object).assign;
                                            _c = [data];
                                            return [4 /*yield*/, this_1.getRepeaterDetails(link.href)];
                                        case 1:
                                            // promises.push(this.getRepeaterDetails(link.href).then((d) => {
                                            //   write("_");
                                            //   Object.assign(data, d);
                                            // }));
                                            _b.apply(_a, _c.concat([_d.sent()]));
                                            write("_");
                                            _d.label = 2;
                                        case 2:
                                            this_1.data.push(data);
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, 7, 8]);
                            rows_1 = __values(rows), rows_1_1 = rows_1.next();
                            _b.label = 2;
                        case 2:
                            if (!!rows_1_1.done) return [3 /*break*/, 5];
                            row = rows_1_1.value;
                            return [5 /*yield**/, _loop_1(row)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            rows_1_1 = rows_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _b.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (rows_1_1 && !rows_1_1.done && (_a = rows_1["return"])) _a.call(rows_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        Scraper.prototype.getRepeaterDetails = function (href) {
            return __awaiter(this, void 0, void 0, function () {
                var e_2, _a, e_3, _b, urlParams, keyParts, key, page, dom, data, menus, locationRegex, menus_1, menus_1_1, menu, locationMatch, lat, long, table, rows, rows_2, rows_2_1, row, cells, title, value, dataKey, dataVal, updated, date;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urlParams = href.split("?")[1];
                            keyParts = urlParams.match(/state_id=(\d+)&ID=(\d+)/) || [];
                            key = keyParts[1] + "/" + keyParts[2] + ".html";
                            return [4 /*yield*/, this.getUrl("https://www.repeaterbook.com/repeaters/" + href, key)];
                        case 1:
                            page = _c.sent();
                            dom = new jsdom_1.JSDOM(page);
                            data = {};
                            data.state_id = keyParts[1];
                            data.ID = keyParts[2];
                            menus = Array.from(dom.window.document.querySelectorAll("#cssmenu a"));
                            locationRegex = /(-?\d*\.?\d*)\+(-?\d*\.?\d*)/i;
                            try {
                                for (menus_1 = __values(menus), menus_1_1 = menus_1.next(); !menus_1_1.done; menus_1_1 = menus_1.next()) {
                                    menu = menus_1_1.value;
                                    locationMatch = menu.href.match(locationRegex);
                                    if (locationMatch) {
                                        lat = helper_1.getNumber(locationMatch[1]);
                                        long = helper_1.getNumber(locationMatch[2]);
                                        data.Latitude = isNaN(lat) ? locationMatch[1] : lat;
                                        data.Longitude = isNaN(long) ? locationMatch[2] : long;
                                        break;
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (menus_1_1 && !menus_1_1.done && (_a = menus_1["return"])) _a.call(menus_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            table = dom.window.document.querySelector("table.w3-table.w3-responsive");
                            if (table) {
                                rows = Array.prototype.slice.apply(table.querySelectorAll("tbody > tr"));
                                try {
                                    for (rows_2 = __values(rows), rows_2_1 = rows_2.next(); !rows_2_1.done; rows_2_1 = rows_2.next()) {
                                        row = rows_2_1.value;
                                        cells = __spread(row.querySelectorAll("td"));
                                        title = helper_1.getText(cells[0]);
                                        value = helper_1.getTextOrNumber(cells[1]);
                                        dataKey = title.split(":")[0].trim();
                                        dataVal = title.split(":")[1];
                                        updated = void 0;
                                        if (dataVal) {
                                            date = dataVal.match(/(\d{4}-\d{2}-\d{2})/);
                                            if (date && date[1]) {
                                                updated = date[1];
                                            }
                                        }
                                        data[dataKey] = updated || value;
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (rows_2_1 && !rows_2_1.done && (_b = rows_2["return"])) _b.call(rows_2);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                            }
                            // log(
                            //   data.state_id ? data.state_id : "", "\t",
                            //   data.ID ? data.ID : "", "\t",
                            //   data.Latitude ? data.Latitude : "", "\t",
                            //   data.Longitude ? data.Longitude : "", "\t",
                            //   data.Call ? data.Call : "", "\t",
                            //   data.Downlink ? data.Downlink : "", "\t",
                            //   data.Use ? data.Use : "", "\t",
                            //   data["Op Status"] ? data["Op Status"] : "", "\t",
                            //   data.Affiliate ? data.Affiliate : "", "\t",
                            //   data.Sponsor ? data.Sponsor : "",
                            // );
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        Scraper.prototype.getCache = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            file = "data/repeaters/_cache/" + key;
                            return [4 /*yield*/, fs_helpers_1.dirExists(file)];
                        case 1:
                            if (!_a.sent()) return [3 /*break*/, 3];
                            return [4 /*yield*/, fs_helpers_1.readFileAsync(file)];
                        case 2: return [2 /*return*/, (_a.sent()).toString()];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Scraper.prototype.setCache = function (key, value) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            file = "data/repeaters/_cache/" + key;
                            return [4 /*yield*/, fs_helpers_1.makeDirs(file)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, fs_helpers_1.writeFileAsync(file, value)];
                    }
                });
            });
        };
        Scraper.prototype.getUrl = function (url, cacheKey) {
            return __awaiter(this, void 0, void 0, function () {
                var cache, waitTime, request, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCache(cacheKey || url)];
                        case 1:
                            cache = _a.sent();
                            if (!cache) return [3 /*break*/, 2];
                            // log(chalk.yellow("Cached"), url, cacheKey);
                            write("<");
                            return [2 /*return*/, cache];
                        case 2:
                            waitTime = (Math.random() * 5000);
                            return [4 /*yield*/, helpers_1.wait(waitTime)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, axios_1["default"].get(url)];
                        case 4:
                            request = _a.sent();
                            // log(chalk.green("Got"), url);
                            write(">");
                            data = request.data;
                            return [4 /*yield*/, this.setCache(cacheKey || url, data)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        return Scraper;
    }());
    exports["default"] = Scraper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY3JpcHRzL21vZHVsZXMvc2NyYXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsa0RBQXVGO0lBQ3ZGLDRDQUFzQztJQUN0QyxvREFBK0M7SUFDL0MsK0JBQTBCO0lBQzFCLCtCQUEwQjtJQUMxQiwrQkFBOEI7SUFDOUIsbUNBQTZEO0lBR3ZELElBQUEsdUNBQXFDLEVBQW5DLFlBQUcsRUFBRSxnQkFBOEIsQ0FBQztJQUM1Qyx3Q0FBd0M7SUFFeEM7UUFJRSxpQkFBb0IsUUFBeUIsRUFBVSxRQUFnQjtZQUFuRCxhQUFRLEdBQVIsUUFBUSxDQUFpQjtZQUFVLGFBQVEsR0FBUixRQUFRLENBQVE7WUFIL0QsU0FBSSxHQUFnQixFQUFFLENBQUM7WUFJN0IsR0FBRyxDQUFDLGtCQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsR0FBRyxHQUFHLGlFQUErRCxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsa0JBQWEsUUFBUSw4SEFBMkgsQ0FBQztRQUNwUSxDQUFDO1FBRVkseUJBQU8sR0FBcEI7Ozs7Ozs0QkFDRSxHQUFHLENBQUMsa0JBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs0QkFFdEIsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUM1QyxPQUFPLEdBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxVQUFPLENBQUM7NEJBQ3pELHFCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBQTs7NEJBQTNDLElBQUksR0FBRyxTQUFvQzs0QkFDM0MsR0FBRyxHQUFHLElBQUksYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM1QixxQkFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUE7OzRCQUEvQyxTQUErQyxDQUFDOzRCQUNoRCxzQkFBTyxJQUFJLENBQUMsSUFBSSxFQUFDOzs7O1NBQ2xCO1FBRWEsaUNBQWUsR0FBN0IsVUFBOEIsUUFBa0I7Ozs7Ozs0QkFDOUMsdUJBQXVCOzRCQUN2QixHQUFHLENBQUMsa0JBQUssQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDOzRCQUVoQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO2lDQUM1RSxLQUFLLEVBQUwsd0JBQUs7NEJBQ0QsSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDekUsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQ0FDM0IsU0FBUyxFQUFULHdCQUFTOzRCQUNMLFdBQVcsWUFBTyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDcEQsWUFBVSxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRSxJQUFLLE9BQUEsZ0JBQU8sQ0FBQyxFQUFFLENBQUMsRUFBWCxDQUFXLENBQUMsQ0FBQztnREFDMUMsR0FBRzs7Ozs7NENBQ04sSUFBSSxHQUFRLEVBQUUsQ0FBQzs0Q0FDZixLQUFLLFlBQU8sR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7NENBQzlDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLEVBQUUsS0FBSyxJQUFLLE9BQUEsSUFBSSxDQUFDLFNBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLHdCQUFlLENBQUMsRUFBRSxDQUFDLEVBQTFDLENBQTBDLENBQUMsQ0FBQzs0Q0FDbkUsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7aURBQ3JDLElBQUksRUFBSix3QkFBSTs0Q0FDTixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7NENBQ1gsaUVBQWlFOzRDQUNqRSxnQkFBZ0I7NENBQ2hCLDRCQUE0Qjs0Q0FDNUIsT0FBTzs0Q0FDUCxLQUFBLENBQUEsS0FBQSxNQUFNLENBQUEsQ0FBQyxNQUFNLENBQUE7a0RBQUMsSUFBSTs0Q0FBRSxxQkFBTSxPQUFLLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQTs7NENBSjVELGlFQUFpRTs0Q0FDakUsZ0JBQWdCOzRDQUNoQiw0QkFBNEI7NENBQzVCLE9BQU87NENBQ1Asd0JBQW9CLFNBQXdDLEdBQUMsQ0FBQzs0Q0FDOUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7NENBRWIsT0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7NEJBZEwsU0FBQSxTQUFBLElBQUksQ0FBQTs7Ozs0QkFBWCxHQUFHOzBEQUFILEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FtQm5CO1FBRWEsb0NBQWtCLEdBQWhDLFVBQWlDLElBQVk7Ozs7Ozs0QkFFckMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQy9CLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxDQUFDOzRCQUM1RCxHQUFHLEdBQU0sUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBTyxDQUFDOzRCQUNwQyxxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLDRDQUEwQyxJQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUE7OzRCQUEvRSxJQUFJLEdBQUcsU0FBd0U7NEJBQy9FLEdBQUcsR0FBRyxJQUFJLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDdEIsSUFBSSxHQUF5QyxFQUFFLENBQUM7NEJBQ3RELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDaEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQW9CLFlBQVksQ0FBQyxDQUFDLENBQUM7NEJBQzFGLGFBQWEsR0FBRywrQkFBK0IsQ0FBQzs7Z0NBQ3RELEtBQW1CLFVBQUEsU0FBQSxLQUFLLENBQUEsMkVBQUU7b0NBQWYsSUFBSTtvQ0FDUCxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7b0NBQ3JELElBQUksYUFBYSxFQUFFO3dDQUNYLEdBQUcsR0FBRyxrQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUNsQyxJQUFJLEdBQUcsa0JBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO3dDQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0NBQ3ZELE1BQU07cUNBQ1A7aUNBQ0Y7Ozs7Ozs7Ozs0QkFDSyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7NEJBQ2hGLElBQUksS0FBSyxFQUFFO2dDQUNILElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7O29DQUMvRSxLQUFrQixTQUFBLFNBQUEsSUFBSSxDQUFBLHNFQUFFO3dDQUFiLEdBQUc7d0NBQ04sS0FBSyxZQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dDQUN4QyxLQUFLLEdBQUcsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDMUIsS0FBSyxHQUFHLHdCQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQ2xDLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3dDQUNyQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDaEMsT0FBTyxTQUFvQixDQUFDO3dDQUNoQyxJQUFJLE9BQU8sRUFBRTs0Q0FDTCxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOzRDQUNsRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0RBQ25CLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7NkNBQ25CO3lDQUNGO3dDQUNELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLElBQUksS0FBSyxDQUFDO3FDQUNsQzs7Ozs7Ozs7OzZCQUNGOzRCQUNELE9BQU87NEJBQ1AsOENBQThDOzRCQUM5QyxrQ0FBa0M7NEJBQ2xDLDhDQUE4Qzs0QkFDOUMsZ0RBQWdEOzRCQUNoRCxzQ0FBc0M7NEJBQ3RDLDhDQUE4Qzs0QkFDOUMsb0NBQW9DOzRCQUNwQyxzREFBc0Q7NEJBQ3RELGdEQUFnRDs0QkFDaEQsc0NBQXNDOzRCQUN0QyxLQUFLOzRCQUNMLHNCQUFPLElBQUksRUFBQzs7OztTQUNiO1FBRWEsMEJBQVEsR0FBdEIsVUFBdUIsR0FBVzs7Ozs7OzRCQUMxQixJQUFJLEdBQUcsMkJBQXlCLEdBQUssQ0FBQzs0QkFDeEMscUJBQU0sc0JBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQTs7aUNBQXJCLFNBQXFCLEVBQXJCLHdCQUFxQjs0QkFDZixxQkFBTSwwQkFBYSxDQUFDLElBQUksQ0FBQyxFQUFBO2dDQUFqQyxzQkFBTyxDQUFDLFNBQXlCLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBQzs7Ozs7U0FFakQ7UUFFYSwwQkFBUSxHQUF0QixVQUF1QixHQUFXLEVBQUUsS0FBVTs7Ozs7OzRCQUN0QyxJQUFJLEdBQUcsMkJBQXlCLEdBQUssQ0FBQzs0QkFDNUMscUJBQU0scUJBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQTs7NEJBQXBCLFNBQW9CLENBQUM7NEJBQ3JCLHNCQUFPLDJCQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFDOzs7O1NBQ3BDO1FBRWEsd0JBQU0sR0FBcEIsVUFBcUIsR0FBVyxFQUFFLFFBQWlCOzs7OztnQ0FHbkMscUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLEVBQUE7OzRCQUE1QyxLQUFLLEdBQUcsU0FBb0M7aUNBQzlDLEtBQUssRUFBTCx3QkFBSzs0QkFDUCw4Q0FBOEM7NEJBQzlDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDWCxzQkFBTyxLQUFLLEVBQUM7OzRCQUdQLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQzs0QkFFeEMscUJBQU0sY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFBOzs0QkFBcEIsU0FBb0IsQ0FBQzs0QkFFTCxxQkFBTSxrQkFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQTs7NEJBQTlCLE9BQU8sR0FBRyxTQUFvQjs0QkFDcEMsZ0NBQWdDOzRCQUNoQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBRUwsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7NEJBQzFCLHFCQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBQTs7NEJBQTFDLFNBQTBDLENBQUM7NEJBQzNDLHNCQUFPLElBQUksRUFBQzs7OztTQUVmO1FBQ0gsY0FBQztJQUFELENBQUMsQUFoSkQsSUFnSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RpckV4aXN0cywgbWFrZURpcnMsIHJlYWRGaWxlQXN5bmMsIHdyaXRlRmlsZUFzeW5jfSBmcm9tIFwiQGhlbHBlcnMvZnMtaGVscGVyc1wiO1xuaW1wb3J0IHt3YWl0fSBmcm9tIFwiQGhlbHBlcnMvaGVscGVyc1wiO1xuaW1wb3J0IHtjcmVhdGVPdXR9IGZyb20gXCJAaGVscGVycy9sb2ctaGVscGVyc1wiO1xuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IHsgSlNET00gfSBmcm9tIFwianNkb21cIjtcbmltcG9ydCB7Z2V0TnVtYmVyLCBnZXRUZXh0LCBnZXRUZXh0T3JOdW1iZXJ9IGZyb20gXCIuL2hlbHBlclwiO1xuaW1wb3J0IHtJUmVwZWF0ZXJ9IGZyb20gXCIuL2kucmVwZWF0ZXJcIjtcblxuY29uc3QgeyBsb2csIHdyaXRlIH0gPSBjcmVhdGVPdXQoXCJTY3JhcGVyXCIpO1xuLy8gY29uc3Qgd3JpdGUgPSBjcmVhdGVXcml0ZShcIlNjcmFwZXJcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmFwZXIge1xuICBwcml2YXRlIGRhdGE6IElSZXBlYXRlcltdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2NhdGlvbjogc3RyaW5nIHwgbnVtYmVyLCBwcml2YXRlIGRpc3RhbmNlOiBudW1iZXIpIHtcbiAgICBsb2coY2hhbGsuZ3JlZW4oXCJOZXcgU2NyYXBlclwiKSwgbG9jYXRpb24sIGRpc3RhbmNlKTtcbiAgICB0aGlzLnVybCA9IGBodHRwczovL3d3dy5yZXBlYXRlcmJvb2suY29tL3JlcGVhdGVycy9wcm94X3Jlc3VsdC5waHA/Y2l0eT0ke2VuY29kZVVSSUNvbXBvbmVudChsb2NhdGlvbi50b1N0cmluZygpKX0mZGlzdGFuY2U9JHtkaXN0YW5jZX0mRHVuaXQ9bSZiYW5kMT0lMjUmYmFuZDI9JmZyZXE9JmNhbGw9JmZlYXR1cmVzPSZzdGF0dXNfaWQ9JTI1JnVzZT0lMjUmb3JkZXI9JTYwc3RhdGVfaWQlNjAlMkMrJTYwbG9jJTYwJTJDKyU2MGNhbGwlNjArQVNDYDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKCkge1xuICAgIGxvZyhjaGFsay5ncmVlbihcIlByb2Nlc3NcIikpO1xuXG4gICAgY29uc3QgcGFydHMgPSB0aGlzLmxvY2F0aW9uLnRvU3RyaW5nKCkuc3BsaXQoYCxgKTtcbiAgICBjb25zdCBiYXNlS2V5ID0gYCR7KHBhcnRzWzFdIHx8IFwiLlwiKS50cmltKCl9LyR7cGFydHNbMF0udHJpbSgpfS5odG1sYDtcbiAgICBjb25zdCBwYWdlID0gYXdhaXQgdGhpcy5nZXRVcmwodGhpcy51cmwsIGJhc2VLZXkpO1xuICAgIGNvbnN0IGRvbSA9IG5ldyBKU0RPTShwYWdlKTtcbiAgICBhd2FpdCB0aGlzLmdldFJlcGVhdGVyTGlzdChkb20ud2luZG93LmRvY3VtZW50KTtcbiAgICByZXR1cm4gdGhpcy5kYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRSZXBlYXRlckxpc3QoZG9jdW1lbnQ6IERvY3VtZW50KSB7XG4gICAgLy8gY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgUmVwZWF0ZXIgTGlzdFwiKSk7XG5cbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZS53My10YWJsZS53My1zdHJpcGVkLnczLXJlc3BvbnNpdmVcIik7XG4gICAgaWYgKHRhYmxlKSB7XG4gICAgICBjb25zdCByb3dzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0Ym9keSA+IHRyXCIpKTtcbiAgICAgIGNvbnN0IGhlYWRlclJvdyA9IHJvd3Muc2hpZnQoKTtcbiAgICAgIGlmIChoZWFkZXJSb3cpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyQ2VsbHMgPSBbLi4uaGVhZGVyUm93LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0aFwiKV07XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBoZWFkZXJDZWxscy5tYXAoKHRoKSA9PiBnZXRUZXh0KHRoKSk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICBjb25zdCBkYXRhOiBhbnkgPSB7fTtcbiAgICAgICAgICBjb25zdCBjZWxscyA9IFsuLi5yb3cucXVlcnlTZWxlY3RvckFsbChcInRkXCIpXTtcbiAgICAgICAgICBjZWxscy5mb3JFYWNoKCh0ZCwgaW5kZXgpID0+IGRhdGFbaGVhZGVyc1tpbmRleF1dID0gZ2V0VGV4dE9yTnVtYmVyKHRkKSk7XG4gICAgICAgICAgY29uc3QgbGluayA9IGNlbGxzWzBdLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpO1xuICAgICAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgICAgICB3cml0ZShcIl5cIik7XG4gICAgICAgICAgICAvLyBwcm9taXNlcy5wdXNoKHRoaXMuZ2V0UmVwZWF0ZXJEZXRhaWxzKGxpbmsuaHJlZikudGhlbigoZCkgPT4ge1xuICAgICAgICAgICAgLy8gICB3cml0ZShcIl9cIik7XG4gICAgICAgICAgICAvLyAgIE9iamVjdC5hc3NpZ24oZGF0YSwgZCk7XG4gICAgICAgICAgICAvLyB9KSk7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGRhdGEsIGF3YWl0IHRoaXMuZ2V0UmVwZWF0ZXJEZXRhaWxzKGxpbmsuaHJlZikpO1xuICAgICAgICAgICAgd3JpdGUoXCJfXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmRhdGEucHVzaChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRSZXBlYXRlckRldGFpbHMoaHJlZjogc3RyaW5nKSB7XG4gICAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiR2V0IFJlcGVhdGVyIERldGFpbHNcIiksIGhyZWYpO1xuICAgIGNvbnN0IHVybFBhcmFtcyA9IGhyZWYuc3BsaXQoXCI/XCIpWzFdO1xuICAgIGNvbnN0IGtleVBhcnRzID0gdXJsUGFyYW1zLm1hdGNoKC9zdGF0ZV9pZD0oXFxkKykmSUQ9KFxcZCspLykgfHwgW107XG4gICAgY29uc3Qga2V5ID0gYCR7a2V5UGFydHNbMV19LyR7a2V5UGFydHNbMl19Lmh0bWxgO1xuICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCB0aGlzLmdldFVybChgaHR0cHM6Ly93d3cucmVwZWF0ZXJib29rLmNvbS9yZXBlYXRlcnMvJHtocmVmfWAsIGtleSk7XG4gICAgY29uc3QgZG9tID0gbmV3IEpTRE9NKHBhZ2UpO1xuICAgIGNvbnN0IGRhdGE6IHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHt9O1xuICAgIGRhdGEuc3RhdGVfaWQgPSBrZXlQYXJ0c1sxXTtcbiAgICBkYXRhLklEID0ga2V5UGFydHNbMl07XG4gICAgY29uc3QgbWVudXMgPSBBcnJheS5mcm9tKGRvbS53aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MQW5jaG9yRWxlbWVudD4oXCIjY3NzbWVudSBhXCIpKTtcbiAgICBjb25zdCBsb2NhdGlvblJlZ2V4ID0gLygtP1xcZCpcXC4/XFxkKilcXCsoLT9cXGQqXFwuP1xcZCopL2k7XG4gICAgZm9yIChjb25zdCBtZW51IG9mIG1lbnVzKSB7XG4gICAgICBjb25zdCBsb2NhdGlvbk1hdGNoID0gbWVudS5ocmVmLm1hdGNoKGxvY2F0aW9uUmVnZXgpO1xuICAgICAgaWYgKGxvY2F0aW9uTWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbGF0ID0gZ2V0TnVtYmVyKGxvY2F0aW9uTWF0Y2hbMV0pO1xuICAgICAgICBjb25zdCBsb25nID0gZ2V0TnVtYmVyKGxvY2F0aW9uTWF0Y2hbMl0pO1xuICAgICAgICBkYXRhLkxhdGl0dWRlID0gaXNOYU4obGF0KSA/IGxvY2F0aW9uTWF0Y2hbMV0gOiBsYXQ7XG4gICAgICAgIGRhdGEuTG9uZ2l0dWRlID0gaXNOYU4obG9uZykgPyBsb2NhdGlvbk1hdGNoWzJdIDogbG9uZztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHRhYmxlID0gZG9tLndpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUudzMtdGFibGUudzMtcmVzcG9uc2l2ZVwiKTtcbiAgICBpZiAodGFibGUpIHtcbiAgICAgIGNvbnN0IHJvd3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGFibGUucXVlcnlTZWxlY3RvckFsbChcInRib2R5ID4gdHJcIikpO1xuICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFsuLi5yb3cucXVlcnlTZWxlY3RvckFsbChcInRkXCIpXTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBnZXRUZXh0KGNlbGxzWzBdKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRUZXh0T3JOdW1iZXIoY2VsbHNbMV0pO1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gdGl0bGUuc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTtcbiAgICAgICAgY29uc3QgZGF0YVZhbCA9IHRpdGxlLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgICAgbGV0IHVwZGF0ZWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGRhdGFWYWwpIHtcbiAgICAgICAgICBjb25zdCBkYXRlID0gZGF0YVZhbC5tYXRjaCgvKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGlmIChkYXRlICYmIGRhdGVbMV0pIHtcbiAgICAgICAgICAgIHVwZGF0ZWQgPSBkYXRlWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhW2RhdGFLZXldID0gdXBkYXRlZCB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gbG9nKFxuICAgIC8vICAgZGF0YS5zdGF0ZV9pZCA/IGRhdGEuc3RhdGVfaWQgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5JRCA/IGRhdGEuSUQgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5MYXRpdHVkZSA/IGRhdGEuTGF0aXR1ZGUgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5Mb25naXR1ZGUgPyBkYXRhLkxvbmdpdHVkZSA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLkNhbGwgPyBkYXRhLkNhbGwgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5Eb3dubGluayA/IGRhdGEuRG93bmxpbmsgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5Vc2UgPyBkYXRhLlVzZSA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhW1wiT3AgU3RhdHVzXCJdID8gZGF0YVtcIk9wIFN0YXR1c1wiXSA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLkFmZmlsaWF0ZSA/IGRhdGEuQWZmaWxpYXRlIDogXCJcIiwgXCJcXHRcIixcbiAgICAvLyAgIGRhdGEuU3BvbnNvciA/IGRhdGEuU3BvbnNvciA6IFwiXCIsXG4gICAgLy8gKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0Q2FjaGUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBmaWxlID0gYGRhdGEvcmVwZWF0ZXJzL19jYWNoZS8ke2tleX1gO1xuICAgIGlmIChhd2FpdCBkaXJFeGlzdHMoZmlsZSkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgcmVhZEZpbGVBc3luYyhmaWxlKSkudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldENhY2hlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgZmlsZSA9IGBkYXRhL3JlcGVhdGVycy9fY2FjaGUvJHtrZXl9YDtcbiAgICBhd2FpdCBtYWtlRGlycyhmaWxlKTtcbiAgICByZXR1cm4gd3JpdGVGaWxlQXN5bmMoZmlsZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRVcmwodXJsOiBzdHJpbmcsIGNhY2hlS2V5Pzogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgVVJMXCIpLCB1cmwsIGNhY2hlS2V5KTtcblxuICAgIGNvbnN0IGNhY2hlID0gYXdhaXQgdGhpcy5nZXRDYWNoZShjYWNoZUtleSB8fCB1cmwpO1xuICAgIGlmIChjYWNoZSkge1xuICAgICAgLy8gbG9nKGNoYWxrLnllbGxvdyhcIkNhY2hlZFwiKSwgdXJsLCBjYWNoZUtleSk7XG4gICAgICB3cml0ZShcIjxcIik7XG4gICAgICByZXR1cm4gY2FjaGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNsb3cgZG93biB0aGUgcmVxdWVzdHMgYSBsaXR0bGUgYml0IHNvIHdlJ3JlIG5vdCBoYW1tZXJpbmcgdGhlIHNlcnZlciBvciB0cmlnZ2VyaW5nIGFueSBhbnRpLWJvdCBvciBERG9TIHByb3RlY3Rpb25zXG4gICAgICBjb25zdCB3YWl0VGltZSA9IChNYXRoLnJhbmRvbSgpICogNTAwMCk7XG5cbiAgICAgIGF3YWl0IHdhaXQod2FpdFRpbWUpO1xuICAgICAgLy8gbG9nKGNoYWxrLnllbGxvdyhcIkdldFwiKSwgdXJsKTtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBhd2FpdCBBeGlvcy5nZXQodXJsKTtcbiAgICAgIC8vIGxvZyhjaGFsay5ncmVlbihcIkdvdFwiKSwgdXJsKTtcbiAgICAgIHdyaXRlKFwiPlwiKTtcblxuICAgICAgY29uc3QgZGF0YSA9IHJlcXVlc3QuZGF0YTtcbiAgICAgIGF3YWl0IHRoaXMuc2V0Q2FjaGUoY2FjaGVLZXkgfHwgdXJsLCBkYXRhKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfVxufVxuIl19