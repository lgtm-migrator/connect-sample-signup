const forge = require("node-forge");

function generateToken(salt) {
  const token = forge.md.sha256.create();
  token.update(salt + process.env.CONNECT_SIGNUP_SECRET_KEY);
  return token.digest().toHex();
}

module.exports = { generateToken };
