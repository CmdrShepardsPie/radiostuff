"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@helpers/helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const jsdom_1 = require("jsdom");
const helper_1 = require("./helper");
const cache_helper_1 = require("@helpers/cache-helper");
const { log, write } = log_helpers_1.createOut("Scraper");
// const write = createWrite("Scraper");
class Scraper {
    constructor(location, distance) {
        this.location = location;
        this.distance = distance;
        this.data = [];
        log(chalk_1.default.green("New Scraper"), location, distance);
        this.url = `https://www.repeaterbook.com/repeaters/prox_result.php?city=${encodeURIComponent(location.toString())}&distance=${distance}&Dunit=m&band1=%25&band2=&freq=&call=&features%5B%5D=&status_id=%25&use=%25&order=distance_calc%2C+state_id%2C+%60call%60+ASC`;
    }
    async process() {
        log(chalk_1.default.green("Process"));
        const parts = this.location.toString().split(`,`);
        const baseKey = `${(parts[1] || ".").trim()}/${parts[0].trim()}.html`;
        const page = await this.getUrl(this.url, baseKey);
        const dom = new jsdom_1.JSDOM(page);
        await this.getRepeaterList(dom.window.document);
        return this.data;
    }
    async getRepeaterList(document) {
        log(chalk_1.default.green("Get Repeater List"));
        const table = document.querySelector("table.w3-table.w3-striped.w3-responsive");
        if (table) {
            const rows = [...table.querySelectorAll("tbody > tr")];
            const headerRow = rows.shift();
            if (headerRow) {
                const headerCells = [...headerRow.querySelectorAll("th")];
                const headers = headerCells.map((th) => helper_1.getText(th));
                for (const row of rows) {
                    const data = {};
                    const cells = [...row.querySelectorAll("td")];
                    cells.forEach((td, index) => {
                        data[headers[index]] = helper_1.getTextOrNumber(td);
                    });
                    const link = cells[0].querySelector("a");
                    if (link) {
                        // write("^");
                        Object.assign(data, await this.getRepeaterDetails(link.href));
                        // write("_");
                    }
                    this.data.push(data);
                }
            }
        }
    }
    async getRepeaterDetails(href) {
        const urlParams = href.split("?")[1];
        const keyParts = urlParams.match(/state_id=(\d+)&ID=(\d+)/) || [];
        const key = `${keyParts[1]}/${keyParts[2]}.html`;
        const page = await this.getUrl(`https://www.repeaterbook.com/repeaters/${href}`, key);
        const dom = new jsdom_1.JSDOM(page);
        const data = {};
        data.state_id = keyParts[1];
        data.ID = keyParts[2];
        const menus = [...dom.window.document.querySelectorAll("#cssmenu a")];
        const locationRegex = /(-?\d*\.?\d*)\+(-?\d*\.?\d*)/i;
        for (const menu of menus) {
            const locationMatch = menu.href.match(locationRegex);
            if (locationMatch) {
                const lat = helper_1.getNumber(locationMatch[1]);
                const long = helper_1.getNumber(locationMatch[2]);
                if (!isNaN(lat)) {
                    data.Latitude = lat;
                }
                if (!isNaN(long)) {
                    data.Longitude = long;
                }
                break;
            }
        }
        const table = dom.window.document.querySelector("table.w3-table.w3-responsive");
        if (table) {
            const rows = [...table.querySelectorAll("tbody > tr")];
            for (const row of rows) {
                const cells = [...row.querySelectorAll("td")];
                const title = helper_1.getText(cells[0]);
                const value = helper_1.getTextOrNumber(cells[1]);
                const dataKey = title.split(":")[0].trim();
                const dataVal = title.split(":")[1];
                let updated;
                if (dataVal) {
                    const date = dataVal.match(/(\d{4}-\d{2}-\d{2})/);
                    if (date && date[1]) {
                        updated = date[1];
                    }
                }
                data[dataKey] = updated || value;
            }
        }
        return data;
    }
    async getUrl(url, cacheKey) {
        write(` ${(cacheKey || url).replace(".html", "")}:`);
        // log(chalk.green("Get URL"), url, cacheKey);
        const cache = await cache_helper_1.getCache(cacheKey || url);
        if (cache) {
            // log(chalk.yellow("Cached"), url, cacheKey);
            write(chalk_1.default.green("G"));
            return cache;
        }
        else {
            // Slow down the requests a little bit so we"re not hammering the server or triggering any anti-bot or DDoS protections
            const waitTime = (5000 + (Math.random() * 10000));
            write(`W=${chalk_1.default.yellow(Math.round(waitTime / 1000))}`);
            await helpers_1.wait(waitTime);
            // log(chalk.yellow("Get"), url);
            const request = await axios_1.default.get(url);
            // log(chalk.green("Got"), url);
            write(chalk_1.default.cyan("S"));
            const data = request.data;
            await cache_helper_1.setCache(cacheKey || url, data);
            return data;
        }
    }
}
exports.default = Scraper;
