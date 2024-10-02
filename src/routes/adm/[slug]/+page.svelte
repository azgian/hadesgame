<script lang="ts">
	import { page } from '$app/stores';
	import MembersPage from '../MembersPage.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if $page.params.slug === 'members'}
	<MembersPage users={data.users} />
{/if}
