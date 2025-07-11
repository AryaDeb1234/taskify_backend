const crypto = require("crypto");
const fs=require("fs");

// Generate RSA key pair
const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // Key size
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    }
});

// Save keys to PEM files
fs.writeFileSync("rsa_private.pem", keyPair.privateKey);
fs.writeFileSync("rsa_public.pem", keyPair.publicKey);
