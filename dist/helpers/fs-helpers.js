var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/csv-helpers", "@helpers/helpers", "@helpers/log-helpers", "chalk", "fs", "path", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const csv_helpers_1 = require("@helpers/csv-helpers");
    const helpers_1 = require("@helpers/helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const fs_1 = __importDefault(require("fs"));
    const path_1 = __importDefault(require("path"));
    const util_1 = require("util");
    const log = log_helpers_1.createLog('FS Helpers');
    exports.existsAsync = util_1.promisify(fs_1.default.exists);
    exports.mkdirAsync = util_1.promisify(fs_1.default.mkdir);
    exports.readFileAsync = util_1.promisify(fs_1.default.readFile);
    exports.readdirAsync = util_1.promisify(fs_1.default.readdir);
    exports.writeFileAsync = util_1.promisify(fs_1.default.writeFile);
    exports.statAsync = util_1.promisify(fs_1.default.stat);
    async function makeDirs(filePath) {
        log(chalk_1.default.green('Make Dirs'), filePath);
        let tempPath = `.`;
        for (const dir of filePath.split(/[/\\]/)) {
            if (/\./.test(dir)) {
                break;
            }
            tempPath = path_1.default.join(tempPath, dir);
            if (!(await exports.existsAsync(tempPath))) {
                // log(chalk.blue("make"), tempPath);
                try {
                    await exports.mkdirAsync(tempPath);
                }
                catch (e) {
                    log(chalk_1.default.red(e));
                }
            }
        }
    }
    exports.makeDirs = makeDirs;
    async function dirExists(filePath) {
        // log(chalk.green("Dir Exists"), filePath);
        let tempPath = `.`;
        let exists = true;
        for (const dir of filePath.split(/[/\\]/)) {
            tempPath = path_1.default.join(tempPath, dir);
            exists = await exports.existsAsync(tempPath);
            if (!exists) {
                break;
            }
        }
        return exists;
    }
    exports.dirExists = dirExists;
    async function writeToJsonAndCsv(filename, jsonData, csvData = jsonData, header = true) {
        // log(chalk.green("Write to Json and CSV"), filename);
        const jsonString = JSON.stringify(jsonData, null, 2);
        const jsonName = `${filename}.json`;
        await makeDirs(jsonName);
        await exports.writeFileAsync(jsonName, jsonString);
        const csvPrep = Array.isArray(csvData) ?
            csv_helpers_1.fillArrayObjects(csvData.map((r) => helpers_1.flattenObject(r))) :
            [helpers_1.flattenObject(csvData)];
        const csvString = await csv_helpers_1.stringifyAsync(csvPrep, { header });
        const csvName = `${filename}.csv`;
        await exports.writeFileAsync(csvName, csvString);
    }
    exports.writeToJsonAndCsv = writeToJsonAndCsv;
    function splitExtension(filename) {
        log(chalk_1.default.green('Split Extension'), filename);
        const name = filename.substring(0, filename.lastIndexOf('.'));
        const ext = filename.substring(filename.lastIndexOf('.') + 1);
        return { name, ext };
    }
    exports.splitExtension = splitExtension;
    async function getAllFilesFromDirectory(directory) {
        log(chalk_1.default.green('Get All Files from Directory'), directory);
        const files = [];
        const fileNames = await exports.readdirAsync(directory);
        const extMatch = /\.json$/i;
        for (const fileName of fileNames) {
            const file = path_1.default.join(directory, fileName);
            const stat = await exports.statAsync(file);
            if (stat.isFile() && file.match(extMatch)) {
                // log("Get All Files From Directory", chalk.green("reading"), file);
                const data = await exports.readFileAsync(file);
                files.push(JSON.parse(data.toString()));
            }
            else {
                // log("Get All Files From Directory", chalk.red("skipped"), file);
            }
        }
        return files;
    }
    exports.getAllFilesFromDirectory = getAllFilesFromDirectory;
});
//# sourceMappingURL=fs-helpers.js.map