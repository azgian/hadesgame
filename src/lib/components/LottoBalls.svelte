<script lang="ts">
	import { onMount } from 'svelte';

	interface Ball {
		number: number;
		color: string;
		x: number;
		y: number;
		dx: number;
		dy: number;
		radius: number;
	}

	let balls: Ball[] = [];
	const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let containerWidth: number;
	let containerHeight: number;

	function resizeCanvas() {
		const container = canvas.parentElement;
		if (container) {
			containerWidth = container.clientWidth;
			containerHeight = 150; // 고정 높이 또는 원하는 비율로 설정
			canvas.width = containerWidth;
			canvas.height = containerHeight;
		}
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
		const ballRadius = 35; // 볼의 반지름을 3배로 증가 (15 * 3 = 45)
		balls = Array(6)
			.fill(null)
			.map((_, i) => ({
				number: Math.floor(Math.random() * 45) + 1,
				color: colors[i % colors.length],
				x: Math.random() * (containerWidth - 2 * ballRadius) + ballRadius,
				y: Math.random() * (containerHeight - 2 * ballRadius) + ballRadius,
				dx: (Math.random() - 0.5) * 2,
				dy: (Math.random() - 0.5) * 2,
				radius: ballRadius
			}));
	}

	function drawBall(ball: Ball) {
		ctx.globalAlpha = 0.3; // 볼의 투명도를 0.3으로 설정 (0에서 1 사이의 값)
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fillStyle = ball.color;
		ctx.fill();
		ctx.closePath();

		ctx.globalAlpha = 0.5; // 숫자의 투명도를 0.5로 설정
		ctx.font = 'bold 24px Arial';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(ball.number.toString(), ball.x, ball.y);
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
		height: 100%;
		z-index: -1;
		overflow: hidden;
	}
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
