const express = require("express");
const app = express();
const blogRouter = require("./controllers/blogs");
const { PORT } = require("./util/config");
app.use(express.json());
app.use("/api/blogs", blogRouter);
const { connectToDatabase } = require("./util/db");

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
