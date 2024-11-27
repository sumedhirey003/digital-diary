const express = require("express");
const cors = require("cors");
const diaryRoutes = require("./routes/diaryroutes");
const { db } = require("./config/firebase");

const app = express();

const corsOptions = {
  origin: "https://digital-diary-g8xa-sumedh-hireys-projects.vercel.app", // Frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type"], // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

db.collection("test")
  .get()
  .then(() => console.log("Firebase is working correctly!"))
  .catch((err) => console.error("Firebase test failed:", err));

// Routes
app.use("/api/entries", require("./routes/diaryroutes"));

//catching all the unmatched routes,
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found!!" });
});

//log request debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

//API routing test
//app.get("/api/test", (req, res) => {
//res.json({ message: "API is working" });
//});

//debugging

// app.get("/test", async (req, res) => {
//   try {
//     // Fetch all documents from the 'entries' collection
//     const snapshot = await db.collection("entries").get();

//     if (snapshot.empty) {
//       console.log("No documents found in 'entries' collection");
//       return res
//         .status(404)
//         .json({ success: false, message: "No documents found" });
//     }

//     const data = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log("Fetched Data:", data);
//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.error("Error fetching Firestore data:", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

console.log("Diary Routes Loaded:", diaryRoutes);

console.log("Firebase DB Loaded:", db);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
