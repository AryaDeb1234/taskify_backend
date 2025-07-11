require("dotenv").config(); // Ensure .env is loaded

const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");

// Load private key from ENV or fallback to file
const priv_key = process.env.PRIVATE_KEY
  ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
  : require("fs").readFileSync(require("path").join(__dirname, "..", "rsa_private.pem"), "utf8");

  console.log(priv_key);

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
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, priv_key, {
    expiresIn: expirein,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expirein,
  };
}

module.exports = { genpassword, validpassword, issuejwt };
