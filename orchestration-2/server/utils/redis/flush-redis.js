/* eslint no-console: 0 */

require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOSTNAME}`,
  password: process.env.REDIS_AUTH_TOKEN,
  tls: {}
});

client.flushdb(function(err, success) {
  console.log(success);
  client.quit();
});
