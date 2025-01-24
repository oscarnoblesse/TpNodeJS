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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const Player_entity_1 = require("./model/entity/Player.entity");
const player_service_1 = require("./services/player/player.service");
const fake_players_1 = require("./data/fake_players");
let AppModule = class AppModule {
    constructor(playerService) {
        this.playerService = playerService;
        this.seedDatabase();
    }
    async seedDatabase() {
        const players = await this.playerService.findAll();
        if (players.length === 0) {
            const seedFakePlayers = async () => {
                const fakeRanking = fake_players_1.FAKE_PLAYERS.map((player, index) => ({
                    name: player,
                    rank: 1000 + index * 10,
                }));
                for (const player of fakeRanking) {
                    await this.playerService.create(player.name, player.rank);
                }
            };
            await seedFakePlayers();
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'database.sqlite',
                entities: [Player_entity_1.Player],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([Player_entity_1.Player]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, player_service_1.PlayerService],
    }),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], AppModule);
//# sourceMappingURL=app.module.js.map