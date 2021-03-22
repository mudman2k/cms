const express = require('express');
const {
    builtinModules
} = require('module');
const {
    isEmpty,
    uploadDir
} = require('../../helpers/upload-helper');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {} = ('../../helpers/upload-helper');
const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { updateOne } = require('../../models/Post');
const {userAuthenticated} = require('../../helpers/authentication');

//Loading Admin Routes to access admin template.
router.all('/*',  userAuthenticated, (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

});
//Code for Routes are located in /views/admin/
router.get('/', (req, res) => {

    Post.find({}).populate('category').then(posts => {
        res.render('admin/posts', {
            posts: posts
        });
    });
});

router.get('/my-posts', (req, res)=>{
    Post.find({user:req.user.id}).populate('category').then(posts => {
        res.render('admin/posts/my-posts', {
            posts: posts
        });
    });

});

router.get('/create', (req, res) => {
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories:categories});
    })
    
});

router.post('/create', (req, res) => {
    let filename = '';

    if (!isEmpty(req.files)) {
        let file = req.files.file;
        filename = file.name + "_" + Date.now() + '.jpg';
        let dirUploads = './public/uploads/';

        file.mv(dirUploads + filename, (err) => {
            if (err) throw err;
            else console.log('File Upload Successful');
        })

        console.log('Is Not Empty');
    }
    let allowComments = true;
    if (req.body.allowComments) {
        allowComments = true;
    } else {

        allowComments = false;

    }

    const newPost = new Post({
        user:req.user.id,
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename,
        datePosted: req.body.datePosted,
        category:req.body.category
    });

    newPost.save().then(savedPost => {
        req.flash('success_message', ` Post ${savedPost.title} Was Created Successfully`)

        console.log(savedPost);
        res.redirect('/admin/posts');
    }).catch(error => {
        console.log(error);
    })






});


router.get('/edit/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).then(post => {
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit', {post:post, categories:categories});
        })
        
    });

});


router.put('/edit/:id', (req, res)=>{

    Post.findOne({_id: req.params.id})

        .then(post=>{
            if(req.body.allowComments){
                allowComments = true;
            } else{
                allowComments = false;
            }

            post.user = req.user.id;
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = allowComments;
            post.body = req.body.body;
            post.category = req.body.category;




            if(!isEmpty(req.files)){

                let file = req.files.file;
                filename = Date.now() + '-' + file.name;
                post.file = filename;

                file.mv('./public/uploads/' + filename, (err)=>{

                    if(err) throw err;

                });

            }


            post.save().then(updatedPost=>{



                req.flash('success_message', 'Post was successfully updated');



                res.redirect('/admin/posts/my-posts');
            });

        });


});

router.delete('/:id', (req, res) => {
    Post.findOne({
            _id: req.params.id
        }).populate('comments')
        .then(post => {
            if(!post.comments.length < 1){
                post.comments.forEach(comment =>{
                    comment.remove();
                });
            }
            post.remove();
            fs.unlink(uploadDir + post.file, (err) => {
                res.redirect('/admin/posts/my-posts');
                console.log("Delete Successful" + post);
            });
            req.flash('success_message', `Post Was Deleted Successfully`);
        });

});

module.exports = router;