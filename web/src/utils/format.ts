const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(isoDate: string) {
  const data = new Date(isoDate);
  return Number.isNaN(data.getTime()) ? '-' : dateFormatter.format(data);
}
