var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/website2');

var db = mongoose.connection;

var TokenSchema  = mongoose.Schema({
       username:{
        type:String,
        index:true
       }
});


var Session = module.exports = mongoose.model('token',TokenSchema);

module.exports.insertToken = function(newUser,callback){
         console.log(newUser);
         newUser.save(callback);
 };