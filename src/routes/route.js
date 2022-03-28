const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewModel")

//------- User's APIs -----------------------------------------------------------------------------------------------------
//  register user
router.post("/register" , userController.createUser)

//  log-in user
router.post("/login" , userController.loginUser)

//------- Book's APIs ----------------------------------------------------------------------------------------------------
//  create book 
router.post("/books" , bookController.createBook)

//  get all book's details by filters
router.get("/books" , bookController.getBooks)

//  get book's details by id
router.get("/books/:bookId" , bookController.getBooksById)

//  update book's details by id
router.put("/books/:bookId" , bookController.updateBook)

//  delete book's details by id
router.delete("/books/:bookId" , bookController.deleteBookById)

//  ------ Review's APIs ---------------------------------------------------------------------------------------------------------------
//  create review for book
router.post("/books/:bookId/review" , reviewController.createReview)



module.exports = router;