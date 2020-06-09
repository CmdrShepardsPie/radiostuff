"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_helpers_1 = require("@helpers/fs-helpers");
const helpers_1 = require("@helpers/helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const chalk_1 = __importDefault(require("chalk"));
const log = log_helpers_1.createLog('Group By');
async function doIt(groupBy, inFileName, outFileName) {
    const fileData = await fs_helpers_1.readFileAsync(inFileName); // await getAllFilesFromDirectory("./repeaters/data/CO/", ".json") as IRepeater[];
    const repeaters = JSON.parse(fileData.toString());
    // Only grouping by the keys in the first row. It"s not comprehensive but contains the essentials.
    // const keys = Object.keys(repeaters[0]) as Array<keyof IRepeater>;
    // for (const key of keys) {
    log(chalk_1.default.green('Process'), chalk_1.default.blue('Group'), groupBy, chalk_1.default.yellow('In'), inFileName, chalk_1.default.cyan('Out'), outFileName);
    const grouped = group(groupBy, repeaters);
    await fs_helpers_1.writeToJsonAndCsv(outFileName, grouped);
    // }
}
function group(groupBy, repeaters) {
    const keyedGroups = {};
    repeaters.forEach((repeater) => {
        const keyVal = repeater[groupBy];
        if (keyVal !== undefined && keyVal !== null && keyVal !== '') {
            if (!keyedGroups[keyVal]) {
                keyedGroups[keyVal] = [];
            }
            keyedGroups[keyVal].push(repeater);
        }
    });
    const sorting = Object.entries(keyedGroups);
    sorting.sort((a, b) => {
        const aMi = helpers_1.numberToString(a[1][0].Mi || 0, 5, 24);
        const bMi = helpers_1.numberToString(b[1][0].Mi || 0, 5, 24);
        const aNumRepeaters = helpers_1.numberToString(100 - a[1].length, 4, 1);
        const bNumRepeaters = helpers_1.numberToString(100 - b[1].length, 4, 1);
        const aGroupName = a[0];
        const bGroupName = b[0];
        const aFrequency = helpers_1.numberToString(a[1][0].Frequency || 0, 4, 5);
        const bFrequency = helpers_1.numberToString(b[1][0].Frequency || 0, 4, 5);
        // Sort by distance, then number of repeaters in group, then group name
        const aStr = `${aMi} ${aNumRepeaters} ${aGroupName} ${aFrequency}`;
        const bStr = `${bMi} ${bNumRepeaters} ${bGroupName} ${bFrequency}`;
        // Sort by number of repeaters in group, then distance, then group name
        // const aStr = `${aNumRepeaters} ${aMi} ${aGroupName} ${aFrequency}`;
        // const bStr = `${bNumRepeaters} ${bMi} ${bGroupName} ${bFrequency}`;
        return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
    });
    return sorting.reduce((prev, curr) => [...prev, ...curr[1]], []);
}
async function start() {
    // await doIt("Call", "repeaters/data/CO/Colorado Springs.json", "repeaters/groups/CO/Colorado Springs - Call");
    // await doIt("Call", "repeaters/data/CO/Colorado Springs.json", "repeaters/groups/CO/Colorado Springs - Call");
    // const coFiles = (await readdirAsync("data/repeaters/results/CO/")).map((f) => `CO/${f}`);
    // const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `UT/${f}`);
    // const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `NM/${f}`);
    // const allFiles = /* [...coFiles, ...utFiles, ...nmFiles] */ coFiles.filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
    // for (const file of allFiles) {
    //   await doIt("Call", `repeaters/data/${file}.json`, `repeaters/groups/${file} - Call`);
    // }
    // await doIt("Colorado Springs");
    // await doIt("Denver");
    // await doIt("Grand Junction");
    // await doIt("Call",
    //   `../data/repeaters/results/CO/Colorado Springs.json`,
    //   `../data/repeaters/groups/CO/Colorado Springs - Call`);
    await doIt('Call', `../data/repeaters/combined/CO.json`, `../data/repeaters/groups/combined/CO - Call`);
}
exports.default = start();
