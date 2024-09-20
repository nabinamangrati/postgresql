const router = require("express").Router();

const { ReadingList } = require("../models");

router.post("/", async (req, res, next) => {
  const { userId, blogId } = req.body;

  if (!userId || !blogId) {
    return res.status(400).json({ error: "userId and blogId are required" });
  }

  try {
    const readingList = await ReadingList.create({
      userId: userId,
      blogId: blogId,
      read: false,
    });

    res.status(201).json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
