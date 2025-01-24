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
    return this.playerService.findAllWithRank();
  }


  @Post("/post/player")
  async postPlayer(@Body() body: { playerName: string }, @Res() res: Response) {
    const {playerName} = body;
    const ranking = RankingCacheService.getInstance();
    ranking.setRankingData(playerName,ranking.getMoyenRankAllPlayer());
    res.status(200).send(playerName);
  }

  @Post("/post/match")
  async postMatch(@Body() body: { winner: string, loser: string, draw: boolean }, @Res() res: Response) {
    const matchService = MatchService.getInstance()
    const result = matchService.getResultatMatch(body.winner, body.loser, body.draw)
    res.status(200).send(result);
  }


  @Get("/ranking/event")
  rankingEvent(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const intervalId = setInterval(() => {
      res.write("event: message\n" + "data: " + JSON.stringify({
        type: "RankingUpdate",
        player: {
          id: FAKE_PLAYERS[(Math.floor(Math.random() * FAKE_PLAYERS.length))],
          rank: Math.floor(Math.random() * 2500)
        }
      }) + '\n\n');
    }, 500);

    res.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  }


  @Get('players')
  findAll(): Promise<{ name: string }[]> {
    return this.playerService.findAll();
  }

  @Get('players/:id')
  findOne(id: string): Promise<Player> {
    return this.playerService.findOne(+id);
  }

  @Post('players')
  create(@Body('name') name: string,rank : number): Promise<Player> {
    return this.playerService.create(name,rank);
  }

  @Post('players/:id')
  remove(nomPlayer: string): Promise<void> {
    return this.playerService.remove(nomPlayer);
  }


}


