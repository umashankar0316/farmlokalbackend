import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const key = `rate_limit:${ip}`;
  const limit = 100; // 100 requests per minute

  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, 60);
    }

    if (current > limit) {
      res.status(429).json({ error: 'Too many requests. Please try again later.' });
      return; 
    }
    
    next();
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    next(); // Fail open: allow request if Redis fails
  }
};