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
    create(name: string, rank: number): Promise<Player>;
    remove(nomPlayer: string): Promise<void>;
    updateRank(id: number, newRank: number): Promise<void>;
}
