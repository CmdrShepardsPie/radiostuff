"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const fs_helpers_1 = require("@helpers/fs-helpers");
const log_helpers_1 = require("@helpers/log-helpers");
const i_repeater_structured_1 = require("@interfaces/i-repeater-structured");
const gps_distance_1 = __importDefault(require("gps-distance"));
const log = log_helpers_1.createLog('Make Chirp');
const chirp = {
    Location: null,
    Name: '',
    Frequency: null,
    Duplex: '',
    Offset: null,
    Tone: '',
    rToneFreq: null,
    cToneFreq: null,
    DtcsCode: null,
    DtcsRxCode: null,
    DtcsPolarity: 'NN',
    Mode: 'FM',
    TStep: 5,
    Comment: '',
};
const myPoint = [39.627071500, -104.893322500]; // 4982 S Ulster St
async function doIt(inFileName, outFileName) {
    const simplex = JSON.parse((await fs_helpers_1.readFileAsync('../data/frequencies.json')).toString())
        .map((map) => ({ Callsign: map.Name, Frequency: { Output: map.Frequency, Input: map.Frequency } }))
        .filter((filter) => /FM|Voice|Simplex/i.test(filter.Callsign))
        .filter((filter) => !(/Data|Digital|Packet/i.test(filter.Callsign)));
    const repeaters = JSON.parse((await fs_helpers_1.readFileAsync(inFileName)).toString());
    repeaters.forEach((each) => {
        each.Location.Distance = gps_distance_1.default([myPoint, [each.Location.Latitude, each.Location.Longitude]]);
    });
    repeaters.sort((a, b) => a.Location.Distance > b.Location.Distance ? 1 :
        a.Location.Distance < b.Location.Distance ? -1 : 0);
    const mapped = [
        ...simplex,
        ...repeaters
            .filter((filter) => (filter.Frequency.Output >= 144 && filter.Frequency.Output <= 148) ||
            (filter.Frequency.Output >= 222 && filter.Frequency.Output <= 225) ||
            (filter.Frequency.Output >= 420 && filter.Frequency.Output <= 450))
            .filter((filter) => !filter.Digital &&
            filter.Status !== i_repeater_structured_1.RepeaterStatus.OffAir &&
            filter.Use === i_repeater_structured_1.RepeaterUse.Open),
    ]
        .map((map, index) => ({ ...convertToRadio(map), Location: index }));
    const short = mapped
        .slice(0, 128)
        .sort((a, b) => a.Frequency - b.Frequency)
        .map((map, index) => ({ ...map, Location: index }));
    const long = mapped
        .slice(0, 200)
        .sort((a, b) => a.Frequency - b.Frequency)
        .map((map, index) => ({ ...map, Location: index }));
    await fs_helpers_1.writeToJsonAndCsv(outFileName + '-short', short);
    await fs_helpers_1.writeToJsonAndCsv(outFileName + '-long', long);
}
function convertToRadio(repeater) {
    let Name = '';
    if (repeater.Callsign) {
        Name += repeater.Callsign.trim();
    }
    if (repeater.Location && repeater.Location.Local) {
        Name += (Name ? ' ' : '') + repeater.Location.Local.trim();
    }
    if (repeater.Frequency && repeater.Frequency.Output) {
        Name += (Name ? ' ' : '') + repeater.Frequency.Output.toString().trim();
    }
    Name = Name.replace(/[^0-9.a-zA-Z \/]/g, '').trim();
    Name = Name.replace(/[ ]+/g, ' ').trim();
    Name = Name.substr(0, 8).trim();
    const Frequency = repeater.Frequency.Output;
    let Offset = repeater.Frequency.Input - repeater.Frequency.Output;
    const Duplex = Offset > 0 ? '+' : Offset < 0 ? '-' : '';
    Offset = Math.abs(Math.round(Offset * 100) / 100);
    let rToneFreq = (repeater.SquelchTone && repeater.SquelchTone.Input);
    let cToneFreq = (repeater.SquelchTone && repeater.SquelchTone.Output);
    let DtcsCode = (repeater.DigitalTone && repeater.DigitalTone.Input);
    let DtcsRxCode = (repeater.DigitalTone && repeater.DigitalTone.Output);
    let Tone = '';
    const Mode = 'FM';
    let Comment = `${repeater.StateID} ${repeater.ID} ${repeater.Location && repeater.Location.Distance && repeater.Location.Distance.toFixed(2)} ${repeater.Location && repeater.Location.State} ${repeater.Location && repeater.Location.County} ${repeater.Location && repeater.Location.Local} ${repeater.Callsign}`;
    Comment = Comment.replace(/undefined/g, ' ').replace(/\s+/g, ' ').trim();
    // `${item['ST/PR'] || ''} ${item.County || ''} ${item.Location || ''} ${item.Call || ''} ${item.Sponsor || ''} ${item.Affiliate || ''} ${item.Frequency} ${item.Use || ''} ${item['Op Status'] || ''} ${item.Comment || ''}`.replace(/\s+/g, ' ');
    // Comment = Comment.trim().replace(",", "").substring(0, 31).trim();
    if (rToneFreq) {
        Tone = 'Tone';
    }
    else if (DtcsCode) {
        Tone = 'DTCS';
    }
    if (cToneFreq) {
        Tone = 'TSQL';
    }
    else if (DtcsRxCode) {
        Tone = 'DTCS';
    }
    if ((rToneFreq && cToneFreq && (rToneFreq !== cToneFreq))) {
        Tone = 'Cross';
    }
    cToneFreq = cToneFreq || 88.5;
    rToneFreq = rToneFreq || 88.5;
    DtcsCode = DtcsCode || 23;
    DtcsRxCode = DtcsRxCode || 23;
    // log(chalk.green("Made Row"), row);
    return {
        ...chirp,
        // Location,
        Name,
        Frequency,
        Duplex,
        Offset,
        rToneFreq,
        cToneFreq,
        DtcsCode,
        DtcsRxCode,
        Tone,
        Mode,
        Comment,
    };
}
async function start() {
    // const coFiles = (await readdirAsync("./repeaters/data/CO/")).map((f) => `../data/CO/${f}`);
    // const utFiles = (await readdirAsync("./repeaters/data/UT/")).map((f) => `../data/UT/${f}`);
    // const nmFiles = (await readdirAsync("./repeaters/data/NM/")).map((f) => `../data/NM/${f}`);
    // const coGroups = (await readdirAsync("./repeaters/groups/CO/")).map((f) => `groups/CO/${f}`);
    // const utGroups = (await readdirAsync("./repeaters/groups/UT/")).map((f) => `groups/UT/${f}`);
    // const nmGroups = (await readdirAsync("./repeaters/groups/NM/")).map((f) => `groups/NM/${f}`);
    // const allFiles = [...coFiles, ...utFiles, ...nmFiles, ...coGroups, ...utGroups, ...nmGroups].filter((f) => /\.json$/.test(f)).map((f) => f.replace(".json", ""));
    // for (const file of allFiles) {
    //   await doIt(file);
    // }
    // await doIt("data/repeaters/groups/CO/Colorado Springs - Call.json", "data/repeaters/chirp/groups/CO/Colorado Springs - Call");
    // await doIt("data/repeaters/results/CO/Colorado Springs.json", "data/repeaters/chirp/CO/Colorado Springs");
    await doIt('../data/repeaters/converted/CO.json', '../data/repeaters/chirp/CO');
    // await doIt('../data/repeaters/groups/combined/CO - Call.json', '../data/repeaters/chirp/groups/CO - Call');
}
exports.default = start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZS1jaGlycC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWtlLWNoaXJwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaUNBQStCO0FBRS9CLG9EQUF1RTtBQUN2RSxzREFBaUQ7QUFFakQsNkVBQXFHO0FBRXJHLGdFQUFrRDtBQUVsRCxNQUFNLEdBQUcsR0FBNEIsdUJBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU3RCxNQUFNLEtBQUssR0FBVztJQUNwQixRQUFRLEVBQUUsSUFBVztJQUNyQixJQUFJLEVBQUUsRUFBRTtJQUNSLFNBQVMsRUFBRSxJQUFXO0lBQ3RCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsTUFBTSxFQUFFLElBQVc7SUFDbkIsSUFBSSxFQUFFLEVBQUU7SUFDUixTQUFTLEVBQUUsSUFBVztJQUN0QixTQUFTLEVBQUUsSUFBVztJQUN0QixRQUFRLEVBQUUsSUFBVztJQUNyQixVQUFVLEVBQUUsSUFBVztJQUN2QixZQUFZLEVBQUUsSUFBSTtJQUNsQixJQUFJLEVBQUUsSUFBSTtJQUNWLEtBQUssRUFBRSxDQUFDO0lBQ1IsT0FBTyxFQUFFLEVBQUU7Q0FDWixDQUFDO0FBRUYsTUFBTSxPQUFPLEdBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtBQUUxRSxLQUFLLFVBQVUsSUFBSSxDQUFDLFVBQWtCLEVBQUUsV0FBbUI7SUFDekQsTUFBTSxPQUFPLEdBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sMEJBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDckUsR0FBRyxDQUFDLENBQUMsR0FBc0IsRUFBRSxFQUFFLENBQzlCLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxD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QUksRUFBRSxDQUFDO0lBQzFCLFVBQVUsR0FBRyxVQUFVLElBQUksRUFBRSxDQUFDO0lBRWhDLHFDQUFxQztJQUNuQyxPQUFPO1FBQ0wsR0FBRyxLQUFLO1FBQ1osWUFBWTtRQUNSLElBQUk7UUFDSixTQUFTO1FBQ1QsTUFBTTtRQUNOLE1BQU07UUFDTixTQUFTO1FBQ1QsU0FBUztRQUNULFFBQVE7UUFDUixVQUFVO1FBQ1YsSUFBSTtRQUNKLElBQUk7UUFDSixPQUFPO0tBQ1IsQ0FBQztBQUNKLENBQUM7QUFFRCxLQUFLLFVBQVUsS0FBSztJQUNwQiw4RkFBOEY7SUFDOUYsOEZBQThGO0lBQzlGLDhGQUE4RjtJQUM5RixnR0FBZ0c7SUFDaEcsZ0dBQWdHO0lBQ2hHLGdHQUFnRztJQUNoRyxvS0FBb0s7SUFDcEssaUNBQWlDO0lBQ2pDLHNCQUFzQjtJQUN0QixJQUFJO0lBRUosaUlBQWlJO0lBQ2pJLDZHQUE2RztJQUMzRyxNQUFNLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0lBQ2hGLDhHQUE4RztBQUNoSCxDQUFDO0FBRUQsa0JBQWUsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ21vZHVsZS1hbGlhcy9yZWdpc3Rlcic7XG5cbmltcG9ydCB7IHJlYWRGaWxlQXN5bmMsIHdyaXRlVG9Kc29uQW5kQ3N2IH0gZnJvbSAnQGhlbHBlcnMvZnMtaGVscGVycyc7XG5pbXBvcnQgeyBjcmVhdGVMb2cgfSBmcm9tICdAaGVscGVycy9sb2ctaGVscGVycyc7XG5pbXBvcnQgeyBDaGlycER1cGxleCwgQ2hpcnBNb2RlLCBDaGlycFRvbmUsIElDaGlycCB9IGZyb20gJ0BpbnRlcmZhY2VzL2ktY2hpcnAnO1xuaW1wb3J0IHsgSVJlcGVhdGVyU3RydWN0dXJlZCwgUmVwZWF0ZXJTdGF0dXMsIFJlcGVhdGVyVXNlIH0gZnJvbSAnQGludGVyZmFjZXMvaS1yZXBlYXRlci1zdHJ1Y3R1cmVkJztcbmltcG9ydCB7IElTaW1wbGV4RnJlcXVlbmN5IH0gZnJvbSAnQGludGVyZmFjZXMvaS1zaW1wbGV4LWZyZXF1ZW5jeSc7XG5pbXBvcnQgZ3BzRGlzdGFuY2UsIHsgUG9pbnQgfSBmcm9tICdncHMtZGlzdGFuY2UnO1xuXG5jb25zdCBsb2c6ICguLi5tc2c6IGFueVtdKSA9PiB2b2lkID0gY3JlYXRlTG9nKCdNYWtlIENoaXJwJyk7XG5cbmNvbnN0IGNoaXJwOiBJQ2hpcnAgPSB7XG4gIExvY2F0aW9uOiBudWxsIGFzIGFueSxcbiAgTmFtZTogJycsXG4gIEZyZXF1ZW5jeTogbnVsbCBhcyBhbnksXG4gIER1cGxleDogJycsXG4gIE9mZnNldDogbnVsbCBhcyBhbnksXG4gIFRvbmU6ICcnLFxuICByVG9uZUZyZXE6IG51bGwgYXMgYW55LFxuICBjVG9uZUZyZXE6IG51bGwgYXMgYW55LFxuICBEdGNzQ29kZTogbnVsbCBhcyBhbnksXG4gIER0Y3NSeENvZGU6IG51bGwgYXMgYW55LFxuICBEdGNzUG9sYXJpdHk6ICdOTicsXG4gIE1vZGU6ICdGTScsXG4gIFRTdGVwOiA1LFxuICBDb21tZW50OiAnJyxcbn07XG5cbmNvbnN0IG15UG9pbnQ6IFBvaW50ID0gWzM5LjYyNzA3MTUwMCwgLTEwNC44OTMzMjI1MDBdOyAvLyA0OTgyIFMgVWxzdGVyIFN0XG5cbmFzeW5jIGZ1bmN0aW9uIGRvSXQoaW5GaWxlTmFtZTogc3RyaW5nLCBvdXRGaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHNpbXBsZXg6IElSZXBlYXRlclN0cnVjdHVyZWRbXSA9XG4gICAgSlNPTi5wYXJzZSgoYXdhaXQgcmVhZEZpbGVBc3luYygnLi4vZGF0YS9mcmVxdWVuY2llcy5qc29uJykpLnRvU3RyaW5nKCkpXG4gICAgICAubWFwKChtYXA6IElTaW1wbGV4RnJlcXVlbmN5KSA9PlxuICAgICAgICAoeyBDYWxsc2lnbjogbWFwLk5hbWUsIEZyZXF1ZW5jeTogeyBPdXRwdXQ6IG1hcC5GcmVxdWVuY3ksIElucHV0OiBtYXAuRnJlcXVlbmN5IH0gfSkpXG4gICAgICAuZmlsdGVyKChmaWx0ZXI6IElSZXBlYXRlclN0cnVjdHVyZWQpID0+IC9GTXxWb2ljZXxTaW1wbGV4L2kudGVzdChmaWx0ZXIuQ2FsbHNpZ24pKVxuICAgICAgLmZpbHRlcigoZmlsdGVyOiBJUmVwZWF0ZXJTdHJ1Y3R1cmVkKSA9PiAhKC9EYXRhfERpZ2l0YWx8UGFja2V0L2kudGVzdChmaWx0ZXIuQ2FsbHNpZ24pKSk7XG5cbiAgY29uc3QgcmVwZWF0ZXJzOiBJUmVwZWF0ZXJTdHJ1Y3R1cmVkW10gPVxuICAgIEpTT04ucGFyc2UoKGF3YWl0IHJlYWRGaWxlQXN5bmMoaW5GaWxlTmFtZSkpLnRvU3RyaW5nKCkpO1xuXG4gIHJlcGVhdGVycy5mb3JFYWNoKChlYWNoOiBJUmVwZWF0ZXJTdHJ1Y3R1cmVkKSA9PiB7XG4gICAgZWFjaC5Mb2NhdGlvbi5EaXN0YW5jZSA9IGdwc0Rpc3RhbmNlKFtteVBvaW50LCBbZWFjaC5Mb2NhdGlvbi5MYXRpdHVkZSwgZWFjaC5Mb2NhdGlvbi5Mb25naXR1ZGVdXSk7XG4gIH0pO1xuXG4gIHJlcGVhdGVycy5zb3J0KChhOiBJUmVwZWF0ZXJTdHJ1Y3R1cmVkLCBiOiBJUmVwZWF0ZXJTdHJ1Y3R1cmVkKSA9PlxuICAgIGEuTG9jYXRpb24uRGlzdGFuY2UhID4gYi5Mb2NhdGlvbi5EaXN0YW5jZSEgPyAxIDpcbiAgICAgIGEuTG9jYXRpb24uRGlzdGFuY2UhIDwgYi5Mb2NhdGlvbi5EaXN0YW5jZSEgPyAtMSA6IDApO1xuICBjb25zdCBtYXBwZWQ6IElDaGlycFtdID0gW1xuICAgIC4uLnNpbXBsZXgsXG4gICAgLi4ucmVwZWF0ZXJzXG4gICAgICAuZmlsdGVyKChmaWx0ZXI6IElSZXBlYXRlclN0cnVjdHVyZWQpID0+XG4gICAgICAgIChmaWx0ZXIuRnJlcXVlbmN5Lk91dHB1dCA+PSAxNDQgJiYgZmlsdGVyLkZyZXF1ZW5jeS5PdXRwdXQgPD0gMTQ4KSB8fFxuICAgICAgICAoZmlsdGVyLkZyZXF1ZW5jeS5PdXRwdXQgPj0gMjIyICYmIGZpbHRlci5GcmVxdWVuY3kuT3V0cHV0IDw9IDIyNSkgfHxcbiAgICAgICAgKGZpbHRlci5GcmVxdWVuY3kuT3V0cHV0ID49IDQyMCAmJiBmaWx0ZXIuRnJlcXVlbmN5Lk91dHB1dCA8PSA0NTApKVxuICAgICAgLmZpbHRlcigoZmlsdGVyOiBJUmVwZWF0ZXJTdHJ1Y3R1cmVkKSA9PlxuICAgICAgICAhZmlsdGVyLkRpZ2l0YWwgJiZcbiAgICAgICAgZmlsdGVyLlN0YXR1cyAhPT0gUmVwZWF0ZXJTdGF0dXMuT2ZmQWlyICYmXG4gICAgICAgIGZpbHRlci5Vc2UgPT09IFJlcGVhdGVyVXNlLk9wZW4pLFxuICBdXG4gICAgLm1hcCgobWFwOiBJUmVwZWF0ZXJTdHJ1Y3R1cmVkLCBpbmRleDogbnVtYmVyKTogSUNoaXJwID0+ICh7IC4uLmNvbnZlcnRUb1JhZGlvKG1hcCksIExvY2F0aW9uOiBpbmRleCB9KSk7XG5cbiAgY29uc3Qgc2hvcnQ6IElDaGlycFtdID0gbWFwcGVkXG4gICAgLnNsaWNlKDAsIDEyOClcbiAgICAuc29ydCgoYTogSUNoaXJwLCBiOiBJQ2hpcnApID0+IGEuRnJlcXVlbmN5IC0gYi5GcmVxdWVuY3kpXG4gICAgLm1hcCgobWFwOiBJQ2hpcnAsIGluZGV4OiBudW1iZXIpOiBJQ2hpcnAgPT4gKHsgLi4ubWFwLCBMb2NhdGlvbjogaW5kZXggfSkpO1xuXG4gIGNvbnN0IGxvbmc6IElDaGlycFtdID0gbWFwcGVkXG4gICAgLnNsaWNlKDAsIDIwMClcbiAgICAuc29ydCgoYTogSUNoaXJwLCBiOiBJQ2hpcnApID0+IGEuRnJlcXVlbmN5IC0gYi5GcmVxdWVuY3kpXG4gICAgLm1hcCgobWFwOiBJQ2hpcnAsIGluZGV4OiBudW1iZXIpOiBJQ2hpcnAgPT4gKHsgLi4ubWFwLCBMb2NhdGlvbjogaW5kZXggfSkpO1xuXG4gIGF3YWl0IHdyaXRlVG9Kc29uQW5kQ3N2KG91dEZpbGVOYW1lICsgJy1zaG9ydCcsIHNob3J0KTtcbiAgYXdhaXQgd3JpdGVUb0pzb25BbmRDc3Yob3V0RmlsZU5hbWUgKyAnLWxvbmcnLCBsb25nKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRvUmFkaW8ocmVwZWF0ZXI6IElSZXBlYXRlclN0cnVjdHVyZWQpOiBJQ2hpcnAge1xuICBsZXQgTmFtZTogc3RyaW5nID0gJyc7XG5cbiAgaWYgKHJlcGVhdGVyLkNhbGxzaWduKSB7XG4gICAgTmFtZSArPSByZXBlYXRlci5DYWxsc2lnbi50cmltKCk7XG4gIH1cblxuICBpZiAocmVwZWF0ZXIuTG9jYXRpb24gJiYgcmVwZWF0ZXIuTG9jYXRpb24uTG9jYWwpIHtcbiAgICBOYW1lICs9IChOYW1lID8gJyAnIDogJycpICsgcmVwZWF0ZXIuTG9jYXRpb24uTG9jYWwudHJpbSgpO1xuICB9XG5cbiAgaWYgKHJlcGVhdGVyLkZyZXF1ZW5jeSAmJiByZXBlYXRlci5GcmVxdWVuY3kuT3V0cHV0KSB7XG4gICAgTmFtZSArPSAoTmFtZSA/ICcgJyA6ICcnKSArIHJlcGVhdGVyLkZyZXF1ZW5jeS5PdXRwdXQudG9TdHJpbmcoKS50cmltKCk7XG4gIH1cblxuICBOYW1lID0gTmFtZS5yZXBsYWNlKC9bXjAtOS5hLXpBLVogXFwvXS9nLCAnJykudHJpbSgpO1xuICBOYW1lID0gTmFtZS5yZXBsYWNlKC9bIF0rL2csICcgJykudHJpbSgpO1xuICBOYW1lID0gTmFtZS5zdWJzdHIoMCwgOCkudHJpbSgpO1xuXG4gIGNvbnN0IEZyZXF1ZW5jeTogbnVtYmVyID0gcmVwZWF0ZXIuRnJlcXVlbmN5Lk91dHB1dDtcbiAgbGV0IE9mZnNldDogbnVtYmVyID0gcmVwZWF0ZXIuRnJlcXVlbmN5LklucHV0IC0gcmVwZWF0ZXIuRnJlcXVlbmN5Lk91dHB1dDtcbiAgY29uc3QgRHVwbGV4OiBDaGlycER1cGxleCA9IE9mZnNldCA+IDAgPyAnKycgOiBPZmZzZXQgPCAwID8gJy0nIDogJyc7XG4gIE9mZnNldCA9IE1hdGguYWJzKE1hdGgucm91bmQoT2Zmc2V0ICogMTAwKSAvIDEwMCk7XG4gIGxldCByVG9uZUZyZXE6IG51bWJlciB8IHVuZGVmaW5lZCA9IChyZXBlYXRlci5TcXVlbGNoVG9uZSAmJiByZXBlYXRlci5TcXVlbGNoVG9uZS5JbnB1dCk7XG4gIGxldCBjVG9uZUZyZXE6IG51bWJlciB8IHVuZGVmaW5lZCA9IChyZXBlYXRlci5TcXVlbGNoVG9uZSAmJiByZXBlYXRlci5TcXVlbGNoVG9uZS5PdXRwdXQpO1xuICBsZXQgRHRjc0NvZGU6IG51bWJlciB8IHVuZGVmaW5lZCA9IChyZXBlYXRlci5EaWdpdGFsVG9uZSAmJiByZXBlYXRlci5EaWdpdGFsVG9uZS5JbnB1dCk7XG4gIGxldCBEdGNzUnhDb2RlOiBudW1iZXIgfCB1bmRlZmluZWQgPSAocmVwZWF0ZXIuRGlnaXRhbFRvbmUgJiYgcmVwZWF0ZXIuRGlnaXRhbFRvbmUuT3V0cHV0KTtcbiAgbGV0IFRvbmU6IENoaXJwVG9uZSA9ICcnO1xuICBjb25zdCBNb2RlOiBDaGlycE1vZGUgPSAnRk0nO1xuICBsZXQgQ29tbWVudDogc3RyaW5nID0gYCR7cmVwZWF0ZXIuU3RhdGVJRH0gJHtyZXBlYXRlci5JRH0gJHtyZXBlYXRlci5Mb2NhdGlvbiAmJiByZXBlYXRlci5Mb2NhdGlvbi5EaXN0YW5jZSAmJiByZXBlYXRlci5Mb2NhdGlvbi5EaXN0YW5jZS50b0ZpeGVkKDIpfSAke3JlcGVhdGVyLkxvY2F0aW9uICYmIHJlcGVhdGVyLkxvY2F0aW9uLlN0YXRlfSAke3JlcGVhdGVyLkxvY2F0aW9uICYmIHJlcGVhdGVyLkxvY2F0aW9uLkNvdW50eX0gJHtyZXBlYXRlci5Mb2NhdGlvbiAmJiByZXBlYXRlci5Mb2NhdGlvbi5Mb2NhbH0gJHtyZXBlYXRlci5DYWxsc2lnbn1gO1xuICBDb21tZW50ID0gQ29tbWVudC5yZXBsYWNlKC91bmRlZmluZWQvZywgJyAnKS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuICAvLyBgJHtpdGVtWydTVC9QUiddIHx8ICcnfSAke2l0ZW0uQ291bnR5IHx8ICcnfSAke2l0ZW0uTG9jYXRpb24gfHwgJyd9ICR7aXRlbS5DYWxsIHx8ICcnfSAke2l0ZW0uU3BvbnNvciB8fCAnJ30gJHtpdGVtLkFmZmlsaWF0ZSB8fCAnJ30gJHtpdGVtLkZyZXF1ZW5jeX0gJHtpdGVtLlVzZSB8fCAnJ30gJHtpdGVtWydPcCBTdGF0dXMnXSB8fCAnJ30gJHtpdGVtLkNvbW1lbnQgfHwgJyd9YC5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gIC8vIENvbW1lbnQgPSBDb21tZW50LnRyaW0oKS5yZXBsYWNlKFwiLFwiLCBcIlwiKS5zdWJzdHJpbmcoMCwgMzEpLnRyaW0oKTtcblxuICBpZiAoclRvbmVGcmVxKSB7XG4gICAgVG9uZSA9ICdUb25lJztcbiAgfSBlbHNlIGlmIChEdGNzQ29kZSkge1xuICAgIFRvbmUgPSAnRFRDUyc7XG4gIH1cblxuICBpZiAoY1RvbmVGcmVxKSB7XG4gICAgVG9uZSA9ICdUU1FMJztcbiAgfSBlbHNlIGlmIChEdGNzUnhDb2RlKSB7XG4gICAgVG9uZSA9ICdEVENTJztcbiAgfVxuXG4gIGlmICgoclRvbmVGcmVxICYmIGNUb25lRnJlcSAmJiAoclRvbmVGcmVxICE9PSBjVG9uZUZyZXEpKSkge1xuICAgIFRvbmUgPSAnQ3Jvc3MnO1xuICB9XG5cbiAgY1RvbmVGcmVxID0gY1RvbmVGcmVxIHx8IDg4LjU7XG4gIHJUb25lRnJlcSA9IHJUb25lRnJlcSB8fCA4OC41O1xuICBEdGNzQ29kZSA9IER0Y3NDb2RlIHx8IDIzO1xuICBEdGNzUnhDb2RlID0gRHRjc1J4Q29kZSB8fCAyMztcblxuLy8gbG9nKGNoYWxrLmdyZWVuKFwiTWFkZSBSb3dcIiksIHJvdyk7XG4gIHJldHVybiB7XG4gICAgLi4uY2hpcnAsXG4vLyBMb2NhdGlvbixcbiAgICBOYW1lLFxuICAgIEZyZXF1ZW5jeSxcbiAgICBEdXBsZXgsXG4gICAgT2Zmc2V0LFxuICAgIHJUb25lRnJlcSxcbiAgICBjVG9uZUZyZXEsXG4gICAgRHRjc0NvZGUsXG4gICAgRHRjc1J4Q29kZSxcbiAgICBUb25lLFxuICAgIE1vZGUsXG4gICAgQ29tbWVudCxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4vLyBjb25zdCBjb0ZpbGVzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2RhdGEvQ08vXCIpKS5tYXAoKGYpID0+IGAuLi9kYXRhL0NPLyR7Zn1gKTtcbi8vIGNvbnN0IHV0RmlsZXMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiLi9yZXBlYXRlcnMvZGF0YS9VVC9cIikpLm1hcCgoZikgPT4gYC4uL2RhdGEvVVQvJHtmfWApO1xuLy8gY29uc3Qgbm1GaWxlcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9kYXRhL05NL1wiKSkubWFwKChmKSA9PiBgLi4vZGF0YS9OTS8ke2Z9YCk7XG4vLyBjb25zdCBjb0dyb3VwcyA9IChhd2FpdCByZWFkZGlyQXN5bmMoXCIuL3JlcGVhdGVycy9ncm91cHMvQ08vXCIpKS5tYXAoKGYpID0+IGBncm91cHMvQ08vJHtmfWApO1xuLy8gY29uc3QgdXRHcm91cHMgPSAoYXdhaXQgcmVhZGRpckFzeW5jKFwiLi9yZXBlYXRlcnMvZ3JvdXBzL1VUL1wiKSkubWFwKChmKSA9PiBgZ3JvdXBzL1VULyR7Zn1gKTtcbi8vIGNvbnN0IG5tR3JvdXBzID0gKGF3YWl0IHJlYWRkaXJBc3luYyhcIi4vcmVwZWF0ZXJzL2dyb3Vwcy9OTS9cIikpLm1hcCgoZikgPT4gYGdyb3Vwcy9OTS8ke2Z9YCk7XG4vLyBjb25zdCBhbGxGaWxlcyA9IFsuLi5jb0ZpbGVzLCAuLi51dEZpbGVzLCAuLi5ubUZpbGVzLCAuLi5jb0dyb3VwcywgLi4udXRHcm91cHMsIC4uLm5tR3JvdXBzXS5maWx0ZXIoKGYpID0+IC9cXC5qc29uJC8udGVzdChmKSkubWFwKChmKSA9PiBmLnJlcGxhY2UoXCIuanNvblwiLCBcIlwiKSk7XG4vLyBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcbi8vICAgYXdhaXQgZG9JdChmaWxlKTtcbi8vIH1cblxuLy8gYXdhaXQgZG9JdChcImRhdGEvcmVwZWF0ZXJzL2dyb3Vwcy9DTy9Db2xvcmFkbyBTcHJpbmdzIC0gQ2FsbC5qc29uXCIsIFwiZGF0YS9yZXBlYXRlcnMvY2hpcnAvZ3JvdXBzL0NPL0NvbG9yYWRvIFNwcmluZ3MgLSBDYWxsXCIpO1xuLy8gYXdhaXQgZG9JdChcImRhdGEvcmVwZWF0ZXJzL3Jlc3VsdHMvQ08vQ29sb3JhZG8gU3ByaW5ncy5qc29uXCIsIFwiZGF0YS9yZXBlYXRlcnMvY2hpcnAvQ08vQ29sb3JhZG8gU3ByaW5nc1wiKTtcbiAgYXdhaXQgZG9JdCgnLi4vZGF0YS9yZXBlYXRlcnMvY29udmVydGVkL0NPLmpzb24nLCAnLi4vZGF0YS9yZXBlYXRlcnMvY2hpcnAvQ08nKTtcbiAgLy8gYXdhaXQgZG9JdCgnLi4vZGF0YS9yZXBlYXRlcnMvZ3JvdXBzL2NvbWJpbmVkL0NPIC0gQ2FsbC5qc29uJywgJy4uL2RhdGEvcmVwZWF0ZXJzL2NoaXJwL2dyb3Vwcy9DTyAtIENhbGwnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnQoKTtcbiJdfQ==