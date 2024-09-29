import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setAdminRole } from '$lib/firebase-admin';
import { updateUserAdminStatus, isUserAdmin } from '$lib/firebase';

export const POST: RequestHandler = async ({ request, locals }) => {
	// 인증 확인
	if (!locals.user) {
		return json({ success: false, error: '인증되지 않은 사용자입니다.' }, { status: 401 });
	}

	const { userId, isAdmin } = await request.json();
	
	// 요청을 보낸 사용자가 관리자인지 확인
	const requestingUserIsAdmin = await isUserAdmin(locals.user.uid);
	
	if (!requestingUserIsAdmin) {
		return json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
	}

	try {
		await setAdminRole(userId, isAdmin);
		await updateUserAdminStatus(userId, isAdmin);
		return json({ success: true });
	} catch (error) {
		console.error('관리자 설정 중 오류 발생:', error);
		return json({ success: false, error: '관리자 설정 중 오류가 발생했습니다.' }, { status: 500 });
	}
};