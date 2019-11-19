export interface IRepeater {
    ID: number;
    StateID: number;
    Callsign: string;
    Name: string;
    Location: {
        Latitude: number;
        Longitude: number;
        County: string;
        State: string;
        City?: string;
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
    Digital?: {
        ATV?: boolean;
        DMR?: {
            ColorCode?: number;
            ID?: number;
        };
        P25?: {
            NAC?: number;
        };
        DStar?: {
            Node?: number;
        };
        YSF?: {
            GroupID?: {
                Input?: number;
                Output?: number;
            };
        };
    };
    VOIP?: {
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
        WIRES?: {
            ID?: number;
        };
    };
    Comment: string;
}
export declare enum RepeaterUse {
    Open = "OPEN",
    Closed = "CLOSED",
    Private = "PRIVATE"
}
export declare enum RepeaterStatus {
    OnAir = "On-Air",
    OffAir = "Off-Air",
    Unknown = "Unknown",
    Testing = "Testing"
}
export declare enum EchoLinkNodeStatus {
    OnIdle = "ON - IDLE",
    NodeOffline = "Node Offline"
}
//# sourceMappingURL=i-repeater.d.ts.map