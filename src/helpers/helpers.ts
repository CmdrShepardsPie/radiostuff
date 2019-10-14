import {createLog} from "@helpers/log-helpers";
import chalk from "chalk";

const log = createLog("Helpers");

export function wait(ms: number, fn?: any) {
  log(chalk.green("Wait"), ms);
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        resolve(fn && (await fn()));
      } catch (e) {
        reject(e);
      }
    }, ms);
  });
}

export function numberToString(num: number, major?: number, minor?: number) {
  let str = num.toString();
  const split = str.split(".");
  if (major !== undefined) {
    if (split[0] === undefined) {
      split[0] = "0";
    }
    while (split[0].length < major) {
      split[0] = "0" + split[0];
    }
    if (split[0].length > major) {
      log(chalk.red("Major length exceeded"), "Number:", num, "Section:", split[0], "Length:", split[0].length, "Target:", major);
    }
    str = split.join(".");
  }
  if (minor !== undefined) {
    if (split[1] === undefined) {
      split[1] = "0";
    }
    while (split[1].length < minor) {
      split[1] = split[1] + "0";
    }
    if (split[1].length > minor) {
      log(chalk.red("Minor length exceeded"), "Number:", num, "Section:", split[1], "Length:", split[1].length, "Target:", minor);
    }
    str = split.join(".");
  }
  return str;
}

export function flattenObject(data: any) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }
  let subData = {...data};
  let loop = true;
  while (loop) {
    loop = false;
    const entries = Object.entries(subData);
    for (const entry of entries) {
      const key: any = entry[0];
      const value: any = entry[1];
      if (typeof value === "object" && !Array.isArray(value)) {
        delete subData[key];
        const valueWithKeynames: any = {};
        Object.entries(value).forEach((subEntry) => {
          valueWithKeynames[`${key}.${subEntry[0]}`] = subEntry[1];
        });
        subData = {...subData, ...valueWithKeynames};
        loop = true;
      }
    }
  }
  return subData;
}
