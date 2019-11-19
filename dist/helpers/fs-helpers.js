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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2ZzLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxzREFBd0U7SUFDeEUsOENBQWlEO0lBQ2pELHNEQUFpRDtJQUNqRCxrREFBMEI7SUFDMUIsNENBQStCO0lBQy9CLGdEQUF3QjtJQUN4QiwrQkFBaUM7SUFFakMsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFaEQsUUFBQSxXQUFXLEdBQXVDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZFLFFBQUEsVUFBVSxHQUFvQyxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRSxRQUFBLGFBQWEsR0FBK0MsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkYsUUFBQSxZQUFZLEdBQXdDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFFLFFBQUEsY0FBYyxHQUF3RCxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5RixRQUFBLFNBQVMsR0FBcUMsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdkUsS0FBSyxVQUFVLFFBQVEsQ0FBQyxRQUFnQjtRQUM3QyxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV4QyxJQUFJLFFBQVEsR0FBVyxHQUFHLENBQUM7UUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbEIsTUFBTTthQUNQO1lBQ0QsUUFBUSxHQUFHLGNBQUksQ0FBQyxJ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TSxTQUFTLEdBQWEsTUFBTSxvQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQztRQUNwQyxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUNoQyxNQUFNLElBQUksR0FBVyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxNQUFNLElBQUksR0FBVSxNQUFNLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDekMscUVBQXFFO2dCQUNyRSxNQUFNLElBQUksR0FBVyxNQUFNLHFCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNMLG1FQUFtRTthQUNwRTtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBbEJELDREQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpbGxBcnJheU9iamVjdHMsIHN0cmluZ2lmeUFzeW5jIH0gZnJvbSAnQGhlbHBlcnMvY3N2LWhlbHBlcnMnO1xuaW1wb3J0IHsgZmxhdHRlbk9iamVjdCB9IGZyb20gJ0BoZWxwZXJzL2hlbHBlcnMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBmcywgeyBTdGF0cyB9IGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCc7XG5cbmNvbnN0IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQgPSBjcmVhdGVMb2coJ0ZTIEhlbHBlcnMnKTtcblxuZXhwb3J0IGNvbnN0IGV4aXN0c0FzeW5jOiAocGF0aDogc3RyaW5nKSA9PiBQcm9taXNlPGJvb2xlYW4+ID0gcHJvbWlzaWZ5KGZzLmV4aXN0cyk7XG5leHBvcnQgY29uc3QgbWtkaXJBc3luYzogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPiA9IHByb21pc2lmeShmcy5ta2Rpcik7XG5leHBvcnQgY29uc3QgcmVhZEZpbGVBc3luYzogKHBhdGg6IHN0cmluZyB8IG51bWJlcikgPT4gUHJvbWlzZTxCdWZmZXI+ID0gcHJvbWlzaWZ5KGZzLnJlYWRGaWxlKTtcbmV4cG9ydCBjb25zdCByZWFkZGlyQXN5bmM6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nW10+ID0gcHJvbWlzaWZ5KGZzLnJlYWRkaXIpO1xuZXhwb3J0IGNvbnN0IHdyaXRlRmlsZUFzeW5jOiAocGF0aDogc3RyaW5nIHwgbnVtYmVyLCBkYXRhOiBhbnkpID0+IFByb21pc2U8dm9pZD4gPSBwcm9taXNpZnkoZnMud3JpdGVGaWxlKTtcbmV4cG9ydCBjb25zdCBzdGF0QXN5bmM6IChhcmcxOiBzdHJpbmcpID0+IFByb21pc2U8U3RhdHM+ID0gcHJvbWlzaWZ5KGZzLnN0YXQpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZURpcnMoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBsb2coY2hhbGsuZ3JlZW4oJ01ha2UgRGlycycpLCBmaWxlUGF0aCk7XG5cbiAgbGV0IHRlbXBQYXRoOiBzdHJpbmcgPSBgLmA7XG4gIGZvciAoY29uc3QgZGlyIG9mIGZpbGVQYXRoLnNwbGl0KC9bL1xcXFxdLykpIHtcbiAgICBpZiAoL1xcLi8udGVzdChkaXIpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgdGVtcFBhdGggPSBwYXRoLmpvaW4odGVtcFBhdGgsIGRpcik7XG4gICAgaWYgKCEoYXdhaXQgZXhpc3RzQXN5bmModGVtcFBhdGgpKSkge1xuICAgICAgLy8gbG9nKGNoYWxrLmJsdWUoXCJtYWtlXCIpLCB0ZW1wUGF0aCk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBta2RpckFzeW5jKHRlbXBQYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nKGNoYWxrLnJlZChlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXJFeGlzdHMoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJEaXIgRXhpc3RzXCIpLCBmaWxlUGF0aCk7XG5cbiAgbGV0IHRlbXBQYXRoOiBzdHJpbmcgPSBgLmA7XG4gIGxldCBleGlzdHM6IGJvb2xlYW4gPSB0cnVlO1xuICBmb3IgKGNvbnN0IGRpciBvZiBmaWxlUGF0aC5zcGxpdCgvWy9cXFxcXS8pKSB7XG4gICAgdGVtcFBhdGggPSBwYXRoLmpvaW4odGVtcFBhdGgsIGRpcik7XG4gICAgZXhpc3RzID0gYXdhaXQgZXhpc3RzQXN5bmModGVtcFBhdGgpO1xuICAgIGlmICghZXhpc3RzKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV4aXN0cztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlVG9Kc29uQW5kQ3N2KGZpbGVuYW1lOiBzdHJpbmcsIGpzb25EYXRhOiBhbnlbXSwgY3N2RGF0YTogYW55W10gPSBqc29uRGF0YSwgaGVhZGVyOiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJXcml0ZSB0byBKc29uIGFuZCBDU1ZcIiksIGZpbGVuYW1lKTtcblxuICBjb25zdCBqc29uU3RyaW5nOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSwgbnVsbCwgMik7XG4gIGNvbnN0IGpzb25OYW1lOiBzdHJpbmcgPSBgJHtmaWxlbmFtZX0uanNvbmA7XG4gIGF3YWl0IG1ha2VEaXJzKGpzb25OYW1lKTtcbiAgYXdhaXQgd3JpdGVGaWxlQXN5bmMoanNvbk5hbWUsIGpzb25TdHJpbmcpO1xuXG4gIGNvbnN0IGNzdlByZXA6IG9iamVjdFtdID0gQXJyYXkuaXNBcnJheShjc3ZEYXRhKSA/XG4gICAgZmlsbEFycmF5T2JqZWN0cyhjc3ZEYXRhLm1hcCgocjogYW55KSA9PiBmbGF0dGVuT2JqZWN0KHIpKSkgOlxuICAgIFtmbGF0dGVuT2JqZWN0KGNzdkRhdGEpXTtcbiAgY29uc3QgY3N2U3RyaW5nOiBzdHJpbmcgPSBhd2FpdCBzdHJpbmdpZnlBc3luYyhjc3ZQcmVwLCB7IGhlYWRlciB9KTtcbiAgY29uc3QgY3N2TmFtZTogc3RyaW5nID0gYCR7ZmlsZW5hbWV9LmNzdmA7XG4gIGF3YWl0IHdyaXRlRmlsZUFzeW5jKGNzdk5hbWUsIGNzdlN0cmluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEV4dGVuc2lvbihmaWxlbmFtZTogc3RyaW5nKTogeyBleHQ6IHN0cmluZzsgbmFtZTogc3RyaW5nIH0ge1xuICBsb2coY2hhbGsuZ3JlZW4oJ1NwbGl0IEV4dGVuc2lvbicpLCBmaWxlbmFtZSk7XG5cbiAgY29uc3QgbmFtZTogc3RyaW5nID0gZmlsZW5hbWUuc3Vic3RyaW5nKDAsIGZpbGVuYW1lLmxhc3RJbmRleE9mKCcuJykpO1xuICBjb25zdCBleHQ6IHN0cmluZyA9IGZpbGVuYW1lLnN1YnN0cmluZyhmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpICsgMSk7XG4gIHJldHVybiB7IG5hbWUsIGV4dCB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsRmlsZXNGcm9tRGlyZWN0b3J5PFQ+KGRpcmVjdG9yeTogc3RyaW5nKTogUHJvbWlzZTxUW10+IHtcbiAgbG9nKGNoYWxrLmdyZWVuKCdHZXQgQWxsIEZpbGVzIGZyb20gRGlyZWN0b3J5JyksIGRpcmVjdG9yeSk7XG5cbiAgY29uc3QgZmlsZXM6IGFueVtdID0gW107XG4gIGNvbnN0IGZpbGVOYW1lczogc3RyaW5nW10gPSBhd2FpdCByZWFkZGlyQXN5bmMoZGlyZWN0b3J5KTtcbiAgY29uc3QgZXh0TWF0Y2g6IFJlZ0V4cCA9IC9cXC5qc29uJC9pO1xuICBmb3IgKGNvbnN0IGZpbGVOYW1lIG9mIGZpbGVOYW1lcykge1xuICAgIGNvbnN0IGZpbGU6IHN0cmluZyA9IHBhdGguam9pbihkaXJlY3RvcnksIGZpbGVOYW1lKTtcbiAgICBjb25zdCBzdGF0OiBTdGF0cyA9IGF3YWl0IHN0YXRBc3luYyhmaWxlKTtcbiAgICBpZiAoc3RhdC5pc0ZpbGUoKSAmJiBmaWxlLm1hdGNoKGV4dE1hdGNoKSkge1xuICAgICAgLy8gbG9nKFwiR2V0IEFsbCBGaWxlcyBGcm9tIERpcmVjdG9yeVwiLCBjaGFsay5ncmVlbihcInJlYWRpbmdcIiksIGZpbGUpO1xuICAgICAgY29uc3QgZGF0YTogQnVmZmVyID0gYXdhaXQgcmVhZEZpbGVBc3luYyhmaWxlKTtcbiAgICAgIGZpbGVzLnB1c2goSlNPTi5wYXJzZShkYXRhLnRvU3RyaW5nKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbG9nKFwiR2V0IEFsbCBGaWxlcyBGcm9tIERpcmVjdG9yeVwiLCBjaGFsay5yZWQoXCJza2lwcGVkXCIpLCBmaWxlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpbGVzO1xufVxuIl19