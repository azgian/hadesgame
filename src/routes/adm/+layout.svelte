<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { isUserAdmin } from '$lib/firebase';

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const admin = await isUserAdmin(user.uid);
				if (!admin) {
					goto('/dashboard');
				}
			} else {
				goto('/');
			}
		});

		return unsubscribe;
	});
</script>

<nav>
	<!-- 관리자 메뉴 항목들 -->
</nav>

<slot />
