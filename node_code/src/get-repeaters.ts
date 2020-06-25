import 'module-alias/register';

import { program } from 'commander';
import { createLog } from '@helpers/log-helpers';
import { RepeaterRaw } from '@interfaces/repeater-raw';
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

  const promises: Promise<void>[] = [];

  const scraper: Scraper = new Scraper(place, distance);

  const repeaters: RepeaterRaw[] = await scraper.scrape();

  const columns: { [key in keyof Partial<RepeaterRaw>]: (string | number | undefined)[] } = {};
  repeaters.forEach((row: RepeaterRaw): void => {
    Object.entries(row).forEach((entry: [string, (string | number | undefined)]): void => {
      const key: keyof RepeaterRaw = entry[0] as keyof RepeaterRaw;
      const value: string | number | undefined = entry[1];
      if (!columns[key]) {
        columns[key] = [];
      }
      if (columns[key]!.indexOf(value) === -1) {
        columns[key]!.push(value);
      }
    });
  });

  repeaters.forEach((row: RepeaterRaw): void => {
    Object.entries(row).forEach((entry: [string, (string | number | undefined)]): void => {
      const key: keyof RepeaterRaw = entry[0] as keyof RepeaterRaw;
      const value: string | number | undefined = entry[1];
      if (columns[key]!.length === 1 && columns[key]![0] === '' && value === '') {
        // @ts-ignore
        row[key] = true;
      }
    });
    // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
    promises.push(writeToJson(`../data/repeaters/scraped/json/${row.state_id}/${row.ID}`, row));
    promises.push(writeToCsv(`../data/repeaters/scraped/csv/${row.state_id}/${row.ID}`, row));
  });

  const stateCity: string[] = place.toString().split(`,`);
  const placePath: string = `${(stateCity[1] || '.').trim()}/${stateCity[0].trim()}`;

  log(chalk.yellow('Scraped'), repeaters.length, placePath);

  // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
  promises.push(writeToJson(`../data/repeaters/scraped/json/${placePath}`, repeaters));
  promises.push(writeToCsv(`../data/repeaters/scraped/csv/${placePath}`, repeaters));

  await Promise.all(promises);
}
