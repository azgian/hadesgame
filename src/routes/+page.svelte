<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib';
	import SignForm from '$lib/components/SignForm.svelte';
	import { goto } from '$app/navigation';

	let isAuthenticated = false;

	onMount(() => {
		const unsubscribe = user.subscribe((value) => {
			isAuthenticated = !!value;
			if (isAuthenticated) {
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
