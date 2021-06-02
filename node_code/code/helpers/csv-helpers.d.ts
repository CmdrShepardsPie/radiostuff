/// <reference types="node" />
import parse from 'csv-parse';
import stringify from 'csv-stringify';
export declare type ParsePromise = (input: Buffer | string, options?: parse.Options) => Promise<any>;
export declare type StringifyPromise = (input: any, options?: stringify.Options) => Promise<string>;
export declare const parseAsync: ParsePromise;
export declare const stringifyAsync: StringifyPromise;
export declare function fillArrayObjects(inArray: object[]): object[];
//# sourceMappingURL=csv-helpers.d.ts.map