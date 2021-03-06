import { wait } from '@helpers/helpers';
import { createOut } from '@helpers/log-helpers';
import { RepeaterRaw } from '@interfaces/repeater-raw';
import Axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import { getNumber, getText, getTextOrNumber } from './helper';
import {deleteCache, getCache, setCache} from '@helpers/cache-helper';

const { log, write }: { log: (...msg: any[]) => void; write: (...msg: any[]) => void } = createOut('Scraper');
// const write = createWrite("Scraper");

export default class Scraper {
  private data: RepeaterRaw[] = [];

  private readonly url: string;

  constructor(private location: string | number, private distance: number) {
    log(chalk.green('New Scraper'), location, distance);
    // `https://www.repeaterbook.com/repeaters/prox_result.php?city=Denver%2C%20CO&lat=&long=&distance=200&Dunit=m&band1=%25&band2=&freq=&call=&features%5B%5D=FM&features%5B%5D=AllStar&features%5B%5D=Autopatch&features%5B%5D=Epower&features%5B%5D=EchoLink&features%5B%5D=IRLP&features%5B%5D=WIRES&features%5B%5D=WX&features%5B%5D=DStar&features%5B%5D=DMR&features%5B%5D=NXDN&features%5B%5D=P25&features%5B%5D=YSF&status_id=%25&use=%25&order=distance_calc%2C%2Bstate_id%2C%2B%60call%60%2BASC`
    // `https://www.repeaterbook.com/repeaters/prox_result.php?city=Denver%2C+CO&lat=&long=&distance=200&Dunit=m&band1=%25&band2=&freq=&call=&features%5B%5D=FM&features%5B%5D=AllStar&features%5B%5D=Autopatch&features%5B%5D=Epower&features%5B%5D=EchoLink&features%5B%5D=IRLP&features%5B%5D=WIRES&features%5B%5D=WX&features%5B%5D=DStar&features%5B%5D=DMR&features%5B%5D=NXDN&features%5B%5D=P25&features%5B%5D=YSF&status_id=%25&use=%25&order=distance_calc%2C+state_id%2C+%60call%60+ASC`
    const baseUrl: string = 'https://www.repeaterbook.com/repeaters/prox_result.php';
    const params: [string, string | number][] = [
      ['city', location],
      ['lat', ''],
      ['long', ''],
      ['distance', distance],
      ['Dunit', 'm'],
      ['band1', '%'],
      ['band2', ''],
      ['freq', ''],
      ['call', ''],
      ['features[]', 'FM'],
      ['features[]', 'AllStar'],
      ['features[]', 'Autopatch'],
      ['features[]', 'Epower'],
      ['features[]', 'EchoLink'],
      ['features[]', 'IRLP'],
      ['features[]', 'WIRES'],
      ['features[]', 'WX'],
      ['features[]', 'DStar'],
      ['features[]', 'DMR'],
      ['features[]', 'NXDN'],
      ['features[]', 'P25'],
      ['features[]', 'YSF'],
      ['status_id', '%'],
      ['use', '%'],
      ['order', 'distance_calc,+state_id,+`call`+ASC'],
    ];

    const query: string[] = params.map((param: [string, (string | number)]): string => `${param[0]}=${param[1]}`);

    this.url = `${baseUrl}?${query.join('&')}`;
    log('url', this.url);
  }

  // TODO: Make observable or event driven
  public async scrape(): Promise<RepeaterRaw[]> {
    log(chalk.green('Process'));

    const parts: string[] = this.location.toString().split(`,`);
    const key: string = `${(parts[1] || '.').trim()}/${parts[0].trim()}.html`;
    const page: string | undefined = await this.getUrl(this.url, key);
    if (!page) {
      return [];
    }
    const dom: JSDOM = new JSDOM(page);
    await this.getRepeaterList(dom.window.document);
    return this.data;
  }

  private async getRepeaterList(document: Document): Promise<void> {
    log(chalk.green('Get Repeater List'));

    const table: HTMLTableElement | null = document.querySelector('table.w3-table.w3-striped.w3-responsive');
    if (table) {
      const rows: HTMLTableRowElement[] = [...table.querySelectorAll<HTMLTableRowElement>('tbody > tr')];
      const headerRow: any | undefined = rows.shift();
      if (headerRow) {
        const headerCells: HTMLTableHeaderCellElement[] = [...headerRow.querySelectorAll('th')];
        const headers: string[] = headerCells.map((th: HTMLTableHeaderCellElement): string => getText(th));
        for (const row of rows) {
          const data: { [key: string]: string | number | undefined } = {};
          const cells: HTMLTableDataCellElement[] = [...row.querySelectorAll('td')];
          cells.forEach((td: HTMLTableDataCellElement, index: number): void => {
            data[headers[index]] = getTextOrNumber(td);
          });
          const link: HTMLAnchorElement | null = cells[0].querySelector('a');
          if (link) {
            // write("^");
            Object.assign(data, await this.getRepeaterDetails(link.href));
            // write("_");
          }
          if (data.Latitude && data.Longitude) {
            this.data.push(data as any as RepeaterRaw);
          }
        }
      }
    }
  }

