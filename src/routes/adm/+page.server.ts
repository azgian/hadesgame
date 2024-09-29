import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import type { UserData } from '$lib';

export const load: PageServerLoad = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    const users = usersSnapshot.docs
        .map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : null
            } as UserData;
        })
        .filter(user => {
            // isAdmin이 없거나 false인 사용자만 필터링
            return !user.isAdmin;
        });

    return {
        users
    };
};