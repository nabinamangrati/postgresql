const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/sesson");

router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  if (user && user.disabled) {
    return response.status(403).json({
      error: "User is disabled",
    });
  }

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.create({
    userId: user.id,
    token,
    expires_at: new Date(Date.now() + 3600000),
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
