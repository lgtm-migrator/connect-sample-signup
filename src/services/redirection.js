const { generateToken } = require("./security");
const { URL } = require("url");

function getRedirectURL(redirect_uri, transaction_id, nonce) {
  const redirectTo = new URL(redirect_uri);
  redirectTo.searchParams.append("transaction_id", transaction_id);
  redirectTo.searchParams.append("security_key", generateToken(nonce));
  return redirectTo.toString();
}

module.exports = { getRedirectURL };
