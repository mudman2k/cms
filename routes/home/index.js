const express = require('express');
const {
    builtinModules
} = require('module');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 5;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//Loading Home Routes to access Home template.
router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home';
    next();

});

router.get('/', (req, res) => {

    const perPage = 10;
    const page = req.query.page || 1;
    Post.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate({
            path: 'comments',
            match: {
                approveComment: true
            },
            populate: {
                path: 'user',
                model: 'users'
            }
        })
        .populate('user').then(posts => {
            Post.count().then(postCount => {
                Category.find({}).then(categories => {
                    res.render('home/index', {
                        posts: posts,
                        categories: categories,
                        current:parseInt(page),
                        pages:Math.ceil(postCount/perPage)

                 });

            });



        });


     })


});






router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

//App Login

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    User.findOne({
        email: email
    }).then(user => {
        if (!user) return done(null, false, {
            message: 'No User Found'
        });
        bcrypt.compare(password, user.password, (err, matched) => {

            if (err) return err;
            if (matched) {

                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Incorrect Password.'
                });
            }
        })

        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });



    });

}));



router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,



    })(req, res, next);
});
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

router.get('/register', (req, res) => {
    res.render('home/register');
});


router.post('/register', (req, res) => {
    let errors = [];

    if (!req.body.firstName) {
        errors.push({
            message: 'Please add a First Name.'
        });
    }
    if (!req.body.lastName) {
        errors.push({
            message: 'Please add a Last Name.'
        });
    }
    if (!req.body.email) {
        errors.push({
            message: 'Please add a Email.'
        });
    }
    if (!req.body.password || req.body.password !== req.body.passwordConfirm) {
        errors.push({
            message: 'Either your Password is missing or Password does not match. Please Check and Resubmit.'
        });
    }
    if (!req.body.passwordConfirm || req.body.passwordConfirm !== req.body.password) {
        errors.push({
            message: 'Please Confirm your Password'
        });
    }
    if (errors.length > 0) {
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        })
    } else {
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (!user) {

                bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                    const newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash,
                    });
                    newUser.save(function (err) {
                        if (err) {
                            res.send(err);
                        } else {
                            req.flash('success_message', 'You are now registered. Please Login.')
                            res.redirect('/login');
                            console.log(newUser);
                        }
                    });
                });


            } else {
                req.flash('error_message', "That email exists. Please Login");
                res.redirect('/login');


            }
        })





    }
});




router.get('/post/:slug', (req, res) => {
    Post.findOne({
            slug: req.params.slug
        }).populate({
            path: 'comments',
            match: {
                approveComment: true
            },
            populate: {
                path: 'user',
                model: 'users'
            }
        })
        .populate('user')
        .then(post => {
            Category.find({}).then(categories => {
                res.render('home/post', {
                    post: post,
                    categories: categories,

                });
            });


        });

});


module.exports = router;



// router.post("/login", (req, res)=>{
//     const email = req.body.email;
//     const password = req.body.password;

//     User.findOne({
//         email: email
//     }, function (err, foundUser) {
//         if (err) {
//             console.log(err);
//         } else {
//             if (foundUser) {
//                 bcrypt.compare(password, foundUser.password, function (err, result) {
//                     if (result === true) {
//                         res.redirect('/admin');
//                         console.log("Successful Login for " + foundUser.email + ' @ ' + new Date());

//                     }else{
//                 req.flash('error_message', "Invalid Email and/or Password. Please check and try again.");
//                 res.redirect('/login');
//                     }
//                 });

//             }
//         }
//     });
// });