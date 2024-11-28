// api/entries.js
import {
  addEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../routes/diaryController"; // Adjust path if needed

export default function handler(req, res) {
  const { userId, entryId } = req.query;
  try {
    switch (req.method) {
      case "POST":
        return addEntry(req, res); // Calls the addEntry controller
      case "GET":
        if (entryId) {
          return getEntries(req, res, entryId); // fetchs single entry
        }
        if (userId) {
          return getEntries(req, res, userId); // Calls the getEntries controller
        } else {
          return res.status(400).json({ message: "USer ID is required" });
        }
      case "PUT":
        return updateEntry(req, res); // Calls the updateEntry controller
      case "DELETE":
        return deleteEntry(req, res); // Calls the deleteEntry controller
      default:
        res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("API Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
