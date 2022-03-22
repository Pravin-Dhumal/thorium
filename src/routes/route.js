const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController")

//   create : college
router.post("/colleges" , collegeController.createCollege)

//   create : intern
router.post("/interns" , internController.createIntern)

//   get :  colleges  with interns details 
router.get("/collegeDetails" , collegeController.getColleges)

module.exports = router;