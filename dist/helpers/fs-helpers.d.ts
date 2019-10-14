/// <reference types="node" />
import * as _fs from "fs";
export declare const existsAsync: typeof _fs.exists.__promisify__;
export declare const mkdirAsync: typeof _fs.mkdir.__promisify__;
export declare const readFileAsync: typeof _fs.readFile.__promisify__;
export declare const readdirAsync: typeof _fs.readdir.__promisify__;
export declare const writeFileAsync: typeof _fs.writeFile.__promisify__;
export declare const statAsync: typeof _fs.stat.__promisify__;
export declare function makeDirs(filePath: string): Promise<void>;
export declare function dirExists(filePath: string): Promise<boolean>;
export declare function writeToJsonAndCsv(filename: string, jsonData: any, csvData?: any, header?: boolean): Promise<void>;
export declare function splitExtension(filename: string): {
    name: string;
    ext: string;
};
export declare function getAllFilesFromDirectory<T>(directory: string): Promise<T[]>;
//# sourceMappingURL=fs-helpers.d.ts.map