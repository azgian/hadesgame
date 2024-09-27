import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendEmail } from '$lib/mailersend';
import { db } from '$lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const { email, userId } = await request.json();
	const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

	try {
		// Firestore에 인증 코드 저장
		await setDoc(doc(db, 'verificationCodes', userId), {
			code: verificationCode,
			createdAt: new Date(),
			email
		});

		// 이메일 발송
		await sendEmail({
			to: email,
			subject: '회원가입 인증 코드',
			html: `<p>인증 코드: ${verificationCode}</p>`,
			text: `인증 코드: ${verificationCode}`
		});

		return json({ success: true });
	} catch (error) {
		console.error('이메일 전송 오류:', error);
		return json({ success: false, error: '이메일 전송에 실패했습니다.' }, { status: 500 });
	}
};