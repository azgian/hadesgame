<script lang="ts">
	import Ball from './Ball.svelte';
	export let balls: number[] = [];
	export let size = 60;
	export let isWinnerArray: boolean[] = [];
</script>

<div class="balls-container">
	{#each balls as ball, index}
		<Ball num={ball} ballIndex={index} {size} isWinner={isWinnerArray[index] || false} />
	{/each}
</div>

<style>
	.balls-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
</style>
