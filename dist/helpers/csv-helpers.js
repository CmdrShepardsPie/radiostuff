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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2LWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9jc3YtaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFBLDBEQUE4QjtJQUM5QixrRUFBc0M7SUFDdEMsK0JBQWlDO0lBS3BCLFFBQUEsVUFBVSxHQUFpQixnQkFBUyxDQUFrRCxtQkFBSyxDQUFDLENBQUM7SUFDN0YsUUFBQSxjQUFjLEdBQXFCLGdCQUFTLENBQTZDLHVCQUFnQixDQUFDLENBQUM7SUFFeEgsU0FBZ0IsZ0JBQWdCLENBQUMsT0FBaUI7UUFDaEQsTUFBTSxRQUFRLEdBQWEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sSUFBSSxHQUErQixFQUFFLENBQUM7UUFDNUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1lBQ2hDLE1BQU0sT0FBTyxHQUF5QixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFvQixFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDL0MsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNuQixRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxHQUF3QixDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQXdCLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQWpCRCw0Q0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnY3N2LXN0cmluZ2lmeSc7XG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJztcblxuZXhwb3J0IHR5cGUgUGFyc2VQcm9taXNlID0gKGlucHV0OiBCdWZmZXIgfCBzdHJpbmcsIG9wdGlvbnM/OiBwYXJzZS5PcHRpb25zKSA9PiBQcm9taXNlPGFueT47XG5leHBvcnQgdHlwZSBTdHJpbmdpZnlQcm9taXNlID0gKGlucHV0OiBhbnksIG9wdGlvbnM/OiBzdHJpbmdpZnkuT3B0aW9ucykgPT4gUHJvbWlzZTxzdHJpbmc+O1xuXG5leHBvcnQgY29uc3QgcGFyc2VBc3luYzogUGFyc2VQcm9taXNlID0gcHJvbWlzaWZ5PEJ1ZmZlciB8IHN0cmluZywgcGFyc2UuT3B0aW9ucyB8IHVuZGVmaW5lZCwgYW55PihwYXJzZSk7XG5leHBvcnQgY29uc3Qgc3RyaW5naWZ5QXN5bmM6IFN0cmluZ2lmeVByb21pc2UgPSBwcm9taXNpZnk8YW55LCBzdHJpbmdpZnkuT3B0aW9ucyB8IHVuZGVmaW5lZCwgc3RyaW5nPihzdHJpbmdpZnkgYXMgYW55KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxBcnJheU9iamVjdHMoaW5BcnJheTogb2JqZWN0W10pOiBvYmplY3RbXSB7XG4gIGNvbnN0IG91dEFycmF5OiBvYmplY3RbXSA9IFsuLi5pbkFycmF5XTtcbiAgY29uc3Qga2V5czogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcbiAgb3V0QXJyYXkuZm9yRWFjaCgoaXRlbTogb2JqZWN0KSA9PiB7XG4gICAgY29uc3QgZW50cmllczogQXJyYXk8W3N0cmluZywgYW55XT4gPSBPYmplY3QuZW50cmllcyhpdGVtKTtcbiAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5OiBbc3RyaW5nLCBhbnldKSA9PiB7XG4gICAgICBrZXlzW2VudHJ5WzBdXSA9IHRydWU7XG4gICAgfSk7XG4gIH0pO1xuICBvdXRBcnJheS5mb3JFYWNoKChpdGVtOiBvYmplY3QsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBpdGVtID0geyAuLi5pdGVtIH07XG4gICAgb3V0QXJyYXlbaW5kZXhdID0gaXRlbTtcbiAgICBPYmplY3Qua2V5cyhrZXlzKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgaXRlbVtrZXkgYXMga2V5b2YgdHlwZW9mIGl0ZW1dID0gaXRlbVtrZXkgYXMga2V5b2YgdHlwZW9mIGl0ZW1dO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG91dEFycmF5O1xufVxuIl19