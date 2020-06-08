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
  UserCTCSS: '1500 Hz';
  Power: 'HIGH';
  Skip: 'OFF';
  Step: '25.0KHz';
  ClockShift: 0;
  Comment: string;
  Bank: 0; // 0 = A, 1 = B
}

export type Adms7Mode = 'FM' | 'NFM' | 'AM';
export type Adms7Direction = 'OFF' | '-RPT' | '+RPT' | '-/+';
export type Adms7ToneMode = 'OFF' | 'TONE ENC' | 'TONE SQL' | 'REV TONE' | 'DCS' | 'PR FREQ' | 'PAGER';
