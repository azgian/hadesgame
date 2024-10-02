import { initializeApp } from "firebase/app";
import { getAuth, type User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, type DocumentData, Timestamp } from 'firebase/firestore';
import type { UserData } from '$lib/types';  // UserProfile을 $lib에서 import
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

export async function createOrUpdateUserData(uid: string, data: Partial<Omit<UserData, keyof User>>): Promise<void> {
    try {
        await setDoc(doc(db, 'users', uid), data, { merge: true });
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
    }
}

export async function getUserData(uid: string): Promise<UserData | null> {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return validateUserData({ ...data, id: docSnap.id });
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

function validateUserData(data: DocumentData): UserData | null {
    if ('id' in data && 'email' in data) {
        return {
            uid: data.id,  // Firestore 문서의 ID를 uid로 사용
            email: data.email,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            isAdmin: data.isAdmin || false,
            walletAddress: data.walletAddress || '',
            // emailVerified: data.emailVerified || false,
            // displayName: data.displayName || null,
            // photoURL: data.photoURL || null,
            // phoneNumber: data.phoneNumber || null,
            // 추가 필드가 있다면 여기에 포함
        } as UserData;
    }
    return null;
}

export async function updateUserAdminStatus(uid: string, isAdmin: boolean): Promise<void> {
    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, { isAdmin }, { merge: true });
    } catch (error) {
        console.error("Error updating admin status:", error);
        throw error;
    }
}

export async function isUserAdmin(uid: string): Promise<boolean> {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() && userSnap.data().isAdmin === true;
    } catch (error) {
        console.error("Error checking admin status:", error);
        throw error;
    }
}

export async function getAllAdmins(): Promise<string[]> {
    try {
        const adminsQuery = query(collection(db, 'users'), where('isAdmin', '==', true));
        const querySnapshot = await getDocs(adminsQuery);
        return querySnapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error("Error fetching admins:", error);
        throw error;
    }
}
