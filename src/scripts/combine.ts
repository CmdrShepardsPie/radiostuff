import { getAllFilesFromDirectory, writeToJsonAndCsv } from '@helpers/fs-helpers';
import { numberToString } from '@helpers/helpers';
import { createLog } from '@helpers/log-helpers';
import { IRepeaterRaw } from '@interfaces/i-repeater-raw';
import gpsDistance, { Point } from 'gps-distance';

const log: (...msg: any[]) => void = createLog('Combine');

export default (async (): Promise<void> => {
  const myPoint: Point = [39.627071500, -104.893322500]; // 4982 S Ulster St
  const combined: IRepeaterRaw[] = [];
  const files: IRepeaterRaw[][] = await getAllFilesFromDirectory<IRepeaterRaw[]>('data/repeaters/results/CO');
  log('Got', files.length, 'files');
  const found: { [key: string]: boolean | undefined } = {};
  files.forEach((file: IRepeaterRaw[]) => {
    log('Got', file.length, 'repeaters');
    file.forEach((item: IRepeaterRaw) => {
      if (!found[`${item.state_id}-${item.ID}`]) {
        found[`${item.state_id}-${item.ID}`] = true;
        combined.push(item);
        if (typeof item.Latitude === 'number' && typeof item.Longitude === 'number') {
          const distance: number = gpsDistance([myPoint, [item.Latitude, item.Longitude]]);
          item.Mi = distance * 0.62137119;
        }
      }
    });
  });
  log('Got', combined.length, 'unique repeaters');
  combined.sort((a: IRepeaterRaw, b: IRepeaterRaw) => {
    const aMi: string = numberToString(a.Mi || 0, 4, 24);
    const bMi: string = numberToString(b.Mi || 0, 4, 24);
    const aRepeaterName: string | undefined = a.Call;
    const bRepeaterName: string | undefined = b.Call;
    const aFrequency: string = numberToString(a.Frequency || 0, 4, 5);
    const bFrequency: string = numberToString(b.Frequency || 0, 4, 5);
    const aStr: string = `${aMi} ${aRepeaterName} ${aFrequency}`;
    const bStr: string = `${bMi} ${bRepeaterName} ${bFrequency}`;

    return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
  });
  const stats: { [ key: string]: number } = combined.reduce((result: { [ key: string ]: number }, data: IRepeaterRaw) => {
    const freq: string = Math.round(data.Frequency || 0).toString();
    const pow: number = Math.pow(10, Math.max(freq.length - 2, 0)) * 2;
    const group: number = Math.round((data.Frequency || 0) / pow) * pow;
    // console.log(freq, pow, group);
    const count: number = result[group] || 0;
    return { ...result, [group]: count + 1 };
  }, {});
  // tslint:disable-next-line:no-console
  console.log('STATS', stats);
  // combined.slice(0, 100).forEach((c) => log(c.Call, "\t", c.Latitude, "\t", c.Longitude, "\t", c.Mi));
  await writeToJsonAndCsv('data/repeaters/combined/CO', combined);
})();
