const User = require('../models/auth')
const booksCatalogue = require('../models/ride')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')



const getUser = async (req,res) => {

    const getCurrentUser = req.user.userId

    const {getCurrentUser:userId} = req


    const foundUser = await User.find({userId}).select('-password')

    if (!foundUser) {
        throw new NotFoundError('No user found')
    }

    return res.status(StatusCodes.OK).json({user: foundUser})

}

const updateUser = async (req,res) => {

    const {
        body: {name, email, phoneNumber},
        user: {userId}
    } = req
    
    if (!name === '' || !email === '' || !phoneNumber === ''){
        throw new BadRequestError('please provide the credentials')
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        req.body, 
        { new: true, runValidators: true } 
    )
    if (!updatedUser){
        throw new NotFoundError(`No user with ${userId}`)
    }
    return res.status(StatusCodes.OK).json({updatedUser})

}




module.exports = {getUser, updateUser}