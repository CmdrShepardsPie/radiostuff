"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_helpers_1 = require("@helpers/log-helpers");
const csv_helpers_1 = require("@helpers/csv-helpers");
const helpers_1 = require("@helpers/helpers");
const chalk_1 = require("chalk");
const _fs = require("fs");
const path = require("path");
const util_1 = require("util");
const log = log_helpers_1.createLog("FS Helpers");
exports.existsAsync = util_1.promisify(_fs.exists);
exports.mkdirAsync = util_1.promisify(_fs.mkdir);
exports.readFileAsync = util_1.promisify(_fs.readFile);
exports.readdirAsync = util_1.promisify(_fs.readdir);
exports.writeFileAsync = util_1.promisify(_fs.writeFile);
exports.statAsync = util_1.promisify(_fs.stat);
async function makeDirs(filePath) {
    log(chalk_1.default.green("Make Dirs"), filePath);
    let tempPath = `.`;
    for (const dir of filePath.split(/[/\\]/)) {
        if (/\./.test(dir)) {
            break;
        }
        tempPath = path.join(tempPath, dir);
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
        tempPath = path.join(tempPath, dir);
        exists = await exports.existsAsync(tempPath);
        if (!exists) {
            break;
        }
    }
    return exists;
}
exports.dirExists = dirExists;
async function writeToJsonAndCsv(filename, jsonData, csvData = jsonData) {
    // log(chalk.green("Write to Json and CSV"), filename);
    const jsonString = JSON.stringify(jsonData, null, 2);
    const jsonName = `${filename}.json`;
    await makeDirs(jsonName);
    await exports.writeFileAsync(jsonName, jsonString);
    const csvPrep = Array.isArray(csvData) ?
        csv_helpers_1.fillArrayObjects(csvData.map((r) => helpers_1.flattenObject(r))) :
        [helpers_1.flattenObject(csvData)];
    const csvString = await csv_helpers_1.stringifyAsync(csvPrep, { header: true });
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
        const file = path.join(directory, fileName);
        const stat = await exports.statAsync(file);
        if (stat.isFile() && file.match(extMatch)) {
            // log("Get All Files From Directory", chalk.green("reading"), file);
            const data = await exports.readFileAsync(file, "utf8");
            files.push(JSON.parse(data));
        }
        else {
            // log("Get All Files From Directory", chalk.red("skipped"), file);
        }
    }
    return files;
}
exports.getAllFilesFromDirectory = getAllFilesFromDirectory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2ZzLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBK0M7QUFFL0Msc0RBQXNFO0FBQ3RFLDhDQUErQztBQUMvQyxpQ0FBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLDZCQUE2QjtBQUM3QiwrQkFBaUM7QUFFakMsTUFBTSxHQUFHLEdBQUcsdUJBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUV2QixRQUFBLFdBQVcsR0FBRyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxRQUFBLFVBQVUsR0FBRyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxRQUFBLGFBQWEsR0FBRyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxRQUFBLFlBQVksR0FBRyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QyxRQUFBLGNBQWMsR0FBRyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxQyxRQUFBLFNBQVMsR0FBRyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV0QyxLQUFLLFVBQVUsUUFBUSxDQUFDLFFBQWdCO0lBQzdDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXhDLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUNuQixLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLE1BQU07U0FDUDtRQUNELFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxH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Q0FBQyxDQUFDO0lBQ2hELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUM1QixLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtRQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QyxxRUFBcUU7WUFDckUsTUFBTSxJQUFJLEdBQUcsTUFBTSxxQkFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0wsbUVBQW1FO1NBQ3BFO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFsQkQsNERBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjcmVhdGVMb2d9IGZyb20gXCJAaGVscGVycy9sb2ctaGVscGVyc1wiO1xuXG5pbXBvcnQge2ZpbGxBcnJheU9iamVjdHMsIHN0cmluZ2lmeUFzeW5jfSBmcm9tIFwiQGhlbHBlcnMvY3N2LWhlbHBlcnNcIjtcbmltcG9ydCB7ZmxhdHRlbk9iamVjdH0gZnJvbSBcIkBoZWxwZXJzL2hlbHBlcnNcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCAqIGFzIF9mcyBmcm9tIFwiZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJ1dGlsXCI7XG5cbmNvbnN0IGxvZyA9IGNyZWF0ZUxvZyhcIkZTIEhlbHBlcnNcIik7XG5cbmV4cG9ydCBjb25zdCBleGlzdHNBc3luYyA9IHByb21pc2lmeShfZnMuZXhpc3RzKTtcbmV4cG9ydCBjb25zdCBta2RpckFzeW5jID0gcHJvbWlzaWZ5KF9mcy5ta2Rpcik7XG5leHBvcnQgY29uc3QgcmVhZEZpbGVBc3luYyA9IHByb21pc2lmeShfZnMucmVhZEZpbGUpO1xuZXhwb3J0IGNvbnN0IHJlYWRkaXJBc3luYyA9IHByb21pc2lmeShfZnMucmVhZGRpcik7XG5leHBvcnQgY29uc3Qgd3JpdGVGaWxlQXN5bmMgPSBwcm9taXNpZnkoX2ZzLndyaXRlRmlsZSk7XG5leHBvcnQgY29uc3Qgc3RhdEFzeW5jID0gcHJvbWlzaWZ5KF9mcy5zdGF0KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VEaXJzKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgbG9nKGNoYWxrLmdyZWVuKFwiTWFrZSBEaXJzXCIpLCBmaWxlUGF0aCk7XG5cbiAgbGV0IHRlbXBQYXRoID0gYC5gO1xuICBmb3IgKGNvbnN0IGRpciBvZiBmaWxlUGF0aC5zcGxpdCgvWy9cXFxcXS8pKSB7XG4gICAgaWYgKC9cXC4vLnRlc3QoZGlyKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRlbXBQYXRoID0gcGF0aC5qb2luKHRlbXBQYXRoLCBkaXIpO1xuICAgIGlmICghKGF3YWl0IGV4aXN0c0FzeW5jKHRlbXBQYXRoKSkpIHtcbiAgICAgIC8vIGxvZyhjaGFsay5ibHVlKFwibWFrZVwiKSwgdGVtcFBhdGgpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgbWtkaXJBc3luYyh0ZW1wUGF0aCk7XG4gICAgICB9IGNhdGNoIChlKSB7IGxvZyhjaGFsay5yZWQoZSkpOyB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXJFeGlzdHMoZmlsZVBhdGg6IHN0cmluZykge1xuICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJEaXIgRXhpc3RzXCIpLCBmaWxlUGF0aCk7XG5cbiAgbGV0IHRlbXBQYXRoID0gYC5gO1xuICBsZXQgZXhpc3RzID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBkaXIgb2YgZmlsZVBhdGguc3BsaXQoL1svXFxcXF0vKSkge1xuICAgIHRlbXBQYXRoID0gcGF0aC5qb2luKHRlbXBQYXRoLCBkaXIpO1xuICAgIGV4aXN0cyA9IGF3YWl0IGV4aXN0c0FzeW5jKHRlbXBQYXRoKTtcbiAgICBpZiAoIWV4aXN0cykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBleGlzdHM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZVRvSnNvbkFuZENzdihmaWxlbmFtZTogc3RyaW5nLCBqc29uRGF0YTogYW55LCBjc3ZEYXRhOiBhbnkgPSBqc29uRGF0YSkge1xuICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJXcml0ZSB0byBKc29uIGFuZCBDU1ZcIiksIGZpbGVuYW1lKTtcblxuICBjb25zdCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoanNvbkRhdGEsIG51bGwsIDIpO1xuICBjb25zdCBqc29uTmFtZSA9IGAke2ZpbGVuYW1lfS5qc29uYDtcbiAgYXdhaXQgbWFrZURpcnMoanNvbk5hbWUpO1xuICBhd2FpdCB3cml0ZUZpbGVBc3luYyhqc29uTmFtZSwganNvblN0cmluZyk7XG5cbiAgY29uc3QgY3N2UHJlcCA9IEFycmF5LmlzQXJyYXkoY3N2RGF0YSkgP1xuICAgIGZpbGxBcnJheU9iamVjdHMoY3N2RGF0YS5tYXAoKHI6IGFueSkgPT4gZmxhdHRlbk9iamVjdChyKSkpIDpcbiAgICBbZmxhdHRlbk9iamVjdChjc3ZEYXRhKV07XG4gIGNvbnN0IGNzdlN0cmluZyA9IGF3YWl0IHN0cmluZ2lmeUFzeW5jKGNzdlByZXAsIHtoZWFkZXI6IHRydWV9KTtcbiAgY29uc3QgY3N2TmFtZSA9IGAke2ZpbGVuYW1lfS5jc3ZgO1xuICBhd2FpdCB3cml0ZUZpbGVBc3luYyhjc3ZOYW1lLCBjc3ZTdHJpbmcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRFeHRlbnNpb24oZmlsZW5hbWU6IHN0cmluZykge1xuICBsb2coY2hhbGsuZ3JlZW4oXCJTcGxpdCBFeHRlbnNpb25cIiksIGZpbGVuYW1lKTtcblxuICBjb25zdCBuYW1lID0gZmlsZW5hbWUuc3Vic3RyaW5nKDAsIGZpbGVuYW1lLmxhc3RJbmRleE9mKFwiLlwiKSk7XG4gIGNvbnN0IGV4dCA9IGZpbGVuYW1lLnN1YnN0cmluZyhmaWxlbmFtZS5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcbiAgcmV0dXJuIHsgbmFtZSwgZXh0IH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxGaWxlc0Zyb21EaXJlY3Rvcnk8VD4oZGlyZWN0b3J5OiBzdHJpbmcpOiBQcm9taXNlPFRbXT4ge1xuICBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgQWxsIEZpbGVzIGZyb20gRGlyZWN0b3J5XCIpLCBkaXJlY3RvcnkpO1xuXG4gIGNvbnN0IGZpbGVzID0gW107XG4gIGNvbnN0IGZpbGVOYW1lcyA9IGF3YWl0IHJlYWRkaXJBc3luYyhkaXJlY3RvcnkpO1xuICBjb25zdCBleHRNYXRjaCA9IC9cXC5qc29uJC9pO1xuICBmb3IgKGNvbnN0IGZpbGVOYW1lIG9mIGZpbGVOYW1lcykge1xuICAgIGNvbnN0IGZpbGUgPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBmaWxlTmFtZSk7XG4gICAgY29uc3Qgc3RhdCA9IGF3YWl0IHN0YXRBc3luYyhmaWxlKTtcbiAgICBpZiAoc3RhdC5pc0ZpbGUoKSAmJiBmaWxlLm1hdGNoKGV4dE1hdGNoKSkge1xuICAgICAgLy8gbG9nKFwiR2V0IEFsbCBGaWxlcyBGcm9tIERpcmVjdG9yeVwiLCBjaGFsay5ncmVlbihcInJlYWRpbmdcIiksIGZpbGUpO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoZmlsZSwgXCJ1dGY4XCIpO1xuICAgICAgZmlsZXMucHVzaChKU09OLnBhcnNlKGRhdGEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbG9nKFwiR2V0IEFsbCBGaWxlcyBGcm9tIERpcmVjdG9yeVwiLCBjaGFsay5yZWQoXCJza2lwcGVkXCIpLCBmaWxlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpbGVzO1xufVxuIl19