<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib';
	import LottoBalls from '$lib/components/LottoBalls.svelte';
	import { getUserProfile, createOrUpdateUserProfile } from '$lib/firebase';
	import type { UserProfile } from '$lib';
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';

	let profile: UserProfile | null = null;
	let walletAddress = '';
	let originalWalletAddress = '';

	onMount(async () => {
		if ($user) {
			profile = await getUserProfile($user.uid);
			walletAddress = profile?.walletAddress || '';
			originalWalletAddress = walletAddress;
		} else {
			goto('/');
		}
		console.log(profile);
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
			await createOrUpdateUserProfile($user.uid, { walletAddress });
			toast.showToast('지갑 주소가 업데이트되었습니다.', 'success', 3000, false);
			// 프로필 정보 갱신
			profile = await getUserProfile($user.uid);
			originalWalletAddress = walletAddress;
		} catch (err) {
			console.error('지갑 주소 업데이트 중 오류 발생:', err);
			toast.showToast('지갑 주소 업데이트에 실패했습니다.', 'error', 3000, false);
		}
	}

	$: buttonText = originalWalletAddress ? '지갑주소 수정' : '지갑주소 등록';
</script>

<div class="lottoBalls">
	<LottoBalls />
</div>
<h2 id="content-title">
	<span class="material-icons">dashboard</span>
	Dashboard
</h2>
<div class="content-info">
	<form class="wallet-form" on:submit|preventDefault={handleSubmit}>
		<div class="input-group">
			<input
				type="text"
				id="wallet-address"
				bind:value={walletAddress}
				placeholder="지갑 주소를 입력하세요"
				required
			/>
			<button type="submit">{buttonText}</button>
		</div>
	</form>
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
		margin: 0 auto;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.input-group {
		display: flex;
	}

	.input-group input {
		flex-grow: 1;
		padding: 10px;
		border: none;
		border-radius: 4px 0 0 4px;
		font-size: 16px;
		background-color: rgba(100, 100, 100, 0.8); /* 어두운 배경색, 10% 불투명도 */
		color: #eee;
		text-align: center;
	}

	input::placeholder {
		color: #999; /* 플레이스홀더 텍스트 색상 */
	}

	button {
		padding: 10px 20px;
		background-color: var(--primary-color);
		color: white;
		border: none;
		border-radius: 0 4px 4px 0;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: var(--primary-color-dark);
	}
</style>
