const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema( {
    name: {
        type : String ,
        required : "Please enter name",
        trim : true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Please enter email",
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    mobile : {
        type : String ,
        required : "Please enter mobile number" ,
        unique : true ,
        maxlength : 10 ,
        minLength : 10 ,
        trim : true ,
        match : [/^\+?([6-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/, 'Please enter valid mobile number' ]
        
    } ,
    collegeId : {
        type : ObjectId ,
        ref : "college",
        trim : true ,
        required : true ,
        match : [/^[0-9a-fA-F]{24}$/, 'Please enter valid collegeId']
    },
    isDeleted : {
        type : Boolean ,
        default : false
    }
 } , { timestamps: true });

module.exports = mongoose.model('intern', internSchema) 
