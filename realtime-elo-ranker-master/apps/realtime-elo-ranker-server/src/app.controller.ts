import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RankingCacheService } from './services/ranking-cache.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get("/get/ranking")
  getRanking(): string {
     const ranking = RankingCacheService.getInstance();

    return ranking.getRankingData("ranking");
  }
}
