import type { Character } from '../types/character.js';
import characters from './characters.json' with { type: 'json' };

export const initialCharacters = characters as Character[];
