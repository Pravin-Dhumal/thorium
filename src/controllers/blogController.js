const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")

const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') return false
    if (typeof (value) === 'string' && value.trim().length > 0) return true
}
const isArray = function (value) {
    if (typeof (value) === "object") return true
}
const isEmptyArray = function (value) {
    if (typeof (value) === "object") {
        value = value.filter(x => x.trim())
        if (value.length == 0) return false
        else return true
    }
}


const createBlog = async function (req, res) {
    try {
        let data = req.body

        // checking if data is empty
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "Bad request. Content to post missing" })
        let { title, body, authorId, category, subcategory, tags } = data

        // checking if authorId is valid or not
        if (!(/^[0-9a-fA-F]{24}$/.test(authorId))) {
            return res.status(400).send({ status: false, message: 'please provide valid authorId' })
        }

        let idMatch = await authorModel.findById(authorId)
        if (!idMatch) return res.status(404).send({ status: false, msg: "No such author present in the database" })

        // checking , if any datafield has no value
        if (!isValid(authorId)) return res.status(400).send({ status: false, msg: 'please provide authorId' })
        if (!isValid(title)) return res.status(400).send({ status: false, msg: 'please provide title' })
        if (!isValid(category)) return res.status(400).send({ status: false, msg: 'please provide category' })
        if (!isValid(body)) return res.status(400).send({ status: false, msg: 'please provide body' })
        if (!isArray(subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory(In Array of string form)' })
        if (!isArray(tags)) return res.status(400).send({ status: false, msg: 'please provide tags(In Array of string form)' })
        if (!isEmptyArray(subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory' })
        if (!isEmptyArray(tags)) return res.status(400).send({ status: false, msg: 'please provide tags' })


        // setting default values
        if (data.isDeleted != null) data.isDeleted = false
        if (data.isPublished != null) data.isPublished = false
        if (data.deletedAt != null) data.deletedAt = ""
        if (data.publishedAt != null) data.publishedAt = ""

        let savedData = await blogModel.create(data)
        //creating entry in db with status 201 success!
        return res.status(201).send({ status: true, msg: savedData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}




const getAllBlogs = async function (req, res) {
    try {
        const filter = req.query
        if (!Object.keys(filter).length > 0) return res.status(400).send({ error: "Please provide filetrs" })

        // checking , if any filter has no value
        if (filter.category != undefined) {
            if (!isValid(filter.category)) return res.status(400).send({ status: false, msg: 'please provide category' })
        }
        if (filter.subcategory != undefined) {
            if (!isValid(filter.subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory' })
        }
        if (filter.tags != undefined) {
            if (!isValid(filter.tags)) return res.status(400).send({ status: false, msg: 'please provide tags' })
        }
        if (filter.authorId != undefined) {
            if (!isValid(filter.authorId)) return res.status(400).send({ status: false, msg: 'please provide authorId' })
        }

        // Searching if blog exist 
        const blogs = await blogModel.find({ ...filter, isDeleted: false, isPublished: true }).populate("authorId")
        if (!blogs.length > 0) return res.status(404).send({ error: "No blog found with these filters " })

        res.status(200).send({ data: blogs })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



const updateBlog = async function (req, res) {
    try {
        //  blogId is present in request path params or not.
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        // checking if blogId is valid or not
        if (!(/^[0-9a-fA-F]{24}$/.test(blogId))) {
            return res.status(400).send({ status: false, message: 'please provide valid blogId' })
        }

        //  blogId is valid or not.
        let blog = await blogModel.findById(blogId)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        // checking if blog is already deleted
        if (blog.isDeleted == true) return res.status(400).send({ error: "Already deleted" })

        // data for updation
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory

        // checking , if any filter has no value
        if (title != undefined) {
            if (!isValid(title)) return res.status(400).send({ status: false, msg: 'please provide title' })
        }
        if (subcategory != undefined) {
            if (!isArray(subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory(In Array of string form)' })
            if (!isEmptyArray(subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory' })
        }
        if (tags != undefined) {
            if (!isArray(tags)) return res.status(400).send({ status: false, msg: 'please provide tags (In Array of string form)' })
            if (!isEmptyArray(tags)) return res.status(400).send({ status: false, msg: 'please provide tags' })
        }
        if (body != undefined) {
            if (!isArray(body)) return res.status(400).send({ status: false, msg: 'please provide body ' })
        }

        let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId },
            {
                $set: { title: title, body: body, isPublished: true, publishedAt: new Date() },
                $addToSet: { subcategory: subcategory, tags: tags }
            }, { new: true })

        res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}



const deleteBlogByPath = async function (req, res) {
    try {
        //  blogId is present in request path params or not.
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        // checking if authorId is valid or not
        if (!(/^[0-9a-fA-F]{24}$/.test(blogId))) {
            return res.status(400).send({ status: false, message: 'please provide valid blogId' })
        }

        //  blogId is valid or not.
        let blog = await blogModel.findById(blogId)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        // if blog is already deleted
        if (blog.isDeleted == true) return res.status(400).send({ status: false, msg: "Blog is already deleted" })

        // deleting blog
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        res.status(200).send({ msg: "blog deleted successfully" })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



const deleteBlogByQuery = async function (req, res) {
    try {
        const filters = req.query
        if (!Object.keys(filters).length > 0) return res.status(400).send({ status: false, msg: "Please enter filters" })

        // checking , if any filter has no value
        if (filters.category != undefined) {
            if (!isValid(filters.category)) return res.status(400).send({ status: false, msg: 'please provide category' })
        }
        if (filters.subcategory != undefined) {
            if (!isValid(filters.subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory' })
        }
        if (filters.tags != undefined) {
            if (!isValid(filters.tags)) return res.status(400).send({ status: false, msg: 'please provide tags' })
        }
        if (filters.authorId != undefined) {
            if (!isValid(filters.authorId)) return res.status(400).send({ status: false, msg: 'please provide authorId' })
        }
        if (filters.isPublished != undefined) {
            if (!isValid(filters.isPublished)) return res.status(400).send({ status: false, msg: 'please provide isPublished' })
        }

        // checking if blog sny blog exist with given filters 
        const blog = await blogModel.find(filters)
        if (!Object.keys(blog).length > 0) return res.status(404).send({ msg: "No blog exist with given filters " })

        // checking if blog already deleted 
        let blogs = await blogModel.find({ authorId: req.query.authorId, isDeleted: false })
        if (!blogs.length > 0) return res.status(400).send({ status: false, msg: "Blogs are already deleted" })

        // deleting blog
        const deletedBlog = await blogModel.updateMany(filters, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deletedBlog) return res.status(404).send({ status: false, msg: "No such blog found" })
        return res.status(200).send({ msg: "blog deleted successfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};



module.exports.createBlog = createBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery
module.exports.deleteBlogByPath = deleteBlogByPath
module.exports.updateBlog = updateBlog
module.exports.getBlogs = getAllBlogs


// 204 = no content 