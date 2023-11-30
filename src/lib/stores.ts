import type { Writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const emailForSignIn: Writable<string> = localStorageStore('emailForSignIn', '');
export const isAuthenticated: Writable<boolean> = localStorageStore('isAuthenticated', false);

emailForSignIn.subscribe((newValue) => {
	console.log(`emailForSignIn: ${newValue}`);
});

isAuthenticated.subscribe((newValue) => {
	if (browser) {
		console.log(`isAuthenticated: ${newValue}`);
		goto(newValue ? '/games' : '/');
	}
});
