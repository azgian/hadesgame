<script lang="ts">
	export let ballIndex: number;
	export let num: number;
	export let size: number = 60; // 기본 크기를 60px로 설정
	ballIndex = ballIndex % 7;
</script>

<div class="rainbow-ball ball{ballIndex}" style="width: {size}px; height: {size}px;">
	<span class="ball-number" style="font-size: {size * 0.27}px;">{num.toString().padStart(5, '0')}</span>
</div>

<style>
	.rainbow-ball {
		border-radius: 50%;
		margin: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: white;
		text-shadow: 0 0 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.6);
		box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
	}

	.ball-number {
		font-size: 0.8em;
	}

	.ball0 { background-color: #e60000; }
	.ball1 { background-color: #e67300; }
	.ball2 { background-color: #e6e600; }
	.ball3 { background-color: #00b300; }
	.ball4 { background-color: #0000e6; }
	.ball5 { background-color: #4b0082; }
	.ball6 { background-color: #8600b3; }
</style>
