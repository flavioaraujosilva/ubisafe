import cors from 'cors';

const DEFAULT_ORIGIN = 'http://localhost:5173';

export function readAllowedOrigins(value = process.env.CORS_ORIGIN) {
  const origins = (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : [DEFAULT_ORIGIN];
}

export function createCors(allowedOrigins: string[]) {
  return cors({
    origin: allowedOrigins,
    methods: ['GET', 'PATCH', 'DELETE'],
  });
}
