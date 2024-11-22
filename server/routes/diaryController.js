const admin = require("firebase-admin");
//const { orderBy } = require("firebase/firestore");
const { db } = require("../config/firebase");

//adding new entry to the diary
const addEntry = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const entry = {
      userId,
      title,
      content,
      createdAt: admin.firestore.Timestamp.now(),
    };
    const docRef = await db.collection("entries").add(entry);
    res
      .status(201)
      .json({ message: "Entry Added Successfully!!", id: docRef.id });
  } catch (error) {
    console.error("Error Adding an Entry: ", error);
    res.status(500).json({ error: "Failed to add Entry" });
  }
};

//getting all the entries specific to the user
const getEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching entries for userId:", userId);

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request." });
    }

    const querySnapshot = await db
      .collection("entries")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Entries Fetched from Firestore:", entries);

    if (entries.length === 0) {
      return res.status(404).json({ error: "No entries found for this user." });
    }

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Failed to fetch the entries." });
  }
};

//updating the diary entries
const updateEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const { title, content } = req.body;

    if (!entryId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const entryRef = db.collection("entries").doc(entryId);

    const doc = await entryRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Entry not found." });
    }

    await entryRef.update({ title, content });
    res.status(200).json({ message: "Entry updated successfully!" });
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ error: "Failed to update entry." });
  }
};

// Delete a diary entry
const deleteEntry = async (req, res) => {
  try {
    const { entryId } = req.params;

    if (!entryId) {
      return res.status(400).json({ error: "Missing entryId in request." });
    }

    const entryRef = db.collection("entries").doc(entryId);

    const doc = await entryRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Entry not found." });
    }

    await entryRef.delete();

    res.status(200).json({ message: "Entry deleted successfully!" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ error: "Failed to delete entry." });
  }
};

module.exports = {
  addEntry,
  getEntries,
  updateEntry,
  deleteEntry,
};
