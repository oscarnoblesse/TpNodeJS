import { Response } from 'express';
import { AppService } from './app.service';
import { PlayerService } from './services/player/player.service';
import { Player } from './model/entity/Player.entity';
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
    }, res: Response): any;
    postMatch(body: {
        winner: string;
        loser: string;
        draw: boolean;
    }, res: Response): any;
    rankingEvent(res: Response): void;
    findAll(): Promise<{
        name: string;
    }[]>;
    findOne(id: string): Promise<Player>;
    create(name: string, rank: number): Promise<Player>;
    remove(nomPlayer: string): Promise<void>;
}
