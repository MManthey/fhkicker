<script lang="ts">
	import { onMount } from 'svelte';
	import { onSnapshot, collection } from 'firebase/firestore';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	import { uid, gameId } from '$lib/stores';
	import { db, updateGame, getPlayer, createGame, updatePlayerScore } from '$lib/firebase';
	import type { Game } from '$lib/types';

	const toastStore = getToastStore();
	const tables = 1;
	const sortByPosition = (a: [string, Game], b: [string, Game]) => a[1].position - b[1].position;

	let games: Map<string, Game> = new Map();

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
	$: voteOver = currGame && (currGame.votes.a.length > 2 || currGame.votes.b.length > 2);

	$: if (voteOver && currGame) {
		let message;
		if (currGame.votes.a.length > 2) {
			message = 'Team A gewinnt!';
		} else if (currGame.votes.b.length > 2) {
			message = 'Team B gewinnt!';
		} else {
			message = 'Es konnte kein Gewinner ermittelt werden!';
		}
		const t: ToastSettings = { message };
		toastStore.trigger(t);

		const win =
			(currGame.votes.a.length > 2 && currGame.teams.a.some((p) => p.id == $uid)) ||
			(currGame.votes.b.length > 2 && currGame.teams.b.some((p) => p.id == $uid));

		updatePlayerScore($uid, win);
		leaveGame();
	}

	async function leaveGame() {
		if (!currGame) return;

		currGame.teams.a = currGame.teams.a.filter((p) => p.id !== $uid);
		currGame.teams.b = currGame.teams.b.filter((p) => p.id !== $uid);

		if (currGame.status === 'waiting') {
			currGame.position = waiting.size;
			currGame.status = 'open';
		}

		await updateGame($gameId, currGame);
		$gameId = '';
	}

	async function join(newGameId: string, teamIdx: number) {
		const newGame = games.get(newGameId);
		const player = await getPlayer($uid);
		if (!player || !newGame) return;

		if (currGame) {
			currGame.teams.a = currGame.teams.a.filter((p) => p.id !== $uid);
			currGame.teams.b = currGame.teams.b.filter((p) => p.id !== $uid);
			currGame.status = 'open';
			await updateGame($gameId, currGame);
		}

		if (teamIdx) {
			newGame.teams.b.push(player);
		} else {
			newGame.teams.a.push(player);
		}

		if (newGame.teams.a[0] && newGame.teams.a[1] && newGame.teams.b[0] && newGame.teams.b[1]) {
			if (waiting.size === 0 && playing.size < tables) {
				newGame.status = 'playing';
				newGame.position = playing.size;
			} else {
				newGame.status = 'waiting';
				newGame.position = waiting.size;
			}
		}

		await updateGame(newGameId, newGame);

		$gameId = newGameId;
	}

	async function vote(teamIdx: number) {
		const game = games.get($gameId);
		const player = await getPlayer($uid);
		if (!game || !player) return;

		game.votes.a = game.votes.a.filter((p) => p.id !== $uid);
		game.votes.b = game.votes.b.filter((p) => p.id !== $uid);
		if (teamIdx) {
			game.votes.b.push(player);
		} else {
			game.votes.a.push(player);
		}
		await updateGame($gameId, game);
	}

	async function createNewGame() {
		const player = await getPlayer($uid);
		if (!player) return;

		if (currGame) {
			currGame.teams.a = currGame.teams.a.filter((p) => p.id !== $uid);
			currGame.teams.b = currGame.teams.b.filter((p) => p.id !== $uid);
			currGame.status = 'open';
			await updateGame($gameId, currGame);
		}

		const game: Game = {
			status: 'open',
			position: open.size,
			teams: { a: [player], b: [] },
			votes: { a: [], b: [] }
		};
		const id = await createGame(game);
		if (id) {
			$gameId = id;
		}
	}

	onMount(() => {
		let isInitialLoadComplete = false;

		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
			}
		});

		const unsubscribe = onSnapshot(collection(db, 'games'), (querySnapshot) => {
			querySnapshot.docChanges().forEach(async (change) => {
				let game = change.doc.data() as Game;
				switch (change.type) {
					case 'added':
						if (
							isInitialLoadComplete &&
							![...game.teams.a, ...game.teams.b].some((p) => p.id == $uid) &&
							Notification.permission === 'granted'
						) {
							new Notification('New game added!');
						}
					case 'modified':
						games = games.set(change.doc.id, game);
						break;
					case 'removed':
						games.delete(change.doc.id);
						games = games;
						break;
				}
			});
			isInitialLoadComplete = true;
		});

		return () => {
			unsubscribe(); // Cleanup the listener when component is destroyed
		};
	});
