"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDCS = exports.buildComment = exports.getRepeaterCount = exports.getRepeaterSuffix = exports.buildName = exports.filterMinimumRepeaterCount = exports.filterMode = exports.filterDistance = exports.filterFrequencies = exports.Mode = exports.FrequencyBand = void 0;
const i_repeater_structured_1 = require("@interfaces/i-repeater-structured");
var FrequencyBand;
(function (FrequencyBand) {
    FrequencyBand[FrequencyBand["$2_m"] = 0] = "$2_m";
    FrequencyBand[FrequencyBand["$1_25_m"] = 1] = "$1_25_m";
    FrequencyBand[FrequencyBand["$70_cm"] = 2] = "$70_cm";
})(FrequencyBand = exports.FrequencyBand || (exports.FrequencyBand = {}));
var Mode;
(function (Mode) {
    Mode[Mode["FM"] = 0] = "FM";
    Mode[Mode["ATV"] = 1] = "ATV";
    Mode[Mode["DMR"] = 2] = "DMR";
    Mode[Mode["P25"] = 3] = "P25";
    Mode[Mode["DStar"] = 4] = "DStar";
    Mode[Mode["YSF"] = 5] = "YSF";
})(Mode = exports.Mode || (exports.Mode = {}));
function filterFrequencies(...bands) {
    return (filter) => (bands.includes(FrequencyBand.$2_m) && filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
        (bands.includes(FrequencyBand.$1_25_m) && filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
        (bands.includes(FrequencyBand.$70_cm) && filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450);
}
exports.filterFrequencies = filterFrequencies;
function filterDistance(distance) {
    return (filter) => !filter.Location || filter.Location.Distance < distance;
}
exports.filterDistance = filterDistance;
function filterMode(...modes) {
    return (filter) => filter.Status !== i_repeater_structured_1.RepeaterStatus.OffAir &&
        filter.Use === i_repeater_structured_1.RepeaterUse.Open &&
        ((modes.includes(Mode.FM) && !filter.Digital) ||
            (modes.includes(Mode.ATV) && filter.Digital != null && filter.Digital.ATV != null) ||
            (modes.includes(Mode.DMR) && filter.Digital != null && filter.Digital.DMR != null) ||
            (modes.includes(Mode.P25) && filter.Digital != null && filter.Digital.P25 != null) ||
            (modes.includes(Mode.DStar) && filter.Digital != null && filter.Digital.DStar != null) ||
            (modes.includes(Mode.YSF) &&
                ((filter.Digital != null && filter.Digital.YSF != null) ||
                    (filter.VOIP != null && filter.VOIP.Wires != null))));
}
exports.filterMode = filterMode;
function filterMinimumRepeaterCount(count, repeaters) {
    return (filter) => !!filter.Callsign && getRepeaterCount(filter.Callsign, repeaters) >= count;
}
exports.filterMinimumRepeaterCount = filterMinimumRepeaterCount;
function buildName(repeater) {
    let Name = "";
    if (repeater.Callsign) {
        Name += repeater.Callsign.trim();
    }
    else if (repeater.Location && repeater.Location.Local) {
        Name += repeater.Location.Local.trim();
    }
    else if (repeater.Frequency && repeater.Frequency.Output) {
        Name += repeater.Frequency.Output.toString().trim();
    }
    // Name += repeater.Frequency.Output.toString().trim().substr(1, 6);
    // if (repeater.SquelchTone != null && repeater.SquelchTone.Input != null) {
    //   Name += " " + repeater.SquelchTone.Input.toString().trim().substr(0, 6);
    // }
    // if (repeater.DigitalTone != null && repeater.DigitalTone.Input != null) {
    //   Name += " " + repeater.DigitalTone.Input.toString().trim().substr(0, 6);
    // }
    Name = Name.replace(/[^0-9.a-zA-Z \/]/g, " ").trim();
    // Name = Name.replace(/[^0-9 ]/g, "").trim();
    Name = Name.replace(/,/g, "").replace(/\s+/g, " ").trim();
    Name = Name.substr(0, 16).trim();
    return Name;
}
exports.buildName = buildName;
function getRepeaterSuffix(repeater) {
    let Name = "";
    if (!repeater.Digital && repeater.Location) {
        Name += "F";
    }
    if (repeater.Digital && repeater.Digital.YSF) {
        Name += "Y";
    }
    if (repeater.Digital && repeater.Digital.ATV) {
        Name += "T";
    }
    if (repeater.Digital && repeater.Digital.DMR) {
        Name += "M";
    }
    if (repeater.Digital && repeater.Digital.DStar) {
        Name += "S";
    }
    if (repeater.Digital && repeater.Digital.P25) {
        Name += "P";
    }
    if (repeater.VOIP && repeater.VOIP.Wires) {
        Name += "W";
    }
    if (repeater.VOIP && repeater.VOIP.AllStar) {
        Name += "L";
    }
    if (repeater.VOIP && repeater.VOIP.EchoLink) {
        Name += "E";
    }
    if (repeater.VOIP && repeater.VOIP.IRLP) {
        Name += "I";
    }
    return Name;
}
exports.getRepeaterSuffix = getRepeaterSuffix;
function getRepeaterCount(name, all) {
    return all.filter((a) => a.Callsign.trim() === name).length;
}
exports.getRepeaterCount = getRepeaterCount;
function buildComment(repeater) {
    let Comment = `${repeater.StateID} ${repeater.ID} ${repeater.Location && (repeater.Location.Distance != null) && repeater.Location.Distance.toFixed(2)} ${repeater.Location && repeater.Location.State} ${repeater.Location && repeater.Location.County} ${repeater.Location && repeater.Location.Local} ${repeater.Callsign}`;
    Comment = Comment.replace(/undefined/g, " ").replace(/,/g, " ").replace(/\s+/g, " ").trim();
    return Comment;
}
exports.buildComment = buildComment;
function buildDCS(code) {
    const DCSa = (code || 23).toString().split("");
    const DCS = ["0", "0", "0"];
    DCS.splice(DCS.length - DCSa.length, DCSa.length, ...DCSa);
    return DCS.join("");
}
exports.buildDCS = buildDCS;
