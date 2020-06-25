import { dirExists, makeDirs, readFileAsync, writeFileAsync } from '@helpers/fs-helpers';
import chalk from 'chalk';
import { createOut } from '@helpers/log-helpers';
import { dayMS, weekMS } from '@helpers/helpers';

const { log, write }: { log: (...msg: any[]) => void; write: (...msg: any[]) => void } = createOut('Cache Helper');

const cacheStart: number = Date.now();
const cacheLogFileName: string = `../data/repeaters/_cache/cache-log.json`;
const cacheLog: { [key: string]: string } = {};
const maxCacheAgeMS: number = weekMS * 4;
let cacheLoaded: boolean = false;

export async function getCache(key: string): Promise<string | undefined> {
  const keyAge: number = await readCacheLog(key);
  const file: string = `../data/repeaters/_cache/${key}`;
  if (await dirExists(file)) {
    const cageAgeMS: number = (cacheStart - keyAge);
    if (cageAgeMS >= maxCacheAgeMS) {
      write(`O=${chalk.blue(Math.round(cageAgeMS / dayMS))}`);
      return;
    }
    return (await readFileAsync(file)).toString();
  }
}

export async function setCache(key: string, value: string): Promise<void> {
  const file: string = `../data/repeaters/_cache/${key}`;
  await makeDirs(file);
  await writeFileAsync(file, value);
  await writeCacheLog(key);
}

async function readCacheLog(key?: string): Promise<number> {
  if (!cacheLoaded && await dirExists(cacheLogFileName)) {
    Object.assign(cacheLog, JSON.parse((await readFileAsync(cacheLogFileName)).toString()));
    cacheLoaded = true;
  }
  if (key && cacheLog[key]) {
    return new Date(cacheLog[key]).valueOf();
  }
  return new Date(0).valueOf();
}

async function writeCacheLog(key: string): Promise<void> {
  await readCacheLog();
  cacheLog[key] = new Date().toISOString();
  await makeDirs(cacheLogFileName);
  await writeFileAsync(cacheLogFileName, JSON.stringify(cacheLog, null, 2));
}
