<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import { auth, checkIfEmailUsed, createUser } from '$lib/firebase';
	import { emailForSignIn } from '$lib/stores';

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const fhEmailRegex = /@fh-wedel\.de$/;

	let disabledEmailInput = false;
	let email = '';
	let emailIsUsed = false;

	let userName = '';

	let buttonLoading = false;

	$: isEmail = emailRegex.test(email);
	$: isFhEmail = fhEmailRegex.test(email);

	$: showUsernameInput = isFhEmail && !emailIsUsed;
	$: showButton = emailIsUsed ? isFhEmail : isFhEmail && userName;

	$: if (isFhEmail) {
		checkEmailUsage();
	}

	async function checkEmailUsage() {
		try {
			disabledEmailInput = true;
			emailIsUsed = await checkIfEmailUsed(email);
		} catch (error) {
			console.error('Error checking email:', error);
		} finally {
			disabledEmailInput = false;
		}
	}

	async function sendLink() {
		try {
			buttonLoading = true;
			const actionCodeSettings = {
				// URL you want to redirect back to
				url: 'http://localhost:5173',
				handleCodeInApp: true
			};

			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			// Save the email locally to complete the sign-in process later
			$emailForSignIn = email;

			if (!emailIsUsed) await createUser(email, userName);
		} catch (error) {
			console.error('Logout failed:', error);
			// Handle errors
		} finally {
			buttonLoading = false;
		}
	}

	onMount(async () => {
		if (isSignInWithEmailLink(auth, window.location.href)) {
			if ($emailForSignIn) {
				// Ask user for their email if it's not stored
				try {
					const result = await signInWithEmailLink(auth, $emailForSignIn, window.location.href);
					// Clear the email from localStorage
					$emailForSignIn = '';
					// User is signed in, handle the signed-in user
				} catch (error) {
					// Handle errors
				}
			}
		}
	});
</script>

<div class="max-w-xs m-auto h-full flex justify-center items-center">
	<div class="w-full grid grid-rows-3 gap-5">
		<input
			class="input {isEmail ? (isFhEmail ? 'input-success' : 'input-error') : ''}"
			title="Email"
			type="email"
			placeholder="FH-Wedel Mail angeben"
			bind:value={email}
			disabled={disabledEmailInput}
		/>
		{#if showUsernameInput}
			<input
				class="input"
				title="Username"
				type="text"
				placeholder="Spielername"
				transition:fade={{ duration: 200 }}
				bind:value={userName}
			/>
		{/if}
		{#if showButton}
			<button
				class="btn variant-filled w-full"
				transition:fade={{ duration: 200 }}
				on:click={sendLink}
				disabled={buttonLoading}
			>
				{#if buttonLoading}
					<ProgressRadial width="w-6"/>
				{:else if emailIsUsed}
					Anmelden
				{:else}
					Registrieren
				{/if}
			</button>
		{/if}
	</div>
</div>
