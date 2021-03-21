const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {
    userAuthenticated
} = require('../../helpers/authentication');


router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();

});


router.get('/', (req, res) => {
    Comment.find({user:req.user.id}).populate('user').then(comments => {
        res.render('admin/comments', {
            comments: comments
        });
    })


})


router.post('/', (req, res) => {
    Post.findOne({
        _id: req.body.id
    }).then(post => {


        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body
        });

        post.comments.push(newComment);

        post.save().then(savedPost => {

            newComment.save().then(savedComment => {

                req.flash('success_message', ` Post is Under Review. Once Approved, it will be visible.`);
                res.redirect(`/post/${post.id}`);


            })



        });
    })


});

router.delete('/:id', (req, res) => {
    Comment.findOne({
            _id: req.params.id
        })
        .then(comment => {
            Post.findOneAndUpdate({comments:req.params.id},{$pull:{comments: req.params.id}},(err, data)=>{
                if(err) console.log(err);
                comment.remove();
                res.redirect('/admin/comments');
                console.log("Delete Successful" + comment);
                req.flash('success_message', ` Post Was Deleted Successfully`);
            });
            
        });

});
//Approve Comment Logic
router.post('/approve-comment',(req, res)=>{
    Comment.findByIdAndUpdate(req.body.id, {$set:{approveComment:req.body.approveComment}}, (err, result)=>{
        if(err) return err;
        res.send(result);
    })
    
});

module.exports = router;