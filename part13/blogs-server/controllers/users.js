const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const where = {};

  if (req.query.read) {
    where.read = req.query.read === "true";
  }

  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: ReadingList,
        required: false,
        where,
        include: {
          model: Blog,
          attributes: ["id", "url", "title", "author", "likes", "year"],
        },
      },
    });

    if (user) {
      const response = {
        name: user.name,
        username: user.username,
        readings: user.readinglists.map((reading) => ({
          id: reading.blog.id,
          url: reading.blog.url,
          title: reading.blog.title,
          author: reading.blog.author,
          likes: reading.blog.likes,
          year: reading.blog.year,
          readingLists: [
            {
              read: reading.read,
              id: reading.id,
            },
          ],
        })),
      };
      res.json(response);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    if (user) {
      user.username = req.body.username;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({
        error: `User with username '${req.params.username}' not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