</script>

<div class="max-w-md h-full m-auto">
	<div class="flex flex-col items-center mt-10 gap-10">
		{#if currGame?.status === 'playing'}
			<div class="w-full card grid grid-cols-3 p-5 variant-ghost-success">
				{#each [currGame?.teams.a, currGame?.teams.b] as team, teamIdx}
					<div class="grid grid-rows-3 gap-2">
						<div class="text-2xl text-center">{teamIdx ? 'Team B' : 'Team A'}</div>
						{#each team as player}
							<div class="flex justify-center items-center min-h-[50px]">
								{player?.name}
							</div>
						{/each}
					</div>
					{#if teamIdx == 0}
						<div class="flex justify-center items-center">VS.</div>
					{/if}
				{/each}
			</div>
			<div class="text-4xl text-center m-5">Wer hat gewonnen?</div>
			<div class="w-full grid grid-cols-2 gap-5">
				{#each [currGame?.votes.a, currGame?.votes.b] as team, teamIdx}
					<button
						class="btn b-5 grid grid-rows-4 rounded-xl {teamIdx
							? 'variant-ghost-tertiary'
							: 'variant-ghost-secondary'}"
						disabled={voteOver}
						on:click={() => vote(teamIdx)}
					>
						<div class="text-2xl text-center">{teamIdx ? 'Team B' : 'Team A'}</div>
						{#each team as player}
							<div>{player?.name}</div>
						{/each}
					</button>
				{/each}
			</div>
		{:else}
			<div class="w-full p-5 card variant-glass-primary">
				<div class="text-4xl text-center m-5">Spiele</div>
				<Accordion>
					<AccordionItem open>
						<svelte:fragment slot="summary">
							<div class="text-2xl">Aktiv</div>
						</svelte:fragment>
						<svelte:fragment slot="content">
							{#each Array.from(playing.entries()) as [id, game]}
								<div class="w-full card grid grid-cols-3 p-5 variant-class-warning">
									{#each [game.teams.a, game.teams.b] as team, teamIdx}
										<div
											class="btn b-5 grid grid-rows-3 rounded-xl {teamIdx
												? 'variant-ghost-tertiary'
												: 'variant-ghost-secondary'}"
										>
											<div class="text-2xl text-center">{teamIdx ? 'Team B' : 'Team A'}</div>
											{#each team as player}
												<div>{player?.name}</div>
											{/each}
										</div>
										{#if teamIdx == 0}
											<div class="flex justify-center items-center">VS.</div>
										{/if}
									{/each}
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
								<div class="w-full card grid grid-cols-3 p-5 variant-class-warning">
									{#each [game.teams.a, game.teams.b] as team, teamIdx}
										<div
											class="btn b-5 grid grid-rows-3 rounded-xl {teamIdx
												? 'variant-ghost-tertiary'
												: 'variant-ghost-secondary'} "
										>
											<div class="text-2xl text-center">{teamIdx ? 'Team B' : 'Team A'}</div>
											{#each team as player}
												<div>{player?.name}</div>
											{/each}
										</div>
										{#if teamIdx == 0}
											<div class="flex justify-center items-center">VS.</div>
										{/if}
									{/each}
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
								<div class="w-full card grid grid-cols-3 p-5 variant-class-primary">
									{#each [game.teams.a, game.teams.b] as team, teamIdx}
										<button
											class="btn {teamIdx
												? 'variant-ghost-tertiary'
												: 'variant-ghost-secondary'} b-5 grid grid-rows-3 rounded-xl"
											disabled={team.length == 2}
											on:click={() => join(id, teamIdx)}
										>
											<div class="text-2xl text-center">{teamIdx ? 'Team B' : 'Team A'}</div>
											{#each team as player}
												<div>{player?.name}</div>
											{/each}
										</button>
										{#if teamIdx == 0}
											<div class="flex justify-center items-center">VS.</div>
										{/if}
									{/each}
								</div>
							{/each}
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
				<div class="w-full flex flex-row justify-evenly">
					<button class="btn variant-filled-error mt-10" on:click={async () => createNewGame()}>
						Create Game
					</button>
					<button class="btn variant-filled-error mt-10" on:click={async () => leaveGame()}>
						Leave Game
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
