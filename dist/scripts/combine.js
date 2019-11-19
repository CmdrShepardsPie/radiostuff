var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/fs-helpers", "@helpers/helpers", "@helpers/log-helpers", "gps-distance"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const helpers_1 = require("@helpers/helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const gps_distance_1 = __importDefault(require("gps-distance"));
    const log = log_helpers_1.createLog('Combine');
    exports.default = (async () => {
        const myPoint = [39.627071500, -104.893322500]; // 4982 S Ulster St
        const combined = [];
        const files = await fs_helpers_1.getAllFilesFromDirectory('data/repeaters/results/CO');
        log('Got', files.length, 'files');
        const found = {};
        files.forEach((file) => {
            log('Got', file.length, 'repeaters');
            file.forEach((item) => {
                if (!found[`${item.state_id}-${item.ID}`]) {
                    found[`${item.state_id}-${item.ID}`] = true;
                    combined.push(item);
                    const distance = gps_distance_1.default([myPoint, [item.Latitude, item.Longitude]]);
                    item.Mi = distance * 0.62137119;
                }
            });
        });
        log('Got', combined.length, 'unique repeaters');
        combined.sort((a, b) => {
            const aMi = helpers_1.numberToString(a.Mi || 0, 4, 24);
            const bMi = helpers_1.numberToString(b.Mi || 0, 4, 24);
            const aRepeaterName = a.Call;
            const bRepeaterName = b.Call;
            const aFrequency = helpers_1.numberToString(a.Frequency || 0, 4, 5);
            const bFrequency = helpers_1.numberToString(b.Frequency || 0, 4, 5);
            const aStr = `${aMi} ${aRepeaterName} ${aFrequency}`;
            const bStr = `${bMi} ${bRepeaterName} ${bFrequency}`;
            return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
        });
        const stats = combined.reduce((result, data) => {
            const freq = Math.round(data.Frequency || 0).toString();
            const pow = Math.pow(10, Math.max(freq.length - 2, 0)) * 2;
            const group = Math.round((data.Frequency || 0) / pow) * pow;
            // console.log(freq, pow, group);
            const count = result[group] || 0;
            return { ...result, [group]: count + 1 };
        }, {});
        // tslint:disable-next-line:no-console
        console.log('STATS', stats);
        // combined.slice(0, 100).forEach((c) => log(c.Call, "\t", c.Latitude, "\t", c.Longitude, "\t", c.Mi));
        await fs_helpers_1.writeToJsonAndCsv('data/repeaters/combined/CO', combined);
    })();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2NvbWJpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxvREFBa0Y7SUFDbEYsOENBQWtEO0lBQ2xELHNEQUFpRDtJQUVqRCxnRUFBa0Q7SUFFbEQsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFMUQsa0JBQWUsQ0FBQyxLQUFLLElBQW1CLEVBQUU7UUFDeEMsTUFBTSxPQUFPLEdBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtRQUMxRSxNQUFNLFFBQVEsR0FBbUIsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sS0FBSyxHQUFxQixNQUFNLHFDQUF3QixDQUFpQiwyQkFBMkIsQ0FBQyxDQUFDO1FBQzVHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBMkMsRUFBRSxDQUFDO1FBQ3pELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFvQixFQUFFLEVBQUU7WUFDckMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUN6QyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEIsTUFBTSxRQUFRLEdBQVcsc0JBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakYsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDO2lCQUNqQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLENBQWUsRUFBRSxFQUFFO1lBQ2pELE1BQU0sR0FBRyxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sR0FBRyxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sYUFBYSxHQUF1QixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pELE1BQU0sYUFBYSxHQUF1QixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pELE1BQU0sVUFBVSxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sVUFBVSxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sSUFBSSxHQUFXLEdBQUcsR0FBRyxJQUFJLGFBQWEsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUM3RCxNQUFNLElBQUksR0FBVyxHQUFHLEdBQUcsSUFBSSxhQUFhLElBQUksVUFBVSxFQUFFLENBQUM7WUFFN0QsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBK0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQW1DLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQ3BILE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoRSxNQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNwRSxpQ0FBaUM7WUFDakMsTUFBTSxLQUFLLEdBQVcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxPQUFPLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDM0MsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1Asc0NBQXNDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVCLHVHQUF1RztRQUN2RyxNQUFNLDhCQUFpQixDQUFDLDRCQUE0QixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBbGxGaWxlc0Zyb21EaXJlY3RvcnksIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XG5pbXBvcnQgeyBudW1iZXJUb1N0cmluZyB9IGZyb20gJ0BoZWxwZXJzL2hlbHBlcnMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xuaW1wb3J0IHsgSVJlcGVhdGVyUmF3IH0gZnJvbSAnQGludGVyZmFjZXMvaS1yZXBlYXRlci1yYXcnO1xuaW1wb3J0IGdwc0Rpc3RhbmNlLCB7IFBvaW50IH0gZnJvbSAnZ3BzLWRpc3RhbmNlJztcblxuY29uc3QgbG9nOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCA9IGNyZWF0ZUxvZygnQ29tYmluZScpO1xuXG5leHBvcnQgZGVmYXVsdCAoYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCBteVBvaW50OiBQb2ludCA9IFszOS42MjcwNzE1MDAsIC0xMDQuODkzMzIyNTAwXTsgLy8gNDk4MiBTIFVsc3RlciBTdFxuICBjb25zdCBjb21iaW5lZDogSVJlcGVhdGVyUmF3W10gPSBbXTtcbiAgY29uc3QgZmlsZXM6IElSZXBlYXRlclJhd1tdW10gPSBhd2FpdCBnZXRBbGxGaWxlc0Zyb21EaXJlY3Rvcnk8SVJlcGVhdGVyUmF3W10+KCdkYXRhL3JlcGVhdGVycy9yZXN1bHRzL0NPJyk7XG4gIGxvZygnR290JywgZmlsZXMubGVuZ3RoLCAnZmlsZXMnKTtcbiAgY29uc3QgZm91bmQ6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB8IHVuZGVmaW5lZCB9ID0ge307XG4gIGZpbGVzLmZvckVhY2goKGZpbGU6IElSZXBlYXRlclJhd1tdKSA9PiB7XG4gICAgbG9nKCdHb3QnLCBmaWxlLmxlbmd0aCwgJ3JlcGVhdGVycycpO1xuICAgIGZpbGUuZm9yRWFjaCgoaXRlbTogSVJlcGVhdGVyUmF3KSA9PiB7XG4gICAgICBpZiAoIWZvdW5kW2Ake2l0ZW0uc3RhdGVfaWR9LSR7aXRlbS5JRH1gXSkge1xuICAgICAgICBmb3VuZFtgJHtpdGVtLnN0YXRlX2lkfS0ke2l0ZW0uSUR9YF0gPSB0cnVlO1xuICAgICAgICBjb21iaW5lZC5wdXNoKGl0ZW0pO1xuICAgICAgICBjb25zdCBkaXN0YW5jZTogbnVtYmVyID0gZ3BzRGlzdGFuY2UoW215UG9pbnQsIFtpdGVtLkxhdGl0dWRlLCBpdGVtLkxvbmdpdHVkZV1dKTtcbiAgICAgICAgaXRlbS5NaSA9IGRpc3RhbmNlICogMC42MjEzNzExOTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGxvZygnR290JywgY29tYmluZWQubGVuZ3RoLCAndW5pcXVlIHJlcGVhdGVycycpO1xuICBjb21iaW5lZC5zb3J0KChhOiBJUmVwZWF0ZXJSYXcsIGI6IElSZXBlYXRlclJhdykgPT4ge1xuICAgIGNvbnN0IGFNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5NaSB8fCAwLCA0LCAyNCk7XG4gICAgY29uc3QgYk1pOiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhiLk1pIHx8IDAsIDQsIDI0KTtcbiAgICBjb25zdCBhUmVwZWF0ZXJOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBhLkNhbGw7XG4gICAgY29uc3QgYlJlcGVhdGVyTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYi5DYWxsO1xuICAgIGNvbnN0IGFGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGEuRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xuICAgIGNvbnN0IGJGcmVxdWVuY3k6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGIuRnJlcXVlbmN5IHx8IDAsIDQsIDUpO1xuICAgIGNvbnN0IGFTdHI6IHN0cmluZyA9IGAke2FNaX0gJHthUmVwZWF0ZXJOYW1lfSAke2FGcmVxdWVuY3l9YDtcbiAgICBjb25zdCBiU3RyOiBzdHJpbmcgPSBgJHtiTWl9ICR7YlJlcGVhdGVyTmFtZX0gJHtiRnJlcXVlbmN5fWA7XG5cbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XG4gIH0pO1xuICBjb25zdCBzdGF0czogeyBbIGtleTogc3RyaW5nXTogbnVtYmVyIH0gPSBjb21iaW5lZC5yZWR1Y2UoKHJlc3VsdDogeyBbIGtleTogc3RyaW5nIF06IG51bWJlciB9LCBkYXRhOiBJUmVwZWF0ZXJSYXcpID0+IHtcbiAgICBjb25zdCBmcmVxOiBzdHJpbmcgPSBNYXRoLnJvdW5kKGRhdGEuRnJlcXVlbmN5IHx8IDApLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgcG93OiBudW1iZXIgPSBNYXRoLnBvdygxMCwgTWF0aC5tYXgoZnJlcS5sZW5ndGggLSAyLCAwKSkgKiAyO1xuICAgIGNvbnN0IGdyb3VwOiBudW1iZXIgPSBNYXRoLnJvdW5kKChkYXRhLkZyZXF1ZW5jeSB8fCAwKSAvIHBvdykgKiBwb3c7XG4gICAgLy8gY29uc29sZS5sb2coZnJlcSwgcG93LCBncm91cCk7XG4gICAgY29uc3QgY291bnQ6IG51bWJlciA9IHJlc3VsdFtncm91cF0gfHwgMDtcbiAgICByZXR1cm4geyAuLi5yZXN1bHQsIFtncm91cF06IGNvdW50ICsgMSB9O1xuICB9LCB7fSk7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gIGNvbnNvbGUubG9nKCdTVEFUUycsIHN0YXRzKTtcbiAgLy8gY29tYmluZWQuc2xpY2UoMCwgMTAwKS5mb3JFYWNoKChjKSA9PiBsb2coYy5DYWxsLCBcIlxcdFwiLCBjLkxhdGl0dWRlLCBcIlxcdFwiLCBjLkxvbmdpdHVkZSwgXCJcXHRcIiwgYy5NaSkpO1xuICBhd2FpdCB3cml0ZVRvSnNvbkFuZENzdignZGF0YS9yZXBlYXRlcnMvY29tYmluZWQvQ08nLCBjb21iaW5lZCk7XG59KSgpO1xuIl19