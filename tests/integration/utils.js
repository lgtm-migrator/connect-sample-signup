const { URL } = require("url");
const {
  generateToken
} = require("connect-sammple-signup/src/services/security");

function makeSignupUrl(transaction_id) {
  const url = new URL("http://localhost:4444/signup");
  url.searchParams.append("transaction_id", transaction_id);
  url.searchParams.append("token", generateToken(transaction_id));
  url.searchParams.append("redirect_uri", "http://localhost:4444");
  url.searchParams.append("nonce", "1234");
  return url.toString();
}

module.exports = {
  makeSignupUrl
};
