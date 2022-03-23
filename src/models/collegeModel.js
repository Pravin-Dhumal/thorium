const mongoose = require('mongoose');
const url = require('mongoose-type-url')

const collegeSchema = new mongoose.Schema( {
    name: {
        type : String ,
        unique : true ,
        required : "Please enter college name",
        lowercase : true,
        trim : true
    },
    fullname: {
        type : String ,
        required : "Please enter full name",
        trim : true
    },
    logoLink :{
        type : url ,
        required : "Please enter logo Link" ,
        trim : true ,
        unique : true ,
        lowercase : true ,
        match : /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },
    isDeleted : {
        type : Boolean ,
        default : false
    }
 } , { timestamps: true });

module.exports = mongoose.model('college', collegeSchema) 

