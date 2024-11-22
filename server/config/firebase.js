var admin = require("firebase-admin");

var serviceAccount = require("../config/emp-digi-diary-firebase-adminsdk-qqd74-761bb37a42.json");

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
