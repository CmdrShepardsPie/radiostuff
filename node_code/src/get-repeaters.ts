import 'module-alias/register';

import { program } from 'commander';
import { numberToString } from '@helpers/helpers';
import { createLog } from '@helpers/log-helpers';
import { IRepeaterRaw } from '@interfaces/i-repeater-raw';
import chalk from 'chalk';
import Scraper from './modules/scraper';
import { writeToCsv, writeToJson } from '@helpers/fs-helpers';

const log: (...msg: any[]) => void = createLog('Get Repeaters');

log('Program Setup');

program
  .version('0.0.1')
  .arguments('<location>')
  .action(async (location: string): Promise<void> => {
    log('Program Action');
    if (location) {
      await getRepeaters(location, 200);
    }
  });

log('Program Parse Args');

program.parse(process.argv);

async function getRepeaters(place: string | number, distance: number): Promise<void> {
  log(chalk.green('getRepeaters'), place, distance);

  const scraper: Scraper = new Scraper(place, distance);

  const repeaters: IRepeaterRaw[] = await scraper.scrape();

  const columns: { [key in keyof Partial<IRepeaterRaw>]: (string | number | undefined)[] } = {};
  repeaters.forEach((row: IRepeaterRaw): void => {
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

  await Promise.all(repeaters.map(async (row: IRepeaterRaw): Promise<void> => {
    Object.entries(row).forEach((entry: [string, (string | number | undefined)]): void => {
      const key: keyof IRepeaterRaw = entry[0] as keyof IRepeaterRaw;
      const value: string | number | undefined = entry[1];
      if (columns[key]!.length === 1 && columns[key]![0] === '' && value === '') {
        // @ts-ignore
        row[key] = true;
      }
    });
    await writeToJson(`../data/repeaters/scraped/json/${row.state_id}/${row.ID}`, row);
    await writeToCsv(`../data/repeaters/scraped/csv/${row.state_id}/${row.ID}`, row);
  }));

  const stateCity: string[] = place.toString().split(`,`);
  const placePath: string = `${(stateCity[1] || '.').trim()}/${stateCity[0].trim()}`;

  log(chalk.yellow('Scraped'), repeaters.length, placePath);

  await writeToJson(`../data/repeaters/scraped/json/${placePath}`, repeaters);
  await writeToCsv(`../data/repeaters/scraped/csv/${placePath}`, repeaters);
}
