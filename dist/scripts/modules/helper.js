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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NjcmlwdHMvbW9kdWxlcy9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxTQUFnQixlQUFlLENBQUMsRUFBVztRQUN6QyxNQUFNLEtBQUssR0FBVyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQVcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ25DLENBQUM7SUFKRCwwQ0FJQztJQUVELFNBQWdCLFNBQVMsQ0FBQyxJQUFZLEVBQUUsTUFBYyxvQkFBb0I7UUFDeEUsSUFBSSxNQUFNLEdBQVcsR0FBRyxDQUFDO1FBQ3pCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdEIsTUFBTSxLQUFLLEdBQTRCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQsK0JBQStCO1lBQy9CLElBQUksS0FBSyxFQUFFO2dCQUNULE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0I7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFWRCw4QkFVQztJQUVELFNBQWdCLE9BQU8sQ0FBQyxFQUFXO1FBQ2pDLElBQUksRUFBRSxFQUFFO1lBQ04sSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNoQyxJQUFJLElBQUksRUFBRTtnQkFDUixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQjtTQUNGO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBVkQsMEJBVUM7SUFFRCxTQUFnQixNQUFNLENBQUMsR0FBVztRQUNoQyxRQUFRLEdBQUcsRUFBRTtZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsQ0FBQztZQUNYLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsQ0FBQztTQUNaO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBcEJELHdCQW9CQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBnZXRUZXh0T3JOdW1iZXIoZWw6IEVsZW1lbnQpOiBudW1iZXIgfCBzdHJpbmcge1xyXG4gIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSBnZXRUZXh0KGVsKTtcclxuICBjb25zdCBudW06IG51bWJlciA9IGdldE51bWJlcih2YWx1ZSk7XHJcbiAgcmV0dXJuICFpc05hTihudW0pID8gbnVtIDogdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1iZXIodGV4dDogc3RyaW5nLCByZWc6IFJlZ0V4cCA9IC9eKFstK10/XFxkK1xcLj9cXGQqKSQvKTogbnVtYmVyIHtcclxuICBsZXQgcmVzdWx0OiBudW1iZXIgPSBOYU47XHJcbiAgaWYgKHRleHQgJiYgdGV4dC5tYXRjaCkge1xyXG4gICAgY29uc3QgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gdGV4dC5tYXRjaCh0ZXh0KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdtYXRjaCcsIG1hdGNoKTtcclxuICAgIGlmIChtYXRjaCkge1xyXG4gICAgICByZXN1bHQgPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRleHQoZWw6IEVsZW1lbnQpOiBzdHJpbmcge1xyXG4gIGlmIChlbCkge1xyXG4gICAgbGV0IHRleHQ6IHN0cmluZyA9IGVsLmlubmVySFRNTDtcclxuICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLzxzY3JpcHQ+Lio8XFwvc2NyaXB0Pi9nLCAnICcpO1xyXG4gICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC88W14+XSo+L2csICcgJyk7XHJcbiAgICAgIHJldHVybiB0ZXh0LnRyaW0oKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuICcnO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlyKGRpcjogc3RyaW5nKTogbnVtYmVyIHtcclxuICBzd2l0Y2ggKGRpcikge1xyXG4gICAgY2FzZSAnTic6XHJcbiAgICAgIHJldHVybiAxO1xyXG4gICAgY2FzZSAnTkUnOlxyXG4gICAgICByZXR1cm4gMjtcclxuICAgIGNhc2UgJ0UnOlxyXG4gICAgICByZXR1cm4gMztcclxuICAgIGNhc2UgJ1NFJzpcclxuICAgICAgcmV0dXJuIDQ7XHJcbiAgICBjYXNlICdTJzpcclxuICAgICAgcmV0dXJuIDU7XHJcbiAgICBjYXNlICdTVyc6XHJcbiAgICAgIHJldHVybiA2O1xyXG4gICAgY2FzZSAnVyc6XHJcbiAgICAgIHJldHVybiA3O1xyXG4gICAgY2FzZSAnTlcnOlxyXG4gICAgICByZXR1cm4gODtcclxuICB9XHJcbiAgcmV0dXJuIDA7XHJcbn1cclxuIl19