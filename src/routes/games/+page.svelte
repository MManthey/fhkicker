<script lang="ts">
	import { onMount } from 'svelte';
	import { onSnapshot, collection } from 'firebase/firestore';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	import { playerName, userId, gameId } from '$lib/stores';
	import { db, updateGame } from '$lib/firebase';
	import type { Player, Game } from '$lib/types';

	const tables = 1;

	let games: Map<string, Game> = new Map();

	const sortByPosition = (a: [string, Game], b: [string, Game]) => a[1].position - b[1].position;

	// Reactive assignments
	$: open = new Map(
		Array.from(games.entries())
			.filter(([, game]) => game.status === 'open')
			.sort(sortByPosition)
	);

	$: waiting = new Map(
		Array.from(games.entries())
			.filter(([, game]) => game.status === 'waiting')
			.sort(sortByPosition)
	);

	$: playing = new Map(
		Array.from(games.entries())
			.filter(([, game]) => game.status === 'playing')
			.sort(sortByPosition)
	);

	$: currGame = games.get($gameId);

	// $: console.log(games);

	async function leaveGame() {
		const game = games.get($gameId);
		if (!game) return;

		// Check and remove the player from Team A
		if (game.teamA.player1?.id === $userId) {
			game.teamA.player1 = null;
		} else if (game.teamA.player2?.id === $userId) {
			game.teamA.player2 = null;
		}

		// Check and remove the player from Team B
		if (game.teamB.player1?.id === $userId) {
			game.teamB.player1 = null;
		} else if (game.teamB.player2?.id === $userId) {
			game.teamB.player2 = null;
		}

		if (game.status === 'waiting') {
			game.position = waiting.size + 1;
			game.status = 'open';
		}

		await updateGame($gameId, game);
		$gameId = '';
	}

	async function joinGame(newGameId: string, teamIndex: number, playerIndex: number) {
		const game = games.get(newGameId);
		if (!game) return;

		const oldGame = games.get($gameId);
		if (oldGame) {
			if (oldGame.teamA.player1?.id === $userId) {
				oldGame.teamA.player1 = null;
			} else if (oldGame.teamA.player2?.id === $userId) {
				oldGame.teamA.player2 = null;
			}
			if (oldGame.teamB.player1?.id === $userId) {
				oldGame.teamB.player1 = null;
			} else if (oldGame.teamB.player2?.id === $userId) {
				oldGame.teamB.player2 = null;
			}
			oldGame.status = 'open';
			oldGame.position = waiting.size + 1;
			await updateGame($gameId, oldGame);
		}

		const team = teamIndex === 0 ? game.teamA : game.teamB;
		const player: Player = { id: $userId, name: $playerName };

		if (playerIndex === 0) {
			team.player1 = player;
		} else {
			team.player2 = player;
		}

		if (game.teamA.player1 && game.teamA.player2 && game.teamB.player1 && game.teamB.player2) {
			if (waiting.size === 0 && playing.size < tables) {
				game.status = 'playing';
				game.position = playing.size + 1;
			} else {
				game.status = 'waiting';
				game.position = waiting.size + 1;
			}
		}
		await updateGame(newGameId, game);
		$gameId = newGameId;
	}

	async function vote(teamIndex: number) {
		const game = games.get($gameId);
		if (!game) return;

		const player: Player = { id: $userId, name: $playerName };
		if (teamIndex) {
			game.votes.teamB.push(player);
			game.votes.teamA = game?.votes.teamA.filter((p) => p.id !== $userId);
		} else {
			game.votes.teamA.push(player);
			game.votes.teamB = game?.votes.teamB.filter((p) => p.id !== $userId);
		}
		await updateGame($gameId, game);
	}

	onMount(() => {
		const unsubscribe = onSnapshot(collection(db, 'games'), (querySnapshot) => {
			querySnapshot.docChanges().forEach(async (change) => {
				let game = { ...change.doc.data() } as Game;
				switch (change.type) {
					case 'added':
					case 'modified':
						games = games.set(change.doc.id, game);
						break;
					case 'removed':
						games.delete(change.doc.id);
						games = games;
						break;
				}
			});
		});

		return () => {
			unsubscribe(); // Cleanup the listener when component is destroyed
		};
	});
</script>

<div class="max-w-xs h-full m-auto">
	{#if currGame?.status === 'playing'}
		<div class="text-4xl m-5">Wer hat gewonnen?</div>
		<div class="h-full flex flex-col justify-center items-center">
			<div class="w-full grid grid-cols-2 gap-5">
				{#each [currGame.votes.teamA, currGame.votes.teamB] as team, teamIndex}
					<button
						class="btn variant-ghost-{teamIndex
							? 'error'
							: 'success'} b-5 grid grid-rows-4 rounded-xl"
						on:click={() => vote(teamIndex)}
					>
						<div class="text-2xl text-center">{teamIndex ? 'Team B' : 'Team A'}</div>
						{#each team as player}
							<div>{player.name}</div>
						{/each}
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center">
			<div class="text-4xl m-5">Spiele</div>
			<Accordion>
				<AccordionItem open>
					<svelte:fragment slot="summary">
						<div class="text-2xl">Aktiv</div>
					</svelte:fragment>
					<svelte:fragment slot="content">
						{#each Array.from(playing.entries()) as [id, game]}
							<div class="w-full card grid grid-cols-3 p-5 variant-ghost-success">
								<div class="grid grid-rows-2 gap-2">
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamA.player1?.name}
									</div>
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamA.player2?.name}
									</div>
								</div>
								<div class="flex justify-center items-center">VS.</div>
								<div class="grid grid-rows-2 gap-2">
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamB.player1?.name}
									</div>
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamB.player2?.name}
									</div>
								</div>
							</div>
						{/each}
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem open>
					<svelte:fragment slot="summary">
						<div class="text-2xl">Warteschlange</div>
					</svelte:fragment>
					<svelte:fragment slot="content">
						{#each Array.from(waiting.entries()) as [id, game]}
							<div class="w-full card grid grid-cols-3 p-5 variant-ghost-warning">
								<div class="grid grid-rows-2 gap-2">
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamA.player1?.name}
									</div>
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamA.player2?.name}
									</div>
								</div>
								<div class="flex justify-center items-center">VS.</div>
								<div class="grid grid-rows-2 gap-2">
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamB.player1?.name}
									</div>
									<div class="flex justify-center items-center min-h-[50px]">
										{game.teamB.player2?.name}
									</div>
								</div>
							</div>
						{/each}
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem open>
					<svelte:fragment slot="summary">
						<div class="text-2xl">Offen</div>
					</svelte:fragment>
					<svelte:fragment slot="content">
						{#each Array.from(open.entries()) as [id, game]}
							<div class="w-full card grid grid-cols-3 p-5 variant-ghost-primary">
								{#each [game.teamA, game.teamB] as team, teamIndex}
									<div class="grid grid-rows-2 gap-2">
										{#each [team.player1, team.player2] as player, playerIndex}
											{#if player}
												<div class="flex justify-center items-center min-h-[50px]">
													{player.name}
												</div>
											{:else}
												<button
													class="btn variant-filled-success"
													on:click={() => joinGame(id, teamIndex, playerIndex)}
												>
													Join
												</button>
											{/if}
										{/each}
									</div>
									{#if teamIndex == 0}
										<div class="flex justify-center items-center">VS.</div>
									{/if}
								{/each}
							</div>
						{/each}
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
			<button class="btn variant-filled-error mt-10" on:click={async () => leaveGame()}>
				Leave Game
			</button>
		</div>
	{/if}
</div>
