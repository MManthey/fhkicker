<script>
	import { onMount } from 'svelte';
	import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

	import { auth } from '$lib/firebase';
	import { emailForSignIn } from '$lib/stores';

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

	let email = '';

	async function sendLink() {
		try {
			const actionCodeSettings = {
				// URL you want to redirect back to
				url: 'http://localhost:5173',
				handleCodeInApp: true
			};

			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			// Save the email locally to complete the sign-in process later

			$emailForSignIn = email;
		} catch (error) {
			console.error('Logout failed:', error);
			// Handle errors
		}
	}
</script>

<div class="max-w-xs m-auto w-full h-full flex flex-col justify-center items-center gap-5">
	<input class="input" title="Email" type="email" placeholder="Email" bind:value={email} />
	<button on:click={sendLink} class="btn variant-filled w-full"> Send Sign-In Link </button>
</div>
