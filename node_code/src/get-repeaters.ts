import 'module-alias/register';

import { program } from 'commander';
import { writeToJsonAndCsv } from '@helpers/fs-helpers';
import { numberToString } from '@helpers/helpers';
import { createLog } from '@helpers/log-helpers';
import { IRepeaterRaw } from '@interfaces/i-repeater-raw';
import chalk from 'chalk';
import Scraper from './modules/scraper';

const log: (...msg: any[]) => void = createLog('Get Repeaters');

log('program');

program
  .version('0.0.1')
  .arguments('<location>')
  .action(async (location: string): Promise<void> => {
    if (location) {
      await save(location, 200);
    }
  });

program.parse(process.argv);

async function save(place: string | number, distance: number): Promise<void> {
  log(chalk.green('Save'), place, distance);

  const scraper: Scraper = new Scraper(place, distance);

  const result: IRepeaterRaw[] = await scraper.process();

  // @ts-ignore
  const columns: { [key in keyof IRepeaterRaw]: (string | number | undefined)[] } = {};
  result.forEach((row: IRepeaterRaw): void => {
    Object.entries(row).forEach((entry: [string, (string | number | undefined)]): void => {
      const key: keyof IRepeaterRaw = entry[0] as keyof IRepeaterRaw;
      const value: string | number | undefined = entry[1];
      if (!columns[key]) {
        columns[key] = [];
      }
      if (columns[key]!.indexOf(value) === -1) {
        columns[key]!.push(value);
      }
    });
  });

  result.forEach((row: IRepeaterRaw): void => {
    Object.entries(row).forEach((entry: [string, (string | number | undefined)]): void => {
      const key: keyof IRepeaterRaw = entry[0] as keyof IRepeaterRaw;
      const value: string | number | undefined = entry[1];
      if (columns[key]!.length === 1 && columns[key]![0] === '' && value === '') {
        // @ts-ignore
        row[key] = 'yes';
      }
    });
  });

  result.sort((a: IRepeaterRaw, b: IRepeaterRaw): number => {
    const aMi: string = numberToString(a.Mi || 0, 4, 5);
    const bMi: string = numberToString(b.Mi || 0, 4, 5);
    const aName: string | undefined = a.Call;
    const bName: string | undefined = b.Call;
    const aFrequency: string = numberToString(a.Frequency || 0, 4, 5);
    const bFrequency: string = numberToString(b.Frequency || 0, 4, 5);
    const aStr: string = `${aMi} ${aName} ${aFrequency}`;
    const bStr: string = `${bMi} ${bName} ${bFrequency}`;
    return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
  });
  // result.sort((a, b) => {(a.Call > b.Call ? 1 : a.Call < b.Call ? -1 : 0));
  // result.sort((a, b) => (a.Frequency - b.Frequency));
  // result.sort((a, b) => (a.Mi - b.Mi));

  // console.log(place, distance, result.length);

  const parts: string[] = place.toString().split(`,`);
  const subPlace: string = `${(parts[1] || '.').trim()}/${parts[0].trim()}`;

  log(chalk.yellow('Results'), result.length, subPlace);

  await writeToJsonAndCsv(`../data/repeaters/results/${subPlace}`, result);
}
