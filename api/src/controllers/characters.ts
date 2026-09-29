import type { Request, Response } from 'express';
import { z } from 'zod';
import type { CharacterRepository } from '../repositories/characters.js';
import {
  updateCharacterSchema,
  characterQuerySchema,
  characterIdSchema,
} from '../validations/characters.js';

function sendValidationError(res: Response, message: string, error: z.ZodError) {
  res.status(400).json({
    error: message,
    details: z.flattenError(error).fieldErrors,
  });
}

function sendInvalidId(res: Response) {
  res.status(400).json({ error: 'Invalid id' });
}

function sendNotFound(res: Response) {
  res.status(404).json({ error: 'Character not found' });
}

export function createCharacterController(repository: CharacterRepository) {
  function list(req: Request, res: Response) {
    const filters = characterQuerySchema.safeParse(req.query);

    if (!filters.success) {
      sendValidationError(res, 'Invalid parameters', filters.error);
      return;
    }

    res.json(repository.list(filters.data));
  }

  function update(req: Request, res: Response) {
    const id = characterIdSchema.safeParse(req.params.id);
    if (!id.success) {
      sendInvalidId(res);
      return;
    }

    const input = updateCharacterSchema.safeParse(req.body ?? {});
    if (!input.success) {
      sendValidationError(res, 'Invalid data', input.error);
      return;
    }

    const character = repository.updateName(id.data, input.data.name);
    if (!character) {
      sendNotFound(res);
      return;
    }

    res.json(character);
  }

  function remove(req: Request, res: Response) {
    const id = characterIdSchema.safeParse(req.params.id);
    if (!id.success) {
      sendInvalidId(res);
      return;
    }

    if (!repository.remove(id.data)) {
      sendNotFound(res);
      return;
    }

    res.status(204).end();
  }

  return { list, update, remove };
}
