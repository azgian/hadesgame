<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib';
	import LottoBalls from '$lib/components/LottoBalls.svelte';
	import { getUserProfile, type UserProfile } from '$lib/firebase';
	import { onMount } from 'svelte';
	let profile: UserProfile | null = null;
	onMount(async () => {
		if ($user) {
			profile = await getUserProfile($user.uid);
		} else {
			goto('/');
		}
		console.log(profile);
	});
</script>

<div class="lottoBalls">
	<LottoBalls />
</div>
<div class="title">
	<h2>Dashboard</h2>
	<small>({$user?.email})</small>
</div>

<style>
	.lottoBalls {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 150px;
		z-index: -1;
	}
	.title {
		padding: 0 25px;
		color: white;
		display: flex;
		align-items: center;
		gap: 15px;
	}
	h2 {
		color: var(--primary-color);
	}
</style>
