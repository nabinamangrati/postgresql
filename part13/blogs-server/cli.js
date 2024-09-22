const express = require("express");

require("express-async-errors");
const app = express();
const blogRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const authorRouter = require("./controllers/authors");
const readingList = require("./controllers/reading_lists");
const logoutRouter = require("./controllers/logout");
const { errorHandler, validateYear } = require("./util/middleware");
const { PORT } = require("./util/config");

app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use("/api/reading-lists", readingList);
app.use("/api/logout", logoutRouter);
app.use(errorHandler, validateYear);

const { connectToDatabase } = require("./util/db");

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
