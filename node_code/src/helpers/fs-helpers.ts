import { fillArrayObjects, parseAsync, stringifyAsync } from '@helpers/csv-helpers';
import { flattenObject } from '@helpers/helpers';
import { createLog } from '@helpers/log-helpers';
import chalk from 'chalk';
import fs, { Stats } from 'fs';
import path from 'path';
import { promisify } from 'util';

const log: (...msg: any[]) => void = createLog('FS Helpers');

export const existsAsync: (path: string) => Promise<boolean> = promisify(fs.exists);
export const mkdirAsync: (path: string) => Promise<void> = promisify(fs.mkdir);
export const readFileAsync: (path: string | number) => Promise<Buffer> = promisify(fs.readFile);
export const readdirAsync: (path: string) => Promise<string[]> = promisify(fs.readdir);
export const writeFileAsync: (path: string | number, data: any) => Promise<void> = promisify(fs.writeFile);
export const statAsync: (arg1: string) => Promise<Stats> = promisify(fs.stat);

export async function makeDirs(filePath: string): Promise<void> {
  // log(chalk.green("Make Dirs"), filePath);

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
        // Just swallow the error, it's probably "EEXIST: file already exists" (TODO: Should check)
        // log(chalk.red(e));
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

export async function writeToJson(filename: string, jsonData: any | any[]): Promise<void> {
  const jsonString: string = JSON.stringify(jsonData, null, 2);
  const jsonName: string = `${filename}.json`;
  await makeDirs(jsonName);
  await writeFileAsync(jsonName, jsonString);
}

export async function writeToCsv(filename: string, csvData: any | any[], header: boolean = true): Promise<void> {
  const csvPrep: object[] = Array.isArray(csvData) ? fillArrayObjects(csvData.map((r: any): any => flattenObject(r))) : [flattenObject(csvData)];
  const csvString: string = await stringifyAsync(csvPrep, { header });
  const csvName: string = `${filename}.csv`;
  await makeDirs(csvName);
  await writeFileAsync(csvName, csvString);
}

export async function readFromJson<T>(filename: string): Promise<T> {
  const fileBuffer: Buffer = await readFileAsync(filename);
  const fileString: string = fileBuffer.toString();
  return JSON.parse(fileString);
}

export async function readFromCsv<T>(filename: string, columns: boolean = true, cast: boolean = true): Promise<T[]> {
  const fileBuffer: Buffer = await readFileAsync(filename);
  const fileString: string = fileBuffer.toString();
  return parseAsync(fileString, { columns, cast });
}

export function splitExtension(filename: string): { ext: string; name: string; path: string; } {
  log(chalk.green('Split Extension'), filename);

  const filePath: string = filename.substring(0, filename.lastIndexOf(path.sep));
  const name: string = filename.substring(filename.lastIndexOf(path.sep) + 1, filename.lastIndexOf('.'));
  const ext: string = filename.substring(filename.lastIndexOf('.') + 1);
  return { path: filePath, name, ext };
}

export async function getAllFilesInDirectory(directory: string, extension: string = 'json', subdirectories: number = 0): Promise<string[]> {
  log(chalk.green('Get All Files from Directory'), directory);

  const files: string[] = [];
  const directories: string[] = [];
  const fileNames: string[] = await readdirAsync(directory);
  const extMatch: RegExp = new RegExp(`\.${extension}$`, 'i');

  await Promise.all(fileNames.map(async (fileName: string): Promise<void> => {
    const file: string = path.join(directory, fileName);
    const stat: Stats = await statAsync(file);
    if (stat.isFile() && file.match(extMatch)) {
      files.push(file);
    } else if (stat.isDirectory() && subdirectories > 0) {
      directories.push(file);
    }
  }));

  await Promise.all(directories.map(async (subDirectory: string): Promise<void> => {
    files.push(...await getAllFilesInDirectory(subDirectory, extension, subdirectories - 1));
  }));

  return files;
}
