const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var moment = require('moment'); 
moment().format(); 




const CommentSchema = new Schema({
    //Saving the user of the comment
    user:{
        type:Schema.Types.ObjectId,
        ref: 'users'
    },

     name:{
        type:String,
    }, 
    body:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    approveComment:{
        type:Boolean,
        default:false
    }
    
});

module.exports = mongoose.model('comments', CommentSchema);