"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_helpers_1 = require("@helpers/log-helpers");
const chalk_1 = __importDefault(require("chalk"));
const { log, write } = log_helpers_1.createOut("Helpers");
function wait(ms, fn) {
    // log(chalk.green("Wait"), ms);
    // write(`(${Math.round(ms / 1000)})`);
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                resolve(fn && (await fn()));
            }
            catch (e) {
                reject(e);
            }
        }, ms);
    });
}
exports.wait = wait;
function numberToString(num, major, minor) {
    let str = num.toString();
    const split = str.split(".");
    if (major !== undefined) {
        if (split[0] === undefined) {
            split[0] = "0";
        }
        while (split[0].length < major) {
            split[0] = "0" + split[0];
        }
        if (split[0].length > major) {
            log(chalk_1.default.red("Major length exceeded"), "Number:", num, "Section:", split[0], "Length:", split[0].length, "Target:", major);
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
            log(chalk_1.default.red("Minor length exceeded"), "Number:", num, "Section:", split[1], "Length:", split[1].length, "Target:", minor);
        }
        str = split.join(".");
    }
    return str;
}
exports.numberToString = numberToString;
function flattenObject(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return data;
    }
    let subData = { ...data };
    let loop = true;
    while (loop) {
        loop = false;
        const entries = Object.entries(subData);
        for (const entry of entries) {
            const key = entry[0];
            const value = entry[1];
            if (typeof value === "object" && !Array.isArray(value)) {
                delete subData[key];
                const valueWithKeynames = {};
                Object.entries(value).forEach((subEntry) => {
                    valueWithKeynames[`${key}.${subEntry[0]}`] = subEntry[1];
                });
                subData = { ...subData, ...valueWithKeynames };
                loop = true;
            }
        }
    }
    return subData;
}
exports.flattenObject = flattenObject;
