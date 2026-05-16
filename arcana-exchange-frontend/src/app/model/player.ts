import { TimeInterval } from "rxjs/internal/operators/timeInterval";
import { Server } from "./Enums";
import { PlayerCard } from "./PlayerCard";

export interface Player {
    playerId: number,
    name: string,
    avatarPath: string,
    server: Server,
    countCards: number,
    profileUpdatedAt: string,
    cardsUpdatedAt: string,
    cards: PlayerCard[]
}