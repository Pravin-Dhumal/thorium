const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const mw = require("../middleware/auth-middleware")

// create author
router.post("/createAuthor", authorController.createAuthor)

//  create blog
router.post("/createBlog",mw.authentication, blogController.createBlog)

//  delete blog by query
router.delete("/deleteBlog",mw.authentication,mw.authorization, blogController.deleteBlogByQuery)

// delete blog by path params
router.delete("/deleteBlog/:blogId",mw.authentication,mw.authorization, blogController.deleteBlogByPath)

//  update blog
router.put("/updateBlog/:blogId" ,mw.authentication,mw.authorization, blogController.updateBlog)

//  get blog
router.get("/getBlogs" ,mw.authentication, blogController.getBlogs)

//  login  author
router.post("/loginAuthor" , authorController.loginAuthor)


module.exports = router;