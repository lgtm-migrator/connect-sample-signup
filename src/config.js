const cookieParser = require("cookie-parser");
const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const i18n = require("i18n");
const path = require("path");

const connectI18nCookieName = "connect_signup_language";
const localesDirectory = path.resolve(__dirname, "../locales");
const localeParamName = "locale";
const supportedLocales = ["en", "fr"];
const fallbackLocales = {
  "fr-FR": "fr",
  "fr-BE": "fr",
  "fr-CA": "fr"
};
const manifestPath = path.join(__dirname, "../manifest.json");
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath))
  : null;

module.exports = function(app) {
  app.use(helmet());
  app.use(cookieParser());

  i18n.configure({
    locales: supportedLocales,
    cookie: connectI18nCookieName,
    directory: localesDirectory,
    fallbacks: fallbackLocales,
    updateFiles: false
  });
  app.use((request, result, next) => {
    if (request.query[localeParamName]) {
      result.cookie(connectI18nCookieName, request.query[localeParamName], {
        maxAge: 900000,
        httpOnly: true
      });
    }
    next();
  });
  app.use(i18n.init);

  app.use("/static", express.static("./build"));
  app.locals.assets = asset => {
    if (manifest === null) {
      return `/static/${asset}`;
    }
    if (process.env.CDN_URL) {
      return process.env.CDN_URL + manifest[asset];
    }
    return `/static/${manifest[asset]}`;
  };
  app.set("view engine", "pug");
  app.set("views", "./src/views");
};
