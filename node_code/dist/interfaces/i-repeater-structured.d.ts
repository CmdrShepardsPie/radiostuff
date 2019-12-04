export interface IRepeaterStructured {
    ID: number;
    StateID: number;
    Callsign: string;
    Location: {
        Latitude: number;
        Longitude: number;
        County: string;
        State: string;
        Local: string;
        Distance?: number;
    };
    Use: RepeaterUse;
    Status: RepeaterStatus;
    Frequency: {
        Input: number;
        Output: number;
    };
    SquelchTone?: {
        Input?: number;
        Output?: number;
    };
    DigitalTone?: {
        Input?: number;
        Output?: number;
    };
    Digital?: IRepeaterDigitalModes;
    VOIP?: IRepeaterVOIPModes;
}
export declare enum RepeaterUse {
    Open = "Open",
    Closed = "Closed",
    Private = "Private",
    Other = "Other"
}
export declare enum RepeaterStatus {
    OnAir = "On-Air",
    OffAir = "Off-Air",
    Testing = "Testing",
    Unknown = "Unknown",
    Other = "Other"
}
export declare enum EchoLinkNodeStatus {
    OnIdle = "ON - IDLE",
    NodeOffline = "Node Offline"
}
export interface IRepeaterDigitalModes {
    ATV?: boolean;
    DMR?: {
        ColorCode?: number;
        ID?: number;
    };
    P25?: {
        NAC?: number;
    };
    DStar?: {
        Node?: string;
    };
    YSF?: {
        GroupID?: {
            Input?: string;
            Output?: string;
        };
    };
}
export interface IRepeaterVOIPModes {
    AllStar?: {
        NodeID?: number;
    };
    EchoLink?: {
        NodeID?: number;
        Call?: string;
        Status?: EchoLinkNodeStatus;
    };
    IRLP?: {
        NodeID?: number;
    };
    Wires?: {
        ID?: number;
    };
}
//# sourceMappingURL=i-repeater-structured.d.ts.map