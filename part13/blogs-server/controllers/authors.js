const app = require("express").Router();

const { fn, col } = require("sequelize");
const { Blog } = require("../models");

app.get("/", async (req, res, next) => {
  try {
    const authorsData = await Blog.findAll({
      attributes: [
        "author",
        [fn("COUNT", col("id")), "articles"],
        [fn("SUM", col("likes")), "likes"],
      ],
      group: ["author"],
      raw: true,
      order: [["likes", "DESC"]],
    });

    res.json(authorsData);
  } catch (err) {
    next(err);
  }
});

module.exports = app;
