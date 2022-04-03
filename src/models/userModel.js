const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( { 
    title: {
        type : String,
        required : [true , "Please , enter title"],
        enum : ["Mr", "Mrs", "Miss"],
        trim : true
    },
    name: {
        type : String,
        required : [true , "Please , enter name"] ,
        trim : true
    },
    phone: {
        type : String, 
        required : [true , "Please , enter phone"] ,
        unique : true ,
        trim : true
    },
    email: {
        type : String,
        required : [true , "Please , enter email"] ,  
        unique : true ,
        trim : true
    }, 
    password: {
        type : String, 
        required : [true , "Please , enter password"] ,
        minlength : 8,
        maxlength : 15,
        trim : true
      },
    address: {
      street: {
        type : String,
        trim : true
      },
      city: {
        type : String,
        trim : true
      },
      pincode: {
        type : String,
        trim : true
      }
    }
  } , { timestamps: true });

module.exports = mongoose.model('user', userSchema)