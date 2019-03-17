export declare function createOut(context: string, color?: string): {
    log: (...msg: any[]) => void;
    write: (...msg: any[]) => void;
};
export declare function createLog(context: string, color?: string): (...msg: any[]) => void;
export declare function createWrite(context: string, color?: string): (...msg: any[]) => void;
export declare function createThrowError(context: string): (type: string, ...msg: any[]) => void;
//# sourceMappingURL=log-helpers.d.ts.map