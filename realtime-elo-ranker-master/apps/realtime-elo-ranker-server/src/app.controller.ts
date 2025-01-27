import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
import { FAKE_PLAYERS } from "./data/fake_players"
import { Body, Post } from '@nestjs/common';

import { PlayerService } from './services/player/player.service';
import { Player } from './model/entity/Player.entity';

import { MatchService } from './services/match/match.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly playerService : PlayerService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get("/get/ranking")
  getRanking(): Promise<{ name: string, rank: number }[]> {
    return this.playerService.findAllWithRank()
  }


  @Post("/post/player")
  async postPlayer(@Body() body: { playerName: string }, @Res() res: Response) {
    const { playerName } = body;
    await this.playerService.createWithInitialRank(playerName);
    res.status(200).send(playerName);
  }

  @Post("/post/match")
  async postMatch(@Body() body: { winner: string, loser: string, draw: boolean }, @Res() res: Response) {
    const result = this.playerService.getResultatMatch(body.winner, body.loser, body.draw)
    res.status(200).send(result);
  }


  @Get("/ranking/event")
  async rankingEvent(@Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const intervalId = setInterval(async () => { 
      const players = await this.playerService.findAll();
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const newRank = Math.floor(Math.random() * 2500);

      // Update player's rank in the database
      await this.playerService.updateRank(randomPlayer.name, newRank);

      res.write("event: message\n" + "data: " + JSON.stringify({
        type: "RankingUpdate",
        player: {
          id: randomPlayer.name,
          name: randomPlayer.name,
          rank: newRank
        }
      }) + '\n\n');
    }, 500);

    res.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  }


}


