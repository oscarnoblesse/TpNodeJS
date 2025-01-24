export declare class PlayerService {
    private fake_players;
    constructor();
    private loadPlayers;
    private savePlayers;
    findAll(): any[];
    findOne(id: string): any;
    create(nomPlayer: string): any;
    removePlayer(nomPlayer: string): void;
}
