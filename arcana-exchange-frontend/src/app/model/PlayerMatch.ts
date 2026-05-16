import { Player } from "./player";

export interface PlayerMatch {
    player: Player,
    cardsYouCanGive: number[],
    cardsYouCanReceive: number[]
}