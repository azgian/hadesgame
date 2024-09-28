import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/firebase-admin';
import { sendEmail } from '$lib/mailersend';

function generateVerificationCode(): { prefix: string, code: string } {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = alphabet[Math.floor(Math.random() * alphabet.length)] + 
                   alphabet[Math.floor(Math.random() * alphabet.length)];
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return { prefix, code };
}

export const POST: RequestHandler = async ({ request }) => {
    const { email } = await request.json();
    const { prefix, code } = generateVerificationCode();
    const fullCode = `${prefix}-${code}`;

    try {
        // 사용자 확인 또는 생성
        let user;
        try {
            user = await auth.getUserByEmail(email);
        } catch {
            // 사용자가 없으면 새로 생성
            user = await auth.createUser({ email });
        }

        // 인증 코드를 사용자의 커스텀 클레임으로 저장
        await auth.setCustomUserClaims(user.uid, { verificationCode: fullCode });

        // 이메일 발송
        await sendEmail({
            to: email,
            subject: '로그인 인증 코드',
            html: `<p>인증 코드: ${fullCode}</p><p>이 코드는 1회용입니다.</p>`,
            text: `인증 코드: ${fullCode}\n이 코드는 1회용입니다.`
        });

        return json({ success: true, codePrefix: prefix });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('처리 중 오류 발생:', error.message);
            return json({ success: false, error: error.message }, { status: 500 });
        } else {
            console.error('알 수 없는 오류 발생');
            return json({ success: false, error: '알 수 없는 오류가 발생했습니다.' }, { status: 500 });
        }
    }
};