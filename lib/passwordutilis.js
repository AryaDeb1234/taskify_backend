var crypto=require("crypto");

function genpassword(password) {
    
    let salt=crypto.randomBytes(32).toString("hex");

    let hash=crypto.pbkdf2Sync(password,salt,10000,64,"sha512").toString("hex");

    return {salt,hash};
}

function validpassword(password,hash,salt) {
    
let rehash=crypto.pbkdf2Sync(password,salt,10000,64,"sha512").toString("hex");

return hash===rehash;

}

module.exports={genpassword,validpassword};