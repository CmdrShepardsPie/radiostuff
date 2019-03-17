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
    Object.defineProperty(exports, "__esModule", { value: true });
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
            log(chalk_1.default.green("New Scraper"), location, distance);
            this.url = "https://www.repeaterbook.com/repeaters/prox_result.php?city=" + encodeURIComponent(location.toString()) + "&distance=" + distance + "&Dunit=m&band1=%25&band2=&freq=&call=&features=&status_id=%25&use=%25&order=%60state_id%60%2C+%60loc%60%2C+%60call%60+ASC";
        }
        Scraper.prototype.process = function () {
            return __awaiter(this, void 0, void 0, function () {
                var parts, baseKey, page, dom;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log(chalk_1.default.green("Process"));
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
                            log(chalk_1.default.green("Get Repeater List"));
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
                                if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) _a.call(rows_1);
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
                                    if (menus_1_1 && !menus_1_1.done && (_a = menus_1.return)) _a.call(menus_1);
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
                                        if (rows_2_1 && !rows_2_1.done && (_b = rows_2.return)) _b.call(rows_2);
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
                            return [4 /*yield*/, axios_1.default.get(url)];
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
    exports.default = Scraper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY3JpcHRzL21vZHVsZXMvc2NyYXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsa0RBQXVGO0lBQ3ZGLDRDQUFzQztJQUN0QyxvREFBK0M7SUFDL0MsK0JBQTBCO0lBQzFCLCtCQUEwQjtJQUMxQiwrQkFBOEI7SUFDOUIsbUNBQTZEO0lBR3ZELElBQUEsdUNBQXFDLEVBQW5DLFlBQUcsRUFBRSxnQkFBOEIsQ0FBQztJQUM1Qyx3Q0FBd0M7SUFFeEM7UUFJRSxpQkFBb0IsUUFBeUIsRUFBVSxRQUFnQjtZQUFuRCxhQUFRLEdBQVIsUUFBUSxDQUFpQjtZQUFVLGFBQVEsR0FBUixRQUFRLENBQVE7WUFIL0QsU0FBSSxHQUFnQixFQUFFLENBQUM7WUFJN0IsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxHQUFHLEdBQUcsaUVBQStELGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxrQkFBYSxRQUFRLDhIQUEySCxDQUFDO1FBQ3BRLENBQUM7UUFFWSx5QkFBTyxHQUFwQjs7Ozs7OzRCQUNFLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBRXRCLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDNUMsT0FBTyxHQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxTQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FB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QUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFBOzs0QkFBOUIsT0FBTyxHQUFHLFNBQW9COzRCQUNwQyxnQ0FBZ0M7NEJBQ2hDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFFTCxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzs0QkFDMUIscUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFBOzs0QkFBMUMsU0FBMEMsQ0FBQzs0QkFDM0Msc0JBQU8sSUFBSSxFQUFDOzs7O1NBRWY7UUFDSCxjQUFDO0lBQUQsQ0FBQyxBQWhKRCxJQWdKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGlyRXhpc3RzLCBtYWtlRGlycywgcmVhZEZpbGVBc3luYywgd3JpdGVGaWxlQXN5bmN9IGZyb20gXCJAaGVscGVycy9mcy1oZWxwZXJzXCI7XG5pbXBvcnQge3dhaXR9IGZyb20gXCJAaGVscGVycy9oZWxwZXJzXCI7XG5pbXBvcnQge2NyZWF0ZU91dH0gZnJvbSBcIkBoZWxwZXJzL2xvZy1oZWxwZXJzXCI7XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQgeyBKU0RPTSB9IGZyb20gXCJqc2RvbVwiO1xuaW1wb3J0IHtnZXROdW1iZXIsIGdldFRleHQsIGdldFRleHRPck51bWJlcn0gZnJvbSBcIi4vaGVscGVyXCI7XG5pbXBvcnQge0lSZXBlYXRlcn0gZnJvbSBcIi4vaS5yZXBlYXRlclwiO1xuXG5jb25zdCB7IGxvZywgd3JpdGUgfSA9IGNyZWF0ZU91dChcIlNjcmFwZXJcIik7XG4vLyBjb25zdCB3cml0ZSA9IGNyZWF0ZVdyaXRlKFwiU2NyYXBlclwiKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyYXBlciB7XG4gIHByaXZhdGUgZGF0YTogSVJlcGVhdGVyW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSB1cmw6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvY2F0aW9uOiBzdHJpbmcgfCBudW1iZXIsIHByaXZhdGUgZGlzdGFuY2U6IG51bWJlcikge1xuICAgIGxvZyhjaGFsay5ncmVlbihcIk5ldyBTY3JhcGVyXCIpLCBsb2NhdGlvbiwgZGlzdGFuY2UpO1xuICAgIHRoaXMudXJsID0gYGh0dHBzOi8vd3d3LnJlcGVhdGVyYm9vay5jb20vcmVwZWF0ZXJzL3Byb3hfcmVzdWx0LnBocD9jaXR5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGxvY2F0aW9uLnRvU3RyaW5nKCkpfSZkaXN0YW5jZT0ke2Rpc3RhbmNlfSZEdW5pdD1tJmJhbmQxPSUyNSZiYW5kMj0mZnJlcT0mY2FsbD0mZmVhdHVyZXM9JnN0YXR1c19pZD0lMjUmdXNlPSUyNSZvcmRlcj0lNjBzdGF0ZV9pZCU2MCUyQyslNjBsb2MlNjAlMkMrJTYwY2FsbCU2MCtBU0NgO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHByb2Nlc3MoKSB7XG4gICAgbG9nKGNoYWxrLmdyZWVuKFwiUHJvY2Vzc1wiKSk7XG5cbiAgICBjb25zdCBwYXJ0cyA9IHRoaXMubG9jYXRpb24udG9TdHJpbmcoKS5zcGxpdChgLGApO1xuICAgIGNvbnN0IGJhc2VLZXkgPSBgJHsocGFydHNbMV0gfHwgXCIuXCIpLnRyaW0oKX0vJHtwYXJ0c1swXS50cmltKCl9Lmh0bWxgO1xuICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCB0aGlzLmdldFVybCh0aGlzLnVybCwgYmFzZUtleSk7XG4gICAgY29uc3QgZG9tID0gbmV3IEpTRE9NKHBhZ2UpO1xuICAgIGF3YWl0IHRoaXMuZ2V0UmVwZWF0ZXJMaXN0KGRvbS53aW5kb3cuZG9jdW1lbnQpO1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldFJlcGVhdGVyTGlzdChkb2N1bWVudDogRG9jdW1lbnQpIHtcbiAgICAvLyBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgIGxvZyhjaGFsay5ncmVlbihcIkdldCBSZXBlYXRlciBMaXN0XCIpKTtcblxuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlLnczLXRhYmxlLnczLXN0cmlwZWQudzMtcmVzcG9uc2l2ZVwiKTtcbiAgICBpZiAodGFibGUpIHtcbiAgICAgIGNvbnN0IHJvd3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGFibGUucXVlcnlTZWxlY3RvckFsbChcInRib2R5ID4gdHJcIikpO1xuICAgICAgY29uc3QgaGVhZGVyUm93ID0gcm93cy5zaGlmdCgpO1xuICAgICAgaWYgKGhlYWRlclJvdykge1xuICAgICAgICBjb25zdCBoZWFkZXJDZWxscyA9IFsuLi5oZWFkZXJSb3cucXVlcnlTZWxlY3RvckFsbChcInRoXCIpXTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IGhlYWRlckNlbGxzLm1hcCgodGgpID0+IGdldFRleHQodGgpKTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHt9O1xuICAgICAgICAgIGNvbnN0IGNlbGxzID0gWy4uLnJvdy5xdWVyeVNlbGVjdG9yQWxsKFwidGRcIildO1xuICAgICAgICAgIGNlbGxzLmZvckVhY2goKHRkLCBpbmRleCkgPT4gZGF0YVtoZWFkZXJzW2luZGV4XV0gPSBnZXRUZXh0T3JOdW1iZXIodGQpKTtcbiAgICAgICAgICBjb25zdCBsaW5rID0gY2VsbHNbMF0ucXVlcnlTZWxlY3RvcihcImFcIik7XG4gICAgICAgICAgaWYgKGxpbmspIHtcbiAgICAgICAgICAgIHdyaXRlKFwiXlwiKTtcbiAgICAgICAgICAgIC8vIHByb21pc2VzLnB1c2godGhpcy5nZXRSZXBlYXRlckRldGFpbHMobGluay5ocmVmKS50aGVuKChkKSA9PiB7XG4gICAgICAgICAgICAvLyAgIHdyaXRlKFwiX1wiKTtcbiAgICAgICAgICAgIC8vICAgT2JqZWN0LmFzc2lnbihkYXRhLCBkKTtcbiAgICAgICAgICAgIC8vIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZGF0YSwgYXdhaXQgdGhpcy5nZXRSZXBlYXRlckRldGFpbHMobGluay5ocmVmKSk7XG4gICAgICAgICAgICB3cml0ZShcIl9cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZGF0YS5wdXNoKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldFJlcGVhdGVyRGV0YWlscyhocmVmOiBzdHJpbmcpIHtcbiAgICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgUmVwZWF0ZXIgRGV0YWlsc1wiKSwgaHJlZik7XG4gICAgY29uc3QgdXJsUGFyYW1zID0gaHJlZi5zcGxpdChcIj9cIilbMV07XG4gICAgY29uc3Qga2V5UGFydHMgPSB1cmxQYXJhbXMubWF0Y2goL3N0YXRlX2lkPShcXGQrKSZJRD0oXFxkKykvKSB8fCBbXTtcbiAgICBjb25zdCBrZXkgPSBgJHtrZXlQYXJ0c1sxXX0vJHtrZXlQYXJ0c1syXX0uaHRtbGA7XG4gICAgY29uc3QgcGFnZSA9IGF3YWl0IHRoaXMuZ2V0VXJsKGBodHRwczovL3d3dy5yZXBlYXRlcmJvb2suY29tL3JlcGVhdGVycy8ke2hyZWZ9YCwga2V5KTtcbiAgICBjb25zdCBkb20gPSBuZXcgSlNET00ocGFnZSk7XG4gICAgY29uc3QgZGF0YTogeyBbaW5kZXg6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9ID0ge307XG4gICAgZGF0YS5zdGF0ZV9pZCA9IGtleVBhcnRzWzFdO1xuICAgIGRhdGEuSUQgPSBrZXlQYXJ0c1syXTtcbiAgICBjb25zdCBtZW51cyA9IEFycmF5LmZyb20oZG9tLndpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxBbmNob3JFbGVtZW50PihcIiNjc3NtZW51IGFcIikpO1xuICAgIGNvbnN0IGxvY2F0aW9uUmVnZXggPSAvKC0/XFxkKlxcLj9cXGQqKVxcKygtP1xcZCpcXC4/XFxkKikvaTtcbiAgICBmb3IgKGNvbnN0IG1lbnUgb2YgbWVudXMpIHtcbiAgICAgIGNvbnN0IGxvY2F0aW9uTWF0Y2ggPSBtZW51LmhyZWYubWF0Y2gobG9jYXRpb25SZWdleCk7XG4gICAgICBpZiAobG9jYXRpb25NYXRjaCkge1xuICAgICAgICBjb25zdCBsYXQgPSBnZXROdW1iZXIobG9jYXRpb25NYXRjaFsxXSk7XG4gICAgICAgIGNvbnN0IGxvbmcgPSBnZXROdW1iZXIobG9jYXRpb25NYXRjaFsyXSk7XG4gICAgICAgIGRhdGEuTGF0aXR1ZGUgPSBpc05hTihsYXQpID8gbG9jYXRpb25NYXRjaFsxXSA6IGxhdDtcbiAgICAgICAgZGF0YS5Mb25naXR1ZGUgPSBpc05hTihsb25nKSA/IGxvY2F0aW9uTWF0Y2hbMl0gOiBsb25nO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdGFibGUgPSBkb20ud2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZS53My10YWJsZS53My1yZXNwb25zaXZlXCIpO1xuICAgIGlmICh0YWJsZSkge1xuICAgICAgY29uc3Qgcm93cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidGJvZHkgPiB0clwiKSk7XG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gWy4uLnJvdy5xdWVyeVNlbGVjdG9yQWxsKFwidGRcIildO1xuICAgICAgICBjb25zdCB0aXRsZSA9IGdldFRleHQoY2VsbHNbMF0pO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldFRleHRPck51bWJlcihjZWxsc1sxXSk7XG4gICAgICAgIGNvbnN0IGRhdGFLZXkgPSB0aXRsZS5zcGxpdChcIjpcIilbMF0udHJpbSgpO1xuICAgICAgICBjb25zdCBkYXRhVmFsID0gdGl0bGUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgICBsZXQgdXBkYXRlZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoZGF0YVZhbCkge1xuICAgICAgICAgIGNvbnN0IGRhdGUgPSBkYXRhVmFsLm1hdGNoKC8oXFxkezR9LVxcZHsyfS1cXGR7Mn0pLyk7XG4gICAgICAgICAgaWYgKGRhdGUgJiYgZGF0ZVsxXSkge1xuICAgICAgICAgICAgdXBkYXRlZCA9IGRhdGVbMV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRhdGFbZGF0YUtleV0gPSB1cGRhdGVkIHx8IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBsb2coXG4gICAgLy8gICBkYXRhLnN0YXRlX2lkID8gZGF0YS5zdGF0ZV9pZCA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLklEID8gZGF0YS5JRCA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLkxhdGl0dWRlID8gZGF0YS5MYXRpdHVkZSA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLkxvbmdpdHVkZSA/IGRhdGEuTG9uZ2l0dWRlIDogXCJcIiwgXCJcXHRcIixcbiAgICAvLyAgIGRhdGEuQ2FsbCA/IGRhdGEuQ2FsbCA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLkRvd25saW5rID8gZGF0YS5Eb3dubGluayA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLlVzZSA/IGRhdGEuVXNlIDogXCJcIiwgXCJcXHRcIixcbiAgICAvLyAgIGRhdGFbXCJPcCBTdGF0dXNcIl0gPyBkYXRhW1wiT3AgU3RhdHVzXCJdIDogXCJcIiwgXCJcXHRcIixcbiAgICAvLyAgIGRhdGEuQWZmaWxpYXRlID8gZGF0YS5BZmZpbGlhdGUgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5TcG9uc29yID8gZGF0YS5TcG9uc29yIDogXCJcIixcbiAgICAvLyApO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRDYWNoZShrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGZpbGUgPSBgZGF0YS9yZXBlYXRlcnMvX2NhY2hlLyR7a2V5fWA7XG4gICAgaWYgKGF3YWl0IGRpckV4aXN0cyhmaWxlKSkge1xuICAgICAgcmV0dXJuIChhd2FpdCByZWFkRmlsZUFzeW5jKGZpbGUpKS50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0Q2FjaGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBmaWxlID0gYGRhdGEvcmVwZWF0ZXJzL19jYWNoZS8ke2tleX1gO1xuICAgIGF3YWl0IG1ha2VEaXJzKGZpbGUpO1xuICAgIHJldHVybiB3cml0ZUZpbGVBc3luYyhmaWxlLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldFVybCh1cmw6IHN0cmluZywgY2FjaGVLZXk/OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIC8vIGxvZyhjaGFsay5ncmVlbihcIkdldCBVUkxcIiksIHVybCwgY2FjaGVLZXkpO1xuXG4gICAgY29uc3QgY2FjaGUgPSBhd2FpdCB0aGlzLmdldENhY2hlKGNhY2hlS2V5IHx8IHVybCk7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICAvLyBsb2coY2hhbGsueWVsbG93KFwiQ2FjaGVkXCIpLCB1cmwsIGNhY2hlS2V5KTtcbiAgICAgIHdyaXRlKFwiPFwiKTtcbiAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2xvdyBkb3duIHRoZSByZXF1ZXN0cyBhIGxpdHRsZSBiaXQgc28gd2UncmUgbm90IGhhbW1lcmluZyB0aGUgc2VydmVyIG9yIHRyaWdnZXJpbmcgYW55IGFudGktYm90IG9yIEREb1MgcHJvdGVjdGlvbnNcbiAgICAgIGNvbnN0IHdhaXRUaW1lID0gKE1hdGgucmFuZG9tKCkgKiA1MDAwKTtcblxuICAgICAgYXdhaXQgd2FpdCh3YWl0VGltZSk7XG4gICAgICAvLyBsb2coY2hhbGsueWVsbG93KFwiR2V0XCIpLCB1cmwpO1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGF3YWl0IEF4aW9zLmdldCh1cmwpO1xuICAgICAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiR290XCIpLCB1cmwpO1xuICAgICAgd3JpdGUoXCI+XCIpO1xuXG4gICAgICBjb25zdCBkYXRhID0gcmVxdWVzdC5kYXRhO1xuICAgICAgYXdhaXQgdGhpcy5zZXRDYWNoZShjYWNoZUtleSB8fCB1cmwsIGRhdGEpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9XG59XG4iXX0=