export interface IAdms7 {
    Number: number;
    Receive: string;
    Transmit: string;
    Offset: string;
    Direction: Adms7Direction;
    Mode: Adms7Mode;
    Name: string;
    ToneMode: Adms7ToneMode;
    CTCSS: string;
    DCS: string;
    UserCTCSS: "1500 Hz";
    Power: "HIGH";
    Skip: "OFF";
    Step: "25.0KHz";
    ClockShift: 0;
    Comment: string;
    Bank: 0;
}
export declare type Adms7Mode = "FM" | "NFM" | "AM";
export declare type Adms7Direction = "OFF" | "-RPT" | "+RPT" | "-/+";
export declare type Adms7ToneMode = "OFF" | "TONE ENC" | "TONE SQL" | "REV TONE" | "DCS" | "PR FREQ" | "PAGER";
//# sourceMappingURL=i-adms7.d.ts.map