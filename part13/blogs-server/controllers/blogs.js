const app = require("express").Router();
const { Blog, User } = require("../models/index");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { validateYear } = require("../util/middleware");

const { SECRET } = require("../util/config");

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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

app.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } }, // should have used { title: { [Op.substring]: req.query.search} }
        { author: { [Op.iLike]: `%${req.query.search}%` } }, //==>it gives the result but my making ilike when  searched in capital
      ]; //or small letter it will give u results which is case insensative
    }

    const blogs = await Blog.findAll({
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: ["username", "name"],
      },
      where,
      order: [["likes", "DESC"]],
    });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

app.post("/", tokenExtractor, validateYear, async (req, res, next) => {
  try {
    req.body.userId = req.decodedToken.id;
    // console.log("from the blogs blogs controller", req.body.userId);
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

app.get("/:id", blogFinder, async (req, res, next) => {
  try {
    // console.log(JSON.stringify(req.blog, null, 2));
    res.status(200).json(req.blog);
  } catch (err) {
    next(err);
  }
});

app.delete("/:id", tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.blog.userId !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this blog" });
    }

    await req.blog.destroy();
    res.status(200).send("Blog deleted successfully!");
  } catch (err) {
    next(err);
  }
});
app.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.status(200).json(req.blog);
  } catch (err) {
    next(err);
  }
});

module.exports = app;
