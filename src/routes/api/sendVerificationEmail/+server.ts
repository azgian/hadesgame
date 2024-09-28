import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendEmail } from '$lib/mailersend';
import { db } from '$lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';

function generateVerificationCode() {
	let initChar = '';
	let vCode = '';
	// 알파벳 2자 생성
	for (let i = 0; i < 2; i++) {
		initChar += alphabet[Math.floor(Math.random() * alphabet.length)];
	}	
	// 숫자 6자리 생성
	for (let i = 0; i < 6; i++) {
		vCode += numbers[Math.floor(Math.random() * numbers.length)];
	}
	return initChar + '-' + vCode;
}

export const POST: RequestHandler = async ({ request }) => {
	const { email, tempUserId } = await request.json();
	const verificationCode = generateVerificationCode();

	try {
		// tempUsers 문서 업데이트
		await updateDoc(doc(db, 'tempUsers', tempUserId), {
			verificationCode,
			verificationCodeCreatedAt: new Date(),
		});

		// 이메일 발송
		await sendEmail({
			to: email,
			subject: '회원가입 인증 코드',
			html: `<p>인증 코드: ${verificationCode}</p><p>이 코드는 1회용입니다.</p>`,
			text: `인증 코드: ${verificationCode}\n이 코드는 1회용입니다.`
		});

		return json({ success: true });
	} catch (error) {
		console.error('처리 중 오류 발생:', error);
		return json({ success: false, error: '처리 중 오류가 발생했습니다.' }, { status: 500 });
	}
};