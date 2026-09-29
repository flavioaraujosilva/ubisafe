import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { initialCharacters } from '../src/data/index.js';
import { createCharacterRepository } from '../src/repositories/characters.js';

describe('middlewares de erro', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('responde 404 em JSON para rota inexistente', async () => {
    const response = await request(createApp()).get('/rota-que-nao-existe');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Route not found' });
  });

  it('responde 404 em JSON para método não suportado', async () => {
    const response = await request(createApp()).post('/characters');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Route not found' });
  });

  it('responde 400 em JSON quando o corpo tem JSON malformado', async () => {
    const response = await request(createApp())
      .patch('/characters/1')
      .set('Content-Type', 'application/json')
      .send('{"name": ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid JSON' });
  });

  it('responde 413 quando o corpo excede o limite', async () => {
    const response = await request(createApp())
      .patch('/characters/1')
      .send({ name: 'a'.repeat(200 * 1024) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ error: 'Request body too large' });
  });

  it('responde 500 sem expor detalhes internos em erro inesperado', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const repository = createCharacterRepository(initialCharacters);
    vi.spyOn(repository, 'list').mockImplementation(() => {
      throw new Error('falha no banco');
    });

    const response = await request(createApp({ characterRepository: repository })).get('/characters');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
    expect(JSON.stringify(response.body)).not.toContain('falha no banco');
    expect(console.error).toHaveBeenCalled();
  });
});
