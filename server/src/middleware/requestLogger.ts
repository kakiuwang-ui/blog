import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Skip logging for static files and health checks in production
  if (process.env.NODE_ENV === 'production') {
    if (req.path.startsWith('/uploads') || req.path === '/api/health') {
      return next();
    }
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    console.log(
      `${timestamp} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}