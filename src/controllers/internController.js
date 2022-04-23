const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') {
        return false
    }
    if (value.trim().length == 0) {
        return false
    } if (typeof (value) === 'string' && value.trim().length > 0) {
        return true
    }
}


const createIntern = async function (req, res) {
    try {
        let data = req.body
        let { email , mobile ,collegeName} = data

        // check : if request body is empty
        if (!Object.keys(data).length > 0) return res.status(400).send({ status: false, message: "Please enter data" })

        // checking if any data field has no value or it is empty
        if (!isValid(data.name)) return res.status(400).send({ status: false, message: 'please provide name' })
        if (!isValid(data.email)) return res.status(400).send({ status: false, message: 'please provide email' })
        if (!isValid(data.mobile)) return res.status(400).send({ status: false, message: 'please provide mobile' })

        // setting : default values 
        if (data.isDeleted != null) data.isDeleted = false

        // validation : if any key has invalid value
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
            return res.status(400).send({ status: false, message: 'please provide valid email' })
        }
        if (!(/^\+?([6-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(data.mobile))) {
            return res.status(400).send({ status: false, message: 'please provide valid mob no' })
        }

        // check : duplication
        email = await internModel.findOne({email})
        if(email)   return  res.status(400).send({ status : false ,message : "This eamil is already in use,please provide another email"})

        mob = await internModel.findOne({mobile})
        if(mob)   return  res.status(400).send({ status : false ,message : "This mobile is number already in use,please provide another mobile number"})

        // check : if collegeId is invalid and retreiving college ID
        const college = await collegeModel.findOne({ name: data.collegeName }).select({_id:1})
        if (!college) return res.status(400).send({ status: false, message: "Please enter valid collegeId" })

        data.collegeId = college._id
        delete data.collegeName

        // Create :  Intern 
        const createdIntern = await internModel.create(data)
        return res.status(201).send({ status: true, data: createdIntern })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createIntern = createIntern
