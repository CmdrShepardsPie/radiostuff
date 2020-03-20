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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2ZzLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBd0U7QUFDeEUsOENBQWlEO0FBQ2pELHNEQUFpRDtBQUNqRCxrREFBMEI7QUFDMUIsNENBQStCO0FBQy9CLGdEQUF3QjtBQUN4QiwrQkFBaUM7QUFFakMsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFaEQsUUFBQSxXQUFXLEdBQXVDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZFLFFBQUEsVUFBVSxHQUFvQyxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRSxRQUFBLGFBQWEsR0FBK0MsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkYsUUFBQSxZQUFZLEdBQXdDLGdCQUFTLENBQUMsWUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFFLFFBQUEsY0FBYyxHQUF3RCxnQkFBUyxDQUFDLFlBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5RixRQUFBLFNBQVMsR0FBcUMsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdkUsS0FBSyxVQUFVLFFBQVEsQ0FBQyxRQUFnQjtJQUM3QyxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUV4QyxJQUFJLFFBQVEsR0FBVyxHQUFHLENBQUM7SUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3pDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6QixNQUFNO1NBQ1A7UUFDRCxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxR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QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQztJQUNwQyxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtRQUNoQyxNQUFNLElBQUksR0FBVyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxNQUFNLElBQUksR0FBVSxNQUFNLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QyxxRUFBcUU7WUFDckUsTUFBTSxJQUFJLEdBQVcsTUFBTSxxQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDTCxtRUFBbUU7U0FDcEU7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWxCRCw0REFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmaWxsQXJyYXlPYmplY3RzLCBzdHJpbmdpZnlBc3luYyB9IGZyb20gXCJAaGVscGVycy9jc3YtaGVscGVyc1wiO1xuaW1wb3J0IHsgZmxhdHRlbk9iamVjdCB9IGZyb20gXCJAaGVscGVycy9oZWxwZXJzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2cgfSBmcm9tIFwiQGhlbHBlcnMvbG9nLWhlbHBlcnNcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCBmcywgeyBTdGF0cyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJ1dGlsXCI7XG5cbmNvbnN0IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQgPSBjcmVhdGVMb2coXCJGUyBIZWxwZXJzXCIpO1xuXG5leHBvcnQgY29uc3QgZXhpc3RzQXN5bmM6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8Ym9vbGVhbj4gPSBwcm9taXNpZnkoZnMuZXhpc3RzKTtcbmV4cG9ydCBjb25zdCBta2RpckFzeW5jOiAocGF0aDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+ID0gcHJvbWlzaWZ5KGZzLm1rZGlyKTtcbmV4cG9ydCBjb25zdCByZWFkRmlsZUFzeW5jOiAocGF0aDogc3RyaW5nIHwgbnVtYmVyKSA9PiBQcm9taXNlPEJ1ZmZlcj4gPSBwcm9taXNpZnkoZnMucmVhZEZpbGUpO1xuZXhwb3J0IGNvbnN0IHJlYWRkaXJBc3luYzogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmdbXT4gPSBwcm9taXNpZnkoZnMucmVhZGRpcik7XG5leHBvcnQgY29uc3Qgd3JpdGVGaWxlQXN5bmM6IChwYXRoOiBzdHJpbmcgfCBudW1iZXIsIGRhdGE6IGFueSkgPT4gUHJvbWlzZTx2b2lkPiA9IHByb21pc2lmeShmcy53cml0ZUZpbGUpO1xuZXhwb3J0IGNvbnN0IHN0YXRBc3luYzogKGFyZzE6IHN0cmluZykgPT4gUHJvbWlzZTxTdGF0cz4gPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlRGlycyhmaWxlUGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGxvZyhjaGFsay5ncmVlbihcIk1ha2UgRGlyc1wiKSwgZmlsZVBhdGgpO1xuXG4gIGxldCB0ZW1wUGF0aDogc3RyaW5nID0gYC5gO1xuICBmb3IgKGNvbnN0IGRpciBvZiBmaWxlUGF0aC5zcGxpdCgvWy9cXFxcXS8pKSB7XG4gICAgaWYgKC9cXHcrXFwuXFx3KyQvLnRlc3QoZGlyKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRlbXBQYXRoID0gcGF0aC5qb2luKHRlbXBQYXRoLCBkaXIpO1xuICAgIGlmICghKGF3YWl0IGV4aXN0c0FzeW5jKHRlbXBQYXRoKSkpIHtcbiAgICAgIC8vIGxvZyhjaGFsay5ibHVlKFwibWFrZVwiKSwgdGVtcFBhdGgpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgbWtkaXJBc3luYyh0ZW1wUGF0aCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZyhjaGFsay5yZWQoZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlyRXhpc3RzKGZpbGVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiRGlyIEV4aXN0c1wiKSwgZmlsZVBhdGgpO1xuXG4gIGxldCB0ZW1wUGF0aDogc3RyaW5nID0gYC5gO1xuICBsZXQgZXhpc3RzOiBib29sZWFuID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBkaXIgb2YgZmlsZVBhdGguc3BsaXQoL1svXFxcXF0vKSkge1xuICAgIHRlbXBQYXRoID0gcGF0aC5qb2luKHRlbXBQYXRoLCBkaXIpO1xuICAgIGV4aXN0cyA9IGF3YWl0IGV4aXN0c0FzeW5jKHRlbXBQYXRoKTtcbiAgICBpZiAoIWV4aXN0cykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBleGlzdHM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZVRvSnNvbkFuZENzdihmaWxlbmFtZTogc3RyaW5nLCBqc29uRGF0YTogYW55W10sIGNzdkRhdGE6IGFueVtdID0ganNvbkRhdGEsIGhlYWRlcjogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiV3JpdGUgdG8gSnNvbiBhbmQgQ1NWXCIpLCBmaWxlbmFtZSk7XG5cbiAgY29uc3QganNvblN0cmluZzogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoanNvbkRhdGEsIG51bGwsIDIpO1xuICBjb25zdCBqc29uTmFtZTogc3RyaW5nID0gYCR7ZmlsZW5hbWV9Lmpzb25gO1xuICBhd2FpdCBtYWtlRGlycyhqc29uTmFtZSk7XG4gIGF3YWl0IHdyaXRlRmlsZUFzeW5jKGpzb25OYW1lLCBqc29uU3RyaW5nKTtcblxuICBjb25zdCBjc3ZQcmVwOiBvYmplY3RbXSA9IEFycmF5LmlzQXJyYXkoY3N2RGF0YSkgPyBmaWxsQXJyYXlPYmplY3RzKGNzdkRhdGEubWFwKChyOiBhbnkpOiBhbnkgPT4gZmxhdHRlbk9iamVjdChyKSkpIDogW2ZsYXR0ZW5PYmplY3QoY3N2RGF0YSldO1xuICBjb25zdCBjc3ZTdHJpbmc6IHN0cmluZyA9IGF3YWl0IHN0cmluZ2lmeUFzeW5jKGNzdlByZXAsIHsgaGVhZGVyIH0pO1xuICBjb25zdCBjc3ZOYW1lOiBzdHJpbmcgPSBgJHtmaWxlbmFtZX0uY3N2YDtcbiAgYXdhaXQgd3JpdGVGaWxlQXN5bmMoY3N2TmFtZSwgY3N2U3RyaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0RXh0ZW5zaW9uKGZpbGVuYW1lOiBzdHJpbmcpOiB7IGV4dDogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfSB7XG4gIGxvZyhjaGFsay5ncmVlbihcIlNwbGl0IEV4dGVuc2lvblwiKSwgZmlsZW5hbWUpO1xuXG4gIGNvbnN0IG5hbWU6IHN0cmluZyA9IGZpbGVuYW1lLnN1YnN0cmluZygwLCBmaWxlbmFtZS5sYXN0SW5kZXhPZihcIi5cIikpO1xuICBjb25zdCBleHQ6IHN0cmluZyA9IGZpbGVuYW1lLnN1YnN0cmluZyhmaWxlbmFtZS5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcbiAgcmV0dXJuIHsgbmFtZSwgZXh0IH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxGaWxlc0Zyb21EaXJlY3Rvcnk8VD4oZGlyZWN0b3J5OiBzdHJpbmcpOiBQcm9taXNlPFRbXT4ge1xuICBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgQWxsIEZpbGVzIGZyb20gRGlyZWN0b3J5XCIpLCBkaXJlY3RvcnkpO1xuXG4gIGNvbnN0IGZpbGVzOiBhbnlbXSA9IFtdO1xuICBjb25zdCBmaWxlTmFtZXM6IHN0cmluZ1tdID0gYXdhaXQgcmVhZGRpckFzeW5jKGRpcmVjdG9yeSk7XG4gIGNvbnN0IGV4dE1hdGNoOiBSZWdFeHAgPSAvXFwuanNvbiQvaTtcbiAgZm9yIChjb25zdCBmaWxlTmFtZSBvZiBmaWxlTmFtZXMpIHtcbiAgICBjb25zdCBmaWxlOiBzdHJpbmcgPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBmaWxlTmFtZSk7XG4gICAgY29uc3Qgc3RhdDogU3RhdHMgPSBhd2FpdCBzdGF0QXN5bmMoZmlsZSk7XG4gICAgaWYgKHN0YXQuaXNGaWxlKCkgJiYgZmlsZS5tYXRjaChleHRNYXRjaCkpIHtcbiAgICAgIC8vIGxvZyhcIkdldCBBbGwgRmlsZXMgRnJvbSBEaXJlY3RvcnlcIiwgY2hhbGsuZ3JlZW4oXCJyZWFkaW5nXCIpLCBmaWxlKTtcbiAgICAgIGNvbnN0IGRhdGE6IEJ1ZmZlciA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoZmlsZSk7XG4gICAgICBmaWxlcy5wdXNoKEpTT04ucGFyc2UoZGF0YS50b1N0cmluZygpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGxvZyhcIkdldCBBbGwgRmlsZXMgRnJvbSBEaXJlY3RvcnlcIiwgY2hhbGsucmVkKFwic2tpcHBlZFwiKSwgZmlsZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWxlcztcbn1cbiJdfQ==