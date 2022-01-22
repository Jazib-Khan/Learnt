const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('homeworks/new', { homework: new Homework() })
})

router.post('/', async (req, res, next) => {
    req.homework = new Homework()
    next()
}, saveHomeworkAndRedirect('new'))

module.exports = router