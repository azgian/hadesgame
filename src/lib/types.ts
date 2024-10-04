import { Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export interface UserData extends User
{
    createdAt: Timestamp;
    walletAddress: string;
    isAdmin: boolean;
    customField?: string;
}

export interface CouponSetData
{
    id: string;
    userId: string;
    isUsed: boolean;
    count: number;
    createdAt: Timestamp;
}

export interface CouponsData
{
    id: string;
    numbersData: NumbersData[];
    couponSetId: string;
    createdAt: Timestamp;
    expiresAt: Timestamp;
    userId: string;
}

export interface NumbersData
{
    number: number;
    winningAmount: number;
}