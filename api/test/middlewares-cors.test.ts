import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { readAllowedOrigins } from '../src/middlewares/cors.js';

const FRONTEND_ORIGIN = 'http://localhost:5173';

describe('readAllowedOrigins', () => {
  it('usa a origem padrão do Vite quando a variável não está definida', () => {
    expect(readAllowedOrigins(undefined)).toEqual([FRONTEND_ORIGIN]);
    expect(readAllowedOrigins('  ')).toEqual([FRONTEND_ORIGIN]);
  });

  it('aceita várias origens separadas por vírgula', () => {
    expect(readAllowedOrigins('https://app.com, http://localhost:3000')).toEqual([
      'https://app.com',
      'http://localhost:3000',
    ]);
  });
});

describe('CORS', () => {
  const app = createApp({ allowedOrigins: [FRONTEND_ORIGIN] });

  it('libera a origem permitida', async () => {
    const response = await request(app).get('/characters').set('Origin', FRONTEND_ORIGIN);

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(FRONTEND_ORIGIN);
  });

  it('não libera uma origem diferente', async () => {
    const response = await request(app).get('/characters').set('Origin', 'https://outro-site.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it.each(['PATCH', 'DELETE'])('responde ao preflight de %s', async (method) => {
    const response = await request(app)
      .options('/characters/1')
      .set('Origin', FRONTEND_ORIGIN)
      .set('Access-Control-Request-Method', method)
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(FRONTEND_ORIGIN);
    expect(response.headers['access-control-allow-methods']).toContain(method);
    expect(response.headers['access-control-allow-headers']).toContain('content-type');
  });
});
