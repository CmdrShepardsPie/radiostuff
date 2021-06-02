var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/log-helpers", "axios", "chalk", "jsdom", "./helper", "@helpers/cache-helper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const log_helpers_1 = require("@helpers/log-helpers");
    const axios_1 = __importDefault(require("axios"));
    const chalk_1 = __importDefault(require("chalk"));
    const jsdom_1 = require("jsdom");
    const helper_1 = require("./helper");
    const cache_helper_1 = require("@helpers/cache-helper");
    const { log, write } = log_helpers_1.createOut('Scraper');
    // const write = createWrite("Scraper");
    class Scraper {
        location;
        distance;
        data = [];
        url;
        constructor(location, distance) {
            this.location = location;
            this.distance = distance;
            log(chalk_1.default.green('New Scraper'), location, distance);
            // `https://www.repeaterbook.com/repeaters/prox_result.php?city=Denver%2C%20CO&lat=&long=&distance=200&Dunit=m&band1=%25&band2=&freq=&call=&features%5B%5D=FM&features%5B%5D=AllStar&features%5B%5D=Autopatch&features%5B%5D=Epower&features%5B%5D=EchoLink&features%5B%5D=IRLP&features%5B%5D=WIRES&features%5B%5D=WX&features%5B%5D=DStar&features%5B%5D=DMR&features%5B%5D=NXDN&features%5B%5D=P25&features%5B%5D=YSF&status_id=%25&use=%25&order=distance_calc%2C%2Bstate_id%2C%2B%60call%60%2BASC`
            // `https://www.repeaterbook.com/repeaters/prox_result.php?city=Denver%2C+CO&lat=&long=&distance=200&Dunit=m&band1=%25&band2=&freq=&call=&features%5B%5D=FM&features%5B%5D=AllStar&features%5B%5D=Autopatch&features%5B%5D=Epower&features%5B%5D=EchoLink&features%5B%5D=IRLP&features%5B%5D=WIRES&features%5B%5D=WX&features%5B%5D=DStar&features%5B%5D=DMR&features%5B%5D=NXDN&features%5B%5D=P25&features%5B%5D=YSF&status_id=%25&use=%25&order=distance_calc%2C+state_id%2C+%60call%60+ASC`
            const baseUrl = 'https://www.repeaterbook.com/repeaters/prox_result.php';
            const params = [
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
            const query = params.map((param) => `${param[0]}=${param[1]}`);
            this.url = `${baseUrl}?${query.join('&')}`;
            log('url', this.url);
        }
        // TODO: Make observable or event driven
        async scrape() {
            log(chalk_1.default.green('Process'));
            const parts = this.location.toString().split(`,`);
            const key = `${(parts[1] || '.').trim()}/${parts[0].trim()}.html`;
            const page = await this.getUrl(this.url, key);
            if (!page) {
                return [];
            }
            const dom = new jsdom_1.JSDOM(page);
            await this.getRepeaterList(dom.window.document);
            return this.data;
        }
        async getRepeaterList(document) {
            log(chalk_1.default.green('Get Repeater List'));
            const table = document.querySelector('table.w3-table.w3-striped.w3-responsive');
            if (table) {
                const rows = [...table.querySelectorAll('tbody > tr')];
                const headerRow = rows.shift();
                if (headerRow) {
                    const headerCells = [...headerRow.querySelectorAll('th')];
                    const headers = headerCells.map((th) => helper_1.getText(th));
                    for (const row of rows) {
                        const data = {};
                        const cells = [...row.querySelectorAll('td')];
                        cells.forEach((td, index) => {
                            data[headers[index]] = helper_1.getTextOrNumber(td);
                        });
                        const link = cells[0].querySelector('a');
                        if (link) {
                            // write("^");
                            Object.assign(data, await this.getRepeaterDetails(link.href));
                            // write("_");
                        }
                        if (data.Latitude && data.Longitude) {
                            this.data.push(data);
                        }
                    }
                }
            }
        }
        async getRepeaterDetails(href) {
            const urlParams = href.split('?')[1];
            const keyParts = urlParams.match(/state_id=(\d+)&ID=(\d+)/) || [];
            const key = `${keyParts[1]}/${keyParts[2]}.html`;
            const page = await this.getUrl(`https://www.repeaterbook.com/repeaters/${href}`, key);
            if (!page) {
                return;
            }
            const dom = new jsdom_1.JSDOM(page);
            const data = {};
            data.state_id = keyParts[1];
            data.ID = keyParts[2];
            // const menus: HTMLAnchorElement[] = [...dom.window.document.querySelectorAll<HTMLAnchorElement>('#cssmenu a')];
            const locationRegex = /marker\(\[(-?\d+\.?\d*), (-?\d+\.?\d*)\]/i;
            const locationMatch = page.match(locationRegex);
            if (locationMatch) {
                const lat = helper_1.getNumber(locationMatch[1]);
                const long = helper_1.getNumber(locationMatch[2]);
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
            const table = dom.window.document.querySelector('table.w3-table.w3-responsive');
            if (table) {
                const rows = [...table.querySelectorAll('tbody > tr')];
                for (const row of rows) {
                    const cells = [...row.querySelectorAll('td')];
                    const title = helper_1.getText(cells[0]);
                    const value = helper_1.getTextOrNumber(cells[1]);
                    const dataKey = title.split(':')[0].trim();
                    const dataVal = title.split(':')[1];
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
        async getUrl(url, key) {
            log(chalk_1.default.green('Get URL'), key || url);
            let data;
            try {
                data = await this.getUrlFromCache(url, key, false);
                if (!data) {
                    data = await this.getUrlFromServer(url, key);
                }
                if (!data) {
                    data = await this.getUrlFromCache(url, key, true);
                }
            }
            catch (error) {
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
        async getUrlFromCache(url, key, ignoreAge = false) {
            log(chalk_1.default.green('Get URL From Cache'), key || url);
            let data = await cache_helper_1.getCache(key || url, ignoreAge);
            if (data) {
                log(chalk_1.default.yellow('Cache Got'), key || url);
                const refreshRegex = /meta http-equiv='refresh' content='0;URL=([^']*)'>/i;
                const refreshMatch = data.match(refreshRegex);
                if (refreshMatch && refreshMatch[1]) {
                    log(chalk_1.default.red('Refresh'), key || url, chalk_1.default.red('=>'), refreshMatch[1]);
                    throw new Error(refreshMatch[1]);
                }
                return data;
            }
        }
        async getUrlFromServer(url, key) {
            log(chalk_1.default.green('Get URL From Server'), key || url);
            const request = await axios_1.default.get(url);
            log(chalk_1.default.yellow('URL Got'), key || url);
            const data = request.data;
            const refreshRegex = /meta http-equiv='refresh' content='0;URL=([^']*)'>/i;
            const refreshMatch = data.match(refreshRegex);
            if (refreshMatch && refreshMatch[1]) {
                log(chalk_1.default.red('Refresh'), key || url, chalk_1.default.red('=>'), refreshMatch[1]);
                throw new Error(refreshMatch[1]);
            }
            await cache_helper_1.setCache(key || url, data);
            log(chalk_1.default.cyan('Cache Set'), key || url);
            return data;
        }
    }
    exports.default = Scraper;
});
//# sourceMappingURL=scraper.js.map