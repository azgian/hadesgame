import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { auth } from '$lib/firebase-admin';
import { createOrUpdateUserProfile } from '$lib/firebase';

export const POST: RequestHandler = async ({ request }) => {
	const { email, verificationCode } = await request.json();

	try {
		const user = await auth.getUserByEmail(email);
		const claims = user.customClaims || {};

		if (claims.verificationCode === verificationCode) {
			// 인증 성공
			// 인증 코드 클레임 제거
			await auth.setCustomUserClaims(user.uid, { verificationCode: null });

            // 사용자 프로필 생성
            await createOrUpdateUserProfile(user.uid, {
                email: user.email,
            });

			// 커스텀 토큰 생성
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