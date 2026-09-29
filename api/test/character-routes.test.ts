import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { initialCharacters } from '../src/data/index.js';
import { createCharacterRepository } from '../src/repositories/characters.js';

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

describe('PATCH /characters/:id', () => {
  it('atualiza o nome e mantém a alteração na listagem', async () => {
    const app = createApp({ characterRepository: createCharacterRepository(initialCharacters) });

    const response = await request(app).patch('/characters/1').send({ name: 'Rick C-137' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 1, name: 'Rick C-137', status: 'Alive' });

    const listResponse = await request(app).get('/characters').query({ name: 'rick c-137' });
    expect(listResponse.body.results.map((p: { id: number }) => p.id)).toEqual([1]);
  });

  it('responde 404 quando o personagem não existe', async () => {
    const response = await request(createApp()).patch('/characters/999').send({ name: 'Ninguém' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Character not found' });
  });

  it('responde 400 quando o id é inválido', async () => {
    const response = await request(createApp()).patch('/characters/abc').send({ name: 'Rick' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid id' });
  });

  it('responde 400 quando o nome é inválido', async () => {
    const response = await request(createApp()).patch('/characters/1').send({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid data');
    expect(response.body.details).toHaveProperty('name');
  });

  it('responde 400 apontando o nome quando o corpo não é enviado', async () => {
    const response = await request(createApp()).patch('/characters/1');

    expect(response.status).toBe(400);
    expect(response.body.details).toHaveProperty('name');
  });

  it('altera apenas o nome mesmo recebendo outros campos', async () => {
    const response = await request(createApp()).patch('/characters/1').send({ name: 'Rick', status: 'Dead' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ name: 'Rick', status: 'Alive' });
  });
});

describe('DELETE /characters/:id', () => {
  it('remove o personagem e ele deixa de aparecer na listagem', async () => {
    const app = createApp({ characterRepository: createCharacterRepository(initialCharacters) });

    const response = await request(app).delete('/characters/1');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});

    const listResponse = await request(app).get('/characters');
    expect(listResponse.body.info.count).toBe(99);
    expect(listResponse.body.results[0].id).toBe(2);
  });

  it('responde 404 ao remover o mesmo personagem duas vezes', async () => {
    const app = createApp();

    await request(app).delete('/characters/1');
    const response = await request(app).delete('/characters/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Character not found' });
  });

  it('responde 400 quando o id é inválido', async () => {
    const response = await request(createApp()).delete('/characters/abc');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid id' });
  });
});
