import { IRepeaterRaw } from '@interfaces/i-repeater-raw';
export default class Scraper {
    private location;
    private distance;
    private data;
    private readonly url;
    constructor(location: string | number, distance: number);
    process(): Promise<IRepeaterRaw[]>;
    private getRepeaterList;
    private getRepeaterDetails;
    private getCache;
    private setCache;
    private getUrl;
}
//# sourceMappingURL=scraper.d.ts.map