import fs from 'node:fs/promises';
import path from 'node:path';

const PFPS_URL =
  'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/pfps.json';

const OUT_DIR = './arcana-exchange-frontend/src/assets/images/icons';
const MAP_FILE = './arcana-exchange-frontend/src/assets/data/icons.json';

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(path.dirname(MAP_FILE), { recursive: true });

const pfps = await fetch(PFPS_URL).then(r => r.json());

const result = {};

for (const [id, data] of Object.entries(pfps)) {
  if (!data.iconPath) continue;

  const fileName = `${data.iconPath}.png`;
  const imageUrl = `https://enka.network/ui/${fileName}`;
  const localPath = path.join(OUT_DIR, fileName);

  const response = await fetch(imageUrl);

  if (!response.ok) {
    console.warn(`Skip ${id}: ${imageUrl}`);
    continue;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(localPath, buffer);

  result[id] = {
    iconPath: data.iconPath,
    imageUrl: `/assets/images/pfps/${fileName}`
  };
}

await fs.writeFile(MAP_FILE, JSON.stringify(result, null, 2));

console.log(`Downloaded ${Object.keys(result).length} icons`);