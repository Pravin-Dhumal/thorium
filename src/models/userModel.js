const mongoose = require('mongoose');



const bookSchema = new mongoose.Schema( {
    "bookName": String,
    "bookList": String,
    "authorName": String,
    "category": String,
    "year": Number
}, { timestamps: true });

module.exports = mongoose.model('User', bookSchema) 



