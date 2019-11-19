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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9sb2ctaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFBLGtEQUFxQztJQUVyQyxJQUFJLGlCQUFpQixHQUFZLEtBQUssQ0FBQztJQUN2QyxJQUFJLFdBQW1CLENBQUM7SUFFeEIsTUFBTSxRQUFRLEdBQXVCO1FBQ25DLGFBQWE7UUFDYixPQUFPO1FBQ1AsU0FBUztRQUNULFVBQVU7UUFDVixRQUFRO1FBQ1IsV0FBVztRQUNYLFFBQVE7S0FVVCxDQUFDO0lBQ0YsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO0lBRTFCLFNBQWdCLFNBQVMsQ0FBQyxPQUFlLEVBQUUsS0FBbUI7UUFDNUQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUIsU0FBUyxJQUFJLENBQUMsQ0FBQztZQUNmLElBQUksU0FBUyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDZjtTQUNGO1FBQ0QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDaEYsQ0FBQztJQVRELDhCQVNDO0lBRUQsU0FBZ0IsU0FBUyxDQUFDLE9BQWUsRUFBRSxLQUFtQjtRQUM1RCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QixTQUFTLElBQUksQ0FBQyxDQUFDO1lBQ2YsSUFBSSxTQUFTLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDaEMsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUNmO1NBQ0Y7UUFDRCxhQUFhO1FBQ2IsTUFB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QUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLGNBQWM7YUFDZjtTQUNGO1FBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDekIsSUFBSTtnQkFDRixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixjQUFjO2FBQ2Y7U0FDRjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFNBQVMsa0JBQWtCLENBQUMsSUFBWTtRQUN0QyxVQUFVO1FBQ1YsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ2pCLDRCQUE0QixFQUM1QixLQUFLLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDNUIsQ0FBQztRQUNGLDBCQUEwQjtRQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FDakIsNkNBQTZDLEVBQzdDLEtBQUssZUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUMxQixDQUFDO1FBQ0YsT0FBTztRQUNQLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQVMsZUFBZTtRQUN0QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsaywgeyBDaGFsayB9IGZyb20gJ2NoYWxrJztcblxubGV0IGxhc3RNZXNzYWdlSW5saW5lOiBib29sZWFuID0gZmFsc2U7XG5sZXQgbGFzdENvbnRleHQ6IHN0cmluZztcblxuY29uc3QgYmdDb2xvcnM6IEFycmF5PGtleW9mIENoYWxrPiA9IFtcbiAgLy8gXCJiZ0JsYWNrXCIsXG4gICdiZ1JlZCcsXG4gICdiZ0dyZWVuJyxcbiAgJ2JnWWVsbG93JyxcbiAgJ2JnQmx1ZScsXG4gICdiZ01hZ2VudGEnLFxuICAnYmdDeWFuJyxcbiAgLy8gXCJiZ1doaXRlXCIsXG4gIC8vIFwiYmdCbGFja0JyaWdodFwiLFxuICAvLyBcImJnUmVkQnJpZ2h0XCIsXG4gIC8vIFwiYmdHcmVlbkJyaWdodFwiLFxuICAvLyBcImJnWWVsbG93QnJpZ2h0XCIsXG4gIC8vIFwiYmdCbHVlQnJpZ2h0XCIsXG4gIC8vIFwiYmdNYWdlbnRhQnJpZ2h0XCIsXG4gIC8vIFwiYmdDeWFuQnJpZ2h0XCIsXG4gIC8vIFwiYmdXaGl0ZUJyaWdodFwiLFxuXTtcbmxldCBsYXN0Q29sb3I6IG51bWJlciA9IDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPdXQoY29udGV4dDogc3RyaW5nLCBjb2xvcj86IGtleW9mIENoYWxrKTogeyBsb2c6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkOyB3cml0ZTogKC4uLm1zZzogYW55W10pID0+IHZvaWQgfSB7XG4gIGlmICghY29sb3IpIHtcbiAgICBjb2xvciA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XG4gICAgbGFzdENvbG9yICs9IDE7XG4gICAgaWYgKGxhc3RDb2xvciA+PSBiZ0NvbG9ycy5sZW5ndGgpIHtcbiAgICAgIGxhc3RDb2xvciA9IDA7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGxvZzogY3JlYXRlTG9nKGNvbnRleHQsIGNvbG9yKSwgd3JpdGU6IGNyZWF0ZVdyaXRlKGNvbnRleHQsIGNvbG9yKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9nKGNvbnRleHQ6IHN0cmluZywgY29sb3I/OiBrZXlvZiBDaGFsayk6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkIHtcbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbG9yID0gYmdDb2xvcnNbbGFzdENvbG9yXTtcbiAgICBsYXN0Q29sb3IgKz0gMTtcbiAgICBpZiAobGFzdENvbG9yID49IGJnQ29sb3JzLmxlbmd0aCkge1xuICAgICAgbGFzdENvbG9yID0gMDtcbiAgICB9XG4gIH1cbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBjaGFsa0NvbG9yRm46IENoYWxrID0gY2hhbGtbY29sb3JdO1xuXG4gIHJldHVybiAoLi4ubXNnOiBhbnlbXSk6IHZvaWQgPT4ge1xuICAgIG1zZyA9IG1zZy5tYXAocHJlcElmSnNvbik7XG5cbiAgICAvLyBpZiAobGFzdENvbnRleHQgIT09IGNvbnRleHQpIHtcbiAgICAvLyAgIGNyZWF0ZUVtcHR5TGluZSgpO1xuICAgIC8vIH1cbiAgICBpZiAobGFzdE1lc3NhZ2VJbmxpbmUpIHtcbiAgICAgIGNyZWF0ZUVtcHR5TGluZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW2NoYWxrQ29sb3JGbihgJHtjb250ZXh0fTpgKSwgLi4ubXNnXTtcblxuICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xuICAgIGxhc3RNZXNzYWdlSW5saW5lID0gZmFsc2U7XG4gICAgbGFzdENvbnRleHQgPSBjb250ZXh0O1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV3JpdGUoY29udGV4dDogc3RyaW5nLCBjb2xvcj86IGtleW9mIENoYWxrKTogKC4uLm1zZzogYW55W10pID0+IHZvaWQge1xuICBpZiAoIWNvbG9yKSB7XG4gICAgY29sb3IgPSBiZ0NvbG9yc1tsYXN0Q29sb3JdO1xuICAgIGxhc3RDb2xvciArPSAxO1xuICAgIGlmIChsYXN0Q29sb3IgPj0gYmdDb2xvcnMubGVuZ3RoKSB7XG4gICAgICBsYXN0Q29sb3IgPSAwO1xuICAgIH1cbiAgfVxuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IGNoYWxrQ29sb3JGbjogQ2hhbGsgPSBjaGFsa1tjb2xvcl07XG5cbiAgcmV0dXJuICguLi5tc2c6IGFueVtdKTogdm9pZCA9PiB7XG4gICAgaWYgKCFsYXN0TWVzc2FnZUlubGluZSkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2hhbGtDb2xvckZuKGAke2NvbnRleHR9OmApICsgJyAnKTtcbiAgICB9XG4gICAgaWYgKGxhc3RNZXNzYWdlSW5saW5lICYmIGxhc3RDb250ZXh0ICE9PSBjb250ZXh0KSB7XG4gICAgICBjcmVhdGVFbXB0eUxpbmUoKTtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNoYWxrQ29sb3JGbihgJHtjb250ZXh0fTpgKSArICcgJyk7XG4gICAgfVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKG1zZy5qb2luKCcgJykpO1xuICAgIGxhc3RNZXNzYWdlSW5saW5lID0gdHJ1ZTtcbiAgICBsYXN0Q29udGV4dCA9IGNvbnRleHQ7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUaHJvd0Vycm9yKGNvbnRleHQ6IHN0cmluZyk6ICh0eXBlOiBzdHJpbmcsIC4uLm1zZzogYW55W10pID0+IHZvaWQge1xuICBjb25zdCBjb2xvcjoga2V5b2YgQ2hhbGsgPSBiZ0NvbG9yc1tsYXN0Q29sb3JdO1xuICBsYXN0Q29sb3IgKz0gMTtcbiAgaWYgKGxhc3RDb2xvciA+PSBiZ0NvbG9ycy5sZW5ndGgpIHtcbiAgICBsYXN0Q29sb3IgPSAwO1xuICB9XG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgY2hhbGtDb2xvckZuOiBDaGFsayA9IGNoYWxrW2NvbG9yXTtcblxuICByZXR1cm4gKHR5cGU6IHN0cmluZywgLi4ubXNnOiBhbnlbXSk6IHZvaWQgPT4ge1xuICAgIGNvbnNvbGUubG9nKGNoYWxrQ29sb3JGbihgJHtjb250ZXh0fTpgKSwgY2hhbGsucmVkKGAke3R5cGV9IEVycm9yOmApLCAuLi5tc2cpO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJlcElmSnNvbih0OiBhbnkpOiBFcnJvciB8IHN0cmluZyB7XG4gIGlmICh0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gdDtcbiAgfVxuICBpZiAodHlwZW9mIHQgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHQgPSBKU09OLnBhcnNlKHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8qIG5vIGVtcHR5ICovXG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgdCA9PT0gJ29iamVjdCcpIHtcbiAgICB0cnkge1xuICAgICAgdCA9IEpTT04uc3RyaW5naWZ5KHQsIG51bGwsIDQpO1xuICAgICAgdCA9IGNvbG9yaXplSnNvblN0cmluZyh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKiBubyBlbXB0eSAqL1xuICAgIH1cbiAgfVxuICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gY29sb3JpemVKc29uU3RyaW5nKGpzb246IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFN0cmluZ3NcbiAganNvbiA9IGpzb24ucmVwbGFjZShcbiAgICAvKFxccyspKFwiW15cIl0qXCIpKCw/W1xcclxcbl0pL2dpLFxuICAgIGAkMSR7Y2hhbGsueWVsbG93KCckMicpfSQzYCxcbiAgKTtcbiAgLy8gYm9vbGVhbnMsIG51bWJlcnMsIGV0Yy5cbiAganNvbiA9IGpzb24ucmVwbGFjZShcbiAgICAvKFxccyspKFteXCJbe1xcXX1dW15bXFxde31cIlxcblxccixdKikoLD9bXFxyXFxuXSkvZ2ksXG4gICAgYCQxJHtjaGFsay5jeWFuKCckMicpfSQzYCxcbiAgKTtcbiAgLy8gS2V5c1xuICBqc29uID0ganNvbi5yZXBsYWNlKC8oXCJbXlwiXSpcIik6L2dpLCBgJHtjaGFsay5tYWdlbnRhKCckMScpfTpgKTtcbiAgcmV0dXJuIGpzb247XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVtcHR5TGluZSgpOiB2b2lkIHtcbiAgY29uc29sZS5sb2coKTtcbn1cbiJdfQ==