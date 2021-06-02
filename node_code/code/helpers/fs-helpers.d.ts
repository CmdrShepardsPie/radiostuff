/// <reference types="node" />
import { PathLike, Stats } from 'fs';
export declare const existsAsync: (path: PathLike) => Promise<boolean>;
export declare const mkdirAsync: (path: PathLike) => Promise<void>;
export declare const readFileAsync: (path: PathLike | number) => Promise<Buffer>;
export declare const readdirAsync: (path: PathLike) => Promise<string[]>;
export declare const writeFileAsync: (path: PathLike, data: any) => Promise<void>;
export declare const statAsync: (path: PathLike) => Promise<Stats>;
export declare const rmAsync: (path: PathLike) => Promise<void>;
export declare function makeDirs(filePath: string): Promise<void>;
export declare function dirExists(filePath: string): Promise<boolean>;
export declare function writeToJson(filename: string, jsonData: any | any[]): Promise<void>;
export declare function writeToCsv(filename: string, csvData: any | any[], header?: boolean): Promise<void>;
export declare function readFromJson<T>(filename: string): Promise<T>;
export declare function readFromCsv<T>(filename: string, columns?: boolean, cast?: boolean): Promise<T[]>;
export declare function splitExtension(filename: string): {
    ext: string;
    name: string;
    path: string;
};
export declare function getAllFilesInDirectory(directory: string, extension?: string, subdirectories?: number): Promise<string[]>;
//# sourceMappingURL=fs-helpers.d.ts.map