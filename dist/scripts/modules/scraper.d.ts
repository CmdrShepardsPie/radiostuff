import { IRepeater } from "./i.repeater";
export default class Scraper {
    private location;
    private distance;
    private data;
    private readonly url;
    constructor(location: string | number, distance: number);
    process(): Promise<IRepeater[]>;
    private getRepeaterList;
    private getRepeaterDetails;
    private getCache;
    private setCache;
    private getUrl;
}
//# sourceMappingURL=scraper.d.ts.map