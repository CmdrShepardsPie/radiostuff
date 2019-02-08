export function getTextOrNumber(el: Element) {
  const value = getText(el);
  const num = getNumber(value);
  return !isNaN(num) ? num : value;
}

export function getNumber(text: string, reg: RegExp = /([-+]?\d*\.?\d*)/g) {
  let result = NaN;
  if (text && text.match) {
    const match = reg.exec(text);
    // console.log('match', match);
    if (match) {
      result = parseFloat(match[1]);
    }
  }
  return result;
}

export function getText(el: Element) {
  if (el) {
    let text: string = el.innerHTML;
    if (text) {
      text = text.replace(/<script>.*<\/script>/g, " ");
      text = text.replace(/<[^>]*>/g, " ");
      return text.trim();
    }
  }
  return "";
}

export function mapDir(dir: string): number {
  switch (dir) {
    case "N":
      return 1;
    case "NE":
      return 2;
    case "E":
      return 3;
    case "SE":
      return 4;
    case "S":
      return 5;
    case "SW":
      return 6;
    case "W":
      return 7;
    case "NW":
      return 8;
  }
  return 0;
}
