export interface IChirp {
    Location: number;
    Name: string;
    Frequency: number;
    Duplex: '' | '+' | '-';
    Offset: number;
    Tone: '' | 'Tone' | 'DTCS';
    rToneFreq: number;
    cToneFreq: number;
    DtcsCode: string;
    DtcsRxCode: string;
    DtcsPolarity: 'NN';
    Mode: 'FM' | 'NFM';
    TStep: number;
    Comment: string;
}
//# sourceMappingURL=i-chirp.d.ts.map