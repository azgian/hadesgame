<script lang="ts">
	import { user } from '$lib';
	import LottoBalls from '$lib/components/LottoBalls.svelte';

	// ... 나머지 코드 ...
</script>

<div class="dashboard-content">
	<div class="lottoBalls">
		<LottoBalls />
	</div>
	<div class="title">
		<h2>Dashboard</h2>
		<small>({$user?.email})</small>
	</div>
</div>

<style>
	.dashboard-content {
		background-color: rgba(50, 50, 50, 0.8); /* 반투명 흰색 배경 */
		padding: 0;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		margin: 100px auto; /* 상단에서 100px 간격 */
		width: 100%;
		z-index: 100;
		position: relative;
		min-height: 400px;
		overflow: hidden;
	}
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
