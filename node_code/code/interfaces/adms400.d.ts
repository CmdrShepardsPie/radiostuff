import { IRtSystems, RtSystemsOffsetFrequency, RtSystemsCtcssTone, RtSystemsDcsTone, RtSystemsUserCtcss } from '@interfaces/rt-systems';
export interface IAdms400 extends IRtSystems<Adms400OffsetDirection, Adms400OperatingMode, Adms400ToneMode> {
    'Channel Number': number;
    'Receive Frequency': number;
    'Transmit Frequency': number;
    'Offset Direction': Adms400OffsetDirection;
    'Operating Mode': Adms400OperatingMode;
    Name: string;
    'Show Name': Adms400ShowName;
    'Tone Mode': Adms400ToneMode;
    'Tx Power': Adms400TxPower;
    Skip: Adms400Skip;
    Step: Adms400Step;
    'Clock Shift': Adms400ClockShift;
    Comment: string;
    'User CTCSS': RtSystemsUserCtcss;
}
export declare class Adms400 implements IAdms400 {
    'Channel Number': number;
    'Receive Frequency': number;
    'Transmit Frequency': number;
    'Offset Frequency': RtSystemsOffsetFrequency;
    'Offset Direction': Adms400OffsetDirection;
    'Operating Mode': Adms400OperatingMode;
    Name: string;
    'Show Name': Adms400ShowName;
    'Tone Mode': Adms400ToneMode;
    CTCSS: RtSystemsCtcssTone;
    DCS: RtSystemsDcsTone;
    'Tx Power': Adms400TxPower;
    Skip: Adms400Skip;
    Step: Adms400Step;
    'Clock Shift': Adms400ClockShift;
    Comment: string;
    'User CTCSS': RtSystemsUserCtcss;
    constructor(adms400?: Partial<Adms400>);
}
export declare enum Adms400OffsetFrequency {
    None = "",
    $100_kHz = "100 kHz",
    $500_kHz = "500 kHz",
    $600_kHz = "600 kHz",
    $1_MHz = "1.00 MHz",
    $1_60_MHz = "1.60 MHz",
    $3_MHz = "3.00 MHz",
    $5_MHz = "5.00 MHz",
    $7_60_MHz = "7.60 MHz"
}
export declare enum Adms400OffsetDirection {
    Simplex = "Simplex",
    Minus = "Minus",
    Plus = "Plus",
    Split = "Split"
}
export declare enum Adms400OperatingMode {
    Auto = "Auto",
    FM = "FM",
    FM_Narrow = "FM Narrow",
    AM = "AM"
}
export declare enum Adms400ShowName {
    Small = "Small",
    Large = "Large"
}
export declare enum Adms400ToneMode {
    None = "None",
    Tone = "Tone",
    T_Sql = "T Sql",
    DCS = "DCS",
    Rev_CTCSS = "Rev CTCSS",
    User_CTCSS = "User CTCSS",
    Pager = "Pager",
    D_Code = "D Code",
    T_DCS = "T DCS",
    D_Tone = "D Tone"
}
export declare enum Adms400TxPower {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}
export declare enum Adms400Skip {
    Off = "Off",
    Skip = "Skip",
    Select = "Select"
}
export declare enum Adms400Step {
    Auto = "Auto",
    $5_khz = "5 khz",
    $6_25_khz = "6.25 kHz",
    $10_khz = "10 kHz",
    $12_5_khz = "12.5 kHz",
    $15_khz = "15 kHz",
    $20_khz = "20 kHz",
    $25_khz = "25 kHz",
    $50_khz = "50 kHz",
    $100_khz = "100 kHz"
}
export declare enum Adms400ClockShift {
    Off = "Off",
    On = "On"
}
//# sourceMappingURL=adms400.d.ts.map