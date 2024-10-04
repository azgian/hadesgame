<script lang="ts">
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { toast } from '$lib/stores/toast';
	import { formatDate } from '$lib';
	import type { UserData } from '$lib/types';

	export let users: UserData[];

	let selectedUserId: string | null = null;
	let couponCount: number = 1;

	function toggleCouponLayer(userId: string) {
		selectedUserId = selectedUserId === userId ? null : userId;
		couponCount = 1; // 레이어를 열 때마다 입력값 초기화
	}

	function decrementCount() {
		if (couponCount === 1) {
			toast.showToast('쿠폰 갯수는 1개 이상이어야 합니다.', 'error', 1500, false);
		} else {
			couponCount--;
		}
	}
	function incrementCount() {
		couponCount++;
	}
	const confirmCoupon = (userId: string) => {
		toast.showToast(
			`쿠폰갯수 ${couponCount}개를 지급하시겠습니까?`,
			'info',
			null,
			true,
			() => issueCoupon(userId),
			() => toast.hideToast()
		);
	};
	const issueCoupon = async (userId: string) => {
		confirmCoupon(userId);
		try {
			await addDoc(collection(db, 'couponSet'), {
				userId: userId,
				count: couponCount,
				createdAt: serverTimestamp()
			});
			toast.showToast(`쿠폰갯수 ${couponCount}개를 지급했습니다.`, 'success', 1500, false);
			selectedUserId = null; // 레이어를 닫습니다.
			couponCount = 1; // 입력값 초기화
		} catch (error) {
			console.error('쿠폰 발행 중 오류 발생:', error);
			alert('쿠폰 발행에 실패했습니다. 다시 시도해 주세요.');
		}
	};
</script>

<h3 class="title">
	<span class="material-icons">group</span> 회원명단
</h3>

<div class="table-container">
	<table class="table">
		<thead>
			<tr>
				<th>쿠폰</th>
				<th>이메일</th>
				<th>지갑 주소</th>
				<th>가입일</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user}
				{@const userId = user.uid ?? ''}
				<tr>
					<td>
						<button class="btn-coupon" on:click={() => toggleCouponLayer(userId)}>
							<span class="material-icons">local_mall</span>
						</button>
					</td>
					<td>
						{user.email}
					</td>
					<td>{user.walletAddress || '미설정'}</td>
					<td>{formatDate(user.createdAt ?? new Date())}</td>
				</tr>
				{#if selectedUserId === user.uid}
					<tr class="coupon-layer">
						<td colspan="4">
							<div class="coupon-input-container">
								<div class="button-group">
									<button on:click={decrementCount}
										><span class="material-icons">remove</span></button
									>
									<input type="number" min="1" bind:value={couponCount} id="couponCount{userId}" />
									<button on:click={incrementCount}><span class="material-icons">add</span></button>
								</div>
								<button on:click={() => confirmCoupon(userId)} class="success">쿠폰갯수지급</button>
								<button on:click={() => (selectedUserId = null)}>닫기</button>
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.btn-coupon {
		border-radius: 10px;
		padding: 2px 10px;
		cursor: pointer;
	}
	.coupon-layer {
		background-color: #423e3e;
	}

	.coupon-input-container {
		display: flex;
		align-items: center;
		gap: 25px;
	}
	.button-group {
		display: flex;
		align-items: center;
		height: 35px;
	}
	.button-group input {
		width: 80px;
		text-align: center;
		font-size: 1rem;
		height: 100%;
	}
	.button-group button {
		height: 100%;
	}
	.coupon-input-container > button {
		padding: 8px 15px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
	.success {
		background-color: var(--primary-color);
		color: white;
	}
</style>
