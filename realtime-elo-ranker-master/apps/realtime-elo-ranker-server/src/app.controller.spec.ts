import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerService } from './services/player/player.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let playerService: PlayerService;

  const mockPlayerService = {
    findAllWithRank: jest.fn().mockResolvedValue([{ name: 'Player1', rank: 1 }]),
    createWithInitialRank: jest.fn().mockResolvedValue(undefined),
    getResultatMatch: jest.fn().mockResolvedValue({ winner: 'Player1', loser: 'Player2', draw: false }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    playerService = app.get<PlayerService>(PlayerService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getRanking', () => {
    it('should return ranking', async () => {
      const result = await appController.getRanking();
      expect(result).toEqual([{ name: 'Player1', rank: 1 }]);
      expect(playerService.findAllWithRank).toHaveBeenCalled();
    });
  });

  describe('postPlayer', () => {
    it('should create a player and return the player name', async () => {
      const body = { playerName: 'Player1' };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appController.postPlayer(body, res as any);
      expect(playerService.createWithInitialRank).toHaveBeenCalledWith('Player1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Player1');
    });
  });

  describe('postMatch', () => {
    it('should return match result', async () => {
      const body = { winner: 'Player1', loser: 'Player2', draw: false };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await appController.postMatch(body, res as any);
      expect(playerService.getResultatMatch).toHaveBeenCalledWith('Player1', 'Player2', false);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ winner: 'Player1', loser: 'Player2', draw: false });
    });
  });
});