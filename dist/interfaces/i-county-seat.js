(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaS1jb3VudHktc2VhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnRlcmZhY2VzL2ktY291bnR5LXNlYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgSUNvdW50eVNlYXQge1xuICBDb3VudHk6IHN0cmluZztcbiAgJ0ZJUFMgQ29kZSc6IHN0cmluZztcbiAgJ0ZJUFMgU3RhdGUgYW5kIENvdW50eSBDb2RlJzogc3RyaW5nO1xuICAnQ291bnR5IFNlYXQnOiBzdHJpbmc7XG4gIEVzdGFibGlzaGVkOiBzdHJpbmc7XG4gIExvY2F0aW9uOiBzdHJpbmc7XG59XG4iXX0=