const mongoose = require('mongoose');
const url = require('mongoose-type-url')

const collegeSchema = new mongoose.Schema( {
    name: {
        type : String ,
        unique : true ,
        required : "Please enter college name"
    },
    fullname: {
        type : String ,
        required : "Please enter full name"
    },
    logoLink :{
        type : url ,
        required : "Please enter logo Link" ,
        trim : true ,
        unique : true ,
        lowercase : true ,
    },
    isDeleted : {
        type : Boolean ,
        default : false
    }
 } , { timestamps: true });

module.exports = mongoose.model('college', collegeSchema) 


//  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/