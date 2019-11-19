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
    var RepeaterUse;
    (function (RepeaterUse) {
        RepeaterUse["Open"] = "Open";
        RepeaterUse["Closed"] = "Closed";
        RepeaterUse["Private"] = "Private";
        RepeaterUse["Other"] = "Other";
    })(RepeaterUse = exports.RepeaterUse || (exports.RepeaterUse = {}));
    var RepeaterStatus;
    (function (RepeaterStatus) {
        RepeaterStatus["OnAir"] = "On-Air";
        RepeaterStatus["OffAir"] = "Off-Air";
        RepeaterStatus["Testing"] = "Testing";
        RepeaterStatus["Unknown"] = "Unknown";
        RepeaterStatus["Other"] = "Other";
    })(RepeaterStatus = exports.RepeaterStatus || (exports.RepeaterStatus = {}));
    var EchoLinkNodeStatus;
    (function (EchoLinkNodeStatus) {
        EchoLinkNodeStatus["OnIdle"] = "ON - IDLE";
        EchoLinkNodeStatus["NodeOffline"] = "Node Offline";
    })(EchoLinkNodeStatus = exports.EchoLinkNodeStatus || (exports.EchoLinkNodeStatus = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaS1yZXBlYXRlci1zdHJ1Y3R1cmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZXMvaS1yZXBlYXRlci1zdHJ1Y3R1cmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBZ0JBLElBQVksV0FLWDtJQUxELFdBQVksV0FBVztRQUNyQiw0QkFBYSxDQUFBO1FBQ2IsZ0NBQWlCLENBQUE7UUFDakIsa0NBQW1CLENBQUE7UUFDbkIsOEJBQWUsQ0FBQTtJQUNqQixDQUFDLEVBTFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFLdEI7SUFFRCxJQUFZLGNBTVg7SUFORCxXQUFZLGNBQWM7UUFDeEIsa0NBQWdCLENBQUE7UUFDaEIsb0NBQWtCLENBQUE7UUFDbEIscUNBQW1CLENBQUE7UUFDbkIscUNBQW1CLENBQUE7UUFDbkIsaUNBQWUsQ0FBQTtJQUNqQixDQUFDLEVBTlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFNekI7SUFFRCxJQUFZLGtCQUdYO0lBSEQsV0FBWSxrQkFBa0I7UUFDNUIsMENBQW9CLENBQUE7UUFDcEIsa0RBQTRCLENBQUE7SUFDOUIsQ0FBQyxFQUhXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBRzdCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUmVwZWF0ZXJTdHJ1Y3R1cmVkIHtcbiAgSUQ6IG51bWJlcjtcbiAgU3RhdGVJRDogbnVtYmVyO1xuICBDYWxsc2lnbjogc3RyaW5nO1xuICAvLyBOYW1lOiBzdHJpbmc7XG4gIExvY2F0aW9uOiB7IExhdGl0dWRlOiBudW1iZXI7IExvbmdpdHVkZTogbnVtYmVyOyBDb3VudHk6IHN0cmluZzsgU3RhdGU6IHN0cmluZzsgTG9jYWw6IHN0cmluZywgRGlzdGFuY2U/OiBudW1iZXIgfTtcbiAgVXNlOiBSZXBlYXRlclVzZTtcbiAgU3RhdHVzOiBSZXBlYXRlclN0YXR1cztcbiAgRnJlcXVlbmN5OiB7IElucHV0OiBudW1iZXI7IE91dHB1dDogbnVtYmVyIH07XG4gIFNxdWVsY2hUb25lPzogeyBJbnB1dD86IG51bWJlcjsgT3V0cHV0PzogbnVtYmVyIH07XG4gIERpZ2l0YWxUb25lPzogeyBJbnB1dD86IG51bWJlcjsgT3V0cHV0PzogbnVtYmVyIH07XG4gIERpZ2l0YWw/OiBJUmVwZWF0ZXJEaWdpdGFsTW9kZXM7XG4gIFZPSVA/OiBJUmVwZWF0ZXJWT0lQTW9kZXM7XG4gIC8vIENvbW1lbnQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gUmVwZWF0ZXJVc2Uge1xuICBPcGVuID0gJ09wZW4nLFxuICBDbG9zZWQgPSAnQ2xvc2VkJyxcbiAgUHJpdmF0ZSA9ICdQcml2YXRlJyxcbiAgT3RoZXIgPSAnT3RoZXInLFxufVxuXG5leHBvcnQgZW51bSBSZXBlYXRlclN0YXR1cyB7XG4gIE9uQWlyID0gJ09uLUFpcicsXG4gIE9mZkFpciA9ICdPZmYtQWlyJyxcbiAgVGVzdGluZyA9ICdUZXN0aW5nJyxcbiAgVW5rbm93biA9ICdVbmtub3duJyxcbiAgT3RoZXIgPSAnT3RoZXInLFxufVxuXG5leHBvcnQgZW51bSBFY2hvTGlua05vZGVTdGF0dXMge1xuICBPbklkbGUgPSAnT04gLSBJRExFJyxcbiAgTm9kZU9mZmxpbmUgPSAnTm9kZSBPZmZsaW5lJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVwZWF0ZXJEaWdpdGFsTW9kZXMge1xuICBBVFY/OiBib29sZWFuO1xuICBETVI/OiB7IENvbG9yQ29kZT86IG51bWJlcjsgSUQ/OiBudW1iZXIgfTtcbiAgUDI1PzogeyBOQUM/OiBudW1iZXI7IH07XG4gIERTdGFyPzogeyBOb2RlPzogc3RyaW5nOyB9O1xuICBZU0Y/OiB7IEdyb3VwSUQ/OiB7IElucHV0Pzogc3RyaW5nOyBPdXRwdXQ/OiBzdHJpbmcgfTsgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVwZWF0ZXJWT0lQTW9kZXMge1xuICBBbGxTdGFyPzogeyBOb2RlSUQ/OiBudW1iZXI7IH07XG4gIEVjaG9MaW5rPzogeyBOb2RlSUQ/OiBudW1iZXI7IENhbGw/OiBzdHJpbmc7IFN0YXR1cz86IEVjaG9MaW5rTm9kZVN0YXR1cyB9O1xuICBJUkxQPzogeyBOb2RlSUQ/OiBudW1iZXI7IH07XG4gIFdpcmVzPzogeyBJRD86IG51bWJlcjsgfTtcbn1cbiJdfQ==