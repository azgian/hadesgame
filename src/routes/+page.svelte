<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib';
	import SignPage from '$lib/components/SignPage.svelte';
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

{#if !isAuthenticated}
	<SignPage />
{:else}
	<!-- 로그인 후 표시할 내용 (선택적) -->
	<p>로그인되었습니다. 리다이렉트 중...</p>
{/if}

<style>
	/* 필요한 스타일 */
</style>
