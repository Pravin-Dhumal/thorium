const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const moment = require("moment")


const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') {
        return false
    }
    if (typeof (value) === 'string' && value.trim().length > 0) {
        return true
    }
    if (typeof (value) === 'number' && value.toString().trim().length > 0) {
        return true
    }

}





const createReview = async function (req, res) {
    try {
        //  store : entered data by user in variable 
        const data = req.body

        //  check : if request body is empty
        if (!Object.keys(data).length > 0) {
            res.status(400).send({ status: false, message: "Please enter data" })
            return
        }

        //  check : Validations on entered data 
        //  bookId : if empty 
        if (!isValid(data.bookId)) {
            res.status(400).send({ status: false, message: 'please provide bookId' })
            return
        }
        //  if : invalid (bookID by body and by params)
        if (!(/^[0-9a-fA-F]{24}$/.test(data.bookId))) {
            res.status(400).send({ status: false, message: 'please provide valid bookId in request body' })
            return
        }
        if (!(/^[0-9a-fA-F]{24}$/.test(req.params.bookId))) {
            res.status(400).send({ status: false, message: 'please provide valid bookId in path params' })
            return
        }

        //  CHECK : entered bookId and bookId in params is same or not 
        if (req.body.bookId != req.params.bookId) {
            res.status(400).send({ status: false, message: "Please provide same bookIds in path params and request body" })
            return
        }

        //  CHECK : if doesn't exist in database OR deleted 
        const bookId = await bookModel.find({ _id: data.bookId, isDeleted: false })
        if (!bookId.length > 0) {
            res.status(400).send({ status: false, message: "Invalid bookId" })
            return
        }


        //  reviewedBy  : if provided in request body but empty
        if (data.reviewedBy != null) {
            if (!isValid(data.reviewedBy)) {
                res.status(400).send({ status: false, message: 'please provide reviewedBy' })
                return
            }
        }

        //  rating : if empty
        if (!isValid(data.rating)) {
            res.status(400).send({ status: false, message: 'please provide ratings' })
            return
        }
        //  rating : if less than 1 or greater than 5
        if (data.rating > 5 || data.rating < 1) {
            res.status(400).send({ status: false, message: 'please provide ratings ( 1 - 5 )' })
            return
        }

        //  review : if provided but empty 
        if (data.review != null) {
            if (!isValid(data.review)) {
                res.status(400).send({ status: false, message: 'please provide review' })
                return
            }
        }

        //  set : default values ( isDeleted : false , reviewedAt )
        if (data.isDeleted != null) data.isDeleted = false

        data.reviewedAt = new Date();

        //   UPDATE : reviews count in book Model 
        let updateReviews = await bookModel.findOneAndUpdate({ _id: data.bookId },
            { $inc: { reviews: + 1 } }, { new: true })

        //  CREATE : review doc in review Model
        const review = await reviewModel.create(data)

        //  RETREIVE : all reviews for the user
        const allReviews = await reviewModel.find({ bookId: bookId ,isDeleted: false})

        //  SEND : final response
        res.status(201).send({
            status: true,
            message: "review created",
            data: { ...updateReviews.toObject(), viewer: allReviews }
        })
        return
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}







const updateReview = async function (req, res) {
    try {
        //  STORE : bookId , reviewId in variables by params
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        //  STORE : data for updates in variable
        const dataForUpdation = req.body

        //  CHECK : if there is no data provided for update
        if (!Object.keys(dataForUpdation).length > 0) {
            res.status(400).send({ status: false, message: 'please provide data for upadates' })
            return
        }

        //  CHECK : VALIDATIONS 
        //  bookId : if invalid 
        if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
            return res.status(400).send({ status: false, message: 'please provide valid bookId' })
        }
        //  bookId : if doesn't exist in database OR deleted 
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            res.status(404).send({ status: false, message: "Book doesn't exist" })
            return
        }

        //  reviewId : if invalid
        if (!(/^[0-9a-fA-F]{24}$/.test(reviewId))) {
            res.status(400).send({ status: false, message: 'please provide valid reviewId' })
            return
        }
        //  reviewId : if doesn't exist in database OR deleted 
        const review = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
        if (!review) {
            res.status(404).send({ status: false, message: "This review doesn't exist for given bookId" })
            return
        }

        //  CHECK : if any data field for update is empty
        //  reviewedBy
        if (dataForUpdation.reviewedBy != null) {
            if (!isValid(dataForUpdation.reviewedBy)) {
                res.status(400).send({ status: false, message: 'please provide reviewedBy' })
                return
            }
        }
        //  rating
        if (dataForUpdation.rating != null) {
            if (!isValid(dataForUpdation.rating)) {
                res.status(400).send({ status: false, message: 'please provide rating' })
                return
            }
        }
        //  review
        if (dataForUpdation.review != null) {
            if (!isValid(dataForUpdation.review)) {
                res.status(400).send({ status: false, message: 'please provide review' })
                return
            }
        }

        //  CHECK : rating should be ( 1 -5 )
        if (dataForUpdation.rating > 5 || dataForUpdation.rating < 1) {
            res.status(400).send({ status: false, message: 'please provide ratings ( 1 - 5 )' })
            return
        }

        //  UPDATE : review doc
        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId },
            { ...dataForUpdation },
            { new: true })

        //  RETREIVE : all reviews for the user
        const allReviews = await reviewModel.find({ bookId: bookId ,isDeleted:false})

        //  SEND : final required response 
        res.status(200).send({
            status: true,
            message: "review updateded",
            data: { ...book.toObject(), viewer: allReviews }
        })
        return

    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}







const deleteReview = async function (req, res) {
    try {
        //  STORE : bookId , reviewId in variables by params
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        //  CHECK : VALIDATIONS 
        //  bookId : if invalid 
        if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
            return res.status(400).send({ status: false, message: 'please provide valid bookId' })
        }
        //  bookId : if doesn't exist in database OR deleted 
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            res.status(404).send({ status: false, message: "Book doesn't exist" })
            return
        }

        //  reviewId : if invalid
        if (!(/^[0-9a-fA-F]{24}$/.test(reviewId))) {
            res.status(400).send({ status: false, message: 'please provide valid reviewId' })
            return
        }
        //  reviewId : if doesn't exist in database OR deleted 
        const review = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
        if (!review) {
            res.status(404).send({ status: false, message: "review doesn't exist for given bookId" })
            return
        }

        //  DELETE : review with given reviewId
        const deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId },
            { isDeleted: true },
            { new: true })

        //  UPDATE : decrease the review count of that book
        const decreaseCount = await bookModel.findOneAndUpdate({ _id: bookId },
            { $inc: { reviews: -1 } })

        //  SEND : final response 
        res.status(200).send({ status: true, message: "review deleted successfully" })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}






module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview
