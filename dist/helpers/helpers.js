var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@helpers/log-helpers", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const log_helpers_1 = require("@helpers/log-helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const log = log_helpers_1.createLog('Helpers');
    function wait(ms, fn) {
        log(chalk_1.default.green('Wait'), ms);
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    resolve(fn && (await fn()));
                }
                catch (e) {
                    reject(e);
                }
            }, ms);
        });
    }
    exports.wait = wait;
    function numberToString(num, major, minor) {
        let str = num.toString();
        const split = str.split('.');
        if (major !== undefined) {
            if (split[0] === undefined) {
                split[0] = '0';
            }
            while (split[0].length < major) {
                split[0] = '0' + split[0];
            }
            if (split[0].length > major) {
                log(chalk_1.default.red('Major length exceeded'), 'Number:', num, 'Section:', split[0], 'Length:', split[0].length, 'Target:', major);
            }
            str = split.join('.');
        }
        if (minor !== undefined) {
            if (split[1] === undefined) {
                split[1] = '0';
            }
            while (split[1].length < minor) {
                split[1] = split[1] + '0';
            }
            if (split[1].length > minor) {
                log(chalk_1.default.red('Minor length exceeded'), 'Number:', num, 'Section:', split[1], 'Length:', split[1].length, 'Target:', minor);
            }
            str = split.join('.');
        }
        return str;
    }
    exports.numberToString = numberToString;
    function flattenObject(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            return data;
        }
        let subData = { ...data };
        let loop = true;
        while (loop) {
            loop = false;
            const entries = Object.entries(subData);
            for (const entry of entries) {
                const key = entry[0];
                const value = entry[1];
                if (typeof value === 'object' && !Array.isArray(value)) {
                    delete subData[key];
                    const valueWithKeynames = {};
                    Object.entries(value).forEach((subEntry) => {
                        valueWithKeynames[`${key}.${subEntry[0]}`] = subEntry[1];
                    });
                    subData = { ...subData, ...valueWithKeynames };
                    loop = true;
                }
            }
        }
        return subData;
    }
    exports.flattenObject = flattenObject;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxzREFBaUQ7SUFDakQsa0RBQTBCO0lBRTFCLE1BQU0sR0FBRyxHQUE0Qix1QkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTFELFNBQWdCLElBQUksQ0FBVyxFQUFVLEVBQUUsRUFBMkI7UUFDcEUsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQTJDLEVBQUUsTUFBOEIsRUFBUSxFQUFFO1lBQ3ZHLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDcEIsSUFBSTtvQkFDRixPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzdCO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDWDtZQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVhELG9CQVdDO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLEdBQVcsRUFBRSxLQUFjLEVBQUUsS0FBYztRQUN4RSxJQUFJLEdBQUcsR0FBVyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakMsTUFBTSxLQUFLLEdBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUMxQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ2hCO1lBQ0QsT0FBTyxLQUFLLENBQUMsQ0FB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RyxPQUFPLEVBQUUsR0FBRyxpQkFBaUIsRUFBRSxDQUFDO29CQUMvQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2lCQUNiO2FBQ0Y7U0FDRjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUF4QkQsc0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xyXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5cclxuY29uc3QgbG9nOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCA9IGNyZWF0ZUxvZygnSGVscGVycycpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VCA9IHZvaWQ+KG1zOiBudW1iZXIsIGZuPzogKCkgPT4gKFQgfCBQcm9taXNlPFQ+KSk6IFByb21pc2U8VD4ge1xyXG4gIGxvZyhjaGFsay5ncmVlbignV2FpdCcpLCBtcyk7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiAodmFsdWU/OiAoUHJvbWlzZTxUPiB8IFQpKSA9PiB2b2lkLCByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpOiB2b2lkID0+IHtcclxuICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc29sdmUoZm4gJiYgKGF3YWl0IGZuKCkpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlamVjdChlKTtcclxuICAgICAgfVxyXG4gICAgfSwgbXMpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyVG9TdHJpbmcobnVtOiBudW1iZXIsIG1ham9yPzogbnVtYmVyLCBtaW5vcj86IG51bWJlcik6IHN0cmluZyB7XHJcbiAgbGV0IHN0cjogc3RyaW5nID0gbnVtLnRvU3RyaW5nKCk7XHJcbiAgY29uc3Qgc3BsaXQ6IHN0cmluZ1tdID0gc3RyLnNwbGl0KCcuJyk7XHJcbiAgaWYgKG1ham9yICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGlmIChzcGxpdFswXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNwbGl0WzBdID0gJzAnO1xyXG4gICAgfVxyXG4gICAgd2hpbGUgKHNwbGl0WzBdLmxlbmd0aCA8IG1ham9yKSB7XHJcbiAgICAgIHNwbGl0WzBdID0gJzAnICsgc3BsaXRbMF07XHJcbiAgICB9XHJcbiAgICBpZiAoc3BsaXRbMF0ubGVuZ3RoID4gbWFqb3IpIHtcclxuICAgICAgbG9nKGNoYWxrLnJlZCgnTWFqb3IgbGVuZ3RoIGV4Y2VlZGVkJyksICdOdW1iZXI6JywgbnVtLCAnU2VjdGlvbjonLCBzcGxpdFswXSwgJ0xlbmd0aDonLCBzcGxpdFswXS5sZW5ndGgsICdUYXJnZXQ6JywgbWFqb3IpO1xyXG4gICAgfVxyXG4gICAgc3RyID0gc3BsaXQuam9pbignLicpO1xyXG4gIH1cclxuICBpZiAobWlub3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHNwbGl0WzFdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc3BsaXRbMV0gPSAnMCc7XHJcbiAgICB9XHJcbiAgICB3aGlsZSAoc3BsaXRbMV0ubGVuZ3RoIDwgbWlub3IpIHtcclxuICAgICAgc3BsaXRbMV0gPSBzcGxpdFsxXSArICcwJztcclxuICAgIH1cclxuICAgIGlmIChzcGxpdFsxXS5sZW5ndGggPiBtaW5vcikge1xyXG4gICAgICBsb2coY2hhbGsucmVkKCdNaW5vciBsZW5ndGggZXhjZWVkZWQnKSwgJ051bWJlcjonLCBudW0sICdTZWN0aW9uOicsIHNwbGl0WzFdLCAnTGVuZ3RoOicsIHNwbGl0WzFdLmxlbmd0aCwgJ1RhcmdldDonLCBtaW5vcik7XHJcbiAgICB9XHJcbiAgICBzdHIgPSBzcGxpdC5qb2luKCcuJyk7XHJcbiAgfVxyXG4gIHJldHVybiBzdHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuT2JqZWN0KGRhdGE6IGFueSk6IGFueSB7XHJcbiAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcbiAgbGV0IHN1YkRhdGE6IGFueSA9IHsgLi4uZGF0YSB9O1xyXG4gIGxldCBsb29wOiBib29sZWFuID0gdHJ1ZTtcclxuICB3aGlsZSAobG9vcCkge1xyXG4gICAgbG9vcCA9IGZhbHNlO1xyXG4gICAgY29uc3QgZW50cmllczogQXJyYXk8W3N0cmluZywgYW55XT4gPSBPYmplY3QuZW50cmllcyhzdWJEYXRhKTtcclxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xyXG4gICAgICBjb25zdCBrZXk6IHN0cmluZyA9IGVudHJ5WzBdO1xyXG4gICAgICBjb25zdCB2YWx1ZTogYW55ID0gZW50cnlbMV07XHJcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgIGRlbGV0ZSBzdWJEYXRhW2tleV07XHJcbiAgICAgICAgY29uc3QgdmFsdWVXaXRoS2V5bmFtZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoc3ViRW50cnk6IFtzdHJpbmcsIGFueV0pID0+IHtcclxuICAgICAgICAgIHZhbHVlV2l0aEtleW5hbWVzW2Ake2tleX0uJHtzdWJFbnRyeVswXX1gXSA9IHN1YkVudHJ5WzFdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN1YkRhdGEgPSB7IC4uLnN1YkRhdGEsIC4uLnZhbHVlV2l0aEtleW5hbWVzIH07XHJcbiAgICAgICAgbG9vcCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHN1YkRhdGE7XHJcbn1cclxuIl19