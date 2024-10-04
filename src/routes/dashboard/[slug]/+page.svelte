<script lang="ts">
	import { page } from '$app/stores';
	import CouponPage from '../CouponPage.svelte';
	import type { PageData } from './$types';
	import { user } from '$lib';
	import type { CouponSetData } from '$lib/types';

	export let data: PageData;

	let latestCouponSetData: CouponSetData | null = null;

	$: {
		const filteredCouponSet =
			$user && data.couponSet
				? data.couponSet.filter((coupon: CouponSetData) => {
						return coupon.userId === $user.uid;
					})
				: [];
		const sortedCouponSet = [...filteredCouponSet].sort((a: CouponSetData, b: CouponSetData) => {
			const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
			const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
			return bTime - aTime;
		});
		latestCouponSetData = sortedCouponSet.length > 0 ? sortedCouponSet[0] : null;
	}
</script>

{#if $page.params.slug === 'coupon'}
	<CouponPage {latestCouponSetData} />
{/if}
