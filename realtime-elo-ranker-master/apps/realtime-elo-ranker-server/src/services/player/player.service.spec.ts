import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Player } from '../../model/entity/Player.entity';
import { Repository } from 'typeorm';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;

  const mockPlayers = [
    { id: 1, name: 'Player1', rank: 1 },
    { id: 2, name: 'Player2', rank: 2 },
  ];

  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockPlayers),
    findOne: jest.fn().mockResolvedValue(mockPlayers[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of players', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockPlayers.map(player => ({ name: player.name })));
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findAllWithRank', () => {
    it('should return an array of players with rank', async () => {
      const result = await service.findAllWithRank();
      expect(result).toEqual(mockPlayers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single player', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockPlayers[0]);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if player not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(service.findOne(3)).rejects.toThrow('Player with id 3 not found');
    });
  });
});