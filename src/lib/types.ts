export type Player = {
	id: string;
	name: string;
}

type Team = {
	player1: Player | null;
	player2: Player | null;
}

export type Game = {
	status: 'open' | 'waiting' | 'playing';
	position: number;
	teamA: Team;
	teamB: Team;
	votes: {
		teamA: Player[];
		teamB: Player[];
	};
};
