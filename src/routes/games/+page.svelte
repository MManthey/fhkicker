<script lang="ts">
	import type { Game } from '$lib/types';

	const tables = 1;

	let games: Game[] = [
		{
			teamA: ['Marten', 'Linda'],
			teamB: ['Klaus']
		}
	];

	$: queuedGames = games.filter((game) => game.teamA.length === 2 && game.teamB.length === 2);
	$: activeGames = queuedGames.slice(0, tables);
</script>

<div class="flex flex-col justify-center items-center gap-5">
	<div class="text-4xl m-5">Spiele</div>
	{#each games as game, i}
		<div
			class="card grid grid-cols-3 p-5 {i === 0
				? 'variant-ghost-success'
				: 'variant-ghost-warning'}"
		>
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamA as player}
					<div class="flex justify-center items-center">{player}</div>
				{/each}
				{#if game.teamA.length !== 2}
					<button class="btn variant-filled-success">Join</button>
				{/if}
			</div>
			<div class="flex justify-center items-center">VS.</div>
			<div class="grid grid-rows-2 gap-2">
				{#each game.teamB as player}
					<div class="flex justify-center items-center">{player}</div>
				{/each}
				{#if game.teamB.length !== 2}
					<button class="btn variant-filled-success">Join</button>
				{/if}
			</div>
		</div>
	{/each}
</div>
