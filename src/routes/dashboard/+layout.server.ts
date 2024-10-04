import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { UserData, CouponSetData, CouponsData } from '$lib/types';

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

    // 쿠폰셋 데이터 가져오기
    const couponSetCollection = collection(db, 'couponSet');
    const couponSetSnapshot = await getDocs(couponSetCollection);

    const couponSet = couponSetSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            isUsed: data.isUsed,
            userId: data.userId,
            count: data.count,
            createdAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : null
        } as CouponSetData;
    });

    // 쿠폰 데이터 가져오기
    const couponsCollection = collection(db, 'couponSet');
    const couponsSnapshot = await getDocs(couponsCollection);

    const coupons = couponsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            numbersData: data.numbersData,
            userId: data.userId,
            createdAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : null,
            expiresAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : null
        } as CouponsData;
    });

    return {
        users,
        couponSet,
        coupons
    };
};