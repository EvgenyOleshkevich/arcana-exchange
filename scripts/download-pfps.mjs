import fs from 'node:fs/promises';
import path from 'node:path';

const PFPS_URL =
  'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/gi/pfps.json';

const OUT_DIR = './arcana-exchange-frontend/public/assets/images/icons';
const MAP_FILE = './arcana-exchange-backend/src/main/resources/data/icons.json';

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(path.dirname(MAP_FILE), { recursive: true });

const pfps = await fetch(PFPS_URL).then(r => r.json());

const result = {};
let countNew = 0;

for (const [id, data] of Object.entries(pfps)) {
  if (!data.IconPath) continue;

  const filePath = data.IconPath.slice(4, -4);
  const fileName = data.IconPath.slice(4);
  const imageUrl = `https://enka.network${data.IconPath}`;
  const localPath = path.join(OUT_DIR, fileName);


  try {
    await fs.access(localPath);

    result[id] = filePath;
    continue;
    ++countNew;
  } catch {
  }
  const response = await fetch(imageUrl);

  if (!response.ok) {
    console.warn(`Skip ${id}: ${imageUrl}`);
    continue;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(localPath, buffer);
  result[id] = filePath;
}

await fs.writeFile(MAP_FILE, JSON.stringify(result, null, 2));

console.log(`Downloaded ${Object.keys(result).length} icons`);
console.log(`New icons: ${countNew}`);