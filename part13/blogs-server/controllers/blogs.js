const app = require("express").Router();
const { Blog } = require("../models/blog");
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

app.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const blog = await Blog.create(req.body);
  res.json(blog);
});

app.get("/:id", blogFinder, async (req, res) => {
  // const blog = await Blog.findByPk(req.params.id);
  if (req.blog) {
    console.log(JSON.stringify(req.blog, null, 2));
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});
app.delete("/:id", blogFinder, async (req, res) => {
  // const blog = await Blog.findByPk(req.params.id);
  if (req.blog) {
    console.log(req.blog);
    req.blog.destroy();
    res.status(200).send("blog deleted successfully!");
  } else {
    res.status(404).send("Blog not found");
  }
});
app.put("/:id", blogFinder, async (req, res) => {
  // const note = await Note.findByPk(req.params.id);
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = app;
