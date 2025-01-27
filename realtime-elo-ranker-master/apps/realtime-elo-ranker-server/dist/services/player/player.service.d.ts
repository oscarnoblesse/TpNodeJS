import { Repository } from 'typeorm';
import { Player } from '../../model/entity/Player.entity';
export declare class PlayerService {
    private playersRepository;
    constructor(playersRepository: Repository<Player>);
    findAll(): Promise<{
        name: string;
    }[]>;
    findAllWithRank(): Promise<{
        name: string;
        rank: number;
    }[]>;
    findOne(id: number): Promise<Player>;
    createWithInitialRank(name: string): Promise<Player>;
    create(name: string, rank: number): Promise<Player>;
    remove(nomPlayer: string): Promise<void>;
    updateRank(name: string, newRank: number): Promise<void>;
    getMoyenRankAllPlayer(): Promise<number>;
    getResultatMatch(joueur1: string, joueur2: string, result: boolean): Promise<{
        newRankJouer1: number;
        newRankJouer2: number;
    }>;
}
