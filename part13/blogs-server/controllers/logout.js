const router = require("express").Router();
const Session = require("../models/sesson");
const { tokenExtractor } = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  try {
    const { id } = req.decodedToken; // Get user ID from the decoded token

    // Remove the session from the database
    await Session.destroy({
      where: {
        user_id: id,
        token: req.get("authorization").substring(7), // Use the token from the request
      },
    });

    res.status(200).json({ message: "Session deleted successfully." }); // Success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
