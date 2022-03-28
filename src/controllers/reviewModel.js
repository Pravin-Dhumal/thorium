const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

const createReview = function ( req ,res ) {
    try {

    }
    catch( error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}




module.exports.createReview = createReview