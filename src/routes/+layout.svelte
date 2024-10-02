<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { user, toggleState, checkMobile } from '$lib';
	import type { UserData } from '$lib/types';
	import { page } from '$app/stores';
	import { auth, getUserData } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import Toast from '$lib/components/Toast.svelte';
	import { fly } from 'svelte/transition';
	import { toast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { Timestamp } from 'firebase/firestore';

	let isAdmin = false;
	let showSidebar = false;
	let isMobile = false;

	const handleLogout = async () => {
		try {
			await signOut(auth);
			console.log('로그아웃 성공');
			toast.showToast('로그아웃되었습니다.', 'success', 3000, false);

			// 강제로 페이지 이동
			window.location.href = '/';
		} catch (error) {
			console.error('로그아웃 실패:', error);
			toast.showToast('로그아웃에 실패했습니다.', 'error', 3000, false);
		}
	};

	const confirmLogout = () => {
		toast.showToast('로그아웃 하시겠습니까?', 'info', null, true, handleLogout, () =>
			toast.hideToast()
		);
	};

	let spotlight: HTMLDivElement;

	onMount(() => {
		const handleResize = () => {
			isMobile = checkMobile();
		};

		handleResize(); // 초기 실행
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	const toggleSidebar = () => {
		showSidebar = toggleState(showSidebar);
	};

	const animateSpotlight = () => {
		let x = window.innerWidth - 100;
		let y = 0;
		let dx = 0.95;
		let dy = 0.75;

		const animate = () => {
			if (x > window.innerWidth || x < 400) dx = -dx;
			if (y > 300 || y < -100) dy = -dy;
			x += dx;
			y += dy;
			if (spotlight) {
				spotlight.style.transform = `translate(${x}px, ${y}px)`;
			}
			requestAnimationFrame(animate);
		};

		animate();
	};

	onMount(() => {
		animateSpotlight();

		const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
			if (firebaseUser) {
				try {
					const fullUserData = await getUserData(firebaseUser.uid);
					if (fullUserData) {
						user.set(fullUserData);
						isAdmin = fullUserData.isAdmin || false;
					} else {
						// User 타입의 필드들을 포함
						const basicUserData: UserData = {
							...firebaseUser, // User 타입의 모든 필드를 포함
							createdAt: Timestamp.now(),
							walletAddress: '',
							isAdmin: false
						};
						user.set(basicUserData);
						isAdmin = false;
						// 필요하다면 여기서 새 사용자 데이터를 Firestore에 저장할 수 있습니다.
					}
				} catch (error) {
					console.error('Error fetching user data:', error);
					user.set(null);
					isAdmin = false;
				}
			} else {
				user.set(null);
				isAdmin = false;
			}
		});

		return () => {
			unsubscribe();
		};
	});

	const navigateTo = async (path: string) => {
		await goto(path);
		showSidebar = false;
	};
</script>

<div class="spotlight" bind:this={spotlight}></div>
<div class="top-bar">
	<div class="top-bar-container">
		{#if isMobile && $user}
			<button class="menu-button" on:click={toggleSidebar} aria-label="메뉴">
				<span class="material-icons">menu</span>
			</button>
		{/if}
		<img src="/images/hades-logo.png" alt="Hades Logo" class="logo" />
		<div class="menu-container">
			{#if !isMobile}
				<div class="menu-items">
					{#if $user}
						<a
							href="/dashboard"
							class="menu-link"
							class:active={$page.url.pathname.startsWith('/dashboard')}
							on:click|preventDefault={() => navigateTo('/dashboard')}
						>
							Dashboard
						</a>
						{#if isAdmin}
							<a href="/adm" class="menu-link" class:active={$page.url.pathname.startsWith('/adm')}>
								Admin
							</a>
						{/if}
					{/if}
				</div>
			{/if}
			{#if $user}
				<div class="button-box">
					<small class="user-email">{$user.email}</small>
					<button class="logout-button" on:click={confirmLogout} aria-label="로그아웃">
						<span class="material-icons">logout</span>
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

{#if isMobile && showSidebar}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="sidebar-overlay" on:click={toggleSidebar}></div>
	<div class="sidebar" transition:fly={{ x: -250, duration: 300 }}>
		{#if $user}
			<a
				href="/dashboard"
				class="sidebar-link"
				class:active={$page.url.pathname === '/dashboard'}
				on:click|preventDefault={() => navigateTo('/dashboard')}
			>
				Dashboard
			</a>
			{#if isAdmin}
				<a
					href="/adm"
					class="sidebar-link"
					class:active={$page.url.pathname.startsWith('/adm')}
					on:click|preventDefault={() => navigateTo('/adm')}
				>
					Admin
				</a>
			{/if}
		{/if}
	</div>
{/if}

<main>
	{#if $user}
		<div class="contents">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
	<Toast
		message={$toast.message}
		show={$toast.show}
		type={$toast.type}
		showButtons={$toast.showButtons}
		onConfirm={toast.handleConfirm}
		onCancel={toast.handleCancel}
	/>
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
	.contents {
		/* background-color: rgba(50, 50, 50, 0.8); */
		padding: 0;
		/* border-radius: 10px; */
		/* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
		margin: 80px auto;
		width: 100%;
		z-index: 100;
		position: relative;
		min-height: 400px;
		overflow: hidden;
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
		z-index: 1;
		opacity: 0.8;
		filter: blur(0px);
	}

	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 80px;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		padding: 0;
	}

	.top-bar-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 800px;
		height: 100%;
		margin: auto;
		padding: 0 10px;
	}

	.logo {
		height: 60px;
		width: auto;
		margin-right: auto;
	}

	.menu-container {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 15px;
	}

	.menu-items {
		display: flex;
		gap: 10px;
	}

	.menu-link,
	.sidebar-link {
		color: white;
		text-decoration: none;
		padding: 5px 10px;
		border-radius: 4px;
		transition: background-color 0.3s;
	}

	.menu-link:hover,
	.sidebar-link:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.menu-link.active {
		background-color: #666;
		color: #000;
	}

	.sidebar-link.active {
		background-color: rgba(255, 255, 255, 0.3);
	}

	.button-box {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logout-button,
	.menu-button {
		background-color: transparent;
		color: white;
		border: none;
		cursor: pointer;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s;
	}

	.logout-button {
		border-radius: 50%;
	}

	.logout-button:hover,
	.menu-button:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.logout-button .material-icons,
	.menu-button .material-icons {
		font-size: 24px;
	}

	.sidebar-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 998;
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 250px;
		background-color: var(--primary-color-dark);
		padding: 20px;
		z-index: 1100;
		display: flex;
		flex-direction: column;
	}

	.sidebar-link {
		text-align: center;
		margin-bottom: 10px;
	}

	.user-email {
		color: rgb(132, 149, 245);
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.menu-items {
			display: none;
		}
		.user-email {
			max-width: 80px;
		}
	}

	@media (max-width: 550px) {
		.top-bar-container {
			padding: 0 20px;
		}
		.logo {
			height: 40px;
		}
		.menu-container {
			flex-direction: column;
			align-items: flex-end;
		}
		.menu-items {
			flex-direction: column;
			align-items: flex-end;
		}
	}
</style>
