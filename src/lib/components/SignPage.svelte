<script lang="ts">
	import { onMount } from 'svelte';
	// import { auth, db } from '$lib/firebase';
	import { user } from '$lib';
	// import {
	// 	createUserWithEmailAndPassword,
	// 	signInWithEmailAndPassword,
	// 	onAuthStateChanged,
	// 	signOut,
	// 	type UserInfo
	// } from 'firebase/auth';
	// import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

	let hours = '00';
	let minutes = '00';
	let seconds = '00';
	let today = '';

	let email = '';
	let walletAddress = '';
	let verificationCode = '';
	let error = '';
	let message = '';
	let showVerificationInput = false;
	let isLoading = false; // 로딩 상태를 추적하는 새로운 변수

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

		// const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: UserInfo | null) => {
		// 	if (firebaseUser) {
		// 		user.set(firebaseUser);
		// 		const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
		// 		if (userDoc.exists() && userDoc.data().level === 'unverified') {
		// 			showVerificationInput = true;
		// 		}
		// 	} else {
		// 		user.set(null);
		// 		showVerificationInput = false;
		// 	}
		// });

		return () => {
			clearInterval(interval);
			// unsubscribe();
		};
	});

	// async function handleLogout() {
	// 	try {
	// 		await signOut(auth);
	// 		console.log('로그아웃 성공');
	// 	} catch (error) {
	// 		console.error('로그아웃 실패:', error);
	// 	}
	// }

	// const handleSignUpOrIn = async () => {
	// 	error = '';
	// 	if (email && walletAddress) {
	// 		isLoading = true; // 로딩 시작
	// 		try {
	// 			// 먼저 로그인 시도
	// 			await signInWithEmailAndPassword(auth, email, walletAddress);
	// 			message = '로그인 되었습니다.';
	// 			error = '';
	// 		} catch (loginError) {
	// 			// 로그인 실패 시 회원가입 진행
	// 			try {
	// 				const userCredential = await createUserWithEmailAndPassword(auth, email, walletAddress);
	// 				const newUser = userCredential.user;

	// 				const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
	// 				await setDoc(doc(db, 'users', newUser.uid), {
	// 					email: newUser.email,
	// 					walletAddress: walletAddress,
	// 					verificationCode: verificationCode,
	// 					level: 'unverified',
	// 					createdAt: new Date()
	// 				});

	// 				// 이메일 발송 API 호출
	// 				await fetch('/api/sendVerificationEmail', {
	// 					method: 'POST',
	// 					headers: { 'Content-Type': 'application/json' },
	// 					body: JSON.stringify({ email, verificationCode })
	// 				});

	// 				showVerificationInput = true;
	// 				message = '이메일로 전송된 인증 코드를 입력해주세요.';
	// 			} catch (signupError) {
	// 				console.error('회원가입 실패: ', signupError);
	// 				if (signupError instanceof Error) {
	// 					error = '회원정보 오류입니다.';
	// 				} else {
	// 					error = '알 수 없는 오류가 발생했습니다.';
	// 				}
	// 			}
	// 		} finally {
	// 			isLoading = false; // 로딩 종료
	// 		}
	// 	} else {
	// 		error = '이메일과 지갑 주소를 모두 입력해주세요.';
	// 	}
	// };

	// const verifyCode = async () => {
	// 	if (!$user) return;

	// 	try {
	// 		const userRef = doc(db, 'users', $user.uid);
	// 		const userSnap = await getDoc(userRef);

	// 		if (userSnap.exists()) {
	// 			const userData = userSnap.data();
	// 			if (userData.verificationCode === verificationCode) {
	// 				await updateDoc(userRef, {
	// 					level: 'verified'
	// 				});
	// 				message = '회원가입이 완료되었습니다.';
	// 				showVerificationInput = false;
	// 			} else {
	// 				error = '인증 코드가 올바르지 않습니다.';
	// 			}
	// 		} else {
	// 			error = '사용자 정보를 찾을 수 없습니다.';
	// 		}
	// 	} catch (e) {
	// 		console.error('인증 실패: ', e);
	// 		if (e instanceof Error) {
	// 			error = e.message;
	// 		} else {
	// 			error = '알 수 없는 오류가 발생했습니다.';
	// 		}
	// 	}
	// };
</script>

<div class="email-form-container">
	{#if $user && !showVerificationInput}
		<!-- <p>환영합니다, {$user.email}!</p>
		<button on:click={handleLogout}>로그아웃</button> -->
	{:else if showVerificationInput}
		<!-- <form on:submit|preventDefault={verifyCode} class="email-form">
			<input
				type="text"
				bind:value={verificationCode}
				placeholder="인증 코드를 입력하세요"
				required
			/>
			<button type="submit">인증</button>
		</form> -->
	{:else}
		<!-- <form on:submit|preventDefault={handleSignUpOrIn} class="email-form">
			<input type="email" bind:value={email} placeholder="이메일 주소를 입력하세요" required />
			<input type="text" bind:value={walletAddress} placeholder="지갑주소를 입력하세요" required />
			<button type="submit" disabled={isLoading}>
				{#if isLoading}
					<span class="loader"></span>
				{/if}
				Sign Up/In
			</button>
		</form> -->
	{/if}
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

	.timer-container {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #000;
		padding: 5px 15px;
		border-radius: 5px;
		font-family: 'Protest Guerrilla';
		font-size: 2rem;
		font-weight: 700;
		color: var(--primary-color);
		flex-wrap: wrap;
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
