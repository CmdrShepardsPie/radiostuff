(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@interfaces/rt-systems"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Adms7Bank = exports.Adms7ClockShift = exports.Adms7Step = exports.Adms7Skip = exports.Adms7TxPower = exports.Adms7ToneMode = exports.Adms7OperatingMode = exports.Adms7OffsetDirection = exports.Adms7 = void 0;
    const rt_systems_1 = require("@interfaces/rt-systems");
    class Adms7 {
        Number = -1;
        Receive = '';
        Transmit = '';
        Offset = (0).toFixed(5);
        Direction = Adms7OffsetDirection.Off;
        Mode = Adms7OperatingMode.FM;
        Name = '';
        ToneMode = Adms7ToneMode.Off;
        CTCSS = rt_systems_1.RtSystemsCtcssTone.$100_Hz;
        DCS = rt_systems_1.RtSystemsDcsTone.$23;
        UserCTCSS = rt_systems_1.RtSystemsUserCtcss.$1500_Hz;
        Power = Adms7TxPower.High;
        Skip = Adms7Skip.Off;
        Step = Adms7Step.$5_khz;
        ClockShift = Adms7ClockShift.Off;
        Comment = '';
        Bank = Adms7Bank.A;
        constructor(adms7) {
            if (adms7) {
                Object.assign(this, adms7);
            }
        }
    }
    exports.Adms7 = Adms7;
    var Adms7OffsetDirection;
    (function (Adms7OffsetDirection) {
        Adms7OffsetDirection["Off"] = "OFF";
        Adms7OffsetDirection["Minus"] = "-RPT";
        Adms7OffsetDirection["Plus"] = "+RPT";
        Adms7OffsetDirection["Split"] = "-/+";
    })(Adms7OffsetDirection = exports.Adms7OffsetDirection || (exports.Adms7OffsetDirection = {}));
    var Adms7OperatingMode;
    (function (Adms7OperatingMode) {
        Adms7OperatingMode["FM"] = "FM";
        Adms7OperatingMode["NFM"] = "NFM";
        Adms7OperatingMode["AM"] = "AM";
    })(Adms7OperatingMode = exports.Adms7OperatingMode || (exports.Adms7OperatingMode = {}));
    var Adms7ToneMode;
    (function (Adms7ToneMode) {
        Adms7ToneMode["Off"] = "OFF";
        Adms7ToneMode["Tone_Enc"] = "TONE ENC";
        Adms7ToneMode["Tone_Sql"] = "TONE SQL";
        Adms7ToneMode["DCS"] = "DCS";
        Adms7ToneMode["Rev_Tone"] = "REV TONE";
        Adms7ToneMode["PR_Freq"] = "PR FREQ";
        Adms7ToneMode["Pager"] = "PAGER";
    })(Adms7ToneMode = exports.Adms7ToneMode || (exports.Adms7ToneMode = {}));
    var Adms7TxPower;
    (function (Adms7TxPower) {
        Adms7TxPower["Low"] = "LOW";
        Adms7TxPower["Medium"] = "MID";
        Adms7TxPower["High"] = "HIGH";
    })(Adms7TxPower = exports.Adms7TxPower || (exports.Adms7TxPower = {}));
    var Adms7Skip;
    (function (Adms7Skip) {
        Adms7Skip["Off"] = "OFF";
        Adms7Skip["Skip"] = "SKIP";
        Adms7Skip["Select"] = "SELECT";
    })(Adms7Skip = exports.Adms7Skip || (exports.Adms7Skip = {}));
    var Adms7Step;
    (function (Adms7Step) {
        Adms7Step["$5_khz"] = "5.0KHz";
        Adms7Step["$6_25_khz"] = "6.25KHz";
        Adms7Step["$10_khz"] = "10.0KHz";
        Adms7Step["$12_5_khz"] = "12.5KHz";
        Adms7Step["$15_khz"] = "15.0KHz";
        Adms7Step["$20_khz"] = "20.0KHz";
        Adms7Step["$25_khz"] = "25.0KHz";
        Adms7Step["$50_khz"] = "50.0KHz";
        Adms7Step["$100_khz"] = "100.0KHz";
    })(Adms7Step = exports.Adms7Step || (exports.Adms7Step = {}));
    var Adms7ClockShift;
    (function (Adms7ClockShift) {
        Adms7ClockShift[Adms7ClockShift["Off"] = 0] = "Off";
        Adms7ClockShift[Adms7ClockShift["On"] = 1] = "On";
    })(Adms7ClockShift = exports.Adms7ClockShift || (exports.Adms7ClockShift = {}));
    var Adms7Bank;
    (function (Adms7Bank) {
        Adms7Bank[Adms7Bank["A"] = 0] = "A";
        Adms7Bank[Adms7Bank["B"] = 1] = "B";
    })(Adms7Bank = exports.Adms7Bank || (exports.Adms7Bank = {}));
});
//# sourceMappingURL=adms7.js.map