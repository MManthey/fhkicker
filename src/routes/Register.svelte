<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import { register } from '$lib/firebase';
    import { email } from '$lib/stores';

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const fhEmailRegex = /@fh-wedel\.de$/;

	let playerName = '';
	let password = '';

	let buttonLoading = false;

	$: isEmail = emailRegex.test($email);
	$: isFhEmail = fhEmailRegex.test($email);
	$: buttonDisabled = buttonLoading || !isFhEmail || !playerName;

	async function handleRegister() {
		buttonLoading = true;
		try {
			await register($email, password, playerName);
		} catch (error) {
			console.error('logOut failed:', error);
			// Handle errors
		} finally {
			buttonLoading = false;
		}
	}
</script>

<input
	class="input {isEmail ? (isFhEmail ? 'input-success' : 'input-error') : ''}"
	title="Email"
	type="email"
	placeholder="FH-Wedel Mail angeben"
	bind:value={$email}
/>
<input
	class="input"
	title="Playername"
	type="text"
	placeholder="Spielername"
	bind:value={playerName}
/>
<input
	class="input"
	title="Password"
	type="password"
	placeholder="Passwort"
	bind:value={password}
/>
<button class="btn variant-filled w-full" on:click={handleRegister} disabled={buttonDisabled}>
	{#if buttonLoading}
		<ProgressRadial width="w-6" />
	{:else}
		Registrieren
	{/if}
</button>
