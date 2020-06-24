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
    exports.Adms400ClockShift = exports.Adms400UserCtcss = exports.Adms400Step = exports.Adms400Skip = exports.Adms400TxPower = exports.Adms400DcsTone = exports.Adms400CtcssTone = exports.Adms400ToneMode = exports.Adms400ShowName = exports.Adms400OperatingMode = exports.Adms400OffsetDirection = exports.Adms400OffsetFrequency = exports.Adms400 = void 0;
    class Adms400 {
        constructor(adms400) {
            this['Channel Number'] = 1;
            this['Receive Frequency'] = 144;
            this['Transmit Frequency'] = 144;
            this['Offset Frequency'] = Adms400OffsetFrequency.None;
            this['Offset Direction'] = Adms400OffsetDirection.Simplex;
            this['Operating Mode'] = Adms400OperatingMode.Auto;
            this.Name = '';
            this['Show Name'] = Adms400ShowName.Large;
            this['Tone Mode'] = Adms400ToneMode.None;
            this.CTCSS = Adms400CtcssTone.$100_0_Hz;
            this.DCS = Adms400DcsTone.$023;
            this['Tx Power'] = Adms400TxPower.Low;
            this.Skip = Adms400Skip.Off;
            this.Step = Adms400Step.Auto;
            this['Clock Shift'] = Adms400ClockShift.Off;
            this.Comment = '';
            this['User CTCSS'] = Adms400UserCtcss.$1500_Hz;
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
        Adms400OffsetFrequency["$1_00_MHz"] = "1.00 MHz";
        Adms400OffsetFrequency["$1_60_MHz"] = "1.60 MHz";
        Adms400OffsetFrequency["$3_00_MHz"] = "3.00 MHz";
        Adms400OffsetFrequency["$5_00_MHz"] = "5.00 MHz";
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
    var Adms400CtcssTone;
    (function (Adms400CtcssTone) {
        Adms400CtcssTone["$67_0_Hz"] = "67.0 Hz";
        Adms400CtcssTone["$69_3_Hz"] = "69.3 Hz";
        Adms400CtcssTone["$71_9_Hz"] = "71.9 Hz";
        Adms400CtcssTone["$74_4_Hz"] = "74.4 Hz";
        Adms400CtcssTone["$77_0_Hz"] = "77.0 Hz";
        Adms400CtcssTone["$79_7_Hz"] = "79.7 Hz";
        Adms400CtcssTone["$82_5_Hz"] = "82.5 Hz";
        Adms400CtcssTone["$85_4_Hz"] = "85.4 Hz";
        Adms400CtcssTone["$88_5_Hz"] = "88.5 Hz";
        Adms400CtcssTone["$91_5_Hz"] = "91.5 Hz";
        Adms400CtcssTone["$94_8_Hz"] = "94.8 Hz";
        Adms400CtcssTone["$97_4_Hz"] = "97.4 Hz";
        Adms400CtcssTone["$100_0_Hz"] = "100.0 Hz";
        Adms400CtcssTone["$103_5_Hz"] = "103.5 Hz";
        Adms400CtcssTone["$107_2_Hz"] = "107.2 Hz";
        Adms400CtcssTone["$110_9_Hz"] = "110.9 Hz";
        Adms400CtcssTone["$114_8_Hz"] = "114.8 Hz";
        Adms400CtcssTone["$118_8_Hz"] = "118.8 Hz";
        Adms400CtcssTone["$123_0_Hz"] = "123.0 Hz";
        Adms400CtcssTone["$127_3_Hz"] = "127.3 Hz";
        Adms400CtcssTone["$131_8_Hz"] = "131.8 Hz";
        Adms400CtcssTone["$136_5_Hz"] = "136.5 Hz";
        Adms400CtcssTone["$141_3_Hz"] = "141.3 Hz";
        Adms400CtcssTone["$146_2_Hz"] = "146.2 Hz";
        Adms400CtcssTone["$151_4_Hz"] = "151.4 Hz";
        Adms400CtcssTone["$156_7_Hz"] = "156.7 Hz";
        Adms400CtcssTone["$159_8_Hz"] = "159.8 Hz";
        Adms400CtcssTone["$162_2_Hz"] = "162.2 Hz";
        Adms400CtcssTone["$165_5_Hz"] = "165.5 Hz";
        Adms400CtcssTone["$167_9_Hz"] = "167.9 Hz";
        Adms400CtcssTone["$171_3_Hz"] = "171.3 Hz";
        Adms400CtcssTone["$173_8_Hz"] = "173.8 Hz";
        Adms400CtcssTone["$177_3_Hz"] = "177.3 Hz";
        Adms400CtcssTone["$179_9_Hz"] = "179.9 Hz";
        Adms400CtcssTone["$183_5_Hz"] = "183.5 Hz";
        Adms400CtcssTone["$186_2_Hz"] = "186.2 Hz";
        Adms400CtcssTone["$189_9_Hz"] = "189.9 Hz";
        Adms400CtcssTone["$192_8_Hz"] = "192.8 Hz";
        Adms400CtcssTone["$196_6_Hz"] = "196.6 Hz";
        Adms400CtcssTone["$199_5_Hz"] = "199.5 Hz";
        Adms400CtcssTone["$203_5_Hz"] = "203.5 Hz";
        Adms400CtcssTone["$206_5_Hz"] = "206.5 Hz";
        Adms400CtcssTone["$210_7_Hz"] = "210.7 Hz";
        Adms400CtcssTone["$218_1_Hz"] = "218.1 Hz";
        Adms400CtcssTone["$225_7_Hz"] = "225.7 Hz";
        Adms400CtcssTone["$229_1_Hz"] = "229.1 Hz";
        Adms400CtcssTone["$233_6_Hz"] = "233.6 Hz";
        Adms400CtcssTone["$241_8_Hz"] = "241.8 Hz";
        Adms400CtcssTone["$250_3_Hz"] = "250.3 Hz";
        Adms400CtcssTone["$254_1_Hz"] = "254.1 Hz";
    })(Adms400CtcssTone = exports.Adms400CtcssTone || (exports.Adms400CtcssTone = {}));
    var Adms400DcsTone;
    (function (Adms400DcsTone) {
        Adms400DcsTone["$006"] = "006";
        Adms400DcsTone["$007"] = "007";
        Adms400DcsTone["$015"] = "015";
        Adms400DcsTone["$017"] = "017";
        Adms400DcsTone["$021"] = "021";
        Adms400DcsTone["$023"] = "023";
        Adms400DcsTone["$025"] = "025";
        Adms400DcsTone["$026"] = "026";
        Adms400DcsTone["$031"] = "031";
        Adms400DcsTone["$032"] = "032";
        Adms400DcsTone["$036"] = "036";
        Adms400DcsTone["$043"] = "043";
        Adms400DcsTone["$047"] = "047";
        Adms400DcsTone["$050"] = "050";
        Adms400DcsTone["$051"] = "051";
        Adms400DcsTone["$053"] = "053";
        Adms400DcsTone["$054"] = "054";
        Adms400DcsTone["$065"] = "065";
        Adms400DcsTone["$071"] = "071";
        Adms400DcsTone["$072"] = "072";
        Adms400DcsTone["$073"] = "073";
        Adms400DcsTone["$074"] = "074";
        Adms400DcsTone["$114"] = "114";
        Adms400DcsTone["$115"] = "115";
        Adms400DcsTone["$116"] = "116";
        Adms400DcsTone["$122"] = "122";
        Adms400DcsTone["$125"] = "125";
        Adms400DcsTone["$131"] = "131";
        Adms400DcsTone["$132"] = "132";
        Adms400DcsTone["$134"] = "134";
        Adms400DcsTone["$141"] = "141";
        Adms400DcsTone["$143"] = "143";
        Adms400DcsTone["$145"] = "145";
        Adms400DcsTone["$152"] = "152";
        Adms400DcsTone["$155"] = "155";
        Adms400DcsTone["$156"] = "156";
        Adms400DcsTone["$162"] = "162";
        Adms400DcsTone["$165"] = "165";
        Adms400DcsTone["$172"] = "172";
        Adms400DcsTone["$174"] = "174";
        Adms400DcsTone["$205"] = "205";
        Adms400DcsTone["$212"] = "212";
        Adms400DcsTone["$214"] = "214";
        Adms400DcsTone["$223"] = "223";
        Adms400DcsTone["$225"] = "225";
        Adms400DcsTone["$226"] = "226";
        Adms400DcsTone["$243"] = "243";
        Adms400DcsTone["$244"] = "244";
        Adms400DcsTone["$245"] = "245";
        Adms400DcsTone["$246"] = "246";
        Adms400DcsTone["$251"] = "251";
        Adms400DcsTone["$252"] = "252";
        Adms400DcsTone["$255"] = "255";
        Adms400DcsTone["$261"] = "261";
        Adms400DcsTone["$263"] = "263";
        Adms400DcsTone["$265"] = "265";
        Adms400DcsTone["$266"] = "266";
        Adms400DcsTone["$271"] = "271";
        Adms400DcsTone["$274"] = "274";
        Adms400DcsTone["$306"] = "306";
        Adms400DcsTone["$311"] = "311";
        Adms400DcsTone["$315"] = "315";
        Adms400DcsTone["$325"] = "325";
        Adms400DcsTone["$331"] = "331";
        Adms400DcsTone["$332"] = "332";
        Adms400DcsTone["$343"] = "343";
        Adms400DcsTone["$346"] = "346";
        Adms400DcsTone["$351"] = "351";
        Adms400DcsTone["$356"] = "356";
        Adms400DcsTone["$364"] = "364";
        Adms400DcsTone["$365"] = "365";
        Adms400DcsTone["$371"] = "371";
        Adms400DcsTone["$411"] = "411";
        Adms400DcsTone["$412"] = "412";
        Adms400DcsTone["$413"] = "413";
        Adms400DcsTone["$423"] = "423";
        Adms400DcsTone["$431"] = "431";
        Adms400DcsTone["$432"] = "432";
        Adms400DcsTone["$445"] = "445";
        Adms400DcsTone["$446"] = "446";
        Adms400DcsTone["$452"] = "452";
        Adms400DcsTone["$454"] = "454";
        Adms400DcsTone["$455"] = "455";
        Adms400DcsTone["$462"] = "462";
        Adms400DcsTone["$464"] = "464";
        Adms400DcsTone["$465"] = "465";
        Adms400DcsTone["$466"] = "466";
        Adms400DcsTone["$503"] = "503";
        Adms400DcsTone["$506"] = "506";
        Adms400DcsTone["$516"] = "516";
        Adms400DcsTone["$523"] = "523";
        Adms400DcsTone["$526"] = "526";
        Adms400DcsTone["$532"] = "532";
        Adms400DcsTone["$546"] = "546";
        Adms400DcsTone["$565"] = "565";
        Adms400DcsTone["$606"] = "606";
        Adms400DcsTone["$612"] = "612";
        Adms400DcsTone["$624"] = "624";
        Adms400DcsTone["$627"] = "627";
        Adms400DcsTone["$631"] = "631";
        Adms400DcsTone["$632"] = "632";
        Adms400DcsTone["$654"] = "654";
        Adms400DcsTone["$662"] = "662";
        Adms400DcsTone["$664"] = "664";
        Adms400DcsTone["$703"] = "703";
        Adms400DcsTone["$712"] = "712";
        Adms400DcsTone["$723"] = "723";
        Adms400DcsTone["$731"] = "731";
        Adms400DcsTone["$732"] = "732";
        Adms400DcsTone["$734"] = "734";
        Adms400DcsTone["$743"] = "743";
        Adms400DcsTone["$754"] = "754";
    })(Adms400DcsTone = exports.Adms400DcsTone || (exports.Adms400DcsTone = {}));
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
    var Adms400UserCtcss;
    (function (Adms400UserCtcss) {
        Adms400UserCtcss["$300_Hz"] = "300 Hz";
        Adms400UserCtcss["$400_Hz"] = "400 Hz";
        Adms400UserCtcss["$500_Hz"] = "500 Hz";
        Adms400UserCtcss["$600_Hz"] = "600 Hz";
        Adms400UserCtcss["$700_Hz"] = "700 Hz";
        Adms400UserCtcss["$800_Hz"] = "800 Hz";
        Adms400UserCtcss["$900_Hz"] = "900 Hz";
        Adms400UserCtcss["$1000_Hz"] = "1000 Hz";
        Adms400UserCtcss["$1100_Hz"] = "1100 Hz";
        Adms400UserCtcss["$1200_Hz"] = "1200 Hz";
        Adms400UserCtcss["$1300_Hz"] = "1300 Hz";
        Adms400UserCtcss["$1400_Hz"] = "1400 Hz";
        Adms400UserCtcss["$1500_Hz"] = "1500 Hz";
        Adms400UserCtcss["$1600_Hz"] = "1600 Hz";
        Adms400UserCtcss["$1700_Hz"] = "1700 Hz";
        Adms400UserCtcss["$1800_Hz"] = "1800 Hz";
        Adms400UserCtcss["$1900_Hz"] = "1900 Hz";
        Adms400UserCtcss["$2000_Hz"] = "2000 Hz";
        Adms400UserCtcss["$2100_Hz"] = "2100 Hz";
        Adms400UserCtcss["$2200_Hz"] = "2200 Hz";
        Adms400UserCtcss["$2300_Hz"] = "2300 Hz";
        Adms400UserCtcss["$2400_Hz"] = "2400 Hz";
        Adms400UserCtcss["$2500_Hz"] = "2500 Hz";
        Adms400UserCtcss["$2600_Hz"] = "2600 Hz";
        Adms400UserCtcss["$2700_Hz"] = "2700 Hz";
        Adms400UserCtcss["$2800_Hz"] = "2800 Hz";
        Adms400UserCtcss["$2900_Hz"] = "2900 Hz";
        Adms400UserCtcss["$3000_Hz"] = "3000 Hz";
    })(Adms400UserCtcss = exports.Adms400UserCtcss || (exports.Adms400UserCtcss = {}));
    var Adms400ClockShift;
    (function (Adms400ClockShift) {
        Adms400ClockShift["Off"] = "Off";
        Adms400ClockShift["On"] = "On";
    })(Adms400ClockShift = exports.Adms400ClockShift || (exports.Adms400ClockShift = {}));
});
