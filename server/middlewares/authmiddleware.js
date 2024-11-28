const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Authroization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header missing or malformed");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token: ", token);

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    console.log("Token verified successfully:", decodedToken.uid);
    next();
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      console.error("❌ Token expired");
      return res.status(401).json({ message: "Token expired" });
    } else if (error.code === "auth/argument-error") {
      console.error("❌ Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    } else {
      console.error("❌ Token verification failed:", error.message);
      return res
        .status(401)
        .json({ message: "Unauthorized", error: error.message });
    }
  }
};

module.exports = verifyToken;
