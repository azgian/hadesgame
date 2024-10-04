<script lang="ts">
	import type { CouponsData, CouponSetData, NumbersData } from '$lib/types';
	import { formatDate } from '$lib';
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib'; // 사용자 정보를 저장하는 스토어라고 가정합니다
	import {
		getFirestore,
		collection,
		addDoc,
		updateDoc,
		doc,
		Timestamp,
		query,
		where,
		getDocs,
		orderBy,
		limit
	} from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Balls from '$lib/components/Balls.svelte';

	export let latestCouponSetData: CouponSetData | null;

	let couponInputs: string[] = [];
	let couponCount = 0;
	let couponSetId = '';
	let isLoading: boolean[] = [];
	let coupons: CouponsData | null = null;
	let loadingError: string | null = null;

	$: if (latestCouponSetData) {
		couponCount = latestCouponSetData.count;
		couponSetId = latestCouponSetData.id;
		couponInputs = Array(couponCount).fill('');
		isLoading = Array(couponCount).fill(false);
	}

	onMount(async () => {
		if (latestCouponSetData?.isUsed) {
			try {
				const db = getFirestore();
				const couponsRef = collection(db, 'coupons');
				const q = query(
					couponsRef,
					where('couponSetId', '==', latestCouponSetData.id),
					orderBy('createdAt', 'desc'),
					limit(1)
				);
				const querySnapshot = await getDocs(q);
				if (!querySnapshot.empty) {
					coupons = querySnapshot.docs[0].data() as CouponsData;
				} else {
					loadingError = '일치하는 쿠폰 정보가 없습니다.';
				}
			} catch (error) {
				loadingError = '쿠폰 정보를 불러오는 중 오류가 발생했습니다.';
			}
		}
	});

	const handleInput = (index: number, event: Event) => {
		const input = event.target as HTMLInputElement;
		let value = input.value.replace(/^0+/, '').replace(/\D/g, ''); // 앞의 0과 숫자가 아닌 문자 제거
		const numValue = parseInt(value, 10);

		if (numValue > 99999) {
			value = '99999';
		} else if (numValue < 1) {
			value = '';
		}

		couponInputs[index] = value;
		couponInputs = [...couponInputs];
		input.value = value; // 입력 필드의 값을 직접 업데이트

		if (value.length === 5 && index < couponCount - 1) {
			const nextInput = document.getElementById(`coupon-input-${index + 1}`);
			if (nextInput) {
				(nextInput as HTMLInputElement).focus();
			}
		}
	};

	const confirmSubmit = () => {
		if (
			couponInputs.every(
				(input) => input.length > 0 && input.length <= 5 && parseInt(input, 10) >= 1
			)
		) {
			toast.showToast('작성하신 쿠폰을 모두 발행하시겠습니까?', 'info', 3000, true, handleSubmit);
		} else {
			toast.showToast('모든 쿠폰번호를<br>1~99999로 입력하세요.', 'error', 3000, false);
		}
	};

	const handleSubmit = async () => {
		if (
			couponInputs.every(
				(input) => input.length > 0 && input.length <= 5 && parseInt(input, 10) >= 1
			)
		) {
			try {
				const db = getFirestore();
				const numbersData: NumbersData[] = couponInputs.map((input) => ({
					number: parseInt(input, 10),
					winningAmount: 0 // 초기 당첨금액은 0으로 설정
				}));

				const couponsData: Omit<CouponsData, 'id'> = {
					couponSetId, // latestCouponSetData에서 id를 가져옵니다
					numbersData,
					createdAt: Timestamp.now(),
					expiresAt: Timestamp.fromDate(new Date(Date.now() + 300 * 24 * 60 * 60 * 1000)), // 300일 후 만료
					userId: $user?.uid ?? '' // 현재 로그인한 사용자의 ID, 없으면 빈 문자열
				};

				await addDoc(collection(db, 'coupons'), couponsData);
				const couponSetRef = doc(db, 'couponSet', couponSetId);
				await updateDoc(couponSetRef, {
					isUsed: true
				});
				toast.showToast('쿠폰이 성공적으로 발행되었습니다.', 'success', 3000, false);
				// goto('/dashboard');
				// 쿠폰 발행 후 상태 업데이트
				isUsedCoupon = true;

				// 최근 발행된 쿠폰 데이터 가져오기
				const latestCouponQuery = query(
					collection(db, 'coupons'),
					where('couponSetId', '==', couponSetId),
					orderBy('createdAt', 'desc'),
					limit(1)
				);
				const latestCouponSnapshot = await getDocs(latestCouponQuery);

				if (!latestCouponSnapshot.empty) {
					const latestCoupon = latestCouponSnapshot.docs[0].data() as CouponsData;
					latestCouponSetData = {
						...latestCouponSetData!,
						isUsed: true
					} as CouponSetData;
					coupons = latestCoupon;
				}

				// 페이지 새로고침
				goto('/dashboard/coupon', { replaceState: true });
			} catch (error) {
				console.error('쿠폰 발행 중 오류 발생:', error);
				toast.showToast('쿠폰 발행 중 오류가 발생했습니다.', 'error', 3000, false);
			}
		} else {
			toast.showToast('모든 쿠폰번호를<br>1~99999로 입력하세요.', 'error', 3000, false);
		}
	};

	const generateRandomCoupons = () => {
		toast.showToast(
			'값을 작성하지 않은 칸에만<br>쿠폰숫자가 자동생성됩니다.',
			'info',
			3000,
			true,
			() => {
				const emptyIndices = couponInputs.reduce((acc: number[], input, index: number) => {
					if (!input) acc.push(index);
					return acc;
				}, []);

				isLoading = Array(couponCount).fill(false);
				emptyIndices.forEach((index) => {
					isLoading[index] = true;
				});

				setTimeout(() => {
					emptyIndices.forEach((index) => {
						setTimeout(
							() => {
								const randomNumber = Math.floor(1 + Math.random() * 99999);
								const numberString = randomNumber.toString().padStart(5, '0');
								couponInputs[index] = numberString;
								couponInputs = [...couponInputs];
								isLoading[index] = false;
								isLoading = [...isLoading];
							},
							Math.random() * 2000 + 1000
						);
					});
				}, 100);
			}
		);
	};

	const resetInputs = () => {
		couponInputs = Array(couponCount).fill('');
	};

	let isUsedCoupon = latestCouponSetData === null || latestCouponSetData.isUsed ? true : false;
	let stateName = isUsedCoupon ? '발행' : '지급';
