import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const manifestPath = '/home/ubuntu/jacque-pegue-monte-layout/data/catalogo-importado.json';
const outputDir = '/home/ubuntu/webdev-static-assets/jacque-catalog';

const extensionFrom = (url) => {
  const match = url.match(/\.(png|jpe?g|webp|gif)(?:$|[?#])/i);
  return match ? match[1].replace('jpeg', 'jpg') : 'jpg';
};

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const failed = manifest.filter((item) => item.status === 'failed');

const retry = async (item) => {
  const extension = extensionFrom(item.imageSource);
  const filename = `${item.slug}.${extension}`;
  const localPath = path.join(outputDir, filename);
  try {
    await run('curl', [
      '-L', '--fail', '--silent', '--show-error', '--max-time', '30',
      '--retry', '2', '--retry-all-errors',
      '-A', 'Mozilla/5.0 (compatible; JacquePegueMonteCatalog/1.0)',
      item.imageSource, '-o', localPath,
    ], { timeout: 95_000 });
    const { size } = await fs.stat(localPath);
    return { ...item, localPath, filename, status: 'downloaded', bytes: size, recovered: true };
  } catch (error) {
    return { ...item, status: 'failed', retryError: String(error.message) };
  }
};

const recovered = [];
const batchSize = 4;
for (let index = 0; index < failed.length; index += batchSize) {
  recovered.push(...await Promise.all(failed.slice(index, index + batchSize).map(retry)));
}

const retryBySlug = new Map(recovered.map((item) => [item.slug, item]));
const merged = manifest.map((item) => retryBySlug.get(item.slug) ?? item);
await fs.writeFile(manifestPath, `${JSON.stringify(merged, null, 2)}\n`);

console.log(JSON.stringify({
  retried: failed.length,
  recovered: recovered.filter((item) => item.status === 'downloaded').length,
  stillFailed: recovered.filter((item) => item.status === 'failed').length,
  totalReady: merged.filter((item) => item.status === 'downloaded').length,
}, null, 2));
