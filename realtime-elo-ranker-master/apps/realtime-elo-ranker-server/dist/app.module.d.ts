import { PlayerService } from './services/player/player.service';
export declare class AppModule {
    private playerService;
    constructor(playerService: PlayerService);
    seedDatabase(): Promise<void>;
}
