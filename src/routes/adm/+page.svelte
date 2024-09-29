<script lang="ts">
	import type { PageData } from './$types';
	import type { Timestamp } from 'firebase/firestore';

	export let data: PageData;

	function formatDate(date: Date | Timestamp | null | undefined): string {
		if (date instanceof Date) {
			return date.toLocaleString('ko-KR', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			});
		} else if (date && 'toDate' in date) {
			// Timestamp 객체인 경우
			return date.toDate().toLocaleString('ko-KR', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			});
		}
		return '날짜 없음';
	}
</script>

<h2 id="content-title">
	<span class="material-icons">settings</span>
	Admin
</h2>
<div class="content-info">
	<div class="table-container">
		<table class="user-table">
			<thead>
				<tr>
					<th>이메일</th>
					<th>지갑 주소</th>
					<th>가입일</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					<tr>
						<td>{user.email}</td>
						<td>{user.walletAddress || '미설정'}</td>
						<td>{formatDate(user.createdAt)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.table-container {
		min-width: 450px; /* 테이블의 최소 너비 설정 */
	}

	.user-table {
		width: 100%;
		border-collapse: collapse;
	}

	.user-table th,
	.user-table td {
		padding: 12px;
		text-align: left;
		border-bottom: 1px solid #686161;
		text-align: center;
	}

	.user-table th {
		background-color: #686161;
		font-weight: bold;
	}

	@media (max-width: 768px) {
		.content-info {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤 지원 */
			scrollbar-width: thin; /* Firefox */
			scrollbar-color: #686161 #f0f0f0; /* Firefox */
		}

		.content-info::-webkit-scrollbar {
			height: 6px; /* 스크롤바 높이 */
		}

		.content-info::-webkit-scrollbar-track {
			background: #f0f0f0; /* 스크롤바 트랙 색상 */
		}

		.content-info::-webkit-scrollbar-thumb {
			background-color: #686161; /* 스크롤바 색상 */
			border-radius: 3px; /* 스크롤바 모서리 둥글게 */
		}

		.table-container {
			width: 100%;
		}

		.user-table {
			width: 100%;
			white-space: nowrap; /* 텍스트 줄바꿈 방지 */
		}

		.user-table th,
		.user-table td {
			padding: 8px; /* 모바일에서 패딩 줄임 */
		}
	}
</style>
