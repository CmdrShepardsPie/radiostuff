import { fillArrayObjects, stringifyAsync } from "@helpers/csv-helpers";
import { flattenObject } from "@helpers/helpers";
import { createLog } from "@helpers/log-helpers";
import chalk from "chalk";
import fs, { Stats } from "fs";
import path from "path";
import { promisify } from "util";

const log: (...msg: any[]) => void = createLog("FS Helpers");

export const existsAsync: (path: string) => Promise<boolean> = promisify(fs.exists);
export const mkdirAsync: (path: string) => Promise<void> = promisify(fs.mkdir);
export const readFileAsync: (path: string | number) => Promise<Buffer> = promisify(fs.readFile);
export const readdirAsync: (path: string) => Promise<string[]> = promisify(fs.readdir);
export const writeFileAsync: (path: string | number, data: any) => Promise<void> = promisify(fs.writeFile);
export const statAsync: (arg1: string) => Promise<Stats> = promisify(fs.stat);

export async function makeDirs(filePath: string): Promise<void> {
  log(chalk.green("Make Dirs"), filePath);

  let tempPath: string = `.`;
  for (const dir of filePath.split(/[/\\]/)) {
    if (/\w+\.\w+$/.test(dir)) {
      break;
    }
    tempPath = path.join(tempPath, dir);
    if (!(await existsAsync(tempPath))) {
      // log(chalk.blue("make"), tempPath);
      try {
        await mkdirAsync(tempPath);
      } catch (e) {
        log(chalk.red(e));
      }
    }
  }
}

export async function dirExists(filePath: string): Promise<boolean> {
  // log(chalk.green("Dir Exists"), filePath);

  let tempPath: string = `.`;
  let exists: boolean = true;
  for (const dir of filePath.split(/[/\\]/)) {
    tempPath = path.join(tempPath, dir);
    exists = await existsAsync(tempPath);
    if (!exists) {
      break;
    }
  }
  return exists;
}

export async function writeToJsonAndCsv(filename: string, jsonData: any[], csvData: any[] = jsonData, header: boolean = true): Promise<void> {
  // log(chalk.green("Write to Json and CSV"), filename);

  const jsonString: string = JSON.stringify(jsonData, null, 2);
  const jsonName: string = `${filename}.json`;
  await makeDirs(jsonName);
  await writeFileAsync(jsonName, jsonString);

  const csvPrep: object[] = Array.isArray(csvData) ? fillArrayObjects(csvData.map((r: any): any => flattenObject(r))) : [flattenObject(csvData)];
  const csvString: string = await stringifyAsync(csvPrep, { header });
  const csvName: string = `${filename}.csv`;
  await writeFileAsync(csvName, csvString);
}

export function splitExtension(filename: string): { ext: string; name: string } {
  log(chalk.green("Split Extension"), filename);

  const name: string = filename.substring(0, filename.lastIndexOf("."));
  const ext: string = filename.substring(filename.lastIndexOf(".") + 1);
  return { name, ext };
}

export async function getAllFilesFromDirectory<T>(directory: string): Promise<T[]> {
  log(chalk.green("Get All Files from Directory"), directory);

  const files: any[] = [];
  const fileNames: string[] = await readdirAsync(directory);
  const extMatch: RegExp = /\.json$/i;
  for (const fileName of fileNames) {
    const file: string = path.join(directory, fileName);
    const stat: Stats = await statAsync(file);
    if (stat.isFile() && file.match(extMatch)) {
      // log("Get All Files From Directory", chalk.green("reading"), file);
      const data: Buffer = await readFileAsync(file);
      files.push(JSON.parse(data.toString()));
    } else {
      // log("Get All Files From Directory", chalk.red("skipped"), file);
    }
  }
  return files;
}
