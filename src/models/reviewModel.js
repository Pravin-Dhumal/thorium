const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema( { 
    bookId: {
        type :ObjectId,
        ref : "book" ,
        required : [true , "Please , enter bookId"] ,
        trim : true
    },
    reviewedBy: {
        type : String, 
        default : 'Guest',
        trim : true
    },
    reviewedAt: {
        type : Date,
        trim : true
    },
    rating: {
        type : Number,    // max : 5 , min : 1
        required : [true , "Please , enter subcategory"],
        trim : true
    },
    review: {
        type : String,
        trim : true
    },
    isDeleted: {
        type : Boolean, 
        default: false,
        trim : true
    },
  } , { timestamps: true });

module.exports = mongoose.model('review', reviewSchema)