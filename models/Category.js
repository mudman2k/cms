const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var moment = require('moment'); 
moment().format(); 


const CategorySchema = new Schema({

     name:{
        type:String,
        required:true,
        
    }
    
});

module.exports = mongoose.model('categories', CategorySchema);