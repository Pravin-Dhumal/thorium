const shortid = require('short-id')
const urlModel = require("../models/urlModel")
const validUrl = require("valid-url");

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


//  CHECK : if any data field is empty
const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') {
      return false
    }
    if (typeof (value) === 'string' && value.trim().length > 0) {
      return true
    }
  }



const baseUrl = "http://localhost:3000/"



//----- Create Document ---------------------------------------------------------------------------------------------------------------------------------
const shortUrl = async (req, res) => {
    try {
        const longUri = req.body.longUrl
        //  CHECK : if request body is empty
        if (!longUri) return res.status(400).send({ status: false, message: "Please enter URL in body" })

        const longUrl = longUri.toLowerCase();

        if (!isValid(longUrl)) { return res.status(400).send({ status: false, message: 'Long Url is required' }) }

        if (!validUrl.isUri(longUrl)) { return res.status(400).send({ status: false, message: 'Please provide a valid URL' }) }

        if (!validUrl.isWebUri(longUrl)) { return res.status(400).send({ status: false, message: 'Please provide a valid URL' }) }

        if (!validUrl.isUri(baseUrl)) { return res.status(400).send({ status: false, message: 'The base URL is invalid' }) }

        //  CHECK : if the entered url already has short url

        let dataCache = await GET_ASYNC(`${longUrl}`)
        if (dataCache) return res.status(200).send({ status: true, data: JSON.parse(dataCache) })

        let result = await GET_ASYNC(`${longUrl}`)
        if (result) return res.status(200).send({ status: true, data: JSON.parse(result) })
        else {
            const isLongUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, urlCode: 1, shortUrl: 1, longUrl: 1 })
            if (isLongUrl) {
                //  SETTING :  document in cache
                await SET_ASYNC(`${longUrl}`, JSON.stringify(isLongUrl), "EX", 120)
                return res.status(200).send({ status: true, message: isLongUrl })
        }
        //  GENERATE : urlcode
        const urlCode = shortid.generate(longUrl)

        //  CHECK : if urlCode is already exist in database
        const isUrlCode = await urlModel.findOne({ urlCode })
        if (isUrlCode) return res.status(200).send({ status: false, message: "This urlCode is already generated for other url , please try again...." })
   
        //  CREATE : short url
        const shortUrl = baseUrl + urlCode

        //  CREATE : DOC for database including ( urlCode , shortUrl , longUrl)
        const data = {
            urlCode: urlCode,
            shortUrl: shortUrl,
            longUrl: longUrl
        }

        //  CREATING : document
        const createdURL = await urlModel.create(data)

        //  SETTING : created document in cache
        await SET_ASYNC(`${longUrl}`,JSON.stringify(data), "EX", 120)
        await SET_ASYNC(`${urlCode}`, JSON.stringify(data.longUrl), "EX", 120)

        return res.status(201).send({ status: true, message: 'Document created', data: data })
    }
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
            let url = JSON.parse(result)
console.log("URL",url)
            res.status(302).redirect(url)
            return
        } else {
            //  FINDING : data that have entered urlCode
            result = await urlModel.findOne({ urlCode }).select({ _id: 0, urlCode: 1, shortUrl: 1, longUrl: 1 })
            if (!result) return res.status(404).send({ status: false, message: "This url code doesn't exist please try with another....." })
    
            //  SETTING : url data in cache
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(result.longUrl), "EX", 120)
            await SET_ASYNC(`${result.longUrl}`, JSON.stringify(result), "EX", 120)

            //  REDIRECTING : to long URL
            return res.status(302).redirect(JSON.parse(result.longUrl))
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
