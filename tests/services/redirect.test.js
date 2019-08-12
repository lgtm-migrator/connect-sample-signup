const {
  getRedirectURL
} = require("connect-sammple-signup/src/services/redirection");
const {
  generateToken
} = require("connect-sammple-signup/src/services/security");

test("Should format the parameters in the URl", () => {
  const resultURL = getRedirectURL(
    "http://signup.retailer.com",
    "298fe60c-5a6e-43b6-8da4-0d53542681c2",
    "secret_nonce"
  );
  expect(resultURL).toBe(
    `http://signup.retailer.com/?transaction_id=298fe60c-5a6e-43b6-8da4-0d53542681c2&security_key=${generateToken(
      "secret_nonce"
    )}`
  );
});
