const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( { 
    title: {
        type : String,
        required : [true , "Please , enter title"],
        enum : ["Mr", "Mrs", "Miss"]
    },
    name: {
        type : String,
        required : [true , "Please , enter name"] 
    },
    phone: {
        type : String, 
        required : [true , "Please , enter phone"] ,
        unique : true 
    },
    email: {
        type : String,
        required : [true , "Please , enter email"] ,  
        unique : true 
    }, 
    password: {
        type : String, 
        required : [true , "Please , enter password"] ,
        minlength : 8,
        maxlength : 15
      },
    address: {
      street: {
        type : String
      },
      city: {
        type : String
      },
      pincode: {
        type : String
      }
    }
  } , { timestamps: true });

module.exports = mongoose.model('user', userSchema)