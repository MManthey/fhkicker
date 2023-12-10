import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const isAuthenticated = writable(false);
export const email = localStorageStore('email', '');
export const playerName = localStorageStore('playerName', '');
export const userId = localStorageStore('userId', '');

isAuthenticated.subscribe((newValue) => {
	if (browser) {
		console.log(`isAuthenticated: ${newValue}`);
		goto(newValue ? '/games' : '/');
	}
});

email.subscribe((newValue) => {
	if (browser) {
		console.log(`email: ${newValue}`);
	}
});

playerName.subscribe((newValue) => {
	if (browser) {
		console.log(`playerName: ${newValue}`);
	}
});

userId.subscribe((newValue) => {
	if (browser) {
		console.log(`userId: ${newValue}`);
	}
});