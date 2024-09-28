<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let timeLeft = 5 * 60; // 5분을 초로 변환
	let intervalId: NodeJS.Timeout;

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function startTimer() {
		intervalId = setInterval(() => {
			timeLeft -= 1;
			if (timeLeft <= 0) {
				clearInterval(intervalId);
				dispatch('timerEnd');
			}
		}, 1000);
	}

	onMount(() => {
		startTimer();
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class="timer">
	{formatTime(timeLeft)}
</div>

<style>
	.timer {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
	}
</style>
