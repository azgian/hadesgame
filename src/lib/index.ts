import { writable, type Writable } from 'svelte/store';
import { Timestamp } from 'firebase/firestore';
import type { UserData } from './types.ts'

export const user: Writable<UserData | null> = writable(null);

export const isValidUser = (user: UserData): user is UserData & { email: string } => {
    return typeof user.email === 'string' && user.email.trim() !== '';
}

export const convertToTimestamp = (date: unknown): Timestamp => {
    if (date instanceof Timestamp) {
        return date;
    }
    if (date instanceof Date) {
        return Timestamp.fromDate(date);
    }
    if (typeof date === 'number') {
        return new Timestamp(Math.floor(date / 1000), (date % 1000) * 1000000);
    }
    if (typeof date === 'string') {
        return Timestamp.fromDate(new Date(date));
    }
    throw new Error('Unknown date format');
};

export const formatDate = (date: unknown, format: string = ''): string => {
    if (!date) return '날짜 없음';
    
    const d = convertToTimestamp(date).toDate();
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const ymd = `${year}-${month}-${day}`;
    
    if (format === 'ymd') {
        return ymd;
    } else {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds}`;
        return `${ymd} ${time}`;
    }
};

export const checkMobile = (width: number = 768): boolean => {
    if (typeof window !== 'undefined') {
        return window.innerWidth <= width;
    }
    return false;
}

export const toggleState = (state: boolean): boolean => {
    return !state;
}