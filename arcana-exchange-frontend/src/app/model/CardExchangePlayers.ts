import { Player } from "./player";

export interface CardExchangePlayers {
    offeredBy: Player[],
    wantedBy: Player[]
}