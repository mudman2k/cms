const express = require('express');
const {
    builtinModules
} = require('module');
const Post = require('../../models/Post');
const router = express.Router();
const User = require('../../models/Post');
const Category = require('../../models/Category');
//Loading Category Routes to access admin template.
router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

});
//Files for Routes are located in /views/admin/
router.get('/', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/categories', {
            categories: categories
        });
    });


});

router.post('/create', (req, res) => {
    const newCategory = Category({
        name: req.body.name
    });
    newCategory.save().then(savedCategory => {
        res.redirect('/admin/categories');
    });

});


router.get('/edit/:id', (req, res) => {

    Category.findOne({
        _id: req.params.id
    }).then(category => {
        res.render('admin/categories/edit', {
            category: category
        });
    });


});

router.put('/edit/:id', (req, res) => {

    Category.findOne({
        _id: req.params.id
    }).then(category => {

        category.name = req.body.name;

        category.save().then(savedCategory => {

            res.redirect('/admin/categories');
        });
    });
});





router.delete('/:id', (req, res) => {
    Category.findOne({
        _id: req.params.id
    }).then(category => {
        category.remove();
        res.redirect('/admin/categories');
    });

});

module.exports = router;