import "module-alias/register";

import {writeFileAsync, writeToJsonAndCsv} from "@helpers/fs-helpers";
import {createLog} from "@helpers/log-helpers";
import {IRepeater} from "@scripts/modules/i.repeater";

interface IFrequencyDefinition { start: number; end: number; name: string; steps: number[]; }

const log: (...msg: any[]) => void = createLog("Generate Frequencies");
let frequencies: IRepeater[] = [];
const range2m: IFrequencyDefinition[] = [
  // { start: 146.835, end: 146.865, steps: [0.015], name: `Emergency and Special Event (E&SE) Repeater Pairs` },
  // { start: 145.1150, end: 147.3900, steps: [0.015], name: `Repeater Pairs` },
  // { start: 146.400, end: 147.585, steps: [0.015], name: `Voice Simplex Frequencies` },
  // { start: 145.190, end: 147.315, steps: [0.015], name: `Shared Non-Protected (SNP) Repeater Pairs` },

  { start: 144.900, end: 145.100, steps: [0.015], name: `Weak Signal, Simplex, Digital/Packet` },
  // { start: 145.100, end: 145.500, steps: [0.015], name: `Repeater Outputs` },
  { start: 145.500, end: 145.800, steps: [0.015], name: `Miscellaneous and Experimental Modes` },
  { start: 146.400, end: 146.580, steps: [0.015], name: `Voice Simplex` },
  // { start: 146.610, end: 147.390, steps: [0.015], name: `Repeater Outputs` },
  { start: 147.420, end: 147.570, steps: [0.015], name: `Voice Simplex` },
];
  // .sort((a, b) => b.end - a.end)
  // .sort((a, b) => b.start - a.start)
  // .sort((a, b) => b.end - a.end)
  // .sort((a, b) => b.start - a.start);

const range125m: IFrequencyDefinition[] = [
  { start: 223.4000, end: 223.5200, steps: [0.020], name: `Voice Simplex Frequencies` },
  { start: 222.160, end: 222.240, steps: [0.020], name: `Mixed mode (Coordinators Option)` },
  { start: 223.720, end: 223.840, steps: [0.020], name: `Mixed mode (Coordinators Option)` },

  { start: 222.150, end: 222.250, steps: [0.020], name: `Coordinators Option - Mixed Mode.` },
  { start: 223.390, end: 223.530, steps: [0.020], name: `Voice Simplex` },
  { start: 223.530, end: 223.630, steps: [0.020], name: `Digital/Packet` },
  { start: 223.710, end: 223.850, steps: [0.020], name: `Coordinators Option` },
];
const range70cm: IFrequencyDefinition[] = [

  { start: 440.7000, end: 441.2750, steps: [0.025], name: `Mixed mode (Voice and Data) Simplex Frequencies` },
  { start: 445.7000, end: 446.2750, steps: [0.025], name: `Voice Simplex Frequencies` },
  { start: 446.2000, end: 446.3000, steps: [0.0125], name: `Narrowband Digital Voice Simplex Frequencies` },
  // { start: 447.0250, end: 449.9750, steps: [0.025], name: `Repeater Operation - Full Duplex` },
  // { start: 438.0250, end: 439.4750, steps: [0.025], name: `Auxiliary Operation - Full Duplex` },
  // { start: 445.0125, end: 445.2875, steps: [0.0125], name: `Narrowband Digital Voice Repeater and Auxiliary Operation - Full Duplex` },
  // { start: 446.7250, end: 447.0000, steps: [0.0125], name: `Narrowband Digital Voice Repeater and Auxiliary Operation - Full Duplex` },
  // { start: 445.3000, end: 445.7000, steps: [0.025], name: `Auxiliary Operation - Full Duplex` },
  // { start: 446.5000, end: 446.6750, steps: [0.025], name: `Auxiliary Operation - Full Duplex` },
  // { start: 446.3000, end: 446.4750, steps: [0.025], name: `Auxiliary Operation - Very Wide Area Coverage - Full Duplex` },

  { start: 434.5000, end: 435.0000, steps: [0.025], name: `Mixed Mode, Digital and Voice` },
  // { start: 438.0000, end: 439.5000, steps: [0.025], name: `Auxiliary Operation (Full Duplex) - Outputs` },
  { start: 439.5000, end: 440.0000, steps: [0.025], name: `Mixed Mode, Digital and Voice` },
  { start: 440.7000, end: 441.3000, steps: [0.025], name: `Mixed Mode Simplex - Voice` },
  // { start: 445.0000, end: 445.3000, steps: [0.0125], name: `Aux and Rptr Narrowband (Full Duplex) - Outputs` },
  // { start: 445.3000, end: 445.7000, steps: [0.025], name: `Auxiliary Operation (Full Duplex) - Outputs` },
  { start: 445.7000, end: 446.3000, steps: [0.025], name: `Mixed Mode Simplex - Digital and Voice` },
  // { start: 446.3000, end: 446.5000, steps: [0.025], name: `Auxiliary Operation (Full Duplex) Wide Area - Out` },
  // { start: 446.5000, end: 446.7000, steps: [0.025], name: `Auxiliary Operation (Full Duplex) - Outputs` },
  // { start: 446.7000, end: 447.0000, steps: [0.0125], name: `Narrowband Digital Voice Repeaters - Outputs` },
  // { start: 447.0000, end: 450.0000, steps: [0.025], name: `Repeaters - Outputs` },
];
  // .sort((a, b) => b.end - a.end)
  // .sort((a, b) => b.start - a.start)
  // .sort((a, b) => b.end - a.end)
  // .sort((a, b) => b.start - a.start);

[...range2m, ...range125m, ...range70cm].forEach((range: { start: number; end: number; name: string; steps: number[] }) => {
  range.steps.forEach((step: number) => {
    for (let i: number = range.start; i < range.end; i += step) {
      const p: number = Math.round(i * 100000) / 100000;
      if (!frequencies.find((f: IRepeater) => f.Frequency === p)) {
        frequencies.push({ Frequency: p, Comment: range.name } as any);
      }
    }
  });
});
frequencies = frequencies.sort((a: IRepeater, b: IRepeater) => a.Frequency - b.Frequency);
log(frequencies, frequencies.length);
writeFileAsync(`./data/frequencies.json`, JSON.stringify(frequencies, null, 2))
  .then((r: unknown) => log(`Done`, r));
