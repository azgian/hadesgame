/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// 기존 내용은 그대로 두고 아래 내용을 추가합니다.
interface ImportMetaEnv {
    PUBLIC_FIREBASE_API_KEY: string;
    PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    PUBLIC_FIREBASE_PROJECT_ID: string;
    PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    PUBLIC_FIREBASE_APP_ID: string;
    PUBLIC_MAILERSEND_API_KEY: string;
    PUBLIC_VERIFIED_EMAIL: string;
    // 다른 환경 변수들도 여기에 추가하세요
    [key: string]: string | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export {};
