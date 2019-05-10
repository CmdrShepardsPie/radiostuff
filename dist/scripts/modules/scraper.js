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
            const waitTime = (Math.random() * 5000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY3JpcHRzL21vZHVsZXMvc2NyYXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUF1RjtBQUN2Riw4Q0FBc0M7QUFDdEMsc0RBQStDO0FBQy9DLGlDQUEwQjtBQUMxQixpQ0FBMEI7QUFDMUIsaUNBQThCO0FBQzlCLHFDQUE2RDtBQUc3RCxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLHVCQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsd0NBQXdDO0FBRXhDLE1BQXFCLE9BQU87SUFJMUIsWUFBb0IsUUFBeUIsRUFBVSxRQUFnQjtRQUFuRCxhQUFRLEdBQVIsUUFBUSxDQUFpQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVE7UUFIL0QsU0FBSSxHQUFnQixFQUFFLENBQUM7UUFJN0IsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxHQUFHLEdBQUcsK0RBQStELGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxhQUFhLFFBQVEsMkhBQTJILENBQUM7SUFDcFEsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFNUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztRQUN0RSxNQUFN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TSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0MsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7Q0FDRjtBQWhKRCwwQkFnSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RpckV4aXN0cywgbWFrZURpcnMsIHJlYWRGaWxlQXN5bmMsIHdyaXRlRmlsZUFzeW5jfSBmcm9tIFwiQGhlbHBlcnMvZnMtaGVscGVyc1wiO1xuaW1wb3J0IHt3YWl0fSBmcm9tIFwiQGhlbHBlcnMvaGVscGVyc1wiO1xuaW1wb3J0IHtjcmVhdGVPdXR9IGZyb20gXCJAaGVscGVycy9sb2ctaGVscGVyc1wiO1xuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IHsgSlNET00gfSBmcm9tIFwianNkb21cIjtcbmltcG9ydCB7Z2V0TnVtYmVyLCBnZXRUZXh0LCBnZXRUZXh0T3JOdW1iZXJ9IGZyb20gXCIuL2hlbHBlclwiO1xuaW1wb3J0IHtJUmVwZWF0ZXJ9IGZyb20gXCIuL2kucmVwZWF0ZXJcIjtcblxuY29uc3QgeyBsb2csIHdyaXRlIH0gPSBjcmVhdGVPdXQoXCJTY3JhcGVyXCIpO1xuLy8gY29uc3Qgd3JpdGUgPSBjcmVhdGVXcml0ZShcIlNjcmFwZXJcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmFwZXIge1xuICBwcml2YXRlIGRhdGE6IElSZXBlYXRlcltdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2NhdGlvbjogc3RyaW5nIHwgbnVtYmVyLCBwcml2YXRlIGRpc3RhbmNlOiBudW1iZXIpIHtcbiAgICBsb2coY2hhbGsuZ3JlZW4oXCJOZXcgU2NyYXBlclwiKSwgbG9jYXRpb24sIGRpc3RhbmNlKTtcbiAgICB0aGlzLnVybCA9IGBodHRwczovL3d3dy5yZXBlYXRlcmJvb2suY29tL3JlcGVhdGVycy9wcm94X3Jlc3VsdC5waHA/Y2l0eT0ke2VuY29kZVVSSUNvbXBvbmVudChsb2NhdGlvbi50b1N0cmluZygpKX0mZGlzdGFuY2U9JHtkaXN0YW5jZX0mRHVuaXQ9bSZiYW5kMT0lMjUmYmFuZDI9JmZyZXE9JmNhbGw9JmZlYXR1cmVzPSZzdGF0dXNfaWQ9JTI1JnVzZT0lMjUmb3JkZXI9JTYwc3RhdGVfaWQlNjAlMkMrJTYwbG9jJTYwJTJDKyU2MGNhbGwlNjArQVNDYDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwcm9jZXNzKCkge1xuICAgIGxvZyhjaGFsay5ncmVlbihcIlByb2Nlc3NcIikpO1xuXG4gICAgY29uc3QgcGFydHMgPSB0aGlzLmxvY2F0aW9uLnRvU3RyaW5nKCkuc3BsaXQoYCxgKTtcbiAgICBjb25zdCBiYXNlS2V5ID0gYCR7KHBhcnRzWzFdIHx8IFwiLlwiKS50cmltKCl9LyR7cGFydHNbMF0udHJpbSgpfS5odG1sYDtcbiAgICBjb25zdCBwYWdlID0gYXdhaXQgdGhpcy5nZXRVcmwodGhpcy51cmwsIGJhc2VLZXkpO1xuICAgIGNvbnN0IGRvbSA9IG5ldyBKU0RPTShwYWdlKTtcbiAgICBhd2FpdCB0aGlzLmdldFJlcGVhdGVyTGlzdChkb20ud2luZG93LmRvY3VtZW50KTtcbiAgICByZXR1cm4gdGhpcy5kYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRSZXBlYXRlckxpc3QoZG9jdW1lbnQ6IERvY3VtZW50KSB7XG4gICAgLy8gY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgUmVwZWF0ZXIgTGlzdFwiKSk7XG5cbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZS53My10YWJsZS53My1zdHJpcGVkLnczLXJlc3BvbnNpdmVcIik7XG4gICAgaWYgKHRhYmxlKSB7XG4gICAgICBjb25zdCByb3dzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0Ym9keSA+IHRyXCIpKTtcbiAgICAgIGNvbnN0IGhlYWRlclJvdyA9IHJvd3Muc2hpZnQoKTtcbiAgICAgIGlmIChoZWFkZXJSb3cpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyQ2VsbHMgPSBbLi4uaGVhZGVyUm93LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0aFwiKV07XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBoZWFkZXJDZWxscy5tYXAoKHRoKSA9PiBnZXRUZXh0KHRoKSk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICBjb25zdCBkYXRhOiBhbnkgPSB7fTtcbiAgICAgICAgICBjb25zdCBjZWxscyA9IFsuLi5yb3cucXVlcnlTZWxlY3RvckFsbChcInRkXCIpXTtcbiAgICAgICAgICBjZWxscy5mb3JFYWNoKCh0ZCwgaW5kZXgpID0+IGRhdGFbaGVhZGVyc1tpbmRleF1dID0gZ2V0VGV4dE9yTnVtYmVyKHRkKSk7XG4gICAgICAgICAgY29uc3QgbGluayA9IGNlbGxzWzBdLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpO1xuICAgICAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgICAgICB3cml0ZShcIl5cIik7XG4gICAgICAgICAgICAvLyBwcm9taXNlcy5wdXNoKHRoaXMuZ2V0UmVwZWF0ZXJEZXRhaWxzKGxpbmsuaHJlZikudGhlbigoZCkgPT4ge1xuICAgICAgICAgICAgLy8gICB3cml0ZShcIl9cIik7XG4gICAgICAgICAgICAvLyAgIE9iamVjdC5hc3NpZ24oZGF0YSwgZCk7XG4gICAgICAgICAgICAvLyB9KSk7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGRhdGEsIGF3YWl0IHRoaXMuZ2V0UmVwZWF0ZXJEZXRhaWxzKGxpbmsuaHJlZikpO1xuICAgICAgICAgICAgd3JpdGUoXCJfXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmRhdGEucHVzaChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRSZXBlYXRlckRldGFpbHMoaHJlZjogc3RyaW5nKSB7XG4gICAgLy8gbG9nKGNoYWxrLmdyZWVuKFwiR2V0IFJlcGVhdGVyIERldGFpbHNcIiksIGhyZWYpO1xuICAgIGNvbnN0IHVybFBhcmFtcyA9IGhyZWYuc3BsaXQoXCI/XCIpWzFdO1xuICAgIGNvbnN0IGtleVBhcnRzID0gdXJsUGFyYW1zLm1hdGNoKC9zdGF0ZV9pZD0oXFxkKykmSUQ9KFxcZCspLykgfHwgW107XG4gICAgY29uc3Qga2V5ID0gYCR7a2V5UGFydHNbMV19LyR7a2V5UGFydHNbMl19Lmh0bWxgO1xuICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCB0aGlzLmdldFVybChgaHR0cHM6Ly93d3cucmVwZWF0ZXJib29rLmNvbS9yZXBlYXRlcnMvJHtocmVmfWAsIGtleSk7XG4gICAgY29uc3QgZG9tID0gbmV3IEpTRE9NKHBhZ2UpO1xuICAgIGNvbnN0IGRhdGE6IHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHt9O1xuICAgIGRhdGEuc3RhdGVfaWQgPSBrZXlQYXJ0c1sxXTtcbiAgICBkYXRhLklEID0ga2V5UGFydHNbMl07XG4gICAgY29uc3QgbWVudXMgPSBBcnJheS5mcm9tKGRvbS53aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MQW5jaG9yRWxlbWVudD4oXCIjY3NzbWVudSBhXCIpKTtcbiAgICBjb25zdCBsb2NhdGlvblJlZ2V4ID0gLygtP1xcZCpcXC4/XFxkKilcXCsoLT9cXGQqXFwuP1xcZCopL2k7XG4gICAgZm9yIChjb25zdCBtZW51IG9mIG1lbnVzKSB7XG4gICAgICBjb25zdCBsb2NhdGlvbk1hdGNoID0gbWVudS5ocmVmLm1hdGNoKGxvY2F0aW9uUmVnZXgpO1xuICAgICAgaWYgKGxvY2F0aW9uTWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbGF0ID0gZ2V0TnVtYmVyKGxvY2F0aW9uTWF0Y2hbMV0pO1xuICAgICAgICBjb25zdCBsb25nID0gZ2V0TnVtYmVyKGxvY2F0aW9uTWF0Y2hbMl0pO1xuICAgICAgICBkYXRhLkxhdGl0dWRlID0gaXNOYU4obGF0KSA/IGxvY2F0aW9uTWF0Y2hbMV0gOiBsYXQ7XG4gICAgICAgIGRhdGEuTG9uZ2l0dWRlID0gaXNOYU4obG9uZykgPyBsb2NhdGlvbk1hdGNoWzJdIDogbG9uZztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHRhYmxlID0gZG9tLndpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUudzMtdGFibGUudzMtcmVzcG9uc2l2ZVwiKTtcbiAgICBpZiAodGFibGUpIHtcbiAgICAgIGNvbnN0IHJvd3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGFibGUucXVlcnlTZWxlY3RvckFsbChcInRib2R5ID4gdHJcIikpO1xuICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFsuLi5yb3cucXVlcnlTZWxlY3RvckFsbChcInRkXCIpXTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBnZXRUZXh0KGNlbGxzWzBdKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRUZXh0T3JOdW1iZXIoY2VsbHNbMV0pO1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gdGl0bGUuc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTtcbiAgICAgICAgY29uc3QgZGF0YVZhbCA9IHRpdGxlLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgICAgbGV0IHVwZGF0ZWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGRhdGFWYWwpIHtcbiAgICAgICAgICBjb25zdCBkYXRlID0gZGF0YVZhbC5tYXRjaCgvKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGlmIChkYXRlICYmIGRhdGVbMV0pIHtcbiAgICAgICAgICAgIHVwZGF0ZWQgPSBkYXRlWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhW2RhdGFLZXldID0gdXBkYXRlZCB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gbG9nKFxuICAgIC8vICAgZGF0YS5zdGF0ZV9pZCA/IGRhdGEuc3RhdGVfaWQgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5JRCA/IGRhdGEuSUQgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5MYXRpdHVkZSA/IGRhdGEuTGF0aXR1ZGUgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5Mb25naXR1ZGUgPyBkYXRhLkxvbmdpdHVkZSA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLkNhbGwgPyBkYXRhLkNhbGwgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5Eb3dubGluayA/IGRhdGEuRG93bmxpbmsgOiBcIlwiLCBcIlxcdFwiLFxuICAgIC8vICAgZGF0YS5Vc2UgPyBkYXRhLlVzZSA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhW1wiT3AgU3RhdHVzXCJdID8gZGF0YVtcIk9wIFN0YXR1c1wiXSA6IFwiXCIsIFwiXFx0XCIsXG4gICAgLy8gICBkYXRhLkFmZmlsaWF0ZSA/IGRhdGEuQWZmaWxpYXRlIDogXCJcIiwgXCJcXHRcIixcbiAgICAvLyAgIGRhdGEuU3BvbnNvciA/IGRhdGEuU3BvbnNvciA6IFwiXCIsXG4gICAgLy8gKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0Q2FjaGUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBmaWxlID0gYGRhdGEvcmVwZWF0ZXJzL19jYWNoZS8ke2tleX1gO1xuICAgIGlmIChhd2FpdCBkaXJFeGlzdHMoZmlsZSkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgcmVhZEZpbGVBc3luYyhmaWxlKSkudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldENhY2hlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgZmlsZSA9IGBkYXRhL3JlcGVhdGVycy9fY2FjaGUvJHtrZXl9YDtcbiAgICBhd2FpdCBtYWtlRGlycyhmaWxlKTtcbiAgICByZXR1cm4gd3JpdGVGaWxlQXN5bmMoZmlsZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRVcmwodXJsOiBzdHJpbmcsIGNhY2hlS2V5Pzogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBsb2coY2hhbGsuZ3JlZW4oXCJHZXQgVVJMXCIpLCB1cmwsIGNhY2hlS2V5KTtcblxuICAgIGNvbnN0IGNhY2hlID0gYXdhaXQgdGhpcy5nZXRDYWNoZShjYWNoZUtleSB8fCB1cmwpO1xuICAgIGlmIChjYWNoZSkge1xuICAgICAgLy8gbG9nKGNoYWxrLnllbGxvdyhcIkNhY2hlZFwiKSwgdXJsLCBjYWNoZUtleSk7XG4gICAgICB3cml0ZShcIjxcIik7XG4gICAgICByZXR1cm4gY2FjaGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNsb3cgZG93biB0aGUgcmVxdWVzdHMgYSBsaXR0bGUgYml0IHNvIHdlJ3JlIG5vdCBoYW1tZXJpbmcgdGhlIHNlcnZlciBvciB0cmlnZ2VyaW5nIGFueSBhbnRpLWJvdCBvciBERG9TIHByb3RlY3Rpb25zXG4gICAgICBjb25zdCB3YWl0VGltZSA9IChNYXRoLnJhbmRvbSgpICogNTAwMCk7XG5cbiAgICAgIGF3YWl0IHdhaXQod2FpdFRpbWUpO1xuICAgICAgLy8gbG9nKGNoYWxrLnllbGxvdyhcIkdldFwiKSwgdXJsKTtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBhd2FpdCBBeGlvcy5nZXQodXJsKTtcbiAgICAgIC8vIGxvZyhjaGFsay5ncmVlbihcIkdvdFwiKSwgdXJsKTtcbiAgICAgIHdyaXRlKFwiPlwiKTtcblxuICAgICAgY29uc3QgZGF0YSA9IHJlcXVlc3QuZGF0YTtcbiAgICAgIGF3YWl0IHRoaXMuc2V0Q2FjaGUoY2FjaGVLZXkgfHwgdXJsLCBkYXRhKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfVxufVxuIl19