export function getVisiblePages(currentPage: number, totalPages: number, max = 8) {
  const size = Math.min(max, totalPages);
  const idealStart = currentPage - Math.floor((size - 1) / 2);
  const start = Math.max(1, Math.min(idealStart, totalPages - size + 1));

  return Array.from({ length: size }, (_, index) => start + index);
}

export function getRange(currentPage: number, pageSize: number, totalItems: number) {
  if (totalItems === 0) return { start: 0, end: 0 };

  const start = (currentPage - 1) * pageSize + 1;
  return { start, end: Math.min(currentPage * pageSize, totalItems) };
}
