<script lang="ts">
	export let num: number;

	$: ballIndex = (num - 1) % 7; // 0부터 6까지의 값을 얻기 위해 1을 뺍니다.
</script>

<div class="rainbow-ball ball{ballIndex}"></div>

<style>
	.rainbow-ball {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin: 5px;
		display: inline-block;
	}

	.ball0 {
		background-color: #ff0000;
	}
	.ball1 {
		background-color: #ff7f00;
	}
	.ball2 {
		background-color: #ffff00;
	}
	.ball3 {
		background-color: #00ff00;
	}
	.ball4 {
		background-color: #0000ff;
	}
	.ball5 {
		background-color: #4b0082;
	}
	.ball6 {
		background-color: #9400d3;
	}
</style>
