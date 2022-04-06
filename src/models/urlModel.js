const mongoose = require('mongoose');
const url = require('mongoose-type-url')

const urlSchema = new mongoose.Schema( { 
    longUrl: {
        type : url,
        required : true,
        trim : true 
    }, 
    shortUrl: {
        type : url,
        unique : true ,
        trim : true
    },
    urlCode: {
        type : String,
        unique : true, 
        lowercase : true, 
        trim : true
    }
},{ timestamps: true } );

module.exports = mongoose.model('url', urlSchema)