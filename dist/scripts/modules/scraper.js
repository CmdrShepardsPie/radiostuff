var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "axios", "chalk", "jsdom", "./helper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const helpers_1 = require("@helpers/helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const axios_1 = __importDefault(require("axios"));
    const chalk_1 = __importDefault(require("chalk"));
    const jsdom_1 = require("jsdom");
    const helper_1 = require("./helper");
    const { log, write } = log_helpers_1.createOut('Scraper');
    // const write = createWrite("Scraper");
    class Scraper {
        constructor(location, distance) {
            this.location = location;
            this.distance = distance;
            this.data = [];
            log(chalk_1.default.green('New Scraper'), location, distance);
            this.url = `https://www.repeaterbook.com/repeaters/prox_result.php?city=${encodeURIComponent(location.toString())}&distance=${distance}&Dunit=m&band1=%25&band2=&freq=&call=&features=&status_id=%25&use=%25&order=%60state_id%60%2C+%60loc%60%2C+%60call%60+ASC`;
        }
        async process() {
            log(chalk_1.default.green('Process'));
            const parts = this.location.toString().split(`,`);
            const baseKey = `${(parts[1] || '.').trim()}/${parts[0].trim()}.html`;
            const page = await this.getUrl(this.url, baseKey);
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
                        cells.forEach((td, index) => data[headers[index]] = helper_1.getTextOrNumber(td));
                        const link = cells[0].querySelector('a');
                        if (link) {
                            write('^');
                            Object.assign(data, await this.getRepeaterDetails(link.href));
                            write('_');
                        }
                        this.data.push(data);
                    }
                }
            }
        }
        async getRepeaterDetails(href) {
            const urlParams = href.split('?')[1];
            const keyParts = urlParams.match(/state_id=(\d+)&ID=(\d+)/) || [];
            const key = `${keyParts[1]}/${keyParts[2]}.html`;
            const page = await this.getUrl(`https://www.repeaterbook.com/repeaters/${href}`, key);
            const dom = new jsdom_1.JSDOM(page);
            const data = {};
            data.state_id = keyParts[1];
            data.ID = keyParts[2];
            const menus = [...dom.window.document.querySelectorAll('#cssmenu a')];
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
                write('<');
                return cache;
            }
            else {
                // Slow down the requests a little bit so we're not hammering the server or triggering any anti-bot or DDoS protections
                const waitTime = (5000 + (Math.random() * 10000));
                await helpers_1.wait(waitTime);
                // log(chalk.yellow("Get"), url);
                const request = await axios_1.default.get(url);
                // log(chalk.green("Got"), url);
                write('>');
                const data = request.data;
                await this.setCache(cacheKey || url, data);
                return data;
            }
        }
    }
    exports.default = Scraper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY3JpcHRzL21vZHVsZXMvc2NyYXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFBLG9EQUF5RjtJQUN6Riw4Q0FBd0M7SUFDeEMsc0RBQWlEO0lBRWpELGtEQUE2QztJQUM3QyxrREFBMEI7SUFDMUIsaUNBQThCO0lBQzlCLHFDQUErRDtJQUUvRCxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFxRSx1QkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlHLHdDQUF3QztJQUV4QyxNQUFxQixPQUFPO1FBSTFCLFlBQW9CLFFBQXlCLEVBQVUsUUFBZ0I7WUFBbkQsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO1lBSC9ELFNBQUksR0FBbUIsRUFBRSxDQUFDO1lBSWhDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsR0FBRyxHQUFHLCtEQUErRCxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsYUFBYSxRQUFRLDJIQUEySCxDQUFDO1FBQ3BRLENBQUM7UUFFTSxLQUFLLENBQUMsT0FBTztZQUNsQixHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRTVCLE1BQU0sS0FBSyxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVELE1BQU0sT0FBTyxHQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENB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TUFBTSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sMkJBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVPLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBVyxFQUFFLFFBQWlCO1lBQ2pELDhDQUE4QztZQUU5QyxNQUFNLEtBQUssR0FBdUIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUN2RSxJQUFJLEtBQUssRUFBRTtnQkFDVCw4Q0FBOEM7Z0JBQzlDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDWCxPQUFPLEtBQUssQ0FBQzthQUNkO2lCQUFNO2dCQUNMLHVIQUF1SDtnQkFDdkgsTUFBTSxRQUFRLEdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFFMUQsTUFBTSxjQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JCLGlDQUFpQztnQkFDakMsTUFBTSxPQUFPLEdBQTBCLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUQsZ0NBQWdDO2dCQUNoQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRVgsTUFBTSxJQUFJLEdBQVcsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDbEMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7UUFDSCxDQUFDO0tBQ0Y7SUFqSUQsMEJBaUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGlyRXhpc3RzLCBtYWtlRGlycywgcmVhZEZpbGVBc3luYywgd3JpdGVGaWxlQXN5bmMgfSBmcm9tICdAaGVscGVycy9mcy1oZWxwZXJzJztcbmltcG9ydCB7IHdhaXQgfSBmcm9tICdAaGVscGVycy9oZWxwZXJzJztcbmltcG9ydCB7IGNyZWF0ZU91dCB9IGZyb20gJ0BoZWxwZXJzL2xvZy1oZWxwZXJzJztcbmltcG9ydCB7IElSZXBlYXRlclJhdyB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktcmVwZWF0ZXItcmF3JztcbmltcG9ydCBBeGlvcywgeyBBeGlvc1Jlc3BvbnNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCB7IEpTRE9NIH0gZnJvbSAnanNkb20nO1xuaW1wb3J0IHsgZ2V0TnVtYmVyLCBnZXRUZXh0LCBnZXRUZXh0T3JOdW1iZXIgfSBmcm9tICcuL2hlbHBlcic7XG5cbmNvbnN0IHsgbG9nLCB3cml0ZSB9OiB7IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQ7IHdyaXRlOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCB9ID0gY3JlYXRlT3V0KCdTY3JhcGVyJyk7XG4vLyBjb25zdCB3cml0ZSA9IGNyZWF0ZVdyaXRlKFwiU2NyYXBlclwiKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyYXBlciB7XG4gIHByaXZhdGUgZGF0YTogSVJlcGVhdGVyUmF3W10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSB1cmw6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvY2F0aW9uOiBzdHJpbmcgfCBudW1iZXIsIHByaXZhdGUgZGlzdGFuY2U6IG51bWJlcikge1xuICAgIGxvZyhjaGFsay5ncmVlbignTmV3IFNjcmFwZXInKSwgbG9jYXRpb24sIGRpc3RhbmNlKTtcbiAgICB0aGlzLnVybCA9IGBodHRwczovL3d3dy5yZXBlYXRlcmJvb2suY29tL3JlcGVhdGVycy9wcm94X3Jlc3VsdC5waHA/Y2l0eT0ke2VuY29kZVVSSUNvbXBvbmVudChsb2NhdGlvbi50b1N0cmluZygpKX0mZGlzdGFuY2U9JHtkaXN0YW5jZX0mRHVuaXQ9bSZiYW5kMT0lMjUmYmFuZDI9JmZyZXE9JmNhbGw9JmZlYXR1cmVzPSZzdGF0dXNfaWQ9JTI1JnVzZT0lMjUmb3JkZXI9JTYwc3RhdGVfaWQlNjAlMkMrJTYwbG9jJTYwJTJDKyU2MGNhbGwlNjArQVNDYDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKCk6IFByb21pc2U8SVJlcGVhdGVyUmF3W10+IHtcbiAgICBsb2coY2hhbGsuZ3JlZW4oJ1Byb2Nlc3MnKSk7XG5cbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSB0aGlzLmxvY2F0aW9uLnRvU3RyaW5nKCkuc3BsaXQoYCxgKTtcbiAgICBjb25zdCBiYXNlS2V5OiBzdHJpbmcgPSBgJHsocGFydHNbMV0gfHwgJy4nKS50cmltKCl9LyR7cGFydHNbMF0udHJpbSgpfS5odG1sYDtcbiAgICBjb25zdCBwYWdlOiBzdHJpbmcgPSBhd2FpdCB0aGlzLmdldFVybCh0aGlzLnVybCwgYmFzZUtleSk7XG4gICAgY29uc3QgZG9tOiBKU0RPTSA9IG5ldyBKU0RPTShwYWdlKTtcbiAgICBhd2FpdCB0aGlzLmdldFJlcGVhdGVyTGlzdChkb20ud2luZG93LmRvY3VtZW50KTtcbiAgICByZXR1cm4gdGhpcy5kYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRSZXBlYXRlckxpc3QoZG9jdW1lbnQ6IERvY3VtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nKGNoYWxrLmdyZWVuKCdHZXQgUmVwZWF0ZXIgTGlzdCcpKTtcblxuICAgIGNvbnN0IHRhYmxlOiBIVE1MVGFibGVFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RhYmxlLnczLXRhYmxlLnczLXN0cmlwZWQudzMtcmVzcG9uc2l2ZScpO1xuICAgIGlmICh0YWJsZSkge1xuICAgICAgY29uc3Qgcm93czogSFRNTFRhYmxlUm93RWxlbWVudFtdID0gWy4uLnRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTFRhYmxlUm93RWxlbWVudD4oJ3Rib2R5ID4gdHInKV07XG4gICAgICBjb25zdCBoZWFkZXJSb3c6IGFueSB8IHVuZGVmaW5lZCA9IHJvd3Muc2hpZnQoKTtcbiAgICAgIGlmIChoZWFkZXJSb3cpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyQ2VsbHM6IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50W10gPSBbLi4uaGVhZGVyUm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJyldO1xuICAgICAgICBjb25zdCBoZWFkZXJzOiBzdHJpbmdbXSA9IGhlYWRlckNlbGxzLm1hcCgodGg6IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KSA9PiBnZXRUZXh0KHRoKSk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICBjb25zdCBkYXRhOiB7IFsga2V5OiBzdHJpbmcgXTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIH0gPSB7fTtcbiAgICAgICAgICBjb25zdCBjZWxsczogSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50W10gPSBbLi4ucm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyldO1xuICAgICAgICAgIGNlbGxzLmZvckVhY2goKHRkOiBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQsIGluZGV4OiBudW1iZXIpID0+IGRhdGFbaGVhZGVyc1tpbmRleF1dID0gZ2V0VGV4dE9yTnVtYmVyKHRkKSk7XG4gICAgICAgICAgY29uc3QgbGluazogSFRNTEFuY2hvckVsZW1lbnQgfCBudWxsID0gY2VsbHNbMF0ucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgICAgICB3cml0ZSgnXicpO1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihkYXRhLCBhd2FpdCB0aGlzLmdldFJlcGVhdGVyRGV0YWlscyhsaW5rLmhyZWYpKTtcbiAgICAgICAgICAgIHdyaXRlKCdfJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZGF0YS5wdXNoKGRhdGEgYXMgYW55IGFzIElSZXBlYXRlclJhdyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldFJlcGVhdGVyRGV0YWlscyhocmVmOiBzdHJpbmcpOiBQcm9taXNlPElSZXBlYXRlclJhdz4ge1xuICAgIGNvbnN0IHVybFBhcmFtczogc3RyaW5nID0gaHJlZi5zcGxpdCgnPycpWzFdO1xuICAgIGNvbnN0IGtleVBhcnRzOiBSZWdFeHBNYXRjaEFycmF5ID0gdXJsUGFyYW1zLm1hdGNoKC9zdGF0ZV9pZD0oXFxkKykmSUQ9KFxcZCspLykgfHwgW107XG4gICAgY29uc3Qga2V5OiBzdHJpbmcgPSBgJHtrZXlQYXJ0c1sxXX0vJHtrZXlQYXJ0c1syXX0uaHRtbGA7XG4gICAgY29uc3QgcGFnZTogc3RyaW5nID0gYXdhaXQgdGhpcy5nZXRVcmwoYGh0dHBzOi8vd3d3LnJlcGVhdGVyYm9vay5jb20vcmVwZWF0ZXJzLyR7aHJlZn1gLCBrZXkpO1xuICAgIGNvbnN0IGRvbTogSlNET00gPSBuZXcgSlNET00ocGFnZSk7XG4gICAgY29uc3QgZGF0YTogeyBbIGtleTogc3RyaW5nIF06IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB9ID0ge307XG4gICAgZGF0YS5zdGF0ZV9pZCA9IGtleVBhcnRzWzFdO1xuICAgIGRhdGEuSUQgPSBrZXlQYXJ0c1syXTtcbiAgICBjb25zdCBtZW51czogSFRNTEFuY2hvckVsZW1lbnRbXSA9IFsuLi5kb20ud2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEFuY2hvckVsZW1lbnQ+KCcjY3NzbWVudSBhJyldO1xuICAgIGNvbnN0IGxvY2F0aW9uUmVnZXg6IFJlZ0V4cCA9IC8oLT9cXGQqXFwuP1xcZCopXFwrKC0/XFxkKlxcLj9cXGQqKS9pO1xuICAgIGZvciAoY29uc3QgbWVudSBvZiBtZW51cykge1xuICAgICAgY29uc3QgbG9jYXRpb25NYXRjaDogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwgPSBtZW51LmhyZWYubWF0Y2gobG9jYXRpb25SZWdleCk7XG4gICAgICBpZiAobG9jYXRpb25NYXRjaCkge1xuICAgICAgICBjb25zdCBsYXQ6IG51bWJlciA9IGdldE51bWJlcihsb2NhdGlvbk1hdGNoWzFdKTtcbiAgICAgICAgY29uc3QgbG9uZzogbnVtYmVyID0gZ2V0TnVtYmVyKGxvY2F0aW9uTWF0Y2hbMl0pO1xuICAgICAgICBpZiAoIWlzTmFOKGxhdCkpIHtcbiAgICAgICAgICBkYXRhLkxhdGl0dWRlID0gbGF0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNOYU4obG9uZykpIHtcbiAgICAgICAgICBkYXRhLkxvbmdpdHVkZSA9IGxvbmc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHRhYmxlOiBFbGVtZW50IHwgbnVsbCA9IGRvbS53aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGFibGUudzMtdGFibGUudzMtcmVzcG9uc2l2ZScpO1xuICAgIGlmICh0YWJsZSkge1xuICAgICAgY29uc3Qgcm93czogSFRNTFRhYmxlUm93RWxlbWVudFtdID0gWy4uLnRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTFRhYmxlUm93RWxlbWVudD4oJ3Rib2R5ID4gdHInKV07XG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzOiBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnRbXSA9IFsuLi5yb3cucXVlcnlTZWxlY3RvckFsbCgndGQnKV07XG4gICAgICAgIGNvbnN0IHRpdGxlOiBzdHJpbmcgPSBnZXRUZXh0KGNlbGxzWzBdKTtcbiAgICAgICAgY29uc3QgdmFsdWU6IG51bWJlciB8IHN0cmluZyA9IGdldFRleHRPck51bWJlcihjZWxsc1sxXSk7XG4gICAgICAgIGNvbnN0IGRhdGFLZXk6IHN0cmluZyA9IHRpdGxlLnNwbGl0KCc6JylbMF0udHJpbSgpO1xuICAgICAgICBjb25zdCBkYXRhVmFsOiBzdHJpbmcgPSB0aXRsZS5zcGxpdCgnOicpWzFdO1xuICAgICAgICBsZXQgdXBkYXRlZDogbnVtYmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoZGF0YVZhbCkge1xuICAgICAgICAgIGNvbnN0IGRhdGU6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gZGF0YVZhbC5tYXRjaCgvKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGlmIChkYXRlICYmIGRhdGVbMV0pIHtcbiAgICAgICAgICAgIHVwZGF0ZWQgPSBkYXRlWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhW2RhdGFLZXldID0gdXBkYXRlZCB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgYXMgYW55IGFzIElSZXBlYXRlclJhdztcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0Q2FjaGUoa2V5OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGZpbGU6IHN0cmluZyA9IGBkYXRhL3JlcGVhdGVycy9fY2FjaGUvJHtrZXl9YDtcbiAgICBpZiAoYXdhaXQgZGlyRXhpc3RzKGZpbGUpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHJlYWRGaWxlQXN5bmMoZmlsZSkpLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXRDYWNoZShrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGU6IHN0cmluZyA9IGBkYXRhL3JlcGVhdGVycy9fY2FjaGUvJHtrZXl9YDtcbiAgICBhd2FpdCBtYWtlRGlycyhmaWxlKTtcbiAgICByZXR1cm4gd3JpdGVGaWxlQXN5bmMoZmlsZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRVcmwodXJsOiBzdHJpbmcsIGNhY2hlS2V5Pzogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgVVJMXCIpLCB1cmwsIGNhY2hlS2V5KTtcblxuICAgIGNvbnN0IGNhY2hlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmdldENhY2hlKGNhY2hlS2V5IHx8IHVybCk7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICAvLyBsb2coY2hhbGsueWVsbG93KFwiQ2FjaGVkXCIpLCB1cmwsIGNhY2hlS2V5KTtcbiAgICAgIHdyaXRlKCc8Jyk7XG4gICAgICByZXR1cm4gY2FjaGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNsb3cgZG93biB0aGUgcmVxdWVzdHMgYSBsaXR0bGUgYml0IHNvIHdlJ3JlIG5vdCBoYW1tZXJpbmcgdGhlIHNlcnZlciBvciB0cmlnZ2VyaW5nIGFueSBhbnRpLWJvdCBvciBERG9TIHByb3RlY3Rpb25zXG4gICAgICBjb25zdCB3YWl0VGltZTogbnVtYmVyID0gKDUwMDAgKyAoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSk7XG5cbiAgICAgIGF3YWl0IHdhaXQod2FpdFRpbWUpO1xuICAgICAgLy8gbG9nKGNoYWxrLnllbGxvdyhcIkdldFwiKSwgdXJsKTtcbiAgICAgIGNvbnN0IHJlcXVlc3Q6IEF4aW9zUmVzcG9uc2U8c3RyaW5nPiA9IGF3YWl0IEF4aW9zLmdldCh1cmwpO1xuICAgICAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiR290XCIpLCB1cmwpO1xuICAgICAgd3JpdGUoJz4nKTtcblxuICAgICAgY29uc3QgZGF0YTogc3RyaW5nID0gcmVxdWVzdC5kYXRhO1xuICAgICAgYXdhaXQgdGhpcy5zZXRDYWNoZShjYWNoZUtleSB8fCB1cmwsIGRhdGEpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9XG59XG4iXX0=