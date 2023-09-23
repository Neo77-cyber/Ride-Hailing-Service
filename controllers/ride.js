const Ride = require('../models/ride')
const User = require('../models/auth')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const fs = require('fs');
const { performance } = require('perf_hooks');
const redis = require('redis');
const client = redis.createClient();
const geolib = require('geolib');
const ride = require('../models/ride');
const paystack = require('paystack')({
  apiKey: process.env.PAYSTACK_SECRET_KEY,
});




async function getCoordinates(address) {
  const apiKey = process.env.GOOGLE_API_KEY 
  const encodedAddress = encodeURIComponent(address);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Geocoding request failed');
  }

  const data = await response.json();
  console.log(data);

  if (data.status !== 'OK') {
    throw new Error('Geocoding request did not return OK status');
  }


  const { lat, lng } = data.results[0].geometry.location;

  return { lat, lon: lng }; 
}






function calculateDistance(cord1, cord2) {

  const distance = geolib.getDistance(cord1, cord2);
  
  console.log(distance);

  return distance

}



function calculatePrice(distance) {

  const basePrice = 1000; 
  const pricePerMeter = 0.1; 

  const price = basePrice + distance * pricePerMeter;

  return price;

}

const CreateRide = async (req, res) => {

    const {customerName, pickupPhoneNumber, pickupAddress, recipientName, recipientPhoneNumber, recipientAddress, category} = req.body
    const user = req.user;

    const pickupCoordinates = await getCoordinates(pickupAddress);
    const recipientCoordinates = await getCoordinates(recipientAddress);

    const distanceInMeters = calculateDistance(pickupCoordinates, recipientCoordinates)

    const finalPrice = calculatePrice(distanceInMeters)

    


    const transactionParams = {
      email: 'holyjazzy1@gmail.com', 
      amount: Math.floor(finalPrice * 100),
       
    };
    
    
  
  
      const response = await fetch(`https://api.paystack.co/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionParams),
    });

    console.log(response);

    
    
    
    if (!response.ok) {
      const responseData = await response.json();
      console.error('Paystack API request failed. Status code:', response.status);
      console.error('Error details:', responseData);
      throw new Error('Paystack API request failed');
    }
    

    const responseData = await response.json();

    

    if (responseData.status !== true) {
      
      throw new Error('Paystack API returned an error');
    }

    const authorizationUrl = responseData.data.authorization_url;
    
  
      
      

    
    const ride = await Ride.create({user: user.userId, customerName,pickupPhoneNumber,pickupAddress,recipientName,recipientPhoneNumber,recipientAddress,category, distance:distanceInMeters, price:finalPrice})

    res.status(StatusCodes.CREATED).json({ride, authorizationUrl})
}




const rideHistory = async (req, res) => {

    const startTime = performance.now()
    const page = parseInt(req.query.page) || 1; 
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; 
  
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
  
    const totalBooks = await Ride.countDocuments();
  
    const rides = await Ride.find({})
      .sort({ createdAt: -1 }) 
      .skip(startIndex)
      .limit(itemsPerPage)
      .lean()

      const endTime = performance.now()

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBooks / itemsPerPage),
    };
    
    const executionTime = endTime - startTime


    

    client.setex('books', 3600, JSON.stringify(rides));

    res.status(StatusCodes.OK).json({ rides, pagination, executionTime });
  };
  
  
 

  


module.exports = {CreateRide, rideHistory}