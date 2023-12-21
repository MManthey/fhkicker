<script lang="ts">
	import { onMount } from 'svelte';
	import { onSnapshot, collection } from 'firebase/firestore';

	import { db } from '$lib/firebase';
	import type { Player } from '$lib/types';

	const calculateWinRate = (player: Player) => {
		const totalGames = player.score.wins + player.score.losses;
		return totalGames > 0 ? player.score.wins / totalGames : 0;
	};

	let players: Map<string, Player> = new Map();
	$: sortedPlayers = Array.from(players.values()).sort(
		(p1, p2) => calculateWinRate(p2) - calculateWinRate(p1)
	);

	onMount(() => {
		const unsubscribe = onSnapshot(collection(db, 'users'), (querySnapshot) => {
			querySnapshot.docChanges().forEach(async (change) => {
				let player = { ...change.doc.data() } as Player;
				switch (change.type) {
					case 'added':
					case 'modified':
						players = players.set(change.doc.id, player);
						break;
					case 'removed':
						players.delete(change.doc.id);
						players = players;
						break;
				}
			});
		});

		return () => {
			unsubscribe(); // Cleanup the listener when component is destroyed
		};
	});
</script>

<div class="max-w-md h-full m-auto">
	<div class="text-4xl text-center m-5">Rangliste</div>

	<!-- Responsive Container (recommended) -->
	<div class="table-container">
		<!-- Native Table Element -->
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Platz</th>
					<th>Name</th>
					<th>Record</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedPlayers as player, i}
					<tr>
						<td>{i + 1}.</td>
						<td>{player.name}</td>
						<td>{player.score.wins}:{player.score.losses} ({calculateWinRate(player).toFixed(2)}%)</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
