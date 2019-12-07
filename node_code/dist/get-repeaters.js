"use strict";
// import { parseAsync } from '@helpers/csv-helpers';
// import { readFileAsync, writeToJsonAndCsv } from '@helpers/fs-helpers';
// import { numberToString } from '@helpers/helpers';
// import { createLog } from '@helpers/log-helpers';
// import { ICountySeat } from '@interfaces/i-county-seat';
// import { IRepeaterRaw } from '@interfaces/i-repeater-raw';
// import chalk from 'chalk';
// import Scraper from './modules/scraper';
//
// const log: (...msg: any[]) => void = createLog('Get Repeaters');
//
// async function save(place: string | number, distance: number): Promise<void> {
//   log(chalk.green('Save'), place, distance);
//
//   const scraper: Scraper = new Scraper(place, distance);
//
//   const result: IRepeaterRaw[] = await scraper.process();
//
//   const columns: { [key in keyof IRepeaterRaw]: Array<string | number | undefined> } = {};
//   result.forEach((row: IRepeaterRaw) => {
//     Object.entries(row).forEach((entry: [string, (string | number | undefined)]) => {
//       const key: string = entry[0];
//       const value: string | number | undefined = entry[1];
//       if (!columns[key]) {
//         columns[key] = [];
//       }
//       if (columns[key].indexOf(value) === -1) {
//         columns[key].push(value);
//       }
//     });
//   });
//
//   result.forEach((row: IRepeaterRaw) => {
//     Object.entries(row).forEach((entry: [string, (string | number | undefined)]) => {
//       const key: string = entry[0];
//       const value: string | number | undefined = entry[1];
//       if (columns[key].length === 1 && columns[key][0] === '' && value === '') {
//         // @ts-ignore
//         row[key] = 'yes';
//       }
//     });
//   });
//
//   result.sort((a: IRepeaterRaw, b: IRepeaterRaw) => {
//     const aMi: string = numberToString(a.Mi || 0, 4, 5);
//     const bMi: string = numberToString(b.Mi || 0, 4, 5);
//     const aName: string | undefined = a.Call;
//     const bName: string | undefined = b.Call;
//     const aFrequency: string = numberToString(a.Frequency || 0, 4, 5);
//     const bFrequency: string = numberToString(b.Frequency || 0, 4, 5);
//     const aStr: string = `${aMi} ${aName} ${aFrequency}`;
//     const bStr: string = `${bMi} ${bName} ${bFrequency}`;
//     return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
//   });
//   // result.sort((a, b) => {(a.Call > b.Call ? 1 : a.Call < b.Call ? -1 : 0));
//   // result.sort((a, b) => (a.Frequency - b.Frequency));
//   // result.sort((a, b) => (a.Mi - b.Mi));
//
//   // console.log(place, distance, result.length);
//
//   const parts: string[] = place.toString().split(`,`);
//   const subPlace: string = `${(parts[1] || '.').trim()}/${parts[0].trim()}`;
//
//   log(chalk.yellow('Results'), result.length, subPlace);
//
//   await writeToJsonAndCsv(`../data/repeaters/results/${subPlace}`, result);
// }
//
// export default (async (): Promise<void> => {
//   const countyFileData: Buffer = await readFileAsync('../data/Colorado_County_Seats.csv');
//   const countyData: ICountySeat[] = await parseAsync(countyFileData, { columns: true });
//   const cities: string[] = countyData.map((c: ICountySeat) => `${c['County Seat']}, CO`);
//   while (cities.length) {
//     const name: string | undefined = cities.shift();
//     if (name) {
//       await save(name, 200);
//     }
//   }
// })();
//
// // export default start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXQtcmVwZWF0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxREFBcUQ7QUFDckQsMEVBQTBFO0FBQzFFLHFEQUFxRDtBQUNyRCxvREFBb0Q7QUFDcEQsMkRBQTJEO0FBQzNELDZEQUE2RDtBQUM3RCw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLEVBQUU7QUFDRixtRUFBbUU7QUFDbkUsRUFBRTtBQUNGLGlGQUFpRjtBQUNqRiwrQ0FBK0M7QUFDL0MsRUFBRTtBQUNGLDJEQUEyRDtBQUMzRCxFQUFFO0FBQ0YsNERBQTREO0FBQzVELEVBQUU7QUFDRiw2RkFBNkY7QUFDN0YsNENBQTRDO0FBQzVDLHdGQUF3RjtBQUN4RixzQ0FBc0M7QUFDdEMsNkRBQTZEO0FBQzdELDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsVUFBVTtBQUNWLGtEQUFrRDtBQUNsRCxvQ0FBb0M7QUFDcEMsVUFBVTtBQUNWLFVBQVU7QUFDVixRQUFRO0FBQ1IsRUFBRTtBQUNGLDRDQUE0QztBQUM1Qyx3RkFBd0Y7QUFDeEYsc0NBQXNDO0FBQ3RDLDZEQUE2RDtBQUM3RCxtRkFBbUY7QUFDbkYsd0JBQXdCO0FBQ3hCLDRCQUE0QjtBQUM1QixVQUFVO0FBQ1YsVUFBVTtBQUNWLFFBQVE7QUFDUixFQUFFO0FBQ0Ysd0RBQXdEO0FBQ3hELDJEQUEyRDtBQUMzRCwyREFBMkQ7QUFDM0QsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRCx5RUFBeUU7QUFDekUseUVBQXlFO0FBQ3pFLDREQUE0RDtBQUM1RCw0REFBNEQ7QUFDNUQscURBQXFEO0FBQ3JELFFBQVE7QUFDUixpRkFBaUY7QUFDakYsMkRBQTJEO0FBQzNELDZDQUE2QztBQUM3QyxFQUFFO0FBQ0Ysb0RBQW9EO0FBQ3BELEVBQUU7QUFDRix5REFBeUQ7QUFDekQsK0VBQStFO0FBQy9FLEVBQUU7QUFDRiwyREFBMkQ7QUFDM0QsRUFBRTtBQUNGLDhFQUE4RTtBQUM5RSxJQUFJO0FBQ0osRUFBRTtBQUNGLCtDQUErQztBQUMvQyw2RkFBNkY7QUFDN0YsMkZBQTJGO0FBQzNGLDRGQUE0RjtBQUM1Riw0QkFBNEI7QUFDNUIsdURBQXVEO0FBQ3ZELGtCQUFrQjtBQUNsQiwrQkFBK0I7QUFDL0IsUUFBUTtBQUNSLE1BQU07QUFDTixRQUFRO0FBQ1IsRUFBRTtBQUNGLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IHBhcnNlQXN5bmMgfSBmcm9tICdAaGVscGVycy9jc3YtaGVscGVycyc7XG4vLyBpbXBvcnQgeyByZWFkRmlsZUFzeW5jLCB3cml0ZVRvSnNvbkFuZENzdiB9IGZyb20gJ0BoZWxwZXJzL2ZzLWhlbHBlcnMnO1xuLy8gaW1wb3J0IHsgbnVtYmVyVG9TdHJpbmcgfSBmcm9tICdAaGVscGVycy9oZWxwZXJzJztcbi8vIGltcG9ydCB7IGNyZWF0ZUxvZyB9IGZyb20gJ0BoZWxwZXJzL2xvZy1oZWxwZXJzJztcbi8vIGltcG9ydCB7IElDb3VudHlTZWF0IH0gZnJvbSAnQGludGVyZmFjZXMvaS1jb3VudHktc2VhdCc7XG4vLyBpbXBvcnQgeyBJUmVwZWF0ZXJSYXcgfSBmcm9tICdAaW50ZXJmYWNlcy9pLXJlcGVhdGVyLXJhdyc7XG4vLyBpbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuLy8gaW1wb3J0IFNjcmFwZXIgZnJvbSAnLi9tb2R1bGVzL3NjcmFwZXInO1xuLy9cbi8vIGNvbnN0IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQgPSBjcmVhdGVMb2coJ0dldCBSZXBlYXRlcnMnKTtcbi8vXG4vLyBhc3luYyBmdW5jdGlvbiBzYXZlKHBsYWNlOiBzdHJpbmcgfCBudW1iZXIsIGRpc3RhbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbi8vICAgbG9nKGNoYWxrLmdyZWVuKCdTYXZlJyksIHBsYWNlLCBkaXN0YW5jZSk7XG4vL1xuLy8gICBjb25zdCBzY3JhcGVyOiBTY3JhcGVyID0gbmV3IFNjcmFwZXIocGxhY2UsIGRpc3RhbmNlKTtcbi8vXG4vLyAgIGNvbnN0IHJlc3VsdDogSVJlcGVhdGVyUmF3W10gPSBhd2FpdCBzY3JhcGVyLnByb2Nlc3MoKTtcbi8vXG4vLyAgIGNvbnN0IGNvbHVtbnM6IHsgW2tleSBpbiBrZXlvZiBJUmVwZWF0ZXJSYXddOiBBcnJheTxzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQ+IH0gPSB7fTtcbi8vICAgcmVzdWx0LmZvckVhY2goKHJvdzogSVJlcGVhdGVyUmF3KSA9PiB7XG4vLyAgICAgT2JqZWN0LmVudHJpZXMocm93KS5mb3JFYWNoKChlbnRyeTogW3N0cmluZywgKHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCldKSA9PiB7XG4vLyAgICAgICBjb25zdCBrZXk6IHN0cmluZyA9IGVudHJ5WzBdO1xuLy8gICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCA9IGVudHJ5WzFdO1xuLy8gICAgICAgaWYgKCFjb2x1bW5zW2tleV0pIHtcbi8vICAgICAgICAgY29sdW1uc1trZXldID0gW107XG4vLyAgICAgICB9XG4vLyAgICAgICBpZiAoY29sdW1uc1trZXldLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuLy8gICAgICAgICBjb2x1bW5zW2tleV0ucHVzaCh2YWx1ZSk7XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH0pO1xuLy9cbi8vICAgcmVzdWx0LmZvckVhY2goKHJvdzogSVJlcGVhdGVyUmF3KSA9PiB7XG4vLyAgICAgT2JqZWN0LmVudHJpZXMocm93KS5mb3JFYWNoKChlbnRyeTogW3N0cmluZywgKHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCldKSA9PiB7XG4vLyAgICAgICBjb25zdCBrZXk6IHN0cmluZyA9IGVudHJ5WzBdO1xuLy8gICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCA9IGVudHJ5WzFdO1xuLy8gICAgICAgaWYgKGNvbHVtbnNba2V5XS5sZW5ndGggPT09IDEgJiYgY29sdW1uc1trZXldWzBdID09PSAnJyAmJiB2YWx1ZSA9PT0gJycpIHtcbi8vICAgICAgICAgLy8gQHRzLWlnbm9yZVxuLy8gICAgICAgICByb3dba2V5XSA9ICd5ZXMnO1xuLy8gICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICB9KTtcbi8vXG4vLyAgIHJlc3VsdC5zb3J0KChhOiBJUmVwZWF0ZXJSYXcsIGI6IElSZXBlYXRlclJhdykgPT4ge1xuLy8gICAgIGNvbnN0IGFNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5NaSB8fCAwLCA0LCA1KTtcbi8vICAgICBjb25zdCBiTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGIuTWkgfHwgMCwgNCwgNSk7XG4vLyAgICAgY29uc3QgYU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGEuQ2FsbDtcbi8vICAgICBjb25zdCBiTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYi5DYWxsO1xuLy8gICAgIGNvbnN0IGFGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGEuRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xuLy8gICAgIGNvbnN0IGJGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGIuRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xuLy8gICAgIGNvbnN0IGFTdHI6IHN0cmluZyA9IGAke2FNaX0gJHthTmFtZX0gJHthRnJlcXVlbmN5fWA7XG4vLyAgICAgY29uc3QgYlN0cjogc3RyaW5nID0gYCR7Yk1pfSAke2JOYW1lfSAke2JGcmVxdWVuY3l9YDtcbi8vICAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XG4vLyAgIH0pO1xuLy8gICAvLyByZXN1bHQuc29ydCgoYSwgYikgPT4geyhhLkNhbGwgPiBiLkNhbGwgPyAxIDogYS5DYWxsIDwgYi5DYWxsID8gLTEgOiAwKSk7XG4vLyAgIC8vIHJlc3VsdC5zb3J0KChhLCBiKSA9PiAoYS5GcmVxdWVuY3kgLSBiLkZyZXF1ZW5jeSkpO1xuLy8gICAvLyByZXN1bHQuc29ydCgoYSwgYikgPT4gKGEuTWkgLSBiLk1pKSk7XG4vL1xuLy8gICAvLyBjb25zb2xlLmxvZyhwbGFjZSwgZGlzdGFuY2UsIHJlc3VsdC5sZW5ndGgpO1xuLy9cbi8vICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gcGxhY2UudG9TdHJpbmcoKS5zcGxpdChgLGApO1xuLy8gICBjb25zdCBzdWJQbGFjZTogc3RyaW5nID0gYCR7KHBhcnRzWzFdIHx8ICcuJykudHJpbSgpfS8ke3BhcnRzWzBdLnRyaW0oKX1gO1xuLy9cbi8vICAgbG9nKGNoYWxrLnllbGxvdygnUmVzdWx0cycpLCByZXN1bHQubGVuZ3RoLCBzdWJQbGFjZSk7XG4vL1xuLy8gICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdihgLi4vZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy8ke3N1YlBsYWNlfWAsIHJlc3VsdCk7XG4vLyB9XG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbi8vICAgY29uc3QgY291bnR5RmlsZURhdGE6IEJ1ZmZlciA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoJy4uL2RhdGEvQ29sb3JhZG9fQ291bnR5X1NlYXRzLmNzdicpO1xuLy8gICBjb25zdCBjb3VudHlEYXRhOiBJQ291bnR5U2VhdFtdID0gYXdhaXQgcGFyc2VBc3luYyhjb3VudHlGaWxlRGF0YSwgeyBjb2x1bW5zOiB0cnVlIH0pO1xuLy8gICBjb25zdCBjaXRpZXM6IHN0cmluZ1tdID0gY291bnR5RGF0YS5tYXAoKGM6IElDb3VudHlTZWF0KSA9PiBgJHtjWydDb3VudHkgU2VhdCddfSwgQ09gKTtcbi8vICAgd2hpbGUgKGNpdGllcy5sZW5ndGgpIHtcbi8vICAgICBjb25zdCBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBjaXRpZXMuc2hpZnQoKTtcbi8vICAgICBpZiAobmFtZSkge1xuLy8gICAgICAgYXdhaXQgc2F2ZShuYW1lLCAyMDApO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfSkoKTtcbi8vXG4vLyAvLyBleHBvcnQgZGVmYXVsdCBzdGFydCgpO1xuIl19