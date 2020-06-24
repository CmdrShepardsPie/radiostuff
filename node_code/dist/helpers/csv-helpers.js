var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "csv-parse", "csv-stringify", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fillArrayObjects = exports.stringifyAsync = exports.parseAsync = void 0;
    const csv_parse_1 = __importDefault(require("csv-parse"));
    const csv_stringify_1 = __importDefault(require("csv-stringify"));
    const util_1 = require("util");
    exports.parseAsync = util_1.promisify(csv_parse_1.default);
    exports.stringifyAsync = util_1.promisify(csv_stringify_1.default);
    function fillArrayObjects(inArray) {
        const outArray = [...inArray];
        const keys = {};
        outArray.forEach((item) => {
            const entries = Object.entries(item);
            entries.forEach((entry) => {
                keys[entry[0]] = true;
            });
        });
        outArray.forEach((item, index) => {
            item = { ...item };
            outArray[index] = item;
            Object.keys(keys).forEach((key) => {
                item[key] = item[key];
            });
        });
        return outArray;
    }
    exports.fillArrayObjects = fillArrayObjects;
});
