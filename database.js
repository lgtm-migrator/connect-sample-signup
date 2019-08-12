require("dotenv").config();

module.exports = {
  development: {
    dialect: "postgres",
    url: process.env.DATABASE_URL
  },
  test: {
    dialect: "postgres",
    logging: false,
    url: `${process.env.DATABASE_URL}_test`
  },
  production: {
    dialect: "postgres",
    url: process.env.DATABASE_URL
  }
};
