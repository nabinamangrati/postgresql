const router = require("express").Router();

const { ReadingList } = require("../models");

router.post("/", async (req, res, next) => {
  const { userId, blogId } = req.body;

  // Validate input
  if (!userId || !blogId) {
    return res.status(400).json({ error: "userId and blogId are required" });
  }

  try {
    const readingList = await ReadingList.create({
      user_id: userId,
      blog_id: blogId,
      read: false,
    });

    // Construct a response object
    const response = {
      id: readingList.id,
      user_id: readingList.user_id,
      blog_id: readingList.blog_id,
      read: readingList.read,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
