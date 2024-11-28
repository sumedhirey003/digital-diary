// server/routes/diaryControler.js
const admin = require("firebase-admin");
const { db } = require("../config/firebase");

//adding new entry to the diary
const addEntry = async (req, res) => {
  try {
    const { userId, title, content, reminderDateTime, isTask, taskStatus } =
      req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const entry = {
      userId,
      title,
      content,
      createdAt: admin.firestore.Timestamp.now(),
      reminderDateTime: reminderDateTime
        ? admin.firestore.Timestamp.fromDate(new Date(reminderDateTime))
        : null,
      isTask: isTask || false,
      taskStatus: taskStatus || "Not Started Yet",
    };
    //debugging logss
    console.log("Reminder DateTime:", reminderDateTime);
    console.log("Created At:", admin.firestore.FieldValue.serverTimestamp());
    console.log("Entry to be saved:", entry);

    const docRef = await db.collection("entries").add(entry);

    //converting the createdAt & reminderDateTime to ISO string
    const savedDoc = await docRef.get();
    const savedData = savedDoc.data();

    const responseData = {
      ...savedData,
      id: docRef.id,
      createdAt: savedData.createdAt
        ? savedData.createdAt.toDate().toISOString()
        : null,
      reminderDateTime: savedData.reminderDateTime
        ? savedData.reminderDateTime.toDate().toISOString()
        : null,
    };
    res
      .status(201)
      .json({ message: "Entry Added Successfully!!", entry: responseData });
  } catch (error) {
    console.error("Error Adding an Entry: ", error);
    res.status(500).json({ error: "Failed to add Entry" });
  }
};

//getting all the entries specific to the user
const getEntries = async (req, res) => {
  try {
    const { userId } = req.query; // For fetching entries by userId
    const { entryId } = req.query; // For fetching a specific entry by entryId

    if (entryId) {
      // Fetch a specific entry by entryId
      const entryDoc = await db.collection("entries").doc(entryId).get();
      console.log("Fetching specific entry with ID: ", entryId);
      if (!entryDoc.exists) {
        return res.status(404).json({ error: "Entry Not Found." });
      }
      return res.status(200).json({
        id: entryDoc.id,
        ...entryDoc.data(),
      });
    }

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request." });
    }

    // Fetch all entries for the userId
    const querySnapshot = await db
      .collection("entries")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
    const { title, content, reminderDateTime, isTask, taskStatus } = req.body;

    if (!entryId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const entryRef = db.collection("entries").doc(entryId);

    const doc = await entryRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Entry not found." });
    }

    const updates = {
      ...(title && { title }),
      ...(content && { content }),
      ...(reminderDateTime && {
        reminderDateTime: admin.firestore.Timestamp.fromDate(
          new Date(reminderDateTime)
        ),
      }),
      ...(isTask !== undefined && { isTask }),
      ...(taskStatus && { taskStatus }),
    };

    await entryRef.update(updates);
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
