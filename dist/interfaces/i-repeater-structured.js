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
//# sourceMappingURL=i-repeater-structured.js.map