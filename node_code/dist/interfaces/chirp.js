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
    exports.ChirpDuplex = exports.ChirpToneMode = exports.ChirpShowName = exports.ChirpOperatingMode = exports.ChirpOffsetDirection = exports.Chirp = void 0;
    class Chirp {
        constructor(chirp) {
            this.Location = 0;
            this.Name = '';
            this.Frequency = 144;
            this.Duplex = ChirpDuplex.Simplex;
            this.Offset = 0;
            this.Tone = ChirpToneMode.None;
            this.rToneFreq = 88.5;
            this.cToneFreq = 88.5;
            this.DtcsCode = 23;
            this.DtcsRxCode = 23;
            this.DtcsPolarity = 'NN';
            this.Mode = ChirpOperatingMode.FM;
            this.TStep = 5;
            this.Comment = '';
            if (chirp) {
                Object.assign(this, chirp);
            }
        }
    }
    exports.Chirp = Chirp;
    var ChirpOffsetDirection;
    (function (ChirpOffsetDirection) {
        ChirpOffsetDirection["Simplex"] = "";
        ChirpOffsetDirection["Minus"] = "-";
        ChirpOffsetDirection["Plus"] = "+";
    })(ChirpOffsetDirection = exports.ChirpOffsetDirection || (exports.ChirpOffsetDirection = {}));
    var ChirpOperatingMode;
    (function (ChirpOperatingMode) {
        ChirpOperatingMode["FM"] = "FM";
        ChirpOperatingMode["NFM"] = "NFM";
    })(ChirpOperatingMode = exports.ChirpOperatingMode || (exports.ChirpOperatingMode = {}));
    var ChirpShowName;
    (function (ChirpShowName) {
        ChirpShowName["Small"] = "Small";
        ChirpShowName["Large"] = "Large";
    })(ChirpShowName = exports.ChirpShowName || (exports.ChirpShowName = {}));
    var ChirpToneMode;
    (function (ChirpToneMode) {
        ChirpToneMode["None"] = "";
        ChirpToneMode["Tone"] = "Tone";
        ChirpToneMode["T_Sql"] = "TSQL";
        ChirpToneMode["DTCS"] = "DTCS";
        ChirpToneMode["DTCS_R"] = "DTCS-R";
        ChirpToneMode["TSQL_R"] = "TSQL-R";
        ChirpToneMode["Cross"] = "Cross";
    })(ChirpToneMode = exports.ChirpToneMode || (exports.ChirpToneMode = {}));
    var ChirpDuplex;
    (function (ChirpDuplex) {
        ChirpDuplex["Simplex"] = "";
        ChirpDuplex["Minus"] = "-";
        ChirpDuplex["Plus"] = "+";
    })(ChirpDuplex = exports.ChirpDuplex || (exports.ChirpDuplex = {}));
});
