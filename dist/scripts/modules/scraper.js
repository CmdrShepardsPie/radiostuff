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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY3JpcHRzL21vZHVsZXMvc2NyYXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFBLG9EQUF5RjtJQUN6Riw4Q0FBd0M7SUFDeEMsc0RBQWlEO0lBRWpELGtEQUE2QztJQUM3QyxrREFBMEI7SUFDMUIsaUNBQThCO0lBQzlCLHFDQUErRDtJQUUvRCxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFxRSx1QkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlHLHdDQUF3QztJQUV4QyxNQUFxQixPQUFPO1FBSTFCLFlBQW9CLFFBQXlCLEVBQVUsUUFBZ0I7WUFBbkQsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO1lBSC9ELFNBQUksR0FBbUIsRUFBRSxDQUFDO1lBSWhDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsR0FBRyxHQUFHLCtEQUErRCxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsYUFBYSxRQUFRLDJIQUEySCxDQUFDO1FBQ3BRLENBQUM7UUFFTSxLQUFLLENBQUMsT0FBTztZQUNsQixHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRTVCLE1BQU0sS0FBSyxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVELE1BQU0sT0FBTyxHQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENB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TUFBTSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sMkJBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVPLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBVyxFQUFFLFFBQWlCO1lBQ2pELDhDQUE4QztZQUU5QyxNQUFNLEtBQUssR0FBdUIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUN2RSxJQUFJLEtBQUssRUFBRTtnQkFDVCw4Q0FBOEM7Z0JBQzlDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDWCxPQUFPLEtBQUssQ0FBQzthQUNkO2lCQUFNO2dCQUNMLHVIQUF1SDtnQkFDdkgsTUFBTSxRQUFRLEdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFFMUQsTUFBTSxjQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JCLGlDQUFpQztnQkFDakMsTUFBTSxPQUFPLEdBQTBCLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUQsZ0NBQWdDO2dCQUNoQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRVgsTUFBTSxJQUFJLEdBQVcsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDbEMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7UUFDSCxDQUFDO0tBQ0Y7SUFqSUQsMEJBaUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGlyRXhpc3RzLCBtYWtlRGlycywgcmVhZEZpbGVBc3luYywgd3JpdGVGaWxlQXN5bmMgfSBmcm9tICdAaGVscGVycy9mcy1oZWxwZXJzJztcclxuaW1wb3J0IHsgd2FpdCB9IGZyb20gJ0BoZWxwZXJzL2hlbHBlcnMnO1xyXG5pbXBvcnQgeyBjcmVhdGVPdXQgfSBmcm9tICdAaGVscGVycy9sb2ctaGVscGVycyc7XHJcbmltcG9ydCB7IElSZXBlYXRlclJhdyB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktcmVwZWF0ZXItcmF3JztcclxuaW1wb3J0IEF4aW9zLCB7IEF4aW9zUmVzcG9uc2UgfSBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XHJcbmltcG9ydCB7IEpTRE9NIH0gZnJvbSAnanNkb20nO1xyXG5pbXBvcnQgeyBnZXROdW1iZXIsIGdldFRleHQsIGdldFRleHRPck51bWJlciB9IGZyb20gJy4vaGVscGVyJztcclxuXHJcbmNvbnN0IHsgbG9nLCB3cml0ZSB9OiB7IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQ7IHdyaXRlOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCB9ID0gY3JlYXRlT3V0KCdTY3JhcGVyJyk7XHJcbi8vIGNvbnN0IHdyaXRlID0gY3JlYXRlV3JpdGUoXCJTY3JhcGVyXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyYXBlciB7XHJcbiAgcHJpdmF0ZSBkYXRhOiBJUmVwZWF0ZXJSYXdbXSA9IFtdO1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9jYXRpb246IHN0cmluZyB8IG51bWJlciwgcHJpdmF0ZSBkaXN0YW5jZTogbnVtYmVyKSB7XHJcbiAgICBsb2coY2hhbGsuZ3JlZW4oJ05ldyBTY3JhcGVyJyksIGxvY2F0aW9uLCBkaXN0YW5jZSk7XHJcbiAgICB0aGlzLnVybCA9IGBodHRwczovL3d3dy5yZXBlYXRlcmJvb2suY29tL3JlcGVhdGVycy9wcm94X3Jlc3VsdC5waHA/Y2l0eT0ke2VuY29kZVVSSUNvbXBvbmVudChsb2NhdGlvbi50b1N0cmluZygpKX0mZGlzdGFuY2U9JHtkaXN0YW5jZX0mRHVuaXQ9bSZiYW5kMT0lMjUmYmFuZDI9JmZyZXE9JmNhbGw9JmZlYXR1cmVzPSZzdGF0dXNfaWQ9JTI1JnVzZT0lMjUmb3JkZXI9JTYwc3RhdGVfaWQlNjAlMkMrJTYwbG9jJTYwJTJDKyU2MGNhbGwlNjArQVNDYDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKCk6IFByb21pc2U8SVJlcGVhdGVyUmF3W10+IHtcclxuICAgIGxvZyhjaGFsay5ncmVlbignUHJvY2VzcycpKTtcclxuXHJcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSB0aGlzLmxvY2F0aW9uLnRvU3RyaW5nKCkuc3BsaXQoYCxgKTtcclxuICAgIGNvbnN0IGJhc2VLZXk6IHN0cmluZyA9IGAkeyhwYXJ0c1sxXSB8fCAnLicpLnRyaW0oKX0vJHtwYXJ0c1swXS50cmltKCl9Lmh0bWxgO1xyXG4gICAgY29uc3QgcGFnZTogc3RyaW5nID0gYXdhaXQgdGhpcy5nZXRVcmwodGhpcy51cmwsIGJhc2VLZXkpO1xyXG4gICAgY29uc3QgZG9tOiBKU0RPTSA9IG5ldyBKU0RPTShwYWdlKTtcclxuICAgIGF3YWl0IHRoaXMuZ2V0UmVwZWF0ZXJMaXN0KGRvbS53aW5kb3cuZG9jdW1lbnQpO1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZ2V0UmVwZWF0ZXJMaXN0KGRvY3VtZW50OiBEb2N1bWVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbG9nKGNoYWxrLmdyZWVuKCdHZXQgUmVwZWF0ZXIgTGlzdCcpKTtcclxuXHJcbiAgICBjb25zdCB0YWJsZTogSFRNTFRhYmxlRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd0YWJsZS53My10YWJsZS53My1zdHJpcGVkLnczLXJlc3BvbnNpdmUnKTtcclxuICAgIGlmICh0YWJsZSkge1xyXG4gICAgICBjb25zdCByb3dzOiBIVE1MVGFibGVSb3dFbGVtZW50W10gPSBbLi4udGFibGUucXVlcnlTZWxlY3RvckFsbDxIVE1MVGFibGVSb3dFbGVtZW50PigndGJvZHkgPiB0cicpXTtcclxuICAgICAgY29uc3QgaGVhZGVyUm93OiBhbnkgfCB1bmRlZmluZWQgPSByb3dzLnNoaWZ0KCk7XHJcbiAgICAgIGlmIChoZWFkZXJSb3cpIHtcclxuICAgICAgICBjb25zdCBoZWFkZXJDZWxsczogSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnRbXSA9IFsuLi5oZWFkZXJSb3cucXVlcnlTZWxlY3RvckFsbCgndGgnKV07XHJcbiAgICAgICAgY29uc3QgaGVhZGVyczogc3RyaW5nW10gPSBoZWFkZXJDZWxscy5tYXAoKHRoOiBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCkgPT4gZ2V0VGV4dCh0aCkpO1xyXG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICAgIGNvbnN0IGRhdGE6IHsgWyBrZXk6IHN0cmluZyBdOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfSA9IHt9O1xyXG4gICAgICAgICAgY29uc3QgY2VsbHM6IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudFtdID0gWy4uLnJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpXTtcclxuICAgICAgICAgIGNlbGxzLmZvckVhY2goKHRkOiBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQsIGluZGV4OiBudW1iZXIpID0+IGRhdGFbaGVhZGVyc1tpbmRleF1dID0gZ2V0VGV4dE9yTnVtYmVyKHRkKSk7XHJcbiAgICAgICAgICBjb25zdCBsaW5rOiBIVE1MQW5jaG9yRWxlbWVudCB8IG51bGwgPSBjZWxsc1swXS5xdWVyeVNlbGVjdG9yKCdhJyk7XHJcbiAgICAgICAgICBpZiAobGluaykge1xyXG4gICAgICAgICAgICB3cml0ZSgnXicpO1xyXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGRhdGEsIGF3YWl0IHRoaXMuZ2V0UmVwZWF0ZXJEZXRhaWxzKGxpbmsuaHJlZikpO1xyXG4gICAgICAgICAgICB3cml0ZSgnXycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5kYXRhLnB1c2goZGF0YSBhcyBhbnkgYXMgSVJlcGVhdGVyUmF3KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZ2V0UmVwZWF0ZXJEZXRhaWxzKGhyZWY6IHN0cmluZyk6IFByb21pc2U8SVJlcGVhdGVyUmF3PiB7XHJcbiAgICBjb25zdCB1cmxQYXJhbXM6IHN0cmluZyA9IGhyZWYuc3BsaXQoJz8nKVsxXTtcclxuICAgIGNvbnN0IGtleVBhcnRzOiBSZWdFeHBNYXRjaEFycmF5ID0gdXJsUGFyYW1zLm1hdGNoKC9zdGF0ZV9pZD0oXFxkKykmSUQ9KFxcZCspLykgfHwgW107XHJcbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IGAke2tleVBhcnRzWzFdfS8ke2tleVBhcnRzWzJdfS5odG1sYDtcclxuICAgIGNvbnN0IHBhZ2U6IHN0cmluZyA9IGF3YWl0IHRoaXMuZ2V0VXJsKGBodHRwczovL3d3dy5yZXBlYXRlcmJvb2suY29tL3JlcGVhdGVycy8ke2hyZWZ9YCwga2V5KTtcclxuICAgIGNvbnN0IGRvbTogSlNET00gPSBuZXcgSlNET00ocGFnZSk7XHJcbiAgICBjb25zdCBkYXRhOiB7IFsga2V5OiBzdHJpbmcgXTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIH0gPSB7fTtcclxuICAgIGRhdGEuc3RhdGVfaWQgPSBrZXlQYXJ0c1sxXTtcclxuICAgIGRhdGEuSUQgPSBrZXlQYXJ0c1syXTtcclxuICAgIGNvbnN0IG1lbnVzOiBIVE1MQW5jaG9yRWxlbWVudFtdID0gWy4uLmRvbS53aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MQW5jaG9yRWxlbWVudD4oJyNjc3NtZW51IGEnKV07XHJcbiAgICBjb25zdCBsb2NhdGlvblJlZ2V4OiBSZWdFeHAgPSAvKC0/XFxkKlxcLj9cXGQqKVxcKygtP1xcZCpcXC4/XFxkKikvaTtcclxuICAgIGZvciAoY29uc3QgbWVudSBvZiBtZW51cykge1xyXG4gICAgICBjb25zdCBsb2NhdGlvbk1hdGNoOiBSZWdFeHBNYXRjaEFycmF5IHwgbnVsbCA9IG1lbnUuaHJlZi5tYXRjaChsb2NhdGlvblJlZ2V4KTtcclxuICAgICAgaWYgKGxvY2F0aW9uTWF0Y2gpIHtcclxuICAgICAgICBjb25zdCBsYXQ6IG51bWJlciA9IGdldE51bWJlcihsb2NhdGlvbk1hdGNoWzFdKTtcclxuICAgICAgICBjb25zdCBsb25nOiBudW1iZXIgPSBnZXROdW1iZXIobG9jYXRpb25NYXRjaFsyXSk7XHJcbiAgICAgICAgaWYgKCFpc05hTihsYXQpKSB7XHJcbiAgICAgICAgICBkYXRhLkxhdGl0dWRlID0gbGF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWlzTmFOKGxvbmcpKSB7XHJcbiAgICAgICAgICBkYXRhLkxvbmdpdHVkZSA9IGxvbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCB0YWJsZTogRWxlbWVudCB8IG51bGwgPSBkb20ud2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RhYmxlLnczLXRhYmxlLnczLXJlc3BvbnNpdmUnKTtcclxuICAgIGlmICh0YWJsZSkge1xyXG4gICAgICBjb25zdCByb3dzOiBIVE1MVGFibGVSb3dFbGVtZW50W10gPSBbLi4udGFibGUucXVlcnlTZWxlY3RvckFsbDxIVE1MVGFibGVSb3dFbGVtZW50PigndGJvZHkgPiB0cicpXTtcclxuICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGNvbnN0IGNlbGxzOiBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnRbXSA9IFsuLi5yb3cucXVlcnlTZWxlY3RvckFsbCgndGQnKV07XHJcbiAgICAgICAgY29uc3QgdGl0bGU6IHN0cmluZyA9IGdldFRleHQoY2VsbHNbMF0pO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgPSBnZXRUZXh0T3JOdW1iZXIoY2VsbHNbMV0pO1xyXG4gICAgICAgIGNvbnN0IGRhdGFLZXk6IHN0cmluZyA9IHRpdGxlLnNwbGl0KCc6JylbMF0udHJpbSgpO1xyXG4gICAgICAgIGNvbnN0IGRhdGFWYWw6IHN0cmluZyA9IHRpdGxlLnNwbGl0KCc6JylbMV07XHJcbiAgICAgICAgbGV0IHVwZGF0ZWQ6IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoZGF0YVZhbCkge1xyXG4gICAgICAgICAgY29uc3QgZGF0ZTogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwgPSBkYXRhVmFsLm1hdGNoKC8oXFxkezR9LVxcZHsyfS1cXGR7Mn0pLyk7XHJcbiAgICAgICAgICBpZiAoZGF0ZSAmJiBkYXRlWzFdKSB7XHJcbiAgICAgICAgICAgIHVwZGF0ZWQgPSBkYXRlWzFdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhW2RhdGFLZXldID0gdXBkYXRlZCB8fCB2YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGEgYXMgYW55IGFzIElSZXBlYXRlclJhdztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZ2V0Q2FjaGUoa2V5OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xyXG4gICAgY29uc3QgZmlsZTogc3RyaW5nID0gYGRhdGEvcmVwZWF0ZXJzL19jYWNoZS8ke2tleX1gO1xyXG4gICAgaWYgKGF3YWl0IGRpckV4aXN0cyhmaWxlKSkge1xyXG4gICAgICByZXR1cm4gKGF3YWl0IHJlYWRGaWxlQXN5bmMoZmlsZSkpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHNldENhY2hlKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBmaWxlOiBzdHJpbmcgPSBgZGF0YS9yZXBlYXRlcnMvX2NhY2hlLyR7a2V5fWA7XHJcbiAgICBhd2FpdCBtYWtlRGlycyhmaWxlKTtcclxuICAgIHJldHVybiB3cml0ZUZpbGVBc3luYyhmaWxlLCB2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGdldFVybCh1cmw6IHN0cmluZywgY2FjaGVLZXk/OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiR2V0IFVSTFwiKSwgdXJsLCBjYWNoZUtleSk7XHJcblxyXG4gICAgY29uc3QgY2FjaGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuZ2V0Q2FjaGUoY2FjaGVLZXkgfHwgdXJsKTtcclxuICAgIGlmIChjYWNoZSkge1xyXG4gICAgICAvLyBsb2coY2hhbGsueWVsbG93KFwiQ2FjaGVkXCIpLCB1cmwsIGNhY2hlS2V5KTtcclxuICAgICAgd3JpdGUoJzwnKTtcclxuICAgICAgcmV0dXJuIGNhY2hlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gU2xvdyBkb3duIHRoZSByZXF1ZXN0cyBhIGxpdHRsZSBiaXQgc28gd2UncmUgbm90IGhhbW1lcmluZyB0aGUgc2VydmVyIG9yIHRyaWdnZXJpbmcgYW55IGFudGktYm90IG9yIEREb1MgcHJvdGVjdGlvbnNcclxuICAgICAgY29uc3Qgd2FpdFRpbWU6IG51bWJlciA9ICg1MDAwICsgKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkpO1xyXG5cclxuICAgICAgYXdhaXQgd2FpdCh3YWl0VGltZSk7XHJcbiAgICAgIC8vIGxvZyhjaGFsay55ZWxsb3coXCJHZXRcIiksIHVybCk7XHJcbiAgICAgIGNvbnN0IHJlcXVlc3Q6IEF4aW9zUmVzcG9uc2U8c3RyaW5nPiA9IGF3YWl0IEF4aW9zLmdldCh1cmwpO1xyXG4gICAgICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJHb3RcIiksIHVybCk7XHJcbiAgICAgIHdyaXRlKCc+Jyk7XHJcblxyXG4gICAgICBjb25zdCBkYXRhOiBzdHJpbmcgPSByZXF1ZXN0LmRhdGE7XHJcbiAgICAgIGF3YWl0IHRoaXMuc2V0Q2FjaGUoY2FjaGVLZXkgfHwgdXJsLCBkYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==