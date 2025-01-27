import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Player } from '../../model/entity/Player.entity';
import { Repository } from 'typeorm';



describe('PlayerService', () => {
  const service: PlayerService;
  let repository: Repository<Player>;


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a player with initial rank', async () => {
    const player = await service.createWithInitialRank('John Doe');
    expect(player).toBeDefined();
    expect(player.name).toBe('John Doe');
    expect(player.rank).toBe(0);
  });

  it('should find all players', async () => {
    await service.create('John Doe', 1000);
    await service.create('Jane Doe', 1200);
    const players = await service.findAll();
    expect(players.length).toBe(2);
    expect(players).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'John Doe' }),
        expect.objectContaining({ name: 'Jane Doe' }),
      ]),
    );
  });

  it('should find a player by id', async () => {
    const createdPlayer = await service.create('John Doe', 1000);
    const player = await service.findOne(createdPlayer.id);
    expect(player).toBeDefined();
    expect(player.name).toBe('John Doe');
    expect(player.rank).toBe(1000);
  });

  it('should update a player rank', async () => {
    await service.updateRank('John Doe', 1500);
    const createdPlayer = await service.create('John Doe', 1000);
    const player = await service.findOne(createdPlayer.id);
    expect(player.rank).toBe(1500);
  });

  it('should remove a player', async () => {
    let players = await service.findAll();
    const nb_playersDebut =  players.length;
    await service.create('John Doe', 1000);
    await service.remove('John Doe');
    players = await service.findAll();
    expect(players.length).toBe(nb_playersDebut);
  });

  it('should calculate the average rank of all players', async () => {
    const averageRankBefore = await service.getMoyenRankAllPlayer();
    await service.create('John Doe', 3000);
    await service.create('Jane Doe', 3000);
    const averageRank = await service.getMoyenRankAllPlayer();
    expect(averageRank).toBeGreaterThan(averageRankBefore);
  });

  it('should calculate new ranks after a match', async () => {
    await service.create('John Doe', 1000);
    await service.create('Jane Doe', 1200);
    const result = await service.getResultatMatch('John Doe', 'Jane Doe', true);
    expect(result.newRankJouer1).toBeGreaterThan(1000);
    expect(result.newRankJouer2).toBeLessThan(1200);
  });
});
