import {createLog} from "@helpers/log-helpers";

import {fillArrayObjects, stringifyAsync} from "@helpers/csv-helpers";
import {flattenObject} from "@helpers/helpers";
import chalk from "chalk";
import * as _fs from "fs";
import * as path from "path";
import { promisify } from "util";

const log = createLog("FS Helpers");

export const existsAsync = promisify(_fs.exists);
export const mkdirAsync = promisify(_fs.mkdir);
export const readFileAsync = promisify(_fs.readFile);
export const readdirAsync = promisify(_fs.readdir);
export const writeFileAsync = promisify(_fs.writeFile);
export const statAsync = promisify(_fs.stat);

export async function makeDirs(filePath: string) {
  log(chalk.green("Make Dirs"), filePath);

  let tempPath = `.`;
  for (const dir of filePath.split(/[/\\]/)) {
    if (/\./.test(dir)) {
      break;
    }
    tempPath = path.join(tempPath, dir);
    if (!(await existsAsync(tempPath))) {
      // log(chalk.blue("make"), tempPath);
      try {
        await mkdirAsync(tempPath);
      } catch (e) { log(chalk.red(e)); }
    }
  }
}

export async function dirExists(filePath: string) {
  // log(chalk.green("Dir Exists"), filePath);

  let tempPath = `.`;
  let exists = true;
  for (const dir of filePath.split(/[/\\]/)) {
    tempPath = path.join(tempPath, dir);
    exists = await existsAsync(tempPath);
    if (!exists) {
      break;
    }
  }
  return exists;
}

export async function writeToJsonAndCsv(filename: string, jsonData: any, csvData: any = jsonData) {
  // log(chalk.green("Write to Json and CSV"), filename);

  const jsonString = JSON.stringify(jsonData, null, 2);
  const jsonName = `${filename}.json`;
  await makeDirs(jsonName);
  await writeFileAsync(jsonName, jsonString);

  const csvPrep = Array.isArray(csvData) ?
    fillArrayObjects(csvData.map((r: any) => flattenObject(r))) :
    [flattenObject(csvData)];
  const csvString = await stringifyAsync(csvPrep, {header: true});
  const csvName = `${filename}.csv`;
  await writeFileAsync(csvName, csvString);
}

export function splitExtension(filename: string) {
  log(chalk.green("Split Extension"), filename);

  const name = filename.substring(0, filename.lastIndexOf("."));
  const ext = filename.substring(filename.lastIndexOf(".") + 1);
  return { name, ext };
}

export async function getAllFilesFromDirectory<T>(directory: string): Promise<T[]> {
  log(chalk.green("Get All Files from Directory"), directory);

  const files = [];
  const fileNames = await readdirAsync(directory);
  const extMatch = /\.json$/i;
  for (const fileName of fileNames) {
    const file = path.join(directory, fileName);
    const stat = await statAsync(file);
    if (stat.isFile() && file.match(extMatch)) {
      // log("Get All Files From Directory", chalk.green("reading"), file);
      const data = await readFileAsync(file, "utf8");
      files.push(JSON.parse(data));
    } else {
      // log("Get All Files From Directory", chalk.red("skipped"), file);
    }
  }
  return files;
}
