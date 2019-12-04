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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlcGVhdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2dldC1yZXBlYXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFEQUFxRDtBQUNyRCwwRUFBMEU7QUFDMUUscURBQXFEO0FBQ3JELG9EQUFvRDtBQUNwRCwyREFBMkQ7QUFDM0QsNkRBQTZEO0FBQzdELDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsRUFBRTtBQUNGLG1FQUFtRTtBQUNuRSxFQUFFO0FBQ0YsaUZBQWlGO0FBQ2pGLCtDQUErQztBQUMvQyxFQUFFO0FBQ0YsMkRBQTJEO0FBQzNELEVBQUU7QUFDRiw0REFBNEQ7QUFDNUQsRUFBRTtBQUNGLDZGQUE2RjtBQUM3Riw0Q0FBNEM7QUFDNUMsd0ZBQXdGO0FBQ3hGLHNDQUFzQztBQUN0Qyw2REFBNkQ7QUFDN0QsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3QixVQUFVO0FBQ1Ysa0RBQWtEO0FBQ2xELG9DQUFvQztBQUNwQyxVQUFVO0FBQ1YsVUFBVTtBQUNWLFFBQVE7QUFDUixFQUFFO0FBQ0YsNENBQTRDO0FBQzVDLHdGQUF3RjtBQUN4RixzQ0FBc0M7QUFDdEMsNkRBQTZEO0FBQzdELG1GQUFtRjtBQUNuRix3QkFBd0I7QUFDeEIsNEJBQTRCO0FBQzVCLFVBQVU7QUFDVixVQUFVO0FBQ1YsUUFBUTtBQUNSLEVBQUU7QUFDRix3REFBd0Q7QUFDeEQsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRCxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELHlFQUF5RTtBQUN6RSx5RUFBeUU7QUFDekUsNERBQTREO0FBQzVELDREQUE0RDtBQUM1RCxxREFBcUQ7QUFDckQsUUFBUTtBQUNSLGlGQUFpRjtBQUNqRiwyREFBMkQ7QUFDM0QsNkNBQTZDO0FBQzdDLEVBQUU7QUFDRixvREFBb0Q7QUFDcEQsRUFBRTtBQUNGLHlEQUF5RDtBQUN6RCwrRUFBK0U7QUFDL0UsRUFBRTtBQUNGLDJEQUEyRDtBQUMzRCxFQUFFO0FBQ0YsMkVBQTJFO0FBQzNFLElBQUk7QUFDSixFQUFFO0FBQ0YsK0NBQStDO0FBQy9DLDBGQUEwRjtBQUMxRiwyRkFBMkY7QUFDM0YsNEZBQTRGO0FBQzVGLDRCQUE0QjtBQUM1Qix1REFBdUQ7QUFDdkQsa0JBQWtCO0FBQ2xCLCtCQUErQjtBQUMvQixRQUFRO0FBQ1IsTUFBTTtBQUNOLFFBQVE7QUFDUixFQUFFO0FBQ0YsNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgcGFyc2VBc3luYyB9IGZyb20gJ0BoZWxwZXJzL2Nzdi1oZWxwZXJzJztcclxuLy8gaW1wb3J0IHsgcmVhZEZpbGVBc3luYywgd3JpdGVUb0pzb25BbmRDc3YgfSBmcm9tICdAaGVscGVycy9mcy1oZWxwZXJzJztcclxuLy8gaW1wb3J0IHsgbnVtYmVyVG9TdHJpbmcgfSBmcm9tICdAaGVscGVycy9oZWxwZXJzJztcclxuLy8gaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xyXG4vLyBpbXBvcnQgeyBJQ291bnR5U2VhdCB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktY291bnR5LXNlYXQnO1xyXG4vLyBpbXBvcnQgeyBJUmVwZWF0ZXJSYXcgfSBmcm9tICdAaW50ZXJmYWNlcy9pLXJlcGVhdGVyLXJhdyc7XHJcbi8vIGltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XHJcbi8vIGltcG9ydCBTY3JhcGVyIGZyb20gJy4vbW9kdWxlcy9zY3JhcGVyJztcclxuLy9cclxuLy8gY29uc3QgbG9nOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCA9IGNyZWF0ZUxvZygnR2V0IFJlcGVhdGVycycpO1xyXG4vL1xyXG4vLyBhc3luYyBmdW5jdGlvbiBzYXZlKHBsYWNlOiBzdHJpbmcgfCBudW1iZXIsIGRpc3RhbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuLy8gICBsb2coY2hhbGsuZ3JlZW4oJ1NhdmUnKSwgcGxhY2UsIGRpc3RhbmNlKTtcclxuLy9cclxuLy8gICBjb25zdCBzY3JhcGVyOiBTY3JhcGVyID0gbmV3IFNjcmFwZXIocGxhY2UsIGRpc3RhbmNlKTtcclxuLy9cclxuLy8gICBjb25zdCByZXN1bHQ6IElSZXBlYXRlclJhd1tdID0gYXdhaXQgc2NyYXBlci5wcm9jZXNzKCk7XHJcbi8vXHJcbi8vICAgY29uc3QgY29sdW1uczogeyBba2V5IGluIGtleW9mIElSZXBlYXRlclJhd106IEFycmF5PHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZD4gfSA9IHt9O1xyXG4vLyAgIHJlc3VsdC5mb3JFYWNoKChyb3c6IElSZXBlYXRlclJhdykgPT4ge1xyXG4vLyAgICAgT2JqZWN0LmVudHJpZXMocm93KS5mb3JFYWNoKChlbnRyeTogW3N0cmluZywgKHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCldKSA9PiB7XHJcbi8vICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gZW50cnlbMF07XHJcbi8vICAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgPSBlbnRyeVsxXTtcclxuLy8gICAgICAgaWYgKCFjb2x1bW5zW2tleV0pIHtcclxuLy8gICAgICAgICBjb2x1bW5zW2tleV0gPSBbXTtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgICBpZiAoY29sdW1uc1trZXldLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xyXG4vLyAgICAgICAgIGNvbHVtbnNba2V5XS5wdXNoKHZhbHVlKTtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSk7XHJcbi8vICAgfSk7XHJcbi8vXHJcbi8vICAgcmVzdWx0LmZvckVhY2goKHJvdzogSVJlcGVhdGVyUmF3KSA9PiB7XHJcbi8vICAgICBPYmplY3QuZW50cmllcyhyb3cpLmZvckVhY2goKGVudHJ5OiBbc3RyaW5nLCAoc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkKV0pID0+IHtcclxuLy8gICAgICAgY29uc3Qga2V5OiBzdHJpbmcgPSBlbnRyeVswXTtcclxuLy8gICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCA9IGVudHJ5WzFdO1xyXG4vLyAgICAgICBpZiAoY29sdW1uc1trZXldLmxlbmd0aCA9PT0gMSAmJiBjb2x1bW5zW2tleV1bMF0gPT09ICcnICYmIHZhbHVlID09PSAnJykge1xyXG4vLyAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuLy8gICAgICAgICByb3dba2V5XSA9ICd5ZXMnO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICB9KTtcclxuLy8gICB9KTtcclxuLy9cclxuLy8gICByZXN1bHQuc29ydCgoYTogSVJlcGVhdGVyUmF3LCBiOiBJUmVwZWF0ZXJSYXcpID0+IHtcclxuLy8gICAgIGNvbnN0IGFNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5NaSB8fCAwLCA0LCA1KTtcclxuLy8gICAgIGNvbnN0IGJNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYi5NaSB8fCAwLCA0LCA1KTtcclxuLy8gICAgIGNvbnN0IGFOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBhLkNhbGw7XHJcbi8vICAgICBjb25zdCBiTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYi5DYWxsO1xyXG4vLyAgICAgY29uc3QgYUZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XHJcbi8vICAgICBjb25zdCBiRnJlcXVlbmN5OiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhiLkZyZXF1ZW5jeSB8fCAwLCA0LCA1KTtcclxuLy8gICAgIGNvbnN0IGFTdHI6IHN0cmluZyA9IGAke2FNaX0gJHthTmFtZX0gJHthRnJlcXVlbmN5fWA7XHJcbi8vICAgICBjb25zdCBiU3RyOiBzdHJpbmcgPSBgJHtiTWl9ICR7Yk5hbWV9ICR7YkZyZXF1ZW5jeX1gO1xyXG4vLyAgICAgcmV0dXJuIGFTdHIgPiBiU3RyID8gMSA6IGFTdHIgPCBiU3RyID8gLTEgOiAwO1xyXG4vLyAgIH0pO1xyXG4vLyAgIC8vIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7KGEuQ2FsbCA+IGIuQ2FsbCA/IDEgOiBhLkNhbGwgPCBiLkNhbGwgPyAtMSA6IDApKTtcclxuLy8gICAvLyByZXN1bHQuc29ydCgoYSwgYikgPT4gKGEuRnJlcXVlbmN5IC0gYi5GcmVxdWVuY3kpKTtcclxuLy8gICAvLyByZXN1bHQuc29ydCgoYSwgYikgPT4gKGEuTWkgLSBiLk1pKSk7XHJcbi8vXHJcbi8vICAgLy8gY29uc29sZS5sb2cocGxhY2UsIGRpc3RhbmNlLCByZXN1bHQubGVuZ3RoKTtcclxuLy9cclxuLy8gICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBwbGFjZS50b1N0cmluZygpLnNwbGl0KGAsYCk7XHJcbi8vICAgY29uc3Qgc3ViUGxhY2U6IHN0cmluZyA9IGAkeyhwYXJ0c1sxXSB8fCAnLicpLnRyaW0oKX0vJHtwYXJ0c1swXS50cmltKCl9YDtcclxuLy9cclxuLy8gICBsb2coY2hhbGsueWVsbG93KCdSZXN1bHRzJyksIHJlc3VsdC5sZW5ndGgsIHN1YlBsYWNlKTtcclxuLy9cclxuLy8gICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdihgZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy8ke3N1YlBsYWNlfWAsIHJlc3VsdCk7XHJcbi8vIH1cclxuLy9cclxuLy8gZXhwb3J0IGRlZmF1bHQgKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuLy8gICBjb25zdCBjb3VudHlGaWxlRGF0YTogQnVmZmVyID0gYXdhaXQgcmVhZEZpbGVBc3luYygnZGF0YS9Db2xvcmFkb19Db3VudHlfU2VhdHMuY3N2Jyk7XHJcbi8vICAgY29uc3QgY291bnR5RGF0YTogSUNvdW50eVNlYXRbXSA9IGF3YWl0IHBhcnNlQXN5bmMoY291bnR5RmlsZURhdGEsIHsgY29sdW1uczogdHJ1ZSB9KTtcclxuLy8gICBjb25zdCBjaXRpZXM6IHN0cmluZ1tdID0gY291bnR5RGF0YS5tYXAoKGM6IElDb3VudHlTZWF0KSA9PiBgJHtjWydDb3VudHkgU2VhdCddfSwgQ09gKTtcclxuLy8gICB3aGlsZSAoY2l0aWVzLmxlbmd0aCkge1xyXG4vLyAgICAgY29uc3QgbmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gY2l0aWVzLnNoaWZ0KCk7XHJcbi8vICAgICBpZiAobmFtZSkge1xyXG4vLyAgICAgICBhd2FpdCBzYXZlKG5hbWUsIDIwMCk7XHJcbi8vICAgICB9XHJcbi8vICAgfVxyXG4vLyB9KSgpO1xyXG4vL1xyXG4vLyAvLyBleHBvcnQgZGVmYXVsdCBzdGFydCgpO1xyXG4iXX0=