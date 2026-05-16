export enum Server {
  America = "AMERICA",
  Europe = "EUROPE",
  Asia = "ASIA",
  Tw_Hk_Mo = "TW_HK_MO"
}

export function getServerLabel(type: Server): string {
    switch (type) {
        case Server.America: return 'America';
        case Server.Europe: return 'Europe';
        case Server.Asia: return 'Asia';
        case Server.Tw_Hk_Mo: return 'TW / HK / MO';
        default: return '';
    }
}

export const servers = Object.values(Server).map(server => ({
  value: server,
  label: getServerLabel(server),
}));