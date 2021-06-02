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
    exports.Wcs7100ClockShift = exports.Wcs7100DataMode = exports.Wcs7100Filter = exports.Wcs7100YourCallsign = exports.Wcs7100DigitalCode = exports.Wcs7100DigitalSquelch = exports.Wcs7100SelectScan = exports.Wcs7100DcsPolarity = exports.Wcs7100ToneMode = exports.Wcs7100OperatingMode = exports.Wcs7100OffsetDirection = exports.Wcs7100 = void 0;
    const rt_systems_1 = require("@interfaces/rt-systems");
    class Wcs7100 {
        'Channel Number' = -1;
        'Receive Frequency' = 144;
        'Transmit Frequency' = 144;
        'Offset Frequency' = rt_systems_1.RtSystemsOffsetFrequency.None;
        'Offset Direction' = Wcs7100OffsetDirection.Simplex;
        'Operating Mode' = Wcs7100OperatingMode.FM;
        Name = '';
        'Tone Mode' = Wcs7100ToneMode.None;
        CTCSS = rt_systems_1.RtSystemsCtcssTone.$88_5_Hz;
        'Rx CTCSS' = rt_systems_1.RtSystemsCtcssTone.$88_5_Hz;
        DCS = rt_systems_1.RtSystemsDcsTone.$23;
        'DCS Polarity' = Wcs7100DcsPolarity.Both_N;
        'Select Scan' = Wcs7100SelectScan.Off;
        Comment = '';
        'Digital Squelch' = Wcs7100DigitalSquelch.None;
        'Digital Code' = Wcs7100DigitalCode.None;
        'Your Callsign' = Wcs7100YourCallsign.None;
        'Rpt-1 CallSign' = '';
        'Rpt-2 CallSign' = '';
        Filter = Wcs7100Filter.Filter_1;
        'Tx Data Mode' = Wcs7100DataMode.None;
        'Data Mode' = Wcs7100DataMode.None;
        'Split Tone Mode' = Wcs7100ToneMode.None;
        'Split CTCSS' = rt_systems_1.RtSystemsCtcssTone.$88_5_Hz;
        'Split Rx CTCSS' = rt_systems_1.RtSystemsCtcssTone.$88_5_Hz;
        'Split DCS' = rt_systems_1.RtSystemsDcsTone.$23;
        'Split DCS Polarity' = Wcs7100DcsPolarity.Both_N;
        'Tx Filter' = Wcs7100Filter.Filter_1;
        'Tx Operating Mode' = Wcs7100OperatingMode.FM;
        constructor(wcs7100) {
            if (wcs7100) {
                Object.assign(this, wcs7100);
            }
        }
    }
    exports.Wcs7100 = Wcs7100;
    var Wcs7100OffsetDirection;
    (function (Wcs7100OffsetDirection) {
        Wcs7100OffsetDirection["Simplex"] = "Simplex";
        Wcs7100OffsetDirection["Minus"] = "-DUP";
        Wcs7100OffsetDirection["Plus"] = "+DUP";
        Wcs7100OffsetDirection["Split"] = "Split";
    })(Wcs7100OffsetDirection = exports.Wcs7100OffsetDirection || (exports.Wcs7100OffsetDirection = {}));
    var Wcs7100OperatingMode;
    (function (Wcs7100OperatingMode) {
        Wcs7100OperatingMode["LSB"] = "LSB";
        Wcs7100OperatingMode["USB"] = "USB";
        Wcs7100OperatingMode["CW"] = "CW";
        Wcs7100OperatingMode["CW_R"] = "CW-R";
        Wcs7100OperatingMode["RTTY"] = "RTTY";
        Wcs7100OperatingMode["RTTY_R"] = "RTTY-R";
        Wcs7100OperatingMode["AM"] = "AM";
        Wcs7100OperatingMode["FM"] = "FM";
        Wcs7100OperatingMode["DV"] = "DV";
        Wcs7100OperatingMode["WFM"] = "WFM";
    })(Wcs7100OperatingMode = exports.Wcs7100OperatingMode || (exports.Wcs7100OperatingMode = {}));
    var Wcs7100ToneMode;
    (function (Wcs7100ToneMode) {
        Wcs7100ToneMode["None"] = "None";
        Wcs7100ToneMode["Tone"] = "Tone";
        Wcs7100ToneMode["T_Sql"] = "T Sql";
        Wcs7100ToneMode["DTCS"] = "DTCS";
    })(Wcs7100ToneMode = exports.Wcs7100ToneMode || (exports.Wcs7100ToneMode = {}));
    var Wcs7100DcsPolarity;
    (function (Wcs7100DcsPolarity) {
        Wcs7100DcsPolarity["Both_N"] = "Both N";
        Wcs7100DcsPolarity["TN_RR"] = "TN-RR";
        Wcs7100DcsPolarity["TR_RN"] = "TR-RN";
        Wcs7100DcsPolarity["Both_R"] = "Both R";
    })(Wcs7100DcsPolarity = exports.Wcs7100DcsPolarity || (exports.Wcs7100DcsPolarity = {}));
    var Wcs7100SelectScan;
    (function (Wcs7100SelectScan) {
        Wcs7100SelectScan["Off"] = "Off";
        Wcs7100SelectScan["On"] = "On";
    })(Wcs7100SelectScan = exports.Wcs7100SelectScan || (exports.Wcs7100SelectScan = {}));
    var Wcs7100DigitalSquelch;
    (function (Wcs7100DigitalSquelch) {
        Wcs7100DigitalSquelch["None"] = "";
        Wcs7100DigitalSquelch["Off"] = "Off";
    })(Wcs7100DigitalSquelch = exports.Wcs7100DigitalSquelch || (exports.Wcs7100DigitalSquelch = {}));
    var Wcs7100DigitalCode;
    (function (Wcs7100DigitalCode) {
        Wcs7100DigitalCode["None"] = "";
        Wcs7100DigitalCode["$0"] = "0";
    })(Wcs7100DigitalCode = exports.Wcs7100DigitalCode || (exports.Wcs7100DigitalCode = {}));
    var Wcs7100YourCallsign;
    (function (Wcs7100YourCallsign) {
        Wcs7100YourCallsign["None"] = "";
        Wcs7100YourCallsign["CQCQCQ"] = "CQCQCQ";
    })(Wcs7100YourCallsign = exports.Wcs7100YourCallsign || (exports.Wcs7100YourCallsign = {}));
    var Wcs7100Filter;
    (function (Wcs7100Filter) {
        Wcs7100Filter["Filter_1"] = "Filter 1";
        Wcs7100Filter["Filter_2"] = "Filter 2";
        Wcs7100Filter["Filter_3"] = "Filter 3";
    })(Wcs7100Filter = exports.Wcs7100Filter || (exports.Wcs7100Filter = {}));
    var Wcs7100DataMode;
    (function (Wcs7100DataMode) {
        Wcs7100DataMode["None"] = "";
        Wcs7100DataMode["Data"] = "Data";
    })(Wcs7100DataMode = exports.Wcs7100DataMode || (exports.Wcs7100DataMode = {}));
    var Wcs7100ClockShift;
    (function (Wcs7100ClockShift) {
        Wcs7100ClockShift["Off"] = "Off";
        Wcs7100ClockShift["On"] = "On";
    })(Wcs7100ClockShift = exports.Wcs7100ClockShift || (exports.Wcs7100ClockShift = {}));
});
//# sourceMappingURL=wcs7100.js.map