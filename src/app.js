const bodyParser = require("body-parser");
const express = require("express");
const csrf = require("csurf");
const configureApp = require("./config");
const signupHandler = require("./handlers/signup");
const callbackHandler = require("./handlers/callback");

const app = express();
configureApp(app);
const parseForm = bodyParser.urlencoded({ extended: false });
const csrfProtection = csrf({ cookie: true });

app.get("/signup", csrfProtection, signupHandler.get);
app.post("/signup", parseForm, csrfProtection, signupHandler.post);
app.post("/callback", bodyParser.json(), callbackHandler);

module.exports = app;
