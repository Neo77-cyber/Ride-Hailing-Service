const mongoose = require('mongoose')

const RideSchema = new mongoose.Schema(
  {
    user: {
      type:mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    customerName: {
      type: String,
      required: [true, 'Please provide name of customer'],
    },
    pickupPhoneNumber: {
      type: String,
      required: [true, 'Please provide pickup phonenumber'],
      maxlength: 11,
    },
    pickupAddress: {
      type: String,
      required: [true, 'Please provide pickup Address'],
    },
    recipientName: {
      type: String,
      required: [true, 'Please provide recipient name'], 
    },
    recipientPhoneNumber: {
      type: String,
      required: [true, 'Please provide recipient phone number'],
      maxlength: 11,
    },
    recipientAddress: {
      type: String,
      required: [true, 'Please provide recipient name'],
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: {
        values: ['electronics', 'jewelries', 'shoes', 'phones'],
        message: '{VALUE} is not supported',
      },
    },
    distance: {
      type: Number
    },
    price: {
      type: Number
    },
  },
  { timestamps: true }
)


module.exports = mongoose.model('Books', RideSchema)