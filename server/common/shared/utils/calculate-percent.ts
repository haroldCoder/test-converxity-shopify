export const calculatePercent = (
  total: number,
  percent: number
): number => {
  return Number((total * (percent / 100)).toFixed(2));
};