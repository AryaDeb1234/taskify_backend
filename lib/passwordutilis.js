require("dotenv").config();

const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Load private key from environment variable or fallback to file
const privKeyPath = process.env.PRIVATE_KEY_PATH || path.join(__dirname, "..", "rsa_private.pem");
const priv_key = fs.readFileSync(privKeyPath, "utf8");

function genpassword(password) {
    // Generate a random salt (32 bytes, converted to hex)
    const salt = crypto.randomBytes(32).toString("hex");

    // Hash the password with the salt using PBKDF2
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    // Return salt and hash for storage in DB
    return { salt, hash };
}

function validpassword(password, hash, salt) {
    // Hash the input password with the stored salt
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    // Compare the newly computed hash with the stored hash
    return hash === hashVerify;
}

function issuejwt(user) {
    const _id = user._id;
    const expirein = "1d";

    const payload = {
        sub: _id,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, priv_key, {
        expiresIn: expirein,
        algorithm: "RS256"
    });

    return {
        token: "Bearer " + signedToken,
        expires: expirein
    };
}

module.exports = { genpassword, validpassword, issuejwt };
