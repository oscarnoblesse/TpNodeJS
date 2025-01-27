import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../model/entity/Player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

async findAll(): Promise<{ name: string }[]> {
    const players = await this.playersRepository.find();
    return players.map(player => ({ name: player.name }));
}

async findAllWithRank(): Promise<{ name: string, rank: number }[]> {
    const players = await this.playersRepository.find();
    players.map(player => ({ name: player.name, rank: player.rank }));
    console.log(players)
    return players;
}

  async findOne(id: number): Promise<Player> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }

  async createWithInitialRank(name: string): Promise<Player> {
    const rank = await this.getMoyenRankAllPlayer();
    const player = this.playersRepository.create({ name, rank });
    return this.playersRepository.save(player);
  }

  async create(name: string, rank : number): Promise<Player> {
    const player = this.playersRepository.create({ name, rank });
    return this.playersRepository.save(player);
  }

  async remove(nomPlayer: string): Promise<void> {
    const player = await this.playersRepository.findOne({ where: { name: nomPlayer } });
    if (player) {
      await this.playersRepository.delete(player.id);
    }
  }

  async updateRank(name: string , newRank: number): Promise<void> {
    const player = await this.playersRepository.findOne({ where: { name } });
    if (player) {
      player.rank = newRank;
      await this.playersRepository.save(player);
    }
  }


  async getMoyenRankAllPlayer(): Promise<number> {
    const players = await this.playersRepository.find();
    if (players.length === 0) {
      return 0;
    }
    const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
    return totalRank / players.length;
  }

  async getResultatMatch(joueur1: string, joueur2: string, result: boolean): Promise<{ newRankJouer1: number, newRankJouer2: number }> {
    const player1 = await this.playersRepository.findOne({ where: { name: joueur1 } });
    const player2 = await this.playersRepository.findOne({ where: { name: joueur2 } });

    if (!player1) {
      throw new Error(`Player ${joueur1} not found`);
    }

    if (!player2) {
      throw new Error(`Player ${joueur2} not found`);
    }

    const rankJouer1 = player1.rank;
    const rankJouer2 = player2.rank;

    const K = 32; // Coefficient de pondération

    const We1 = 1 / (1 + Math.pow(10, (rankJouer2 - rankJouer1) / 400));
    const We2 = 1 / (1 + Math.pow(10, (rankJouer1 - rankJouer2) / 400));

    let newRankJouer1: number;
    let newRankJouer2: number;

    if (result == false) {
      newRankJouer1 = rankJouer1 + K * (1 - We1);
      newRankJouer2 = rankJouer2 + K * ((1 - 1) - We2);
    } else {
      newRankJouer1 = rankJouer1 + K * (0.5 - We1);
      newRankJouer2 = rankJouer2 + K * ((1 - 0.5) - We2);
    }

    player1.rank = newRankJouer1;
    player2.rank = newRankJouer2;

    await this.playersRepository.save(player1);
    await this.playersRepository.save(player2);

    return { newRankJouer1, newRankJouer2 };
  }
}