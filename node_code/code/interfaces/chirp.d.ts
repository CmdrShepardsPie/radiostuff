export interface IChirp {
    Location: number;
    Name: string;
    Frequency: number;
    Duplex: ChirpDuplex;
    Offset: number;
    Tone: ChirpToneMode;
    rToneFreq: number;
    cToneFreq: number;
    DtcsCode: number;
    DtcsRxCode: number;
    DtcsPolarity: string;
    Mode: ChirpOperatingMode;
    TStep: number;
    Comment: string;
}
export declare class Chirp implements IChirp {
    Location: number;
    Name: string;
    Frequency: number;
    Duplex: ChirpDuplex;
    Offset: number;
    Tone: ChirpToneMode;
    rToneFreq: number;
    cToneFreq: number;
    DtcsCode: number;
    DtcsRxCode: number;
    DtcsPolarity: string;
    Mode: ChirpOperatingMode;
    TStep: number;
    Comment: string;
    constructor(chirp?: Partial<Chirp>);
}
export declare enum ChirpOffsetDirection {
    Simplex = "",
    Minus = "-",
    Plus = "+"
}
export declare enum ChirpOperatingMode {
    FM = "FM",
    NFM = "NFM"
}
export declare enum ChirpShowName {
    Small = "Small",
    Large = "Large"
}
export declare enum ChirpToneMode {
    None = "",
    Tone = "Tone",
    T_Sql = "TSQL",
    DTCS = "DTCS",
    DTCS_R = "DTCS-R",
    TSQL_R = "TSQL-R",
    Cross = "Cross"
}
export declare enum ChirpDuplex {
    Simplex = "",
    Minus = "-",
    Plus = "+",
    Split = "split"
}
//# sourceMappingURL=chirp.d.ts.map