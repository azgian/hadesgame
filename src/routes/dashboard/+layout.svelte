<script lang="ts">
	import ContentTitle from '$lib/components/ContentTitle.svelte';

	const subMenus = [
		{ pathName: '', pageName: 'Main' },
		{ pathName: '/coupon', pageName: 'Coupon' }
	];
</script>

<ContentTitle routeIcon="dashboard" routeName="Dashboard" routeBasePath="/dashboard" {subMenus} />

<div class="content-page">
	<slot />
</div>

<style>
	.content-page {
		background-color: rgba(50, 50, 50, 0.8);
		padding: 30px 0;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
</style>
