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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2dldC1yZXBlYXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFEQUFxRDtBQUNyRCwwRUFBMEU7QUFDMUUscURBQXFEO0FBQ3JELG9EQUFvRDtBQUNwRCwyREFBMkQ7QUFDM0QsNkRBQTZEO0FBQzdELDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsRUFBRTtBQUNGLG1FQUFtRTtBQUNuRSxFQUFFO0FBQ0YsaUZBQWlGO0FBQ2pGLCtDQUErQztBQUMvQyxFQUFFO0FBQ0YsMkRBQTJEO0FBQzNELEVBQUU7QUFDRiw0REFBNEQ7QUFDNUQsRUFBRTtBQUNGLDZGQUE2RjtBQUM3Riw0Q0FBNEM7QUFDNUMsd0ZBQXdGO0FBQ3hGLHNDQUFzQztBQUN0Qyw2REFBNkQ7QUFDN0QsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3QixVQUFVO0FBQ1Ysa0RBQWtEO0FBQ2xELG9DQUFvQztBQUNwQyxVQUFVO0FBQ1YsVUFBVTtBQUNWLFFBQVE7QUFDUixFQUFFO0FBQ0YsNENBQTRDO0FBQzVDLHdGQUF3RjtBQUN4RixzQ0FBc0M7QUFDdEMsNkRBQTZEO0FBQzdELG1GQUFtRjtBQUNuRix3QkFBd0I7QUFDeEIsNEJBQTRCO0FBQzVCLFVBQVU7QUFDVixVQUFVO0FBQ1YsUUFBUTtBQUNSLEVBQUU7QUFDRix3REFBd0Q7QUFDeEQsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRCxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELHlFQUF5RTtBQUN6RSx5RUFBeUU7QUFDekUsNERBQTREO0FBQzVELDREQUE0RDtBQUM1RCxxREFBcUQ7QUFDckQsUUFBUTtBQUNSLGlGQUFpRjtBQUNqRiwyREFBMkQ7QUFDM0QsNkNBQTZDO0FBQzdDLEVBQUU7QUFDRixvREFBb0Q7QUFDcEQsRUFBRTtBQUNGLHlEQUF5RDtBQUN6RCwrRUFBK0U7QUFDL0UsRUFBRTtBQUNGLDJEQUEyRDtBQUMzRCxFQUFFO0FBQ0YsMkVBQTJFO0FBQzNFLElBQUk7QUFDSixFQUFFO0FBQ0YsK0NBQStDO0FBQy9DLDBGQUEwRjtBQUMxRiwyRkFBMkY7QUFDM0YsNEZBQTRGO0FBQzVGLDRCQUE0QjtBQUM1Qix1REFBdUQ7QUFDdkQsa0JBQWtCO0FBQ2xCLCtCQUErQjtBQUMvQixRQUFRO0FBQ1IsTUFBTTtBQUNOLFFBQVE7QUFDUixFQUFFO0FBQ0YsNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgcGFyc2VBc3luYyB9IGZyb20gJ0BoZWxwZXJzL2Nzdi1oZWxwZXJzJztcbi8vIGltcG9ydCB7IHJlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XG4vLyBpbXBvcnQgeyBudW1iZXJUb1N0cmluZyB9IGZyb20gJ0BoZWxwZXJzL2hlbHBlcnMnO1xuLy8gaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xuLy8gaW1wb3J0IHsgSUNvdW50eVNlYXQgfSBmcm9tICdAaW50ZXJmYWNlcy9pLWNvdW50eS1zZWF0Jztcbi8vIGltcG9ydCB7IElSZXBlYXRlclJhdyB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktcmVwZWF0ZXItcmF3Jztcbi8vIGltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG4vLyBpbXBvcnQgU2NyYXBlciBmcm9tICcuL21vZHVsZXMvc2NyYXBlcic7XG4vL1xuLy8gY29uc3QgbG9nOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCA9IGNyZWF0ZUxvZygnR2V0IFJlcGVhdGVycycpO1xuLy9cbi8vIGFzeW5jIGZ1bmN0aW9uIHNhdmUocGxhY2U6IHN0cmluZyB8IG51bWJlciwgZGlzdGFuY2U6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuLy8gICBsb2coY2hhbGsuZ3JlZW4oJ1NhdmUnKSwgcGxhY2UsIGRpc3RhbmNlKTtcbi8vXG4vLyAgIGNvbnN0IHNjcmFwZXI6IFNjcmFwZXIgPSBuZXcgU2NyYXBlcihwbGFjZSwgZGlzdGFuY2UpO1xuLy9cbi8vICAgY29uc3QgcmVzdWx0OiBJUmVwZWF0ZXJSYXdbXSA9IGF3YWl0IHNjcmFwZXIucHJvY2VzcygpO1xuLy9cbi8vICAgY29uc3QgY29sdW1uczogeyBba2V5IGluIGtleW9mIElSZXBlYXRlclJhd106IEFycmF5PHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZD4gfSA9IHt9O1xuLy8gICByZXN1bHQuZm9yRWFjaCgocm93OiBJUmVwZWF0ZXJSYXcpID0+IHtcbi8vICAgICBPYmplY3QuZW50cmllcyhyb3cpLmZvckVhY2goKGVudHJ5OiBbc3RyaW5nLCAoc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkKV0pID0+IHtcbi8vICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gZW50cnlbMF07XG4vLyAgICAgICBjb25zdCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkID0gZW50cnlbMV07XG4vLyAgICAgICBpZiAoIWNvbHVtbnNba2V5XSkge1xuLy8gICAgICAgICBjb2x1bW5zW2tleV0gPSBbXTtcbi8vICAgICAgIH1cbi8vICAgICAgIGlmIChjb2x1bW5zW2tleV0uaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4vLyAgICAgICAgIGNvbHVtbnNba2V5XS5wdXNoKHZhbHVlKTtcbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfSk7XG4vL1xuLy8gICByZXN1bHQuZm9yRWFjaCgocm93OiBJUmVwZWF0ZXJSYXcpID0+IHtcbi8vICAgICBPYmplY3QuZW50cmllcyhyb3cpLmZvckVhY2goKGVudHJ5OiBbc3RyaW5nLCAoc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkKV0pID0+IHtcbi8vICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gZW50cnlbMF07XG4vLyAgICAgICBjb25zdCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkID0gZW50cnlbMV07XG4vLyAgICAgICBpZiAoY29sdW1uc1trZXldLmxlbmd0aCA9PT0gMSAmJiBjb2x1bW5zW2tleV1bMF0gPT09ICcnICYmIHZhbHVlID09PSAnJykge1xuLy8gICAgICAgICAvLyBAdHMtaWdub3JlXG4vLyAgICAgICAgIHJvd1trZXldID0gJ3llcyc7XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH0pO1xuLy9cbi8vICAgcmVzdWx0LnNvcnQoKGE6IElSZXBlYXRlclJhdywgYjogSVJlcGVhdGVyUmF3KSA9PiB7XG4vLyAgICAgY29uc3QgYU1pOiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhhLk1pIHx8IDAsIDQsIDUpO1xuLy8gICAgIGNvbnN0IGJNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYi5NaSB8fCAwLCA0LCA1KTtcbi8vICAgICBjb25zdCBhTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYS5DYWxsO1xuLy8gICAgIGNvbnN0IGJOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBiLkNhbGw7XG4vLyAgICAgY29uc3QgYUZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XG4vLyAgICAgY29uc3QgYkZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYi5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XG4vLyAgICAgY29uc3QgYVN0cjogc3RyaW5nID0gYCR7YU1pfSAke2FOYW1lfSAke2FGcmVxdWVuY3l9YDtcbi8vICAgICBjb25zdCBiU3RyOiBzdHJpbmcgPSBgJHtiTWl9ICR7Yk5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xuLy8gICAgIHJldHVybiBhU3RyID4gYlN0ciA/IDEgOiBhU3RyIDwgYlN0ciA/IC0xIDogMDtcbi8vICAgfSk7XG4vLyAgIC8vIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7KGEuQ2FsbCA+IGIuQ2FsbCA/IDEgOiBhLkNhbGwgPCBiLkNhbGwgPyAtMSA6IDApKTtcbi8vICAgLy8gcmVzdWx0LnNvcnQoKGEsIGIpID0+IChhLkZyZXF1ZW5jeSAtIGIuRnJlcXVlbmN5KSk7XG4vLyAgIC8vIHJlc3VsdC5zb3J0KChhLCBiKSA9PiAoYS5NaSAtIGIuTWkpKTtcbi8vXG4vLyAgIC8vIGNvbnNvbGUubG9nKHBsYWNlLCBkaXN0YW5jZSwgcmVzdWx0Lmxlbmd0aCk7XG4vL1xuLy8gICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBwbGFjZS50b1N0cmluZygpLnNwbGl0KGAsYCk7XG4vLyAgIGNvbnN0IHN1YlBsYWNlOiBzdHJpbmcgPSBgJHsocGFydHNbMV0gfHwgJy4nKS50cmltKCl9LyR7cGFydHNbMF0udHJpbSgpfWA7XG4vL1xuLy8gICBsb2coY2hhbGsueWVsbG93KCdSZXN1bHRzJyksIHJlc3VsdC5sZW5ndGgsIHN1YlBsYWNlKTtcbi8vXG4vLyAgIGF3YWl0IHdyaXRlVG9Kc29uQW5kQ3N2KGBkYXRhL3JlcGVhdGVycy9yZXN1bHRzLyR7c3ViUGxhY2V9YCwgcmVzdWx0KTtcbi8vIH1cbi8vXG4vLyBleHBvcnQgZGVmYXVsdCAoYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuLy8gICBjb25zdCBjb3VudHlGaWxlRGF0YTogQnVmZmVyID0gYXdhaXQgcmVhZEZpbGVBc3luYygnZGF0YS9Db2xvcmFkb19Db3VudHlfU2VhdHMuY3N2Jyk7XG4vLyAgIGNvbnN0IGNvdW50eURhdGE6IElDb3VudHlTZWF0W10gPSBhd2FpdCBwYXJzZUFzeW5jKGNvdW50eUZpbGVEYXRhLCB7IGNvbHVtbnM6IHRydWUgfSk7XG4vLyAgIGNvbnN0IGNpdGllczogc3RyaW5nW10gPSBjb3VudHlEYXRhLm1hcCgoYzogSUNvdW50eVNlYXQpID0+IGAke2NbJ0NvdW50eSBTZWF0J119LCBDT2ApO1xuLy8gICB3aGlsZSAoY2l0aWVzLmxlbmd0aCkge1xuLy8gICAgIGNvbnN0IG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGNpdGllcy5zaGlmdCgpO1xuLy8gICAgIGlmIChuYW1lKSB7XG4vLyAgICAgICBhd2FpdCBzYXZlKG5hbWUsIDIwMCk7XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9KSgpO1xuLy9cbi8vIC8vIGV4cG9ydCBkZWZhdWx0IHN0YXJ0KCk7XG4iXX0=