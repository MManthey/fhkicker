export type Player = {
	id: string
	name: string;
	score: { wins: number; losses: number }
}

export type Game = {
	status: 'open' | 'waiting' | 'playing';
	position: number;
	teams: { a: Player[], b: Player[] };
	votes: { a: Player[], b: Player[] };
};
