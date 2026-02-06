import Redis from 'ioredis';
import { config } from './env';

if (!config.redis.url) {
  throw new Error('❌ REDIS_URL is not defined in .env file');
}

// Now we know for sure that url exists
export const redis = new Redis(config.redis.url);

redis.on('connect', () => console.log('✅ Redis Connected'));
redis.on('error', (err) => console.error('❌ Redis Error:', err));