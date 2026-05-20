export function verifyId(playerId: string) : boolean {
    if (playerId.length === 9) {
        return ['6', '7', '8', '9'].includes(playerId[0]);
    }
    if (playerId.length === 10) {
        return playerId.startsWith('18');
    }
    /*
    if (playerId.length === 3) {
        return playerId[0] === '1';
    }
    */
    return false;
}

export function parseId(playerId: string | null) : number | null {
    if (!playerId) {
        return null;
    }
    if (!verifyId(playerId)) {
        return null;
    }
    const parsedId = Number(playerId);

    if (Number.isNaN(parsedId)) {
        return null
    }
    return parsedId;
}

export function checkCountCards(cards: Map<number, number>) : boolean {
    const count = Array.from(cards.values()).reduce((acc, num) => acc + num, 0);
    const today = new Date();
    const start = new Date(2025, 9, 1)
    const months =
        (today.getFullYear() - start.getFullYear()) * 12 +
        today.getMonth() -
        start.getMonth() +
        1;
    return count > months;
}