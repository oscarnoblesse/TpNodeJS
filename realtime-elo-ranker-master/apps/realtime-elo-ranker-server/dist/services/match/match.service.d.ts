export declare class MatchService {
    private static instance;
    private ranking;
    private constructor();
    static getInstance(): MatchService;
    getResultatMatch(joueur1: string, joueur2: string, result: boolean): {
        newRankJouer1: number;
        newRankJouer2: number;
    };
}
