(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/fs-helpers", "@helpers/log-helpers", "@helpers/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deleteCache = exports.setCache = exports.getCache = void 0;
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const helpers_1 = require("@helpers/helpers");
    const { log, write } = log_helpers_1.createOut('Cache Helper');
    const cacheStart = Date.now();
    const cacheLogFileName = `../data/repeaters/_cache/cache-log.json`;
    const cacheLog = {};
    const maxCacheAgeMS = helpers_1.weekMS * 4;
    let cacheLoaded = false;
    async function getCache(key, ignoreAge = false) {
        const keyAge = await readCacheLog(key);
        const file = `../data/repeaters/_cache/${key}`;
        if (await fs_helpers_1.dirExists(file)) {
            const cageAgeMS = (cacheStart - keyAge);
            if (!ignoreAge && cageAgeMS >= maxCacheAgeMS) {
                // write(`O=${chalk.blue(Math.round(cageAgeMS / dayMS))}`);
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
    async function deleteCache(key) {
        const file = `../data/repeaters/_cache/${key}`;
        if (await fs_helpers_1.dirExists(file)) {
            await fs_helpers_1.rmAsync(file);
        }
        await writeCacheLog(key, true);
    }
    exports.deleteCache = deleteCache;
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
    async function writeCacheLog(key, clear = false) {
        await readCacheLog();
        if (!clear) {
            cacheLog[key] = new Date().toISOString();
        }
        else {
            delete cacheLog[key];
        }
        await fs_helpers_1.makeDirs(cacheLogFileName);
        await fs_helpers_1.writeFileAsync(cacheLogFileName, JSON.stringify(cacheLog, null, 2));
    }
});
