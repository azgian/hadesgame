<script lang="ts">
	import { auth } from '$lib/firebase';
	import { signInWithCustomToken } from 'firebase/auth';
	import TimeStamp from './TimeStamp.svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib';
	import type { UserData } from '$lib/types';

	let email = '';
	let verificationCode = '';
	let showVerificationInput = false;
	let message = '';
	let codePrefix = '';
	$: btnText = showVerificationInput ? 'Verify Code' : 'Sign Up/In';
	let isLoading = false;

	async function handleSignUpOrIn() {
		isLoading = true;
		try {
			const response = await fetch('/api/sendVerificationCode', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const result = await response.json();

			if (result.success) {
				showVerificationInput = true;
				codePrefix = result.codePrefix;
				message = '이메일로 전송된 인증 코드를 입력해주세요.';
			} else {
				throw new Error(result.error || '인증 코드 발송 실패');
			}
		} catch (error) {
			console.error('오류 발생: ', error);
			message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
			resetForm();
		} finally {
			isLoading = false;
		}
	}

	async function handleVerification() {
		isLoading = true;
		try {
			const response = await fetch('/api/verifyCode', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, verificationCode: codePrefix + '-' + verificationCode })
			});

			const result = await response.json();

			if (result.success) {
				const userCredential = await signInWithCustomToken(auth, result.customToken);
				// Firebase User 객체를 UserData로 변환
				const userData: UserData = {
					...userCredential.user,
					createdAt: result.createdAt, // 서버에서 제공하는 경우
					walletAddress: result.walletAddress || '', // 서버에서 제공하는 경우
					isAdmin: result.isAdmin || false // 서버에서 제공하는 경우
					// customField는 선택적이므로 생략 가능
				};
				user.set(userData);
				goto('/dashboard');

				message = '로그인 성공!';
			} else {
				throw new Error(result.error || '인증 실패');
			}
		} catch (error) {
			console.error('인증 처리 중 오류 발생:', error);
			message = '인증에 실패했습니다. 다시 시도해주세요.';
			resetForm();
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		email = '';
		verificationCode = '';
		showVerificationInput = false;
		codePrefix = '';
	}
</script>

<div class="email-form-container">
	<form
		on:submit|preventDefault={showVerificationInput ? handleVerification : handleSignUpOrIn}
		class="email-form"
	>
		{#if !showVerificationInput}
			<input type="email" bind:value={email} placeholder="이메일" required />
		{:else}
			<div class="verifyCode">
				<h3>{codePrefix}-</h3>
				<input
					type="number"
					bind:value={verificationCode}
					placeholder="6자리 숫자"
					pattern="\d{6}"
					required
				/>
			</div>
		{/if}
		<button type="submit" disabled={isLoading} aria-busy={isLoading}>
			{#if isLoading}
				<span class="loader" aria-hidden="true"></span>
			{/if}
			{btnText}
		</button>
		{#if message}
			<p class="message" class:error={message.startsWith('Error:') || message.includes('실패')}>
				{message}
			</p>
		{/if}
	</form>
	<TimeStamp />
	<div class="info">
		<h3>회원가입/로그인 안내</h3>
		<ul>
			<li>이메일로 인증코드를 발송해드립니다.</li>
			<li>인증코드 인증 후 회원가입 및 로그인이 됩니다.</li>
		</ul>
	</div>
</div>

<style>
	.email-form-container {
		background-color: rgba(50, 100, 100, 0.9);
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
		width: 450px;
		z-index: 100;
		margin: 150px auto;
	}

	.email-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 15px;
	}

	.email-form input {
		padding: 10px;
		border: none;
		border-radius: 5px;
		background-color: rgba(255, 255, 255, 0.1);
		color: #e0e0e0;
		font-size: 1.25rem;
		text-align: center;
	}

	.email-form input::placeholder {
		color: #a0a0a0;
	}

	.email-form button {
		padding: 10px;
		border: none;
		border-radius: 5px;
		background-color: var(--primary-color);
		color: var(--text-color);
		font-size: 1.5rem;
		cursor: pointer;
		transition: background-color 0.3s;
		font-family: 'Protest Guerrilla';
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.email-form button:hover {
		background-color: var(--primary-color-dark);
	}

	.verifyCode {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.verifyCode h3 {
		font-size: 2rem;
		margin: 0;
	}
	.verifyCode input {
		height: 2.5rem;
	}

	.info {
		color: var(--text-color);
	}
	.info h3 {
		font-size: 1.25rem;
	}
	.info ul {
		margin: 0;
		padding-left: 15px;
		font-size: 1rem;
	}

	.message {
		color: #4caf50;
		text-align: center;
		margin-top: 10px;
		font-size: 1rem;
	}

	.loader {
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 2px solid #ffffff;
		border-radius: 50%;
		border-top: 2px solid #000000;
		animation: spin 1s linear infinite;
		margin-right: 10px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
