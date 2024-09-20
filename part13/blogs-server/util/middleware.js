const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

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

module.exports = { errorHandler, validateYear, tokenExtractor };
