const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const tokenCheck = require("../Middleware/auth");



const createUser = async function (abcd, xyz) {

  let data = abcd.body;
  let savedData = await userModel.create(data);

  xyz.send({ msg: savedData });
};



const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "thorium",
      organisation: "FUnctionUp",
    },
    "functionup-thorium"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, data: token });
};




const getUserData = async function (req, res) {
  let token = req.headers["x-Auth-token"];
  if (!token) token = req.headers["x-auth-token"];


  if (!token) return res.send({ status: false, msg: "token must be present" });

  console.log(token);
  
  let decodedToken = jwt.verify(token, "functionup-thorium");
  if (!decodedToken)
    return res.send({ status: false, msg: "token is invalid" });

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });
  res.send({ status: true, data: userDetails });
};



const updateUser = async function (req, res) {
  let newId = req.params.userId;
  let user = await userModel.findById(newId);
 
  if (!user) {
    return res.send("No such user exists");
  }
let userUpdatedNumber = req.body;
  let updatedUser = await userModel.findOneAndUpdate({_id:newId},userUpdatedNumber,{new:true});
  res.send({ status: user, data: updatedUser });
};



  const isdeletedUser = async function (req, res) {
      let isDeletedId = req.params.userId;
      let isDeletedProperty = await userModel.findByIdAndUpdate({_id:isDeletedId},{$set: {isDeleted:true}},{new:true});
      res.send({ status: true, data: isDeletedProperty });
    };
  


const postMessage = async function (req, res) {
    let message = req.body.message
    
//middleware1

    // let token = req.headers["x-auth-token"]
    // if(!token) return res.send({status: false, msg: "token must be present in the request header"})
    // let decodedToken = jwt.verify(token, 'functionup-thorium')

    // if(!decodedToken) return res.send({status: false, msg:"token is not valid"})
    
// middleware 2

    // let userToBeModified = req.params.userId
    //    let userLoggedIn = decodedToken.userId
    // if(userToBeModified != userLoggedIn) return res.send({status: false, msg: 'User logged is not allowed to modify the requested users data'})


    let user = await userModel.findById(req.params.userId)
    if(!user) return res.send({status: false, msg: 'No such user exists'})
    
    let updatedPosts = user.posts
    updatedPosts.push(message)
    let updatedUser = await userModel.findOneAndUpdate({_id: user._id},{posts: updatedPosts}, {new: true});
    return res.send({status: true, data: updatedUser})
}


module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser=isdeletedUser;
module.exports.postMessage = postMessage