const jwt = require("jsonwebtoken")
const bookModel = require("../models/bookModel")

const authentication = async function (req, res, next) {
    try {
        let isToken = req.headers["x-auth-token"]
        //  check : token is present or not
        if (!isToken) {
            res.status(400).send({ status: false, msg: "token must be present" });
            return
        }
        //  decode : token
        let decodedToken = jwt.verify(isToken, "Project-3/book-management");

        //  store : decoded token 
        req.decodedToken = decodedToken

        //  check : if token is invalid 
        if (!decodedToken) {
            res.status(401).send({ status: false, msg: "token is invalid" });
            return
        }
        next();
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ status: false, message: err.message })
        return
    }
}



const authorizatoin = async function (req, res, next) {
    try {
        //  store : token's userId in variale 
        const tokenUserId = req.decodedToken.userId

        //  if userId present in request body ( for create Book )
        let userId = req.body.userId

        if (userId) {
            //  check : if userId is invalid ( not in standard format )
            if (!(/^[0-9a-fA-F]{24}$/.test(userId))) {
                res.status(400).send({ status: false, message: 'please provide valid userId' })
                return
            }

            //  check : authorization for entered userId
            if (tokenUserId != userId) {
                res.status(403).send({ status: false, message: "You Haven't right to perform this task" })
                return
            }
        }
        else {
            //  if bookId present if path params ( for update , delete book )
            const bookId = req.params.bookId

            //  check : if userId is not present 
            if (!bookId) {
                res.status(400).send({ status: false, message: "Please enter bookId" })
                return
            }
            //  check : if userId is invalid ( not in standard format )
            if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
                res.status(400).send({ status: false, message: 'please provide valid bookId' })
                return
            }

            //  find : userId by given bookId 
            userId = await bookModel.find({ _id: bookId }).select({ userId: 1, _id: 0 })
            userId = userId.map(x => x.userId)

            //  check : authorization for entered userId
            if (tokenUserId != userId) {
                res.status(403).send({ status: false, message: "You Haven't right to perform this task" })
                return
            }
        }

        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}




module.exports.authentication = authentication
module.exports.authorizatoin = authorizatoin