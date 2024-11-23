require("dotenv").config();
var admin = require("firebase-admin");

var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("firebase Admin initialized successfully");
} else {
  console.log("Firebase already initialized");
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
