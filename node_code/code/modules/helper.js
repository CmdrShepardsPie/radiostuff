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
    exports.mapDir = exports.getText = exports.getNumber = exports.getTextOrNumber = void 0;
    function getTextOrNumber(el) {
        const value = getText(el);
        const num = getNumber(value);
        return !isNaN(num) ? num : value;
    }
    exports.getTextOrNumber = getTextOrNumber;
    function getNumber(text, reg = /^([\-+]?\d+\.?\d*)/) {
        let result = NaN;
        if (text && text.match) {
            const match = text.match(reg);
            // console.log("match", match);
            if (match) {
                result = parseFloat(match[1]);
            }
        }
        return result;
    }
    exports.getNumber = getNumber;
    function getText(el) {
        if (el) {
            let text = el.innerHTML;
            if (text) {
                text = text.replace(/<script>.*<\/script>/gi, ' ');
                text = text.replace(/<[^>]*>/gi, ' ');
                text = text.replace(/\n/gi, ' ');
                text = text.replace(/\s+/gi, ' ');
                return text.trim();
            }
        }
        return '';
    }
    exports.getText = getText;
    function mapDir(dir) {
        switch (dir) {
            case 'N':
                return 1;
            case 'NE':
                return 2;
            case 'E':
                return 3;
            case 'SE':
                return 4;
            case 'S':
                return 5;
            case 'SW':
                return 6;
            case 'W':
                return 7;
            case 'NW':
                return 8;
        }
        return 0;
    }
    exports.mapDir = mapDir;
});
//# sourceMappingURL=helper.js.map