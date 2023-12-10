<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import { signIn } from '$lib/firebase';
	import { email } from '$lib/stores';

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const fhEmailRegex = /@fh-wedel\.de$/;

	let password = '';

	let buttonLoading = false;

	$: isEmail = emailRegex.test($email);
	$: isFhEmail = fhEmailRegex.test($email);
	$: buttonDisabled = buttonLoading || !isFhEmail || !password;

	async function handleSignIn() {
		buttonLoading = true;
		try {
			await signIn($email, password);
		} catch (error) {
			console.error('logOut failed:', error);
			// Handle errors
		} finally {
			buttonLoading = false;
		}
	}
</script>

<div class="flex flex-col gap-5">
	<input
		class="input {isEmail ? (isFhEmail ? 'input-success' : 'input-error') : ''}"
		title="Email"
		type="email"
		placeholder="FH-Wedel Mail angeben"
		bind:value={$email}
	/>
	<input
		class="input"
		title="Password"
		type="password"
		placeholder="Passwort"
		bind:value={password}
	/>
	<button class="btn variant-filled w-full" on:click={handleSignIn} disabled={buttonDisabled}>
		{#if buttonLoading}
			<ProgressRadial width="w-6" />
		{:else}
			Anmelden
		{/if}
	</button>
</div>
