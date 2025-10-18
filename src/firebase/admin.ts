'use server';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let firestore: Firestore;
let auth: Auth;

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount!),
  });
  firestore = getFirestore(app);
  auth = getAuth(app);
} else {
  app = getApps()[0];
  firestore = getFirestore(app);
  auth = getAuth(app);
}

export async function getFirebaseAdmin() {
  return { db: firestore, auth, app };
}
