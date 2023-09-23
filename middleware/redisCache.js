const redis = require('redis');
const client = redis.createClient();



const cacheMiddleware = (key) => async (req, res, next) => {
    client.get(key, async (err, cachedData) => {
      if (err) {
        console.error('Redis error:', err);
        return res.status(500).json({ error: 'Redis error' });
      }
  
      if (cachedData) {
        console.log('Data retrieved from cache');
        const data = JSON.parse(cachedData);
        return res.status(200).json({ data });
      } else {
        console.log('Data retrieved from the database');
        next();
      }
    });
  };
  
  module.exports = { cacheMiddleware };
  