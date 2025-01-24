import { Injectable } from '@nestjs/common';
import { FAKE_PLAYERS } from '../../data/fake_players';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PlayerService {
    private fake_players: any[];

    constructor() {
        this.loadPlayers();
    }

    private loadPlayers() {
        this.fake_players = FAKE_PLAYERS;
    }

    private savePlayers() {
        const filePath = path.resolve(__dirname, '../../data/fake_players.ts');
        const fileContent = `export const FAKE_PLAYERS = ${JSON.stringify(this.fake_players, null, 2)};`;
        fs.writeFileSync(filePath, fileContent, 'utf8');
    }

    findAll(): any[] {
        return this.fake_players;
    }

    findOne(id: string): any {
        return this.fake_players.find(fake_players => fake_players.id === id);
    }

    create(nomPlayer: string): any {
        this.fake_players.push(nomPlayer);
        this.savePlayers();
    }

    removePlayer(nomPlayer: string): void {
        const playerIndex = this.fake_players.findIndex(player => player.nom === nomPlayer);
        if (playerIndex > -1) {
            this.fake_players.splice(playerIndex, 1);
            this.savePlayers();
        }
    }
}