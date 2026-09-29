import express from 'express';
import { initialCharacters } from './data/index.js';
import { createCors, readAllowedOrigins } from './middlewares/cors.js';
import { notFoundHandler, errorHandler } from './middlewares/errors.js';
import { createCharacterRepository, type CharacterRepository } from './repositories/characters.js';
import { createCharacterRoutes } from './routes/characters.js';

type AppOptions = {
  characterRepository?: CharacterRepository;
  allowedOrigins?: string[];
};

export function createApp({
  characterRepository = createCharacterRepository(initialCharacters),
  allowedOrigins = readAllowedOrigins(),
}: AppOptions = {}) {
  const app = express();

  app.use(createCors(allowedOrigins));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/characters', createCharacterRoutes(characterRepository));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
