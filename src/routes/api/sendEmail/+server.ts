import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendEmail } from '$lib/mailersend'; // 경로가 정확한지 확인하세요

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { to, subject, html, text } = await request.json();
        const result = await sendEmail({ to, subject, html, text });
        return json({ success: true, result });
    } catch (error) {
        console.error('이메일 전송 오류:', error);
        return json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
};