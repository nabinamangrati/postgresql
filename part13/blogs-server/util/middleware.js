const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/sesson");
const { Op } = require("sequelize");

const validateYear = (req, res, next) => {
  const { year } = req.body;

  if (year === undefined || isNaN(year)) {
    return res.status(400).json({
      error: "Year must be provided and be a number.",
    });
  }

  const yearInt = parseInt(year, 10);

  const currentYear = new Date().getFullYear();

  if (yearInt < 1991 || yearInt > currentYear) {
    return res.status(400).json({
      error: `Year must be between 1991 and ${currentYear}.`,
    });
  }

  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map(
      (e) => `Validation ${e.validatorKey} on ${e.path} failed`
    );
    return res.status(400).json({ error: messages });
  }
  if (err.status === 404) {
    return res.status(404).json({ error: err.message || "Not Found" });
  }
  res.status(500).json({ error: "Internal Server Error" });
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);

    try {
      const decodedToken = jwt.verify(token, SECRET);
      req.decodedToken = decodedToken;

      const session = await Session.findOne({
        where: {
          user_id: decodedToken.id,
          token: token,
          expires_at: { [Op.gt]: new Date() },
        },
      });

      if (!session) {
        return res.status(401).json({ error: "Session is invalid or expired" });
      }

      const user = await User.findByPk(decodedToken.id);
      if (user && user.disabled) {
        return res.status(401).json({ error: "User is disabled" });
      }
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { errorHandler, validateYear, tokenExtractor };
