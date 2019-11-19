interface IYaesu {
  Number;
  Receive;
  Transmit;
  Offset;
  Direction: TDirection;
  Mode;
  Name;
  ToneMode: TToneMode;
  CTCSS;
  DCS;
  UserCTCSS: '1500 Hz';
  Power: 'HIGH';
  Skip: 'OFF';
  Step: '25.0KHz';
  ClockShift: 0;
  Comment;
  Bank: 0; // 0 = A, 1 = B
}
