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

    //  CHECK : if any data field is empty
    //  title
    if (!isValid(data.title)) {
      res.status(400).send({ status: false, message: 'please provide title' })
      return
    }
    //  name 
    if (!isValid(data.name)) {
      res.status(400).send({ status: false, message: 'please provide name' })
      return
    }
    //  mobile no.
    if (!isValid(data.phone)) {
      res.status(400).send({ status: false, message: 'please provide phone' })
      return
    }
    //  email
    if (!isValid(data.email)) {
      res.status(400).send({ status: false, message: 'please provide email' })
      return
    }
    if (!isValid(data.password)) {
      res.status(400).send({ status: false, message: 'please provide password' })
      return
    }
    //  address
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


    //  CHECK : if any data field has invalid value or not in proper format
    //  title : not in enum
    if (!(data.title == "Mr" || data.title == "Miss" || data.title == "Mrs")) {
      return res.status(400).send({ status: false, message: 'please provide valid title ( Mr , Mrs or Miss)' })
    }
    //  mobile no  : invalid (format)
    if (!(/^\+?([6-9]{1})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/.test(data.phone))) {
      res.status(400).send({ status: false, message: 'please provide valid mob no' })
      return
    }
    //  email : invalid (format)
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
      res.status(400).send({ status: false, message: 'please provide valid email' })
      return
    }
    //  password : invalid ( format )
    if (!(/^[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(data.password))) {
      res.status(400).send({ status: false, message: 'please provide valid password(minLength=8 , maxLength=16)' })
      return
    }

    //  CHECK : if any data field fails unique validation
    // mobile no  : not unique
    phone = await userModel.findOne({ phone })
    if (phone) {
      res.status(400).send({ status: false, message: "This mobile is number already in use,please provide another mobile number" })
      return
    }
    //  email : not unique
    email = await userModel.findOne({ email })
    if (email) {
      res.status(400).send({ status: false, message: "This  is email already in use,please provide another email" })
      return
    }

    //  CREATE :  user
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

    // CHECK :  if email and password is not present
    //  email
    if (!email) {
      res.status(400).send({ status: false, error: " Please , enter email Id" })
      return
    }
    //  password
    if (!password) {
      res.status(400).send({ status: false, error: " Please , enter password " })
      return
    }

    //  CHECK : if password or email is empty
    //  email
    if (!isValid(email)) {
      res.status(400).send({ status: false, message: 'please provide email' })
      return
    }
    //  password
    if (!isValid(password)) {
      res.status(400).send({ status: false, message: 'please provide password' })
      return
    }

    //  CHECK : if email is not is proper format
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      res.status(400).send({ status: false, message: 'please provide valid email' })
      return
    }

    
    //  CHECK : user with entered password and email is exist or not
    let user = await userModel.findOne({ email: email, password: password });
    if (!user)
      return res.status(400).send({
        status: false,
        msg: "email or password is incorrect",
      });

    //  GENERATE : token  
    const token = jwt.sign({
      userId: user._id.toString(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 1 / 2 * 60 * 60
    }, "Project-3/book-management");

    res.setHeader("x-auth-token", token);
    res.status(200).send({ status: "User log-in successfully", data: token });
    return
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: err.message })
  }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser