var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    var fs_helpers_1 = require("@helpers/fs-helpers");
    var helpers_1 = require("@helpers/helpers");
    var log_helpers_1 = require("@helpers/log-helpers");
    var log = log_helpers_1.createLog("Combine");
    exports.default = (function () { return __awaiter(_this, void 0, void 0, function () {
        var myPoint, combined, files, found, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myPoint = [38.833881, -104.821365];
                    combined = [];
                    return [4 /*yield*/, fs_helpers_1.getAllFilesFromDirectory("data/repeaters/results/CO")];
                case 1:
                    files = _a.sent();
                    log("Got", files.length, "files");
                    found = {};
                    files.forEach(function (file) {
                        log("Got", file.length, "repeaters");
                        file.forEach(function (item) {
                            if (!found[item.state_id + "-" + item.ID]) {
                                found[item.state_id + "-" + item.ID] = true;
                                combined.push(item);
                                var x = Math.pow(item.Latitude - myPoint[0], 2);
                                var y = Math.pow(item.Longitude - myPoint[1], 2);
                                item.Mi = Math.pow(x + y, 1 / 2);
                            }
                        });
                    });
                    log("Got", combined.length, "unique repeaters");
                    combined.sort(function (a, b) {
                        var aMi = helpers_1.numberToString(a.Mi * 100, 3, 24);
                        var bMi = helpers_1.numberToString(b.Mi * 100, 3, 24);
                        var aRepeaterName = a.Call;
                        var bRepeaterName = b.Call;
                        var aFrequency = helpers_1.numberToString(a.Frequency, 4, 5);
                        var bFrequency = helpers_1.numberToString(b.Frequency, 4, 5);
                        var aStr = aMi + " " + aRepeaterName + " " + aFrequency;
                        var bStr = bMi + " " + bRepeaterName + " " + bFrequency;
                        return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
                    });
                    stats = combined.reduce(function (result, data) {
                        var _a;
                        var freq = Math.round(data.Frequency).toString();
                        var pow = Math.pow(10, Math.max(freq.length - 2, 0)) * 2;
                        var group = Math.round(data.Frequency / pow) * pow;
                        // console.log(freq, pow, group);
                        var count = result[group] || 0;
                        return __assign({}, result, (_a = {}, _a[group] = count + 1, _a));
                    }, {});
                    console.log("STATS", stats);
                    // combined.slice(0, 100).forEach((c) => log(c.Call, "\t", c.Latitude, "\t", c.Longitude, "\t", c.Mi));
                    return [4 /*yield*/, fs_helpers_1.writeToJsonAndCsv("data/repeaters/combined/CO", combined)];
                case 2:
                    // combined.slice(0, 100).forEach((c) => log(c.Call, "\t", c.Latitude, "\t", c.Longitude, "\t", c.Mi));
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2NvbWJpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxpQkFtREE7O0lBbkRBLGlDQUErQjtJQUUvQixrREFBZ0Y7SUFDaEYsNENBQWdEO0lBQ2hELG9EQUErQztJQUUvQyxJQUFNLEdBQUcsR0FBRyx1QkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWpDLGtCQUFlLENBQUM7Ozs7O29CQUNSLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuQyxRQUFRLEdBQVUsRUFBRSxDQUFDO29CQUNiLHFCQUFNLHFDQUF3QixDQUFRLDJCQUEyQixDQUFDLEVBQUE7O29CQUExRSxLQUFLLEdBQUcsU0FBa0U7b0JBQ2hGLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDNUIsS0FBSyxHQUErQixFQUFFLENBQUM7b0JBQzdDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO3dCQUNqQixHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7d0JBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJOzRCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFJLElBQUksQ0FBQyxRQUFRLFNBQUksSUFBSSxDQUFDLEVBQUksQ0FBQyxFQUFFO2dDQUN6QyxLQUFLLENBQUksSUFBSSxDQUFDLFFBQVEsU0FBSSxJQUFJLENBQUMsRUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dDQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNwQixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFD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bW9kdWxlLWFsaWFzL3JlZ2lzdGVyXCI7XG5cbmltcG9ydCB7Z2V0QWxsRmlsZXNGcm9tRGlyZWN0b3J5LCB3cml0ZVRvSnNvbkFuZENzdn0gZnJvbSBcIkBoZWxwZXJzL2ZzLWhlbHBlcnNcIjtcbmltcG9ydCB7bnVtYmVyVG9TdHJpbmd9IGZyb20gXCJAaGVscGVycy9oZWxwZXJzXCI7XG5pbXBvcnQge2NyZWF0ZUxvZ30gZnJvbSBcIkBoZWxwZXJzL2xvZy1oZWxwZXJzXCI7XG5cbmNvbnN0IGxvZyA9IGNyZWF0ZUxvZyhcIkNvbWJpbmVcIik7XG5cbmV4cG9ydCBkZWZhdWx0IChhc3luYyAoKSA9PiB7XG4gIGNvbnN0IG15UG9pbnQgPSBbMzguODMzODgxLCAtMTA0LjgyMTM2NV07XG4gIGNvbnN0IGNvbWJpbmVkOiBhbnlbXSA9IFtdO1xuICBjb25zdCBmaWxlcyA9IGF3YWl0IGdldEFsbEZpbGVzRnJvbURpcmVjdG9yeTxhbnlbXT4oXCJkYXRhL3JlcGVhdGVycy9yZXN1bHRzL0NPXCIpO1xuICBsb2coXCJHb3RcIiwgZmlsZXMubGVuZ3RoLCBcImZpbGVzXCIpO1xuICBjb25zdCBmb3VuZDogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcbiAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIGxvZyhcIkdvdFwiLCBmaWxlLmxlbmd0aCwgXCJyZXBlYXRlcnNcIik7XG4gICAgZmlsZS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpZiAoIWZvdW5kW2Ake2l0ZW0uc3RhdGVfaWR9LSR7aXRlbS5JRH1gXSkge1xuICAgICAgICBmb3VuZFtgJHtpdGVtLnN0YXRlX2lkfS0ke2l0ZW0uSUR9YF0gPSB0cnVlO1xuICAgICAgICBjb21iaW5lZC5wdXNoKGl0ZW0pO1xuICAgICAgICBjb25zdCB4ID0gTWF0aC5wb3coaXRlbS5MYXRpdHVkZSAtIG15UG9pbnRbMF0sIDIpO1xuICAgICAgICBjb25zdCB5ID0gTWF0aC5wb3coaXRlbS5Mb25naXR1ZGUgLSBteVBvaW50WzFdLCAyKTtcbiAgICAgICAgaXRlbS5NaSA9IE1hdGgucG93KHggKyB5LCAxIC8gMik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBsb2coXCJHb3RcIiwgY29tYmluZWQubGVuZ3RoLCBcInVuaXF1ZSByZXBlYXRlcnNcIik7XG4gIGNvbWJpbmVkLnNvcnQoKGEsIGIpID0+IHtcbiAgICBjb25zdCBhTWkgPSBudW1iZXJUb1N0cmluZyhhLk1pICogMTAwLCAzLCAyNCk7XG4gICAgY29uc3QgYk1pID0gbnVtYmVyVG9TdHJpbmcoYi5NaSAqIDEwMCwgMywgMjQpO1xuICAgIGNvbnN0IGFSZXBlYXRlck5hbWUgPSBhLkNhbGw7XG4gICAgY29uc3QgYlJlcGVhdGVyTmFtZSA9IGIuQ2FsbDtcbiAgICBjb25zdCBhRnJlcXVlbmN5ID0gbnVtYmVyVG9TdHJpbmcoYS5GcmVxdWVuY3ksIDQsIDUpO1xuICAgIGNvbnN0IGJGcmVxdWVuY3kgPSBudW1iZXJUb1N0cmluZyhiLkZyZXF1ZW5jeSwgNCwgNSk7XG4gICAgY29uc3QgYVN0ciA9IGAke2FNaX0gJHthUmVwZWF0ZXJOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICBjb25zdCBiU3RyID0gYCR7Yk1pfSAke2JSZXBlYXRlck5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xuXG4gICAgcmV0dXJuIGFTdHIgPiBiU3RyID8gMSA6IGFTdHIgPCBiU3RyID8gLTEgOiAwO1xuICB9KTtcbiAgY29uc3Qgc3RhdHMgPSBjb21iaW5lZC5yZWR1Y2UoKHJlc3VsdCwgZGF0YSkgPT4ge1xuICAgIGNvbnN0IGZyZXEgPSBNYXRoLnJvdW5kKGRhdGEuRnJlcXVlbmN5KS50b1N0cmluZygpO1xuICAgIGNvbnN0IHBvdyA9IE1hdGgucG93KDEwLCBNYXRoLm1heChmcmVxLmxlbmd0aCAtIDIsIDApKSAqIDI7XG4gICAgY29uc3QgZ3JvdXAgPSBNYXRoLnJvdW5kKGRhdGEuRnJlcXVlbmN5IC8gcG93KSAqIHBvdztcbiAgICAvLyBjb25zb2xlLmxvZyhmcmVxLCBwb3csIGdyb3VwKTtcbiAgICBjb25zdCBjb3VudCA9IHJlc3VsdFtncm91cF0gfHwgMDtcbiAgICByZXR1cm4gey4uLnJlc3VsdCwgW2dyb3VwXTogY291bnQgKyAxIH07XG4gIH0sIHt9KTtcbiAgY29uc29sZS5sb2coXCJTVEFUU1wiLCBzdGF0cyk7XG4gIC8vIGNvbWJpbmVkLnNsaWNlKDAsIDEwMCkuZm9yRWFjaCgoYykgPT4gbG9nKGMuQ2FsbCwgXCJcXHRcIiwgYy5MYXRpdHVkZSwgXCJcXHRcIiwgYy5Mb25naXR1ZGUsIFwiXFx0XCIsIGMuTWkpKTtcbiAgYXdhaXQgd3JpdGVUb0pzb25BbmRDc3YoXCJkYXRhL3JlcGVhdGVycy9jb21iaW5lZC9DT1wiLCBjb21iaW5lZCk7XG59KSgpO1xuIl19