import "module-alias/register";

import {getAllFilesFromDirectory, writeToJsonAndCsv} from "@helpers/fs-helpers";
import {numberToString} from "@helpers/helpers";
import {createLog} from "@helpers/log-helpers";

const log = createLog("Combine");

export default (async () => {
  const myPoint = [38.833881, -104.821365];
  const combined: any[] = [];
  const files = await getAllFilesFromDirectory<any[]>("data/repeaters/results/CO");
  log("Got", files.length, "files");
  const found: { [key: string]: boolean } = {};
  files.forEach((file) => {
    log("Got", file.length, "repeaters");
    file.forEach((item) => {
      if (!found[`${item.state_id}-${item.ID}`]) {
        found[`${item.state_id}-${item.ID}`] = true;
        combined.push(item);
        const x = Math.pow(item.Latitude - myPoint[0], 2);
        const y = Math.pow(item.Longitude - myPoint[1], 2);
        item.Mi = Math.pow(x + y, 1 / 2);
      }
    });
  });
  log("Got", combined.length, "unique repeaters");
  combined.sort((a, b) => {
    const aMi = numberToString(a.Mi * 100, 3, 24);
    const bMi = numberToString(b.Mi * 100, 3, 24);
    const aRepeaterName = a.Call;
    const bRepeaterName = b.Call;
    const aFrequency = numberToString(a.Frequency, 4, 5);
    const bFrequency = numberToString(b.Frequency, 4, 5);
    const aStr = `${aMi} ${aRepeaterName} ${aFrequency}`;
    const bStr = `${bMi} ${bRepeaterName} ${bFrequency}`;

    return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
  });
  // combined.slice(0, 100).forEach((c) => log(c.Call, "\t", c.Latitude, "\t", c.Longitude, "\t", c.Mi));
  await writeToJsonAndCsv("data/repeaters/combined/CO", combined);
})();
