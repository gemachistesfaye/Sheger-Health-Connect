import Redis from 'ioredis';

// Initialize Redis client. In Render, use REDIS_URL; for Docker Compose, use host/port vars.
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`;

const client = new Redis(redisUrl);

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default client;
