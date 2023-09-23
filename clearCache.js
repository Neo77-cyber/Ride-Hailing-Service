const redis = require('redis');
const client = redis.createClient();


const keyToClear = 'books';


client.del(keyToClear, (err, numRemoved) => {
  if (err) {
    console.error('Error clearing cache:', err);
  } else {
    console.log(`Removed ${numRemoved} item(s) from cache for key: ${keyToClear}`);
  }

 
  client.quit();
});
