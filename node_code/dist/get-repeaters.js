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
//   await writeToJsonAndCsv(`data/repeaters/results/${subPlace}`, result);
// }
//
// export default (async (): Promise<void> => {
//   const countyFileData: Buffer = await readFileAsync('data/Colorado_County_Seats.csv');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXQtcmVwZWF0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxREFBcUQ7QUFDckQsMEVBQTBFO0FBQzFFLHFEQUFxRDtBQUNyRCxvREFBb0Q7QUFDcEQsMkRBQTJEO0FBQzNELDZEQUE2RDtBQUM3RCw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLEVBQUU7QUFDRixtRUFBbUU7QUFDbkUsRUFBRTtBQUNGLGlGQUFpRjtBQUNqRiwrQ0FBK0M7QUFDL0MsRUFBRTtBQUNGLDJEQUEyRDtBQUMzRCxFQUFFO0FBQ0YsNERBQTREO0FBQzVELEVBQUU7QUFDRiw2RkFBNkY7QUFDN0YsNENBQTRDO0FBQzVDLHdGQUF3RjtBQUN4RixzQ0FBc0M7QUFDdEMsNkRBQTZEO0FBQzdELDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsVUFBVTtBQUNWLGtEQUFrRDtBQUNsRCxvQ0FBb0M7QUFDcEMsVUFBVTtBQUNWLFVBQVU7QUFDVixRQUFRO0FBQ1IsRUFBRTtBQUNGLDRDQUE0QztBQUM1Qyx3RkFBd0Y7QUFDeEYsc0NBQXNDO0FBQ3RDLDZEQUE2RDtBQUM3RCxtRkFBbUY7QUFDbkYsd0JBQXdCO0FBQ3hCLDRCQUE0QjtBQUM1QixVQUFVO0FBQ1YsVUFBVTtBQUNWLFFBQVE7QUFDUixFQUFFO0FBQ0Ysd0RBQXdEO0FBQ3hELDJEQUEyRDtBQUMzRCwyREFBMkQ7QUFDM0QsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRCx5RUFBeUU7QUFDekUseUVBQXlFO0FBQ3pFLDREQUE0RDtBQUM1RCw0REFBNEQ7QUFDNUQscURBQXFEO0FBQ3JELFFBQVE7QUFDUixpRkFBaUY7QUFDakYsMkRBQTJEO0FBQzNELDZDQUE2QztBQUM3QyxFQUFFO0FBQ0Ysb0RBQW9EO0FBQ3BELEVBQUU7QUFDRix5REFBeUQ7QUFDekQsK0VBQStFO0FBQy9FLEVBQUU7QUFDRiwyREFBMkQ7QUFDM0QsRUFBRTtBQUNGLDJFQUEyRTtBQUMzRSxJQUFJO0FBQ0osRUFBRTtBQUNGLCtDQUErQztBQUMvQywwRkFBMEY7QUFDMUYsMkZBQTJGO0FBQzNGLDRGQUE0RjtBQUM1Riw0QkFBNEI7QUFDNUIsdURBQXVEO0FBQ3ZELGtCQUFrQjtBQUNsQiwrQkFBK0I7QUFDL0IsUUFBUTtBQUNSLE1BQU07QUFDTixRQUFRO0FBQ1IsRUFBRTtBQUNGLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IHBhcnNlQXN5bmMgfSBmcm9tICdAaGVscGVycy9jc3YtaGVscGVycyc7XHJcbi8vIGltcG9ydCB7IHJlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XHJcbi8vIGltcG9ydCB7IG51bWJlclRvU3RyaW5nIH0gZnJvbSAnQGhlbHBlcnMvaGVscGVycyc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZUxvZyB9IGZyb20gJ0BoZWxwZXJzL2xvZy1oZWxwZXJzJztcclxuLy8gaW1wb3J0IHsgSUNvdW50eVNlYXQgfSBmcm9tICdAaW50ZXJmYWNlcy9pLWNvdW50eS1zZWF0JztcclxuLy8gaW1wb3J0IHsgSVJlcGVhdGVyUmF3IH0gZnJvbSAnQGludGVyZmFjZXMvaS1yZXBlYXRlci1yYXcnO1xyXG4vLyBpbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG4vLyBpbXBvcnQgU2NyYXBlciBmcm9tICcuL21vZHVsZXMvc2NyYXBlcic7XHJcbi8vXHJcbi8vIGNvbnN0IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQgPSBjcmVhdGVMb2coJ0dldCBSZXBlYXRlcnMnKTtcclxuLy9cclxuLy8gYXN5bmMgZnVuY3Rpb24gc2F2ZShwbGFjZTogc3RyaW5nIHwgbnVtYmVyLCBkaXN0YW5jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XHJcbi8vICAgbG9nKGNoYWxrLmdyZWVuKCdTYXZlJyksIHBsYWNlLCBkaXN0YW5jZSk7XHJcbi8vXHJcbi8vICAgY29uc3Qgc2NyYXBlcjogU2NyYXBlciA9IG5ldyBTY3JhcGVyKHBsYWNlLCBkaXN0YW5jZSk7XHJcbi8vXHJcbi8vICAgY29uc3QgcmVzdWx0OiBJUmVwZWF0ZXJSYXdbXSA9IGF3YWl0IHNjcmFwZXIucHJvY2VzcygpO1xyXG4vL1xyXG4vLyAgIGNvbnN0IGNvbHVtbnM6IHsgW2tleSBpbiBrZXlvZiBJUmVwZWF0ZXJSYXddOiBBcnJheTxzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQ+IH0gPSB7fTtcclxuLy8gICByZXN1bHQuZm9yRWFjaCgocm93OiBJUmVwZWF0ZXJSYXcpID0+IHtcclxuLy8gICAgIE9iamVjdC5lbnRyaWVzKHJvdykuZm9yRWFjaCgoZW50cnk6IFtzdHJpbmcsIChzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQpXSkgPT4ge1xyXG4vLyAgICAgICBjb25zdCBrZXk6IHN0cmluZyA9IGVudHJ5WzBdO1xyXG4vLyAgICAgICBjb25zdCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkID0gZW50cnlbMV07XHJcbi8vICAgICAgIGlmICghY29sdW1uc1trZXldKSB7XHJcbi8vICAgICAgICAgY29sdW1uc1trZXldID0gW107XHJcbi8vICAgICAgIH1cclxuLy8gICAgICAgaWYgKGNvbHVtbnNba2V5XS5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcclxuLy8gICAgICAgICBjb2x1bW5zW2tleV0ucHVzaCh2YWx1ZSk7XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0pO1xyXG4vLyAgIH0pO1xyXG4vL1xyXG4vLyAgIHJlc3VsdC5mb3JFYWNoKChyb3c6IElSZXBlYXRlclJhdykgPT4ge1xyXG4vLyAgICAgT2JqZWN0LmVudHJpZXMocm93KS5mb3JFYWNoKChlbnRyeTogW3N0cmluZywgKHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCldKSA9PiB7XHJcbi8vICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gZW50cnlbMF07XHJcbi8vICAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgPSBlbnRyeVsxXTtcclxuLy8gICAgICAgaWYgKGNvbHVtbnNba2V5XS5sZW5ndGggPT09IDEgJiYgY29sdW1uc1trZXldWzBdID09PSAnJyAmJiB2YWx1ZSA9PT0gJycpIHtcclxuLy8gICAgICAgICAvLyBAdHMtaWdub3JlXHJcbi8vICAgICAgICAgcm93W2tleV0gPSAneWVzJztcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSk7XHJcbi8vICAgfSk7XHJcbi8vXHJcbi8vICAgcmVzdWx0LnNvcnQoKGE6IElSZXBlYXRlclJhdywgYjogSVJlcGVhdGVyUmF3KSA9PiB7XHJcbi8vICAgICBjb25zdCBhTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGEuTWkgfHwgMCwgNCwgNSk7XHJcbi8vICAgICBjb25zdCBiTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGIuTWkgfHwgMCwgNCwgNSk7XHJcbi8vICAgICBjb25zdCBhTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYS5DYWxsO1xyXG4vLyAgICAgY29uc3QgYk5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGIuQ2FsbDtcclxuLy8gICAgIGNvbnN0IGFGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGEuRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xyXG4vLyAgICAgY29uc3QgYkZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYi5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XHJcbi8vICAgICBjb25zdCBhU3RyOiBzdHJpbmcgPSBgJHthTWl9ICR7YU5hbWV9ICR7YUZyZXF1ZW5jeX1gO1xyXG4vLyAgICAgY29uc3QgYlN0cjogc3RyaW5nID0gYCR7Yk1pfSAke2JOYW1lfSAke2JGcmVxdWVuY3l9YDtcclxuLy8gICAgIHJldHVybiBhU3RyID4gYlN0ciA/IDEgOiBhU3RyIDwgYlN0ciA/IC0xIDogMDtcclxuLy8gICB9KTtcclxuLy8gICAvLyByZXN1bHQuc29ydCgoYSwgYikgPT4geyhhLkNhbGwgPiBiLkNhbGwgPyAxIDogYS5DYWxsIDwgYi5DYWxsID8gLTEgOiAwKSk7XHJcbi8vICAgLy8gcmVzdWx0LnNvcnQoKGEsIGIpID0+IChhLkZyZXF1ZW5jeSAtIGIuRnJlcXVlbmN5KSk7XHJcbi8vICAgLy8gcmVzdWx0LnNvcnQoKGEsIGIpID0+IChhLk1pIC0gYi5NaSkpO1xyXG4vL1xyXG4vLyAgIC8vIGNvbnNvbGUubG9nKHBsYWNlLCBkaXN0YW5jZSwgcmVzdWx0Lmxlbmd0aCk7XHJcbi8vXHJcbi8vICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gcGxhY2UudG9TdHJpbmcoKS5zcGxpdChgLGApO1xyXG4vLyAgIGNvbnN0IHN1YlBsYWNlOiBzdHJpbmcgPSBgJHsocGFydHNbMV0gfHwgJy4nKS50cmltKCl9LyR7cGFydHNbMF0udHJpbSgpfWA7XHJcbi8vXHJcbi8vICAgbG9nKGNoYWxrLnllbGxvdygnUmVzdWx0cycpLCByZXN1bHQubGVuZ3RoLCBzdWJQbGFjZSk7XHJcbi8vXHJcbi8vICAgYXdhaXQgd3JpdGVUb0pzb25BbmRDc3YoYGRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvJHtzdWJQbGFjZX1gLCByZXN1bHQpO1xyXG4vLyB9XHJcbi8vXHJcbi8vIGV4cG9ydCBkZWZhdWx0IChhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbi8vICAgY29uc3QgY291bnR5RmlsZURhdGE6IEJ1ZmZlciA9IGF3YWl0IHJlYWRGaWxlQXN5bmMoJ2RhdGEvQ29sb3JhZG9fQ291bnR5X1NlYXRzLmNzdicpO1xyXG4vLyAgIGNvbnN0IGNvdW50eURhdGE6IElDb3VudHlTZWF0W10gPSBhd2FpdCBwYXJzZUFzeW5jKGNvdW50eUZpbGVEYXRhLCB7IGNvbHVtbnM6IHRydWUgfSk7XHJcbi8vICAgY29uc3QgY2l0aWVzOiBzdHJpbmdbXSA9IGNvdW50eURhdGEubWFwKChjOiBJQ291bnR5U2VhdCkgPT4gYCR7Y1snQ291bnR5IFNlYXQnXX0sIENPYCk7XHJcbi8vICAgd2hpbGUgKGNpdGllcy5sZW5ndGgpIHtcclxuLy8gICAgIGNvbnN0IG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGNpdGllcy5zaGlmdCgpO1xyXG4vLyAgICAgaWYgKG5hbWUpIHtcclxuLy8gICAgICAgYXdhaXQgc2F2ZShuYW1lLCAyMDApO1xyXG4vLyAgICAgfVxyXG4vLyAgIH1cclxuLy8gfSkoKTtcclxuLy9cclxuLy8gLy8gZXhwb3J0IGRlZmF1bHQgc3RhcnQoKTtcclxuIl19