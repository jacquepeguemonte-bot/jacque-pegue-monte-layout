import fs from 'node:fs/promises';
import path from 'node:path';

const manifestPath = '/home/ubuntu/jacque-pegue-monte-layout/data/catalogo-importado.json';
const assetDir = '/home/ubuntu/webdev-static-assets/jacque-catalog';
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const files = await fs.readdir(assetDir);

const reconciled = await Promise.all(manifest.map(async (item) => {
  const filename = files.find((file) => file.startsWith(`${item.slug}.`));
  if (!filename) return item;
  const localPath = path.join(assetDir, filename);
  const { size } = await fs.stat(localPath);
  return { ...item, localPath, filename, bytes: size, status: 'downloaded', recovered: true };
}));

await fs.writeFile(manifestPath, `${JSON.stringify(reconciled, null, 2)}\n`);
console.log(JSON.stringify({
  total: reconciled.length,
  ready: reconciled.filter((item) => item.status === 'downloaded').length,
  pending: reconciled.filter((item) => item.status !== 'downloaded').map((item) => item.name),
}, null, 2));
