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

module.exports = errorHandler;
