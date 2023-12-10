// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	onAuthStateChanged,
	signOut,
	fetchSignInMethodsForEmail,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


import { isAuthenticated, userId } from '$lib/stores';

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
const db = getFirestore(app);

export { auth };

onAuthStateChanged(auth, (user) => {
	if (user) {
		isAuthenticated.set(true);
		userId.set(user.uid);
		user
	} else {
		isAuthenticated.set(false);
		userId.set('');
	}
});

export async function signIn(email: string, password: string) {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		console.error('Authentication failed:', error);
		// Handle errors
	}
}

export async function register(email: string, password: string, playerName: string) {
	try {
		let userCredential = await createUserWithEmailAndPassword(auth, email, password);
		await createUserRecord(userCredential.user.uid, email, playerName);
	} catch (error) {
		console.error('Authentication failed:', error);
		// Handle errors
	}
}

export async function logOut() {
	try {
		await signOut(auth);
		isAuthenticated.set(false);
	} catch (error) {
		console.error('logOut failed:', error);
		// Handle errors
	}
}

export async function createUserRecord(uid: string, email: string, playerName: string) {
	try {
		await setDoc(doc(db, "users", uid), {
			email: email,
			playerName: playerName
		});
	} catch (error) {
		console.error("Error creating user record:", error);
		// Handle errors

	}
}