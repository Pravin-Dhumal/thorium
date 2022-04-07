const urlModel= require("../models/urlModel")
const shortId= require("shortid")
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  16368,
  "redis-16368.c15.us-east-1-2.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("Y52LH5DG1XbiVCkNC2G65MvOFswvQCRQ", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);




const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
  }
  const baseUrl="http://localhost:3000"
const urlShort= async function (req,res){

try{
    const longUrl=req.body.longUrl
    //checking body is empty or not
    if(!isValid(longUrl)) return res.status(400).send({status:false,msg:"no data in body,please enter some data."})

//checking url in proper formet or not by regex
if (! /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm.test(longUrl.trim())) {
    return res.status(400).send({ status: false, message: "This is not a valid Url"})

}
//generate urlCode
const urlCode= shortId.generate(longUrl)
console.log(urlCode)
//checking urlCode is uniqe or not
const existCode=await urlModel.findOne({longUrl:longUrl})
if(existCode) return res.status(400).send({msg:"url code is already exist","please use this short url":existCode.shortUrl})

//create a database 
const data= {
    urlCode:urlCode,
    shortUrl:baseUrl+"/"+urlCode,
    longUrl:longUrl}


//create short url
 const createShortUrl=  await urlModel.create(data)
 return res.status(201).send({status:true,msg:"doc created succesfully",data:data})



}
catch(error)
{
    console.log("error",error.message)
    res.status(500).send({status:false,msg:error.message})

}
}
module.exports.urlShort = urlShort


// get url.........................
const getUrl = async function(req,res){
    try{
        const urlCode=req.params.urlCode
        if(!isValid(urlCode))return res.status(400).send({status:false,msg:"please enter urlCode."})
        
        const url=await urlModel.findOne({urlCode:urlCode})
       console.log(url)
       if(!url)return res.status(400).send({status:false,msg:"invalid urlCode,please enter a valid one."})
        if(url){
            const newVar=url.longUrl
            return res.status(302).redirect(newVar)
        }
       
          
       }catch(err){
           return res.status(500).send({status:true,message:err.message})
       }
}
module.exports.getUrl=getUrl


// const getUrl = async function(req,res){
//   try{
//       const urlCode=req.params.urlCode
//       if(!isValid(urlCode))return res.status(400).send({status:false,msg:"please enter urlCode."})
      
//       const url=await urlModel.findOne({urlCode:urlCode})
//       console.log(url)
//      
//       if(!url)return res.status(400).send({status:false,msg:"invalid urlCode,please enter a valid one."})
//        let urlDoc=await GET_ASYNC(`${req.params.urlCode}`)
//         if(urlDoc){
//             return res.getUrl(urlDoc.longurl)
//         }
//         else{
//         let url=await urlModel.findOne({urlCode:req.params.urlCode})
//         await SET_ASYNC(`${req.params.urlCode}`,JSON.stringify(url))
//         return res.redirect(url.longurl)
//         }
//     }
     
        
//      catch(err){
//          return res.status(500).send({status:true,message:err.message})
//      }
// }
// module.exports.getUrl=getUrl



  