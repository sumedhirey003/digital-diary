const express = require("express");
const cors = require("cors");
const diaryRoutes = require("./routes/diaryroutes");
const { db } = require("./config/firebase");

const app = express();
app.use(express.json());
app.use(cors());

db.collection("test")
  .get()
  .then(() => console.log("Firebase is working correctly!"))
  .catch((err) => console.error("Firebase test failed:", err));

// Routes
app.use("/api/entries", diaryRoutes);

//API routing test
//app.get("/api/test", (req, res) => {
//res.json({ message: "API is working" });
//});

//debugging
console.log("Diary Routes Loaded:", diaryRoutes);

console.log("Firebase DB Loaded:", db);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
