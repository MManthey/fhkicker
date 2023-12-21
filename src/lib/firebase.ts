// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	onAuthStateChanged,
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

import { isAuthenticated, uid } from '$lib/stores';
import type { Game, Player } from './types';

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
export const db = getFirestore(app);

export { auth };

onAuthStateChanged(auth, (user) => {
	if (user) {
		isAuthenticated.set(true);
		uid.set(user.uid);
	} else {
		isAuthenticated.set(false);
		uid.set('');
	}
});

export async function signIn(email: string, password: string) {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		console.error('Authentication failed:', error);
	}
}

export async function register(email: string, password: string, name: string) {
	try {
		let userCredential = await createUserWithEmailAndPassword(auth, email, password);
		await createUserRecord(userCredential.user.uid, email, name);
	} catch (error) {
		console.error('Authentication failed:', error);
	}
}

export async function logOut() {
	try {
		await signOut(auth);
		isAuthenticated.set(false);
	} catch (error) {
		console.error('logOut failed:', error);
	}
}

export async function createUserRecord(uid: string, email: string, name: string) {
	try {
		await setDoc(doc(db, "users", uid), {
			email: email,
			name: name,
			score: { wins: 0, losses: 0 }
		});
	} catch (error) {
		console.error("Error creating user record:", error);
	}
}

export async function updateGame(gameId: string, game: Game) {
	const gameRef = doc(db, 'games', gameId);

	try {
		// Check if both teams are empty
		if (!game.teams.a.length && !game.teams.b.length) {
			
			if (game.votes.a.length > 0 || game.votes.b.length > 0) {
				// Move the game to the 'archive' collection
				const archiveRef = doc(db, 'archive', gameId);
				await setDoc(archiveRef, game);
				console.log('Game moved to archive successfully');
			}

			await deleteDoc(gameRef);
			console.log('Game deleted successfully as no players are left');
		} else {
			await updateDoc(gameRef, game);
			console.log('Game updated successfully');
		}
	} catch (error) {
		console.error('Error updating or deleting game:', error);
	}
}


export async function createGame(game: Game) {
	try {
		const docRef = await addDoc(collection(db, "games"), game);
		return docRef.id;
	} catch (error) {
		console.error("Error creating game:", error);
	}
}

export async function getPlayer(uid: string) {
	try {
		const playerDoc = await getDoc(doc(db, "users", uid));
		if (playerDoc.exists()) {
			const data = playerDoc.data();
			return { id: playerDoc.id, name: data.name, score: data.score };
		}
	} catch (error) {
		console.error("Error fetching user record:", error);
	}
}

export async function updatePlayerScore(uid: string, isWin: boolean) {
	try {
		const userRef = doc(db, "users", uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const user = userDoc.data() as Player;
			let newScore = user.score;

			// Adjusting the score
			if (isWin) {
				newScore.wins += 1; // Add 10 points for a win, for example
			} else {
				newScore.losses += 1; // Subtract 5 points for a loss, for example
			}

			// Update the score in the document
			await updateDoc(userRef, { score: newScore });
		} else {
			console.log("No such document!");
		}
	} catch (error) {
		console.error("Error updating player score:", error);
	}
}
