const express = require('express');
const router = express.Router();
const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")
const ProductController= require("../controllers/productController")
const PurchaseController = require("../controller/purchaseController")
// router.get("/test-me", function (req, res) {
//     res.send("My first ever api!")
// })

let headCheck = function(req,res,next){
    let isFreeAppUser = req.headers["isfreeappuser"]
     
    if(isFreeAppUser != undefined){
      console.log("control goes to middleware")
    
        next();
    
}else{
    res.status(426).send("reqUEST MISSING")
}

}
router.post("/createProduct", ProductController.createProduct)

router.post("/createUser",headCheck, UserController.createUser)

router.post("/createOrder", PurchaseController.createOrder)


module.exports = router;