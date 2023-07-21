const express = require("express");
const router = express.Router();
const { syncDatabase } = require("../controllers/syncController");

//endpoint to sync database
router.get("/", async (req, res) => {
  try {
    await syncDatabase();
    return res.status(200).send("Synced successfully");
  } catch (error) {
    console.log("Failed to sync Table" + error);
    return res.status(500).send("Failed to sync  Table" + error);
  }
});

module.exports = router;
