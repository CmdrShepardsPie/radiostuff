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
        define(["require", "exports", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var chalk_1 = require("chalk");
    var lastMessageInline = false;
    var lastContext;
    var bgColors = [
        // "bgBlack",
        "bgRed",
        "bgGreen",
        "bgYellow",
        "bgBlue",
        "bgMagenta",
        "bgCyan",
    ];
    var lastColor = 0;
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
        var chalkColorFn = chalk_1["default"][color];
        return function () {
            var msg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                msg[_i] = arguments[_i];
            }
            msg = msg.map(prepIfJson);
            // if (lastContext !== context) {
            //   createEmptyLine();
            // }
            if (lastMessageInline) {
                createEmptyLine();
            }
            var args = __spread([chalkColorFn(context + ":")], msg);
            console.log.apply(console, __spread(args));
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
        var chalkColorFn = chalk_1["default"][color];
        return function () {
            var msg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                msg[_i] = arguments[_i];
            }
            if (!lastMessageInline) {
                process.stdout.write(chalkColorFn(context + ":") + " ");
            }
            if (lastMessageInline && lastContext !== context) {
                createEmptyLine();
                process.stdout.write(chalkColorFn(context + ":") + " ");
            }
            process.stdout.write(msg.join(" "));
            lastMessageInline = true;
            lastContext = context;
        };
    }
    exports.createWrite = createWrite;
    function createThrowError(context) {
        var color = bgColors[lastColor];
        lastColor += 1;
        if (lastColor >= bgColors.length) {
            lastColor = 0;
        }
        // @ts-ignore
        var chalkColorFn = chalk_1["default"][color];
        return function (type) {
            var msg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                msg[_i - 1] = arguments[_i];
            }
            console.log.apply(console, __spread([chalkColorFn(context + ":"), chalk_1["default"].red(type + " Error:")], msg));
            process.exit(1);
        };
    }
    exports.createThrowError = createThrowError;
    function prepIfJson(t) {
        if (t instanceof Error) {
            return t;
        }
        if (typeof t === "string") {
            try {
                t = JSON.parse(t);
            }
            catch (e) {
                /* no empty */
            }
        }
        if (typeof t === "object") {
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
        json = json.replace(/(\s+)("[^"]*")(,?[\r\n])/gi, "$1" + chalk_1["default"].yellow("$2") + "$3");
        // booleans, numbers, etc.
        json = json.replace(/(\s+)([^"[{\]}][^[\]{}"\n\r,]*)(,?[\r\n])/gi, "$1" + chalk_1["default"].cyan("$2") + "$3");
        // Keys
        json = json.replace(/("[^"]*"):/gi, chalk_1["default"].magenta("$1") + ":");
        return json;
    }
    function createEmptyLine() {
        console.log();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9sb2ctaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsK0JBQTBCO0lBRTFCLElBQUksaUJBQWlCLEdBQVksS0FBSyxDQUFDO0lBQ3ZDLElBQUksV0FBbUIsQ0FBQztJQUV4QixJQUFNLFFBQVEsR0FBRztRQUNmLGFBQWE7UUFDYixPQUFPO1FBQ1AsU0FBUztRQUNULFVBQVU7UUFDVixRQUFRO1FBQ1IsV0FBVztRQUNYLFFBQVE7S0FVVCxDQUFDO0lBQ0YsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRWxCLFNBQWdCLFNBQVMsQ0FBQyxPQUFlLEVBQUUsS0FBYztRQUN2RCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QixTQUFTLElBQUksQ0FBQyxDQUFDO1lBQ2YsSUFBSSxTQUFTLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDaEMsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUNmO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUNoRixDQUFDO0lBVEQsOEJBU0M7SUFFRCxTQUFnQixTQUFTLENBQUMsT0FBZSxFQUFFLEtBQWM7UUFDdkQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUIsU0FBUyxJQUFJLENBQUMsQ0FBQztZQUNmLElBQUksU0FBUyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDZjtTQUNGO1FBQ0Qs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VjtRQUNELElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3pCLElBQUk7Z0JBQ0YsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkI7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixjQUFjO2FBQ2Y7U0FDRjtRQUNELElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3pCLElBQUk7Z0JBQ0YsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsY0FBYzthQUNmO1NBQ0Y7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxTQUFTLGtCQUFrQixDQUFDLElBQVk7UUFDdEMsVUFBVTtRQUNWLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUNqQiw0QkFBNEIsRUFDNUIsT0FBSyxrQkFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBSSxDQUM1QixDQUFDO1FBQ0YsMEJBQTBCO1FBQzFCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUNqQiw2Q0FBNkMsRUFDN0MsT0FBSyxrQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBSSxDQUMxQixDQUFDO1FBQ0YsT0FBTztRQUNQLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBSyxrQkFBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFDLENBQUM7UUFDL0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsU0FBUyxlQUFlO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuXG5sZXQgbGFzdE1lc3NhZ2VJbmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcbmxldCBsYXN0Q29udGV4dDogc3RyaW5nO1xuXG5jb25zdCBiZ0NvbG9ycyA9IFtcbiAgLy8gXCJiZ0JsYWNrXCIsXG4gIFwiYmdSZWRcIixcbiAgXCJiZ0dyZWVuXCIsXG4gIFwiYmdZZWxsb3dcIixcbiAgXCJiZ0JsdWVcIixcbiAgXCJiZ01hZ2VudGFcIixcbiAgXCJiZ0N5YW5cIixcbiAgLy8gXCJiZ1doaXRlXCIsXG4gIC8vIFwiYmdCbGFja0JyaWdodFwiLFxuICAvLyBcImJnUmVkQnJpZ2h0XCIsXG4gIC8vIFwiYmdHcmVlbkJyaWdodFwiLFxuICAvLyBcImJnWWVsbG93QnJpZ2h0XCIsXG4gIC8vIFwiYmdCbHVlQnJpZ2h0XCIsXG4gIC8vIFwiYmdNYWdlbnRhQnJpZ2h0XCIsXG4gIC8vIFwiYmdDeWFuQnJpZ2h0XCIsXG4gIC8vIFwiYmdXaGl0ZUJyaWdodFwiLFxuXTtcbmxldCBsYXN0Q29sb3IgPSAwO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlT3V0KGNvbnRleHQ6IHN0cmluZywgY29sb3I/OiBzdHJpbmcpIHtcbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbG9yID0gYmdDb2xvcnNbbGFzdENvbG9yXTtcbiAgICBsYXN0Q29sb3IgKz0gMTtcbiAgICBpZiAobGFzdENvbG9yID49IGJnQ29sb3JzLmxlbmd0aCkge1xuICAgICAgbGFzdENvbG9yID0gMDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgbG9nOiBjcmVhdGVMb2coY29udGV4dCwgY29sb3IpLCB3cml0ZTogY3JlYXRlV3JpdGUoY29udGV4dCwgY29sb3IpIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2coY29udGV4dDogc3RyaW5nLCBjb2xvcj86IHN0cmluZykge1xuICBpZiAoIWNvbG9yKSB7XG4gICAgY29sb3IgPSBiZ0NvbG9yc1tsYXN0Q29sb3JdO1xuICAgIGxhc3RDb2xvciArPSAxO1xuICAgIGlmIChsYXN0Q29sb3IgPj0gYmdDb2xvcnMubGVuZ3RoKSB7XG4gICAgICBsYXN0Q29sb3IgPSAwO1xuICAgIH1cbiAgfVxuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IGNoYWxrQ29sb3JGbiA9IGNoYWxrW2NvbG9yXTtcblxuICByZXR1cm4gKC4uLm1zZzogYW55W10pID0+IHtcbiAgICBtc2cgPSBtc2cubWFwKHByZXBJZkpzb24pO1xuXG4gICAgLy8gaWYgKGxhc3RDb250ZXh0ICE9PSBjb250ZXh0KSB7XG4gICAgLy8gICBjcmVhdGVFbXB0eUxpbmUoKTtcbiAgICAvLyB9XG4gICAgaWYgKGxhc3RNZXNzYWdlSW5saW5lKSB7XG4gICAgICBjcmVhdGVFbXB0eUxpbmUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcmdzID0gWyBjaGFsa0NvbG9yRm4oYCR7Y29udGV4dH06YCksIC4uLm1zZyBdO1xuXG4gICAgY29uc29sZS5sb2coLi4uYXJncyk7XG4gICAgbGFzdE1lc3NhZ2VJbmxpbmUgPSBmYWxzZTtcbiAgICBsYXN0Q29udGV4dCA9IGNvbnRleHQ7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXcml0ZShjb250ZXh0OiBzdHJpbmcsIGNvbG9yPzogc3RyaW5nKSB7XG4gIGlmICghY29sb3IpIHtcbiAgICBjb2xvciA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XG4gICAgbGFzdENvbG9yICs9IDE7XG4gICAgaWYgKGxhc3RDb2xvciA+PSBiZ0NvbG9ycy5sZW5ndGgpIHtcbiAgICAgIGxhc3RDb2xvciA9IDA7XG4gICAgfVxuICB9XG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgY2hhbGtDb2xvckZuID0gY2hhbGtbY29sb3JdO1xuXG4gIHJldHVybiAoLi4ubXNnOiBhbnlbXSkgPT4ge1xuICAgIGlmICghbGFzdE1lc3NhZ2VJbmxpbmUpIHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNoYWxrQ29sb3JGbihgJHtjb250ZXh0fTpgKSArIFwiIFwiKTtcbiAgICB9XG4gICAgaWYgKGxhc3RNZXNzYWdlSW5saW5lICYmIGxhc3RDb250ZXh0ICE9PSBjb250ZXh0KSB7XG4gICAgICBjcmVhdGVFbXB0eUxpbmUoKTtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNoYWxrQ29sb3JGbihgJHtjb250ZXh0fTpgKSArIFwiIFwiKTtcbiAgICB9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUobXNnLmpvaW4oXCIgXCIpKTtcbiAgICBsYXN0TWVzc2FnZUlubGluZSA9IHRydWU7XG4gICAgbGFzdENvbnRleHQgPSBjb250ZXh0O1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGhyb3dFcnJvcihjb250ZXh0OiBzdHJpbmcpIHtcbiAgY29uc3QgY29sb3IgPSBiZ0NvbG9yc1tsYXN0Q29sb3JdO1xuICBsYXN0Q29sb3IgKz0gMTtcbiAgaWYgKGxhc3RDb2xvciA+PSBiZ0NvbG9ycy5sZW5ndGgpIHtcbiAgICBsYXN0Q29sb3IgPSAwO1xuICB9XG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgY2hhbGtDb2xvckZuID0gY2hhbGtbY29sb3JdO1xuXG4gIHJldHVybiAodHlwZTogc3RyaW5nLCAuLi5tc2c6IGFueVtdKSA9PiB7XG4gICAgY29uc29sZS5sb2coY2hhbGtDb2xvckZuKGAke2NvbnRleHR9OmApLCBjaGFsay5yZWQoYCR7dHlwZX0gRXJyb3I6YCksIC4uLm1zZyk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcmVwSWZKc29uKHQ6IGFueSk6IGFueSB7XG4gIGlmICh0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gdDtcbiAgfVxuICBpZiAodHlwZW9mIHQgPT09IFwic3RyaW5nXCIpIHtcbiAgICB0cnkge1xuICAgICAgdCA9IEpTT04ucGFyc2UodCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLyogbm8gZW1wdHkgKi9cbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiB0ID09PSBcIm9iamVjdFwiKSB7XG4gICAgdHJ5IHtcbiAgICAgIHQgPSBKU09OLnN0cmluZ2lmeSh0LCBudWxsLCA0KTtcbiAgICAgIHQgPSBjb2xvcml6ZUpzb25TdHJpbmcodCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLyogbm8gZW1wdHkgKi9cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHQ7XG59XG5cbmZ1bmN0aW9uIGNvbG9yaXplSnNvblN0cmluZyhqc29uOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBTdHJpbmdzXG4gIGpzb24gPSBqc29uLnJlcGxhY2UoXG4gICAgLyhcXHMrKShcIlteXCJdKlwiKSgsP1tcXHJcXG5dKS9naSxcbiAgICBgJDEke2NoYWxrLnllbGxvdyhcIiQyXCIpfSQzYCxcbiAgKTtcbiAgLy8gYm9vbGVhbnMsIG51bWJlcnMsIGV0Yy5cbiAganNvbiA9IGpzb24ucmVwbGFjZShcbiAgICAvKFxccyspKFteXCJbe1xcXX1dW15bXFxde31cIlxcblxccixdKikoLD9bXFxyXFxuXSkvZ2ksXG4gICAgYCQxJHtjaGFsay5jeWFuKFwiJDJcIil9JDNgLFxuICApO1xuICAvLyBLZXlzXG4gIGpzb24gPSBqc29uLnJlcGxhY2UoLyhcIlteXCJdKlwiKTovZ2ksIGAke2NoYWxrLm1hZ2VudGEoXCIkMVwiKX06YCk7XG4gIHJldHVybiBqc29uO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbXB0eUxpbmUoKSB7XG4gIGNvbnNvbGUubG9nKCk7XG59XG4iXX0=