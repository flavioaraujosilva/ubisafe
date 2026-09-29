import { describe, expect, it } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('formata a data no padrão dd/mm/aaaa', () => {
    expect(formatDate('2017-11-04T18:48:46.250Z')).toBe('04/11/2017');
  });

  it('usa UTC para não mudar o dia por causa do fuso', () => {
    expect(formatDate('2017-11-05T01:30:00.000Z')).toBe('05/11/2017');
  });

  it('retorna "-" para data inválida', () => {
    expect(formatDate('data-invalida')).toBe('-');
  });
});
