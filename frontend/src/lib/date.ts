export const getSeason = (month: number) => {
  if (month >= 2 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 11) return 'Fall';
  return 'Winter';
};

export const formatSeason = (date?: string) => {
  if (!date || !/^\d{4}-\d{2}/.test(date)) return '';
  return `${getSeason(Number(date.slice(5, 7)))} ${date.slice(0, 4)}`;
};
