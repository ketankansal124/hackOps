import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin SDK (Service Account Required)
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

const app = express();
app.use(cors());
app.use(express.json());

// Sign out route
app.post("/signout", async (req, res) => {
  try {
    const { uid } = req.body; // Get user ID from the request

    if (!uid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Revoke refresh tokens (forces sign-out)
    await admin.auth().revokeRefreshTokens(uid);

    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Sign-out error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
