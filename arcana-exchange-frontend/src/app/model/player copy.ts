import { Server } from "./Enums";

export interface PlayerCard {
    cardId: number,
    nameRu: string,
    nameEn: string,
    imageUrl: string,
    quantity: number
}