const express = require("express");
const {
  addEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} = require("./diaryController");
const router = express.Router();

router.get("/:entryId", (req, res, next) => {
  console.log("Specific entry route hit with entryId:", req.params.entryId);
  next(); // Proceed to the next handler (getEntries)
});

//routes for diary entries
router.post("/", addEntry);
router.get("/:entryId", getEntries);
router.get("/", getEntries);
router.patch("/:entryId", updateEntry);
router.delete("/:entryId", deleteEntry);

module.exports = router;
