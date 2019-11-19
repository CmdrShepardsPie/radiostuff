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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxzREFBaUQ7SUFDakQsa0RBQTBCO0lBRTFCLE1BQU0sR0FBRyxHQUE0Qix1QkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTFELFNBQWdCLElBQUksQ0FBVyxFQUFVLEVBQUUsRUFBMkI7UUFDcEUsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQTJDLEVBQUUsTUFBOEIsRUFBUSxFQUFFO1lBQ3ZHLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDcEIsSUFBSTtvQkFDRixPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzdCO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDWDtZQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVhELG9CQVdDO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLEdBQVcsRUFBRSxLQUFjLEVBQUUsS0FBYztRQUN4RSxJQUFJLEdBQUcsR0FBVyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakMsTUFBTSxLQUFLLEdBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUMxQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ2hCO1lBQ0QsT0FBTyxLQUFLLENBQUMsQ0FB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RyxPQUFPLEVBQUUsR0FBRyxpQkFBaUIsRUFBRSxDQUFDO29CQUMvQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2lCQUNiO2FBQ0Y7U0FDRjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUF4QkQsc0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlTG9nIH0gZnJvbSAnQGhlbHBlcnMvbG9nLWhlbHBlcnMnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcblxuY29uc3QgbG9nOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCA9IGNyZWF0ZUxvZygnSGVscGVycycpO1xuXG5leHBvcnQgZnVuY3Rpb24gd2FpdDxUID0gdm9pZD4obXM6IG51bWJlciwgZm4/OiAoKSA9PiAoVCB8IFByb21pc2U8VD4pKTogUHJvbWlzZTxUPiB7XG4gIGxvZyhjaGFsay5ncmVlbignV2FpdCcpLCBtcyk7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKHZhbHVlPzogKFByb21pc2U8VD4gfCBUKSkgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKTogdm9pZCA9PiB7XG4gICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKGZuICYmIChhd2FpdCBmbigpKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9LCBtcyk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyVG9TdHJpbmcobnVtOiBudW1iZXIsIG1ham9yPzogbnVtYmVyLCBtaW5vcj86IG51bWJlcik6IHN0cmluZyB7XG4gIGxldCBzdHI6IHN0cmluZyA9IG51bS50b1N0cmluZygpO1xuICBjb25zdCBzcGxpdDogc3RyaW5nW10gPSBzdHIuc3BsaXQoJy4nKTtcbiAgaWYgKG1ham9yICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoc3BsaXRbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3BsaXRbMF0gPSAnMCc7XG4gICAgfVxuICAgIHdoaWxlIChzcGxpdFswXS5sZW5ndGggPCBtYWpvcikge1xuICAgICAgc3BsaXRbMF0gPSAnMCcgKyBzcGxpdFswXTtcbiAgICB9XG4gICAgaWYgKHNwbGl0WzBdLmxlbmd0aCA+IG1ham9yKSB7XG4gICAgICBsb2coY2hhbGsucmVkKCdNYWpvciBsZW5ndGggZXhjZWVkZWQnKSwgJ051bWJlcjonLCBudW0sICdTZWN0aW9uOicsIHNwbGl0WzBdLCAnTGVuZ3RoOicsIHNwbGl0WzBdLmxlbmd0aCwgJ1RhcmdldDonLCBtYWpvcik7XG4gICAgfVxuICAgIHN0ciA9IHNwbGl0LmpvaW4oJy4nKTtcbiAgfVxuICBpZiAobWlub3IgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChzcGxpdFsxXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzcGxpdFsxXSA9ICcwJztcbiAgICB9XG4gICAgd2hpbGUgKHNwbGl0WzFdLmxlbmd0aCA8IG1pbm9yKSB7XG4gICAgICBzcGxpdFsxXSA9IHNwbGl0WzFdICsgJzAnO1xuICAgIH1cbiAgICBpZiAoc3BsaXRbMV0ubGVuZ3RoID4gbWlub3IpIHtcbiAgICAgIGxvZyhjaGFsay5yZWQoJ01pbm9yIGxlbmd0aCBleGNlZWRlZCcpLCAnTnVtYmVyOicsIG51bSwgJ1NlY3Rpb246Jywgc3BsaXRbMV0sICdMZW5ndGg6Jywgc3BsaXRbMV0ubGVuZ3RoLCAnVGFyZ2V0OicsIG1pbm9yKTtcbiAgICB9XG4gICAgc3RyID0gc3BsaXQuam9pbignLicpO1xuICB9XG4gIHJldHVybiBzdHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuT2JqZWN0KGRhdGE6IGFueSk6IGFueSB7XG4gIGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIGxldCBzdWJEYXRhOiBhbnkgPSB7IC4uLmRhdGEgfTtcbiAgbGV0IGxvb3A6IGJvb2xlYW4gPSB0cnVlO1xuICB3aGlsZSAobG9vcCkge1xuICAgIGxvb3AgPSBmYWxzZTtcbiAgICBjb25zdCBlbnRyaWVzOiBBcnJheTxbc3RyaW5nLCBhbnldPiA9IE9iamVjdC5lbnRyaWVzKHN1YkRhdGEpO1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgICAgY29uc3Qga2V5OiBzdHJpbmcgPSBlbnRyeVswXTtcbiAgICAgIGNvbnN0IHZhbHVlOiBhbnkgPSBlbnRyeVsxXTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBkZWxldGUgc3ViRGF0YVtrZXldO1xuICAgICAgICBjb25zdCB2YWx1ZVdpdGhLZXluYW1lczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoc3ViRW50cnk6IFtzdHJpbmcsIGFueV0pID0+IHtcbiAgICAgICAgICB2YWx1ZVdpdGhLZXluYW1lc1tgJHtrZXl9LiR7c3ViRW50cnlbMF19YF0gPSBzdWJFbnRyeVsxXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHN1YkRhdGEgPSB7IC4uLnN1YkRhdGEsIC4uLnZhbHVlV2l0aEtleW5hbWVzIH07XG4gICAgICAgIGxvb3AgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3ViRGF0YTtcbn1cbiJdfQ==