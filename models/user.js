
var mongoose=require("mongoose");

let userschema=mongoose.Schema({
    username:String,
    hash:String,
    salt:String
}); 

 
module.exports=mongoose.model("user",userschema);