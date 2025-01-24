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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const fake_players_1 = require("../../data/fake_players");
const fs = require("fs");
const path = require("path");
let PlayerService = class PlayerService {
    constructor() {
        this.loadPlayers();
    }
    loadPlayers() {
        this.fake_players = fake_players_1.FAKE_PLAYERS;
    }
    savePlayers() {
        const filePath = path.resolve(__dirname, '../../data/fake_players.ts');
        const fileContent = `export const FAKE_PLAYERS = ${JSON.stringify(this.fake_players, null, 2)};`;
        fs.writeFileSync(filePath, fileContent, 'utf8');
    }
    findAll() {
        return this.fake_players;
    }
    findOne(id) {
        return this.fake_players.find(fake_players => fake_players.id === id);
    }
    create(nomPlayer) {
        this.fake_players.push(nomPlayer);
        this.savePlayers();
    }
    removePlayer(nomPlayer) {
        const playerIndex = this.fake_players.findIndex(player => player.nom === nomPlayer);
        if (playerIndex > -1) {
            this.fake_players.splice(playerIndex, 1);
            this.savePlayers();
        }
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PlayerService);
//# sourceMappingURL=player.service.js.map