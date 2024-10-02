import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { UserData } from '$lib/types';

// CouponData 타입을 정의합니다. 필요에 따라 수정하세요.
interface CouponData {
    id: string;
    userId: string;
    count: number;
    createdAt: Date | null;
}

export const load: LayoutServerLoad = async () => {
    // 사용자 데이터 가져오기
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    const users = usersSnapshot.docs
        .map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                ...data,
                createdAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : null
            } as UserData;
        })
        .filter(user => !user.isAdmin);

    // 쿠폰 데이터 가져오기
    const couponCollection = collection(db, 'couponSet');
    const couponSnapshot = await getDocs(couponCollection);

    const couponSet = couponSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            count: data.count,
            createdAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : null
        } as CouponData;
    });

    return {
        users,
        couponSet
    };
};