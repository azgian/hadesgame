<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib';
	import LottoBalls from '$lib/components/LottoBalls.svelte';
	import { getUserProfile } from '$lib/firebase';
	import { type UserProfile } from '$lib';
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
<h2 id="content-title">
	<span class="material-icons">dashboard</span>
	Dashboard
</h2>
<div class="content-info">여기는 내용</div>

<style>
	.lottoBalls {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 150px;
		z-index: -1;
	}
</style>
