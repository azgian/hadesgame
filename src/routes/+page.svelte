<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib';
	// import SignPage from '$lib/components/SignPage.svelte';
	import SignForm from '$lib/components/SignForm.svelte';
	import { goto } from '$app/navigation';

	let isAuthenticated = false;

	onMount(() => {
		const unsubscribe = user.subscribe((value) => {
			isAuthenticated = !!value;
			if (isAuthenticated) {
				// 로그인된 경우 대시보드로 리다이렉트
				goto('/dashboard');
			}
		});

		return unsubscribe;
	});
</script>

<SignForm />

<style>
	/* 필요한 스타일 */
</style>
