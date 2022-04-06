const shortid = require('short-id')
const urlModel = require("../models/urlModel")
const validator = require("../validators/validator")

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

//Connection setup for redis
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const baseUrl = "http://localhost:3000/"



//----- Create Document ---------------------------------------------------------------------------------------------------------------------------------
const shortUrl = async (req, res) => {
    try {
        const longUrl = req.body.longUrl

        //  CHECK : if request body is empty
        if (!longUrl) {
            res.status(400).send({ status: false, message: "Please enter some data in body" })
            return
        }

        //  CHECK : validation 
        //  if url is empty
        if (!validator.isValid(longUrl)) {
            res.status(400).send({ status: false, message: "Please enter longUrl" })
            return
        }
        //  if not in proper formate
        if (!validator.isUrl(longUrl)) {
            res.status(400).send({ status: false, message: "Please enter valid longUrl" })
            return
        }

        //  CHECK : if the entered url already has short url
        let result = await GET_ASYNC(`${longUrl}`)
        if (result) {
            res.status(200).send({ status: true, data: JSON.parse(result) })
            return
        }
        else {
            const isLongUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, urlCode: 1, shortUrl: 1, longUrl: 1 })
            if (isLongUrl) {
                //  SETTING :  document in cache
                await SET_ASYNC(`${longUrl}`, JSON.stringify(isLongUrl))
                //  SENDING : response
                res.status(200).send({ status: true, message: isLongUrl })
                return
            }
        }
        //  GENERATE : urlcode
        const urlCode = shortid.generate(longUrl)

        //  CHECK : if urlCode is already exist in database
        const isUrlCode = await urlModel.findOne({ urlCode })
        if (isUrlCode) {
            res.status(400).send({ status: false, message: "This urlCode is already in use ,try again....." })
            return
        }

        //  CREATE : short url
        const shortUrl = baseUrl + urlCode

        //  CHECK : if urlCode is already exist in database
        const isShortUrl = await urlModel.findOne({ shortUrl })
        if (isShortUrl) {
            res.status(400).send({ status: false, message: "This short url is already in use ,try again ..." })
            return
        }

        //  CREATE : DOC for database including ( urlCode , shortUrl , longUrl)
        const data = {
            urlCode: urlCode,
            shortUrl: shortUrl,
            longUrl: longUrl
        }

        //  CREATING : document
        const createdURL = await urlModel.create(data)

        //  SETTING : created document in cache
        await SET_ASYNC(`${longUrl}`, JSON.stringify(data))
        await SET_ASYNC(`${urlCode}`, JSON.stringify(data))

        //  SEND : response 
        res.status(201).send({ status: true, message: 'Document created', data: data })
        return
    }
    catch (error) {
        console.log("error", error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}


//----- Get Long URL------------------------------------------------------------------------------------------------------------------------------------
const urlCode = async (req, res) => {
    try {
        const urlCode = req.params.urlCode

        //  CHECK : urlCode is present in params or not 
        if (Object.keys(urlCode) == 0) {
            res.status(400).send({ status: false, message: "Please enter urlCode in path param....." })
            return
        }

        //  CHECK : if entered urlCode is stored in chache
        let result = await GET_ASYNC(`${req.params.urlCode}`)
        if (result) {
            let finalResult = JSON.parse(result)    
            res.status(302).redirect(finalResult.longUrl)
            return
        } else {
            //  FINDING : data that have entered urlCode
            result = await urlModel.findOne({ urlCode }).select({ _id: 0, urlCode: 1, shortUrl: 1, longUrl: 1 })
            if (!result) {
                res.status(400).send({ status: false, message: "This url code doesn't exist please try with another....." })
                return
            }
            //  SETTING : url data in cache
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(result))
            await SET_ASYNC(`${result.longUrl}`, JSON.stringify(result))

            //  REDIRECTING : to long URL
            res.status(302).redirect(JSON.parse(result.longUrl))
            return
        }
    }
    catch (error) {
        console.log("error", error.message)
        res.status(500).send({ status: false, message: error.message })
        return
    }
}

module.exports.shortUrl = shortUrl
module.exports.urlCode = urlCode