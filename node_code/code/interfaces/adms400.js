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
    exports.Adms400ClockShift = exports.Adms400Step = exports.Adms400Skip = exports.Adms400TxPower = exports.Adms400ToneMode = exports.Adms400ShowName = exports.Adms400OperatingMode = exports.Adms400OffsetDirection = exports.Adms400OffsetFrequency = exports.Adms400 = void 0;
    const rt_systems_1 = require("@interfaces/rt-systems");
    class Adms400 {
        'Channel Number' = 1;
        'Receive Frequency' = 144;
        'Transmit Frequency' = 144;
        'Offset Frequency' = rt_systems_1.RtSystemsOffsetFrequency.None;
        'Offset Direction' = Adms400OffsetDirection.Simplex;
        'Operating Mode' = Adms400OperatingMode.Auto;
        Name = '';
        'Show Name' = Adms400ShowName.Large;
        'Tone Mode' = Adms400ToneMode.None;
        CTCSS = rt_systems_1.RtSystemsCtcssTone.$100_Hz;
        DCS = rt_systems_1.RtSystemsDcsTone.$23;
        'Tx Power' = Adms400TxPower.High;
        Skip = Adms400Skip.Off;
        Step = Adms400Step.Auto;
        'Clock Shift' = Adms400ClockShift.Off;
        Comment = '';
        'User CTCSS' = rt_systems_1.RtSystemsUserCtcss.$1500_Hz;
        constructor(adms400) {
            if (adms400) {
                Object.assign(this, adms400);
            }
        }
    }
    exports.Adms400 = Adms400;
    var Adms400OffsetFrequency;
    (function (Adms400OffsetFrequency) {
        Adms400OffsetFrequency["None"] = "";
        Adms400OffsetFrequency["$100_kHz"] = "100 kHz";
        Adms400OffsetFrequency["$500_kHz"] = "500 kHz";
        Adms400OffsetFrequency["$600_kHz"] = "600 kHz";
        Adms400OffsetFrequency["$1_MHz"] = "1.00 MHz";
        Adms400OffsetFrequency["$1_60_MHz"] = "1.60 MHz";
        Adms400OffsetFrequency["$3_MHz"] = "3.00 MHz";
        Adms400OffsetFrequency["$5_MHz"] = "5.00 MHz";
        Adms400OffsetFrequency["$7_60_MHz"] = "7.60 MHz";
    })(Adms400OffsetFrequency = exports.Adms400OffsetFrequency || (exports.Adms400OffsetFrequency = {}));
    var Adms400OffsetDirection;
    (function (Adms400OffsetDirection) {
        Adms400OffsetDirection["Simplex"] = "Simplex";
        Adms400OffsetDirection["Minus"] = "Minus";
        Adms400OffsetDirection["Plus"] = "Plus";
        Adms400OffsetDirection["Split"] = "Split";
    })(Adms400OffsetDirection = exports.Adms400OffsetDirection || (exports.Adms400OffsetDirection = {}));
    var Adms400OperatingMode;
    (function (Adms400OperatingMode) {
        Adms400OperatingMode["Auto"] = "Auto";
        Adms400OperatingMode["FM"] = "FM";
        Adms400OperatingMode["FM_Narrow"] = "FM Narrow";
        Adms400OperatingMode["AM"] = "AM";
    })(Adms400OperatingMode = exports.Adms400OperatingMode || (exports.Adms400OperatingMode = {}));
    var Adms400ShowName;
    (function (Adms400ShowName) {
        Adms400ShowName["Small"] = "Small";
        Adms400ShowName["Large"] = "Large";
    })(Adms400ShowName = exports.Adms400ShowName || (exports.Adms400ShowName = {}));
    var Adms400ToneMode;
    (function (Adms400ToneMode) {
        Adms400ToneMode["None"] = "None";
        Adms400ToneMode["Tone"] = "Tone";
        Adms400ToneMode["T_Sql"] = "T Sql";
        Adms400ToneMode["DCS"] = "DCS";
        Adms400ToneMode["Rev_CTCSS"] = "Rev CTCSS";
        Adms400ToneMode["User_CTCSS"] = "User CTCSS";
        Adms400ToneMode["Pager"] = "Pager";
        Adms400ToneMode["D_Code"] = "D Code";
        Adms400ToneMode["T_DCS"] = "T DCS";
        Adms400ToneMode["D_Tone"] = "D Tone";
    })(Adms400ToneMode = exports.Adms400ToneMode || (exports.Adms400ToneMode = {}));
    var Adms400TxPower;
    (function (Adms400TxPower) {
        Adms400TxPower["Low"] = "Low";
        Adms400TxPower["Medium"] = "Medium";
        Adms400TxPower["High"] = "High";
    })(Adms400TxPower = exports.Adms400TxPower || (exports.Adms400TxPower = {}));
    var Adms400Skip;
    (function (Adms400Skip) {
        Adms400Skip["Off"] = "Off";
        Adms400Skip["Skip"] = "Skip";
        Adms400Skip["Select"] = "Select";
    })(Adms400Skip = exports.Adms400Skip || (exports.Adms400Skip = {}));
    var Adms400Step;
    (function (Adms400Step) {
        Adms400Step["Auto"] = "Auto";
        Adms400Step["$5_khz"] = "5 khz";
        Adms400Step["$6_25_khz"] = "6.25 kHz";
        Adms400Step["$10_khz"] = "10 kHz";
        Adms400Step["$12_5_khz"] = "12.5 kHz";
        Adms400Step["$15_khz"] = "15 kHz";
        Adms400Step["$20_khz"] = "20 kHz";
        Adms400Step["$25_khz"] = "25 kHz";
        Adms400Step["$50_khz"] = "50 kHz";
        Adms400Step["$100_khz"] = "100 kHz";
    })(Adms400Step = exports.Adms400Step || (exports.Adms400Step = {}));
    var Adms400ClockShift;
    (function (Adms400ClockShift) {
        Adms400ClockShift["Off"] = "Off";
        Adms400ClockShift["On"] = "On";
    })(Adms400ClockShift = exports.Adms400ClockShift || (exports.Adms400ClockShift = {}));
});
//# sourceMappingURL=adms400.js.map