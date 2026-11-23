import { MAGAZINE_THEMES } from "./magazineThemes";

export type PuzzleDecoration = {
  id: string;
  themeName: string;
  category: string;
  imageUrl: string;
  catalogUrl: string;
  itemsIncluded: string[];
};

const catalogUrl = "https://wa.me/c/556281695886";

export const PUZZLE_DECORATIONS: PuzzleDecoration[] = [
  { id: "kit-safari", themeName: "Kit Safari", category: "Infantil", imageUrl: "/manus-storage/fazendinha_fce77a9e.jpg", catalogUrl, itemsIncluded: ["Painel temático", "Mesa principal", "Suportes decorativos"] },
  { id: "kit-sereia", themeName: "Kit Sereia", category: "Infantil", imageUrl: "/manus-storage/sereia_0c6d6a96.png", catalogUrl, itemsIncluded: ["Painel temático", "Cilindros decorativos", "Boleiras e bandejas"] },
  { id: "kit-minnie-rosa", themeName: "Kit Minnie Rosa", category: "Infantil", imageUrl: "/manus-storage/minnie-rosa_8a0e5f9f.png", catalogUrl, itemsIncluded: ["Painel temático", "Mesa principal", "Elementos decorativos"] },
  ...MAGAZINE_THEMES.slice(0, 12).map((theme, index) => ({
    id: `catalog-${index}-${theme.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    themeName: theme.name,
    category: theme.category,
    imageUrl: theme.image,
    catalogUrl: theme.whatsapp || catalogUrl,
    itemsIncluded: ["Composição temática", "Peças decorativas", "Orientações para montagem"],
  })),
];
