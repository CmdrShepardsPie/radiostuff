import { readFileAsync, writeToJsonAndCsv } from '@helpers/fs-helpers';
import { numberToString } from '@helpers/helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterRaw } from '@interfaces/repeater-raw';
import chalk from 'chalk';

const log: (...msg: any[]) => void = createLog('Group By');

async function doIt(groupBy: keyof RepeaterRaw, inFileName: string, outFileName: string): Promise<void> {
  const fileData: Buffer = await readFileAsync(inFileName); // await getAllFilesFromDirectory("./repeaters/data/CO/", ".json") as IRepeater[];
  const repeaters: RepeaterRaw[] = JSON.parse(fileData.toString());

  // Only grouping by the keys in the first row. It"s not comprehensive but contains the essentials.
  // const keys = Object.keys(repeaters[0]) as Array<keyof IRepeater>;
  // for (const key of keys) {
  log(chalk.green('Process'), chalk.blue('Group'), groupBy, chalk.yellow('In'), inFileName, chalk.cyan('Out'), outFileName);
  const grouped: RepeaterRaw[] = group(groupBy, repeaters);
  await writeToJsonAndCsv(outFileName, grouped);
  // }
}

function group(groupBy: keyof RepeaterRaw, repeaters: RepeaterRaw[]): RepeaterRaw[] {
  const keyedGroups: { [key: string]: RepeaterRaw[] } = {};
  repeaters.forEach((repeater: RepeaterRaw) => {
    const keyVal: number | undefined | string = repeater[groupBy];
    if (keyVal !== undefined && keyVal !== null && keyVal !== '') {
      if (!keyedGroups[keyVal]) {
        keyedGroups[keyVal] = [];
      }
      keyedGroups[keyVal].push(repeater);
    }
  });
  const sorting: [string, RepeaterRaw[]][] = Object.entries(keyedGroups);
  sorting.sort((a: [string, RepeaterRaw[]], b: [string, RepeaterRaw[]]) => {
    const aMi: string = numberToString(a[1][0].Mi || 0, 5, 24);
    const bMi: string = numberToString(b[1][0].Mi || 0, 5, 24);
    const aNumRepeaters: string = numberToString(100 - a[1].length, 4, 1);
    const bNumRepeaters: string = numberToString(100 - b[1].length, 4, 1);
    const aGroupName: string = a[0];
    const bGroupName: string = b[0];
    const aFrequency: string = numberToString(a[1][0].Frequency || 0, 4, 5);
    const bFrequency: string = numberToString(b[1][0].Frequency || 0, 4, 5);
    // Sort by distance, then number of repeaters in group, then group name
    const aStr: string = `${aMi} ${aNumRepeaters} ${aGroupName} ${aFrequency}`;
    const bStr: string = `${bMi} ${bNumRepeaters} ${bGroupName} ${bFrequency}`;
    // Sort by number of repeaters in group, then distance, then group name
    // const aStr = `${aNumRepeaters} ${aMi} ${aGroupName} ${aFrequency}`;
    // const bStr = `${bNumRepeaters} ${bMi} ${bGroupName} ${bFrequency}`;

    return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
  });
  return sorting.reduce((prev: RepeaterRaw[], curr: [string, RepeaterRaw[]]) => [...prev, ...curr[1]], [] as RepeaterRaw[]);
}

async function start(): Promise<void> {
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
  //   `../data/repeaters/results/CO/Colorado Springs.json`,
  //   `../data/repeaters/groups/CO/Colorado Springs - Call`);
  await doIt('Call',
    `../data/repeaters/combined/CO.json`,
    `../data/repeaters/groups/combined/CO - Call`);
}

export default start();
