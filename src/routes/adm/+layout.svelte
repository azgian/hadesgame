<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { isUserAdmin } from '$lib/firebase';
	import ContentTitle from '$lib/components/ContentTitle.svelte';

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

		return () => {
			unsubscribe();
		};
	});

	const subMenus = [
		{ pathName: '', pageName: 'Main' },
		{ pathName: '/members', pageName: 'Members' }
	];
</script>

<ContentTitle routeIcon="settings" routeName="Admin" routeBasePath="/adm" {subMenus} />

<div class="content-page">
	<slot />
</div>

<style>
	.content-page {
		background-color: rgba(50, 50, 50, 0.8);
		padding: 20px 0;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
</style>
