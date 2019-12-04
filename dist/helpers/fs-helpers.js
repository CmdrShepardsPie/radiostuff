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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2ZzLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxzREFBd0U7SUFDeEUsOENBQWlEO0lBQ2pELHNEQUFpRDtJQUNqRCxrREFBMEI7SUFDMUIsNENBQStCO0lBQy9CLGdEQUF3QjtJQUN4QiwrQkFBaUM7SUFFakMsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFaEQsUUFBQSxXQUFXLEdBQXVDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZFLFFBQUEsVUFBVSxHQUFvQyxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRSxRQUFBLGFBQWEsR0FBK0MsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkYsUUFBQSxZQUFZLEdBQXdDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFFLFFBQUEsY0FBYyxHQUF3RCxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5RixRQUFBLFNBQVMsR0FBcUMsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdkUsS0FBSyxVQUFVLFFBQVEsQ0FBQyxRQUFnQjtRQUM3QyxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV4QyxJQUFJLFFBQVEsR0FBVyxHQUFHLENBQUM7UUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbEIsTUFBTTthQUNQO1lBQ0QsUUFBUSxHQUFHLGNBQUksQ0FBQyxJ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TSxTQUFTLEdBQWEsTUFBTSxvQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQztRQUNwQyxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUNoQyxNQUFNLElBQUksR0FBVyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxNQUFNLElBQUksR0FBVSxNQUFNLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDekMscUVBQXFFO2dCQUNyRSxNQUFNLElBQUksR0FBVyxNQUFNLHFCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNMLG1FQUFtRTthQUNwRTtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBbEJELDREQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpbGxBcnJheU9iamVjdHMsIHN0cmluZ2lmeUFzeW5jIH0gZnJvbSAnQGhlbHBlcnMvY3N2LWhlbHBlcnMnO1xyXG5pbXBvcnQgeyBmbGF0dGVuT2JqZWN0IH0gZnJvbSAnQGhlbHBlcnMvaGVscGVycyc7XHJcbmltcG9ydCB7IGNyZWF0ZUxvZyB9IGZyb20gJ0BoZWxwZXJzL2xvZy1oZWxwZXJzJztcclxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcclxuaW1wb3J0IGZzLCB7IFN0YXRzIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCc7XHJcblxyXG5jb25zdCBsb2c6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkID0gY3JlYXRlTG9nKCdGUyBIZWxwZXJzJyk7XHJcblxyXG5leHBvcnQgY29uc3QgZXhpc3RzQXN5bmM6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8Ym9vbGVhbj4gPSBwcm9taXNpZnkoZnMuZXhpc3RzKTtcclxuZXhwb3J0IGNvbnN0IG1rZGlyQXN5bmM6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD4gPSBwcm9taXNpZnkoZnMubWtkaXIpO1xyXG5leHBvcnQgY29uc3QgcmVhZEZpbGVBc3luYzogKHBhdGg6IHN0cmluZyB8IG51bWJlcikgPT4gUHJvbWlzZTxCdWZmZXI+ID0gcHJvbWlzaWZ5KGZzLnJlYWRGaWxlKTtcclxuZXhwb3J0IGNvbnN0IHJlYWRkaXJBc3luYzogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmdbXT4gPSBwcm9taXNpZnkoZnMucmVhZGRpcik7XHJcbmV4cG9ydCBjb25zdCB3cml0ZUZpbGVBc3luYzogKHBhdGg6IHN0cmluZyB8IG51bWJlciwgZGF0YTogYW55KSA9PiBQcm9taXNlPHZvaWQ+ID0gcHJvbWlzaWZ5KGZzLndyaXRlRmlsZSk7XHJcbmV4cG9ydCBjb25zdCBzdGF0QXN5bmM6IChhcmcxOiBzdHJpbmcpID0+IFByb21pc2U8U3RhdHM+ID0gcHJvbWlzaWZ5KGZzLnN0YXQpO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VEaXJzKGZpbGVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBsb2coY2hhbGsuZ3JlZW4oJ01ha2UgRGlycycpLCBmaWxlUGF0aCk7XHJcblxyXG4gIGxldCB0ZW1wUGF0aDogc3RyaW5nID0gYC5gO1xyXG4gIGZvciAoY29uc3QgZGlyIG9mIGZpbGVQYXRoLnNwbGl0KC9bL1xcXFxdLykpIHtcclxuICAgIGlmICgvXFwuLy50ZXN0KGRpcikpIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB0ZW1wUGF0aCA9IHBhdGguam9pbih0ZW1wUGF0aCwgZGlyKTtcclxuICAgIGlmICghKGF3YWl0IGV4aXN0c0FzeW5jKHRlbXBQYXRoKSkpIHtcclxuICAgICAgLy8gbG9nKGNoYWxrLmJsdWUoXCJtYWtlXCIpLCB0ZW1wUGF0aCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgbWtkaXJBc3luYyh0ZW1wUGF0aCk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBsb2coY2hhbGsucmVkKGUpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRpckV4aXN0cyhmaWxlUGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiRGlyIEV4aXN0c1wiKSwgZmlsZVBhdGgpO1xyXG5cclxuICBsZXQgdGVtcFBhdGg6IHN0cmluZyA9IGAuYDtcclxuICBsZXQgZXhpc3RzOiBib29sZWFuID0gdHJ1ZTtcclxuICBmb3IgKGNvbnN0IGRpciBvZiBmaWxlUGF0aC5zcGxpdCgvWy9cXFxcXS8pKSB7XHJcbiAgICB0ZW1wUGF0aCA9IHBhdGguam9pbih0ZW1wUGF0aCwgZGlyKTtcclxuICAgIGV4aXN0cyA9IGF3YWl0IGV4aXN0c0FzeW5jKHRlbXBQYXRoKTtcclxuICAgIGlmICghZXhpc3RzKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZXhpc3RzO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd3JpdGVUb0pzb25BbmRDc3YoZmlsZW5hbWU6IHN0cmluZywganNvbkRhdGE6IGFueVtdLCBjc3ZEYXRhOiBhbnlbXSA9IGpzb25EYXRhLCBoZWFkZXI6IGJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiV3JpdGUgdG8gSnNvbiBhbmQgQ1NWXCIpLCBmaWxlbmFtZSk7XHJcblxyXG4gIGNvbnN0IGpzb25TdHJpbmc6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGpzb25EYXRhLCBudWxsLCAyKTtcclxuICBjb25zdCBqc29uTmFtZTogc3RyaW5nID0gYCR7ZmlsZW5hbWV9Lmpzb25gO1xyXG4gIGF3YWl0IG1ha2VEaXJzKGpzb25OYW1lKTtcclxuICBhd2FpdCB3cml0ZUZpbGVBc3luYyhqc29uTmFtZSwganNvblN0cmluZyk7XHJcblxyXG4gIGNvbnN0IGNzdlByZXA6IG9iamVjdFtdID0gQXJyYXkuaXNBcnJheShjc3ZEYXRhKSA/XHJcbiAgICBmaWxsQXJyYXlPYmplY3RzKGNzdkRhdGEubWFwKChyOiBhbnkpID0+IGZsYXR0ZW5PYmplY3QocikpKSA6XHJcbiAgICBbZmxhdHRlbk9iamVjdChjc3ZEYXRhKV07XHJcbiAgY29uc3QgY3N2U3RyaW5nOiBzdHJpbmcgPSBhd2FpdCBzdHJpbmdpZnlBc3luYyhjc3ZQcmVwLCB7IGhlYWRlciB9KTtcclxuICBjb25zdCBjc3ZOYW1lOiBzdHJpbmcgPSBgJHtmaWxlbmFtZX0uY3N2YDtcclxuICBhd2FpdCB3cml0ZUZpbGVBc3luYyhjc3ZOYW1lLCBjc3ZTdHJpbmcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRFeHRlbnNpb24oZmlsZW5hbWU6IHN0cmluZyk6IHsgZXh0OiBzdHJpbmc7IG5hbWU6IHN0cmluZyB9IHtcclxuICBsb2coY2hhbGsuZ3JlZW4oJ1NwbGl0IEV4dGVuc2lvbicpLCBmaWxlbmFtZSk7XHJcblxyXG4gIGNvbnN0IG5hbWU6IHN0cmluZyA9IGZpbGVuYW1lLnN1YnN0cmluZygwLCBmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpKTtcclxuICBjb25zdCBleHQ6IHN0cmluZyA9IGZpbGVuYW1lLnN1YnN0cmluZyhmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpICsgMSk7XHJcbiAgcmV0dXJuIHsgbmFtZSwgZXh0IH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxGaWxlc0Zyb21EaXJlY3Rvcnk8VD4oZGlyZWN0b3J5OiBzdHJpbmcpOiBQcm9taXNlPFRbXT4ge1xyXG4gIGxvZyhjaGFsay5ncmVlbignR2V0IEFsbCBGaWxlcyBmcm9tIERpcmVjdG9yeScpLCBkaXJlY3RvcnkpO1xyXG5cclxuICBjb25zdCBmaWxlczogYW55W10gPSBbXTtcclxuICBjb25zdCBmaWxlTmFtZXM6IHN0cmluZ1tdID0gYXdhaXQgcmVhZGRpckFzeW5jKGRpcmVjdG9yeSk7XHJcbiAgY29uc3QgZXh0TWF0Y2g6IFJlZ0V4cCA9IC9cXC5qc29uJC9pO1xyXG4gIGZvciAoY29uc3QgZmlsZU5hbWUgb2YgZmlsZU5hbWVzKSB7XHJcbiAgICBjb25zdCBmaWxlOiBzdHJpbmcgPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBmaWxlTmFtZSk7XHJcbiAgICBjb25zdCBzdGF0OiBTdGF0cyA9IGF3YWl0IHN0YXRBc3luYyhmaWxlKTtcclxuICAgIGlmIChzdGF0LmlzRmlsZSgpICYmIGZpbGUubWF0Y2goZXh0TWF0Y2gpKSB7XHJcbiAgICAgIC8vIGxvZyhcIkdldCBBbGwgRmlsZXMgRnJvbSBEaXJlY3RvcnlcIiwgY2hhbGsuZ3JlZW4oXCJyZWFkaW5nXCIpLCBmaWxlKTtcclxuICAgICAgY29uc3QgZGF0YTogQnVmZmVyID0gYXdhaXQgcmVhZEZpbGVBc3luYyhmaWxlKTtcclxuICAgICAgZmlsZXMucHVzaChKU09OLnBhcnNlKGRhdGEudG9TdHJpbmcoKSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gbG9nKFwiR2V0IEFsbCBGaWxlcyBGcm9tIERpcmVjdG9yeVwiLCBjaGFsay5yZWQoXCJza2lwcGVkXCIpLCBmaWxlKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZpbGVzO1xyXG59XHJcbiJdfQ==