const app = require("express").Router();
const { Blog } = require("../models/blog");

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    if (!req.blog) {
      return res
        .status(404)
        .json({ error: `Blog with ID ${req.params.id} not found` });
    }
    next();
  } catch (err) {
    next(err);
  }
};

app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

app.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

app.get("/:id", blogFinder, async (req, res, next) => {
  try {
    console.log(JSON.stringify(req.blog, null, 2));
    res.status(200).json(req.blog);
  } catch (err) {
    next(err);
  }
});
app.delete("/:id", blogFinder, async (req, res) => {
  try {
    console.log(req.blog);
    req.blog.destroy();
    res.status(200).send("blog deleted successfully!");
  } catch (err) {
    next(err);
  }
});
app.put("/:id", blogFinder, async (req, res) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.status(200).json(req.blog);
  } catch (err) {
    next(err);
  }
});

module.exports = app;
