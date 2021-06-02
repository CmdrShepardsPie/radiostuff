import { IRtSystems, RtSystemsCtcssTone, RtSystemsDcsTone, RtSystemsOffsetFrequency } from '@interfaces/rt-systems';

export interface IWcs7100 extends IRtSystems<Wcs7100OffsetDirection, Wcs7100OperatingMode, Wcs7100ToneMode> {
  'Channel Number': number;
  'Receive Frequency': number;
  'Transmit Frequency': number;
  'Operating Mode': Wcs7100OperatingMode;

  Name: string;

  'Tone Mode': Wcs7100ToneMode;
  'Rx CTCSS': RtSystemsCtcssTone;
  'DCS Polarity': Wcs7100DcsPolarity;

  'Select Scan': Wcs7100SelectScan;

  Comment: string;

  'Digital Squelch': Wcs7100DigitalSquelch;
  'Digital Code': Wcs7100DigitalCode;

  'Your Callsign': Wcs7100YourCallsign;
  'Rpt-1 CallSign': string;
  'Rpt-2 CallSign': string;

  Filter: Wcs7100Filter;

  'Tx Data Mode': Wcs7100DataMode;
  'Data Mode': Wcs7100DataMode;

  'Split Tone Mode': Wcs7100ToneMode;
  'Split CTCSS': RtSystemsCtcssTone;
  'Split Rx CTCSS': RtSystemsCtcssTone;
  'Split DCS': RtSystemsDcsTone;
  'Split DCS Polarity': Wcs7100DcsPolarity;

  'Tx Filter': Wcs7100Filter;
  'Tx Operating Mode': Wcs7100OperatingMode;
}

export class Wcs7100 implements IWcs7100 {
  'Channel Number': number = -1;
  'Receive Frequency': number = 144;
  'Transmit Frequency': number = 144;
  'Offset Frequency': RtSystemsOffsetFrequency = RtSystemsOffsetFrequency.None;
  'Offset Direction': Wcs7100OffsetDirection = Wcs7100OffsetDirection.Simplex;
  'Operating Mode': Wcs7100OperatingMode = Wcs7100OperatingMode.FM;

  Name: string = '';

  'Tone Mode': Wcs7100ToneMode = Wcs7100ToneMode.None;
  CTCSS: RtSystemsCtcssTone = RtSystemsCtcssTone.$88_5_Hz;
  'Rx CTCSS': RtSystemsCtcssTone = RtSystemsCtcssTone.$88_5_Hz;
  DCS: RtSystemsDcsTone = RtSystemsDcsTone.$23;
  'DCS Polarity': Wcs7100DcsPolarity = Wcs7100DcsPolarity.Both_N;

  'Select Scan': Wcs7100SelectScan = Wcs7100SelectScan.Off;

  Comment: string = '';

  'Digital Squelch': Wcs7100DigitalSquelch = Wcs7100DigitalSquelch.None;
  'Digital Code': Wcs7100DigitalCode = Wcs7100DigitalCode.None;

  'Your Callsign': Wcs7100YourCallsign = Wcs7100YourCallsign.None;
  'Rpt-1 CallSign': string = '';
  'Rpt-2 CallSign': string = '';

  Filter: Wcs7100Filter = Wcs7100Filter.Filter_1;

  'Tx Data Mode': Wcs7100DataMode = Wcs7100DataMode.None;
  'Data Mode': Wcs7100DataMode = Wcs7100DataMode.None;

  'Split Tone Mode': Wcs7100ToneMode = Wcs7100ToneMode.None;
  'Split CTCSS': RtSystemsCtcssTone = RtSystemsCtcssTone.$88_5_Hz;
  'Split Rx CTCSS': RtSystemsCtcssTone = RtSystemsCtcssTone.$88_5_Hz;
  'Split DCS': RtSystemsDcsTone = RtSystemsDcsTone.$23;
  'Split DCS Polarity': Wcs7100DcsPolarity = Wcs7100DcsPolarity.Both_N;

  'Tx Filter': Wcs7100Filter = Wcs7100Filter.Filter_1;
  'Tx Operating Mode': Wcs7100OperatingMode = Wcs7100OperatingMode.FM;

  constructor(wcs7100?: Partial<Wcs7100>) {
    if (wcs7100) {
      Object.assign(this, wcs7100);
    }
  }
}

export enum Wcs7100OffsetDirection {
  Simplex = 'Simplex',
  Minus = '-DUP',
  Plus = '+DUP',
  Split = 'Split',
}

export enum Wcs7100OperatingMode {
  LSB = 'LSB',
  USB = 'USB',
  CW = 'CW',
  CW_R = 'CW-R',
  RTTY = 'RTTY',
  RTTY_R = 'RTTY-R',
  AM = 'AM',
  FM = 'FM',
  DV = 'DV',
  WFM = 'WFM',
}

export enum Wcs7100ToneMode {
  None = 'None',
  Tone = 'Tone',
  T_Sql = 'T Sql',
  DTCS = 'DTCS'
}

export enum Wcs7100DcsPolarity {
  Both_N = 'Both N',
  TN_RR = 'TN-RR',
  TR_RN = 'TR-RN',
  Both_R = 'Both R',
}

export enum Wcs7100SelectScan {
  Off = 'Off',
  On = 'On',
}

export enum Wcs7100DigitalSquelch {
  None = '',
  Off = 'Off'
}

export enum Wcs7100DigitalCode {
  None = '',
  $0 = '0'
}

export enum Wcs7100YourCallsign {
  None = '',
  CQCQCQ = 'CQCQCQ',
}

export enum Wcs7100Filter {
  Filter_1 = 'Filter 1',
  Filter_2 = 'Filter 2',
  Filter_3 = 'Filter 3',
}

export enum Wcs7100DataMode {
  None = '',
  Data = 'Data',
}

export enum Wcs7100ClockShift {
  Off = 'Off',
  On = 'On',
}
