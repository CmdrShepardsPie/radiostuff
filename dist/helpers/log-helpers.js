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
    Object.defineProperty(exports, "__esModule", { value: true });
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
        var chalkColorFn = chalk_1.default[color];
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
        var chalkColorFn = chalk_1.default[color];
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
        var chalkColorFn = chalk_1.default[color];
        return function (type) {
            var msg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                msg[_i - 1] = arguments[_i];
            }
            console.log.apply(console, __spread([chalkColorFn(context + ":"), chalk_1.default.red(type + " Error:")], msg));
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
        json = json.replace(/(\s+)("[^"]*")(,?[\r\n])/gi, "$1" + chalk_1.default.yellow("$2") + "$3");
        // booleans, numbers, etc.
        json = json.replace(/(\s+)([^"[{\]}][^[\]{}"\n\r,]*)(,?[\r\n])/gi, "$1" + chalk_1.default.cyan("$2") + "$3");
        // Keys
        json = json.replace(/("[^"]*"):/gi, chalk_1.default.magenta("$1") + ":");
        return json;
    }
    function createEmptyLine() {
        console.log();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9sb2ctaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsK0JBQTBCO0lBRTFCLElBQUksaUJBQWlCLEdBQVksS0FBSyxDQUFDO0lBQ3ZDLElBQUksV0FBbUIsQ0FBQztJQUV4QixJQUFNLFFBQVEsR0FBRztRQUNmLGFBQWE7UUFDYixPQUFPO1FBQ1AsU0FBUztRQUNULFVBQVU7UUFDVixRQUFRO1FBQ1IsV0FBVztRQUNYLFFBQVE7S0FVVCxDQUFDO0lBQ0YsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRWxCLFNBQWdCLFNBQVMsQ0FBQyxPQUFlLEVBQUUsS0FBYztRQUN2RCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QixTQUFTLElBQUksQ0FBQyxDQUFDO1lBQ2YsSUFBSSxTQUFTLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDaEMsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUNmO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUNoRixDQUFDO0lBVEQsOEJBU0M7SUFFRCxTQUFnQixTQUFTLENBQUMsT0FBZSxFQUFFLEtBQWM7UUFDdkQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUIsU0FBUyxJQUFJLENBQUMsQ0FBQztZQUNmLElBQUksU0FBUyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDZjtTQUNGO1FBQ0Qs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Q0QsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDekIsSUFBSTtnQkFDRixDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLGNBQWM7YUFDZjtTQUNGO1FBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDekIsSUFBSTtnQkFDRixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixjQUFjO2FBQ2Y7U0FDRjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFNBQVMsa0JBQWtCLENBQUMsSUFBWTtRQUN0QyxVQUFVO1FBQ1YsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ2pCLDRCQUE0QixFQUM1QixPQUFLLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQUksQ0FDNUIsQ0FBQztRQUNGLDBCQUEwQjtRQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FDakIsNkNBQTZDLEVBQzdDLE9BQUssZUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBSSxDQUMxQixDQUFDO1FBQ0YsT0FBTztRQUNQLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBSyxlQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUMsQ0FBQztRQUMvRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLGVBQWU7UUFDdEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5cbmxldCBsYXN0TWVzc2FnZUlubGluZTogYm9vbGVhbiA9IGZhbHNlO1xubGV0IGxhc3RDb250ZXh0OiBzdHJpbmc7XG5cbmNvbnN0IGJnQ29sb3JzID0gW1xuICAvLyBcImJnQmxhY2tcIixcbiAgXCJiZ1JlZFwiLFxuICBcImJnR3JlZW5cIixcbiAgXCJiZ1llbGxvd1wiLFxuICBcImJnQmx1ZVwiLFxuICBcImJnTWFnZW50YVwiLFxuICBcImJnQ3lhblwiLFxuICAvLyBcImJnV2hpdGVcIixcbiAgLy8gXCJiZ0JsYWNrQnJpZ2h0XCIsXG4gIC8vIFwiYmdSZWRCcmlnaHRcIixcbiAgLy8gXCJiZ0dyZWVuQnJpZ2h0XCIsXG4gIC8vIFwiYmdZZWxsb3dCcmlnaHRcIixcbiAgLy8gXCJiZ0JsdWVCcmlnaHRcIixcbiAgLy8gXCJiZ01hZ2VudGFCcmlnaHRcIixcbiAgLy8gXCJiZ0N5YW5CcmlnaHRcIixcbiAgLy8gXCJiZ1doaXRlQnJpZ2h0XCIsXG5dO1xubGV0IGxhc3RDb2xvciA9IDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPdXQoY29udGV4dDogc3RyaW5nLCBjb2xvcj86IHN0cmluZykge1xuICBpZiAoIWNvbG9yKSB7XG4gICAgY29sb3IgPSBiZ0NvbG9yc1tsYXN0Q29sb3JdO1xuICAgIGxhc3RDb2xvciArPSAxO1xuICAgIGlmIChsYXN0Q29sb3IgPj0gYmdDb2xvcnMubGVuZ3RoKSB7XG4gICAgICBsYXN0Q29sb3IgPSAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBsb2c6IGNyZWF0ZUxvZyhjb250ZXh0LCBjb2xvciksIHdyaXRlOiBjcmVhdGVXcml0ZShjb250ZXh0LCBjb2xvcikgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvZyhjb250ZXh0OiBzdHJpbmcsIGNvbG9yPzogc3RyaW5nKSB7XG4gIGlmICghY29sb3IpIHtcbiAgICBjb2xvciA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XG4gICAgbGFzdENvbG9yICs9IDE7XG4gICAgaWYgKGxhc3RDb2xvciA+PSBiZ0NvbG9ycy5sZW5ndGgpIHtcbiAgICAgIGxhc3RDb2xvciA9IDA7XG4gICAgfVxuICB9XG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgY2hhbGtDb2xvckZuID0gY2hhbGtbY29sb3JdO1xuXG4gIHJldHVybiAoLi4ubXNnOiBhbnlbXSkgPT4ge1xuICAgIG1zZyA9IG1zZy5tYXAocHJlcElmSnNvbik7XG5cbiAgICAvLyBpZiAobGFzdENvbnRleHQgIT09IGNvbnRleHQpIHtcbiAgICAvLyAgIGNyZWF0ZUVtcHR5TGluZSgpO1xuICAgIC8vIH1cbiAgICBpZiAobGFzdE1lc3NhZ2VJbmxpbmUpIHtcbiAgICAgIGNyZWF0ZUVtcHR5TGluZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3MgPSBbIGNoYWxrQ29sb3JGbihgJHtjb250ZXh0fTpgKSwgLi4ubXNnIF07XG5cbiAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcbiAgICBsYXN0TWVzc2FnZUlubGluZSA9IGZhbHNlO1xuICAgIGxhc3RDb250ZXh0ID0gY29udGV4dDtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdyaXRlKGNvbnRleHQ6IHN0cmluZywgY29sb3I/OiBzdHJpbmcpIHtcbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbG9yID0gYmdDb2xvcnNbbGFzdENvbG9yXTtcbiAgICBsYXN0Q29sb3IgKz0gMTtcbiAgICBpZiAobGFzdENvbG9yID49IGJnQ29sb3JzLmxlbmd0aCkge1xuICAgICAgbGFzdENvbG9yID0gMDtcbiAgICB9XG4gIH1cbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBjaGFsa0NvbG9yRm4gPSBjaGFsa1tjb2xvcl07XG5cbiAgcmV0dXJuICguLi5tc2c6IGFueVtdKSA9PiB7XG4gICAgaWYgKCFsYXN0TWVzc2FnZUlubGluZSkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2hhbGtDb2xvckZuKGAke2NvbnRleHR9OmApICsgXCIgXCIpO1xuICAgIH1cbiAgICBpZiAobGFzdE1lc3NhZ2VJbmxpbmUgJiYgbGFzdENvbnRleHQgIT09IGNvbnRleHQpIHtcbiAgICAgIGNyZWF0ZUVtcHR5TGluZSgpO1xuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2hhbGtDb2xvckZuKGAke2NvbnRleHR9OmApICsgXCIgXCIpO1xuICAgIH1cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShtc2cuam9pbihcIiBcIikpO1xuICAgIGxhc3RNZXNzYWdlSW5saW5lID0gdHJ1ZTtcbiAgICBsYXN0Q29udGV4dCA9IGNvbnRleHQ7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUaHJvd0Vycm9yKGNvbnRleHQ6IHN0cmluZykge1xuICBjb25zdCBjb2xvciA9IGJnQ29sb3JzW2xhc3RDb2xvcl07XG4gIGxhc3RDb2xvciArPSAxO1xuICBpZiAobGFzdENvbG9yID49IGJnQ29sb3JzLmxlbmd0aCkge1xuICAgIGxhc3RDb2xvciA9IDA7XG4gIH1cbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBjaGFsa0NvbG9yRm4gPSBjaGFsa1tjb2xvcl07XG5cbiAgcmV0dXJuICh0eXBlOiBzdHJpbmcsIC4uLm1zZzogYW55W10pID0+IHtcbiAgICBjb25zb2xlLmxvZyhjaGFsa0NvbG9yRm4oYCR7Y29udGV4dH06YCksIGNoYWxrLnJlZChgJHt0eXBlfSBFcnJvcjpgKSwgLi4ubXNnKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByZXBJZkpzb24odDogYW55KTogYW55IHtcbiAgaWYgKHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiB0O1xuICB9XG4gIGlmICh0eXBlb2YgdCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHRyeSB7XG4gICAgICB0ID0gSlNPTi5wYXJzZSh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKiBubyBlbXB0eSAqL1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHQgPT09IFwib2JqZWN0XCIpIHtcbiAgICB0cnkge1xuICAgICAgdCA9IEpTT04uc3RyaW5naWZ5KHQsIG51bGwsIDQpO1xuICAgICAgdCA9IGNvbG9yaXplSnNvblN0cmluZyh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKiBubyBlbXB0eSAqL1xuICAgIH1cbiAgfVxuICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gY29sb3JpemVKc29uU3RyaW5nKGpzb246IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFN0cmluZ3NcbiAganNvbiA9IGpzb24ucmVwbGFjZShcbiAgICAvKFxccyspKFwiW15cIl0qXCIpKCw/W1xcclxcbl0pL2dpLFxuICAgIGAkMSR7Y2hhbGsueWVsbG93KFwiJDJcIil9JDNgLFxuICApO1xuICAvLyBib29sZWFucywgbnVtYmVycywgZXRjLlxuICBqc29uID0ganNvbi5yZXBsYWNlKFxuICAgIC8oXFxzKykoW15cIlt7XFxdfV1bXltcXF17fVwiXFxuXFxyLF0qKSgsP1tcXHJcXG5dKS9naSxcbiAgICBgJDEke2NoYWxrLmN5YW4oXCIkMlwiKX0kM2AsXG4gICk7XG4gIC8vIEtleXNcbiAganNvbiA9IGpzb24ucmVwbGFjZSgvKFwiW15cIl0qXCIpOi9naSwgYCR7Y2hhbGsubWFnZW50YShcIiQxXCIpfTpgKTtcbiAgcmV0dXJuIGpzb247XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVtcHR5TGluZSgpIHtcbiAgY29uc29sZS5sb2coKTtcbn1cbiJdfQ==