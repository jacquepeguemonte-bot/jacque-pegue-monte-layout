import fs from 'node:fs/promises';
import path from 'node:path';

const project = '/home/ubuntu/jacque-pegue-monte-layout';
const manifest = JSON.parse(await fs.readFile(path.join(project, 'data/catalogo-importado.json'), 'utf8'));
const uploadLog = await fs.readFile(path.join(project, 'data/upload-catalog-assets.log'), 'utf8');
const assetDir = '/home/ubuntu/webdev-static-assets/jacque-catalog';
const files = await fs.readdir(assetDir);

const storageByFilename = new Map(
  [...uploadLog.matchAll(/\[SUCCESS\]\s+.+\/([^/\s]+)\s+->\s+(\/manus-storage\/[^\s]+)/g)]
    .map(([, filename, storagePath]) => [filename, storagePath]),
);
storageByFilename.set('sonic.png', '/manus-storage/sonic_5cc3656e.png');

const themes = manifest.map((item) => {
  const filename = item.filename ?? files.find((file) => file.startsWith(`${item.slug}.`));
  const image = storageByFilename.get(filename);
  if (!filename || !image) throw new Error(`Ativo ausente para ${item.name}`);
  return {
    name: item.name,
    category: item.category,
    price: item.price,
    image,
  };
});

const source = `/**
 * Direção visual: celebração editorial suave — dados reais do acervo devem reforçar
 * a diversidade da experiência, mantendo imagens próprias e categorias legíveis.
 */
export type CatalogTheme = {
  name: string;
  category: "Infantil" | "Temáticos" | "Esportes" | "Celebrações";
  price: string;
  image: string;
};

export const CATALOG_THEMES: CatalogTheme[] = ${JSON.stringify(themes, null, 2)};

export const CATALOG_CATEGORIES = ["Todos", "Infantil", "Temáticos", "Esportes", "Celebrações"] as const;
`;

await fs.mkdir(path.join(project, 'client/src/data'), { recursive: true });
await fs.writeFile(path.join(project, 'client/src/data/catalogThemes.ts'), source);
console.log(JSON.stringify({ themes: themes.length, categories: [...new Set(themes.map((item) => item.category))] }, null, 2));
