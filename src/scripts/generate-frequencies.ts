import 'module-alias/register';

import { writeFileAsync } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { IFrequencyDefinition } from '@interfaces/i-frequency-definition';
import { IRepeaterRaw } from '@interfaces/i-repeater-raw';

const log: (...msg: any[]) => void = createLog('Generate Frequencies');
let frequencies: IRepeaterRaw[] = [];
const range2m: IFrequencyDefinition[] = [
  // Channels
  { start: 146.4, end: 146.595, steps: [0.015], name: `FM Voice` },
  { start: 147.42, end: 147.585, steps: [0.015], name: `FM Voice` },

  // Range
  { start: 144.9, end: 145.1, steps: [0.015], name: `Weak Signal, FM, Digital/Packet` },
  { start: 145.5, end: 145.8, steps: [0.015], name: `Miscellaneous and Experimental Modes` },
];

const range125m: IFrequencyDefinition[] = [
  // Channels
  { start: 223.4, end: 223.52, steps: [0.020], name: `FM Voice` },
  { start: 222.16, end: 222.24, steps: [0.020], name: `Mixed Mode` },
  { start: 223.72, end: 223.84, steps: [0.020], name: `Mixed Mode` },

  // Range
  { start: 223.53, end: 223.63, steps: [0.020], name: `Digital/Packet` },
];

const range70cm: IFrequencyDefinition[] = [
  // Channels
  { start: 440.7, end: 441.3, steps: [0.025], name: `Mixed Mode` },
  { start: 445.7, end: 446.275, steps: [0.025], name: `FM Voice` },
  { start: 446.2, end: 446.3, steps: [0.0125], name: `Digital Voice Narrowband` },

  // Range
  { start: 434.5, end: 435, steps: [0.025], name: `Mixed Mode Digital and Voice` },
  { start: 439.5, end: 440, steps: [0.025], name: `Mixed Mode Digital and Voice` },
];

[...range2m, ...range125m, ...range70cm].forEach((range: IFrequencyDefinition) => {
  range.steps.forEach((step: number) => {
    for (let i: number = range.start; i <= range.end; i += step) {
      const p: number = Math.round(i * 100000) / 100000;
      if (!frequencies.find((f: IRepeaterRaw) => f.Frequency === p)) {
        frequencies.push({ Frequency: p, Name: range.name } as any);
      }
    }
  });
});
frequencies = frequencies.sort((a: IRepeaterRaw, b: IRepeaterRaw) => (a.Frequency || 0) - (b.Frequency || 0));
log(frequencies, frequencies.length);
writeFileAsync(`./data/frequencies.json`, JSON.stringify(frequencies, null, 2))
  .then((r: unknown) => log(`Done`, r));
