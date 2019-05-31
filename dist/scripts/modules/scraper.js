"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_helpers_1 = require("@helpers/fs-helpers");
const helpers_1 = require("@helpers/helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const axios_1 = require("axios");
const chalk_1 = require("chalk");
const jsdom_1 = require("jsdom");
const helper_1 = require("./helper");
const { log, write } = log_helpers_1.createOut("Scraper");
// const write = createWrite("Scraper");
class Scraper {
    constructor(location, distance) {
        this.location = location;
        this.distance = distance;
        this.data = [];
        log(chalk_1.default.green("New Scraper"), location, distance);
        this.url = `https://www.repeaterbook.com/repeaters/prox_result.php?city=${encodeURIComponent(location.toString())}&distance=${distance}&Dunit=m&band1=%25&band2=&freq=&call=&features=&status_id=%25&use=%25&order=%60state_id%60%2C+%60loc%60%2C+%60call%60+ASC`;
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
        // const promises = [];
        log(chalk_1.default.green("Get Repeater List"));
        const table = document.querySelector("table.w3-table.w3-striped.w3-responsive");
        if (table) {
            const rows = Array.prototype.slice.apply(table.querySelectorAll("tbody > tr"));
            const headerRow = rows.shift();
            if (headerRow) {
                const headerCells = [...headerRow.querySelectorAll("th")];
                const headers = headerCells.map((th) => helper_1.getText(th));
                for (const row of rows) {
                    const data = {};
                    const cells = [...row.querySelectorAll("td")];
                    cells.forEach((td, index) => data[headers[index]] = helper_1.getTextOrNumber(td));
                    const link = cells[0].querySelector("a");
                    if (link) {
                        write("^");
                        // promises.push(this.getRepeaterDetails(link.href).then((d) => {
                        //   write("_");
                        //   Object.assign(data, d);
                        // }));
                        Object.assign(data, await this.getRepeaterDetails(link.href));
                        write("_");
                    }
                    this.data.push(data);
                }
            }
        }
        // return Promise.all(promises);
    }
    async getRepeaterDetails(href) {
        // log(chalk.green("Get Repeater Details"), href);
        const urlParams = href.split("?")[1];
        const keyParts = urlParams.match(/state_id=(\d+)&ID=(\d+)/) || [];
        const key = `${keyParts[1]}/${keyParts[2]}.html`;
        const page = await this.getUrl(`https://www.repeaterbook.com/repeaters/${href}`, key);
        const dom = new jsdom_1.JSDOM(page);
        const data = {};
        data.state_id = keyParts[1];
        data.ID = keyParts[2];
        const menus = Array.from(dom.window.document.querySelectorAll("#cssmenu a"));
        const locationRegex = /(-?\d*\.?\d*)\+(-?\d*\.?\d*)/i;
        for (const menu of menus) {
            const locationMatch = menu.href.match(locationRegex);
            if (locationMatch) {
                const lat = helper_1.getNumber(locationMatch[1]);
                const long = helper_1.getNumber(locationMatch[2]);
                data.Latitude = isNaN(lat) ? locationMatch[1] : lat;
                data.Longitude = isNaN(long) ? locationMatch[2] : long;
                break;
            }
        }
        const table = dom.window.document.querySelector("table.w3-table.w3-responsive");
        if (table) {
            const rows = Array.prototype.slice.apply(table.querySelectorAll("tbody > tr"));
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
        // log(
        //   data.state_id ? data.state_id : "", "\t",
        //   data.ID ? data.ID : "", "\t",
        //   data.Latitude ? data.Latitude : "", "\t",
        //   data.Longitude ? data.Longitude : "", "\t",
        //   data.Call ? data.Call : "", "\t",
        //   data.Downlink ? data.Downlink : "", "\t",
        //   data.Use ? data.Use : "", "\t",
        //   data["Op Status"] ? data["Op Status"] : "", "\t",
        //   data.Affiliate ? data.Affiliate : "", "\t",
        //   data.Sponsor ? data.Sponsor : "",
        // );
        return data;
    }
    async getCache(key) {
        const file = `data/repeaters/_cache/${key}`;
        if (await fs_helpers_1.dirExists(file)) {
            return (await fs_helpers_1.readFileAsync(file)).toString();
        }
    }
    async setCache(key, value) {
        const file = `data/repeaters/_cache/${key}`;
        await fs_helpers_1.makeDirs(file);
        return fs_helpers_1.writeFileAsync(file, value);
    }
    async getUrl(url, cacheKey) {
        // log(chalk.green("Get URL"), url, cacheKey);
        const cache = await this.getCache(cacheKey || url);
        if (cache) {
            // log(chalk.yellow("Cached"), url, cacheKey);
            write("<");
            return cache;
        }
        else {
            // Slow down the requests a little bit so we're not hammering the server or triggering any anti-bot or DDoS protections
            const waitTime = (1000 + (Math.random() * 5000));
            await helpers_1.wait(waitTime);
            // log(chalk.yellow("Get"), url);
            const request = await axios_1.default.get(url);
            // log(chalk.green("Got"), url);
            write(">");
            const data = request.data;
            await this.setCache(cacheKey || url, data);
            return data;
        }
    }
}
exports.default = Scraper;
