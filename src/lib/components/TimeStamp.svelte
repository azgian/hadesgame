<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	export let isTimer: boolean = false;

	const dispatch = createEventDispatcher();
	let timeLeft = 60; // 1분을 초로 변환
	let intervalId: NodeJS.Timeout;

	let currentTime = { hours: '00', minutes: '00', seconds: '00' };
	let today = '';
	let timerTime = { minutes: '01', seconds: '00' };

	function formatTime(date: Date): { hours: string; minutes: string; seconds: string } {
		return {
			hours: date.getHours().toString().padStart(2, '0'),
			minutes: date.getMinutes().toString().padStart(2, '0'),
			seconds: date.getSeconds().toString().padStart(2, '0')
		};
	}

	function updateCurrentTime() {
		currentTime = formatTime(new Date());
	}

	function getToday(): string {
		const date = new Date();
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
	}

	function updateTimerTime() {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		timerTime = {
			minutes: minutes.toString().padStart(2, '0'),
			seconds: seconds.toString().padStart(2, '0')
		};
	}

	function startTimer() {
		intervalId = setInterval(() => {
			timeLeft -= 1;
			updateTimerTime();
			if (timeLeft <= 0) {
				clearInterval(intervalId);
				dispatch('timerEnd');
			}
		}, 1000);
	}

	onMount(() => {
		updateCurrentTime();
		const interval = setInterval(updateCurrentTime, 1000);
		today = getToday();

		return () => {
			clearInterval(interval);
		};
	});

	$: if (isTimer) {
		startTimer();
	}

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class="timer-container">
	{#if !isTimer}
		<div class="today">{today}</div>
		<div class="timer">
			<span class="time-box">{currentTime.hours}</span>
			<span class="colon">:</span>
			<span class="time-box">{currentTime.minutes}</span>
			<span class="colon">:</span>
			<span class="time-box">{currentTime.seconds}</span>
		</div>
	{:else}
		<div class="timer">
			<span class="time-box">{timerTime.minutes}</span>
			<span class="colon">:</span>
			<span class="time-box">{timerTime.seconds}</span>
		</div>
	{/if}
</div>

<style>
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
</style>
