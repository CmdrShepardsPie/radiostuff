import chalk, { Chalk } from 'chalk';

let lastMessageInline: boolean = false;
let lastContext: string;

const bgColors: (keyof Chalk)[] = [
  // "bgBlack",
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  // "bgWhite",
  // "bgBlackBright",
  // "bgRedBright",
  // "bgGreenBright",
  // "bgYellowBright",
  // "bgBlueBright",
  // "bgMagentaBright",
  // "bgCyanBright",
  // "bgWhiteBright",
];
let lastColor: number = 0;

export function createOut(context: string, color?: keyof Chalk): { log: (...msg: any[]) => void; write: (...msg: any[]) => void } {
  if (!color) {
    color = bgColors[lastColor];
    lastColor += 1;
    if (lastColor >= bgColors.length) {
      lastColor = 0;
    }
  }
  return { log: createLog(context, color), write: createWrite(context, color) };
}

export function createLog(context: string, color?: keyof Chalk): (...msg: any[]) => void {
  if (!color) {
    color = bgColors[lastColor];
    lastColor += 1;
    if (lastColor >= bgColors.length) {
      lastColor = 0;
    }
  }
  // @ts-ignore
  const chalkColorFn: Chalk = chalk[color];

  return (...msg: any[]): void => {
    msg = msg.map(prepIfJson);

    // if (lastContext !== context) {
    //   createEmptyLine();
    // }
    if (lastMessageInline) {
      createEmptyLine();
    }

    const args: any[] = [chalkColorFn(`${context}:`), ...msg];

    console.log(...args);
    lastMessageInline = false;
    lastContext = context;
  };
}

export function createWrite(context: string, color?: keyof Chalk): (...msg: any[]) => void {
  if (!color) {
    color = bgColors[lastColor];
    lastColor += 1;
    if (lastColor >= bgColors.length) {
      lastColor = 0;
    }
  }
  // @ts-ignore
  const chalkColorFn: Chalk = chalk[color];

  return (...msg: any[]): void => {
    if (!lastMessageInline) {
      process.stdout.write(chalkColorFn(`${context}:`) + ' ');
    }
    if (lastMessageInline && lastContext !== context) {
      createEmptyLine();
      process.stdout.write(chalkColorFn(`${context}:`) + ' ');
    }
    process.stdout.write(msg.join(' '));
    lastMessageInline = true;
    lastContext = context;
  };
}

export function createThrowError(context: string): (type: string, ...msg: any[]) => void {
  const color: keyof Chalk = bgColors[lastColor];
  lastColor += 1;
  if (lastColor >= bgColors.length) {
    lastColor = 0;
  }
  // @ts-ignore
  const chalkColorFn: Chalk = chalk[color];

  return (type: string, ...msg: any[]): void => {
    console.log(chalkColorFn(`${context}:`), chalk.red(`${type} Error:`), ...msg);
    process.exit(1);
  };
}

function prepIfJson(t: any): Error | string {
  if (t instanceof Error) {
    return t;
  }
  if (typeof t === 'string') {
    try {
      t = JSON.parse(t);
    } catch (e) {
      /* no empty */
    }
  }
  if (typeof t === 'object') {
    try {
      t = JSON.stringify(t, null, 4);
      t = colorizeJsonString(t);
    } catch (e) {
      /* no empty */
    }
  }
  return t;
}

function colorizeJsonString(json: string): string {
  // Strings
  json = json.replace(
    /(\s+)("[^"]*")(,?[\r\n])/gi,
    `$1${chalk.yellow('$2')}$3`,
  );
  // booleans, numbers, etc.
  json = json.replace(
    /(\s+)([^"[{\]}][^[\]{}"\n\r,]*)(,?[\r\n])/gi,
    `$1${chalk.cyan('$2')}$3`,
  );
  // Keys
  json = json.replace(/("[^"]*"):/gi, `${chalk.magenta('$1')}:`);
  return json;
}

function createEmptyLine(): void {
  console.log();
}
