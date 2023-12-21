<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import { register } from '$lib/firebase';
	import { email, name } from '$lib/stores';

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const fhEmailRegex = /@fh-wedel\.de$/;

	let password = '';
	let passwordConfirm = '';

	let buttonLoading = false;

	$: isEmail = emailRegex.test($email);
	$: isFhEmail = fhEmailRegex.test($email);
	$: buttonDisabled =
		buttonLoading || !isFhEmail || !$name || !password || password !== passwordConfirm;

	async function handleRegister() {
		buttonLoading = true;
		try {
			await register($email, password, $name);
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
	<input class="input" title="name" type="text" placeholder="Name" bind:value={$name} />
	<input
		class="input"
		title="password"
		type="password"
		placeholder="Passwort"
		bind:value={password}
	/>
	<input
		class="input"
		title="passwordConfirm"
		type="password"
		placeholder="Passwort bestätigen"
		bind:value={passwordConfirm}
	/>
	<button class="btn variant-filled w-full" on:click={handleRegister} disabled={buttonDisabled}>
		{#if buttonLoading}
			<ProgressRadial width="w-6" />
		{:else}
			Registrieren
		{/if}
	</button>
</div>
