import { createOut } from '@helpers/log-helpers';
import chalk from 'chalk';
import gpsDistance from 'gps-distance';

const { log }: { log: (...msg: any[]) => void; write: (...msg: any[]) => void } = createOut('Helpers');

export function wait<T = void>(ms: number, fn?: () => (T | Promise<T>)): Promise<T> {
  return new Promise((resolve: (value?: (Promise<T> | T)) => void, reject: (reason?: any) => void): void => {
    setTimeout(async (): Promise<void> => {
      try {
        resolve(fn && (await fn()));
      } catch (e) {
        reject(e);
      }
    }, ms);
  });
}

export function numberToString(num: number, major?: number, minor?: number): string {
  let str: string = num.toString();
  const split: string[] = str.split('.');
  if (major !== undefined) {
    if (split[0] === undefined) {
      split[0] = '0';
    }
    while (split[0].length < major) {
      split[0] = '0' + split[0];
    }
    if (split[0].length > major) {
      log(chalk.red('Major length exceeded'), 'Number:', num, 'Section:', split[0], 'Length:', split[0].length, 'Target:', major);
    }
    str = split.join('.');
  }
  if (minor !== undefined) {
    if (split[1] === undefined) {
      split[1] = '0';
    }
    while (split[1].length < minor) {
      split[1] = split[1] + '0';
    }
    if (split[1].length > minor) {
      log(chalk.red('Minor length exceeded'), 'Number:', num, 'Section:', split[1], 'Length:', split[1].length, 'Target:', minor);
    }
    str = split.join('.');
  }
  return str;
}

export function flattenObject(data: any): any {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }
  let subData: any = { ...data };
  let loop: boolean = true;
  while (loop) {
    loop = false;
    const entries: [string, any][] = Object.entries(subData);
    for (const entry of entries) {
      const key: string = entry[0];
      const value: any = entry[1];
      if (typeof value === 'object' && !Array.isArray(value)) {
        delete subData[key];
        const valueWithKeyNames: { [key: string]: any } = {};
        Object.entries(value).forEach((subEntry: [string, any]): void => {
          valueWithKeyNames[`${key}.${subEntry[0]}`] = subEntry[1];
        });
        subData = { ...subData, ...valueWithKeyNames };
        loop = true;
      }
    }
  }
  return subData;
}

export function splitCoordinates(input: string): gpsDistance.Point {
  return input.split(',').map((l: string): number => parseFloat(l)) as gpsDistance.Point;
}

export function checkCoordinates(point: gpsDistance.Point): boolean {
  return point.length === 2 && !isNaN(point[0]) && !isNaN(point[1]);
}

export const secondMS: number = 1000;
export const minuteMS: number = secondMS * 60;
export const hourMS: number = minuteMS * 60;
export const dayMS: number = hourMS * 24;
export const weekMS: number = dayMS * 7;
