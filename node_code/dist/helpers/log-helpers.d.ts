import { Chalk } from 'chalk';
export declare function createOut(context: string, color?: keyof Chalk): {
    log: (...msg: any[]) => void;
    write: (...msg: any[]) => void;
};
export declare function createLog(context: string, color?: keyof Chalk): (...msg: any[]) => void;
export declare function createWrite(context: string, color?: keyof Chalk): (...msg: any[]) => void;
export declare function createThrowError(context: string): (type: string, ...msg: any[]) => void;
//# sourceMappingURL=log-helpers.d.ts.map