import type { Writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const isAuthenticated: Writable<boolean> = localStorageStore('isAuthenticated', false);
export const email: Writable<string> = localStorageStore('email', '');

isAuthenticated.subscribe((newValue) => {
	if (browser) {
		console.log(`isAuthenticated: ${newValue}`);
		goto(newValue ? '/games' : '/');
	}
});
