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
        define(["require", "exports", "@helpers/log-helpers", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var log_helpers_1 = require("@helpers/log-helpers");
    var chalk_1 = require("chalk");
    var log = log_helpers_1.createLog("Helpers");
    function wait(ms, fn) {
        var _this = this;
        log(chalk_1["default"].green("Wait"), ms);
        return new Promise(function (resolve, reject) {
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, e_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            _a = resolve;
                            _b = fn;
                            if (!_b) return [3 /*break*/, 2];
                            return [4 /*yield*/, fn()];
                        case 1:
                            _b = (_c.sent());
                            _c.label = 2;
                        case 2:
                            _a.apply(void 0, [_b]);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _c.sent();
                            reject(e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, ms);
        });
    }
    exports.wait = wait;
    function numberToString(num, major, minor) {
        var str = num.toString();
        var split = str.split(".");
        if (major !== undefined) {
            if (split[0] === undefined) {
                split[0] = "0";
            }
            while (split[0].length < major) {
                split[0] = "0" + split[0];
            }
            if (split[0].length > major) {
                log(chalk_1["default"].red("Major length exceeded"), "Number:", num, "Section:", split[0], "Length:", split[0].length, "Target:", major);
            }
            str = split.join(".");
        }
        if (minor !== undefined) {
            if (split[1] === undefined) {
                split[1] = "0";
            }
            while (split[1].length < minor) {
                split[1] = split[1] + "0";
            }
            if (split[1].length > minor) {
                log(chalk_1["default"].red("Minor length exceeded"), "Number:", num, "Section:", split[1], "Length:", split[1].length, "Target:", minor);
            }
            str = split.join(".");
        }
        return str;
    }
    exports.numberToString = numberToString;
    function flattenObject(data) {
        var e_2, _a;
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return data;
        }
        var subData = __assign({}, data);
        var loop = true;
        while (loop) {
            loop = false;
            var entries = Object.entries(subData);
            var _loop_1 = function (entry) {
                var key = entry[0];
                var value = entry[1];
                if (typeof value === "object" && !Array.isArray(value)) {
                    delete subData[key];
                    var valueWithKeynames_1 = {};
                    Object.entries(value).forEach(function (subEntry) {
                        valueWithKeynames_1[key + "." + subEntry[0]] = subEntry[1];
                    });
                    subData = __assign({}, subData, valueWithKeynames_1);
                    loop = true;
                }
            };
            try {
                for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                    var entry = entries_1_1.value;
                    _loop_1(entry);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (entries_1_1 && !entries_1_1.done && (_a = entries_1["return"])) _a.call(entries_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return subData;
    }
    exports.flattenObject = flattenObject;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBLG9EQUErQztJQUMvQywrQkFBMEI7SUFHMUIsSUFBTSxHQUFHLEdBQUcsdUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVqQyxTQUFnQixJQUFJLENBQUMsRUFBVSxFQUFFLEVBQVE7UUFBekMsaUJBV0M7UUFWQyxHQUFHLENBQUMsa0JBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLFVBQVUsQ0FBQzs7Ozs7OzRCQUVQLEtBQUEsT0FBTyxDQUFBOzRCQUFDLEtBQUEsRUFBRSxDQUFBO3FDQUFGLHdCQUFFOzRCQUFLLHFCQUFNLEVBQUUsRUFBRSxFQUFBOzs0QkFBWCxLQUFBLENBQUMsU0FBVSxDQUFDLENBQUE7Ozs0QkFBMUIsc0JBQTJCLENBQUM7Ozs7NEJBRTVCLE1BQU0sQ0FBQyxHQUFDLENBQUMsQ0FBQzs7Ozs7aUJBRWIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVhELG9CQVdDO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLEdBQVcsRUFBRSxLQUFjLEVBQUUsS0FBYztRQUN4RSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDekIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUMxQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ2hCO1lBQ0QsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssRUFBRTtnQkFDOUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7WUFDRCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO2dCQUMzQixHQUFHLENBQUMsa0JBQUssQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzdIO1lBQ0QsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7UUFDRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUMxQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ2hCO1lBQ0QsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssRUFBRTtnQkFDOUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDM0I7WUFDRCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO2dCQUMzQixHQUFHLENBQUMsa0JBQUssQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzdIO1lBQ0QsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUE1QkQsd0NBNEJDO0lBRUQsU0FBZ0IsYUFBYSxDQUFDLElBQVk7O1FBQ3hDLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELElBQUksT0FBTyxnQkFBTyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsT0FBTyxJQUFJLEVBQUU7WUFDWCxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2IsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQ0FDN0IsS0FBSztnQkFDZCxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUF5QixDQUFDO2dCQUM3QyxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDdEQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3BCLElBQU0sbUJBQWlCLEdBQVEsRUFBRSxDQUFDO29CQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7d0JBQ3JDLG1CQUFpQixDQUFJLEdBQUcsU0FBSSxRQUFRLENBQUMsQ0FBQyxDQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELENBQUMsQ0FBQyxDQUFDO29CQUNILE9BQU8sZ0JBQU8sT0FBTyxFQUFLLG1CQUFpQixDQUFDLENBQUM7b0JBQzdDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ2I7OztnQkFYSCxLQUFvQixJQUFBLFlBQUEsU0FBQSxPQUFPLENBQUEsZ0NBQUE7b0JBQXRCLElBQU0sS0FBSyxvQkFBQTs0QkFBTCxLQUFLO2lCQVlmOzs7Ozs7Ozs7U0FDRjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUF4QkQsc0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjcmVhdGVMb2d9IGZyb20gXCJAaGVscGVycy9sb2ctaGVscGVyc1wiO1xuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0ICogYXMgc3RyZWFtIGZyb20gXCJzdHJlYW1cIjtcblxuY29uc3QgbG9nID0gY3JlYXRlTG9nKFwiSGVscGVyc1wiKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXQobXM6IG51bWJlciwgZm4/OiBhbnkpIHtcbiAgbG9nKGNoYWxrLmdyZWVuKFwiV2FpdFwiKSwgbXMpO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShmbiAmJiAoYXdhaXQgZm4oKSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSwgbXMpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlclRvU3RyaW5nKG51bTogbnVtYmVyLCBtYWpvcj86IG51bWJlciwgbWlub3I/OiBudW1iZXIpIHtcbiAgbGV0IHN0ciA9IG51bS50b1N0cmluZygpO1xuICBjb25zdCBzcGxpdCA9IHN0ci5zcGxpdChcIi5cIik7XG4gIGlmIChtYWpvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHNwbGl0WzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNwbGl0WzBdID0gXCIwXCI7XG4gICAgfVxuICAgIHdoaWxlIChzcGxpdFswXS5sZW5ndGggPCBtYWpvcikge1xuICAgICAgc3BsaXRbMF0gPSBcIjBcIiArIHNwbGl0WzBdO1xuICAgIH1cbiAgICBpZiAoc3BsaXRbMF0ubGVuZ3RoID4gbWFqb3IpIHtcbiAgICAgIGxvZyhjaGFsay5yZWQoXCJNYWpvciBsZW5ndGggZXhjZWVkZWRcIiksIFwiTnVtYmVyOlwiLCBudW0sIFwiU2VjdGlvbjpcIiwgc3BsaXRbMF0sIFwiTGVuZ3RoOlwiLCBzcGxpdFswXS5sZW5ndGgsIFwiVGFyZ2V0OlwiLCBtYWpvcik7XG4gICAgfVxuICAgIHN0ciA9IHNwbGl0LmpvaW4oXCIuXCIpO1xuICB9XG4gIGlmIChtaW5vciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHNwbGl0WzFdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNwbGl0WzFdID0gXCIwXCI7XG4gICAgfVxuICAgIHdoaWxlIChzcGxpdFsxXS5sZW5ndGggPCBtaW5vcikge1xuICAgICAgc3BsaXRbMV0gPSBzcGxpdFsxXSArIFwiMFwiO1xuICAgIH1cbiAgICBpZiAoc3BsaXRbMV0ubGVuZ3RoID4gbWlub3IpIHtcbiAgICAgIGxvZyhjaGFsay5yZWQoXCJNaW5vciBsZW5ndGggZXhjZWVkZWRcIiksIFwiTnVtYmVyOlwiLCBudW0sIFwiU2VjdGlvbjpcIiwgc3BsaXRbMV0sIFwiTGVuZ3RoOlwiLCBzcGxpdFsxXS5sZW5ndGgsIFwiVGFyZ2V0OlwiLCBtaW5vcik7XG4gICAgfVxuICAgIHN0ciA9IHNwbGl0LmpvaW4oXCIuXCIpO1xuICB9XG4gIHJldHVybiBzdHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuT2JqZWN0KGRhdGE6IG9iamVjdCkge1xuICBpZiAoIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIGxldCBzdWJEYXRhID0gey4uLmRhdGF9O1xuICBsZXQgbG9vcCA9IHRydWU7XG4gIHdoaWxlIChsb29wKSB7XG4gICAgbG9vcCA9IGZhbHNlO1xuICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhzdWJEYXRhKTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgIGNvbnN0IGtleSA9IGVudHJ5WzBdIGFzIGtleW9mIHR5cGVvZiBzdWJEYXRhO1xuICAgICAgY29uc3QgdmFsdWUgPSBlbnRyeVsxXTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIGRlbGV0ZSBzdWJEYXRhW2tleV07XG4gICAgICAgIGNvbnN0IHZhbHVlV2l0aEtleW5hbWVzOiBhbnkgPSB7fTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModmFsdWUpLmZvckVhY2goKHN1YkVudHJ5KSA9PiB7XG4gICAgICAgICAgdmFsdWVXaXRoS2V5bmFtZXNbYCR7a2V5fS4ke3N1YkVudHJ5WzBdfWBdID0gc3ViRW50cnlbMV07XG4gICAgICAgIH0pO1xuICAgICAgICBzdWJEYXRhID0gey4uLnN1YkRhdGEsIC4uLnZhbHVlV2l0aEtleW5hbWVzfTtcbiAgICAgICAgbG9vcCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWJEYXRhO1xufVxuIl19