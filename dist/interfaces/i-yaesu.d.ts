export interface IYaesu {
    Location: number;
    Name: string;
    TransmitFrequency: number;
    ReceiveFrequency: number;
    FrequencyOffset: number;
    Offset: number;
    TransmitSquelchTone: number;
    ReceiveSquelchTone: number | null;
    TransmitDigitalTone: string;
    ReceiveDigitalTone: string;
    FM: boolean;
    NFM: boolean;
    DtcsPolarity: 'NN';
    Mode: 'FM' | 'NFM';
    TStep: number;
    Comment: string;
}
//# sourceMappingURL=i-yaesu.d.ts.map