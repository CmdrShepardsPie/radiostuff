"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _csv = require("csv");
const util_1 = require("util");
exports.parseAsync = util_1.promisify(_csv.parse);
exports.stringifyAsync = util_1.promisify(_csv.stringify);
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
            // @ts-ignore
            item[key] = item[key];
        });
    });
    return outArray;
}
exports.fillArrayObjects = fillArrayObjects;
