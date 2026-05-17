export function verifyId(playerId: string) : boolean {
    if (playerId.length === 9) {
        return ['6', '7', '8', '9'].includes(playerId[0]);
    }
    if (playerId.length === 10) {
        return playerId.startsWith('18');
    }
    if (playerId.length === 3) {
        return playerId[0] === '1';
    }
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