import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { UserProfile } from '$lib';  // UserProfile을 $lib에서 import
import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET,
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function createOrUpdateUserProfile(userId: string, data: Partial<UserProfile>) {
    await setDoc(doc(db, 'users', userId), data, { merge: true });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
}

export async function updateUserAdminStatus(userId: string, isAdmin: boolean) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { isAdmin }, { merge: true });
}

export async function isUserAdmin(userId: string): Promise<boolean> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() && userSnap.data().isAdmin === true;
}

export async function getAllAdmins(): Promise<string[]> {
    const adminsQuery = query(collection(db, 'users'), where('isAdmin', '==', true));
    const querySnapshot = await getDocs(adminsQuery);
    return querySnapshot.docs.map(doc => doc.id);
}
