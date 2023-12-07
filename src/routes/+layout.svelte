<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	import { isAuthenticated } from '$lib/stores';
	import { logout, checkIfEmailUsed } from '$lib/firebase';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">FHKicker</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $isAuthenticated}
					<a href="/games" class="btn btn-sm variant-ghost-surface">Spiele</a>
					<a href=/rankings class="btn btn-sm variant-ghost-surface">Rangliste</a>
					<button on:click={logout} class="btn btn-sm variant-ghost-surface">Abmelden</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
