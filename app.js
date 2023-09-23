const express = require('express')
require('dotenv').config()
require('express-async-errors')
const fileUpload = require('express-fileupload');
const redis = require('redis');
const client = redis.createClient();







const app = express()


app.use(express.json())





const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authMiddleware = require('./middleware/authentication')
const authroute = require('./routes/auth')
const rideRoute = require('./routes/ride')
const userRoute = require('./routes/user')
const { cacheMiddleware } = require('./middleware/redisCache');


const cacheRide = cacheMiddleware('books')


app.use(fileUpload({ useTempFiles: true }));
app.use('/api/v1', authroute)
app.use('/api/v1/ride',cacheRide, authMiddleware, rideRoute)
app.use('/api/v1/profile', authMiddleware, userRoute)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)






client.on('error', (err) => {
    console.error('Redis error:', err);
  });



const port = process.env.PORT || 3002;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;




















