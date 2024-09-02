require("dotenv").config();
//.env file will be in the gitignore file for the security/protection reasons
//i have pushed the env file as well in github to remember in future
//when i clone again after time the .env file wont come becuz it will be in the gitignore

const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);
Blog.sync();

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  console.log(req.body);
  const blog = await Blog.create(req.body);
  res.json(blog);
});

app.get("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    console.log(blog);
    res.json(blog);
  } else {
    res.status(404).end();
  }
});
app.delete("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    console.log(blog);
    blog.destroy();
    res.status(200).send("blog deleted successfully!");
  } else {
    res.status(404).send("Blog not found");
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
