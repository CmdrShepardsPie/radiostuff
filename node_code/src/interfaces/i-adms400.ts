export interface IAdms400 {
  Channel_Number: number;
  Receive_Frequency: number;
  Transmit_Frequency: number;
  Offset_Frequency: Adms400OffsetFrequency;
  Offset_Direction: Adms400OffsetDirection;
  Operating_Mode: Adms400OperatingMode;
  Name: string;
  Show_Name: Adms400ShowName;
  Tone_Mode: Adms400ToneMode;
  CTCSS:
  DCS
  Tx_Power
  Skip
  Step
  Clock_Shift
  Comment
  User_CTCSS
}

export enum Adms400OffsetFrequency {
  $100_kHz = '100 kHz',
  $500_kHz = '500 kHz',
  $600_kHz = '600 kHz',
  $1_00_MHz = '1.00 MHz',
  $1_60_MHz = '1.60 MHz',
  $3_00_MHz = '3.00 MHz',
  $5_00_MHz = '5.00 MHz',
  $7_60_MHz = '7.60 MHz',
}

export enum Adms400OffsetDirection {
  Simplex = 'Simplex',
  Minus = 'Minus',
  Plus = 'Plus',
  Split = 'Split',
}

export enum Adms400OperatingMode {
  Auto = 'Auto',
  FM = 'FM',
  FM_Narrow = 'FM Narrow',
  AM = 'AM',
}

export enum Adms400ShowName {
  Small = 'Small',
  Large = 'Large',
}

export enum Adms400ToneMode {
  None = 'None',
  Tone = 'Tone',
  T_Sql = 'T Sql',
  DCS = 'DCS',
  Rev_CTCSS = 'Rev CTCSS',
  User_CTCSS = 'User CTCSS',
  Pager = 'Pager',
  D_Code = 'D Code',
  T_DCS = 'T DCS',
  D_Tone = 'D Tone',
}
