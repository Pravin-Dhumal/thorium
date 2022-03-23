const { connections } = require("mongoose")
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

const createCollege = async function( req , res ) {
    try {
        const data = req.body
        let {name , logoLink} = data
        // check : if request body is empty
        if ( !Object.keys(data).length > 0)  return res.status(400).send({status : false ,message : "Please enter data"})

        // check : if any data field has no value or it is empty
        if( !isValid(data.name) )    return res.status(400).send({ status : false, message: 'please provide short name'})
        if( !isValid(data.fullname) )    return res.status(400).send({ status : false, message: 'please provide fullname'})
        if( !isValid(data.logoLink) )    return res.status(400).send({ status : false, message: 'please provide logoLink'})

        // setting : defaults 
        if (data.isDeleted != null) data.isDeleted = false

        // checking : if any key value is duplicate
        name = await collegeModel.findOne({name})
        if(name)   return  res.status(400).send({ status : false ,message : "duplicate value (name) "})

        logoLink = await collegeModel.findOne({logoLink})
        if(logoLink)   return  res.status(400).send({ status : false ,message : "duplicate value (logoLink) "})

        // Create :  College details
        const createdCollege = await collegeModel.create(data)
        return res.status(201).send({ status : true , data : createdCollege})
    }
    catch ( error ) {
        console.log(error.message)
        return res.status(500).send({ status : false,message : error.message})
    }
}



const getColleges = async function ( req ,res ) {
    try {
        const colName = req.query.collegeName

        // check : collegeName should bs present in query param 
        if( !colName )   return res.status(400).send({ status : false, message: 'please provide collegeName in query params'})

        // check : if colNmae is empty
        if( !isValid(colName) )    return res.status(400).send({ status : false, message: 'please provide college Name'})
        
        // check : if any college is exist with given name 
        // retrieve : college ID
        const collegeId = await collegeModel.find({ name : colName , isDeleted : false }).select({ _id : 1})
        if( !Object.keys(collegeId).length > 0)  return res.status(404).send({ status : false, message: 'No data found'})

        // retrieve : college details
        let colleges = await collegeModel.findById(collegeId).select({ name:1 , fullname:1 , logoLink:1 , _id:0})

        // retrieve : interested interns details
        const intern = await internModel.find({ collegeId : collegeId }).select({name:1,mobile:1,email:1})

        // formatting : require output
        let obj = {name : colleges.name ,
                   fullname : colleges.fullname ,
                   logoLink : colleges.logoLink , 
                   interests : intern}

        //  send : response
        res.status(200).send({status : true ,data : obj })
    }
    catch ( error ) {
        console.log(error.message)
        return res.status(500).send({status : false , message : error.message})
    }
}








// /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/















module.exports.createCollege = createCollege
module.exports.getColleges = getColleges