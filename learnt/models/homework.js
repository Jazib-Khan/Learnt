const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const homeworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

homeworkSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this. title, { lower: true, strict: true })
    }
    if (this.content) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.content))
    }

    next()
})

module.exports = mongoose.model('Homework', homeworkSchema)