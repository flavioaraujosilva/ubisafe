import { Router } from 'express';
import { createCharacterController } from '../controllers/characters.js';
import type { CharacterRepository } from '../repositories/characters.js';

export function createCharacterRoutes(repository: CharacterRepository) {
  const router = Router();
  const controller = createCharacterController(repository);

  router.get('/', controller.list);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
