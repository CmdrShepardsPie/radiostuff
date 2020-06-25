var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/fs-helpers", "chalk", "@helpers/log-helpers", "@helpers/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCache = exports.getCache = void 0;
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const log_helpers_1 = require("@helpers/log-helpers");
    const helpers_1 = require("@helpers/helpers");
    const { log, write } = log_helpers_1.createOut('Cache Helper');
    const cacheStart = Date.now();
    const cacheLogFileName = `../data/repeaters/_cache/cache-log.json`;
    const cacheLog = {};
    const maxCacheAgeMS = helpers_1.weekMS * 4;
    let cacheLoaded = false;
    async function getCache(key) {
        const keyAge = await readCacheLog(key);
        const file = `../data/repeaters/_cache/${key}`;
        if (await fs_helpers_1.dirExists(file)) {
            const cageAgeMS = (cacheStart - keyAge);
            if (cageAgeMS >= maxCacheAgeMS) {
                write(`O=${chalk_1.default.blue(Math.round(cageAgeMS / helpers_1.dayMS))}`);
                return;
            }
            return (await fs_helpers_1.readFileAsync(file)).toString();
        }
    }
    exports.getCache = getCache;
    async function setCache(key, value) {
        const file = `../data/repeaters/_cache/${key}`;
        await fs_helpers_1.makeDirs(file);
        await fs_helpers_1.writeFileAsync(file, value);
        await writeCacheLog(key);
    }
    exports.setCache = setCache;
    async function readCacheLog(key) {
        if (!cacheLoaded && await fs_helpers_1.dirExists(cacheLogFileName)) {
            Object.assign(cacheLog, JSON.parse((await fs_helpers_1.readFileAsync(cacheLogFileName)).toString()));
            cacheLoaded = true;
        }
        if (key && cacheLog[key]) {
            return new Date(cacheLog[key]).valueOf();
        }
        return new Date(0).valueOf();
    }
    async function writeCacheLog(key) {
        await readCacheLog();
        cacheLog[key] = new Date().toISOString();
        await fs_helpers_1.makeDirs(cacheLogFileName);
        await fs_helpers_1.writeFileAsync(cacheLogFileName, JSON.stringify(cacheLog, null, 2));
    }
});
