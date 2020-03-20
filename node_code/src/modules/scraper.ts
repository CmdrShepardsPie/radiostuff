import {dirExists, makeDirs, readFileAsync, statAsync, writeFileAsync} from "@helpers/fs-helpers";
import { wait } from "@helpers/helpers";
import { createOut } from "@helpers/log-helpers";
import { IRepeaterRaw } from "@interfaces/i-repeater-raw";
import Axios, { AxiosResponse } from "axios";
import chalk from "chalk";
import { JSDOM } from "jsdom";
import { getNumber, getText, getTextOrNumber } from "./helper";
import {Stats} from "fs";

const { log, write }: { log: (...msg: any[]) => void; write: (...msg: any[]) => void } = createOut("Scraper");
// const write = createWrite("Scraper");

export default class Scraper {
  private data: IRepeaterRaw[] = [];
  private cacheStart: number = Date.now();

  private readonly url: string;

  constructor(private location: string | number, private distance: number) {
    log(chalk.green("New Scraper"), location, distance);
    this.url = `https://www.repeaterbook.com/repeaters/prox_result.php?city=${encodeURIComponent(location.toString())}&distance=${distance}&Dunit=m&band1=%25&band2=&freq=&call=&features%5B%5D=&status_id=%25&use=%25&order=distance_calc%2C+state_id%2C+%60call%60+ASC`;
  }

  public async process(): Promise<IRepeaterRaw[]> {
    log(chalk.green("Process"));

    const parts: string[] = this.location.toString().split(`,`);
    const baseKey: string = `${(parts[1] || ".").trim()}/${parts[0].trim()}.html`;
    const page: string = await this.getUrl(this.url, baseKey);
    const dom: JSDOM = new JSDOM(page);
    await this.getRepeaterList(dom.window.document);
    return this.data;
  }

  private async getRepeaterList(document: Document): Promise<void> {
    log(chalk.green("Get Repeater List"));

    const table: HTMLTableElement | null = document.querySelector("table.w3-table.w3-striped.w3-responsive");
    if (table) {
      const rows: HTMLTableRowElement[] = [...table.querySelectorAll<HTMLTableRowElement>("tbody > tr")];
      const headerRow: any | undefined = rows.shift();
      if (headerRow) {
        const headerCells: HTMLTableHeaderCellElement[] = [...headerRow.querySelectorAll("th")];
        const headers: string[] = headerCells.map((th: HTMLTableHeaderCellElement) => getText(th));
        for (const row of rows) {
          const data: { [key: string]: string | number | undefined } = {};
          const cells: HTMLTableDataCellElement[] = [...row.querySelectorAll("td")];
          cells.forEach((td: HTMLTableDataCellElement, index: number) => data[headers[index]] = getTextOrNumber(td));
          const link: HTMLAnchorElement | null = cells[0].querySelector("a");
          if (link) {
            write("^");
            Object.assign(data, await this.getRepeaterDetails(link.href));
            write("_");
          }
          this.data.push(data as any as IRepeaterRaw);
        }
      }
    }
  }

  private async getRepeaterDetails(href: string): Promise<IRepeaterRaw> {
    const urlParams: string = href.split("?")[1];
    const keyParts: RegExpMatchArray = urlParams.match(/state_id=(\d+)&ID=(\d+)/) || [];
    const key: string = `${keyParts[1]}/${keyParts[2]}.html`;
    const page: string = await this.getUrl(`https://www.repeaterbook.com/repeaters/${href}`, key);
    const dom: JSDOM = new JSDOM(page);
    const data: { [key: string]: string | number | undefined } = {};
    data.state_id = keyParts[1];
    data.ID = keyParts[2];
    const menus: HTMLAnchorElement[] = [...dom.window.document.querySelectorAll<HTMLAnchorElement>("#cssmenu a")];
    const locationRegex: RegExp = /(-?\d*\.?\d*)\+(-?\d*\.?\d*)/i;
    for (const menu of menus) {
      const locationMatch: RegExpMatchArray | null = menu.href.match(locationRegex);
      if (locationMatch) {
        const lat: number = getNumber(locationMatch[1]);
        const long: number = getNumber(locationMatch[2]);
        if (!isNaN(lat)) {
          data.Latitude = lat;
        }
        if (!isNaN(long)) {
          data.Longitude = long;
        }
        break;
      }
    }
    const table: Element | null = dom.window.document.querySelector("table.w3-table.w3-responsive");
    if (table) {
      const rows: HTMLTableRowElement[] = [...table.querySelectorAll<HTMLTableRowElement>("tbody > tr")];
      for (const row of rows) {
        const cells: HTMLTableDataCellElement[] = [...row.querySelectorAll("td")];
        const title: string = getText(cells[0]);
        const value: number | string = getTextOrNumber(cells[1]);
        const dataKey: string = title.split(":")[0].trim();
        const dataVal: string = title.split(":")[1];
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
    return data as any as IRepeaterRaw;
  }

  private async getCache(key: string): Promise<string | undefined> {
    const file: string = `../data/repeaters/_cache/${key}`;
    if (await dirExists(file)) {
      const stat: Stats = await statAsync(file);
      const diff: number = (this.cacheStart - stat.mtimeMs) / 1000 / 60 / 60;
      if (diff >= 24) {
        write("X");
        return;
      }
      return (await readFileAsync(file)).toString();
    }
  }

  private async setCache(key: string, value: string): Promise<void> {
    const file: string = `../data/repeaters/_cache/${key}`;
    await makeDirs(file);
    return writeFileAsync(file, value);
  }

  private async getUrl(url: string, cacheKey?: string): Promise<string> {
    // log(chalk.green("Get URL"), url, cacheKey);

    const cache: string | undefined = await this.getCache(cacheKey || url);
    if (cache) {
      // log(chalk.yellow("Cached"), url, cacheKey);
      write("<");
      return cache;
    } else {
      // Slow down the requests a little bit so we"re not hammering the server or triggering any anti-bot or DDoS protections
      const waitTime: number = (5000 + (Math.random() * 10000));

      await wait(waitTime);
      // log(chalk.yellow("Get"), url);
      const request: AxiosResponse<string> = await Axios.get(url);
      // log(chalk.green("Got"), url);
      write(">");

      const data: string = request.data;
      await this.setCache(cacheKey || url, data);
      return data;
    }
  }
}
