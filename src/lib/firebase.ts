// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { isAuthenticated } from '$lib/stores';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAdB5Afc4RnnSHFTYAm4To3Lx1oYmHB8xc',
	authDomain: 'fhkicker.firebaseapp.com',
	projectId: 'fhkicker',
	storageBucket: 'fhkicker.appspot.com',
	messagingSenderId: '26493258794',
	appId: '1:26493258794:web:3d0985636a589a97f10753'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

onAuthStateChanged(auth, (user) => {
	if (user) {
		isAuthenticated.set(true);
	} else {
		isAuthenticated.set(false);
	}
});

export async function logout() {
	try {
		await signOut(auth);
		// Handle any post-logout logic here (e.g., redirecting to the home page)
		isAuthenticated.set(false);
	} catch (error) {
		console.error('Logout failed:', error);
		// Optionally handle errors (e.g., display an error message)
	}
}
