const router = require("express").Router();

const { ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

const listFinder = async (req, res, next) => {
  try {
    req.reading = await ReadingList.findByPk(req.params.id);
    if (!req.reading) {
      return res
        .status(404)
        .json({ error: `readinglist with ID ${req.params.id} not found` });
    }
    next();
  } catch (err) {
    next(err);
  }
};

router.get("/", async (req, res) => {
  const lists = await ReadingList.findAll();
  res.json(lists);
});

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

router.put("/:id", tokenExtractor, listFinder, async (req, res, next) => {
  try {
    if (req.reading.userId !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own reading list items." });
    }

    req.reading.read = req.body.read;
    await req.reading.save();
    res.status(200).json(req.reading);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
