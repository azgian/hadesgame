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
				<!-- 오각형 왼쪽 부분 (핑크) - 높이 20% 감소 -->
				<path
					fill="url(#pinkGradient)"
					d="M12,3.4H7V9.144C7,9.432 7.18,9.704 7.47,9.856L11.34,11.44C11.75,11.656 12,11.656 12,11.44V3.4Z"
				/>
				<!-- 오각형 오른쪽 부분 (하늘색) - 높이 20% 감소 -->
				<path
					fill="url(#skyBlueGradient)"
					d="M12,3.4H17V9.144C17,9.432 16.82,9.704 16.53,9.856L12.66,11.44C12.25,11.656 12,11.656 12,11.44V3.4Z"
				/>
				<line x1="12" y1="3.4" x2="12" y2="11.44" stroke="#FFF" stroke-width="0.25" />

				<!-- 원형 부분 (메달) - 위치 위로 조정 -->
				<circle cx="12" cy="16.5" r="4.5" fill="#FFD700" stroke="#DAA520" stroke-width="0.5" />

				<!-- 동심원 (장식) - 위치 위로 조정 -->
				<circle cx="12" cy="16.5" r="3.5" fill="none" stroke="#DAA520" stroke-width="0.3" />
				<circle cx="12" cy="16.5" r="2.5" fill="none" stroke="#DAA520" stroke-width="0.3" />
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
		top: -30%;
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
