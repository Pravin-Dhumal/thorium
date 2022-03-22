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

        // check : if request body is empty
        if ( !Object.keys(data) > 0)  return res.status(400).send({status : false ,message : "Please enter data"})

        // check : if any data field has no value or it is empty
        if( !isValid(data.name) )    return res.status(400).send({ status : false, message: 'please provide name'})
        if( !isValid(data.fullname) )    return res.status(400).send({ status : false, message: 'please provide fullname'})
        if( !isValid(data.logoLink) )    return res.status(400).send({ status : false, message: 'please provide logoLink'})

        // Create :  Intern 
        const createdIntern = await collegeModel.create(data)
        return res.status(201).send({ status : true , data : createdIntern})
    }
    catch ( error ) {
        console.log(error.message)
        return res.status(500).send({ status : false,message : error.message})
    }
}





// const getColleges = async function ( req ,res ) {
//     try {
//         const colName = req.query.collegeName

//         // check : if colNmae is empty
//         if( !isValid(colName) )    return res.status(400).send({ status : false, message: 'please provide college Name'})
        
//         // check : if any college is exist with given name 
//         const collegeId = await collegeModel.find({ name : colName }).select({ _id : 1})
//         if( !Object.keys(collegeId).length > 0)  return res.status(404).send({ status : false, message: 'No data found'})

//         // retrieve : college
//         let colleges = await collegeModel.findById(collegeId).select({ name:1 , fullname:1 , logoLink:1 , _id:0})

// //          let colleges = await collegeModel.find({ name : colName}).select({ name:1 , fullname:1 , logoLink:1 , _id:0})

//         // retrieve : interested interns
//         const intern = await internModel.find({ collegeId : collegeId })

//         console.log("col>>>>>..",colleges)

//         console.log("--------------------------------------------------------------------------------------------------------------")
//         console.log("--------------------------------------------------------------------------------------------------------------")
        
// console.log("interns     66    ",intern)

// console.log("--------------------------------------------------------------------------------------------------------------")
// console.log("--------------------------------------------------------------------------------------------------------------")

// colleges.interests = intern

// console.log("collegs ....70    ..",colleges)
        
//         res.status(200).send({status : true ,data : colleges })
//     }
//     catch ( error ) {
//         console.log(error.message)
//         return res.status(500).send({status : false , message : error.message})
//     }
// }







const getColleges = async function ( req ,res ) {
    try {
        const colName = req.query.collegeName

        // check : if colNmae is empty
        if( !isValid(colName) )    return res.status(400).send({ status : false, message: 'please provide college Name'})
        
        // check : if any college is exist with given name 
        const collegeId = await collegeModel.find({ name : colName }).select({ _id : 1})
        if( !Object.keys(collegeId).length > 0)  return res.status(404).send({ status : false, message: 'No data found'})

        // retrieve : college details
        let colleges = await collegeModel.findById(collegeId).select({ name:1 , fullname:1 , logoLink:1 , _id:0})

        // retrieve : interested interns details
        const intern = await internModel.find({ collegeId : collegeId })

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














module.exports.createCollege = createCollege
module.exports.getColleges = getColleges