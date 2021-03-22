//Load Dependencies
require('dotenv').config() //Required for Environment Variables
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride =require('method-override');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

//Upload Middleware Dependencies
const upload = require('express-fileupload');
app.use(upload());


//bodyParser dependencies
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Method Override
app.use(methodOverride('_method'));

//
app.use(session({
    secret:'evilman',
    resave: true,
    saveUninitialized:true
}));
app.use(flash());

//Passport Initialization
app.use(passport.initialize());
app.use(passport.session());


//Local Variables using MiddleWare
app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    next();
});
//Database Connection
const mongoose = require("mongoose");
mongoose.connect(String(process.env.mongoDbUrl), {useNewUrlParser: true});
mongoose.connection
  .once('open', ()=>console.log('Mongo DB Connected'))  
  .on('error',(err)=>{console.log('Could not Connect' + err);});  
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

//Load Routes
const home = require("./routes/home/index");
const admin= require("./routes/admin/index");
const posts= require("./routes/admin/posts");
const categories = require("./routes/admin/categories");
const comments = require("./routes/admin/comments");

//Load Handlebars 
//Handlebars Dependencies
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const {select, generateDate, paginate} = require('./helpers/handlebars-helpers');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({handlebars:allowInsecurePrototypeAccess(Handlebars),defaultLayout: 'home', helpers:{select: select, generateDate:generateDate, paginate:paginate}}));
app.set('view engine', 'handlebars');


//Use Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);











//Port Listen Logic
app.listen(process.env.PORT || 3000, function () {
    console.log(`Server is Listening on ${process.env.PORT}`);
});