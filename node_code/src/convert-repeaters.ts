import "module-alias/register";

import { getAllFilesFromDirectory, writeToJsonAndCsv } from "@helpers/fs-helpers";
import { createLog } from "@helpers/log-helpers";
import { IRepeaterRaw } from "@interfaces/i-repeater-raw";
import {
  IRepeaterDigitalModes,
  IRepeaterStructured,
  IRepeaterVOIPModes,
  RepeaterStatus,
  RepeaterUse,
} from "@interfaces/i-repeater-structured";

const log: (...msg: any[]) => void = createLog("Convert Repeaters");

export default (async (): Promise<void> => {
  const raw: IRepeaterRaw[][] = await getAllFilesFromDirectory("../data/repeaters/results/CO");
  log("Got", raw.length, "files");
  const ids: number[] = [];
  const converted: IRepeaterStructured[] = raw
    .reduce((output: IRepeaterStructured[], input: IRepeaterRaw[], index: number) => {
      log("Got", input.length, "repeaters from file", index + 1);
      return [...output, ...input.map(convertRepeater)];
    }, [])
    .filter((repeater: IRepeaterStructured) => {
      if (ids.includes(repeater.ID)) {
        return false;
      } else {
        ids.push(repeater.ID);
        return true;
      }
    });
  log("Converted", converted.length, "repeaters");
  await writeToJsonAndCsv("../data/repeaters/converted/CO", converted);
})();

function convertRepeater(raw: IRepeaterRaw): IRepeaterStructured {
  return {
    ID: convertNumber(raw.ID) as number,
    StateID: convertNumber(raw.state_id) as number,
    Callsign: raw.Call,
    Location: {
      Latitude: raw.Latitude,
      Longitude: raw.Longitude,
      County: raw.County,
      State: raw["ST/PR"],
      Local: raw.Location,
    },
    Use: convertRepeaterUse(raw.Use),
    Status: convertRepeaterStatus(raw["Op Status"]),
    Frequency: { Input: convertNumber(raw.Uplink) || (raw.Downlink + raw.Offset), Output: raw.Downlink },
    SquelchTone: convertRepeaterSquelchTone(raw["Uplink Tone"] || raw.Tone, raw["Downlink Tone"]),
    DigitalTone: convertRepeaterDigitalTone(raw["Uplink Tone"] || raw.Tone, raw["Downlink Tone"]),
    Digital: convertRepeaterDigitalData(raw),
    VOIP: convertRepeaterVOIP(raw),
  };
}

function convertRepeaterUse(raw: string): RepeaterUse {
  switch (raw.toLowerCase()) {
    case "open":
      return RepeaterUse.Open;
    case "closed":
      return RepeaterUse.Closed;
    case "private":
      return RepeaterUse.Private;
    default:
      return RepeaterUse.Other;
  }
}

function convertRepeaterStatus(raw: string | undefined): RepeaterStatus {
  if (!raw) {
    return RepeaterStatus.Other;
  }
  switch (raw.toLowerCase()) {
    case "on-air":
      return RepeaterStatus.OnAir;
    case "off-air":
      return RepeaterStatus.OffAir;
    case "testing":
      return RepeaterStatus.Testing;
    case "unknown":
      return RepeaterStatus.Unknown;
    default:
      return RepeaterStatus.Other;
  }
}

function convertRepeaterSquelchTone(rawInput: string | number | undefined, rawOutput: string | number | undefined): { Input?: number; Output?: number } | undefined {
  if (!rawInput && !rawOutput) {
    return undefined;
  }
  const converted: { Input: number | undefined; Output: number | undefined } = {
    Input: convertNumber(rawInput),
    Output: convertNumber(rawOutput),
  };
  if (converted.Input || converted.Output) {
    return converted;
  }
  return undefined;
}

function convertRepeaterDigitalTone(rawInput: string | number | undefined, rawOutput: string | number | undefined): { Input?: number; Output?: number } | undefined {
  if (!rawInput && !rawOutput) {
    return undefined;
  }
  const digitalFilter: RegExp = /^D(\d+)$/;
  const converted: { Input: number | undefined; Output: number | undefined } = {
    Input: typeof rawInput === "string" ? convertNumber(rawInput, digitalFilter) : undefined,
    Output: typeof rawOutput === "string" ? convertNumber(rawOutput, digitalFilter) : undefined,
  };
  if (converted.Input || converted.Output) {
    return converted;
  }
  return undefined;
}

function convertNumber(input: string | number | undefined, numberFilter: RegExp = /^([+-]?\d+\.?\d*)$/): number | undefined {
  if (typeof input === "number" && !isNaN(input)) {
    return input;
  } else if (typeof input === "number" && isNaN(input)) {
    return undefined;
  } else if (typeof input === "string" && numberFilter.test(input)) {
    const match: RegExpMatchArray | null = input.match(numberFilter);
    if (match && match[1]) {
      const converted: number = parseFloat(match[1]);
      return !isNaN(converted) ? converted : undefined;
    }
  }
}

function convertRepeaterDigitalData(raw: IRepeaterRaw): IRepeaterDigitalModes | undefined {
  const converted: IRepeaterDigitalModes = {
    // TODO: ATV?: boolean;
    DMR: (raw.DGTL.includes("D") || raw["DMR Enabled"]) ? {
      ColorCode: convertNumber(raw["Color Code"]),
      ID: convertNumber(raw["DMR ID"]),
    } : undefined,
    P25: (raw.DGTL.includes("P") || raw["P-25 Digital Enabled"]) ? { NAC: convertNumber(raw.NAC) } : undefined,
    DStar: (raw.DGTL.includes("S") || raw["D-STAR Enabled"]) ? { Node: raw.Node } : undefined,
    YSF: (raw.DGTL.includes("Y") || raw["YSF Digital Enabled"]) ? {
      GroupID: {
        Input: typeof raw["DG-ID"] === "number" ? raw["DG-ID"] : typeof raw["DG-ID"] === "string" ? raw["DG-ID"].split("/")[0].trim() : undefined,
        Output: typeof raw["DG-ID"] === "number" ? raw["DG-ID"] : typeof raw["DG-ID"] === "string" ? raw["DG-ID"].split("/")[1].trim() : undefined,
      },
    } : undefined,
  };
  if (converted.DMR || converted.P25 || converted.DStar || converted.YSF) {
    return converted;
  }
}

function convertRepeaterVOIP(raw: IRepeaterRaw): IRepeaterVOIPModes | undefined {
  const converted: IRepeaterVOIPModes = {
    AllStar: (raw.VOIP.includes("A") || raw.AllStar) ? { NodeID: convertNumber(raw.AllStar) } : undefined,
    EchoLink: (raw.VOIP.includes("E") || raw.EchoLink) ? {
      NodeID: raw.EchoLink,
    } : undefined, // TODO: Status?: EchoLinkNodeStatus
    IRLP: (raw.VOIP.includes("I") || raw.IRLP) ? { NodeID: convertNumber(raw.IRLP) } : undefined,
    Wires: (raw.VOIP.includes("W") || raw["WIRES-X"]) ? { ID: convertNumber(raw["WIRES-X"]) } : undefined,
  };
  if (converted.AllStar || converted.EchoLink || converted.IRLP || converted.Wires) {
    return converted;
  }
}
