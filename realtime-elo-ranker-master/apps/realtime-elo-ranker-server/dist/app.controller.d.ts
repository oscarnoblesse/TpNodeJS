import { Response } from 'express';
import { AppService } from './app.service';
import { PlayerService } from './services/player/player.service';
export declare class AppController {
    private readonly appService;
    private readonly playerService;
    constructor(appService: AppService, playerService: PlayerService);
    getHello(): string;
    getRanking(): Promise<{
        name: string;
        rank: number;
    }[]>;
    postPlayer(body: {
        playerName: string;
    }, res: Response): Promise<void>;
    postMatch(body: {
        winner: string;
        loser: string;
        draw: boolean;
    }, res: Response): Promise<void>;
    rankingEvent(res: Response): Promise<void>;
}
