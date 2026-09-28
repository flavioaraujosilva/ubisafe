import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('GET /characters', () => {
  it('lista a primeira página com 10 personagens', async () => {
    const response = await request(createApp()).get('/characters');

    expect(response.status).toBe(200);
    expect(response.body.results).toHaveLength(10);
    expect(response.body.info).toEqual({ count: 100, pages: 10, next: 2, prev: null });
  });

  it('aplica filtros de nome e status e a paginação', async () => {
    const response = await request(createApp())
      .get('/characters')
      .query({ name: 'rick', status: 'alive', page: 1, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.info).toMatchObject({ count: 5, pages: 3, next: 2 });
    for (const character of response.body.results) {
      expect(character.name.toLowerCase()).toContain('rick');
      expect(character.status).toBe('Alive');
    }
  });

  it('retorna lista vazia quando nada corresponde ao filtro', async () => {
    const response = await request(createApp()).get('/characters').query({ name: 'nao-existe' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
  });

  it('responde 400 com os detalhes quando a query é inválida', async () => {
    const response = await request(createApp()).get('/characters').query({ status: 'zombie', page: 0 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid parameters');
    expect(response.body.details).toHaveProperty('status');
    expect(response.body.details).toHaveProperty('page');
  });
});
