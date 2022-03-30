const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema( { 
  title:
   {
       type : String, 
       required : [true , "Please , enter title"], 
       unique : true
    },
  excerpt: {
      type : String, 
      required : [true , "Please , enter excerpt"] 
    }, 
  userId: {
      type : ObjectId, 
      ref : "user" ,
      required : [true , "Please , enter userId"]
    },
  ISBN: {
      type : String, 
      required : [true , "Please , enter ISBN"] , 
      unique : true 
    },
  category: {
      type : String, 
      required : [true , "Please , enter category"]
    },
  subcategory: {
      type : [String] , 
      required : [true , "Please , enter subcategory"]
    },
  reviews: {
      type : Number, 
      default: 0
    },
  deletedAt: {
      type : Date,
      default : ""
    }, 
  isDeleted: {
      type : Boolean, 
      default: false
},
  releasedAt: {
      type: Date, 
      required : true , 
      format : ("YYYY-MM-DD")
}} , { timestamps: true });

module.exports = mongoose.model('book', bookSchema)