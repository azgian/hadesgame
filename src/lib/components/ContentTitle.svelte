<script lang="ts">
	import { page } from '$app/stores';
	import { afterUpdate, onMount } from 'svelte';
	import { checkMobile, toggleState } from '$lib';

	export let routeIcon: string;
	export let routeName: string;
	export let routeBasePath: string;
	export let subMenus: Array<{ pathName: string; pageName: string }> = [];

	let mobileBreakpoint = 500;
	let isMobile = false;
	let isMenuOpen = false;
	let prevPathname = '';

	onMount(() => {
		const handleResize = () => {
			isMobile = checkMobile(mobileBreakpoint);
		};
		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	afterUpdate(() => {
		if (!isMobile) {
			isMenuOpen = false;
		}
	});

	$: {
		if ($page.url.pathname !== prevPathname) {
			isMenuOpen = false;
			prevPathname = $page.url.pathname;
		}
	}

	const toggleMenu = () => {
		isMenuOpen = toggleState(isMenuOpen);
	};
</script>

<div class="content-title">
	<h2>
		<span class="material-icons">{routeIcon}</span>
		{routeName}
	</h2>
	{#if isMobile && subMenus.length > 0}
		<button class="sub-menu-icon" on:click={toggleMenu} aria-label="Toggle submenu">
			<span class="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
		</button>
	{/if}
	{#if subMenus.length > 0}
		<div class="sub-menu" class:mobile={isMobile} class:open={isMenuOpen || !isMobile}>
			{#each subMenus as menu}
				{@const pathUrl = `${routeBasePath}${menu.pathName}`}
				<a href={pathUrl} class:active={$page.url.pathname === pathUrl}>
					{menu.pageName}
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.content-title {
		background-color: rgba(50, 50, 50, 0.8);
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}
	h2 {
		margin: 0;
		padding-left: 10px;
		color: #666;
		text-shadow: 1px 1px 1px #131212;
	}
	.sub-menu {
		display: flex;
		align-items: center;
		border: solid #999 1px;
	}
	.sub-menu a {
		color: #ccc;
		text-decoration: none;
		padding: 5px 15px;
	}
	.sub-menu a.active {
		background: #999;
		color: #131212;
	}
	.sub-menu-icon {
		display: none;
		background: none;
		border: none;
		color: #ccc;
		font-size: 24px;
		cursor: pointer;
	}
	@media (max-width: 500px) {
		.content-title {
			flex-wrap: wrap;
		}
		.sub-menu-icon {
			display: block;
		}
		.sub-menu.mobile {
			display: none;
			flex-direction: column;
			position: absolute;
			top: 50px;
			right: 3px;
			background: #333;
			padding: 0;
			box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
			z-index: 999;
			border: 1px solid #999;
			border-radius: 5px;
			width: 150px;
		}
		.sub-menu.mobile a {
			text-align: center;
			padding: 10px 0;
			width: 100%;
		}
		.sub-menu.mobile.open {
			display: flex;
		}
	}
</style>
