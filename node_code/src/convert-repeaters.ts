import 'module-alias/register';

import { getAllFilesInDirectory, readFileAsync, splitExtension, writeToCsv, writeToJson } from '@helpers/fs-helpers';
import { createLog } from '@helpers/log-helpers';
import { RepeaterRaw } from '@interfaces/repeater-raw';
import {
  RepeaterDigitalModes,
  RepeaterStructured,
  RepeaterVOIPModes,
  RepeaterStatus,
  RepeaterUse,
} from '@interfaces/repeater-structured';

const log: (...msg: any[]) => void = createLog('Convert Repeaters');

export default (async (): Promise<void> => {

  const files: string[] = await getAllFilesInDirectory('../data/repeaters/scraped/json', 'json', 1);
  log('Got', files.length, 'files');

  const promises: Promise<void>[] = [];

  await Promise.all(files.map(async (file: string, fileIndex: number): Promise<void> => {
    const fileBuffer: Buffer = await readFileAsync(file);
    const fileString: string = fileBuffer.toString();
    const fileData: RepeaterRaw | RepeaterRaw[] = JSON.parse(fileString);
    // log('File', file, typeof fileData, Array.isArray(fileData), fileData);
    if (typeof fileData === 'object') {
      if (Array.isArray(fileData)) {
        const converted: RepeaterStructured[] = fileData
          .reduce((output: RepeaterStructured[], input: RepeaterRaw, rowIndex: number): RepeaterStructured[] => {
            log(`converting repeater ${ input.Call } (${ rowIndex + 1 }/${ fileData.length }) from ${ file } (${ fileIndex + 1 }/${ files.length })`);
            const repeater: RepeaterStructured = convertRepeater(input);
            // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
            promises.push(writeToJson(`../data/repeaters/converted/json/${ repeater.StateID }/${ repeater.ID }`, repeater));
            promises.push(writeToCsv(`../data/repeaters/converted/csv/${ repeater.StateID }/${ repeater.ID }`, repeater));
            return [...output, repeater];
          }, [] as RepeaterStructured[]);
        // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
        promises.push(writeToJson(`../data/repeaters/converted/json/${ splitExtension(file).name }`, converted));
        promises.push(writeToCsv(`../data/repeaters/converted/csv/${ splitExtension(file).name }`, converted));
      } else {
        log(`converting repeater ${ fileData.Call } from ${ file } (${ fileIndex + 1 }/${ files.length })`);
        const repeater: RepeaterStructured = convertRepeater(fileData);
        // Don't care when the fs write promises return, they do not affect the outcome and node won't terminate until the handles are closed
        promises.push(writeToJson(`../data/repeaters/converted/json/${ repeater.StateID }/${ repeater.ID }`, repeater));
        promises.push(writeToCsv(`../data/repeaters/converted/csv/${ repeater.StateID }/${ repeater.ID }`, repeater));
      }
    }
  }));

  await Promise.all(promises);
})();

