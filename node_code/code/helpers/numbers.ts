export function powAndFix(fValue: number, decimals: number, offset: number = 1): number {
  const sValue: string = fValue.toString();
  const precision: number = sValue.length - ((sValue.indexOf('.') || sValue.length) + 1);
  const stageA: number = Math.round(fValue * Math.pow(10, precision));
  const stageB: number = Math.pow(10, decimals - precision);
  const stageC: number = (stageA * stageB) * Math.pow(10, offset);
  const result: number = Math.round(stageC) / Math.pow(10, offset);
  console.log('fValue', fValue, 'decimals', decimals, 'offset', offset,
    'sValue', sValue, 'precision', precision,
    'stageA', stageA, 'stageB', stageB, 'stageC', stageC,
    'result', result);
  return result;
}