</script>

<h3 class="title">
	<span class="material-icons">local_mall</span> 쿠폰 발행
</h3>

<div class="content-info">
	<div class="coupon-title">
		<p>{stateName}일: <strong>{formatDate(coupons?.createdAt, 'ymd')}</strong></p>
		<p>{stateName}갯수: <strong>{couponCount}</strong>개</p>
	</div>
	{#if latestCouponSetData?.isUsed}
		{#if coupons}
			<Balls
				balls={coupons.numbersData.map((data) => data.number)}
				isWinnerArray={coupons?.numbersData
					.map((data) => data.winningAmount)
					?.map((amount) => amount > 0)}
				size={80}
			/>
		{:else if loadingError}
			<p class="error-message">{loadingError}</p>
		{:else}
			<p>쿠폰 정보를 불러오는 중...</p>
		{/if}
	{:else}
		<form on:submit|preventDefault={confirmSubmit}>
			<div class="coupon-inputs">
				{#each couponInputs as couponInput, index}
					<div class="input-wrapper">
						{#if isLoading[index]}
							<div class="loading-icon"></div>
						{:else}
							<input
								type="text"
								inputmode="numeric"
								id="coupon-input-{index}"
								placeholder="1~99999"
								maxlength="5"
								value={couponInput}
								on:input={(e) => handleInput(index, e)}
							/>
						{/if}
					</div>
				{/each}
			</div>
			<div class="button-group">
				<button type="button" on:click={resetInputs}>초기화</button>
				<button type="button" class="random" on:click={generateRandomCoupons}>자동생성</button>
				<button type="submit" class="success">쿠폰발행</button>
			</div>
		</form>
	{/if}
</div>

<style>
	.content-info {
		padding: 0 15px;
	}
	.coupon-title {
		display: flex;
		gap: 15px;
		margin: 5px 0;
		justify-content: center;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.coupon-inputs {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: center;
	}
	input {
		width: 110px;
		padding: 10px 0;
		font-size: 1.25rem;
		text-align: center;
		border-radius: 5px;
		border: 1px solid #e0e0e0;
		background-color: #bbbaba;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	input:focus {
		outline: none;
		border-color: #4caf50;
		box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
		background-color: #ffffff;
	}

	input::placeholder {
		color: #fcfafa;
	}
	.button-group {
		display: flex;
		gap: 20px;
		margin: 30px 0;
		justify-content: center;
		flex-wrap: wrap;
	}
	button {
		padding: 5px 15px;
		font-size: 1.15rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
	}
	button.random {
		background-color: #4caf50;
		color: white;
	}
	button.success {
		background-color: var(--primary-color);
		color: white;
	}
	button.success:hover {
		background-color: var(--primary-color-dark);
	}
	.input-wrapper {
		position: relative;
		width: 110px;
		height: 42px; /* 인풋의 높이와 동일하게 설정 */
	}
	.loading-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 20px;
		height: 20px;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
	.coupon-numbers {
		margin-top: 20px;
		text-align: center;
	}

	.coupon-numbers h4 {
		margin-bottom: 20px;
	}

	.balls-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
	.error-message {
		color: red;
		text-align: center;
		margin-top: 20px;
	}
</style>
