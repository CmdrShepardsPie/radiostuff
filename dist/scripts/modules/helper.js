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
    function getTextOrNumber(el) {
        var value = getText(el);
        var num = getNumber(value);
        return !isNaN(num) ? num : value;
    }
    exports.getTextOrNumber = getTextOrNumber;
    function getNumber(text, reg) {
        if (reg === void 0) { reg = /([-+]?\d*\.?\d*)/g; }
        var result = NaN;
        if (text && text.match) {
            var match = reg.exec(text);
            // console.log('match', match);
            if (match) {
                result = parseFloat(match[1]);
            }
        }
        return result;
    }
    exports.getNumber = getNumber;
    function getText(el) {
        if (el) {
            var text = el.innerHTML;
            if (text) {
                text = text.replace(/<script>.*<\/script>/g, " ");
                text = text.replace(/<[^>]*>/g, " ");
                return text.trim();
            }
        }
        return "";
    }
    exports.getText = getText;
    function mapDir(dir) {
        switch (dir) {
            case "N":
                return 1;
            case "NE":
                return 2;
            case "E":
                return 3;
            case "SE":
                return 4;
            case "S":
                return 5;
            case "SW":
                return 6;
            case "W":
                return 7;
            case "NW":
                return 8;
        }
        return 0;
    }
    exports.mapDir = mapDir;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NjcmlwdHMvbW9kdWxlcy9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxTQUFnQixlQUFlLENBQUMsRUFBVztRQUN6QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ25DLENBQUM7SUFKRCwwQ0FJQztJQUVELFNBQWdCLFNBQVMsQ0FBQyxJQUFZLEVBQUUsR0FBaUM7UUFBakMsb0JBQUEsRUFBQSx5QkFBaUM7UUFDdkUsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdEIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QiwrQkFBK0I7WUFDL0IsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvQjtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQVZELDhCQVVDO0lBRUQsU0FBZ0IsT0FBTyxDQUFDLEVBQVc7UUFDakMsSUFBSSxFQUFFLEVBQUU7WUFDTixJQUFJLElBQUksR0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ2hDLElBQUksSUFBSSxFQUFFO2dCQUNSLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFWRCwwQkFVQztJQUVELFNBQWdCLE1BQU0sQ0FBQyxHQUFXO1FBQ2hDLFFBQVEsR0FBRyxFQUFFO1lBQ1gsS0FBSyxHQUFHO2dCQUNOLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsS0FBSyxJQUFJO2dCQUNQLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsS0FBSyxHQUFHO2dCQUNOLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsS0FBSyxJQUFJO2dCQUNQLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsS0FBSyxHQUFHO2dCQUNOLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsS0FBSyxJQUFJO2dCQUNQLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsS0FBSyxHQUFHO2dCQUNOLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsS0FBSyxJQUFJO2dCQUNQLE9BQU8sQ0FBQyxDQUFDO1NBQ1o7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFwQkQsd0JBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdldFRleHRPck51bWJlcihlbDogRWxlbWVudCkge1xuICBjb25zdCB2YWx1ZSA9IGdldFRleHQoZWwpO1xuICBjb25zdCBudW0gPSBnZXROdW1iZXIodmFsdWUpO1xuICByZXR1cm4gIWlzTmFOKG51bSkgPyBudW0gOiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWJlcih0ZXh0OiBzdHJpbmcsIHJlZzogUmVnRXhwID0gLyhbLStdP1xcZCpcXC4/XFxkKikvZykge1xuICBsZXQgcmVzdWx0ID0gTmFOO1xuICBpZiAodGV4dCAmJiB0ZXh0Lm1hdGNoKSB7XG4gICAgY29uc3QgbWF0Y2ggPSByZWcuZXhlYyh0ZXh0KTtcbiAgICAvLyBjb25zb2xlLmxvZygnbWF0Y2gnLCBtYXRjaCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXN1bHQgPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRleHQoZWw6IEVsZW1lbnQpIHtcbiAgaWYgKGVsKSB7XG4gICAgbGV0IHRleHQ6IHN0cmluZyA9IGVsLmlubmVySFRNTDtcbiAgICBpZiAodGV4dCkge1xuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvPHNjcmlwdD4uKjxcXC9zY3JpcHQ+L2csIFwiIFwiKTtcbiAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLzxbXj5dKj4vZywgXCIgXCIpO1xuICAgICAgcmV0dXJuIHRleHQudHJpbSgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcERpcihkaXI6IHN0cmluZyk6IG51bWJlciB7XG4gIHN3aXRjaCAoZGlyKSB7XG4gICAgY2FzZSBcIk5cIjpcbiAgICAgIHJldHVybiAxO1xuICAgIGNhc2UgXCJORVwiOlxuICAgICAgcmV0dXJuIDI7XG4gICAgY2FzZSBcIkVcIjpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgXCJTRVwiOlxuICAgICAgcmV0dXJuIDQ7XG4gICAgY2FzZSBcIlNcIjpcbiAgICAgIHJldHVybiA1O1xuICAgIGNhc2UgXCJTV1wiOlxuICAgICAgcmV0dXJuIDY7XG4gICAgY2FzZSBcIldcIjpcbiAgICAgIHJldHVybiA3O1xuICAgIGNhc2UgXCJOV1wiOlxuICAgICAgcmV0dXJuIDg7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG4iXX0=