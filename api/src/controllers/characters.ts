import type { Request, Response } from 'express';
import { z } from 'zod';
import type { CharacterRepository } from '../repositories/characters.js';
import { characterQuerySchema } from '../validations/characters.js';

export function createCharacterController(repository: CharacterRepository) {
  function list(req: Request, res: Response) {
    const filters = characterQuerySchema.safeParse(req.query);

    if (!filters.success) {
      res.status(400).json({
        error: 'Invalid parameters',
        details: z.flattenError(filters.error).fieldErrors,
      });
      return;
    }

    res.json(repository.list(filters.data));
  }

  return { list };
}
