<script lang="ts">
	import type { CouponSetData } from '$lib/types';
	import { formatDate } from '$lib';
	import { toast } from '$lib/stores/toast';

	export let latestData: CouponSetData | null;

	let couponInputs: string[] = [];
	let couponCount = 0;
	let isLoading: boolean[] = [];

	$: if (latestData && !latestData.isUsed) {
		couponCount = latestData.count;
		couponInputs = Array(couponCount).fill('');
		isLoading = Array(couponCount).fill(false);
	}

	const handleInput = (index: number, event: Event) => {
		const input = event.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, '');
		const numValue = parseInt(value, 10);

		if (numValue < 1) {
			value = '1';
		} else if (numValue > 99999) {
			value = '99999';
		}

		couponInputs[index] = value;
		couponInputs = [...couponInputs];

		if (value.length === 5 && index < couponCount - 1) {
			const nextInput = document.getElementById(`coupon-input-${index + 1}`);
			if (nextInput) {
				(nextInput as HTMLInputElement).focus();
			}
		}
	};

	const handleSubmit = () => {
		if (couponInputs.every((input) => input.length === 5)) {
			console.log('제출된 쿠폰:', couponInputs);
			// 여기에 쿠폰 제출 로직을 추가하세요
		} else {
			toast.showToast('모든 쿠폰번호를<br>1~99999로 입력하세요.', 'error', 3000, false);
		}
	};

	const generateRandomCoupons = () => {
		resetInputs();
		isLoading = Array(couponCount).fill(true);

		setTimeout(() => {
			const promises = couponInputs.map((_, index) => {
				return new Promise<string>((resolve) => {
					setTimeout(
						() => {
							const randomNumber = Math.floor(1 + Math.random() * 99999);
							const numberString = randomNumber.toString();
							couponInputs[index] = numberString;
							couponInputs = [...couponInputs];
							isLoading[index] = false;
							isLoading = [...isLoading];
							resolve(numberString);
						},
						Math.random() * 2000 + 1000
					); // 1초에서 2초 사이의 랜덤한 시간
				});
			});

			Promise.all(promises).then(() => {
				// 모든 프로미스가 해결되면 여기서 추가 작업을 할 수 있습니다.
			});
		}, 100); // 약간의 지연을 주어 로딩 상태가 먼저 적용되도록 함
	};

	const resetInputs = () => {
		couponInputs = Array(couponCount).fill('');
	};

	let isUsedCoupon = latestData === null || latestData.isUsed ? true : false;
	let stateName = isUsedCoupon ? '발행' : '지급';
</script>

<h3 class="title">
	<span class="material-icons">local_mall</span> 쿠폰 발행
</h3>

<div class="content-info">
	<div class="coupon-title">
		<p>{stateName}일: <strong>{formatDate(latestData?.createdAt, 'ymd')}</strong></p>
		<p>{stateName}갯수: <strong>{couponCount}</strong>개</p>
	</div>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="coupon-inputs">
			{#each couponInputs as _, index}
				<div class="input-wrapper">
					{#if isLoading[index]}
						<div class="loading-icon"></div>
					{:else}
						<input
							type="number"
							id="coupon-input-{index}"
							placeholder="1~99999"
							maxlength="5"
							bind:value={couponInputs[index]}
							on:input={(e) => handleInput(index, e)}
						/>
					{/if}
				</div>
			{/each}
		</div>
		<div class="button-group">
			<button type="button" on:click={resetInputs}>초기화</button>
			<button type="button" class="random" on:click={generateRandomCoupons}>쿠폰생성</button>
			<button type="submit" class="success">쿠폰발행</button>
		</div>
	</form>
	<!-- {/if} -->
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
</style>
