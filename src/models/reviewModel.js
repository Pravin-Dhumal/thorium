const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema( { 
    bookId: {
        type :ObjectId,
        ref : "book" ,
        required : [true , "Please , enter bookId"] 
    },
    reviewedBy: {
        type : String, 
        default : 'Guest'
    },
    reviewedAt: {
        type : Date
    },
    rating: {
        type : Number,    // max : 5 , min : 1
        required : [true , "Please , enter subcategory"]
    },
    review: {
        type : String       
    },
    isDeleted: {
        type : Boolean, 
        default: false
    },
  } , { timestamps: true });

module.exports = mongoose.model('review', reviewSchema)