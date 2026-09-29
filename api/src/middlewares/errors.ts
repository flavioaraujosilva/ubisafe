import type { NextFunction, Request, Response } from 'express';

type ErrorWithType = Error & { type?: string };

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(error: ErrorWithType, _req: Request, res: Response, _next: NextFunction) {
  if (error.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  if (error.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request body too large' });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
