var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "csv-parse", "csv-stringify", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const csv_parse_1 = __importDefault(require("csv-parse"));
    const csv_stringify_1 = __importDefault(require("csv-stringify"));
    const util_1 = require("util");
    exports.parseAsync = util_1.promisify(csv_parse_1.default);
    exports.stringifyAsync = util_1.promisify(csv_stringify_1.default);
    function fillArrayObjects(inArray) {
        const outArray = [...inArray];
        const keys = {};
        outArray.forEach((item) => {
            const entries = Object.entries(item);
            entries.forEach((entry) => {
                keys[entry[0]] = true;
            });
        });
        outArray.forEach((item, index) => {
            item = { ...item };
            outArray[index] = item;
            Object.keys(keys).forEach((key) => {
                item[key] = item[key];
            });
        });
        return outArray;
    }
    exports.fillArrayObjects = fillArrayObjects;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2LWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9jc3YtaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFBLDBEQUE4QjtJQUM5QixrRUFBc0M7SUFDdEMsK0JBQWlDO0lBS3BCLFFBQUEsVUFBVSxHQUFpQixnQkFBUyxDQUFrRCxtQkFBSyxDQUFDLENBQUM7SUFDN0YsUUFBQSxjQUFjLEdBQXFCLGdCQUFTLENBQTZDLHVCQUFnQixDQUFDLENBQUM7SUFFeEgsU0FBZ0IsZ0JBQWdCLENBQUMsT0FBaUI7UUFDaEQsTUFBTSxRQUFRLEdBQWEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sSUFBSSxHQUErQixFQUFFLENBQUM7UUFDNUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1lBQ2hDLE1BQU0sT0FBTyxHQUF5QixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFvQixFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDL0MsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNuQixRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxHQUF3QixDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQXdCLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQWpCRCw0Q0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcclxuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICdjc3Ytc3RyaW5naWZ5JztcclxuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCc7XHJcblxyXG5leHBvcnQgdHlwZSBQYXJzZVByb21pc2UgPSAoaW5wdXQ6IEJ1ZmZlciB8IHN0cmluZywgb3B0aW9ucz86IHBhcnNlLk9wdGlvbnMpID0+IFByb21pc2U8YW55PjtcclxuZXhwb3J0IHR5cGUgU3RyaW5naWZ5UHJvbWlzZSA9IChpbnB1dDogYW55LCBvcHRpb25zPzogc3RyaW5naWZ5Lk9wdGlvbnMpID0+IFByb21pc2U8c3RyaW5nPjtcclxuXHJcbmV4cG9ydCBjb25zdCBwYXJzZUFzeW5jOiBQYXJzZVByb21pc2UgPSBwcm9taXNpZnk8QnVmZmVyIHwgc3RyaW5nLCBwYXJzZS5PcHRpb25zIHwgdW5kZWZpbmVkLCBhbnk+KHBhcnNlKTtcclxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeUFzeW5jOiBTdHJpbmdpZnlQcm9taXNlID0gcHJvbWlzaWZ5PGFueSwgc3RyaW5naWZ5Lk9wdGlvbnMgfCB1bmRlZmluZWQsIHN0cmluZz4oc3RyaW5naWZ5IGFzIGFueSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmlsbEFycmF5T2JqZWN0cyhpbkFycmF5OiBvYmplY3RbXSk6IG9iamVjdFtdIHtcclxuICBjb25zdCBvdXRBcnJheTogb2JqZWN0W10gPSBbLi4uaW5BcnJheV07XHJcbiAgY29uc3Qga2V5czogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcclxuICBvdXRBcnJheS5mb3JFYWNoKChpdGVtOiBvYmplY3QpID0+IHtcclxuICAgIGNvbnN0IGVudHJpZXM6IEFycmF5PFtzdHJpbmcsIGFueV0+ID0gT2JqZWN0LmVudHJpZXMoaXRlbSk7XHJcbiAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5OiBbc3RyaW5nLCBhbnldKSA9PiB7XHJcbiAgICAgIGtleXNbZW50cnlbMF1dID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIG91dEFycmF5LmZvckVhY2goKGl0ZW06IG9iamVjdCwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgaXRlbSA9IHsgLi4uaXRlbSB9O1xyXG4gICAgb3V0QXJyYXlbaW5kZXhdID0gaXRlbTtcclxuICAgIE9iamVjdC5rZXlzKGtleXMpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGl0ZW1ba2V5IGFzIGtleW9mIHR5cGVvZiBpdGVtXSA9IGl0ZW1ba2V5IGFzIGtleW9mIHR5cGVvZiBpdGVtXTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBvdXRBcnJheTtcclxufVxyXG4iXX0=