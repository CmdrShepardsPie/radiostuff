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
    exports.powAndFix = void 0;
    function powAndFix(fValue, decimals, offset = 1) {
        const sValue = fValue.toString();
        const precision = sValue.length - ((sValue.indexOf('.') || sValue.length) + 1);
        const stageA = Math.round(fValue * Math.pow(10, precision));
        const stageB = Math.pow(10, decimals - precision);
        const stageC = (stageA * stageB) * Math.pow(10, offset);
        const result = Math.round(stageC) / Math.pow(10, offset);
        console.log('fValue', fValue, 'decimals', decimals, 'offset', offset, 'sValue', sValue, 'precision', precision, 'stageA', stageA, 'stageB', stageB, 'stageC', stageC, 'result', result);
        return result;
    }
    exports.powAndFix = powAndFix;
});
