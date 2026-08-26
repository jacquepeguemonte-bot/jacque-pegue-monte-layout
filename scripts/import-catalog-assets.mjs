import fs from 'node:fs/promises';
import path from 'node:path';

const sourcePath = '/home/ubuntu/Downloads/Jacque_Pegue_e_Monte_Catalogo_Completo - Jacque_Pegue_e_Monte_Catalogo_Completo.csv.csv';
const outputDir = '/home/ubuntu/webdev-static-assets/jacque-catalog';
const outputData = '/home/ubuntu/jacque-pegue-monte-layout/data/catalogo-importado.json';

const slugify = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const splitCsv = (line) => {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
};

const categorize = (name) => {
  const normalized = slugify(name);
  if (/cha|panela|revelacao|ano-novo|natal|formatura/.test(normalized)) return 'Celebrações';
  if (/vasco|sao-paulo|flamengo|futebol/.test(normalized)) return 'Esportes';
  if (/boiadeira|safari|fazendinha|jardim/.test(normalized)) return 'Temáticos';
  return 'Infantil';
};

const extensionFrom = (url, type = '') => {
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('gif')) return 'gif';
  const match = url.match(/\.(png|jpe?g|webp|gif)(?:$|[?#])/i);
  return match ? match[1].replace('jpeg', 'jpg') : 'jpg';
};

const raw = await fs.readFile(sourcePath, 'utf8');
const rows = raw.trim().split(/\r?\n/).slice(1).map(splitCsv);
const catalog = rows
  .filter(([name, , price, image]) => name && price === 'R$ 170' && /^https?:\/\//.test(image ?? ''))
  .map(([name, , price, image, imageTitle]) => ({
    name,
    price,
    imageSource: image,
    imageTitle,
    category: categorize(name),
    slug: slugify(name),
  }));

await fs.mkdir(outputDir, { recursive: true });
const downloadItem = async (item) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(item.imageSource, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JacquePegueMonteCatalog/1.0)' },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const type = response.headers.get('content-type') ?? '';
    const extension = extensionFrom(item.imageSource, type);
    const filename = `${item.slug}.${extension}`;
    const destination = path.join(outputDir, filename);
    const bytes = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(destination, bytes);
    return { ...item, localPath: destination, filename, status: 'downloaded', bytes: bytes.length };
  } catch (error) {
    return { ...item, status: 'failed', error: String(error.message) };
  } finally {
    clearTimeout(timeout);
  }
};

const batchSize = 8;
const results = [];
for (let index = 0; index < catalog.length; index += batchSize) {
  const batch = catalog.slice(index, index + batchSize);
  results.push(...await Promise.all(batch.map(downloadItem)));
}

await fs.mkdir(path.dirname(outputData), { recursive: true });
await fs.writeFile(outputData, `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify({ total: results.length, downloaded: results.filter((item) => item.status === 'downloaded').length, failed: results.filter((item) => item.status === 'failed').length }, null, 2));
