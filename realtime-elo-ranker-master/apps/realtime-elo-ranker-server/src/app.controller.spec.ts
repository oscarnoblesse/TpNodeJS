import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerService } from './services/player/player.service';
import { Response } from 'express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './model/entity/Player.entity';
import { Repository } from 'typeorm';

describe('AppController', () => {
  let appController: AppController;
  let playerService: PlayerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, PlayerService],
    }).compile();

    appController = app.get<AppController>(AppController);
    playerService = app.get<PlayerService>(PlayerService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getRanking', () => {
    it('should return ranking', async () => {
      const result = [{ name: 'Player1', rank: 1 }];
      jest.spyOn(playerService, 'findAllWithRank').mockResolvedValue(result);

      expect(await appController.getRanking()).toBe(result);
    });
  });

  describe('postPlayer', () => {
    it('should create a player and return playerName', async () => {
      const playerName = 'Player1';
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await appController.postPlayer({ playerName }, res);

      expect(playerService.createWithInitialRank).toHaveBeenCalledWith(playerName);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(playerName);
    });
  });

  describe('postMatch', () => {
    it('should return match result', async () => {
      const matchResult = { winner: 'Player1', loser: 'Player2', draw: false };
      const result = { newRankJouer1: 1500, newRankJouer2: 1400 };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest.spyOn(playerService, 'getResultatMatch').mockResolvedValue(Promise.resolve(result));

      await appController.postMatch(matchResult, res);

      expect(playerService.getResultatMatch).toHaveBeenCalledWith(matchResult.winner, matchResult.loser, matchResult.draw);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(result);
    });
  });

  describe('rankingEvent', () => {
    it('should send ranking updates', async () => {
      const players = [{ name: 'Player1' }];
      jest.spyOn(playerService, 'findAll').mockResolvedValue(players);
      jest.spyOn(playerService, 'updateRank').mockResolvedValue(undefined);

      const res = {
        setHeader: jest.fn(),
        flushHeaders: jest.fn(),
        write: jest.fn(),
        on: jest.fn((event, callback) => {
          if (event === 'close') {
            callback();
          }
        }),
        end: jest.fn(),
      } as unknown as Response;

      await appController.rankingEvent(res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(res.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
      expect(res.flushHeaders).toHaveBeenCalled();
    });
  });
});
