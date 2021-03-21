const express = require('express');
const {
    builtinModules
} = require('module');
const Post = require('../../models/Post');
const router = express.Router();
const User = require('../../models/Post');
const faker = require('faker');
const {
    userAuthenticated
} = require('../../helpers/authentication');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');

//Loading Admin Routes to access admin template.
router.all('/*', userAuthenticated, (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

});
//Files for Routes are located in /views/admin/

router.get('/', (req, res) => {

    const promises=[
        Post.count().exec(),
        Category.count().exec(),
        Comment.count().exec(),
        User.count().exec(),

    ];
    Promise.all(promises).then(([postCount, categoryCount, commentCount, userCount])=>{
        res.render('admin/index', {
                                postCount: postCount,
                                categoryCount: categoryCount,
                                userCount: userCount,
                                commentCount: commentCount
                            });

    });
    //How to create a post and add dynamic data into the route: The Hard Way
    // Post.count().then(postCount => {
    //     Category.count().then(categoryCount => {
    //         User.count().then(userCount => {
    //             Comment.count().then(commentCount => {
    //                 res.render('admin/index', {
    //                     postCount: postCount,
    //                     categoryCount: categoryCount,
    //                     userCount: userCount,
    //                     commentCount: commentCount
    //                 });
    //             })

    //         })

    //     })
    // })


});



router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});
router.post('/generate-fake-posts', (req, res) => {
    let filename = '';

    for (let i = 0; i < req.body.amount; i++) {
        let post = new Post
        post.title = faker.name.title();
        post.body = faker.lorem.sentences();
        post.status = "public";
        post.allowComments = faker.random.boolean();
        post.filename = '';
        post.date = Date.now();
        post.slug = faker.name.title();
        post.save().then(savedPost => {
            console.log('This Post has been created' + savedPost);
        });

    }
    res.redirect('/admin/posts');
});

module.exports = router;