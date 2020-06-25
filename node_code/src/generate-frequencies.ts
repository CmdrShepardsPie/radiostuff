import 'module-alias/register';

import { writeFileAsync } from '@helpers/fs-helpers';
import { powAndFix } from '@helpers/numbers';
import { InputFrequency } from '@interfaces/input-frequency';

const range2m: InputFrequency[] = [
  // Channels
  { start: 146.4, end: 146.595, steps: [0.015], name: `FM Voice` },
  { start: 147.42, end: 147.585, steps: [0.015], name: `FM Voice` },

  // Range
  { start: 144.9, end: 145.1, steps: [0.015], name: `Weak Signal, FM, Digital/Packet` },
  { start: 145.5, end: 145.8, steps: [0.015], name: `Miscellaneous and Experimental Modes` },
];

const range125m: InputFrequency[] = [
  // Channels
  { start: 223.4, end: 223.52, steps: [0.020], name: `FM Voice` },
  { start: 222.16, end: 222.24, steps: [0.020], name: `Mixed Mode` },
  { start: 223.72, end: 223.84, steps: [0.020], name: `Mixed Mode` },

  // Range
  { start: 223.53, end: 223.63, steps: [0.020], name: `Digital/Packet` },
];

const range70cm: InputFrequency[] = [
  // Channels
  { start: 440.7, end: 441.3, steps: [0.025], name: `Mixed Mode` },
  { start: 445.7, end: 446.275, steps: [0.025], name: `FM Voice` },
  { start: 446.2, end: 446.3, steps: [0.0125], name: `Digital Voice Narrowband` },

  // Range
  { start: 434.5, end: 435, steps: [0.025], name: `Mixed Mode Digital and Voice` },
  { start: 439.5, end: 440, steps: [0.025], name: `Mixed Mode Digital and Voice` },
];

interface IOutputFrequency {
  Frequency: number;
  Name: string;
}

let frequencies: IOutputFrequency[] = [];
const existingFrequencies: { [key: string]: boolean } = {};

const points: number = 5;

[...range2m, ...range125m, ...range70cm].forEach((range: InputFrequency) => {
  range.steps.forEach((s: number) => {
    const step: number = powAndFix(s, points);
    const start: number = powAndFix(range.start, points);
    const end: number = powAndFix(range.end, points) + step;
    for (let i: number = start; i < end; i += step) {
      const frequency: number = powAndFix(i, -points, points);
      const definition: IOutputFrequency = { Frequency: frequency, Name: range.name };
      if (!existingFrequencies[frequency]) {
        frequencies.push(definition);
        existingFrequencies[frequency] = true;
        console.log('step', step, 'start', start, 'end', end, 'i', i, 'frequency', frequency);
      }
    }
  });
});
frequencies = frequencies.sort(
  (a: IOutputFrequency, b: IOutputFrequency) => (a.Frequency || 0) - (b.Frequency || 0));
writeFileAsync(`../data/frequencies.json`, JSON.stringify(frequencies, null, 2))
  // tslint:disable-next-line:no-empty
  .then((r: unknown) => {
  });
