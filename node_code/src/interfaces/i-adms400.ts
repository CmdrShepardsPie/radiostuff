export interface IAdms400 {
  'Channel Number': number;
  'Receive Frequency': number;
  'Transmit Frequency': number;
  'Offset Frequency': Adms400OffsetFrequency;
  'Offset Direction': Adms400OffsetDirection;
  'Operating Mode': Adms400OperatingMode;
  Name: string;
  'Show Name': Adms400ShowName;
  'Tone Mode': Adms400ToneMode;
  CTCSS: Adms400CtcssTone;
  DCS: Adms400DcsTone;
  'Tx Power': Adms400TxPower;
  Skip: Adms400Skip;
  Step: Adms400Step;
  'Clock Shift': Adms400ClockShift;
  Comment: string;
  'User CTCSS': Adms400UserCtcss;
}

export class Adms400 implements IAdms400 {
  'Channel Number': number = 1;
  'Receive Frequency': number = 144;
  'Transmit Frequency': number = 144;
  'Offset Frequency': Adms400OffsetFrequency = Adms400OffsetFrequency.None;
  'Offset Direction': Adms400OffsetDirection = Adms400OffsetDirection.Simplex;
  'Operating Mode': Adms400OperatingMode = Adms400OperatingMode.Auto;
  Name: string = '';
  'Show Name': Adms400ShowName = Adms400ShowName.Large;
  'Tone Mode': Adms400ToneMode = Adms400ToneMode.None;
  CTCSS: Adms400CtcssTone = Adms400CtcssTone.$100_0_Hz;
  DCS: Adms400DcsTone = Adms400DcsTone.$023;
  'Tx Power': Adms400TxPower = Adms400TxPower.Low;
  Skip: Adms400Skip = Adms400Skip.Off;
  Step: Adms400Step = Adms400Step.Auto;
  'Clock Shift': Adms400ClockShift = Adms400ClockShift.Off;
  Comment: string = '';
  'User CTCSS': Adms400UserCtcss = Adms400UserCtcss.$1500_Hz;

  constructor(adms400?: Partial<IAdms400>) {
    if (adms400) {
      Object.assign(this, adms400);
    }
  }
}

export enum Adms400OffsetFrequency {
  None = '',
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

export enum Adms400CtcssTone {
  $67_0_Hz = '67.0 Hz',
  $69_3_Hz = '69.3 Hz',
  $71_9_Hz = '71.9 Hz',
  $74_4_Hz = '74.4 Hz',
  $77_0_Hz = '77.0 Hz',
  $79_7_Hz = '79.7 Hz',
  $82_5_Hz = '82.5 Hz',
  $85_4_Hz = '85.4 Hz',
  $88_5_Hz = '88.5 Hz',
  $91_5_Hz = '91.5 Hz',
  $94_8_Hz = '94.8 Hz',
  $97_4_Hz = '97.4 Hz',
  $100_0_Hz = '100.0 Hz',
  $103_5_Hz = '103.5 Hz',
  $107_2_Hz = '107.2 Hz',
  $110_9_Hz = '110.9 Hz',
  $114_8_Hz = '114.8 Hz',
  $118_8_Hz = '118.8 Hz',
  $123_0_Hz = '123.0 Hz',
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

export enum Adms400DcsTone {
  $006 = '006',
  $007 = '007',
  $015 = '015',
  $017 = '017',
  $021 = '021',
  $023 = '023',
  $025 = '025',
  $026 = '026',
  $031 = '031',
  $032 = '032',
  $036 = '036',
  $043 = '043',
  $047 = '047',
  $050 = '050',
  $051 = '051',
  $053 = '053',
  $054 = '054',
  $065 = '065',
  $071 = '071',
  $072 = '072',
  $073 = '073',
  $074 = '074',
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

export enum Adms400TxPower {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum Adms400Skip {
  Off = 'Off',
  Skip = 'Skip',
  Select = 'Select',
}

export enum Adms400Step {
  Auto = 'Auto',
  $5_khz = '5 khz',
  $6_25_khz = '6.25 kHz',
  $10_khz = '10 kHz',
  $12_5_khz = '12.5 kHz',
  $15_khz = '15 kHz',
  $20_khz = '20 kHz',
  $25_khz = '25 kHz',
  $50_khz = '50 kHz',
  $100_khz = '100 kHz',
}

export enum Adms400UserCtcss {
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

export enum Adms400ClockShift {
  Off = 'Off',
  On = 'On',
}
