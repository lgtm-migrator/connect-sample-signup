const { check, validationResult } = require("express-validator/check");
const db = require("../models");
const getAllCountries = require("../services/countries");
const { getRedirectURL } = require("../services/redirection");
const { generateToken } = require("../services/security");

function get(request, result) {
  const { nonce, redirect_uri, token, transaction_id } = request.query;
  if (!redirect_uri || !nonce || !token || !transaction_id) {
    result.status(400);
    const missingFields = [
      "nonce",
      "redirect_uri",
      "token",
      "transaction_id"
    ].filter(key => request.query[key] === undefined);
    result.send(`Bad Request: ${missingFields.join(", ")} missing`);
  } else if (token !== generateToken(transaction_id)) {
    result.status(400);
    result.send("Bad Request: invalid token");
  } else {
    return db.user.findOrCreate({ where: { transaction_id } }).then(() =>
      result.render("signup", {
        country_code: null,
        countries: getAllCountries(),
        csrfToken: request.csrfToken(),
        errors: {},
        first_name: "",
        last_name: "",
        nonce,
        redirect_uri,
        transaction_id
      })
    );
  }
}

function post(request, result) {
  const errors = validationResult(request);
  const { nonce, redirect_uri, transaction_id } = request.body;
  if (!errors.isEmpty()) {
    return result.render(
      "signup",
      Object.assign({}, request.body, {
        countries: getAllCountries(),
        csrfToken: request.csrfToken(),
        errors: errors.mapped(),
        nonce,
        redirect_uri,
        transaction_id
      })
    );
  } else {
    return db.user
      .update(
        {
          country_code: request.body.country_code,
          first_name: request.body.first_name,
          last_name: request.body.last_name
        },
        { where: { transaction_id: transaction_id } }
      )
      .then(([rowCount]) => {
        if (rowCount === 0) {
          throw "User not found";
        }
        result.redirect(getRedirectURL(redirect_uri, transaction_id, nonce));
      })
      .catch(error => {
        console.warn(error);
        result.render("error");
      });
  }
}

const postPipeline = [
  check("country_code")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Country is required"),
  check("first_name")
    .isLength({ min: 1 })
    .withMessage("First name is required"),
  check("last_name")
    .isLength({ min: 1 })
    .withMessage("Last name is required"),
  post
];

module.exports = {
  get,
  post: postPipeline
};
