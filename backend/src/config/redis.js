const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    if (!process.env.REDIS_HOST) {
      console.log('⚠️  Redis not configured, skipping...');
      return null;
    }

    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis client connected successfully.');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error.message);
    return null;
  }
};

module.exports = { redisClient, connectRedis };