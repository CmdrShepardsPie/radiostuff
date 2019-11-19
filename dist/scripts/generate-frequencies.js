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
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const log = log_helpers_1.createLog('Generate Frequencies');
    let frequencies = [];
    const range2m = [
        // Channels
        { start: 146.4, end: 146.595, steps: [0.015], name: `FM Voice` },
        { start: 147.42, end: 147.585, steps: [0.015], name: `FM Voice` },
        // Range
        { start: 144.9, end: 145.1, steps: [0.015], name: `Weak Signal, FM, Digital/Packet` },
        { start: 145.5, end: 145.8, steps: [0.015], name: `Miscellaneous and Experimental Modes` },
    ];
    const range125m = [
        // Channels
        { start: 223.4, end: 223.52, steps: [0.020], name: `FM Voice` },
        { start: 222.16, end: 222.24, steps: [0.020], name: `Mixed Mode` },
        { start: 223.72, end: 223.84, steps: [0.020], name: `Mixed Mode` },
        // Range
        { start: 223.53, end: 223.63, steps: [0.020], name: `Digital/Packet` },
    ];
    const range70cm = [
        // Channels
        { start: 440.7, end: 441.3, steps: [0.025], name: `Mixed Mode` },
        { start: 445.7, end: 446.275, steps: [0.025], name: `FM Voice` },
        { start: 446.2, end: 446.3, steps: [0.0125], name: `Digital Voice Narrowband` },
        // Range
        { start: 434.5, end: 435, steps: [0.025], name: `Mixed Mode Digital and Voice` },
        { start: 439.5, end: 440, steps: [0.025], name: `Mixed Mode Digital and Voice` },
    ];
    [...range2m, ...range125m, ...range70cm].forEach((range) => {
        range.steps.forEach((step) => {
            for (let i = range.start; i <= range.end; i += step) {
                i = Math.round(i * 100000) / 100000;
                if (!frequencies.find((f) => f.Frequency === i)) {
                    frequencies.push({ Frequency: i, Name: range.name });
                }
            }
        });
    });
    frequencies = frequencies.sort((a, b) => (a.Frequency || 0) - (b.Frequency || 0));
    log(frequencies, frequencies.length);
    fs_helpers_1.writeFileAsync(`./data/frequencies.json`, JSON.stringify(frequencies, null, 2))
        .then((r) => log(`Done`, r));
});
//# sourceMappingURL=generate-frequencies.js.map