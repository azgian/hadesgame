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
