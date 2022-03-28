const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
}


//--------- create user --------------------------------------------------------------------------------------------------

const createUser = async function (req, res) {
  try {
    const data = req.body
    if (!Object.keys(data).length > 0) return res.status(400).send({ status: false, error: "Please enter data" })

    //  
    let { phone, email } = data

    //  check : validation for title 
    //  if : empty
    if (!isValid(data.title)) {
      res.status(400).send({ status: false, message: 'please provide title' })
      return
    }
    //  if : not in enum
    if (data.title != ("Mr" || "Miss" || "Mrs")) {
      return res.status(400).send({ status: false, message: 'please provide valid title ( Mr , Mrs or Miss)' })
    }

    //  check : validation for name  (empty)
    if (!isValid(data.name)) {
      res.status(400).send({ status: false, message: 'please provide name' })
      return
    }

    //  check : validation for phone 
    //  if : empty
    if (!isValid(data.phone)) {
      res.status(400).send({ status: false, message: 'please provide phone' })
      return
    }
    //  if : invalid
    if (!(/^\+?([6-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(data.phone))) {
      res.status(400).send({ status: false, message: 'please provide valid mob no' })
      return
    }
    // if  : not unique
    phone = await userModel.findOne({ phone })
    if (phone) {
      res.status(400).send({ status: false, message: "This mobile is number already in use,please provide another mobile number" })
      return
    }

    //  check : validation for email
    //  if : empty
    if (!isValid(data.email)) {
      res.status(400).send({ status: false, message: 'please provide email' })
      return
    }
    //  if : invalid
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
      res.status(400).send({ status: false, message: 'please provide valid email' })
      return
    }
    //  if : not unique
    email = await userModel.findOne({ email })
    if (email) {
      res.status(400).send({ status: false, message: "This  is email already in use,please provide another email" })
      return
    }

    //  check : validation for password 
    //  if : empty
    if (!isValid(data.password)) {
      res.status(400).send({ status: false, message: 'please provide password' })
      return
    }
    //  if : invalid 
    if (!(/^[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(data.password))) {
      res.status(400).send({ status: false, message: 'please provide valid password(minLength=8 , maxLength=16)' })
      return
    }

    //  check : validation for address  ( empty )
    if (data.address != null) {
      if (data.address.street != null) {
        if (!isValid(data.address.street)) {
          res.status(400).send({ status: false, message: 'please provide street' })
          return
        }
      }
      if (data.address.street != null) {
        if (!isValid(data.address.street)) {
          res.status(400).send({ status: false, message: 'please provide street' })
          return
        }
      }
      if (data.address.street != null) {
        if (!isValid(data.address.street)) {
          res.status(400).send({ status: false, message: 'please provide street' })
          return
        }
      }
    }

    const createdUser = await userModel.create(data)
    res.status(201).send({ data: createdUser })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: err.message })
  }
}



//------- log-in user ------------------------------------------------------------------------------------------------------------

const loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    // check :  validations for email
    if (!email) {
      res.status(400).send({ status: false, error: " Please , enter email Id" })
      return
    }
    if (!isValid(email)) {
      res.status(400).send({ status: false, message: 'please provide email' })
      return
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      res.status(400).send({ status: false, message: 'please provide valid email' })
      return
    }

    // check :  validations for password
    if (!password) {
      res.status(400).send({ status: false, error: " Please , enter password " })
      return
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, message: 'please provide password' })
      return
    }

    let user = await userModel.findOne({ email: email, password: password });
    if (!user)
      return res.status(400).send({
        status: false,
        msg: "email or password is incorrect",
      });

    let token = jwt.sign({ userId: user._id.toString() },
      "secuiretyKeyToCheckToken",
      { expiresIn: "30m" });
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: "User log-in successfully", data: token });
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: err.message })
  }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser