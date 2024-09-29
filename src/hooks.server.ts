import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/firebase-admin';

export const handle: Handle = async ({ event, resolve }) => {
  const authHeader = event.request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      event.locals.user = decodedToken;
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
    }
  }

  return resolve(event);
};
