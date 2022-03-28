const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const moment = require("moment")


const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
  if (typeof value === 'number' && value.toString().trim().length > 0) return true
    
}








//  ---- create - Book -----------------------------------------------------------------------------------

const createBook = async function (req, res) {
  try {
    const data = req.body
    let { title, ISBN } = data

    //  check : user doesn't provide any data
    if (!(Object.keys(data).length) > 0) {
      res.status(400).send({ status: false, message: "Please , provide some data" })
      return
    }

    //  check : title 
    //   if : empty
    if (!isValid(data.title)) {
      res.status(400).send({ status: false, message: 'please provide title' })
      return
    }
    //  if : not unique
    title = await bookModel.findOne({ title })
    if (title) {
      res.status(400).send({ status: false, message: "This  is title already in use,please provide another title" })
      return
    }

    //  check : excerpt
    //  if : empty
    if (!isValid(data.excerpt)) {
      res.status(400).send({ status: false, message: 'please provide excerpt' })
      return
    }

    //  check : userId
    //  if : empty 
    if (!isValid(data.userId)) {
      res.status(400).send({ status: false, message: 'please provide userId' })
      return
    }
    //  if : invalid 
    if (!(/^[0-9a-fA-F]{24}$/.test(data.userId))) {
      return res.status(400).send({ status: false, message: 'please provide valid userId' })
    }
    //  if : doesn't exist
    const userId = await userModel.find({ _id: data.userId })
    if (!userId.length > 0) return res.status(400).send({ status: false, message: "Please enter valid userId" })

    //  check : ISBN
    //  if : empty 
    if (!isValid(data.ISBN)) {
      res.status(400).send({ status: false, message: 'please provide ISBN' })
      return
    }
    //  if : not valid ( longer or shorter than standard ISBN )
    if (!(/^\+?([1-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/.test(data.ISBN))) {
      return res.status(400).send({ status: false, message: 'please provide valid ISBN' })
    }
    //  if : not unique
    ISBN = await bookModel.findOne({ ISBN })
    if (ISBN) {
      res.status(400).send({ status: false, message: "This  is ISBN already in use,please provide another ISBN " })
      return
    }

    //  check : category
    //  if : empty
    if (!isValid(data.category)) {
      res.status(400).send({ status: false, message: 'please provide category' })
      return
    }

    //  check : subcategory
    if (!isValid(data.subcategory)) {
      res.status(400).send({ status: false, message: 'please provide subcategory' })
      return
    }

    //  check : reviews
    if (data.reviews != null) {
      //  if : empty
      if (!isValid(data.reviews)) {
        res.status(400).send({ status: false, message: 'please provide reviews' })
        return
      }
    }

    //  check : releasedAt
    if (!isValid(data.releasedAt)) {
      res.status(400).send({ status: false, msg: 'please provide releasedAt' })
      return
    }
    //  if : not in pro[er format
    if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(data.releasedAt))) {
      return res.status(400).send({ status: false, message: 'please provide valid date in format (YYYY-MM-DD)' })
    }

    //  setting : default values 
    if (data.isDeleted != null) data.isDeleted = false
    if (data.deletedAt != null) data.deletedAt = ''
    if (data.reviews != null )  data.reviews = 0

    //  format : releasedAt into format ( YYYY-MM-DD )
    let date = data.releasedAt
    const isDate = moment(date, 'YYYY-MM-DD')


    // if (isDate = true) {
    //   res.status(400).send({ status: false, msg: 'please provide releasedAt in formate (YYYY-MM-DD)' })
    //   return
    // }

    //  create : Book details
    const createdBook = await bookModel.create(data)
    return res.status(201).send({ status: true, message: "Success" , data : createdBook })

  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}











//----- get All Book's details by given filers-----------------------------------------------------------------------------------------------

const getBooks = async function (req, res) {
  try {
    //  store : filers 
    const filters = req.query

    //  check : userId
    //  if provided in query params and empty
    if (filters.userId != null) {
      if (!isValid(filters.userId)) {
        res.status(400).send({ status: false, message: 'please provide value of userId' })
        return
      }
      //  invalid userId
      if (!(/^[0-9a-fA-F]{24}$/.test(filters.userId))) {
        res.status(400).send({ status: false, message: 'please provide valid userId' })
        return
      }
    }
    //  check : category ( provided but empty )
    if (filters.category != null) {
      if (!isValid(filters.category)) {
        res.status(400).send({ status: false, message: 'please provide value of category' })
        return
      }
    }

    //  check : subcategory  ( provided but empty )
    if (filters.subcategory != null) {
      if (!isValid(filters.subcategory)) {
        res.status(400).send({ status: false, message: 'please provide value of subcategory ' })
        return
      }
    }

    //  retreive : details of book that statisfies given filters
    let books = await bookModel.find({ ...filters, isDeleted: false })
      .select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

    //  if : no data exist                             
    if (!books.length > 0) {
      res.status(404).send({ status: false, message: "No data found" })
      return
    }

    //  sort : Book details by title
    books.sort(function (first, last) {
      return first.title.localeCompare(last.title);
    });

    //  send : final response 
    res.status(200).send({ status: true, message: "Books List", data: books })
    return
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}









//----- get All Book's details by given bookId (params)-----------------------------------------------------------------------------------------------

const getBooksById = async function (req, res) {
  try {
    //  store : bookId by params 
    const bookId = req.params.bookId

    //  check : if there is no bookId in path params
    if (!bookId) {
      res.status(400).send({ status: false, message: "Please , provide bookId in path params" })
    }
    //  check : if invalid bookId
    if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
      return res.status(400).send({ status: false, message: 'please provide valid bookId' })
    }

    //  retreive : details of book that statisfies given filters
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false })

    console.log("book", book)

    //  if no data found by given Id 
    if (!Object.keys(book).length > 0) {
      res.status(404).send({ status: false, message: "No data found" })
      return
    }

    //  find : review details of the book
    const review = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

    //  send : final response 
    res.status(200).send({ status: true, message: "Books List", data: { ...book.toObject(), reviewsData: review } })
    return
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}










