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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const ranking_cache_service_1 = require("./services/ranking-cache/ranking-cache.service");
const fake_players_1 = require("./data/fake_players");
const common_2 = require("@nestjs/common");
const match_service_1 = require("./services/match/match.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getRanking() {
        const ranking = ranking_cache_service_1.RankingCacheService.getInstance();
        return ranking.getRankingData("ranking");
    }
    async postPlayer(body, res) {
        const { playerName } = body;
        const ranking = ranking_cache_service_1.RankingCacheService.getInstance();
        ranking.setRankingData(playerName, ranking.getMoyenRankAllPlayer());
        res.status(200).send(playerName);
    }
    async postMatch(body, res) {
        const matchService = match_service_1.MatchService.getInstance();
        const result = matchService.getResultatMatch(body.winner, body.loser, body.draw);
        res.status(200).send(result);
    }
    rankingEvent(res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const intervalId = setInterval(() => {
            res.write("event: message\n" + "data: " + JSON.stringify({
                type: "RankingUpdate",
                player: {
                    id: fake_players_1.FAKE_PLAYERS[(Math.floor(Math.random() * fake_players_1.FAKE_PLAYERS.length))],
                    rank: Math.floor(Math.random() * 2500)
                }
            }) + '\n\n');
        }, 500);
        res.on('close', () => {
            clearInterval(intervalId);
            res.end();
        });
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("/get/ranking"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getRanking", null);
__decorate([
    (0, common_2.Post)("/post/player"),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postPlayer", null);
__decorate([
    (0, common_2.Post)("/post/match"),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postMatch", null);
__decorate([
    (0, common_1.Get)("/ranking/event"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "rankingEvent", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map