import { dirExists, makeDirs, readFileAsync, writeFileAsync } from "@helpers/fs-helpers";
import chalk from "chalk";
import { createOut } from "@helpers/log-helpers";

const { log, write }: { log: (...msg: any[]) => void; write: (...msg: any[]) => void } = createOut("Cache Helper");

const cacheStart: number = Date.now();
const cacheLogFileName: string = `../data/repeaters/_cache/cache-log.json`;
const cacheLog: { [key: string]: number } = {};
let cacheLoaded: boolean = false;

export async function getCache(key: string): Promise<string | undefined> {
  const keyAge: number = await readCacheLog(key);
  const file: string = `../data/repeaters/_cache/${key}`;
  if (await dirExists(file)) {
    const diff: number = (cacheStart - keyAge) / 1000 / 60 / 60 / 24;
    if (diff >= 7) {
      write(`O=${chalk.blue(Math.round(diff))}`);
      return;
    }
    return (await readFileAsync(file)).toString();
  }
}

export async function setCache(key: string, value: string): Promise<void> {
  const file: string = `../data/repeaters/_cache/${key}`;
  await makeDirs(file);
  await writeFileAsync(file, value);
  await writeCacheLog(key, Date.now());
}

async function readCacheLog(key?: string): Promise<number> {
  if (!cacheLoaded && await dirExists(cacheLogFileName)) {
    Object.assign(cacheLog, JSON.parse((await readFileAsync(cacheLogFileName)).toString()));
    cacheLoaded = true;
  }
  if (key) {
    return cacheLog[key] || 0;
  }
  return 0;
}

async function writeCacheLog(key: string, timestamp: number): Promise<void> {
  await readCacheLog();
  cacheLog[key] = timestamp;
  await makeDirs(cacheLogFileName);
  await writeFileAsync(cacheLogFileName, JSON.stringify(cacheLog, null, 2));
}
