<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let message = '';
	export let show = false;
	export let type: 'success' | 'error' | 'info' = 'info';
	export let showButtons = true;
	export let onConfirm: (() => void) | null = null;
	export let onCancel: (() => void) | null = null;
</script>

{#if show}
	<div
		class="toast-container"
		in:fly={{ y: 50, duration: 300, easing: quintOut }}
		out:fly={{ y: 50, duration: 300, easing: quintOut }}
	>
		<div class="toast" class:success={type === 'success'} class:error={type === 'error'}>
			<p>{message}</p>
			{#if showButtons}
				<div class="buttons">
					{#if onCancel}
						<button class="cancel" on:click={onCancel}>취소</button>
					{/if}
					{#if onConfirm}
						<button class="accept" on:click={onConfirm}>확인</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		z-index: 1000;
	}
	.toast {
		background-color: #333;
		color: #aaa;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		max-width: 300px;
		width: 100%;
	}
	.toast.success {
		background-color: #4caf50;
		color: #eee;
	}
	.toast.error {
		background-color: #f44336;
		color: #eee;
	}
	.toast p {
		text-align: center;
		margin: 0;
	}
	.buttons {
		display: flex;
		justify-content: space-around;
		margin-top: 10px;
	}
	button {
		margin-left: 10px;
		padding: 5px 10px;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	button.accept {
		background-color: #4caf50;
		color: white;
	}
	button.cancel {
		background-color: #999;
		color: white;
	}
	button:hover {
		opacity: 0.8;
	}
</style>
