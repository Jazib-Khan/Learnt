const express = require('express')
const Homework = require('./../models/homework')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('homeworks/new', { homework: new Homework() })
})

router.get('/edit/:id', async (req, res) => {
    const homework = await Homework.findById(req.params.id)
    res.render('homeworks/edit', { homework: homework })
})

router.get('/:slug', async (req, res) => {
    const homework = await Homework.findOne({ slug: req.params.slug })
    if (homework == null) res.redirect('/')
    res.render('homeworks/show', { homework: homework })
})

router.post('/', async (req, res, next) => {
    req.homework = new Homework()
    next()
}, saveHomeworkAndRedirect('new'))

router.delete('/:id', async (req, res) => {
    await Homework.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


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