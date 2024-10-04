import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, query, getDocs, limit, orderBy, startAfter } from 'firebase/firestore';
import type { UserData, CouponSetData } from '$lib/types';

export const load: LayoutServerLoad = async ({ url }) => {
    const defaultPageSize = 15;
    const pageSize = parseInt(url.searchParams.get('limit') || defaultPageSize.toString(), 10);
    const currentPage = parseInt(url.searchParams.get('page') || '1', 10);
    const lastVisibleUser = url.searchParams.get('lastVisibleUser');
    const lastVisibleCoupon = url.searchParams.get('lastVisibleCoupon');

    // 사용자 데이터 가져오기
    const usersCollection = collection(db, 'users');
    let usersQuery = query(usersCollection, orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastVisibleUser) {
        usersQuery = query(usersQuery, startAfter(new Date(lastVisibleUser)));
    }

    const usersSnapshot = await getDocs(usersQuery);
    
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
    const couponSetCollection = collection(db, 'couponSet');
    let couponSetQuery = query(couponSetCollection, orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastVisibleCoupon) {
        couponSetQuery = query(couponSetQuery, startAfter(new Date(lastVisibleCoupon)));
    }

    const couponSetSnapshot = await getDocs(couponSetQuery);

    const couponSet = couponSetSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            count: data.count,
            createdAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : null
        } as CouponSetData;
    });

    const lastVisibleUserDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
    const lastVisibleCouponDoc = couponSetSnapshot.docs[couponSetSnapshot.docs.length - 1];

    return {
        users,
        couponSet,
        pagination: {
            currentPage,
            pageSize,
            lastVisibleUser: lastVisibleUserDoc ? lastVisibleUserDoc.data().createdAt.toDate().toISOString() : null,
            lastVisibleCoupon: lastVisibleCouponDoc ? lastVisibleCouponDoc.data().createdAt.toDate().toISOString() : null,
            hasMoreUsers: usersSnapshot.docs.length === pageSize,
            hasMoreCoupons: couponSetSnapshot.docs.length === pageSize
        }
    };
};