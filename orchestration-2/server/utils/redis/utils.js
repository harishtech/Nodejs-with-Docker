/* eslint no-console: 0 */

const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOSTNAME}`,
  password: process.env.REDIS_AUTH_TOKEN,
  tls: {}
});

const asyncGetCache = function(...args) {
  if (process.env.CACHE_ENABLED) {
    return promisify(redisClient.get).bind(redisClient)(...args);
  } else {
    return null;
  }
};

const setCache = function(...args) {
  if (process.env.CACHE_ENABLED) {
    redisClient.set(...args);
  }
};

redisClient.on('error', (error) => {
  console.log(`Error ${error}`);
});

module.exports = { redisClient, asyncGetCache, setCache };
