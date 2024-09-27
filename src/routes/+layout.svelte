<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { user } from '$lib'; // 사용자 상태 스토어
	// import { auth } from '$lib/firebase';
	// import { signOut } from 'firebase/auth'; // 로그아웃 함수
	// import Toast from '$lib/components/Toast.svelte';

	export let data: LayoutData;

	let showLogoutConfirm = false;

	function confirmLogout() {
		showLogoutConfirm = true;
	}

	async function handleLogout() {
		try {
			// await signOut(auth);
			console.log('로그아웃 성공');
			showLogoutConfirm = false;

			// 강제로 페이지 이동
			window.location.href = '/';
		} catch (error) {
			console.error('로그아웃 실패:', error);
		}
	}

	function cancelLogout() {
		showLogoutConfirm = false;
	}

	let spotlight: HTMLDivElement;

	onMount(() => {
		let x = window.innerWidth - 100;
		let y = 0;
		let dx = 0.95;
		let dy = 0.75;

		function animateSpotlight() {
			if (x > window.innerWidth || x < 400) dx = -dx;
			if (y > 300 || y < -100) dy = -dy;
			x += dx;
			y += dy;
			spotlight.style.transform = `translate(${x}px, ${y}px)`;
			requestAnimationFrame(animateSpotlight);
		}

		animateSpotlight();
	});
</script>

<div class="spotlight" bind:this={spotlight}></div>
<div class="top-bar">
	<div class="top-bar-container">
		<img src="/images/hades-logo.png" alt="Hades Logo" class="logo" />
		<div class="menu-items">
			{#if $user}
				<button class="logout-button" on:click={confirmLogout}>로그아웃</button>
			{/if}
		</div>
	</div>
</div>
<main>
	<slot />
	<!-- <Toast
		message="로그아웃 하시겠습니까?"
		show={showLogoutConfirm}
		onConfirm={handleLogout}
		onCancel={cancelLogout}
	/> -->
</main>

<style>
	main {
		display: flex;
		align-items: top;
		width: 100%;
		max-width: 800px;
		padding: 10px;
		margin: 0 auto;
	}

	.spotlight {
		position: fixed;
		top: -100px;
		left: -100px;
		width: 400px;
		height: 400px;
		background: radial-gradient(
			circle,
			rgba(255, 165, 0, 0.6) 0%,
			rgba(255, 140, 0, 0.3) 30%,
			rgba(255, 69, 0, 0) 70%
		);
		pointer-events: none;
		z-index: 1; /* 인물 이미지 뒤로 이동 */
		opacity: 0.8;
		filter: blur(0px);
	}

	/* 상단 바 스타일 */
	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 80px; /* 상단 바의 높이 */
		background-color: rgba(0, 0, 0, 0.5); /* 배경색을 더 어둡게 조정 */
		z-index: 1000; /* 다른 요소들 위에 표시 */
		padding: 0;
	}

	.top-bar-container {
		display: flex;
		align-items: center;
		justify-content: space-between; /* 추가: 아이템들을 양 끝으로 정렬 */

		width: 100%;
		max-width: 800px;
		height: 100%;
		margin: auto;
		padding: 0 10px;
	}

	.menu-items {
		display: flex;
		align-items: center;
		gap: 20px; /* 메뉴 항목 사이의 간격 */
	}

	/* 로고 스타일 수정 */
	.logo {
		height: 60px; /* 로고의 높이를 상단 바에 맞게 조정 */
		width: auto; /* 비율 유지 */
		margin-right: auto; /* 로고를 오른쪽으로 정렬 */
	}

	.logout-button {
		margin-left: auto; /* 이 버튼을 맨 오른쪽으로 밀어냄 */
		padding: 8px 16px;
		background-color: #f44336; /* 빨간색 배경 */
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.logout-button:hover {
		background-color: #d32f2f; /* 호버 시 더 어두운 빨간색 */
	}

	@media (max-width: 550px) {
		.top-bar-container {
			padding: 0 20px;
		}
		.logo {
			height: 40px; /* 로고의 높이를 상단 바에 맞게 조정 */
		}
	}
</style>
