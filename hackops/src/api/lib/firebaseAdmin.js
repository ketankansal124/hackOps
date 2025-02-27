import admin from "firebase-admin";
import serviceAccount from "../firebase-admin-config.json"; // Make sure this is in .gitignore

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();