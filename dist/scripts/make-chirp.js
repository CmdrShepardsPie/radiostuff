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
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/log-helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    require("module-alias/register");
    var fs_helpers_1 = require("@helpers/fs-helpers");
    var log_helpers_1 = require("@helpers/log-helpers");
    var log = log_helpers_1.createLog("Make Chirp");
    var chirp = {
        Location: "",
        Name: "",
        Frequency: "",
        Duplex: "",
        Offset: "",
        Tone: "",
        rToneFreq: "",
        cToneFreq: "",
        DtcsCode: "",
        DtcsRxCode: "",
        DtcsPolarity: "NN",
        Mode: "FM",
        TStep: 5,
        Comment: ""
    };
    function doIt(inFileName, outFileName) {
        return __awaiter(this, void 0, void 0, function () {
            var fileData, repeaters, mapped;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_helpers_1.readFileAsync(inFileName)];
                    case 1:
                        fileData = _a.sent();
                        repeaters = JSON.parse(fileData.toString());
                        mapped = repeaters
                            // .filter((r) => r.Call && r.Use === "OPEN" && r["Op Status"] !== "Off-Air")
                            .map(function (d, i) { return (__assign({}, makeRow(d), { Location: i })); });
                        return [4 /*yield*/, fs_helpers_1.writeToJsonAndCsv(outFileName, mapped)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function makeRow(item) {
        var DTCS = /D(\d+)/;
        // Doesn't account for multiple digital modes, uses the first one it finds
        var isDigital = Object.keys(item).filter(function (key) { return /Enabled/.test(key); }).map(function (name) { return (name.match(/(.*) Enabled/) || [])[1]; })[0];
        if (isDigital) {
            log("IS DIGITAL", isDigital);
            isDigital = isDigital.replace(" Digital", "");
            switch (isDigital) {
                case "D-STAR":
                    isDigital = "DV"; // Documented mapping
                    break;
                case "P25": // Literal mapping
                case "DMR": // Literal mapping
                    break;
                case "YSF":
                    isDigital = "DIG"; // Don't know if YSF = DIG mapping, but don't see any other candidates
                    break;
                case "NXDN":
                    isDigital = "FSK"; // NXDN uses FSK, so assuming mapping
                    break;
            }
            log("IS DIGITAL", isDigital);
        }
        var isNarrow = Object.entries(item).filter(function (a) { return /Narrow/i.test(a[1]); }).length > 0;
        var Name = 
        // item.Frequency
        //   .toString()
        ((item.Call || "")
            .toLocaleUpperCase()
            .trim()
            .substr(-3))
            + "" +
            ((item.Location || "")
                .toLocaleLowerCase()
                .trim())
                .replace(/\s+/g, "");
        var Frequency = item.Frequency;
        var Duplex = item.Offset > 0 ? "+" : item.Offset < 0 ? "-" : "";
        var Offset = Math.abs(item.Offset);
        var UplinkTone = item["Uplink Tone"] || item.Tone;
        var DownlinkTone = item["Downlink Tone"];
        var cToneFreq = "";
        var rToneFreq = "";
        var DtcsCode = "";
        var DtcsRxCode = "";
        var Tone = "";
        var Mode = isDigital ? isDigital : isNarrow ? "NFM" : "FM";
        var Comment = ((item["ST/PR"] || "") + " " + (item.County || "") + " " + (item.Location || "") + " " + (item.Call || "") + " " + (item.Sponsor || "") + " " + (item.Affiliate || "") + " " + item.Frequency + " " + (item.Use || "") + " " + (item["Op Status"] || "")).replace(/\s+/g, " ");
        if (typeof UplinkTone === "number") {
            rToneFreq = UplinkTone;
            cToneFreq = UplinkTone;
            Tone = "Tone";
        }
        else if (UplinkTone !== undefined) {
            var d = DTCS.exec(UplinkTone);
            if (d && d[1]) {
                var n = parseInt(d[1], 10);
                if (!isNaN(n)) {
                    DtcsCode = n;
                    DtcsRxCode = n;
                    Tone = "DTCS";
                }
            }
        }
        if (typeof DownlinkTone === "number") {
            cToneFreq = DownlinkTone;
            // Tone = "TSQL";
        }
        else if (DownlinkTone !== undefined) {
            var d = DTCS.exec(DownlinkTone);
            if (d && d[1]) {
                var n = parseInt(d[1], 10);
                if (!isNaN(n)) {
                    DtcsRxCode = n;
                    Tone = "DTCS";
                }
            }
        }
        if (rToneFreq !== cToneFreq) {
            // Tone = "Cross";
        }
        cToneFreq = cToneFreq || 88.5;
        rToneFreq = rToneFreq || 88.5;
        DtcsCode = DtcsCode || 23;
        DtcsRxCode = DtcsRxCode || 23;
        // log(chalk.green("Made Row"), row);
        return __assign({}, chirp, { 
            // Location,
            Name: Name,
            Frequency: Frequency,
            Duplex: Duplex,
            Offset: Offset,
            rToneFreq: rToneFreq,
            cToneFreq: cToneFreq,
            DtcsCode: DtcsCode,
            DtcsRxCode: DtcsRxCode,
            Tone: Tone,
            Mode: Mode,
            Comment: Comment });
    }
    function start() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // const coFiles = (await readdirAsync("./repeaters/data/CO/")).map((f) => `data/CO/${f}`);
                    // const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `data/UT/${f}`);
                    // const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `data/NM/${f}`);
                    // const coGroups = (await readdirAsync("./repeaters/groups/CO/")).map((f) => `groups/CO/${f}`);
                    // const utGroups = (await readdirAsync("./repeaters/groups/UT/")).map((f) => `groups/UT/${f}`);
                    // const nmGroups = (await readdirAsync("./repeaters/groups/NM/")).map((f) => `groups/NM/${f}`);
                    // const allFiles = [...coFiles, ...utFiles, ...nmFiles, ...coGroups, ...utGroups, ...nmGroups].filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
                    // for (const file of allFiles) {
                    //   await doIt(file);
                    // }
                    // await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
                    // await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
                    return [4 /*yield*/, doIt("data/repeaters/combined/CO.json", "data/repeaters/chirp/combined/CO")];
                    case 1:
                        // const coFiles = (await readdirAsync("./repeaters/data/CO/")).map((f) => `data/CO/${f}`);
                        // const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `data/UT/${f}`);
                        // const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `data/NM/${f}`);
                        // const coGroups = (await readdirAsync("./repeaters/groups/CO/")).map((f) => `groups/CO/${f}`);
                        // const utGroups = (await readdirAsync("./repeaters/groups/UT/")).map((f) => `groups/UT/${f}`);
                        // const nmGroups = (await readdirAsync("./repeaters/groups/NM/")).map((f) => `groups/NM/${f}`);
                        // const allFiles = [...coFiles, ...utFiles, ...nmFiles, ...coGroups, ...utGroups, ...nmGroups].filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
                        // for (const file of allFiles) {
                        //   await doIt(file);
                        // }
                        // await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
                        // await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
                        _a.sent();
                        return [4 /*yield*/, doIt("data/repeaters/groups/combined/CO - Call.json", "data/repeaters/chirp/groups/CO - Call")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports["default"] = start();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZS1jaGlycC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL21ha2UtY2hpcnAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsaUNBQStCO0lBRS9CLGtEQUFtRjtJQUNuRixvREFBK0M7SUFHL0MsSUFBTSxHQUFHLEdBQUcsdUJBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQW9CcEMsSUFBTSxLQUFLLEdBQUc7UUFDWixRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUksRUFBRSxFQUFFO1FBQ1IsU0FBUyxFQUFFLEVBQUU7UUFDYixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsSUFBSSxFQUFFLEVBQUU7UUFDUixTQUFTLEVBQUUsRUFBRTtRQUNiLFNBQVMsRUFBRSxFQUFFO1FBQ2IsUUFBUSxFQUFFLEVBQUU7UUFDWixVQUFVLEVBQUUsRUFBRTtRQUNkLFlBQVksRUFBRSxJQUFJO1FBQ2xCLElBQUksRUFBRSxJQUFJO1FBQ1YsS0FBSyxFQUFFLENBQUM7UUFDUixPQUFPLEVBQUUsRUFBRTtLQUNaLENBQUM7SUFFRixTQUFlLElBQUksQ0FBQyxVQUFrQixFQUFFLFdBQW1COzs7Ozs0QkFDeEMscUJBQU0sMEJBQWEsQ0FBQyxVQUFVLENBQUMsRUFBQTs7d0JBQTFDLFFBQVEsR0FBRyxTQUErQjt3QkFDMUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFnQixDQUFDO3dCQUUzRCxNQUFNLEdBQUcsU0FBUzs0QkFDeEIsNkVBQTZFOzZCQUMxRSxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsY0FBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUUsUUFBUSxFQUFFLENBQUMsSUFBRyxFQUFoQyxDQUFnQyxDQUFDLENB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SUFFRCxTQUFlLEtBQUs7Ozs7O29CQUNsQiwyRkFBMkY7b0JBQzNGLDJGQUEyRjtvQkFDM0YsMkZBQTJGO29CQUMzRixnR0FBZ0c7b0JBQ2hHLGdHQUFnRztvQkFDaEcsZ0dBQWdHO29CQUNoRyxvS0FBb0s7b0JBQ3BLLGlDQUFpQztvQkFDakMsc0JBQXNCO29CQUN0QixJQUFJO29CQUVKLGlJQUFpSTtvQkFDakksNkdBQTZHO29CQUM3RyxxQkFBTSxJQUFJLENBQUMsaUNBQWlDLEVBQUUsa0NBQWtDLENBQUMsRUFBQTs7d0JBYmpGLDJGQUEyRjt3QkFDM0YsMkZBQTJGO3dCQUMzRiwyRkFBMkY7d0JBQzNGLGdHQUFnRzt3QkFDaEcsZ0dBQWdHO3dCQUNoRyxnR0FBZ0c7d0JBQ2hHLG9LQUFvSzt3QkFDcEssaUNBQWlDO3dCQUNqQyxzQkFBc0I7d0JBQ3RCLElBQUk7d0JBRUosaUlBQWlJO3dCQUNqSSw2R0FBNkc7d0JBQzdHLFNBQWlGLENBQUM7d0JBQ2xGLHFCQUFNLElBQUksQ0FBQywrQ0FBK0MsRUFBRSx1Q0FBdUMsQ0FBQyxFQUFBOzt3QkFBcEcsU0FBb0csQ0FBQzs7Ozs7S0FDdEc7SUFFRCxxQkFBZSxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcIm1vZHVsZS1hbGlhcy9yZWdpc3RlclwiO1xuXG5pbXBvcnQge3JlYWRkaXJBc3luYywgcmVhZEZpbGVBc3luYywgd3JpdGVUb0pzb25BbmRDc3Z9IGZyb20gXCJAaGVscGVycy9mcy1oZWxwZXJzXCI7XG5pbXBvcnQge2NyZWF0ZUxvZ30gZnJvbSBcIkBoZWxwZXJzL2xvZy1oZWxwZXJzXCI7XG5pbXBvcnQge0lSZXBlYXRlcn0gZnJvbSBcIi4vbW9kdWxlcy9pLnJlcGVhdGVyXCI7XG5cbmNvbnN0IGxvZyA9IGNyZWF0ZUxvZyhcIk1ha2UgQ2hpcnBcIik7XG5cbmludGVyZmFjZSBJQ2hpcnAge1xuICBMb2NhdGlvbjogbnVtYmVyO1xuICBOYW1lOiBzdHJpbmc7XG4gIEZyZXF1ZW5jeTogbnVtYmVyO1xuICBEdXBsZXg6IHN0cmluZztcbiAgT2Zmc2V0OiBudW1iZXI7XG4gIFRvbmU6IHN0cmluZztcbiAgclRvbmVGcmVxOiBudW1iZXI7XG4gIGNUb25lRnJlcTogbnVtYmVyO1xuICBEdGNzQ29kZTogbnVtYmVyO1xuICBEdGNzUnhDb2RlOiBudW1iZXI7XG4gIER0Y3NQb2xhcml0eTogc3RyaW5nO1xuICBNb2RlOiBzdHJpbmc7XG4gIFRTdGVwOiBudW1iZXI7XG4gIENvbW1lbnQ6IHN0cmluZztcbiAgW2luZGV4OiBzdHJpbmddOiBhbnk7XG59XG5cbmNvbnN0IGNoaXJwID0ge1xuICBMb2NhdGlvbjogXCJcIixcbiAgTmFtZTogXCJcIixcbiAgRnJlcXVlbmN5OiBcIlwiLFxuICBEdXBsZXg6IFwiXCIsXG4gIE9mZnNldDogXCJcIixcbiAgVG9uZTogXCJcIixcbiAgclRvbmVGcmVxOiBcIlwiLFxuICBjVG9uZUZyZXE6IFwiXCIsXG4gIER0Y3NDb2RlOiBcIlwiLFxuICBEdGNzUnhDb2RlOiBcIlwiLFxuICBEdGNzUG9sYXJpdHk6IFwiTk5cIixcbiAgTW9kZTogXCJGTVwiLFxuICBUU3RlcDogNSxcbiAgQ29tbWVudDogXCJcIixcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGRvSXQoaW5GaWxlTmFtZTogc3RyaW5nLCBvdXRGaWxlTmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IGZpbGVEYXRhID0gYXdhaXQgcmVhZEZpbGVBc3luYyhpbkZpbGVOYW1lKTtcbiAgY29uc3QgcmVwZWF0ZXJzID0gSlNPTi5wYXJzZShmaWxlRGF0YS50b1N0cmluZygpKSBhcyBJUmVwZWF0ZXJbXTtcblxuICBjb25zdCBtYXBwZWQgPSByZXBlYXRlcnNcbiAgLy8gLmZpbHRlcigocikgPT4gci5DYWxsICYmIHIuVXNlID09PSBcIk9QRU5cIiAmJiByW1wiT3AgU3RhdHVzXCJdICE9PSBcIk9mZi1BaXJcIilcbiAgICAubWFwKChkLCBpKSA9PiAoeyAuLi5tYWtlUm93KGQpLCBMb2NhdGlvbjogaSB9KSk7XG5cbiAgcmV0dXJuIGF3YWl0IHdyaXRlVG9Kc29uQW5kQ3N2KG91dEZpbGVOYW1lLCBtYXBwZWQpO1xufVxuXG5mdW5jdGlvbiBtYWtlUm93KGl0ZW06IElSZXBlYXRlcikge1xuICBjb25zdCBEVENTID0gL0QoXFxkKykvO1xuXG4gIC8vIERvZXNuJ3QgYWNjb3VudCBmb3IgbXVsdGlwbGUgZGlnaXRhbCBtb2RlcywgdXNlcyB0aGUgZmlyc3Qgb25lIGl0IGZpbmRzXG4gIGxldCBpc0RpZ2l0YWwgPSBPYmplY3Qua2V5cyhpdGVtKS5maWx0ZXIoKGtleSkgPT4gL0VuYWJsZWQvLnRlc3Qoa2V5KSkubWFwKChuYW1lKSA9PiAobmFtZS5tYXRjaCgvKC4qKSBFbmFibGVkLykgfHwgW10pWzFdKVswXTtcbiAgaWYgKGlzRGlnaXRhbCkge1xuICAgIGxvZyhcIklTIERJR0lUQUxcIiwgaXNEaWdpdGFsKTtcbiAgICBpc0RpZ2l0YWwgPSBpc0RpZ2l0YWwucmVwbGFjZShcIiBEaWdpdGFsXCIsIFwiXCIpO1xuICAgIHN3aXRjaCAoaXNEaWdpdGFsKSB7XG4gICAgICBjYXNlIFwiRC1TVEFSXCI6XG4gICAgICAgIGlzRGlnaXRhbCA9IFwiRFZcIjsgLy8gRG9jdW1lbnRlZCBtYXBwaW5nXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIlAyNVwiOiAvLyBMaXRlcmFsIG1hcHBpbmdcbiAgICAgIGNhc2UgXCJETVJcIjogLy8gTGl0ZXJhbCBtYXBwaW5nXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIllTRlwiOlxuICAgICAgICBpc0RpZ2l0YWwgPSBcIkRJR1wiOyAvLyBEb24ndCBrbm93IGlmIFlTRiA9IERJRyBtYXBwaW5nLCBidXQgZG9uJ3Qgc2VlIGFueSBvdGhlciBjYW5kaWRhdGVzXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIk5YRE5cIjpcbiAgICAgICAgaXNEaWdpdGFsID0gXCJGU0tcIjsgLy8gTlhETiB1c2VzIEZTSywgc28gYXNzdW1pbmcgbWFwcGluZ1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgbG9nKFwiSVMgRElHSVRBTFwiLCBpc0RpZ2l0YWwpO1xuICB9XG4gIGNvbnN0IGlzTmFycm93ID0gT2JqZWN0LmVudHJpZXMoaXRlbSkuZmlsdGVyKChhKSA9PiAvTmFycm93L2kudGVzdChhWzFdIGFzIHN0cmluZykpLmxlbmd0aCA+IDA7XG5cbiAgY29uc3QgTmFtZSA9XG4gICAgLy8gaXRlbS5GcmVxdWVuY3lcbiAgICAvLyAgIC50b1N0cmluZygpXG4gICAgKFxuICAgICAgKGl0ZW0uQ2FsbCB8fCBcIlwiKVxuICAgICAgICAudG9Mb2NhbGVVcHBlckNhc2UoKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5zdWJzdHIoLTMpXG4gICAgKVxuICAgICsgXCJcIiArXG4gICAgKFxuICAgICAgKGl0ZW0uTG9jYXRpb24gfHwgXCJcIilcbiAgICAgICAgLnRvTG9jYWxlTG93ZXJDYXNlKClcbiAgICAgICAgLnRyaW0oKVxuICAgIClcbiAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpO1xuXG4gIGNvbnN0IEZyZXF1ZW5jeSA9IGl0ZW0uRnJlcXVlbmN5O1xuICBjb25zdCBEdXBsZXggPSBpdGVtLk9mZnNldCA+IDAgPyBcIitcIiA6IGl0ZW0uT2Zmc2V0IDwgMCA/IFwiLVwiIDogXCJcIjtcbiAgY29uc3QgT2Zmc2V0ID0gTWF0aC5hYnMoaXRlbS5PZmZzZXQpO1xuICBjb25zdCBVcGxpbmtUb25lID0gaXRlbVtcIlVwbGluayBUb25lXCJdIHx8IGl0ZW0uVG9uZTtcbiAgY29uc3QgRG93bmxpbmtUb25lID0gaXRlbVtcIkRvd25saW5rIFRvbmVcIl07XG4gIGxldCBjVG9uZUZyZXE6IGFueSA9IFwiXCI7XG4gIGxldCByVG9uZUZyZXE6IGFueSA9IFwiXCI7XG4gIGxldCBEdGNzQ29kZTogYW55ID0gXCJcIjtcbiAgbGV0IER0Y3NSeENvZGU6IGFueSA9IFwiXCI7XG4gIGxldCBUb25lID0gXCJcIjtcbiAgY29uc3QgTW9kZSA9IGlzRGlnaXRhbCA/IGlzRGlnaXRhbCA6IGlzTmFycm93ID8gXCJORk1cIiA6IFwiRk1cIjtcbiAgY29uc3QgQ29tbWVudCA9IGAke2l0ZW1bXCJTVC9QUlwiXSB8fCBcIlwifSAke2l0ZW0uQ291bnR5IHx8IFwiXCJ9ICR7aXRlbS5Mb2NhdGlvbiB8fCBcIlwifSAke2l0ZW0uQ2FsbCB8fCBcIlwifSAke2l0ZW0uU3BvbnNvciB8fCBcIlwifSAke2l0ZW0uQWZmaWxpYXRlIHx8IFwiXCJ9ICR7aXRlbS5GcmVxdWVuY3l9ICR7aXRlbS5Vc2UgfHwgXCJcIn0gJHtpdGVtW1wiT3AgU3RhdHVzXCJdIHx8IFwiXCJ9YC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcblxuICBpZiAodHlwZW9mIFVwbGlua1RvbmUgPT09IFwibnVtYmVyXCIpIHtcbiAgICByVG9uZUZyZXEgPSBVcGxpbmtUb25lO1xuICAgIGNUb25lRnJlcSA9IFVwbGlua1RvbmU7XG4gICAgVG9uZSA9IFwiVG9uZVwiO1xuICB9IGVsc2UgaWYgKFVwbGlua1RvbmUgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGQgPSBEVENTLmV4ZWMoVXBsaW5rVG9uZSk7XG4gICAgaWYgKGQgJiYgZFsxXSkge1xuICAgICAgY29uc3QgbiA9IHBhcnNlSW50KGRbMV0sIDEwKTtcbiAgICAgIGlmICghaXNOYU4obikpIHtcbiAgICAgICAgRHRjc0NvZGUgPSBuO1xuICAgICAgICBEdGNzUnhDb2RlID0gbjtcbiAgICAgICAgVG9uZSA9IFwiRFRDU1wiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgRG93bmxpbmtUb25lID09PSBcIm51bWJlclwiKSB7XG4gICAgY1RvbmVGcmVxID0gRG93bmxpbmtUb25lO1xuICAgIC8vIFRvbmUgPSBcIlRTUUxcIjtcbiAgfSBlbHNlIGlmIChEb3dubGlua1RvbmUgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGQgPSBEVENTLmV4ZWMoRG93bmxpbmtUb25lKTtcbiAgICBpZiAoZCAmJiBkWzFdKSB7XG4gICAgICBjb25zdCBuID0gcGFyc2VJbnQoZFsxXSwgMTApO1xuICAgICAgaWYgKCFpc05hTihuKSkge1xuICAgICAgICBEdGNzUnhDb2RlID0gbjtcbiAgICAgICAgVG9uZSA9IFwiRFRDU1wiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChyVG9uZUZyZXEgIT09IGNUb25lRnJlcSkge1xuICAgIC8vIFRvbmUgPSBcIkNyb3NzXCI7XG4gIH1cblxuICBjVG9uZUZyZXEgPSBjVG9uZUZyZXEgfHwgODguNTtcbiAgclRvbmVGcmVxID0gclRvbmVGcmVxIHx8IDg4LjU7XG4gIER0Y3NDb2RlID0gRHRjc0NvZGUgfHwgMjM7XG4gIER0Y3NSeENvZGUgPSBEdGNzUnhDb2RlIHx8IDIzO1xuXG4gIC8vIGxvZyhjaGFsay5ncmVlbihcIk1hZGUgUm93XCIpLCByb3cpO1xuICByZXR1cm4ge1xuICAgIC4uLmNoaXJwIGFzIGFueSxcbiAgICAvLyBMb2NhdGlvbixcbiAgICBOYW1lLFxuICAgIEZyZXF1ZW5jeSxcbiAgICBEdXBsZXgsXG4gICAgT2Zmc2V0LFxuICAgIHJUb25lRnJlcSxcbiAgICBjVG9uZUZyZXEsXG4gICAgRHRjc0NvZGUsXG4gICAgRHRjc1J4Q29kZSxcbiAgICBUb25lLFxuICAgIE1vZGUsXG4gICAgQ29tbWVudCxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3RhcnQoKSB7XG4gIC8vIGNvbnN0IGNvRmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiLi9yZXBlYXRlcnMvZGF0YS9DTy9cIikpLm1hcCgoZikgPT4gYGRhdGEvQ08vJHtmfWApO1xuICAvLyBjb25zdCB1dEZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2RhdGEvVVQvXCIpKS5tYXAoKGYpID0+IGBkYXRhL1VULyR7Zn1gKTtcbiAgLy8gY29uc3Qgbm1GaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL05NL1wiKSkubWFwKChmKSA9PiBgZGF0YS9OTS8ke2Z9YCk7XG4gIC8vIGNvbnN0IGNvR3JvdXBzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2dyb3Vwcy9DTy9cIikpLm1hcCgoZikgPT4gYGdyb3Vwcy9DTy8ke2Z9YCk7XG4gIC8vIGNvbnN0IHV0R3JvdXBzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2dyb3Vwcy9VVC9cIikpLm1hcCgoZikgPT4gYGdyb3Vwcy9VVC8ke2Z9YCk7XG4gIC8vIGNvbnN0IG5tR3JvdXBzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2dyb3Vwcy9OTS9cIikpLm1hcCgoZikgPT4gYGdyb3Vwcy9OTS8ke2Z9YCk7XG4gIC8vIGNvbnN0IGFsbEZpbGVzID0gWy4uLmNvRmlsZXMsIC4uLnV0RmlsZXMsIC4uLm5tRmlsZXMsIC4uLmNvR3JvdXBzLCAuLi51dEdyb3VwcywgLi4ubm1Hcm91cHNdLmZpbHRlcigoZikgPT4gL1xcLmpzb24kLy50ZXN0KGYpKS5tYXAoKGYpID0+IGYucmVwbGFjZShcIi5qc29uXCIsIFwiXCIpKTtcbiAgLy8gZm9yIChjb25zdCBmaWxlIG9mIGFsbEZpbGVzKSB7XG4gIC8vICAgYXdhaXQgZG9JdChmaWxlKTtcbiAgLy8gfVxuXG4gIC8vIGF3YWl0IGRvSXQoXCJkYXRhL3JlcGVhdGVycy9ncm91cHMvQ08vQ29sb3JhZG8gU3ByaW5ncyAtIENhbGwuanNvblwiLCBcImRhdGEvcmVwZWF0ZXJzL2NoaXJwL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbFwiKTtcbiAgLy8gYXdhaXQgZG9JdChcImRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvQ08vQ29sb3JhZG8gU3ByaW5ncy5qc29uXCIsIFwiZGF0YS9yZXBlYXRlcnMvY2hpcnAvQ08vQ29sb3JhZG8gU3ByaW5nc1wiKTtcbiAgYXdhaXQgZG9JdChcImRhdGEvcmVwZWF0ZXJzL2NvbWJpbmVkL0NPLmpzb25cIiwgXCJkYXRhL3JlcGVhdGVycy9jaGlycC9jb21iaW5lZC9DT1wiKTtcbiAgYXdhaXQgZG9JdChcImRhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9jb21iaW5lZC9DTyAtIENhbGwuanNvblwiLCBcImRhdGEvcmVwZWF0ZXJzL2NoaXJwL2dyb3Vwcy9DTyAtIENhbGxcIik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YXJ0KCk7XG4iXX0=