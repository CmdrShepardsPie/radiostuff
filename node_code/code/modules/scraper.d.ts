import { RepeaterRaw } from '@interfaces/repeater-raw';
export default class Scraper {
    private location;
    private distance;
    private data;
    private readonly url;
    constructor(location: string | number, distance: number);
    scrape(): Promise<RepeaterRaw[]>;
    private getRepeaterList;
    private getRepeaterDetails;
    private getUrl;
    private getUrlFromCache;
    private getUrlFromServer;
}
//# sourceMappingURL=scraper.d.ts.map