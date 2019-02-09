import "module-alias/register";

import {readFileAsync, writeToJsonAndCsv} from "@helpers/fs-helpers";
import {numberToString} from "@helpers/helpers";
import {createLog} from "@helpers/log-helpers";
import chalk from "chalk";
import {IRepeater} from "./modules/i.repeater";

const log = createLog("Group By");

async function doIt(groupBy: keyof IRepeater, inFileName: string, outFileName: string) {
  const fileData = await readFileAsync(inFileName); // await getAllFilesFromDirectory("./repeaters/data/CO/", ".json") as IRepeater[];
  const repeaters = JSON.parse(fileData.toString()) as IRepeater[];

  // Only grouping by the keys in the first row. It's not comprehensive but contains the essentials.
  // const keys = Object.keys(repeaters[0]) as Array<keyof IRepeater>;
  // for (const key of keys) {
  log(chalk.green("Process"), chalk.blue("Group"), groupBy, chalk.yellow("In"), inFileName, chalk.cyan("Out"), outFileName);
  const grouped = group(groupBy, repeaters);
  await writeToJsonAndCsv(outFileName, grouped);
  // }
}

function group(groupBy: keyof IRepeater, repeaters: IRepeater[]) {
  const keyedGroups: { [index: string]: IRepeater[] } = {};
  repeaters.forEach((repeater) => {
    const keyVal = repeater[groupBy];
    if (keyVal !== undefined && keyVal !== null && keyVal !== "") {
      if (!keyedGroups[keyVal]) {
        keyedGroups[keyVal] = [];
      }
      keyedGroups[keyVal].push(repeater);
    }
  });
  const sorting = Object.entries(keyedGroups);
  sorting.sort((a, b) => {
    const aMi = numberToString(a[1][0].Mi * 100, 3, 24);
    const bMi = numberToString(b[1][0].Mi * 100, 3, 24);
    const aNumRepeaters = numberToString(100 - a[1].length, 4, 1);
    const bNumRepeaters = numberToString(100 - b[1].length, 4, 1);
    const aGroupName = a[0];
    const bGroupName = b[0];
    const aFrequency = numberToString(a[1][0].Frequency, 4, 5);
    const bFrequency = numberToString(b[1][0].Frequency, 4, 5);
    // Sort by distance, then number of repeaters in group, then group name
    const aStr = `${aMi} ${aNumRepeaters} ${aGroupName} ${aFrequency}`;
    const bStr = `${bMi} ${bNumRepeaters} ${bGroupName} ${bFrequency}`;
    // Sort by number of repeaters in group, then distance, then group name
    // const aStr = `${aNumRepeaters} ${aMi} ${aGroupName} ${aFrequency}`;
    // const bStr = `${bNumRepeaters} ${bMi} ${bGroupName} ${bFrequency}`;

    return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
  });
  return sorting.reduce((prev, curr) => [...prev, ...curr[1]], [] as IRepeater[]);
}

async function start() {
  // await doIt("Call", "repeaters/data/CO/Colorado Springs.json", "repeaters/groups/CO/Colorado Springs - Call");
  // await doIt("Call", "repeaters/data/CO/Colorado Springs.json", "repeaters/groups/CO/Colorado Springs - Call");
  // const coFiles = (await readdirAsync("data/repeaters/results/CO/")).map((f) => `CO/${f}`);
  // const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `UT/${f}`);
  // const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `NM/${f}`);
  // const allFiles = /* [...coFiles, ...utFiles, ...nmFiles] */ coFiles.filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
  // for (const file of allFiles) {
  //   await doIt("Call", `repeaters/data/${file}.json`, `repeaters/groups/${file} - Call`);
  // }
  // await doIt("Colorado Springs");
  // await doIt("Denver");
  // await doIt("Grand Junction");
  // await doIt("Call",
  //   `data/repeaters/results/CO/Colorado Springs.json`,
  //   `data/repeaters/groups/CO/Colorado Springs - Call`);
  await doIt("Call",
    `data/repeaters/combined/CO.json`,
    `data/repeaters/groups/combined/CO - Call`);
}

export default start();
