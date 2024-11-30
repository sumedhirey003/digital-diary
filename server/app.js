//server/app.js
const express = require("express");
const cors = require("cors");
const diaryRoutes = require("./routes/diaryroutes");
const { db } = require("./config/firebase");
const verifyToken = require("./middlewares/authmiddleware");

const app = express();

app.use(
  cors({
    origin: "https://digital-diary-m26y.vercel.app",
    methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
    allowedHeaders: [
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
      "Authorization",
    ],
    credentials: true,
  })
);

// const allowedOrigins = [
//   "https://digital-diary-m26y.vercel.app", //front prod
//   "https://digital-diary-m26y-sumedh-hireys-projects.vercel.app",
//   "https://digital-diary-m26y-git-master-sumedh-hireys-projects.vercel.app", //git branch
//   "http://localhost:3000",
//   "http://192.168.0.193:3000", // for local development
// ];

//const corsOptions = {
//origin: "*", //function (origin, callback) {
//const allowedOrigins = [
//"https://digital-diary-m26y.vercel.app",
//"https://digital-diary-two.vercel.app",
//"http://localhost:3000",
//"http://192.168.0.193:3000",
//];
//if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//   callback(null, true);
// } else {
//  callback(new Error("Not allowed by CORS"));
// }
//},
//methods: ["GET", "HEAD", "PUT", "POST", "PATCH", "DELETE"], // Allowed methods
//allowedHeaders: [
//"Content-Type",
//"Authorization",
//"X-Requested-With",
//"Accept",
//], // Allowed headers
//credentials: true,
//optionsSuccessStatus: 200,
//};

app.use(express.json());

db.collection("test")
  .get()
  .then(() => console.log("Firebase is working correctly!"))
  .catch((err) => console.error("Firebase test failed:", err));

app.use((req, res, next) => {
  console.log("Incoming Request:", {
    method: req.method,
    origin: req.get("origin"),
    headers: req.headers,
  });
  next();
});

// Log response headers
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log("Response Headers:", res.getHeaders());
    originalSend.call(this, body);
  };
  next();
});

//cors applied to all routes
// const handler = (req, res, next) => next();
// app.use(allowCors(handler));

app.options("*", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://digital-diary-m26y.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// Routes
app.use("/api/entries", verifyToken, diaryRoutes);

//catching all the unmatched routes,
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found!!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

//log request debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

//API routing test
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

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
