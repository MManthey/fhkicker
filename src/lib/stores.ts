import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const isAuthenticated = writable(false);
export const email = localStorageStore('email', '');
export const name = localStorageStore('name', '');
export const uid = localStorageStore('uid', '');
export const gameId = localStorageStore('gameId', '');

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

name.subscribe((newValue) => {
	if (browser) {
		console.log(`name: ${newValue}`);
	}
});

uid.subscribe((newValue) => {
	if (browser) {
		console.log(`uid: ${newValue}`);
	}
});