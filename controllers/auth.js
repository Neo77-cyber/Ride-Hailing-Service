const {UnauthenticatedError, BadRequestError} = require('../errors')
const {StatusCodes} = require('http-status-codes')
const User = require('../models/auth')




const register = async (req,res) => {
    const user = await User.create({...req.body})

    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({user: {name:user.name}, token})
}

const login = async (req,res) => {
    const {name, email, password} = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide an email and password')
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new UnauthenticatedError('please provide correct email')
    }
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Please provide correct password')
      }

     const token = user.createJWT()

     res.status(StatusCodes.OK).json({user: { name: user.name }, token})
    
}



module.exports = {
    register, login
}
   

    
