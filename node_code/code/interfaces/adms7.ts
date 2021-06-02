import { RtSystemsCtcssTone, RtSystemsDcsTone, RtSystemsUserCtcss } from '@interfaces/rt-systems';

export interface IAdms7 {
  Number: number;
  Receive: string;
  Transmit: string;
  Offset: string;
  Direction: Adms7OffsetDirection;
  Mode: Adms7OperatingMode;
  Name: string;
  ToneMode: Adms7ToneMode;
  CTCSS: RtSystemsCtcssTone;
  DCS: RtSystemsDcsTone;
  UserCTCSS: RtSystemsUserCtcss;
  Power: Adms7TxPower;
  Skip: Adms7Skip;
  Step: Adms7Step;
  ClockShift: Adms7ClockShift;
  Comment: string;
  Bank: Adms7Bank;
}

export class Adms7 implements IAdms7 {
  Number: number = -1;
  Receive: string = '';
  Transmit: string = '';
  Offset: string = (0).toFixed(5);
  Direction: Adms7OffsetDirection = Adms7OffsetDirection.Off;
  Mode: Adms7OperatingMode = Adms7OperatingMode.FM;
  Name: string = '';
  ToneMode: Adms7ToneMode = Adms7ToneMode.Off;
  CTCSS: RtSystemsCtcssTone = RtSystemsCtcssTone.$100_Hz;
  DCS: RtSystemsDcsTone = RtSystemsDcsTone.$23;
  UserCTCSS: RtSystemsUserCtcss = RtSystemsUserCtcss.$1500_Hz;
  Power: Adms7TxPower = Adms7TxPower.High;
  Skip: Adms7Skip = Adms7Skip.Off;
  Step: Adms7Step = Adms7Step.$5_khz;
  ClockShift: Adms7ClockShift = Adms7ClockShift.Off;
  Comment: string = '';
  Bank: Adms7Bank = Adms7Bank.A;

  constructor(adms7?: Partial<Adms7>) {
    if (adms7) {
      Object.assign(this, adms7);
    }
  }
}

export enum Adms7OffsetDirection {
  Off = 'OFF',
  Minus = '-RPT',
  Plus = '+RPT',
  Split = '-/+',
}

export enum Adms7OperatingMode {
  FM = 'FM',
  NFM = 'NFM',
  AM = 'AM',
}

export enum Adms7ToneMode {
  Off = 'OFF',
  Tone_Enc = 'TONE ENC',
  Tone_Sql = 'TONE SQL',
  DCS = 'DCS',
  Rev_Tone = 'REV TONE',
  PR_Freq = 'PR FREQ',
  Pager = 'PAGER'
}

export enum Adms7TxPower {
  Low = 'LOW',
  Medium = 'MID',
  High = 'HIGH',
}

export enum Adms7Skip {
  Off = 'OFF',
  Skip = 'SKIP',
  Select = 'SELECT',
}

export enum Adms7Step {
  $5_khz = '5.0KHz',
  $6_25_khz = '6.25KHz',
  $10_khz = '10.0KHz',
  $12_5_khz = '12.5KHz',
  $15_khz = '15.0KHz',
  $20_khz = '20.0KHz',
  $25_khz = '25.0KHz',
  $50_khz = '50.0KHz',
  $100_khz = '100.0KHz',
}

export enum Adms7ClockShift {
  Off = 0,
  On = 1,
}

export enum Adms7Bank {
  A = 0,
  B = 1,
}
