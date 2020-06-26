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
    exports.getAllFilesInDirectory = exports.splitExtension = exports.readFromCsv = exports.readFromJson = exports.writeToCsv = exports.writeToJson = exports.dirExists = exports.makeDirs = exports.statAsync = exports.writeFileAsync = exports.readdirAsync = exports.readFileAsync = exports.mkdirAsync = exports.existsAsync = void 0;
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
        // log(chalk.green("Make Dirs"), filePath);
        let tempPath = `.`;
        for (const dir of filePath.split(/[/\\]/)) {
            if (/\w+\.\w+$/.test(dir)) {
                break;
            }
            tempPath = path_1.default.join(tempPath, dir);
            if (!(await exports.existsAsync(tempPath))) {
                // log(chalk.blue("make"), tempPath);
                try {
                    await exports.mkdirAsync(tempPath);
                }
                catch (e) {
                    // Just swallow the error, it's probably "EEXIST: file already exists" (TODO: Should check)
                    // log(chalk.red(e));
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
    async function writeToJson(filename, jsonData) {
        const jsonString = JSON.stringify(jsonData, null, 2);
        const jsonName = `${filename}.json`;
        await makeDirs(jsonName);
        await exports.writeFileAsync(jsonName, jsonString);
    }
    exports.writeToJson = writeToJson;
    async function writeToCsv(filename, csvData, header = true) {
        const csvPrep = Array.isArray(csvData) ? csv_helpers_1.fillArrayObjects(csvData.map((r) => helpers_1.flattenObject(r))) : [helpers_1.flattenObject(csvData)];
        const csvString = await csv_helpers_1.stringifyAsync(csvPrep, { header });
        const csvName = `${filename}.csv`;
        await makeDirs(csvName);
        await exports.writeFileAsync(csvName, csvString);
    }
    exports.writeToCsv = writeToCsv;
    async function readFromJson(filename) {
        const fileBuffer = await exports.readFileAsync(filename);
        const fileString = fileBuffer.toString();
        return JSON.parse(fileString);
    }
    exports.readFromJson = readFromJson;
    async function readFromCsv(filename, columns = true, cast = true) {
        const fileBuffer = await exports.readFileAsync(filename);
        const fileString = fileBuffer.toString();
        return csv_helpers_1.parseAsync(fileString, { columns, cast });
    }
    exports.readFromCsv = readFromCsv;
    function splitExtension(filename) {
        log(chalk_1.default.green('Split Extension'), filename);
        const filePath = filename.substring(0, filename.lastIndexOf(path_1.default.sep));
        const name = filename.substring(filename.lastIndexOf(path_1.default.sep) + 1, filename.lastIndexOf('.'));
        const ext = filename.substring(filename.lastIndexOf('.') + 1);
        return { path: filePath, name, ext };
    }
    exports.splitExtension = splitExtension;
    async function getAllFilesInDirectory(directory, extension = 'json', subdirectories = 0) {
        log(chalk_1.default.green('Get All Files from Directory'), directory);
        const files = [];
        const directories = [];
        const fileNames = await exports.readdirAsync(directory);
        const extMatch = new RegExp(`\.${extension}$`, 'i');
        await Promise.all(fileNames.map(async (fileName) => {
            const file = path_1.default.join(directory, fileName);
            const stat = await exports.statAsync(file);
            if (stat.isFile() && file.match(extMatch)) {
                files.push(file);
            }
            else if (stat.isDirectory() && subdirectories > 0) {
                directories.push(file);
            }
        }));
        await Promise.all(directories.map(async (subDirectory) => {
            files.push(...await getAllFilesInDirectory(subDirectory, extension, subdirectories - 1));
        }));
        return files;
    }
    exports.getAllFilesInDirectory = getAllFilesInDirectory;
});
