<script lang="ts">
	export let ballIndex: number;
	export let num: number = 0;
	export let size: number = 60;
	export let isWinner: boolean = false;
	ballIndex = ballIndex % 7;
</script>

<div class="rainbow-ball ball{ballIndex}" style="width: {size}px; height: {size}px;">
	<span class="ball-number" style="font-size: {size * 0.27}px;">{num}</span>
	{#if isWinner}
		<div class="win-label" style="font-size: {size * 0.5}px;">
			<svg viewBox="0 0 24 24" width="100%" height="100%">
				<defs>
					<linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style="stop-color:#FF69B4;stop-opacity:1" />
						<stop offset="100%" style="stop-color:#FF1493;stop-opacity:1" />
					</linearGradient>
					<linearGradient id="skyBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style="stop-color:#00BFFF;stop-opacity:1" />
						<stop offset="100%" style="stop-color:#1E90FF;stop-opacity:1" />
					</linearGradient>
					<filter id="shadow">
						<feDropShadow
							dx="1.5"
							dy="2"
							stdDeviation="0.5"
							flood-color="#000000"
							flood-opacity="0.6"
						/>
					</filter>
				</defs>
				<!-- 오각형 왼쪽 부분 (핑크) -->
				<path
					fill="url(#pinkGradient)"
					filter="url(#shadow)"
					d="M12,2H7V9.43C7,9.79 7.18,10.13 7.47,10.32L11.34,12.3C11.75,12.57 12,12.57 12,12.3V2Z"
				/>
				<!-- 오각형 오른쪽 부분 (하늘색) -->
				<path
					fill="url(#skyBlueGradient)"
					filter="url(#shadow)"
					d="M12,2H17V9.43C17,9.79 16.82,10.13 16.53,10.32L12.66,12.3C12.25,12.57 12,12.57 12,12.3V2Z"
				/>
				<line x1="12" y1="2" x2="12" y2="12.3" stroke="#FFF" stroke-width="0.25" />

				<!-- 원형 부분 (메달) -->
				<circle
					cx="12"
					cy="19"
					r="4.5"
					fill="#FFD700"
					stroke="#DAA520"
					stroke-width="0.5"
					filter="url(#shadow)"
				/>

				<!-- 동심원 (장식) -->
				<circle cx="12" cy="19" r="3.5" fill="none" stroke="#DAA520" stroke-width="0.3" />
				<circle cx="12" cy="19" r="2.5" fill="none" stroke="#DAA520" stroke-width="0.3" />
			</svg>
		</div>
	{/if}
</div>

<style>
	.rainbow-ball {
		position: relative;
		border-radius: 50%;
		margin: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: white;
		text-shadow:
			0 0 3px rgba(0, 0, 0, 0.8),
			0 0 5px rgba(0, 0, 0, 0.6);
		box-shadow:
			0 3px 6px rgba(0, 0, 0, 0.16),
			0 3px 6px rgba(0, 0, 0, 0.23);
	}

	.ball-number {
		font-size: 0.8em;
	}

	.win-label {
		position: absolute;
		top: -45%;
		right: -30%;
		width: 80%;
		height: 80%;
	}

	.ball0 {
		background-color: #e60000;
	}
	.ball1 {
		background-color: #e67300;
	}
	.ball2 {
		background-color: #e6e600;
	}
	.ball3 {
		background-color: #00b300;
	}
	.ball4 {
		background-color: #0000e6;
	}
	.ball5 {
		background-color: #4b0082;
	}
	.ball6 {
		background-color: #8600b3;
	}
</style>
