import { describe, expect, it } from 'vitest';
import { characterQuerySchema } from '../src/validations/characters.js';

describe('characterQuerySchema', () => {
  it('aplica page 1 e limit 10 por padrão', () => {
    expect(characterQuerySchema.parse({})).toEqual({ page: 1, limit: 10 });
  });

  it('converte page e limit da query string para número', () => {
    expect(characterQuerySchema.parse({ page: '3', limit: '20' })).toMatchObject({ page: 3, limit: 20 });
  });

  it('aceita status sem diferenciar maiúsculas', () => {
    expect(characterQuerySchema.parse({ status: 'alive' }).status).toBe('Alive');
    expect(characterQuerySchema.parse({ status: ' DEAD ' }).status).toBe('Dead');
    expect(characterQuerySchema.parse({ status: 'Unknown' }).status).toBe('unknown');
  });

  it('ignora status vazio', () => {
    expect(characterQuerySchema.parse({ status: '' }).status).toBeUndefined();
  });

  it.each([
    ['status inexistente', { status: 'zombie' }],
    ['page zero', { page: '0' }],
    ['page não numérica', { page: 'abc' }],
    ['page decimal', { page: '1.5' }],
    ['limit acima do máximo', { limit: '51' }],
  ])('rejeita %s', (_case, query) => {
    expect(characterQuerySchema.safeParse(query).success).toBe(false);
  });
});
