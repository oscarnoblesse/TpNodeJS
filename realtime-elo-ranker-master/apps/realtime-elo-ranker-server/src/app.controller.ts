import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
import { FAKE_PLAYERS } from "./data/fake_players"
import { Body, Post } from '@nestjs/common';
import { PlayerService } from './services/player/player.service';
import { MatchService } from './services/match/match.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get("/get/ranking")
  getRanking(): string {
     const ranking = RankingCacheService.getInstance();

    return ranking.getRankingData("ranking");
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
}


