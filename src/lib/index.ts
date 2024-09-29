import { writable, type Writable } from 'svelte/store';
import { type UserInfo } from 'firebase/auth';
import type { Timestamp, FieldValue } from 'firebase/firestore';

export const user: Writable<UserInfo | null> = writable(null);

export interface UserData {
    id?: string;
    email?: string;
    walletAddress?: string;
    createdAt?: Timestamp;
    isAdmin?: boolean;
    // 필요한 다른 필드들...
}

export interface UserProfile {
    email?: string;
    walletAddress?: string;
    createdAt?: Timestamp | FieldValue;  // Timestamp 또는 FieldValue 허용
    isAdmin?: boolean;
    // 필요한 다른 필드들...
}

export function isValidUser(user: UserData): user is UserData & { email: string } {
    return typeof user.email === 'string' && user.email.trim() !== '';
}
