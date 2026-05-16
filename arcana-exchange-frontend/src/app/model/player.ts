import { Server } from "./Enums";
import { PlayerCard } from "./player copy";

export interface Player {
    playerId: number,
    name: string,
    server: Server,
    countCards: number,
    cards: PlayerCard[]
}