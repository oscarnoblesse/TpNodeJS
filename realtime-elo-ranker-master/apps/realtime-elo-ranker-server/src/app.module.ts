import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Player } from './model/entity/Player.entity';
import { PlayerService } from './services/player/player.service';
import { FAKE_PLAYERS } from './data/fake_players';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Player],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Player]),
  ],
  controllers: [AppController],
  providers: [AppService, PlayerService],
})
export class AppModule {
  constructor(private playerService: PlayerService) {
    this.seedDatabase();
  }

  async seedDatabase() {
    const players = await this.playerService.findAll();
    if (players.length === 0) {
      const seedFakePlayers = async () => {
        const fakeRanking = FAKE_PLAYERS.map((player, index) => ({
          name: player,
          rank: 1000 + index * 10,
        }));

        for (const player of fakeRanking) {
          await this.playerService.create(player.name, player.rank);
        }
      };
      await seedFakePlayers();
    }
  }
}