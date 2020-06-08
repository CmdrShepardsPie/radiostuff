import parse from 'csv-parse';
import stringify from 'csv-stringify';
import { promisify } from 'util';

export type ParsePromise = (input: Buffer | string, options?: parse.Options) => Promise<any>;
export type StringifyPromise = (input: any, options?: stringify.Options) => Promise<string>;

export const parseAsync: ParsePromise = promisify<Buffer | string, parse.Options | undefined, any>(parse);
export const stringifyAsync: StringifyPromise = promisify<any, stringify.Options | undefined, string>(stringify as any);

export function fillArrayObjects(inArray: object[]): object[] {
  const outArray: object[] = [...inArray];
  const keys: { [key: string]: boolean } = {};
  outArray.forEach((item: object) => {
    const entries: [string, any][] = Object.entries(item);
    entries.forEach((entry: [string, any]) => {
      keys[entry[0]] = true;
    });
  });
  outArray.forEach((item: object, index: number) => {
    item = { ...item };
    outArray[index] = item;
    Object.keys(keys).forEach((key: string) => {
      item[key as keyof typeof item] = item[key as keyof typeof item];
    });
  });
  return outArray;
}
