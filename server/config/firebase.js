// firebase.js
require("dotenv").config();
var admin = require("firebase-admin");

try {
  var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  console.log(
    "service acc ley loaded:",
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "Yes" : "No"
  );

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } else {
    console.log("Firebase Admin already initialized");
  }

  const db = admin.firestore();
  const auth = admin.auth();

  // Test Firestore connection
  db.listCollections()
    .then((collections) => {
      console.log(
        "Firestore connected. Collections:",
        collections.map((col) => col.id)
      );
    })
    .catch((err) => {
      console.error("Error connecting to Firestore:", err.message);
    });

  module.exports = { db, auth };
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK:", error.message);
  process.exit(1); // Exit with an error code
}
