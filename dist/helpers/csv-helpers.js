var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "csv", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _csv = require("csv");
    var util_1 = require("util");
    exports.parseAsync = util_1.promisify(_csv.parse);
    exports.stringifyAsync = util_1.promisify(_csv.stringify);
    function fillArrayObjects(inArray) {
        var outArray = __spread(inArray);
        var keys = {};
        outArray.forEach(function (item) {
            var entries = Object.entries(item);
            entries.forEach(function (entry) {
                keys[entry[0]] = true;
            });
        });
        outArray.forEach(function (item, index) {
            item = __assign({}, item);
            outArray[index] = item;
            Object.keys(keys).forEach(function (key) {
                // @ts-ignore
                item[key] = item[key];
            });
        });
        return outArray;
    }
    exports.fillArrayObjects = fillArrayObjects;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2LWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9jc3YtaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSwwQkFBNEI7SUFDNUIsNkJBQWlDO0lBRXBCLFFBQUEsVUFBVSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLFFBQUEsY0FBYyxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXhELFNBQWdCLGdCQUFnQixDQUFDLE9BQWlCO1FBQ2hELElBQU0sUUFBUSxZQUFPLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQU0sSUFBSSxHQUErQixFQUFFLENBQUM7UUFDNUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7WUFDcEIsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztnQkFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO1lBQzNCLElBQUksZ0JBQU8sSUFBSSxDQUFDLENBQUM7WUFDakIsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7Z0JBQzVCLGFBQWE7Z0JBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQWxCRCw0Q0FrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfY3N2IGZyb20gXCJjc3ZcIjtcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJ1dGlsXCI7XG5cbmV4cG9ydCBjb25zdCBwYXJzZUFzeW5jID0gcHJvbWlzaWZ5KF9jc3YucGFyc2UpO1xuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeUFzeW5jID0gcHJvbWlzaWZ5KF9jc3Yuc3RyaW5naWZ5KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxBcnJheU9iamVjdHMoaW5BcnJheTogb2JqZWN0W10pIHtcbiAgY29uc3Qgb3V0QXJyYXkgPSBbLi4uaW5BcnJheV07XG4gIGNvbnN0IGtleXM6IHtbaW5kZXg6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG4gIG91dEFycmF5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoaXRlbSk7XG4gICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAga2V5c1tlbnRyeVswXV0gPSB0cnVlO1xuICAgIH0pO1xuICB9KTtcbiAgb3V0QXJyYXkuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpdGVtID0gey4uLml0ZW19O1xuICAgIG91dEFycmF5W2luZGV4XSA9IGl0ZW07XG4gICAgT2JqZWN0LmtleXMoa2V5cykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBpdGVtW2tleV0gPSBpdGVtW2tleV07XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb3V0QXJyYXk7XG59XG4iXX0=