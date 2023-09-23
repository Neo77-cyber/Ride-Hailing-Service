const express = require('express')


const router = express.Router()

const {getUser, updateUser} = require('../controllers/user')





router.route('/').get(getUser)
router.route('/updateuser').patch(updateUser)









module.exports = router