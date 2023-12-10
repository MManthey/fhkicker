<script lang="ts">
	import Register from './Register.svelte';
	import SignIn from './SignIn.svelte';

	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	let mode = 'signIn';
</script>

<div class="max-w-xs m-auto h-full flex flex-col gap-20 py-[20%]">
	<RadioGroup>
		<RadioItem bind:group={mode} name="justify" value="signIn">Anmelden</RadioItem>
		<RadioItem bind:group={mode} name="justify" value="register">Registrieren</RadioItem>
	</RadioGroup>

	{#if mode === 'signIn'}
		<SignIn />
	{:else}
		<Register />
	{/if}
</div>
