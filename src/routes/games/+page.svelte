<script lang="ts">
	import type { Game } from '$lib/types';

	const tables = 1;

	let games: Game[] = [
		{
			teamA: ['Marten', 'Linda'],
			teamB: ['Klaus', 'Peter']
		}
	];

	$: queuedGames = games.filter((game) => game.teamA.length === 2 && game.teamB.length === 2);
	$: activeGames = queuedGames.slice(0, tables);
</script>

<div class="flex flex-col justify-center items-center gap-5">
	<div class="text-4xl m-5">Spiele</div>
	{#each games as game, i}
		<div
			class="card {i === 0
				? 'variant-ghost-success'
				: 'variant-ghost-warning'} flex flex-row gap-10 p-5"
		>
			<div class="flex flex-col items-center gap-2">
				{#each game.teamA as player}
					<div>{player}</div>
				{/each}
			</div>
			<div class="flex justify-center items-center">VS.</div>
			<div class="flex flex-col items-center gap-2">
				{#each game.teamB as player}
					<div>{player}</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
