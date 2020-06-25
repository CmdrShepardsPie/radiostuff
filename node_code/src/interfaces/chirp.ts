export interface Chirp {
  Location: number;
  Name: string;
  Frequency: number;
  Duplex: ChirpDuplex;
  Offset: number;
  Tone: ChirpTone;
  rToneFreq: number;
  cToneFreq: number;
  DtcsCode: number;
  DtcsRxCode: number;
  DtcsPolarity: 'NN';
  Mode: ChirpMode;
  TStep: number;
  Comment: string;
}

export type ChirpDuplex = '' | '+' | '-';
export type ChirpTone = '' | 'Tone' | 'DTCS' | 'TSQL' | 'Cross';
export type ChirpMode = 'FM' | 'NFM';
