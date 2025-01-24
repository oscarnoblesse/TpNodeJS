import { Injectable } from '@nestjs/common';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';

@Injectable()
export class MatchService {
   private static instance: MatchService;
   private ranking: RankingCacheService;
   
       private constructor() {
            this.ranking = RankingCacheService.getInstance();
       }
   
       public static getInstance(): MatchService {
         if (!MatchService.instance) {
           MatchService.instance = new MatchService();
         }
         return MatchService.instance;
       }

    public getResultatMatch(joueur1: string, joueur2: string,result: boolean) {
        const rankJouer1 = this.ranking.getRank(joueur1);
        const rankJouer2 = this.ranking.getRank(joueur2);
        
        if (rankJouer1 === undefined) {
            throw new Error(`Rank for player ${joueur1} is undefined`);
        }

        if (rankJouer2 === undefined) {
            throw new Error(`Rank for player ${joueur2} is undefined`);
        }

        const K = 32; // Coefficient de pondération

        const We1 = 1 / (1 + Math.pow(10, (rankJouer2 - rankJouer1) / 400));
        const We2 = 1 / (1 + Math.pow(10, (rankJouer1 - rankJouer2) / 400));
        
        let newRankJouer1: number;
        let newRankJouer2: number;

        if(result == false){
            newRankJouer1 = rankJouer1 + K * (1 - We1);
            newRankJouer2 = rankJouer2 + K * ((1 - 1) - We2);
        }
        else{
            newRankJouer1 = rankJouer1 + K * (0.5 - We1);
            newRankJouer2 = rankJouer2 + K * ((1 - 0.5) - We2);
        }

        this.ranking.updateRank(joueur1, newRankJouer1);
        this.ranking.updateRank(joueur2, newRankJouer2);

        return { newRankJouer1, newRankJouer2 };
    }
        
}
