var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createThrowError = exports.createWrite = exports.createLog = exports.createOut = void 0;
    const chalk_1 = __importDefault(require("chalk"));
    let lastMessageInline = false;
    let lastContext;
    const bgColors = [
        // "bgBlack",
        'bgRed',
        'bgGreen',
        'bgYellow',
        'bgBlue',
        'bgMagenta',
        'bgCyan',
        // "bgWhite",
        // "bgBlackBright",
        // "bgRedBright",
        // "bgGreenBright",
        // "bgYellowBright",
        // "bgBlueBright",
        // "bgMagentaBright",
        // "bgCyanBright",
        // "bgWhiteBright",
    ];
    let lastColor = 0;
    function createOut(context, color) {
        if (!color) {
            color = bgColors[lastColor];
            lastColor += 1;
            if (lastColor >= bgColors.length) {
                lastColor = 0;
            }
        }
        return { log: createLog(context, color), write: createWrite(context, color) };
    }
    exports.createOut = createOut;
    function createLog(context, color) {
        if (!color) {
            color = bgColors[lastColor];
            lastColor += 1;
            if (lastColor >= bgColors.length) {
                lastColor = 0;
            }
        }
        // @ts-ignore
        const chalkColorFn = chalk_1.default[color];
        return (...msg) => {
            msg = msg.map(prepIfJson);
            // if (lastContext !== context) {
            //   createEmptyLine();
            // }
            if (lastMessageInline) {
                createEmptyLine();
            }
            const args = [chalkColorFn(`${context}:`), ...msg];
            console.log(...args);
            lastMessageInline = false;
            lastContext = context;
        };
    }
    exports.createLog = createLog;
    function createWrite(context, color) {
        if (!color) {
            color = bgColors[lastColor];
            lastColor += 1;
            if (lastColor >= bgColors.length) {
                lastColor = 0;
            }
        }
        // @ts-ignore
        const chalkColorFn = chalk_1.default[color];
        return (...msg) => {
            if (!lastMessageInline) {
                process.stdout.write(chalkColorFn(`${context}:`) + ' ');
            }
            if (lastMessageInline && lastContext !== context) {
                createEmptyLine();
                process.stdout.write(chalkColorFn(`${context}:`) + ' ');
            }
            process.stdout.write(msg.join(' '));
            lastMessageInline = true;
            lastContext = context;
        };
    }
    exports.createWrite = createWrite;
    function createThrowError(context) {
        const color = bgColors[lastColor];
        lastColor += 1;
        if (lastColor >= bgColors.length) {
            lastColor = 0;
        }
        // @ts-ignore
        const chalkColorFn = chalk_1.default[color];
        return (type, ...msg) => {
            console.log(chalkColorFn(`${context}:`), chalk_1.default.red(`${type} Error:`), ...msg);
            process.exit(1);
        };
    }
    exports.createThrowError = createThrowError;
    function prepIfJson(t) {
        if (t instanceof Error) {
            return t;
        }
        if (typeof t === 'string') {
            try {
                t = JSON.parse(t);
            }
            catch (e) {
                /* no empty */
            }
        }
        if (typeof t === 'object') {
            try {
                t = JSON.stringify(t, null, 4);
                t = colorizeJsonString(t);
            }
            catch (e) {
                /* no empty */
            }
        }
        return t;
    }
    function colorizeJsonString(json) {
        // Strings
        json = json.replace(/(\s+)("[^"]*")(,?[\r\n])/gi, `$1${chalk_1.default.yellow('$2')}$3`);
        // booleans, numbers, etc.
        json = json.replace(/(\s+)([^"[{\]}][^[\]{}"\n\r,]*)(,?[\r\n])/gi, `$1${chalk_1.default.cyan('$2')}$3`);
        // Keys
        json = json.replace(/("[^"]*"):/gi, `${chalk_1.default.magenta('$1')}:`);
        return json;
    }
    function createEmptyLine() {
        console.log();
    }
});
//# sourceMappingURL=log-helpers.js.map