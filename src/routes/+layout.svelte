<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	import { isAuthenticated } from '$lib/stores';
	import { logOut } from '$lib/firebase';

	initializeStores();

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
					<button on:click={logOut} class="btn btn-sm variant-ghost-surface">Abmelden</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
	<Toast />
</AppShell>