  private async getRepeaterDetails(href: string): Promise<RepeaterRaw | undefined> {
    const urlParams: string = href.split('?')[1];
    const keyParts: RegExpMatchArray = urlParams.match(/state_id=(\d+)&ID=(\d+)/) || [];
    const key: string = `${keyParts[1]}/${keyParts[2]}.html`;
    const page: string | undefined = await this.getUrl(`https://www.repeaterbook.com/repeaters/${href}`, key);
    if (!page) {
      return;
    }
    const dom: JSDOM = new JSDOM(page);
    const data: { [key: string]: string | number | undefined } = {};
    data.state_id = keyParts[1];
    data.ID = keyParts[2];
    // const menus: HTMLAnchorElement[] = [...dom.window.document.querySelectorAll<HTMLAnchorElement>('#cssmenu a')];
    const locationRegex: RegExp = /marker\(\[(-?\d+\.?\d*), (-?\d+\.?\d*)\]/i;
    const locationMatch: RegExpMatchArray | null = page.match(locationRegex);
    if (locationMatch) {
      const lat: number = getNumber(locationMatch[1]);
      const long: number = getNumber(locationMatch[2]);
      if (!isNaN(lat)) {
        data.Latitude = lat;
      }
      if (!isNaN(long)) {
        data.Longitude = long;
      }
    }
    // for (const menu of menus) {
    //   const locationMatch: RegExpMatchArray | null = menu.href.match(locationRegex);
    //   if (locationMatch) {
    //     const lat: number = getNumber(locationMatch[1]);
    //     const long: number = getNumber(locationMatch[2]);
    //     if (!isNaN(lat)) {
    //       data.Latitude = lat;
    //     }
    //     if (!isNaN(long)) {
    //       data.Longitude = long;
    //     }
    //     break;
    //   }
    // }
    const table: Element | null = dom.window.document.querySelector('table.w3-table.w3-responsive');
    if (table) {
      const rows: HTMLTableRowElement[] = [...table.querySelectorAll<HTMLTableRowElement>('tbody > tr')];
      for (const row of rows) {
        const cells: HTMLTableDataCellElement[] = [...row.querySelectorAll('td')];
        const title: string = getText(cells[0]);
        const value: number | string = getTextOrNumber(cells[1]);
        const dataKey: string = title.split(':')[0].trim();
        const dataVal: string = title.split(':')[1];
        let updated: number | string | undefined;
        if (dataVal) {
          const date: RegExpMatchArray | null = dataVal.match(/(\d{4}-\d{2}-\d{2})/);
          if (date && date[1]) {
            updated = date[1];
          }
        }
        data[dataKey] = updated || value;
      }
    }
    return data as any as RepeaterRaw;
  }

  private async getUrl(url: string, key: string): Promise<string | undefined> {
    log(chalk.green('Get URL'), key || url);
    let data;


    try {
      data = await this.getUrlFromCache(url, key, false);
      if (!data) {
        data = await this.getUrlFromServer(url, key);
      }
      if (!data) {
        data = await this.getUrlFromCache(url, key, true);
      }
    } catch (error) {
      const refreshUrl = error.message;
      const refreshKey = key.replace('.html', '-refresh.html');
      data = await this.getUrlFromCache(refreshUrl, refreshKey, false);
      if (!data) {
        data = await this.getUrlFromServer(refreshUrl, refreshKey);
      }
      if (!data) {
        data = await this.getUrlFromCache(refreshUrl, refreshKey, true);
      }
    }
    return data;
  }

  private async getUrlFromCache(url: string, key: string, ignoreAge: boolean = false): Promise<string | undefined> {
    log(chalk.green('Get URL From Cache'), key || url);

    let data: string | undefined = await getCache(key || url, ignoreAge);

    if (data) {
      log(chalk.yellow('Cache Got'), key || url);

      const refreshRegex = /meta http-equiv='refresh' content='0;URL=([^']*)'>/i;
      const refreshMatch = data.match(refreshRegex);
      if (refreshMatch && refreshMatch[1]) {
        log(chalk.red('Refresh'), key || url, chalk.red('=>'), refreshMatch[1]);
        throw new Error(refreshMatch[1]);
      }

      return data;
    }
  }

  private async getUrlFromServer(url: string, key: string): Promise<string | undefined> {
    log(chalk.green('Get URL From Server'), key || url);

    const request: AxiosResponse<string> = await Axios.get(url);
    log(chalk.yellow('URL Got'), key || url);

    const data: string = request.data;

    const refreshRegex = /meta http-equiv='refresh' content='0;URL=([^']*)'>/i;
    const refreshMatch = data.match(refreshRegex);
    if (refreshMatch && refreshMatch[1]) {
      log(chalk.red('Refresh'), key || url, chalk.red('=>'), refreshMatch[1]);
      throw new Error(refreshMatch[1]);
    }

    await setCache(key || url, data);
    log(chalk.cyan('Cache Set'), key || url);
    return data;

  }
}
