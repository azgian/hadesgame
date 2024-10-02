<script lang="ts">
	import type { PageData } from './$types';
	import { user, formatDate } from '$lib';
	import { goto } from '$app/navigation';
	import LottoBalls from '$lib/components/LottoBalls.svelte';
	import { getUserData, createOrUpdateUserData } from '$lib/firebase';
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';

	let walletAddress = '';
	let originalWalletAddress = '';

	onMount(async () => {
		if ($user) {
			const userData = await getUserData($user.uid);
			walletAddress = userData?.walletAddress || '';
			originalWalletAddress = walletAddress;
		} else {
			goto('/');
		}
	});

	async function handleSubmit() {
		if (!$user) {
			toast.showToast('사용자가 로그인되어 있지 않습니다.', 'error', 3000, false);
			return;
		}

		if (walletAddress === originalWalletAddress) {
			toast.showToast('입력한 지갑 주소가 기존 주소와 동일합니다.', 'info', 3000, false);
			return;
		}

		try {
			await createOrUpdateUserData($user.uid, { walletAddress });
			toast.showToast('지갑 주소가 업데이트되었습니다.', 'success', 3000, false);
			originalWalletAddress = walletAddress;
		} catch (err) {
			console.error('지갑 주소 업데이트 중 오류 발생:', err);
			toast.showToast('지갑 주소 업데이트에 실패했습니다.', 'error', 3000, false);
		}
	}

	$: buttonText = originalWalletAddress ? '지갑주소 수정' : '지갑주소 등록';

	export let data: PageData;

	$: userCouponSet = $user ? data.couponSet.filter((coupon) => coupon.userId === $user.uid) : [];
</script>

<div class="lottoBalls">
	<LottoBalls />
</div>

<form class="wallet-form" on:submit|preventDefault={handleSubmit}>
	<div class="input-group">
		<input
			type="text"
			id="wallet-address"
			bind:value={walletAddress}
			placeholder="지갑 주소를 입력하세요"
			required
		/>
		<div class="button-wrapper">
			<button type="submit">{buttonText}</button>
		</div>
	</div>
</form>

<h3 class="title"><span class="material-icons">local_mall</span> 내 쿠폰 목록</h3>

<div class="table-container">
	<table class="table">
		<thead>
			<tr>
				<th>쿠폰</th>
				<th>날짜</th>
			</tr>
		</thead>
		<tbody>
			{#each userCouponSet as coupon}
				<tr>
					<td>
						{#if coupon.isUsed}
							발행되었습니다.
							<!-- 발행후 쿠폰 출력 -->
						{:else}
							<button type="button" on:click={() => goto('/dashboard/coupon')}
								>쿠폰발행하기 ({coupon.count}개)</button
							>
						{/if}
					</td>
					<td class="date">
						{coupon.isUsed ? '추첨일' : '지급일'}:
						{formatDate(coupon.createdAt, 'ymd')}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
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

	.wallet-form {
		max-width: 600px;
		margin: 0 auto 30px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}

	.input-group input {
		padding: 10px;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		background-color: rgba(100, 100, 100, 0.8);
		color: #eee;
		text-align: center;
		margin-bottom: 10px;
	}

	input::placeholder {
		color: #999;
	}

	.button-wrapper {
		display: flex;
		justify-content: flex-end;
	}

	button {
		padding: 10px 20px;
		background-color: var(--primary-color);
		color: var(--primary-text-color);
		border: none;
		border-radius: 4px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: var(--primary-color-dark);
	}

	@media (min-width: 768px) {
		.input-group {
			flex-direction: row;
		}

		.input-group input {
			flex-grow: 1;
			margin-bottom: 0;
			border-radius: 4px 0 0 4px;
		}

		.button-wrapper {
			display: block;
		}

		button {
			border-radius: 0 4px 4px 0;
		}
	}

	td.date {
		width: 180px;
	}
</style>
