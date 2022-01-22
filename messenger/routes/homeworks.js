const express = require('express')
const Homework = require('./../models/homework')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('homeworks/new', { homework: new Homework() })
})

router.post('/', async (req, res, next) => {
    req.homework = new Homework()
    next()
}, saveHomeworkAndRedirect('new'))

function saveHomeworkAndRedirect(path) {
    return async (req, res) => {
        let homework = req.homework
            homework.title = req.body.title,
            homework.description = req.body.description,
            homework.content = req.body.content
        try {
            homework = await homework.save()
            res.redirect(`/homeworks/${homework.slug}`)
        } catch (e) {
            res.render(`homeworks/${path}`, { homework: homework })
        }
    }
}

module.exports = router