import { getApps, initializeApp, getApp, App, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

// Load service key safely
const serviceKeyPath = path.resolve(process.cwd(), "service.json");
const serviceKey = JSON.parse(fs.readFileSync(serviceKeyPath, "utf-8"));

let app: App;

if (getApps().length === 0) {
    app = initializeApp({
        credential: cert(serviceKey),
    });
} else {
    app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
