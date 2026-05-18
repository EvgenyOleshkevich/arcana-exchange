import fs from 'node:fs/promises';
import path from 'node:path';

const CHARACTERS_URL  = 'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json';

const OUT_FILE  = './arcana-exchange-backend/src/main/resources/data/characters.json';

const characters = await fetch(CHARACTERS_URL ).then(r => r.json());

const result = {};

for (const [id, data] of Object.entries(characters)) {
  if (!data.SideIconName) continue;
  result[id] = data.SideIconName.replace('Side_', '') + '_Circle';
}

await fs.writeFile(OUT_FILE, JSON.stringify(result, null, 2));

console.log(`Downloaded ${Object.keys(result).length} icons`);