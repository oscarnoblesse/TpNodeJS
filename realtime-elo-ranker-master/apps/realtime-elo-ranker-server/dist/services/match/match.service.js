"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const ranking_cache_service_1 = require("../ranking-cache/ranking-cache.service");
let MatchService = MatchService_1 = class MatchService {
    constructor() {
        this.ranking = ranking_cache_service_1.RankingCacheService.getInstance();
    }
    static getInstance() {
        if (!MatchService_1.instance) {
            MatchService_1.instance = new MatchService_1();
        }
        return MatchService_1.instance;
    }
    getResultatMatch(joueur1, joueur2, result) {
        const rankJouer1 = this.ranking.getRank(joueur1);
        const rankJouer2 = this.ranking.getRank(joueur2);
        if (rankJouer1 === undefined) {
            throw new Error(`Rank for player ${joueur1} is undefined`);
        }
        if (rankJouer2 === undefined) {
            throw new Error(`Rank for player ${joueur2} is undefined`);
        }
        const K = 32;
        const We1 = 1 / (1 + Math.pow(10, (rankJouer2 - rankJouer1) / 400));
        const We2 = 1 / (1 + Math.pow(10, (rankJouer1 - rankJouer2) / 400));
        let newRankJouer1;
        let newRankJouer2;
        if (result == false) {
            newRankJouer1 = rankJouer1 + K * (1 - We1);
            newRankJouer2 = rankJouer2 + K * ((1 - 1) - We2);
        }
        else {
            newRankJouer1 = rankJouer1 + K * (0.5 - We1);
            newRankJouer2 = rankJouer2 + K * ((1 - 0.5) - We2);
        }
        this.ranking.updateRank(joueur1, newRankJouer1);
        this.ranking.updateRank(joueur2, newRankJouer2);
        return { newRankJouer1, newRankJouer2 };
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = MatchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MatchService);
//# sourceMappingURL=match.service.js.map