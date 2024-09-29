import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { auth } from '$lib/firebase-admin';
import { createOrUpdateUserProfile } from '$lib/firebase';
import type { UserProfile } from '$lib';
import { serverTimestamp } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const { email, verificationCode } = await request.json();

	try {
		const user = await auth.getUserByEmail(email);
		const claims = user.customClaims || {};

		if (claims.verificationCode === verificationCode) {
			// 인증 성공
			await auth.setCustomUserClaims(user.uid, { verificationCode: null });

			const userProfile: Partial<UserProfile> = {
				email: user.email,
				createdAt: serverTimestamp(),  // serverTimestamp 사용
				// walletAddress는 여기서 설정하지 않습니다. 사용자가 나중에 설정할 수 있도록 합니다.
			};

			await createOrUpdateUserProfile(user.uid, userProfile);

			const customToken = await auth.createCustomToken(user.uid);

			return json({ success: true, customToken });
		} else {
			// 인증 실패
			return json({ success: false, error: '잘못된 인증 코드입니다.' });
		}
	} catch (error) {
		console.error('인증 코드 확인 중 오류 발생:', error);
		return json({ success: false, error: '인증 처리 중 오류가 발생했습니다.' }, { status: 500 });
	}
};