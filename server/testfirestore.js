const admin = require("firebase-admin");

// Import the service account key
const serviceAccount = require("./config/emp-digi-diary-firebase-adminsdk-qqd74-761bb37a42.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Test function to add and fetch a document
const testFirestore = async () => {
  try {
    // Add a test document to the "testCollection"
    const docRef = await db.collection("testCollection").add({
      message: "Hello Firestore!",
      timestamp: admin.firestore.Timestamp.now(),
    });

    console.log("Document added with ID:", docRef.id);

    // Fetch the document back
    const docSnap = await docRef.get();
    console.log("Document data:", docSnap.data());
  } catch (error) {
    console.error("Error during Firestore test:", error);
  }
};

// Run the test
testFirestore();
