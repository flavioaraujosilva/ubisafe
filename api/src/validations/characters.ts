import { z } from 'zod';
import { CHARACTER_STATUSES } from '../types/character.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MAX_NAME_LENGTH = 100;

function normalizeStatus(value: unknown) {
  if (typeof value !== 'string') return value;

  const term = value.trim().toLowerCase();
  if (!term) return undefined;

  return CHARACTER_STATUSES.find((status) => status.toLowerCase() === term) ?? value;
}

export const characterQuerySchema = z.object({
  name: z.string().trim().optional(),
  status: z.preprocess(normalizeStatus, z.enum(CHARACTER_STATUSES).optional()),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export const characterIdSchema = z.coerce.number().int().positive();

export const updateCharacterSchema = z.object({
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
});
