const AuthorModel= require("../models/authorModel")
const publisherModel = require("../models/newPublisher")

const createAuthor= async function (req, res) {
    let author = req.body
    let authorCreated = await AuthorModel.create(author)
    res.send({data: authorCreated})
}

const getAuthorsData= async function (req, res) {
    let getAuthors = await AuthorModel.find()
    res.send({data: getAuthors})
}





const getnewPublisher= async function (req, res) {
    let newPublisher = await publisherModel.find()
    res.send({data: newPublisher})
}


const createPublisher= async function (req, res) {
    let publisher = req.body
    let publisherCreated = await publisherModel.create(publisher)
    res.send({data: publisherCreated})
}

module.exports.createAuthor= createAuthor
module.exports.getAuthorsData= getAuthorsData
module.exports.createPublisher= createPublisher
module.exports.getnewPublisher=getnewPublisher
