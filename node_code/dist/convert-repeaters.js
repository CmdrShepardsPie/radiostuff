(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "module-alias/register", "@helpers/fs-helpers", "@helpers/log-helpers", "@interfaces/repeater-structured"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("module-alias/register");
    const fs_helpers_1 = require("@helpers/fs-helpers");
    const log_helpers_1 = require("@helpers/log-helpers");
    const repeater_structured_1 = require("@interfaces/repeater-structured");
    const log = log_helpers_1.createLog('Convert Repeaters');
    exports.default = (async () => {
        const files = await fs_helpers_1.getAllFilesInDirectory('../data/repeaters/scraped/json', 'json', 1);
        log('Got', files.length, 'files');
        const promises = [];
        await Promise.all(files.map(async (file, fileIndex) => {
            const fileBuffer = await fs_helpers_1.readFileAsync(file);
            const fileString = fileBuffer.toString();
            const fileData = JSON.parse(fileString);
            // log('File', file, typeof fileData, Array.isArray(fileData), fileData);
            if (typeof fileData === 'object') {
                if (Array.isArray(fileData)) {
                    const converted = fileData
                        .reduce((output, input, rowIndex) => {
                        log(`converting repeater ${input.Call} (${rowIndex + 1}/${fileData.length}) from ${file} (${fileIndex + 1}/${files.length})`);
                        const repeater = convertRepeater(input);
                        // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
                        promises.push(fs_helpers_1.writeToJson(`../data/repeaters/converted/json/${repeater.StateID}/${repeater.ID}`, repeater));
                        promises.push(fs_helpers_1.writeToCsv(`../data/repeaters/converted/csv/${repeater.StateID}/${repeater.ID}`, repeater));
                        return [...output, repeater];
                    }, []);
                    // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
                    promises.push(fs_helpers_1.writeToJson(`../data/repeaters/converted/json/${fs_helpers_1.splitExtension(file).name}`, converted));
                    promises.push(fs_helpers_1.writeToCsv(`../data/repeaters/converted/csv/${fs_helpers_1.splitExtension(file).name}`, converted));
                }
                else {
                    log(`converting repeater ${fileData.Call} from ${file} (${fileIndex + 1}/${files.length})`);
                    const repeater = convertRepeater(fileData);
                    // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
                    promises.push(fs_helpers_1.writeToJson(`../data/repeaters/converted/json/${repeater.StateID}/${repeater.ID}`, repeater));
                    promises.push(fs_helpers_1.writeToCsv(`../data/repeaters/converted/csv/${repeater.StateID}/${repeater.ID}`, repeater));
                }
            }
        }));
        await Promise.all(promises);
    })();
    function convertRepeater(raw) {
        return {
            ID: convertNumber(raw.ID),
            StateID: convertNumber(raw.state_id),
            Callsign: raw.Call,
            Location: {
                Latitude: raw.Latitude,
                Longitude: raw.Longitude,
                County: raw.County,
                State: raw['ST/PR'],
                Local: raw.Location,
            },
            Use: convertRepeaterUse(raw.Use),
            Status: convertRepeaterStatus(raw['Op Status']),
            Frequency: { Input: convertNumber(raw.Uplink) || (raw.Downlink + raw.Offset), Output: raw.Downlink },
            SquelchTone: convertRepeaterSquelchTone(raw['Uplink Tone'] || raw.Tone, raw['Downlink Tone']),
            DigitalTone: convertRepeaterDigitalTone(raw['Uplink Tone'] || raw.Tone, raw['Downlink Tone']),
            Digital: convertRepeaterDigitalData(raw),
            VOIP: convertRepeaterVOIP(raw),
        };
    }
    function convertRepeaterUse(raw) {
        switch (raw.toLowerCase()) {
            case 'open':
                return repeater_structured_1.RepeaterUse.Open;
            case 'closed':
                return repeater_structured_1.RepeaterUse.Closed;
            case 'private':
                return repeater_structured_1.RepeaterUse.Private;
            default:
                return repeater_structured_1.RepeaterUse.Other;
        }
    }
    function convertRepeaterStatus(raw) {
        if (!raw) {
            return repeater_structured_1.RepeaterStatus.Other;
        }
        switch (raw.toLowerCase()) {
            case 'on-air':
                return repeater_structured_1.RepeaterStatus.OnAir;
            case 'off-air':
                return repeater_structured_1.RepeaterStatus.OffAir;
            case 'testing':
                return repeater_structured_1.RepeaterStatus.Testing;
            case 'unknown':
                return repeater_structured_1.RepeaterStatus.Unknown;
            default:
                return repeater_structured_1.RepeaterStatus.Other;
        }
    }
    function convertRepeaterSquelchTone(rawInput, rawOutput) {
        if (!rawInput && !rawOutput) {
            return undefined;
        }
        const converted = {
            Input: convertNumber(rawInput),
            Output: convertNumber(rawOutput),
        };
        if (converted.Input || converted.Output) {
            return converted;
        }
        return undefined;
    }
    function convertRepeaterDigitalTone(rawInput, rawOutput) {
        if (!rawInput && !rawOutput) {
            return undefined;
        }
        const digitalFilter = /^D(\d+)$/;
        const converted = {
            Input: typeof rawInput === 'string' ? convertNumber(rawInput, digitalFilter) : undefined,
            Output: typeof rawOutput === 'string' ? convertNumber(rawOutput, digitalFilter) : undefined,
        };
        if (converted.Input || converted.Output) {
            return converted;
        }
        return undefined;
    }
    function convertNumber(input, numberFilter = /^([+-]?\d+\.?\d*)$/) {
        if (typeof input === 'number' && !isNaN(input)) {
            return input;
        }
        else if (typeof input === 'number' && isNaN(input)) {
            return undefined;
        }
        else if (typeof input === 'string' && numberFilter.test(input)) {
            const match = input.match(numberFilter);
            if (match && match[1]) {
                const converted = parseFloat(match[1]);
                return !isNaN(converted) ? converted : undefined;
            }
        }
    }
    function convertRepeaterDigitalData(raw) {
        const converted = {
            // TODO: ATV?: boolean;
            DMR: ((raw.DGTL && raw.DGTL.includes('D')) || raw['DMR Enabled']) ? {
                ColorCode: convertNumber(raw['Color Code']),
                ID: convertNumber(raw['DMR ID']),
            } : undefined,
            P25: ((raw.DGTL && raw.DGTL.includes('P')) || raw['P-25 Digital Enabled']) ? { NAC: convertNumber(raw.NAC) } : undefined,
            // TODO: Convert D-Star nodes to programmable format
            DStar: ((raw.DGTL && raw.DGTL.includes('S')) || raw['D-STAR Enabled']) ? { Node: raw.Node } : undefined,
            YSF: ((raw.DGTL && raw.DGTL.includes('Y')) || raw['YSF Digital Enabled']) ? {
                GroupID: {
                    // TODO: Convert "Open" to 0 (confirm this is correct?)
                    Input: typeof raw['DG-ID'] === 'number' ? raw['DG-ID'] : typeof raw['DG-ID'] === 'string' ? raw['DG-ID'].split('/')[0].trim() : undefined,
                    Output: typeof raw['DG-ID'] === 'number' ? raw['DG-ID'] : typeof raw['DG-ID'] === 'string' ? raw['DG-ID'].split('/')[1].trim() : undefined,
                },
            } : undefined,
        };
        if (converted.DMR || converted.P25 || converted.DStar || converted.YSF) {
            return converted;
        }
    }
    function convertRepeaterVOIP(raw) {
        const converted = {
            AllStar: ((raw.VOIP && raw.VOIP.includes('A')) || raw.AllStar) ? { NodeID: convertNumber(raw.AllStar) } : undefined,
            EchoLink: ((raw.VOIP && raw.VOIP.includes('E')) || raw.EchoLink) ? {
                NodeID: raw.EchoLink,
            } : undefined,
            IRLP: ((raw.VOIP && raw.VOIP.includes('I')) || raw.IRLP) ? { NodeID: convertNumber(raw.IRLP) } : undefined,
            Wires: ((raw.VOIP && raw.VOIP.includes('W')) || raw['WIRES-X']) ? { ID: convertNumber(raw['WIRES-X']) } : undefined,
        };
        if (converted.AllStar || converted.EchoLink || converted.IRLP || converted.Wires) {
            return converted;
        }
    }
});
