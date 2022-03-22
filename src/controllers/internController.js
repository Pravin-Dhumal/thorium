const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const isValid= function(value){
    if( typeof (value)=== 'undefined' || typeof (value)=== 'null'){
        return false
    } 
    if(value.trim().length==0){
        return false
    } if(typeof (value) === 'string' && value.trim().length >0 ){
        return true
    }
  }

const createIntern = async function( req , res ) {
    try {
        const data = req.body

        // check : if request body is empty
        if ( !Object.keys(data) > 0)  return res.status(400).send({status : false,message : "Please enter data"})

        // checking if any data field has no value or it is empty
        if( !isValid(data.name) )    return res.status(400).send({ status : false, message: 'please provide name'})
        if( !isValid(data.email) )    return res.status(400).send({ status : false, message: 'please provide email'})
        if( !isValid(data.mobile) )    return res.status(400).send({ status : false, message: 'please provide mobile'})
        if( !isValid(data.collegeId) )    return res.status(400).send({ status : false, message: 'please provide collegeId'})

        // check : if collegeId is invalid 
        const college = await collegeModel.find({ _id : data.collegeId})
        if ( !college.length > 0 )  return res.status(400).send({ status : false , message : "Please enter valid collegeId"})

        // Create :  Intern 
        const createdIntern = await internModel.create(data)
        return res.status(201).send({ status : true , data : createdIntern})
    }
    catch ( error ) {
        return res.status(500).send({ status : false , message : error.message})
    }
}


module.exports.createIntern = createIntern