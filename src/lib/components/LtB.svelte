<script lang="ts">
	import { onMount } from 'svelte';

	interface Ball {
		number: number;
		x: number;
		y: number;
		dx: number;
		dy: number;
		radius: number;
	}

	let balls: Ball[] = [];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let containerWidth: number;
	let containerHeight: number;
	let isMobile: boolean;

	function checkMobile() {
		isMobile = window.innerWidth <= 768;
	}

	function resizeCanvas() {
		const container = canvas.parentElement;
		if (container) {
			containerWidth = container.clientWidth;
			containerHeight = 200;
			canvas.width = containerWidth;
			canvas.height = containerHeight;
			canvas.style.height = `${containerHeight}px`;
		}
		checkMobile();
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resizeCanvas();
		window.addEventListener('resize', () => {
			resizeCanvas();
			initializeBalls();
		});

		initializeBalls();
		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	});

	function initializeBalls() {
		const baseBallRadius = 35;
		const ballRadius = isMobile ? baseBallRadius * 0.6 : baseBallRadius;
		balls = Array(8)
			.fill(null)
			.map(() => ({
				number: Math.floor(Math.random() * 90000) + 10000, // 5자리 랜덤 숫자 생성
				x: Math.random() * (containerWidth - 2 * ballRadius) + ballRadius,
				y: Math.random() * (containerHeight - 2 * ballRadius) + ballRadius,
				dx: (Math.random() - 0.5) * 2,
				dy: (Math.random() - 0.5) * 2,
				radius: ballRadius
			}));
	}

	function animate() {
		ctx.clearRect(0, 0, containerWidth, containerHeight);

		balls.forEach((ball, index) => {
			ball.x += ball.dx;
			ball.y += ball.dy;

			if (ball.x - ball.radius < 0 || ball.x + ball.radius > containerWidth) {
				ball.dx *= -1;
				ball.x = Math.max(ball.radius, Math.min(containerWidth - ball.radius, ball.x));
			}
			if (ball.y - ball.radius < 0 || ball.y + ball.radius > containerHeight) {
				ball.dy *= -1;
				ball.y = Math.max(ball.radius, Math.min(containerHeight - ball.radius, ball.y));
			}

			for (let i = index + 1; i < balls.length; i++) {
				checkCollision(ball, balls[i]);
			}

			drawBall(ball);
		});

		requestAnimationFrame(animate);
	}

	function drawBall(ball: Ball) {
		const rainbowColors = [
			'#ff0000',
			'#ff7f00',
			'#ffff00',
			'#00ff00',
			'#0000ff',
			'#4b0082',
			'#9400d3'
		];
		let color;

		const ballIndex = balls.indexOf(ball);
		if (ballIndex < 7) {
			// 처음 7개의 공에 대해서는 무지개 색상 사용
			color = rainbowColors[ballIndex];
		} else {
			// 8번째 공은 회색으로 설정
			color = '#808080'; // 회색
		}

		ctx.globalAlpha = 0.5; // 볼의 투명도를 0.5로 설정
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();

		ctx.globalAlpha = 1; // 텍스트의 투명도는 1로 설정
		ctx.font = `bold ${ball.radius * 0.5}px Arial`;
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(ball.number.toString(), ball.x, ball.y);
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
