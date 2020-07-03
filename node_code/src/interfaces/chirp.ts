export interface IChirp {
  Location: number;
  Name: string;
  Frequency: number;
  Duplex: ChirpDuplex;
  Offset: number;
  Tone: ChirpToneMode;
  rToneFreq: number;
  cToneFreq: number;
  DtcsCode: number;
  DtcsRxCode: number;
  DtcsPolarity: string;
  Mode: ChirpOperatingMode;
  TStep: number;
  Comment: string;
}

export class Chirp implements IChirp {
  Location: number = 0;
  Name: string = '';
  Frequency: number = 144;
  Duplex: ChirpDuplex = ChirpDuplex.Simplex;
  Offset: number = 0;
  Tone: ChirpToneMode = ChirpToneMode.None;
  rToneFreq: number = 88.5;
  cToneFreq: number = 88.5;
  DtcsCode: number = 23;
  DtcsRxCode: number = 23;
  DtcsPolarity: string = 'NN';
  Mode: ChirpOperatingMode = ChirpOperatingMode.FM;
  TStep: number = 5;
  Comment: string = '';

  constructor(chirp?: Partial<Chirp>) {
    if (chirp) {
      Object.assign(this, chirp);
    }
  }
}

export enum ChirpOffsetDirection {
  Simplex = '',
  Minus = '-',
  Plus = '+',
}

export enum ChirpOperatingMode {
  FM = 'FM',
  NFM = 'NFM',
}

export enum ChirpShowName {
  Small = 'Small',
  Large = 'Large',
}

export enum ChirpToneMode {
  None = '',
  Tone = 'Tone',
  T_Sql = 'TSQL',
  DTCS = 'DTCS',
  DTCS_R = 'DTCS-R',
  TSQL_R = 'TSQL-R',
  Cross = 'Cross',
}

export enum ChirpDuplex {
  Simplex = '',
  Minus = '-',
  Plus = '+'
}
