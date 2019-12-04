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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2NvbWJpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxvREFBa0Y7SUFDbEYsOENBQWtEO0lBQ2xELHNEQUFpRDtJQUVqRCxnRUFBa0Q7SUFFbEQsTUFBTSxHQUFHLEdBQTRCLHVCQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFMUQsa0JBQWUsQ0FBQyxLQUFLLElBQW1CLEVBQUU7UUFDeEMsTUFBTSxPQUFPLEdBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtRQUMxRSxNQUFNLFFBQVEsR0FBbUIsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sS0FBSyxHQUFxQixNQUFNLHFDQUF3QixDQUFpQiwyQkFBMkIsQ0FBQyxDQUFDO1FBQzVHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBMkMsRUFBRSxDQUFDO1FBQ3pELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFvQixFQUFFLEVBQUU7WUFDckMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUN6QyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEIsTUFBTSxRQUFRLEdBQVcsc0JBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakYsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDO2lCQUNqQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLENBQWUsRUFBRSxFQUFFO1lBQ2pELE1BQU0sR0FBRyxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sR0FBRyxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sYUFBYSxHQUF1QixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pELE1BQU0sYUFBYSxHQUF1QixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pELE1BQU0sVUFBVSxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sVUFBVSxHQUFXLHdCQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sSUFBSSxHQUFXLEdBQUcsR0FBRyxJQUFJLGFBQWEsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUM3RCxNQUFNLElBQUksR0FBVyxHQUFHLEdBQUcsSUFBSSxhQUFhLElBQUksVUFBVSxFQUFFLENBQUM7WUFFN0QsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBK0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQW1DLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQ3BILE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoRSxNQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNwRSxpQ0FBaUM7WUFDakMsTUFBTSxLQUFLLEdBQVcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxPQUFPLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDM0MsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1Asc0NBQXNDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVCLHVHQUF1RztRQUN2RyxNQUFNLDhCQUFpQixDQUFDLDRCQUE0QixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBbGxGaWxlc0Zyb21EaXJlY3RvcnksIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XHJcbmltcG9ydCB7IG51bWJlclRvU3RyaW5nIH0gZnJvbSAnQGhlbHBlcnMvaGVscGVycyc7XHJcbmltcG9ydCB7IGNyZWF0ZUxvZyB9IGZyb20gJ0BoZWxwZXJzL2xvZy1oZWxwZXJzJztcclxuaW1wb3J0IHsgSVJlcGVhdGVyUmF3IH0gZnJvbSAnQGludGVyZmFjZXMvaS1yZXBlYXRlci1yYXcnO1xyXG5pbXBvcnQgZ3BzRGlzdGFuY2UsIHsgUG9pbnQgfSBmcm9tICdncHMtZGlzdGFuY2UnO1xyXG5cclxuY29uc3QgbG9nOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCA9IGNyZWF0ZUxvZygnQ29tYmluZScpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICBjb25zdCBteVBvaW50OiBQb2ludCA9IFszOS42MjcwNzE1MDAsIC0xMDQuODkzMzIyNTAwXTsgLy8gNDk4MiBTIFVsc3RlciBTdFxyXG4gIGNvbnN0IGNvbWJpbmVkOiBJUmVwZWF0ZXJSYXdbXSA9IFtdO1xyXG4gIGNvbnN0IGZpbGVzOiBJUmVwZWF0ZXJSYXdbXVtdID0gYXdhaXQgZ2V0QWxsRmlsZXNGcm9tRGlyZWN0b3J5PElSZXBlYXRlclJhd1tdPignZGF0YS9yZXBlYXRlcnMvcmVzdWx0cy9DTycpO1xyXG4gIGxvZygnR290JywgZmlsZXMubGVuZ3RoLCAnZmlsZXMnKTtcclxuICBjb25zdCBmb3VuZDogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIHwgdW5kZWZpbmVkIH0gPSB7fTtcclxuICBmaWxlcy5mb3JFYWNoKChmaWxlOiBJUmVwZWF0ZXJSYXdbXSkgPT4ge1xyXG4gICAgbG9nKCdHb3QnLCBmaWxlLmxlbmd0aCwgJ3JlcGVhdGVycycpO1xyXG4gICAgZmlsZS5mb3JFYWNoKChpdGVtOiBJUmVwZWF0ZXJSYXcpID0+IHtcclxuICAgICAgaWYgKCFmb3VuZFtgJHtpdGVtLnN0YXRlX2lkfS0ke2l0ZW0uSUR9YF0pIHtcclxuICAgICAgICBmb3VuZFtgJHtpdGVtLnN0YXRlX2lkfS0ke2l0ZW0uSUR9YF0gPSB0cnVlO1xyXG4gICAgICAgIGNvbWJpbmVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2U6IG51bWJlciA9IGdwc0Rpc3RhbmNlKFtteVBvaW50LCBbaXRlbS5MYXRpdHVkZSwgaXRlbS5Mb25naXR1ZGVdXSk7XHJcbiAgICAgICAgaXRlbS5NaSA9IGRpc3RhbmNlICogMC42MjEzNzExOTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgbG9nKCdHb3QnLCBjb21iaW5lZC5sZW5ndGgsICd1bmlxdWUgcmVwZWF0ZXJzJyk7XHJcbiAgY29tYmluZWQuc29ydCgoYTogSVJlcGVhdGVyUmF3LCBiOiBJUmVwZWF0ZXJSYXcpID0+IHtcclxuICAgIGNvbnN0IGFNaTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5NaSB8fCAwLCA0LCAyNCk7XHJcbiAgICBjb25zdCBiTWk6IHN0cmluZyA9IG51bWJlclRvU3RyaW5nKGIuTWkgfHwgMCwgNCwgMjQpO1xyXG4gICAgY29uc3QgYVJlcGVhdGVyTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYS5DYWxsO1xyXG4gICAgY29uc3QgYlJlcGVhdGVyTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gYi5DYWxsO1xyXG4gICAgY29uc3QgYUZyZXF1ZW5jeTogc3RyaW5nID0gbnVtYmVyVG9TdHJpbmcoYS5GcmVxdWVuY3kgfHwgMCwgNCwgNSk7XHJcbiAgICBjb25zdCBiRnJlcXVlbmN5OiBzdHJpbmcgPSBudW1iZXJUb1N0cmluZyhiLkZyZXF1ZW5jeSB8fCAwLCA0LCA1KTtcclxuICAgIGNvbnN0IGFTdHI6IHN0cmluZyA9IGAke2FNaX0gJHthUmVwZWF0ZXJOYW1lfSAke2FGcmVxdWVuY3l9YDtcclxuICAgIGNvbnN0IGJTdHI6IHN0cmluZyA9IGAke2JNaX0gJHtiUmVwZWF0ZXJOYW1lfSAke2JGcmVxdWVuY3l9YDtcclxuXHJcbiAgICByZXR1cm4gYVN0ciA+IGJTdHIgPyAxIDogYVN0ciA8IGJTdHIgPyAtMSA6IDA7XHJcbiAgfSk7XHJcbiAgY29uc3Qgc3RhdHM6IHsgWyBrZXk6IHN0cmluZ106IG51bWJlciB9ID0gY29tYmluZWQucmVkdWNlKChyZXN1bHQ6IHsgWyBrZXk6IHN0cmluZyBdOiBudW1iZXIgfSwgZGF0YTogSVJlcGVhdGVyUmF3KSA9PiB7XHJcbiAgICBjb25zdCBmcmVxOiBzdHJpbmcgPSBNYXRoLnJvdW5kKGRhdGEuRnJlcXVlbmN5IHx8IDApLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCBwb3c6IG51bWJlciA9IE1hdGgucG93KDEwLCBNYXRoLm1heChmcmVxLmxlbmd0aCAtIDIsIDApKSAqIDI7XHJcbiAgICBjb25zdCBncm91cDogbnVtYmVyID0gTWF0aC5yb3VuZCgoZGF0YS5GcmVxdWVuY3kgfHwgMCkgLyBwb3cpICogcG93O1xyXG4gICAgLy8gY29uc29sZS5sb2coZnJlcSwgcG93LCBncm91cCk7XHJcbiAgICBjb25zdCBjb3VudDogbnVtYmVyID0gcmVzdWx0W2dyb3VwXSB8fCAwO1xyXG4gICAgcmV0dXJuIHsgLi4ucmVzdWx0LCBbZ3JvdXBdOiBjb3VudCArIDEgfTtcclxuICB9LCB7fSk7XHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcclxuICBjb25zb2xlLmxvZygnU1RBVFMnLCBzdGF0cyk7XHJcbiAgLy8gY29tYmluZWQuc2xpY2UoMCwgMTAwKS5mb3JFYWNoKChjKSA9PiBsb2coYy5DYWxsLCBcIlxcdFwiLCBjLkxhdGl0dWRlLCBcIlxcdFwiLCBjLkxvbmdpdHVkZSwgXCJcXHRcIiwgYy5NaSkpO1xyXG4gIGF3YWl0IHdyaXRlVG9Kc29uQW5kQ3N2KCdkYXRhL3JlcGVhdGVycy9jb21iaW5lZC9DTycsIGNvbWJpbmVkKTtcclxufSkoKTtcclxuIl19