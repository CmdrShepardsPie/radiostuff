import {dirExists, makeDirs, readFileAsync, rmAsync, writeFileAsync} from '@helpers/fs-helpers';
import chalk from 'chalk';
import { createOut } from '@helpers/log-helpers';
import { dayMS, weekMS } from '@helpers/helpers';

const { log, write }: { log: (...msg: any[]) => void; write: (...msg: any[]) => void } = createOut('Cache Helper');

const cacheStart: number = Date.now();
const cacheLogFileName: string = `../data/repeaters/_cache/cache-log.json`;
const cacheLog: { [key: string]: string } = {};
const maxCacheAgeMS: number = weekMS * 4;
let cacheLoaded: boolean = false;

export async function getCache(key: string, ignoreAge: boolean = false): Promise<string | undefined> {
  const keyAge: number = await readCacheLog(key);
  const file: string = `../data/repeaters/_cache/${key}`;
  if (await dirExists(file)) {
    const cageAgeMS: number = (cacheStart - keyAge);
    if (!ignoreAge && cageAgeMS >= maxCacheAgeMS) {
      // write(`O=${chalk.blue(Math.round(cageAgeMS / dayMS))}`);
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

export async function deleteCache(key: string): Promise<void> {
  const file: string = `../data/repeaters/_cache/${key}`;
  if (await dirExists(file)) {
    await rmAsync(file);
  }
  await writeCacheLog(key, true);
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

async function writeCacheLog(key: string, clear: boolean = false): Promise<void> {
  await readCacheLog();
  if (!clear) {
    cacheLog[key] = new Date().toISOString();
  } else {
    delete cacheLog[key];
  }
  await makeDirs(cacheLogFileName);
  await writeFileAsync(cacheLogFileName, JSON.stringify(cacheLog, null, 2));
}
