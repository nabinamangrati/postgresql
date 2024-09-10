const express = require("express");
const { Op, fn, col } = require("sequelize");
const { Blog } = require("./models");

require("express-async-errors");
const app = express();
const blogRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const { PORT } = require("./util/config");

app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const { connectToDatabase } = require("./util/db");

app.get("/api/authors", async (req, res, next) => {
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

app.use((err, req, res, next) => {
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map(
      (e) => `Validation ${e.validatorKey} on ${e.path} failed`
    );
    return res.status(400).json({ error: messages });
  }
  if (err.status === 404) {
    return res.status(404).json({ error: err.message || "Not Found" });
  }

  res.status(500).json({ error: "Internal Server Error" });
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
