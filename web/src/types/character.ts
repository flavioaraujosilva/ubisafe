export const CHARACTER_STATUSES = ['Alive', 'Dead', 'unknown'] as const;

export type CharacterStatus = (typeof CHARACTER_STATUSES)[number];

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export type LocationSummary = {
  name: string;
  url: string;
};

export type Character = {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: LocationSummary;
  location: LocationSummary;
  image: string;
  episode: string[];
  url: string;
  created: string;
};
