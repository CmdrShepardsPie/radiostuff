var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "gps-distance"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const helpers_1 = require("@helpers/helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const gps_distance_1 = __importDefault(require("gps-distance"));
    const log = log_helpers_1.createLog('Combine');
    exports.default = (async () => {
        const myPoint = [39.627071500, -104.893322500]; // 4982 S Ulster St
        const combined = [];
        const files = await fs_helpers_1.getAllFilesFromDirectory('data/repeaters/results/CO');
        log('Got', files.length, 'files');
        const found = {};
        files.forEach((file) => {
            log('Got', file.length, 'repeaters');
            file.forEach((item) => {
                if (!found[`${item.state_id}-${item.ID}`]) {
                    found[`${item.state_id}-${item.ID}`] = true;
                    combined.push(item);
                    if (typeof item.Latitude === 'number' && typeof item.Longitude === 'number') {
                        const distance = gps_distance_1.default([myPoint, [item.Latitude, item.Longitude]]);
                        item.Mi = distance * 0.62137119;
                    }
                }
            });
        });
        log('Got', combined.length, 'unique repeaters');
        combined.sort((a, b) => {
            const aMi = helpers_1.numberToString(a.Mi || 0, 4, 24);
            const bMi = helpers_1.numberToString(b.Mi || 0, 4, 24);
            const aRepeaterName = a.Call;
            const bRepeaterName = b.Call;
            const aFrequency = helpers_1.numberToString(a.Frequency || 0, 4, 5);
            const bFrequency = helpers_1.numberToString(b.Frequency || 0, 4, 5);
            const aStr = `${aMi} ${aRepeaterName} ${aFrequency}`;
            const bStr = `${bMi} ${bRepeaterName} ${bFrequency}`;
            return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
        });
        const stats = combined.reduce((result, data) => {
            const freq = Math.round(data.Frequency || 0).toString();
            const pow = Math.pow(10, Math.max(freq.length - 2, 0)) * 2;
            const group = Math.round((data.Frequency || 0) / pow) * pow;
            // console.log(freq, pow, group);
            const count = result[group] || 0;
            return { ...result, [group]: count + 1 };
        }, {});
        // tslint:disable-next-line:no-console
        console.log('STATS', stats);
        // combined.slice(0, 100).forEach((c) => log(c.Call, "\t", c.Latitude, "\t", c.Longitude, "\t", c.Mi));
        await fs_helpers_1.writeToJsonAndCsv('data/repeaters/combined/CO', combined);
    })();
});
//# sourceMappingURL=combine.js.map