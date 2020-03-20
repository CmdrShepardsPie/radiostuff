"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_helpers_1 = require("@helpers/csv-helpers");
const helpers_1 = require("@helpers/helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const log = log_helpers_1.createLog("FS Helpers");
exports.existsAsync = util_1.promisify(fs_1.default.exists);
exports.mkdirAsync = util_1.promisify(fs_1.default.mkdir);
exports.readFileAsync = util_1.promisify(fs_1.default.readFile);
exports.readdirAsync = util_1.promisify(fs_1.default.readdir);
exports.writeFileAsync = util_1.promisify(fs_1.default.writeFile);
exports.statAsync = util_1.promisify(fs_1.default.stat);
async function makeDirs(filePath) {
    log(chalk_1.default.green("Make Dirs"), filePath);
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
    const csvPrep = Array.isArray(csvData) ? csv_helpers_1.fillArrayObjects(csvData.map((r) => helpers_1.flattenObject(r))) : [helpers_1.flattenObject(csvData)];
    const csvString = await csv_helpers_1.stringifyAsync(csvPrep, { header });
    const csvName = `${filename}.csv`;
    await exports.writeFileAsync(csvName, csvString);
}
exports.writeToJsonAndCsv = writeToJsonAndCsv;
function splitExtension(filename) {
    log(chalk_1.default.green("Split Extension"), filename);
    const name = filename.substring(0, filename.lastIndexOf("."));
    const ext = filename.substring(filename.lastIndexOf(".") + 1);
    return { name, ext };
}
exports.splitExtension = splitExtension;
async function getAllFilesFromDirectory(directory) {
    log(chalk_1.default.green("Get All Files from Directory"), directory);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2ZzLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBd0U7QUFDeEUsOENBQWlEO0FBQ2pELHNEQUFpRDtBQUNqRCxrREFBMEI7QUFDMUIsNENBQStCO0FBQy9CLGdEQUF3QjtBQUN4QiwrQkFBaUM7QUFFakMsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFaEQsUUFBQSxXQUFXLEdBQXVDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZFLFFBQUEsVUFBVSxHQUFvQyxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRSxRQUFBLGFBQWEsR0FBK0MsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkYsUUFBQSxZQUFZLEdBQXdDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFFLFFBQUEsY0FBYyxHQUF3RCxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5RixRQUFBLFNBQVMsR0FBcUMsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdkUsS0FBSyxVQUFVLFFBQVEsQ0FBQyxRQUFnQjtJQUM3QyxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUV4QyxJQUFJLFFBQVEsR0FBVyxHQUFHLENBQUM7SUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3pDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6QixNQUFNO1NBQ1A7UUFDRCxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxR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QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQztJQUNwQyxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtRQUNoQyxNQUFNLElBQUksR0FBVyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxNQUFNLElBQUksR0FBVSxNQUFNLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QyxxRUFBcUU7WUFDckUsTUFBTSxJQUFJLEdBQVcsTUFBTSxxQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDTCxtRUFBbUU7U0FDcEU7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWxCRCw0REFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmaWxsQXJyYXlPYmplY3RzLCBzdHJpbmdpZnlBc3luYyB9IGZyb20gXCJAaGVscGVycy9jc3YtaGVscGVyc1wiO1xyXG5pbXBvcnQgeyBmbGF0dGVuT2JqZWN0IH0gZnJvbSBcIkBoZWxwZXJzL2hlbHBlcnNcIjtcclxuaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSBcIkBoZWxwZXJzL2xvZy1oZWxwZXJzXCI7XHJcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGZzLCB7IFN0YXRzIH0gZnJvbSBcImZzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJ1dGlsXCI7XHJcblxyXG5jb25zdCBsb2c6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkID0gY3JlYXRlTG9nKFwiRlMgSGVscGVyc1wiKTtcclxuXHJcbmV4cG9ydCBjb25zdCBleGlzdHNBc3luYzogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTxib29sZWFuPiA9IHByb21pc2lmeShmcy5leGlzdHMpO1xyXG5leHBvcnQgY29uc3QgbWtkaXJBc3luYzogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPiA9IHByb21pc2lmeShmcy5ta2Rpcik7XHJcbmV4cG9ydCBjb25zdCByZWFkRmlsZUFzeW5jOiAocGF0aDogc3RyaW5nIHwgbnVtYmVyKSA9PiBQcm9taXNlPEJ1ZmZlcj4gPSBwcm9taXNpZnkoZnMucmVhZEZpbGUpO1xyXG5leHBvcnQgY29uc3QgcmVhZGRpckFzeW5jOiAocGF0aDogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZ1tdPiA9IHByb21pc2lmeShmcy5yZWFkZGlyKTtcclxuZXhwb3J0IGNvbnN0IHdyaXRlRmlsZUFzeW5jOiAocGF0aDogc3RyaW5nIHwgbnVtYmVyLCBkYXRhOiBhbnkpID0+IFByb21pc2U8dm9pZD4gPSBwcm9taXNpZnkoZnMud3JpdGVGaWxlKTtcclxuZXhwb3J0IGNvbnN0IHN0YXRBc3luYzogKGFyZzE6IHN0cmluZykgPT4gUHJvbWlzZTxTdGF0cz4gPSBwcm9taXNpZnkoZnMuc3RhdCk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZURpcnMoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gIGxvZyhjaGFsay5ncmVlbihcIk1ha2UgRGlyc1wiKSwgZmlsZVBhdGgpO1xyXG5cclxuICBsZXQgdGVtcFBhdGg6IHN0cmluZyA9IGAuYDtcclxuICBmb3IgKGNvbnN0IGRpciBvZiBmaWxlUGF0aC5zcGxpdCgvWy9cXFxcXS8pKSB7XHJcbiAgICBpZiAoL1xcdytcXC5cXHcrJC8udGVzdChkaXIpKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGVtcFBhdGggPSBwYXRoLmpvaW4odGVtcFBhdGgsIGRpcik7XHJcbiAgICBpZiAoIShhd2FpdCBleGlzdHNBc3luYyh0ZW1wUGF0aCkpKSB7XHJcbiAgICAgIC8vIGxvZyhjaGFsay5ibHVlKFwibWFrZVwiKSwgdGVtcFBhdGgpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IG1rZGlyQXN5bmModGVtcFBhdGgpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nKGNoYWxrLnJlZChlKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXJFeGlzdHMoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gIC8vIGxvZyhjaGFsay5ncmVlbihcIkRpciBFeGlzdHNcIiksIGZpbGVQYXRoKTtcclxuXHJcbiAgbGV0IHRlbXBQYXRoOiBzdHJpbmcgPSBgLmA7XHJcbiAgbGV0IGV4aXN0czogYm9vbGVhbiA9IHRydWU7XHJcbiAgZm9yIChjb25zdCBkaXIgb2YgZmlsZVBhdGguc3BsaXQoL1svXFxcXF0vKSkge1xyXG4gICAgdGVtcFBhdGggPSBwYXRoLmpvaW4odGVtcFBhdGgsIGRpcik7XHJcbiAgICBleGlzdHMgPSBhd2FpdCBleGlzdHNBc3luYyh0ZW1wUGF0aCk7XHJcbiAgICBpZiAoIWV4aXN0cykge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGV4aXN0cztcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlVG9Kc29uQW5kQ3N2KGZpbGVuYW1lOiBzdHJpbmcsIGpzb25EYXRhOiBhbnlbXSwgY3N2RGF0YTogYW55W10gPSBqc29uRGF0YSwgaGVhZGVyOiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gIC8vIGxvZyhjaGFsay5ncmVlbihcIldyaXRlIHRvIEpzb24gYW5kIENTVlwiKSwgZmlsZW5hbWUpO1xyXG5cclxuICBjb25zdCBqc29uU3RyaW5nOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSwgbnVsbCwgMik7XHJcbiAgY29uc3QganNvbk5hbWU6IHN0cmluZyA9IGAke2ZpbGVuYW1lfS5qc29uYDtcclxuICBhd2FpdCBtYWtlRGlycyhqc29uTmFtZSk7XHJcbiAgYXdhaXQgd3JpdGVGaWxlQXN5bmMoanNvbk5hbWUsIGpzb25TdHJpbmcpO1xyXG5cclxuICBjb25zdCBjc3ZQcmVwOiBvYmplY3RbXSA9IEFycmF5LmlzQXJyYXkoY3N2RGF0YSkgPyBmaWxsQXJyYXlPYmplY3RzKGNzdkRhdGEubWFwKChyOiBhbnkpOiBhbnkgPT4gZmxhdHRlbk9iamVjdChyKSkpIDogW2ZsYXR0ZW5PYmplY3QoY3N2RGF0YSldO1xyXG4gIGNvbnN0IGNzdlN0cmluZzogc3RyaW5nID0gYXdhaXQgc3RyaW5naWZ5QXN5bmMoY3N2UHJlcCwgeyBoZWFkZXIgfSk7XHJcbiAgY29uc3QgY3N2TmFtZTogc3RyaW5nID0gYCR7ZmlsZW5hbWV9LmNzdmA7XHJcbiAgYXdhaXQgd3JpdGVGaWxlQXN5bmMoY3N2TmFtZSwgY3N2U3RyaW5nKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0RXh0ZW5zaW9uKGZpbGVuYW1lOiBzdHJpbmcpOiB7IGV4dDogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfSB7XHJcbiAgbG9nKGNoYWxrLmdyZWVuKFwiU3BsaXQgRXh0ZW5zaW9uXCIpLCBmaWxlbmFtZSk7XHJcblxyXG4gIGNvbnN0IG5hbWU6IHN0cmluZyA9IGZpbGVuYW1lLnN1YnN0cmluZygwLCBmaWxlbmFtZS5sYXN0SW5kZXhPZihcIi5cIikpO1xyXG4gIGNvbnN0IGV4dDogc3RyaW5nID0gZmlsZW5hbWUuc3Vic3RyaW5nKGZpbGVuYW1lLmxhc3RJbmRleE9mKFwiLlwiKSArIDEpO1xyXG4gIHJldHVybiB7IG5hbWUsIGV4dCB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsRmlsZXNGcm9tRGlyZWN0b3J5PFQ+KGRpcmVjdG9yeTogc3RyaW5nKTogUHJvbWlzZTxUW10+IHtcclxuICBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgQWxsIEZpbGVzIGZyb20gRGlyZWN0b3J5XCIpLCBkaXJlY3RvcnkpO1xyXG5cclxuICBjb25zdCBmaWxlczogYW55W10gPSBbXTtcclxuICBjb25zdCBmaWxlTmFtZXM6IHN0cmluZ1tdID0gYXdhaXQgcmVhZGRpckFzeW5jKGRpcmVjdG9yeSk7XHJcbiAgY29uc3QgZXh0TWF0Y2g6IFJlZ0V4cCA9IC9cXC5qc29uJC9pO1xyXG4gIGZvciAoY29uc3QgZmlsZU5hbWUgb2YgZmlsZU5hbWVzKSB7XHJcbiAgICBjb25zdCBmaWxlOiBzdHJpbmcgPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBmaWxlTmFtZSk7XHJcbiAgICBjb25zdCBzdGF0OiBTdGF0cyA9IGF3YWl0IHN0YXRBc3luYyhmaWxlKTtcclxuICAgIGlmIChzdGF0LmlzRmlsZSgpICYmIGZpbGUubWF0Y2goZXh0TWF0Y2gpKSB7XHJcbiAgICAgIC8vIGxvZyhcIkdldCBBbGwgRmlsZXMgRnJvbSBEaXJlY3RvcnlcIiwgY2hhbGsuZ3JlZW4oXCJyZWFkaW5nXCIpLCBmaWxlKTtcclxuICAgICAgY29uc3QgZGF0YTogQnVmZmVyID0gYXdhaXQgcmVhZEZpbGVBc3luYyhmaWxlKTtcclxuICAgICAgZmlsZXMucHVzaChKU09OLnBhcnNlKGRhdGEudG9TdHJpbmcoKSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gbG9nKFwiR2V0IEFsbCBGaWxlcyBGcm9tIERpcmVjdG9yeVwiLCBjaGFsay5yZWQoXCJza2lwcGVkXCIpLCBmaWxlKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZpbGVzO1xyXG59XHJcbiJdfQ==