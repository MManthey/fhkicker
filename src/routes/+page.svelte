<script lang="ts">
	import Register from './Register.svelte';
	import SignIn from './SignIn.svelte';

	let mode: 'none' | 'register' | 'signIn' = 'none';
</script>

<div class="max-w-xs m-auto h-full flex justify-center items-center">
	<div class="flex flex-col gap-5 w-full">
		{#if mode === 'none'}
			<button class="btn variant-filled" on:click={() => (mode = 'signIn')}>Anmelden</button>
			<button class="btn variant-filled" on:click={() => (mode = 'register')}>
				Registrieren
			</button>
		{:else if mode === 'register'}
			<Register />
		{:else}
			<SignIn />
		{/if}
	</div>
</div>
