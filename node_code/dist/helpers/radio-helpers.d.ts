import { IRepeaterStructured } from "@interfaces/i-repeater-structured";
export declare enum FrequencyBand {
    $2_m = 0,
    $1_25_m = 1,
    $70_cm = 2
}
export declare enum Mode {
    FM = 0,
    ATV = 1,
    DMR = 2,
    P25 = 3,
    DStar = 4,
    YSF = 5
}
export declare function filterFrequencies(...bands: FrequencyBand[]): (filter: IRepeaterStructured) => boolean;
export declare function filterDistance(distance: number): (filter: IRepeaterStructured) => boolean;
export declare function filterMode(...modes: Mode[]): (filter: IRepeaterStructured) => boolean;
export declare function buildName(repeater: IRepeaterStructured): string;
export declare function buildComment(repeater: IRepeaterStructured): string;
export declare function buildDCS(code: number | undefined): string;
//# sourceMappingURL=radio-helpers.d.ts.map