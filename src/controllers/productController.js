const { count } = require("console")
const BookModel= require("../models/productModel")


const createProduct= async function (req, res) {
    let product= req.body

    let savedData= await BookModel.create(product)
    res.send({msg: savedData})
}



module.exports.createProduct= createProduct