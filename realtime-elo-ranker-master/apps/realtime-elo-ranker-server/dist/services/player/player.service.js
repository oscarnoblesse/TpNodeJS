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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Player_entity_1 = require("../../model/entity/Player.entity");
let PlayerService = class PlayerService {
    constructor(playersRepository) {
        this.playersRepository = playersRepository;
    }
    async findAll() {
        const players = await this.playersRepository.find();
        return players.map(player => ({ name: player.name }));
    }
    async findAllWithRank() {
        const players = await this.playersRepository.find();
        players.map(player => ({ name: player.name, rank: player.rank }));
        console.log(players);
        return players;
    }
    async findOne(id) {
        const player = await this.playersRepository.findOne({ where: { id } });
        if (!player) {
            throw new Error(`Player with id ${id} not found`);
        }
        return player;
    }
    async createWithInitialRank(name) {
        const existingPlayer = await this.playersRepository.findOne({ where: { name } });
        if (existingPlayer) {
            throw new Error(`Player with name ${name} already exists`);
        }
        const rank = await this.getMoyenRankAllPlayer();
        const player = this.playersRepository.create({ name, rank });
        return this.playersRepository.save(player);
    }
    async created(name, rank) {
        const player = this.playersRepository.create({ name, rank });
        return this.playersRepository.save(player);
    }
    async remove(nomPlayer) {
        const player = await this.playersRepository.findOne({ where: { name: nomPlayer } });
        if (player) {
            await this.playersRepository.delete(player.id);
        }
    }
    async updateRank(name, newRank) {
        const player = await this.playersRepository.findOne({ where: { name } });
        if (player) {
            player.rank = newRank;
            await this.playersRepository.save(player);
        }
    }
    async getMoyenRankAllPlayer() {
        const players = await this.playersRepository.find();
        if (players.length === 0) {
            return 0;
        }
        const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
        return totalRank / players.length;
    }
    async getResultatMatch(joueur1, joueur2, result) {
        const player1 = await this.playersRepository.findOne({ where: { name: joueur1 } });
        const player2 = await this.playersRepository.findOne({ where: { name: joueur2 } });
        if (!player1) {
            throw new Error(`Player ${joueur1} not found`);
        }
        if (!player2) {
            throw new Error(`Player ${joueur2} not found`);
        }
        const rankJouer1 = player1.rank;
        const rankJouer2 = player2.rank;
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
        player1.rank = newRankJouer1;
        player2.rank = newRankJouer2;
        await this.playersRepository.save(player1);
        await this.playersRepository.save(player2);
        return { newRankJouer1, newRankJouer2 };
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlayerService);
//# sourceMappingURL=player.service.js.map