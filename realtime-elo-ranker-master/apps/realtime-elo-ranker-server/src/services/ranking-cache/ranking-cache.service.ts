import { Injectable } from '@nestjs/common';
import { FAKE_PLAYERS } from "../../data/fake_players"



@Injectable()
export class RankingCacheService {
    private static instance: RankingCacheService;
    private cache: Map<string, any>;

    private constructor() {
      this.cache = new Map();
      const fakeRanking = FAKE_PLAYERS.map((player, index) => ({
        id: player,
        rank: 1000 + index * 10
      })).sort((a, b) => b.rank - a.rank);
      this.cache.set('ranking', fakeRanking);
    }

    public static getInstance(): RankingCacheService {
      if (!RankingCacheService.instance) {
        RankingCacheService.instance = new RankingCacheService();
      }
      return RankingCacheService.instance;
    }

    public setRankingData(key: string, data: any): void {
      const rank = this.cache.get("ranking") || [];
      rank.push({ id : key, rank: data });
      this.cache.set("ranking", rank);
    }

    public getRankingData(key: string): any | undefined {
      return this.cache.get(key);
    }

    public clearRankingData(key: string): void {
      this.cache.delete(key);
    }

    public clearAllRankingData(): void {
      this.cache.clear();
    }

    public getRank(player: string): number | undefined {
      const ranking = this.cache.get('ranking') || [];
      for (const playerData of ranking) {
        if (playerData.id === player) {
          return playerData.rank;
        }
      }
      return undefined;
    }

    public updateRank(player: string, newRank: number): void {
      const ranking = this.cache.get('ranking') || [];
      const playerIndex = ranking.findIndex((p: any) => p.id === player);
      if (playerIndex !== -1) {
        ranking[playerIndex].rank = newRank;
        this.cache.set('ranking', ranking.sort((a: { id: string, rank: number }, b: { id: string, rank: number }) => b.rank - a.rank));
      }
    }


    public getMoyenRankAllPlayer(): number {
      const ranking = this.cache.get('ranking') || [];
      if (ranking.length === 0) {
      return 0;
      }
      let totalRank = 0;
      for (const player of ranking) {
      totalRank += player.rank;
      }
      return totalRank / ranking.length;
    }
}

