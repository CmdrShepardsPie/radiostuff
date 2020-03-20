/// <reference types="node" />
import { Stats } from "fs";
export declare const existsAsync: (path: string) => Promise<boolean>;
export declare const mkdirAsync: (path: string) => Promise<void>;
export declare const readFileAsync: (path: string | number) => Promise<Buffer>;
export declare const readdirAsync: (path: string) => Promise<string[]>;
export declare const writeFileAsync: (path: string | number, data: any) => Promise<void>;
export declare const statAsync: (arg1: string) => Promise<Stats>;
export declare function makeDirs(filePath: string): Promise<void>;
export declare function dirExists(filePath: string): Promise<boolean>;
export declare function writeToJsonAndCsv(filename: string, jsonData: any[], csvData?: any[], header?: boolean): Promise<void>;
export declare function splitExtension(filename: string): {
    ext: string;
    name: string;
};
export declare function getAllFilesFromDirectory<T>(directory: string): Promise<T[]>;
//# sourceMappingURL=fs-helpers.d.ts.map