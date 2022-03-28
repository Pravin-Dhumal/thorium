const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema( { 
    bookId: {
        type :ObjectId,
        ref : "book" ,
        required : [true , "Please , enter subcategory"] 
    },
    reviewedBy: {
        type : String, 
        required : [true , "Please , enter subcategory"],
        default : 'Guest', 
        value :  String            // "reviewer's name"
    },
    reviewedAt: {
        type : Date, 
        required : [true , "Please , enter subcategory"]
    },
    rating: {
        type : Number,     //  min 1, max 5, 
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