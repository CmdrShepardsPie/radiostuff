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
        const value = getText(el);
        const num = getNumber(value);
        return !isNaN(num) ? num : value;
    }
    exports.getTextOrNumber = getTextOrNumber;
    function getNumber(text, reg = /^([-+]?\d+\.?\d*)$/) {
        let result = NaN;
        if (text && text.match) {
            const match = text.match(text);
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
            let text = el.innerHTML;
            if (text) {
                text = text.replace(/<script>.*<\/script>/g, ' ');
                text = text.replace(/<[^>]*>/g, ' ');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NjcmlwdHMvbW9kdWxlcy9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxTQUFnQixlQUFlLENBQUMsRUFBVztRQUN6QyxNQUFNLEtBQUssR0FBVyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQVcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ25DLENBQUM7SUFKRCwwQ0FJQztJQUVELFNBQWdCLFNBQVMsQ0FBQyxJQUFZLEVBQUUsTUFBYyxvQkFBb0I7UUFDeEUsSUFBSSxNQUFNLEdBQVcsR0FBRyxDQUFDO1FBQ3pCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdEIsTUFBTSxLQUFLLEdBQTRCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQsK0JBQStCO1lBQy9CLElBQUksS0FBSyxFQUFFO2dCQUNULE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0I7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFWRCw4QkFVQztJQUVELFNBQWdCLE9BQU8sQ0FBQyxFQUFXO1FBQ2pDLElBQUksRUFBRSxFQUFFO1lBQ04sSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNoQyxJQUFJLElBQUksRUFBRTtnQkFDUixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQjtTQUNGO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBVkQsMEJBVUM7SUFFRCxTQUFnQixNQUFNLENBQUMsR0FBVztRQUNoQyxRQUFRLEdBQUcsRUFBRTtZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztTQUNaO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBcEJELHdCQW9CQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBnZXRUZXh0T3JOdW1iZXIoZWw6IEVsZW1lbnQpOiBudW1iZXIgfCBzdHJpbmcge1xuICBjb25zdCB2YWx1ZTogc3RyaW5nID0gZ2V0VGV4dChlbCk7XG4gIGNvbnN0IG51bTogbnVtYmVyID0gZ2V0TnVtYmVyKHZhbHVlKTtcbiAgcmV0dXJuICFpc05hTihudW0pID8gbnVtIDogdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1iZXIodGV4dDogc3RyaW5nLCByZWc6IFJlZ0V4cCA9IC9eKFstK10/XFxkK1xcLj9cXGQqKSQvKTogbnVtYmVyIHtcbiAgbGV0IHJlc3VsdDogbnVtYmVyID0gTmFOO1xuICBpZiAodGV4dCAmJiB0ZXh0Lm1hdGNoKSB7XG4gICAgY29uc3QgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gdGV4dC5tYXRjaCh0ZXh0KTtcbiAgICAvLyBjb25zb2xlLmxvZygnbWF0Y2gnLCBtYXRjaCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXN1bHQgPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRleHQoZWw6IEVsZW1lbnQpOiBzdHJpbmcge1xuICBpZiAoZWwpIHtcbiAgICBsZXQgdGV4dDogc3RyaW5nID0gZWwuaW5uZXJIVE1MO1xuICAgIGlmICh0ZXh0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC88c2NyaXB0Pi4qPFxcL3NjcmlwdD4vZywgJyAnKTtcbiAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLzxbXj5dKj4vZywgJyAnKTtcbiAgICAgIHJldHVybiB0ZXh0LnRyaW0oKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlyKGRpcjogc3RyaW5nKTogbnVtYmVyIHtcbiAgc3dpdGNoIChkaXIpIHtcbiAgICBjYXNlICdOJzpcbiAgICAgIHJldHVybiAxO1xuICAgIGNhc2UgJ05FJzpcbiAgICAgIHJldHVybiAyO1xuICAgIGNhc2UgJ0UnOlxuICAgICAgcmV0dXJuIDM7XG4gICAgY2FzZSAnU0UnOlxuICAgICAgcmV0dXJuIDQ7XG4gICAgY2FzZSAnUyc6XG4gICAgICByZXR1cm4gNTtcbiAgICBjYXNlICdTVyc6XG4gICAgICByZXR1cm4gNjtcbiAgICBjYXNlICdXJzpcbiAgICAgIHJldHVybiA3O1xuICAgIGNhc2UgJ05XJzpcbiAgICAgIHJldHVybiA4O1xuICB9XG4gIHJldHVybiAwO1xufVxuIl19