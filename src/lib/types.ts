type Player = {
	id: string;
	name: string;
}

type Game = {
	id: string;
	teamA: Player[];
	teamB: Player[];
};

export type Games = {
	playing: Game[];
	waiting: Game[];
	open: Game[];

}
