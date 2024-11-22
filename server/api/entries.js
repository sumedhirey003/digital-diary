// api/entries.js
import {
  addEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../routes/diaryController"; // Adjust path if needed

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      return addEntry(req, res); // Calls the addEntry controller
    case "GET":
      return getEntries(req, res); // Calls the getEntries controller
    case "PUT":
      return updateEntry(req, res); // Calls the updateEntry controller
    case "DELETE":
      return deleteEntry(req, res); // Calls the deleteEntry controller
    default:
      res.status(405).json({ message: "Method Not Allowed" });
  }
}
