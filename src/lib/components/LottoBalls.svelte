<script lang="ts">
	import { onMount } from 'svelte';

	interface Ball {
		number: string; // number를 string으로 변경
		color: string;
		x: number;
		y: number;
		dx: number;
		dy: number;
		radius: number;
	}

	let balls: Ball[] = [];
	const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700', '#9370DB']; // 2개 색상 추가
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let containerWidth: number;
	let containerHeight: number;
	let isMobile: boolean;

	function checkMobile() {
		isMobile = window.innerWidth <= 768; // 768px 이하를 모바일로 간주
	}

	function resizeCanvas() {
		const container = canvas.parentElement;
		if (container) {
			containerWidth = container.clientWidth;
			containerHeight = 200; // 고정 높이 설정
			canvas.width = containerWidth;
			canvas.height = containerHeight;
			canvas.style.height = `${containerHeight}px`; // 캔버스 스타일 높이 설정
		}
		checkMobile();
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resizeCanvas();
		window.addEventListener('resize', () => {
			resizeCanvas();
			initializeBalls(); // 크기 변경 시 볼 재초기화
		});

		// 볼 초기화 및 애니메이션 시작
		initializeBalls();
		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	});

	function initializeBalls() {
		const baseBallRadius = 35;
		const ballRadius = isMobile ? baseBallRadius * 0.6 : baseBallRadius; // 모바일에서는 60% 크기로 줄임
		balls = Array(8) // 볼 개수를 8개로 유지
			.fill(null)
			.map((_, i) => {
				// 1에서 99999 사이의 랜덤 숫자 생성
				const randomNumber = Math.floor(Math.random() * 99999) + 1;
				// 숫자를 5자리 문자열로 변환 (9999 이하는 앞에 0을 채움)
				const numberString = randomNumber.toString().padStart(5, '0');

				return {
					number: numberString,
					color: colors[i % colors.length],
					x: Math.random() * (containerWidth - 2 * ballRadius) + ballRadius,
					y: Math.random() * (containerHeight - 2 * ballRadius) + ballRadius,
					dx: (Math.random() - 0.5) * 2,
					dy: (Math.random() - 0.5) * 2,
					radius: ballRadius
				};
			});
	}

	function drawBall(ball: Ball) {
		ctx.globalAlpha = 0.3; // 볼의 투명도를 0.3으로 설정 (0에서 1 사이의 값)
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fillStyle = ball.color;
		ctx.fill();
		ctx.closePath();

		ctx.globalAlpha = 0.5; // 숫자의 투명도를 0.5로 설정
		const fontSize = isMobile ? 14 : 18; // 폰트 크기를 조금 더 줄임
		ctx.font = `bold ${fontSize}px Arial`;
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(ball.number, ball.x, ball.y);
		ctx.globalAlpha = 1; // 투명도를 다시 1로 재설정
	}

	function animate() {
		ctx.clearRect(0, 0, containerWidth, containerHeight);
		ctx.fillStyle = 'rgba(255, 255, 255, 0)'; // 배경에 약간의 흰색 투명도 추가
		ctx.fillRect(0, 0, containerWidth, containerHeight);

		balls.forEach((ball, index) => {
			ball.x += ball.dx;
			ball.y += ball.dy;

			// 벽과의 충돌 처리
			if (ball.x - ball.radius < 0 || ball.x + ball.radius > containerWidth) {
				ball.dx *= -1;
				ball.x = Math.max(ball.radius, Math.min(containerWidth - ball.radius, ball.x));
			}
			if (ball.y - ball.radius < 0 || ball.y + ball.radius > containerHeight) {
				ball.dy *= -1;
				ball.y = Math.max(ball.radius, Math.min(containerHeight - ball.radius, ball.y));
			}

			// 다른 공들과의 충돌 처리
			for (let i = index + 1; i < balls.length; i++) {
				checkCollision(ball, balls[i]);
			}

			drawBall(ball);
		});

		requestAnimationFrame(animate);
	}

	function checkCollision(ball1: Ball, ball2: Ball): void {
		const dx = ball2.x - ball1.x;
		const dy = ball2.y - ball1.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < ball1.radius + ball2.radius) {
			// 충돌 발생
			const angle = Math.atan2(dy, dx);
			const sin = Math.sin(angle);
			const cos = Math.cos(angle);

			// 회전된 속도 계산
			const vx1 = ball1.dx * cos + ball1.dy * sin;
			const vy1 = ball1.dy * cos - ball1.dx * sin;
			const vx2 = ball2.dx * cos + ball2.dy * sin;
			const vy2 = ball2.dy * cos - ball2.dx * sin;

			// 충돌 후 속도 계산
			const finalVx1 =
				((ball1.radius - ball2.radius) * vx1 + 2 * ball2.radius * vx2) /
				(ball1.radius + ball2.radius);
			const finalVx2 =
				((ball2.radius - ball1.radius) * vx2 + 2 * ball1.radius * vx1) /
				(ball1.radius + ball2.radius);

			// 회전을 되돌림
			ball1.dx = finalVx1 * cos - vy1 * sin;
			ball1.dy = vy1 * cos + finalVx1 * sin;
			ball2.dx = finalVx2 * cos - vy2 * sin;
			ball2.dy = vy2 * cos + finalVx2 * sin;

			// 공들을 분리
			const overlap = ball1.radius + ball2.radius - distance;
			const separationX = (overlap * cos) / 2;
			const separationY = (overlap * sin) / 2;

			ball1.x -= separationX;
			ball1.y -= separationY;
			ball2.x += separationX;
			ball2.y += separationY;
		}
	}

	// ... 나머지 코드 ...
</script>

<div class="canvas-container">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.canvas-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 200px;
		z-index: -1;
		overflow: hidden;
	}
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
