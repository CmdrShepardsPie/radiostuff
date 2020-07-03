var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.weekMS = exports.dayMS = exports.hourMS = exports.minuteMS = exports.secondMS = exports.checkCoordinates = exports.splitCoordinates = exports.flattenObject = exports.numberToString = exports.wait = void 0;
    const log_helpers_1 = require("@helpers/log-helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const { log } = log_helpers_1.createOut('Helpers');
    function wait(ms, fn) {
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
        const split = str.split('.');
        if (major !== undefined) {
            if (split[0] === undefined) {
                split[0] = '0';
            }
            while (split[0].length < major) {
                split[0] = '0' + split[0];
            }
            if (split[0].length > major) {
                log(chalk_1.default.red('Major length exceeded'), 'Number:', num, 'Section:', split[0], 'Length:', split[0].length, 'Target:', major);
            }
            str = split.join('.');
        }
        if (minor !== undefined) {
            if (split[1] === undefined) {
                split[1] = '0';
            }
            while (split[1].length < minor) {
                split[1] = split[1] + '0';
            }
            if (split[1].length > minor) {
                log(chalk_1.default.red('Minor length exceeded'), 'Number:', num, 'Section:', split[1], 'Length:', split[1].length, 'Target:', minor);
            }
            str = split.join('.');
        }
        return str;
    }
    exports.numberToString = numberToString;
    function flattenObject(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
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
                if (typeof value === 'object' && !Array.isArray(value)) {
                    delete subData[key];
                    const valueWithKeyNames = {};
                    Object.entries(value).forEach((subEntry) => {
                        valueWithKeyNames[`${key}.${subEntry[0]}`] = subEntry[1];
                    });
                    subData = { ...subData, ...valueWithKeyNames };
                    loop = true;
                }
            }
        }
        return subData;
    }
    exports.flattenObject = flattenObject;
    function splitCoordinates(input) {
        return input.split(',').map((l) => parseFloat(l));
    }
    exports.splitCoordinates = splitCoordinates;
    function checkCoordinates(point) {
        return point.length === 2 && !isNaN(point[0]) && !isNaN(point[1]);
    }
    exports.checkCoordinates = checkCoordinates;
    exports.secondMS = 1000;
    exports.minuteMS = exports.secondMS * 60;
    exports.hourMS = exports.minuteMS * 60;
    exports.dayMS = exports.hourMS * 24;
    exports.weekMS = exports.dayMS * 7;
});
