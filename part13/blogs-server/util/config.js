require("dotenv").config();

module.exports = {
  DB_CONNECTION: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3003,
  SECRET: process.env.SECRET,
};
