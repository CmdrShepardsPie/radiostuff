export interface IYaesu {
  Number: number;
  Receive: string;
  Transmit: string;
  Offset: string;
  Direction: YaesuDirection;
  Mode: YaesuMode;
  Name: string;
  ToneMode: YaesuToneMode;
  CTCSS: string;
  DCS: string;
  UserCTCSS: '1500 Hz';
  Power: 'HIGH';
  Skip: 'OFF';
  Step: '25.0KHz';
  ClockShift: 0;
  Comment: string;
  Bank: 0; // 0 = A, 1 = B
}

export type YaesuMode = 'FM' | 'NFM' | 'AM';
export type YaesuDirection = 'OFF' | '-RPT' | '+RPT' | '-/+';
export type YaesuToneMode = 'OFF' | 'TONE ENC' | 'TONE SQL' | 'REV TONE' | 'DCS' | 'PR FREQ' | 'PAGER';
