import express from 'express';
import { initialCharacters } from './data/index.js';
import { createCharacterRepository, type CharacterRepository } from './repositories/characters.js';
import { createCharacterRoutes } from './routes/characters.js';

type AppOptions = {
  characterRepository?: CharacterRepository;
};

export function createApp({
  characterRepository = createCharacterRepository(initialCharacters),
}: AppOptions = {}) {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/characters', createCharacterRoutes(characterRepository));

  return app;
}
