import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCFUj8VzoeshSf6YOfQpDmcv144VrTovrY",
    authDomain: "chat-with-pdf-f9711.firebaseapp.com",
    projectId: "chat-with-pdf-f9711",
    storageBucket: "chat-with-pdf-f9711.firebasestorage.app",
    messagingSenderId: "222499029004",
    appId: "1:222499029004:web:c4a2e569de219844126e29",
    measurementId: "G-P428FYB49P"
  };

  const app = getApps().length === 0?initializeApp(firebaseConfig):getApp();

  const db = getFirestore(app);

  const storage = getStorage(app);

export { db, storage };