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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9sb2ctaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFBLGtEQUFxQztJQUVyQyxJQUFJLGlCQUFpQixHQUFZLEtBQUssQ0FBQztJQUN2QyxJQUFJLFdBQW1CLENBQUM7SUFFeEIsTUFBTSxRQUFRLEdBQXVCO1FBQ25DLGFBQWE7UUFDYixPQUFPO1FBQ1AsU0FBUztRQUNULFVBQVU7UUFDVixRQUFRO1FBQ1IsV0FBVztRQUNYLFFBQVE7S0FVVCxDQUFDO0lBQ0YsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO0lBRTFCLFNBQWdCLFNBQVMsQ0FBQyxPQUFlLEVBQUUsS0FBbUI7UUFDNUQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUIsU0FBUyxJQUFJLENBQUMsQ0FBQztZQUNmLElBQUksU0FBUyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDZjtTQUNGO1FBQ0QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDaEYsQ0FBQztJQVRELDhCQVNDO0lBRUQsU0FBZ0IsU0FBUyxDQUFDLE9BQWUsRUFBRSxLQUFtQjtRQUM1RCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QixTQUFTLElBQUksQ0FBQyxDQUFDO1lBQ2YsSUFBSSxTQUFTLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDaEMsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUNmO1NBQ0Y7UUFDRCxhQUFhO1FBQ2IsTUFB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QUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLGNBQWM7YUFDZjtTQUNGO1FBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDekIsSUFBSTtnQkFDRixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixjQUFjO2FBQ2Y7U0FDRjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFNBQVMsa0JBQWtCLENBQUMsSUFBWTtRQUN0QyxVQUFVO1FBQ1YsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ2pCLDRCQUE0QixFQUM1QixLQUFLLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDNUIsQ0FBQztRQUNGLDBCQUEwQjtRQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FDakIsNkNBQTZDLEVBQzdDLEtBQUssZUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUMxQixDQUFDO1FBQ0YsT0FBTztRQUNQLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQVMsZUFBZTtRQUN0QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsaywgeyBDaGFsayB9IGZyb20gJ2NoYWxrJztcclxuXHJcbmxldCBsYXN0TWVzc2FnZUlubGluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5sZXQgbGFzdENvbnRleHQ6IHN0cmluZztcclxuXHJcbmNvbnN0IGJnQ29sb3JzOiBBcnJheTxrZXlvZiBDaGFsaz4gPSBbXHJcbiAgLy8gXCJiZ0JsYWNrXCIsXHJcbiAgJ2JnUmVkJyxcclxuICAnYmdHcmVlbicsXHJcbiAgJ2JnWWVsbG93JyxcclxuICAnYmdCbHVlJyxcclxuICAnYmdNYWdlbnRhJyxcclxuICAnYmdDeWFuJyxcclxuICAvLyBcImJnV2hpdGVcIixcclxuICAvLyBcImJnQmxhY2tCcmlnaHRcIixcclxuICAvLyBcImJnUmVkQnJpZ2h0XCIsXHJcbiAgLy8gXCJiZ0dyZWVuQnJpZ2h0XCIsXHJcbiAgLy8gXCJiZ1llbGxvd0JyaWdodFwiLFxyXG4gIC8vIFwiYmdCbHVlQnJpZ2h0XCIsXHJcbiAgLy8gXCJiZ01hZ2VudGFCcmlnaHRcIixcclxuICAvLyBcImJnQ3lhbkJyaWdodFwiLFxyXG4gIC8vIFwiYmdXaGl0ZUJyaWdodFwiLFxyXG5dO1xyXG5sZXQgbGFzdENvbG9yOiBudW1iZXIgPSAwO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU91dChjb250ZXh0OiBzdHJpbmcsIGNvbG9yPzoga2V5b2YgQ2hhbGspOiB7IGxvZzogKC4uLm1zZzogYW55W10pID0+IHZvaWQ7IHdyaXRlOiAoLi4ubXNnOiBhbnlbXSkgPT4gdm9pZCB9IHtcclxuICBpZiAoIWNvbG9yKSB7XHJcbiAgICBjb2xvciA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XHJcbiAgICBsYXN0Q29sb3IgKz0gMTtcclxuICAgIGlmIChsYXN0Q29sb3IgPj0gYmdDb2xvcnMubGVuZ3RoKSB7XHJcbiAgICAgIGxhc3RDb2xvciA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB7IGxvZzogY3JlYXRlTG9nKGNvbnRleHQsIGNvbG9yKSwgd3JpdGU6IGNyZWF0ZVdyaXRlKGNvbnRleHQsIGNvbG9yKSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9nKGNvbnRleHQ6IHN0cmluZywgY29sb3I/OiBrZXlvZiBDaGFsayk6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkIHtcclxuICBpZiAoIWNvbG9yKSB7XHJcbiAgICBjb2xvciA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XHJcbiAgICBsYXN0Q29sb3IgKz0gMTtcclxuICAgIGlmIChsYXN0Q29sb3IgPj0gYmdDb2xvcnMubGVuZ3RoKSB7XHJcbiAgICAgIGxhc3RDb2xvciA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIEB0cy1pZ25vcmVcclxuICBjb25zdCBjaGFsa0NvbG9yRm46IENoYWxrID0gY2hhbGtbY29sb3JdO1xyXG5cclxuICByZXR1cm4gKC4uLm1zZzogYW55W10pOiB2b2lkID0+IHtcclxuICAgIG1zZyA9IG1zZy5tYXAocHJlcElmSnNvbik7XHJcblxyXG4gICAgLy8gaWYgKGxhc3RDb250ZXh0ICE9PSBjb250ZXh0KSB7XHJcbiAgICAvLyAgIGNyZWF0ZUVtcHR5TGluZSgpO1xyXG4gICAgLy8gfVxyXG4gICAgaWYgKGxhc3RNZXNzYWdlSW5saW5lKSB7XHJcbiAgICAgIGNyZWF0ZUVtcHR5TGluZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW2NoYWxrQ29sb3JGbihgJHtjb250ZXh0fTpgKSwgLi4ubXNnXTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcclxuICAgIGxhc3RNZXNzYWdlSW5saW5lID0gZmFsc2U7XHJcbiAgICBsYXN0Q29udGV4dCA9IGNvbnRleHQ7XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdyaXRlKGNvbnRleHQ6IHN0cmluZywgY29sb3I/OiBrZXlvZiBDaGFsayk6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkIHtcclxuICBpZiAoIWNvbG9yKSB7XHJcbiAgICBjb2xvciA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XHJcbiAgICBsYXN0Q29sb3IgKz0gMTtcclxuICAgIGlmIChsYXN0Q29sb3IgPj0gYmdDb2xvcnMubGVuZ3RoKSB7XHJcbiAgICAgIGxhc3RDb2xvciA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIEB0cy1pZ25vcmVcclxuICBjb25zdCBjaGFsa0NvbG9yRm46IENoYWxrID0gY2hhbGtbY29sb3JdO1xyXG5cclxuICByZXR1cm4gKC4uLm1zZzogYW55W10pOiB2b2lkID0+IHtcclxuICAgIGlmICghbGFzdE1lc3NhZ2VJbmxpbmUpIHtcclxuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2hhbGtDb2xvckZuKGAke2NvbnRleHR9OmApICsgJyAnKTtcclxuICAgIH1cclxuICAgIGlmIChsYXN0TWVzc2FnZUlubGluZSAmJiBsYXN0Q29udGV4dCAhPT0gY29udGV4dCkge1xyXG4gICAgICBjcmVhdGVFbXB0eUxpbmUoKTtcclxuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2hhbGtDb2xvckZuKGAke2NvbnRleHR9OmApICsgJyAnKTtcclxuICAgIH1cclxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKG1zZy5qb2luKCcgJykpO1xyXG4gICAgbGFzdE1lc3NhZ2VJbmxpbmUgPSB0cnVlO1xyXG4gICAgbGFzdENvbnRleHQgPSBjb250ZXh0O1xyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUaHJvd0Vycm9yKGNvbnRleHQ6IHN0cmluZyk6ICh0eXBlOiBzdHJpbmcsIC4uLm1zZzogYW55W10pID0+IHZvaWQge1xyXG4gIGNvbnN0IGNvbG9yOiBrZXlvZiBDaGFsayA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XHJcbiAgbGFzdENvbG9yICs9IDE7XHJcbiAgaWYgKGxhc3RDb2xvciA+PSBiZ0NvbG9ycy5sZW5ndGgpIHtcclxuICAgIGxhc3RDb2xvciA9IDA7XHJcbiAgfVxyXG4gIC8vIEB0cy1pZ25vcmVcclxuICBjb25zdCBjaGFsa0NvbG9yRm46IENoYWxrID0gY2hhbGtbY29sb3JdO1xyXG5cclxuICByZXR1cm4gKHR5cGU6IHN0cmluZywgLi4ubXNnOiBhbnlbXSk6IHZvaWQgPT4ge1xyXG4gICAgY29uc29sZS5sb2coY2hhbGtDb2xvckZuKGAke2NvbnRleHR9OmApLCBjaGFsay5yZWQoYCR7dHlwZX0gRXJyb3I6YCksIC4uLm1zZyk7XHJcbiAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlcElmSnNvbih0OiBhbnkpOiBFcnJvciB8IHN0cmluZyB7XHJcbiAgaWYgKHQgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgcmV0dXJuIHQ7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgdCA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHQgPSBKU09OLnBhcnNlKHQpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAvKiBubyBlbXB0eSAqL1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAodHlwZW9mIHQgPT09ICdvYmplY3QnKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0ID0gSlNPTi5zdHJpbmdpZnkodCwgbnVsbCwgNCk7XHJcbiAgICAgIHQgPSBjb2xvcml6ZUpzb25TdHJpbmcodCk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIC8qIG5vIGVtcHR5ICovXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb2xvcml6ZUpzb25TdHJpbmcoanNvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAvLyBTdHJpbmdzXHJcbiAganNvbiA9IGpzb24ucmVwbGFjZShcclxuICAgIC8oXFxzKykoXCJbXlwiXSpcIikoLD9bXFxyXFxuXSkvZ2ksXHJcbiAgICBgJDEke2NoYWxrLnllbGxvdygnJDInKX0kM2AsXHJcbiAgKTtcclxuICAvLyBib29sZWFucywgbnVtYmVycywgZXRjLlxyXG4gIGpzb24gPSBqc29uLnJlcGxhY2UoXHJcbiAgICAvKFxccyspKFteXCJbe1xcXX1dW15bXFxde31cIlxcblxccixdKikoLD9bXFxyXFxuXSkvZ2ksXHJcbiAgICBgJDEke2NoYWxrLmN5YW4oJyQyJyl9JDNgLFxyXG4gICk7XHJcbiAgLy8gS2V5c1xyXG4gIGpzb24gPSBqc29uLnJlcGxhY2UoLyhcIlteXCJdKlwiKTovZ2ksIGAke2NoYWxrLm1hZ2VudGEoJyQxJyl9OmApO1xyXG4gIHJldHVybiBqc29uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFbXB0eUxpbmUoKTogdm9pZCB7XHJcbiAgY29uc29sZS5sb2coKTtcclxufVxyXG4iXX0=