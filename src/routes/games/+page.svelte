<script lang="ts">
	import type { Games } from '$lib/types';

	import { playerName, userId } from '$lib/stores';

	const tables = 1;

	let games: Games = {
		open: [
			{
				id: 'game4',
				teamA: [{ id: 'player5A', name: 'Hannah' }],
				teamB: []
			}
			// ... other open games
		],
		waiting: [
			{
				id: 'game2',
				teamA: [
					{ id: 'player3A', name: 'David' },
					{ id: 'player4A', name: 'Isla' }
				],
				teamB: [
					{ id: 'player2B', name: 'Eve' },
					{ id: 'player3B', name: 'Frank' }
				]
			}
			// ... other waiting games
		],
		playing: [
			{
				id: 'game1',
				teamA: [
					{ id: 'player1A', name: 'Alice' },
					{ id: 'player2A', name: 'Bob' }
				],
				teamB: [
					{ id: 'player1B', name: 'Charlie' },
					{ id: 'player4B', name: 'George' }
				]
			}
			// ... other playing games
		]
	};

	$: console.log(games);

	function joinTeam(gameId: string, team: 'teamA' | 'teamB') {
		const gameIndex = games.open.findIndex((g) => g.id === gameId);
		if (gameIndex !== -1) {
			const playerData = { id: $userId, name: $playerName };
			if (!games.open[gameIndex][team].find((p) => p.id === playerData.id)) {
				games.open[gameIndex][team] = [...games.open[gameIndex][team], playerData];

				// Check if both teams are full
				if (games.open[gameIndex].teamA.length === 2 && games.open[gameIndex].teamB.length === 2) {
					const gameToMove = games.open.splice(gameIndex, 1)[0]; // Remove the game from 'open'
					if (games.playing.length < tables) {
						games.playing.push(gameToMove); // Add to 'playing' if a table is available
					} else {
						games.waiting.push(gameToMove); // Otherwise, add to 'waiting'
					}
				}
			}
		}
	}
</script>

<div class="max-w-xs m-auto flex flex-col justify-center items-center gap-5">
	<div class="text-4xl m-5">Spiele</div>
	<div class="text-2xl m-5">Aktiv</div>
	{#each games.playing as game, i}
		<div class="w-full card grid grid-cols-3 p-5 variant-ghost-success">
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamA as { name }}
					<div class="flex justify-center items-center min-h-[50px]">{name}</div>
				{/each}
			</div>
			<div class="flex justify-center items-center">VS.</div>
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamB as { name }}
					<div class="flex justify-center items-center min-h-[50px]">{name}</div>
				{/each}
			</div>
		</div>
	{/each}
	<div class="text-2xl m-5">Warteschlange</div>
	{#each games.waiting as game, i}
		<div class="w-full card grid grid-cols-3 p-5 variant-ghost-warning">
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamA as { name }}
					<div class="flex justify-center items-center min-h-[50px]">{name}</div>
				{/each}
			</div>
			<div class="flex justify-center items-center">VS.</div>
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamB as { name }}
					<div class="flex justify-center items-center min-h-[50px]">{name}</div>
				{/each}
			</div>
		</div>
	{/each}
	<div class="text-2xl m-5">Offen</div>
	{#each games.open as game, i}
		<div class="w-full card grid grid-cols-3 p-5 variant-ghost-primary">
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamA as { name }}
					<div class="flex justify-center items-center min-h-[50px]">{name}</div>
				{/each}
				{#if game.teamA.length !== 2}
					<button class="btn variant-filled-success" on:click={() => joinTeam(game.id, 'teamA')}>
						Join
					</button>
				{/if}
			</div>
			<div class="flex justify-center items-center">VS.</div>
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamB as { name }}
					<div class="flex justify-center items-center min-h-[50px]">{name}</div>
				{/each}
				{#if game.teamB.length !== 2}
					<button
						class="btn variant-filled-success"
						on:click={() => () => joinTeam(game.id, 'teamB')}
					>
						Join
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>
