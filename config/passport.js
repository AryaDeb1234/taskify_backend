var passport=require("passport");

var localstratagey=require("passport-local").Strategy;

var {validpassword}=require("../lib/passwordutilis");

var user=require("../models/user");


var verifycallback=async (username,password,done)=>{
   try {
    let founduser=await user.findOne({username});

    if (!founduser) {
        return done(null,false,{message:"user not found"});
    }

    let isvalid=validpassword(password,founduser.hash,founduser.salt);

    if (isvalid) {
        return done(null,founduser);
    } else {
        return done(null,false,{message:"can't match"});
    }

   } catch (err) {
    return done(err);
   }
}

let Strategy=new localstratagey(verifycallback);

passport.use(Strategy);

passport.serializeUser(function(userobj,done){
    return done(null,userobj.id);
})

passport.deserializeUser(async function(id,done){
    try {
        let founduser=await user.findById(id);
        return done(null,founduser);
    } catch (err) {
        return done(err);
    }
})