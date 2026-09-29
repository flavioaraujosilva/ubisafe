export function getVisiblePages(currentPage: number, totalPages: number, max = 8) {
  const size = Math.min(max, totalPages);
  const idealStart = currentPage - Math.floor((size - 1) / 2);
  const start = Math.max(1, Math.min(idealStart, totalPages - size + 1));

  return Array.from({ length: size }, (_, index) => start + index);
}
