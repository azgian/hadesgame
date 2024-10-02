<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { checkMobile, toggleState } from '$lib';
	import { page } from '$app/stores';

	export let subMenus: { href: string; label: string }[] = [];
	export let mobileBreakpoint = 500;

	let isMobile = false;
	let isMenuOpen = false;

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
		if ($page.url.pathname) {
			isMenuOpen = false;
		}
	}

	const toggleMenu = () => {
		isMenuOpen = toggleState(isMenuOpen);
	};
</script>

{#if isMobile}
	<button class="sub-menu-icon" on:click={toggleMenu}>
		<span class="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
	</button>
{/if}
<div class="sub-menu" class:mobile={isMobile} class:open={isMenuOpen || !isMobile}>
	{#each subMenus as menu}
		<a
			href={menu.href}
			class:active={$page.url.pathname === menu.href || $page.url.pathname.endsWith(menu.href)}
		>
			{menu.label}
		</a>
	{/each}
</div>

<style>
	.sub-menu {
		display: flex;
		align-items: center;
		/* gap: 20px;
    height: 100%; */
		border: solid #999 1px;
	}
	.sub-menu a {
		color: #ccc;
		text-decoration: none;
		padding: 5px 15px;
		/* border-radius: 5px;
        height: 100%; */
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
		.sub-menu-icon {
			display: block;
		}
		.sub-menu.mobile {
			display: none;
			flex-direction: column;
			position: absolute;
			top: 60px;
			right: 3px;
			background: #333;
			padding: 20px;
			box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
			z-index: 999;
			border: 1px solid #ccc;
			border-radius: 5px;
		}
		.sub-menu.mobile.open {
			display: flex;
		}
	}
</style>
