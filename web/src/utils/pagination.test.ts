import { describe, expect, it } from 'vitest';
import { getRange, getVisiblePages } from './pagination';

describe('getVisiblePages', () => {
  it('mostra todas as páginas quando cabem no limite', () => {
    expect(getVisiblePages(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('começa na primeira página quando a atual está no início', () => {
    expect(getVisiblePages(2, 20)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('centraliza a página atual no meio da lista', () => {
    expect(getVisiblePages(10, 20)).toEqual([7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it('termina na última página quando a atual está no fim', () => {
    expect(getVisiblePages(19, 20)).toEqual([13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('retorna lista vazia quando não há páginas', () => {
    expect(getVisiblePages(1, 0)).toEqual([]);
  });
});

describe('getRange', () => {
  it('calcula o primeiro e o último item da página', () => {
    expect(getRange(4, 15, 6748)).toEqual({ start: 46, end: 60 });
  });

  it('limita o fim ao total na última página', () => {
    expect(getRange(7, 15, 100)).toEqual({ start: 91, end: 100 });
  });

  it('retorna zero quando não há itens', () => {
    expect(getRange(1, 15, 0)).toEqual({ start: 0, end: 0 });
  });
});
