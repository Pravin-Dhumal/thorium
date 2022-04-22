const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema( {
    title : {
        type : String ,
        required : "Please enter title" 
    },
    body : {
        type : String ,
        required : "please enter body" 
    },
    authorId : {
        type : ObjectId ,
        ref : "author" ,
        required : "please enter authorId"
    } ,
    tags :  [ String ] ,
    category : {
        type : String ,
        required : "Please enter category"
    }, 
    subcategory : [ String ] ,
    isDeleted : {
        type : Boolean ,
        default : false
    } ,
    deletedAt : {
        type : Date ,
        default : ""
    },
    isPublished : { 
        type : Boolean ,
        default : false
    } ,
    publishedAt : { 
        type : Date ,
        default :""
    }
 } , { timestamps: true });

module.exports = mongoose.model('blog', blogSchema) 