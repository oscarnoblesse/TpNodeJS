import { Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getRanking(): string;
    postPlayer(body: {
        playerName: string;
    }, res: Response): Promise<void>;
    postMatch(body: {
        winner: string;
        loser: string;
        draw: boolean;
    }, res: Response): Promise<void>;
    rankingEvent(res: Response): void;
}
