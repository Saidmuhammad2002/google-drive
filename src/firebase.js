import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  updateDoc,
} from "firebase/firestore";
import "firebase/auth";
import { getAuth } from "firebase/auth";
const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});
const db = getFirestore();
export const database = {
  addFolder: (values) => addDoc(collection(db, "folders"), values),
  getFolder: (folderId) => getDoc(doc(db, "folders", folderId)),
  addFile: (values) => addDoc(collection(db, "files"), values),
  getChildFolders: (folderId, currentUserId) =>
    query(
      collection(db, "folders"),
      where("parentId", "==", folderId),
      where("userId", "==", currentUserId),
      orderBy("createdAt")
    ),
  getChildFiles: (folderId, currentUserId) =>
    query(
      collection(db, "files"),
      where("folderId", "==", folderId),
      where("userId", "==", currentUserId),
      orderBy("createdAt")
    ),
  preventFromDuplicate: (fileName, currentUserId, folderId) =>
    query(
      collection(db, "files"),
      where("folderId", "==", folderId),
      where("userId", "==", currentUserId),
      where("name", "==", fileName)
    ),
  updateFile: (docId, values) =>
    updateDoc(doc(db, "files", docId), { ...values }),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimeStamp: serverTimestamp,
};
export const auth = getAuth();
export const storage = getStorage();
export default app;
