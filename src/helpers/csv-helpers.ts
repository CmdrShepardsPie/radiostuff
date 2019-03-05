import * as _csv from "csv/lib/es5";
import * as promisify from "util.promisify";

export const parseAsync = promisify(_csv.parse);
export const stringifyAsync = promisify(_csv.stringify);

export function fillArrayObjects(inArray: object[]) {
  const outArray = [...inArray];
  const keys: {[index: string]: boolean} = {};
  outArray.forEach((item) => {
    const entries = Object.entries(item);
    entries.forEach((entry) => {
      keys[entry[0]] = true;
    });
  });
  outArray.forEach((item, index) => {
    item = {...item};
    outArray[index] = item;
    Object.keys(keys).forEach((key) => {
      // @ts-ignore
      item[key] = item[key];
    });
  });
  return outArray;
}
