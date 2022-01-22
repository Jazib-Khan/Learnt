const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('homeworks/new', { homework: new Homework() })
})

module.exports = router