function convertRepeater(raw: RepeaterRaw): RepeaterStructured {
  return {
    ID: convertNumber(raw.ID) as number,
    StateID: convertNumber(raw.state_id) as number,
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

function convertRepeaterUse(raw: string): RepeaterUse {
  switch (raw.toLowerCase()) {
    case 'open':
      return RepeaterUse.Open;
    case 'closed':
      return RepeaterUse.Closed;
    case 'private':
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
    case 'on-air':
      return RepeaterStatus.OnAir;
    case 'off-air':
      return RepeaterStatus.OffAir;
    case 'testing':
      return RepeaterStatus.Testing;
    case 'unknown':
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
    Input: typeof rawInput === 'string' ? convertNumber(rawInput, digitalFilter) : undefined,
    Output: typeof rawOutput === 'string' ? convertNumber(rawOutput, digitalFilter) : undefined,
  };
  if (converted.Input || converted.Output) {
    return converted;
  }
  return undefined;
}

function convertNumber(input: string | number | undefined, numberFilter: RegExp = /^([+-]?\d+\.?\d*)$/): number | undefined {
  if (typeof input === 'number' && !isNaN(input)) {
    return input;
  } else if (typeof input === 'number' && isNaN(input)) {
    return undefined;
  } else if (typeof input === 'string' && numberFilter.test(input)) {
    const match: RegExpMatchArray | null = input.match(numberFilter);
    if (match && match[1]) {
      const converted: number = parseFloat(match[1]);
      return !isNaN(converted) ? converted : undefined;
    }
  }
}

function convertRepeaterDigitalData(raw: RepeaterRaw): RepeaterDigitalModes | undefined {
  const converted: RepeaterDigitalModes = {
    // TODO: ATV?: boolean;
    DMR: ((raw.DGTL && raw.DGTL.includes('D')) || (raw.Mode && raw.Mode.includes('DMR')) || raw['DMR Enabled']) ? {
      ColorCode: convertNumber(raw['Color Code']),
      ID: convertNumber(raw['DMR ID']),
    } : undefined,

    P25: ((raw.DGTL && raw.DGTL.includes('P')) || (raw.Mode && raw.Mode.includes('P25')) || raw['P-25 Digital Enabled']) ? { NAC: convertNumber(raw.NAC) } : undefined,

    // TODO: Convert D-Star nodes to programmable format
    DStar: ((raw.DGTL && raw.DGTL.includes('S')) || (raw.Mode && raw.Mode.includes('DSTAR')) || raw['D-STAR Enabled']) ? { Node: raw.Node } : undefined,

    // NXDN WIP untested
    NXDN: ((raw.DGTL && raw.DGTL.includes('N')) || (raw.Mode && raw.Mode.includes('NXDN')) || raw['NXDN Enabled']) ? { RAN: convertNumber(raw.RAN) } : undefined,

    YSF: ((raw.DGTL && raw.DGTL.includes('Y')) || (raw.Mode && raw.Mode.includes('Fusion')) || raw['YSF Digital Enabled']) ? {
      GroupID: {
        // TODO: Convert "Open" to 0 (confirm this is correct?)
        Input: typeof raw['DG-ID'] === 'number' ? raw['DG-ID'] : typeof raw['DG-ID'] === 'string' ? raw['DG-ID'].split('/')[0].trim() : undefined,
        Output: typeof raw['DG-ID'] === 'number' ? raw['DG-ID'] : typeof raw['DG-ID'] === 'string' ? raw['DG-ID'].split('/')[1].trim() : undefined,
      },
    } : undefined,
  };
  if (converted.DMR || converted.P25 || converted.DStar || converted.NXDN || converted.YSF) {
    return converted;
  }
}

function convertRepeaterVOIP(raw: RepeaterRaw): RepeaterVOIPModes | undefined {
  const converted: RepeaterVOIPModes = {
    AllStar: ((raw.VOIP && raw.VOIP.includes('A')) || (raw.Mode && raw.Mode.includes('AllStar')) || raw.AllStar) ? { NodeID: convertNumber(raw.AllStar) } : undefined,

    EchoLink: ((raw.VOIP && raw.VOIP.includes('E')) || (raw.Mode && raw.Mode.includes('EchoLink')) || raw.EchoLink) ? {
      NodeID: raw.EchoLink,
    } : undefined, // TODO: Status?: EchoLinkNodeStatus

    IRLP: ((raw.VOIP && raw.VOIP.includes('I')) || (raw.Mode && raw.Mode.includes('IRLP')) || raw.IRLP) ? { NodeID: convertNumber(raw.IRLP) } : undefined,

    Wires: ((raw.VOIP && raw.VOIP.includes('W')) || (raw.Mode && raw.Mode.includes('WIRES-X')) || raw['WIRES-X']) ? { ID: convertNumber(raw['WIRES-X']) } : undefined,
  };
  if (converted.AllStar || converted.EchoLink || converted.IRLP || converted.Wires) {
    return converted;
  }
}
