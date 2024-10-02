<script lang="ts">
	import { page } from '$app/stores';
	import CouponPage from '../CouponPage.svelte';
	import type { PageData } from './$types';
	import { user } from '$lib';
	import type { CouponSetData } from '$lib/types';

	export let data: PageData;

	let latestData: CouponSetData | null = null;

	$: {
		console.log('1. $user:', $user);
		console.log('2. data.couponSet:', data.couponSet);

		const filteredCoupons =
			$user && data.couponSet
				? data.couponSet.filter((coupon: CouponSetData) => {
						console.log('3. Filtering coupon:', coupon);
						console.log('4. Comparing:', coupon.userId, $user.uid);
						return coupon.userId === $user.uid;
					})
				: [];
		console.log('5. filteredCoupons:', filteredCoupons);

		const sortedCoupons = [...filteredCoupons].sort((a: CouponSetData, b: CouponSetData) => {
			console.log('6. Sorting coupons:', a, b);
			const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
			const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
			return bTime - aTime;
		});
		console.log('7. sortedCoupons:', sortedCoupons);

		latestData = sortedCoupons.length > 0 ? sortedCoupons[0] : null;
		console.log('8. latestData:', latestData);
	}
</script>

{#if $page.params.slug === 'coupon'}
	<CouponPage {latestData} />
{/if}
