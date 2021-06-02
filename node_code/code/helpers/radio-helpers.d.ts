import { RepeaterStructured } from '@interfaces/repeater-structured';
import gpsDistance from 'gps-distance';
import { RtSystemsOffsetFrequency } from '@interfaces/rt-systems';
export declare enum FrequencyBand {
    $160_m = 0,
    $80_m = 1,
    $60_m = 2,
    $40_m = 3,
    $30_m = 4,
    $20_m = 5,
    $17_m = 6,
    $15_m = 7,
    $12_m = 8,
    $10_m = 9,
    $6_m = 10,
    $2_m = 11,
    $1_25_m = 12,
    $70_cm = 13,
    MURS = 14,
    GMRS = 15
}
export declare enum Mode {
    FM = 0,
    ATV = 1,
    DMR = 2,
    P25 = 3,
    DStar = 4,
    YSF = 5,
    Any = 6,
    AnyDigital = 7,
    NXDN = 8
}
export interface RadioCommon {
    TransmitSquelchTone: number | undefined;
    TransmitDigitalTone: number | undefined;
    Comment: string;
    Transmit: number;
    OffsetFrequency: number;
    ReceiveDigitalTone: number | undefined;
    Receive: number;
    ReceiveSquelchTone: number | undefined;
    Name: string;
}
export declare function filterOutputFrequencies(...bands: FrequencyBand[]): (filter: RepeaterStructured) => boolean;
export declare function filterInputFrequencies(...bands: FrequencyBand[]): (filter: RepeaterStructured) => boolean;
export declare function filterDistance(distance: number): (filter: RepeaterStructured) => boolean;
export declare function filterMode(...modes: Mode[]): (filter: RepeaterStructured) => boolean;
export declare function filterMinimumRepeaterCount(count: number, repeaters: RepeaterStructured[]): (filter: RepeaterStructured) => boolean;
export declare function buildName(repeater: RepeaterStructured): string;
export declare function getRepeaterSuffix(repeater: RepeaterStructured): string;
export declare function getRepeaterCount(name: string, all: RepeaterStructured[]): number;
export declare function buildComment(repeater: RepeaterStructured): string;
export declare function buildDCS(code: number | undefined): string;
export declare function sortStructuredRepeaters(repeaters: RepeaterStructured[]): RepeaterStructured[];
export declare function loadSimplex(filterSimplex: RegExp): Promise<RepeaterStructured[]>;
export declare function loadRepeaters(location: gpsDistance.Point): Promise<RepeaterStructured[]>;
export declare function radioCommon(repeater: RepeaterStructured): RadioCommon;
export declare function convertOffsetFrequency(offsetFrequency: number): RtSystemsOffsetFrequency;
//# sourceMappingURL=radio-helpers.d.ts.map