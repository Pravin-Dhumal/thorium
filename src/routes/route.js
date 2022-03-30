const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const mw = require("../middlewares/auth")


//------- User's APIs -----------------------------------------------------------------------------------------------------
//  register user
router.post("/register" , userController.createUser)

//  log-in user
router.post("/login" , userController.loginUser)

//------- Book's APIs ----------------------------------------------------------------------------------------------------
//  create book 
router.post("/books" ,mw.authentication , mw.authorizatoin , bookController.createBook)

//  get all book's details by filters
router.get("/books" ,mw.authentication ,bookController.getBooks)

//  get book's details by id
router.get("/books/:bookId" ,mw.authentication , bookController.getBooksById)

//  update book's details by id
router.put("/books/:bookId" ,mw.authentication, mw.authorizatoin , bookController.updateBook)

//  delete book's details by id
router.delete("/books/:bookId" ,mw.authentication , mw.authorizatoin , bookController.deleteBookById)

//  ------ Review's APIs ---------------------------------------------------------------------------------------------------------------
//  create review for book
router.post("/books/:bookId/review" , reviewController.createReview)

//  update review's details for perticular book
router.put("/books/:bookId/review/:reviewId" , reviewController.updateReview)

//  delete review's details for perticular book
router.delete("/books/:bookId/review/:reviewId" , reviewController.deleteReview)



module.exports = router;