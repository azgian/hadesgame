import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FIREBASE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

export const auth = getAuth();

export async function setAdminRole(uid: string, isAdmin: boolean) {
  try {
    await auth.setCustomUserClaims(uid, { admin: isAdmin });
    console.log(`User ${uid} admin status set to ${isAdmin}`);
  } catch (error) {
    console.error('Error setting admin role:', error);
    throw error;
  }
}
