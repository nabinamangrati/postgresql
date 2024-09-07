const express = require("express");
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

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.message });
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
