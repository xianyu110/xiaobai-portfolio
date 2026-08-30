export function getIsoTimestr(): string {
  return new Date().toISOString();
}

export const getTimestamp = () => {
  return Date.parse(new Date().toUTCString()) / 1000;
};

export const getMillisecond = () => {
  return new Date().getTime();
};

export function formatDateTime(
  input: string | number | Date | null | undefined
): string {
  if (!input) return '—';
  const d = new Date(input);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export const getOneYearLaterTimestr = () => {
  const currentDate = new Date();
  const oneYearLater = new Date(currentDate);
  oneYearLater.setFullYear(currentDate.getFullYear() + 1);
  return oneYearLater.toISOString();
};
