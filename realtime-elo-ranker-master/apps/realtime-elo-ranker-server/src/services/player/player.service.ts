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
    return players.map(player => ({ name: player.name, rank: player.rank }));
}

  async findOne(id: number): Promise<Player> {
    const player = await this.playersRepository.findOneBy({ id });
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }

  async create(name: string ,rank : number): Promise<Player> {
    const player = this.playersRepository.create({ name, rank});
    return this.playersRepository.save(player);
  }

  async remove(nomPlayer: string): Promise<void> {
    const player = await this.playersRepository.findOneBy({ name: nomPlayer });
    if (player) {
      await this.playersRepository.delete(player.id);
    }
  }

  async updateRank(id: number, newRank: number): Promise<void> {
    const player = await this.playersRepository.findOneBy({ id });
    if (player) {
      player.rank = newRank;
      await this.playersRepository.save(player);
    }
  }
}