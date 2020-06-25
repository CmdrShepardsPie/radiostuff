export interface Adms7 {
  Number: number;
  Receive: string;
  Transmit: string;
  Offset: string;
  Direction: Adms7OffsetDirection;
  Mode: Adms7OperatingMode;
  Name: string;
  ToneMode: Adms7ToneMode;
  CTCSS: Adms7CtcssTone;
  DCS: Adms7DcsTone;
  UserCTCSS: Adms7UserCtcss;
  Power: Adms7TxPower;
  Skip: Adms7Skip;
  Step: Adms7Step;
  ClockShift: Adms7ClockShift;
  Comment: string;
  Bank: Adms7Bank;
}

export class Adms7 implements Adms7 {
  Number: number = -1;
  Receive: string = '';
  Transmit: string = '';
  Offset: string = (0).toFixed(5);
  Direction: Adms7OffsetDirection = Adms7OffsetDirection.Off;
  Mode: Adms7OperatingMode = Adms7OperatingMode.FM;
  Name: string = '';
  ToneMode: Adms7ToneMode = Adms7ToneMode.Off;
  CTCSS: Adms7CtcssTone = Adms7CtcssTone.$100_Hz;
  DCS: Adms7DcsTone = Adms7DcsTone.$23;
  UserCTCSS: Adms7UserCtcss = Adms7UserCtcss.$1500_Hz;
  Power: Adms7TxPower = Adms7TxPower.Low;
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

export enum Adms7CtcssTone {
  $67_Hz = '67.0 Hz',
  $69_3_Hz = '69.3 Hz',
  $71_9_Hz = '71.9 Hz',
  $74_4_Hz = '74.4 Hz',
  $77_Hz = '77.0 Hz',
  $79_7_Hz = '79.7 Hz',
  $82_5_Hz = '82.5 Hz',
  $85_4_Hz = '85.4 Hz',
  $88_5_Hz = '88.5 Hz',
  $91_5_Hz = '91.5 Hz',
  $94_8_Hz = '94.8 Hz',
  $97_4_Hz = '97.4 Hz',
  $100_Hz = '100.0 Hz',
  $103_5_Hz = '103.5 Hz',
  $107_2_Hz = '107.2 Hz',
  $110_9_Hz = '110.9 Hz',
  $114_8_Hz = '114.8 Hz',
  $118_8_Hz = '118.8 Hz',
  $123_Hz = '123.0 Hz',
  $127_3_Hz = '127.3 Hz',
  $131_8_Hz = '131.8 Hz',
  $136_5_Hz = '136.5 Hz',
  $141_3_Hz = '141.3 Hz',
  $146_2_Hz = '146.2 Hz',
  $151_4_Hz = '151.4 Hz',
  $156_7_Hz = '156.7 Hz',
  $159_8_Hz = '159.8 Hz',
  $162_2_Hz = '162.2 Hz',
  $165_5_Hz = '165.5 Hz',
  $167_9_Hz = '167.9 Hz',
  $171_3_Hz = '171.3 Hz',
  $173_8_Hz = '173.8 Hz',
  $177_3_Hz = '177.3 Hz',
  $179_9_Hz = '179.9 Hz',
  $183_5_Hz = '183.5 Hz',
  $186_2_Hz = '186.2 Hz',
  $189_9_Hz = '189.9 Hz',
  $192_8_Hz = '192.8 Hz',
  $196_6_Hz = '196.6 Hz',
  $199_5_Hz = '199.5 Hz',
  $203_5_Hz = '203.5 Hz',
  $206_5_Hz = '206.5 Hz',
  $210_7_Hz = '210.7 Hz',
  $218_1_Hz = '218.1 Hz',
  $225_7_Hz = '225.7 Hz',
  $229_1_Hz = '229.1 Hz',
  $233_6_Hz = '233.6 Hz',
  $241_8_Hz = '241.8 Hz',
  $250_3_Hz = '250.3 Hz',
  $254_1_Hz = '254.1 Hz',
}

export enum Adms7DcsTone {
  $6 = '006',
  $7 = '007',
  $15 = '015',
  $17 = '017',
  $21 = '021',
  $23 = '023',
  $25 = '025',
  $26 = '026',
  $31 = '031',
  $32 = '032',
  $36 = '036',
  $43 = '043',
  $47 = '047',
  $50 = '050',
  $51 = '051',
  $53 = '053',
  $54 = '054',
  $65 = '065',
  $71 = '071',
  $72 = '072',
  $73 = '073',
  $74 = '074',
  $114 = '114',
  $115 = '115',
  $116 = '116',
  $122 = '122',
  $125 = '125',
  $131 = '131',
  $132 = '132',
  $134 = '134',
  $141 = '141',
  $143 = '143',
  $145 = '145',
  $152 = '152',
  $155 = '155',
  $156 = '156',
  $162 = '162',
  $165 = '165',
  $172 = '172',
  $174 = '174',
  $205 = '205',
  $212 = '212',
  $214 = '214',
  $223 = '223',
  $225 = '225',
  $226 = '226',
  $243 = '243',
  $244 = '244',
  $245 = '245',
  $246 = '246',
  $251 = '251',
  $252 = '252',
  $255 = '255',
  $261 = '261',
  $263 = '263',
  $265 = '265',
  $266 = '266',
  $271 = '271',
  $274 = '274',
  $306 = '306',
  $311 = '311',
  $315 = '315',
  $325 = '325',
  $331 = '331',
  $332 = '332',
  $343 = '343',
  $346 = '346',
  $351 = '351',
  $356 = '356',
  $364 = '364',
  $365 = '365',
  $371 = '371',
  $411 = '411',
  $412 = '412',
  $413 = '413',
  $423 = '423',
  $431 = '431',
  $432 = '432',
  $445 = '445',
  $446 = '446',
  $452 = '452',
  $454 = '454',
  $455 = '455',
  $462 = '462',
  $464 = '464',
  $465 = '465',
  $466 = '466',
  $503 = '503',
  $506 = '506',
  $516 = '516',
  $523 = '523',
  $526 = '526',
  $532 = '532',
  $546 = '546',
  $565 = '565',
  $606 = '606',
  $612 = '612',
  $624 = '624',
  $627 = '627',
  $631 = '631',
  $632 = '632',
  $654 = '654',
  $662 = '662',
  $664 = '664',
  $703 = '703',
  $712 = '712',
  $723 = '723',
  $731 = '731',
  $732 = '732',
  $734 = '734',
  $743 = '743',
  $754 = '754',
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

export enum Adms7UserCtcss {
  $300_Hz = '300 Hz',
  $400_Hz = '400 Hz',
  $500_Hz = '500 Hz',
  $600_Hz = '600 Hz',
  $700_Hz = '700 Hz',
  $800_Hz = '800 Hz',
  $900_Hz = '900 Hz',
  $1000_Hz = '1000 Hz',
  $1100_Hz = '1100 Hz',
  $1200_Hz = '1200 Hz',
  $1300_Hz = '1300 Hz',
  $1400_Hz = '1400 Hz',
  $1500_Hz = '1500 Hz',
  $1600_Hz = '1600 Hz',
  $1700_Hz = '1700 Hz',
  $1800_Hz = '1800 Hz',
  $1900_Hz = '1900 Hz',
  $2000_Hz = '2000 Hz',
  $2100_Hz = '2100 Hz',
  $2200_Hz = '2200 Hz',
  $2300_Hz = '2300 Hz',
  $2400_Hz = '2400 Hz',
  $2500_Hz = '2500 Hz',
  $2600_Hz = '2600 Hz',
  $2700_Hz = '2700 Hz',
  $2800_Hz = '2800 Hz',
  $2900_Hz = '2900 Hz',
  $3000_Hz = '3000 Hz',
}

export enum Adms7ClockShift {
  Off = 0,
  On = 1,
}

export enum Adms7Bank {
  A = 0,
  B = 1,
}