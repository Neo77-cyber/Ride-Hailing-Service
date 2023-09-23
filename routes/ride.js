const express = require('express')


const router = express.Router()

const {CreateRide, rideHistory, initializePayment} = require('../controllers/ride')




router.route('/').post(CreateRide).get(rideHistory)











module.exports = router