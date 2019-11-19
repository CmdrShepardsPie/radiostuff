export interface IChirp {
    Location: number;
    Name: string;
    Frequency: number;
    Duplex: '' | '+' | '-';
    Offset: number;
    Tone: '' | 'Tone' | 'DTCS' | 'TSQL' | 'Cross';
    rToneFreq: number;
    cToneFreq: number;
    DtcsCode: number;
    DtcsRxCode: number;
    DtcsPolarity: 'NN';
    Mode: 'FM' | 'NFM';
    TStep: number;
    Comment: string;
}
//# sourceMappingURL=i-chirp.d.ts.map