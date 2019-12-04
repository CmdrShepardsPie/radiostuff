export interface IChirp {
    Location: number;
    Name: string;
    Frequency: number;
    Duplex: ChirpDuplex;
    Offset: number;
    Tone: ChirpTone;
    rToneFreq: number;
    cToneFreq: number;
    DtcsCode: number;
    DtcsRxCode: number;
    DtcsPolarity: 'NN';
    Mode: ChirpMode;
    TStep: number;
    Comment: string;
}
export declare type ChirpDuplex = '' | '+' | '-';
export declare type ChirpTone = '' | 'Tone' | 'DTCS' | 'TSQL' | 'Cross';
export declare type ChirpMode = 'FM' | 'NFM';
//# sourceMappingURL=i-chirp.d.ts.map