//----- Update Book's details by given bookId (params)-----------------------------------------------------------------------------------------------

const updateBook = async function (req, res) {
  try {
    //  store : bookId by params 
    const bookId = req.params.bookId
    const dataForUpdation = req.body

    //  check : if there is no bookId in path params
    if (!bookId) {
      res.status(400).send({ status: false, message: "Please , provide bookId in path params" })
      return
    }
    //  check : if invalid userId
    if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
      res.status(400).send({ status: false, message: 'please provide valid bookId' })
      return
    }

    //  retreive : details of book
    const book = await bookModel.find({ _id: bookId, isDeleted: false })

    //  check : if no data found by given Id 
    if (!book.length > 0) {
      res.status(404).send({ status: false, message: "No data found" })
      return
    }

    //  check : validations on given data for updates

    //  title :  provided but empty 
    if (dataForUpdation.title != null) {
      if (!isValid(dataForUpdation.title)) {
        res.status(400).send({ status: false, message: 'please provide title' })
        return
      }

      //  title : given value for updation is not unique ( already exist in database )
      let { title } = dataForUpdation
      title = await bookModel.findOne({ title })
      if (title) {
        res.status(400).send({ status: false, message: "This title already in use ,please provide another one" })
        return
      }
    }

    //  excerpt :  provided but empty 
    if (dataForUpdation.excerpt != null) {
      if (!isValid(dataForUpdation.excerpt)) {
        res.status(400).send({ status: false, message: 'please provide excerpt' })
        return
      }
    }

    //  release date  :  provided but empty 
    if (dataForUpdation.releasedAt != null) {
      if (!isValid(dataForUpdation.releasedAt)) {
        res.status(400).send({ status: false, message: 'please provide releasedAt' })
        return
      }
      if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(dataForUpdation.releasedAt))) {
        return res.status(400).send({ status: false, message: 'please provide valid date in format (YYYY-MM-DD)' })
      }
  
    }

    //  ISBN :  provided but empty 
    if (dataForUpdation.ISBN != null) {
      if (!isValid(dataForUpdation.ISBN)) {
        res.status(400).send({ status: false, message: 'please provide ISBN' })
        return
      }
      //  if : not valid ( longer or shorter than standard ISBN )
      if (!(/^\+?([1-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/.test(dataForUpdation.ISBN))) {
        return res.status(400).send({ status: false, message: 'please provide valid ISBN' })
      }
      //  ISBN : given value for updation is not unique ( already exist in database )
      let { ISBN } = dataForUpdation
      ISBN = await bookModel.findOne({ ISBN })
      if (ISBN) {
        res.status(400).send({ status: false, message: "This ISBN already in use ,please provide another one" })
        return
      }
    }

    //  Update : book by given details 
    const updatedBook = await bookModel.updateOne({ _id: bookId },
      { ...dataForUpdation },
      { new: true })


    //  send : final response 
    return res.status(200).send({ status: true, message: "Book updated successfully", data: updatedBook })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}











//---- delete book by Id------------------------------------------------------------------------------------------------


const deleteBookById = async function (req, res) {
  try {
    //  store : bookId by params 
    const bookId = req.params.bookId

    //  check : if there is no bookId in path params
    if (!bookId) {
      res.status(400).send({ status: false, message: "Please , provide bookId in path params" })
    }
    //  check : if invalid userId
    if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
      return res.status(400).send({ status: false, message: 'please provide valid bookId' })
    }

    //  search : requested book 
    const book = await bookModel.findById( bookId )

    //  check : if doesn't exist 
    if (!book) {
      res.status(404).send({ status: false, message: "No data found" })
      return
    }

    //  check : if book is already deleted 
    if (book.isDeleted == true) {
      res.status(400).send({ status: false, message: "Book is already deleted" })
      return
    }

    //  deleting : book
    const deletedBook = await bookModel.findOneAndUpdate({ _id: bookId },
      { isDeleted: true , deletedAt : new Date() },
      { new: true })

    //  send : final response if blog is not deleted
    res.status(200).send({ status: true, message: "Success" ,message: "Book deleted successfully" })
    return
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}






module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBooksById = getBooksById
module.exports.deleteBookById = deleteBookById
module.exports.updateBook = updateBook