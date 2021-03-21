const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment'); 
const { schema } = require('./Category');
const URLSlugs = require('mongoose-url-slugs');
moment().format(); 


const PostSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    slug:{
        type:String
    },
     title:{
        type:String,
        required:true,
        minlength:4,
    },
    status:{
        type:String,
        required:true,
        default:'public'
        },
    allowComments:{
        type:Boolean,
        required:true,
        
    },
    body:{
        type:String,
        required:true,
        minlength:4,
        maxlength:1000
    },
    file:{
        type:String,
    },
    datePosted:{
        type:Date,
        default: Date.now()
    },
    //Saving the category of the post
    category:{
        type:Schema.Types.ObjectId,
        ref:'categories'
    },
   
    //Saving the comments of the post
    comments:[{
        type:Schema.Types.ObjectId,
        ref:'comments'
    }]
}, {usePushEach:true});

PostSchema.plugin(URLSlugs('title',{field:'slug'}));

module.exports = mongoose.model('posts', PostSchema);

