export interface SimplexRepeaterIntermediate {
  Callsign: string;
  Frequency: { Input: number; Output: number };
}

export interface RepeaterStructured {
  ID: number;
  StateID: number;
  Callsign: string;
  // Name: string;
  Location: { Latitude: number; Longitude: number; County: string; State: string; Local: string, Distance?: number };
  Use: RepeaterUse;
  Status: RepeaterStatus;
  Frequency: { Input: number; Output: number };
  SquelchTone?: { Input?: number; Output?: number };
  DigitalTone?: { Input?: number; Output?: number };
  Digital?: RepeaterDigitalModes;
  VOIP?: RepeaterVOIPModes;
  // Comment: string;
}

export enum RepeaterUse {
  Open = 'Open',
  Closed = 'Closed',
  Private = 'Private',
  Other = 'Other',
}

export enum RepeaterStatus {
  OnAir = 'On-Air',
  OffAir = 'Off-Air',
  Testing = 'Testing',
  Unknown = 'Unknown',
  Other = 'Other',
}

export enum EchoLinkNodeStatus {
  OnIdle = 'ON - IDLE',
  NodeOffline = 'Node Offline',
}

export interface RepeaterDigitalModes {
  ATV?: boolean;
  DMR?: { ColorCode?: number; ID?: number };
  P25?: { NAC?: number; };
  DStar?: { Node?: string; };
  NXDN?: { RAN?: number; }
  YSF?: { GroupID?: { Input?: string; Output?: string }; };
}

export interface RepeaterVOIPModes {
  AllStar?: { NodeID?: number; };
  EchoLink?: { NodeID?: number; Call?: string; Status?: EchoLinkNodeStatus };
  IRLP?: { NodeID?: number; };
  Wires?: { ID?: number; };
}
