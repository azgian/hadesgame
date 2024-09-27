<script lang="ts">
	import { onMount } from 'svelte';

	let email = '';
	let walletAddress = '';
	let error = '';
	let message = '';

	let hours = '00';
	let minutes = '00';
	let seconds = '00';
	let today = '';

	function getTime(u: string) {
		const date = new Date();
		const h = date.getHours().toString().padStart(2, '0');
		const m = date.getMinutes().toString().padStart(2, '0');
		const s = date.getSeconds().toString().padStart(2, '0');
		if (u === 'h') return h;
		if (u === 'm') return m;
		if (u === 's') return s;
		return '';
	}

	function updateTime() {
		hours = getTime('h');
		minutes = getTime('m');
		seconds = getTime('s');
	}

	function getToday(): string {
		const date = new Date();
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	onMount(() => {
		updateTime();
		const interval = setInterval(updateTime, 1000);
		today = getToday();

		return () => {
			clearInterval(interval);
		};
	});

	const handleSignUpOrIn = async (event: Event) => {
		event.preventDefault();
		console.log('폼 제출됨:', email, walletAddress);

		if (email && walletAddress) {
			message = '폼이 성공적으로 제출되었습니다.';
			error = '';
		} else {
			error = '이메일과 지갑 주소를 모두 입력해주세요.';
			message = '';
		}
	};
</script>

<div class="email-form-container">
	<form on:submit|preventDefault={handleSignUpOrIn} class="email-form">
		<input type="email" bind:value={email} placeholder="이메일 주소를 입력하세요" required />
		<input type="text" bind:value={walletAddress} placeholder="지갑주소를 입력하세요" required />
		<button type="submit"> Sign Up/In </button>
	</form>
	{#if error}
		<p class="error">{error}</p>
	{/if}
	{#if message}
		<p class="message">{message}</p>
	{/if}
	<div class="timer-container">
		<div class="today">{today}</div>
		<div class="timer">
			<span class="time-box">{hours}</span>
			<span class="colon">:</span>
			<span class="time-box">{minutes}</span>
			<span class="colon">:</span>
			<span class="time-box">{seconds}</span>
		</div>
	</div>
	<div class="info">
		<h3>회원가입/로그인 안내</h3>
		<ul>
			<li>이메일과 지갑주소로 로그인할 수 있습니다.</li>
			<li>신규 회원의 경우, 이메일로 인증코드를 발송해드립니다.</li>
			<li>인증코드 인증 후 회원가입이 됩니다.</li>
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
		background-color: var(--primary-color, #4caf50);
		color: var(--text-color, #ffffff);
		font-size: 1.5rem;
		cursor: pointer;
		transition: background-color 0.3s;
		font-family: 'Protest Guerrilla';
	}

	.email-form button:hover {
		background-color: var(--primary-color-dark, #45a049);
	}

	.error {
		color: #faae94;
		text-align: center;
		margin-top: 10px;
		font-size: 1.15rem;
	}

	.message {
		color: #4caf50;
		text-align: center;
		margin-top: 10px;
		font-size: 1.15rem;
	}

	.timer-container {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #000;
		padding: 5px 15px;
		border-radius: 5px;
		font-family: 'Protest Guerrilla', sans-serif;
		font-size: 2rem;
		font-weight: 700;
		color: var(--primary-color);
		flex-wrap: wrap;
		margin-top: 20px;
	}

	.timer {
		display: flex;
		justify-content: center;
	}

	.time-box {
		width: 2.5rem;
		text-align: center;
	}

	.colon {
		width: 1rem;
		text-align: center;
	}

	.today {
		letter-spacing: 0.1rem;
	}

	.info {
		color: var(--text-color);
	}
	.info h3 {
		font-size: 1.5rem;
	}
	.info ul {
		margin: 0;
		padding-left: 15px;
		font-size: 1.15rem;
	}
</style>
