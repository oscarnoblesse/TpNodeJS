export declare class RankingCacheService {
    private static instance;
    private cache;
    private constructor();
    static getInstance(): RankingCacheService;
    setRankingData(key: string, data: any): void;
    getRankingData(key: string): any | undefined;
    clearRankingData(key: string): void;
    clearAllRankingData(): void;
}
