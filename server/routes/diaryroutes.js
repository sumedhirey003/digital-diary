const express = require("express");
const {
  addEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} = require("./diaryController");
const router = express.Router();

//routes for diary entries
router.post("/add", addEntry);
router.get("/:userId", getEntries);
router.put("/:entryId", updateEntry);
router.delete("/:entryId", deleteEntry);

module.exports = router;
