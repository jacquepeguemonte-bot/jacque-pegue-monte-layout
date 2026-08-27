/**
 * Direção visual: celebração editorial suave — dados confirmados centralizados para
 * preservar coerência de marca, SEO local e caminhos de conversão.
 */
export const BUSINESS = {
  name: "Jacque Pegue & Monte",
  location: "Goianésia – GO",
  address: "R. 25, 328 — Centro, Goianésia – GO",
  mapAddress: "R. 25, 328, Centro, Goianésia, GO",
  phoneLabel: "(62) 98169-5886",
  phoneE164: "+5562981695886",
  instagram: "https://www.instagram.com/jacque_pegue_monte",
  description: "Jacque Pegue & Monte é uma empresa de aluguel de kits de decoração para festas em Goianésia – GO. Oferece opções para festas infantis, aniversários, chá revelação, festas adultas, eventos escolares e outras comemorações. O cliente escolhe o tema, reserva, retira o kit, monta a decoração e devolve conforme as condições da locação.",
} as const;

export const WHATSAPP_URL = "https://wa.me/5562981695886?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20os%20kits%20da%20Jacque%20Pegue%20e%20Monte!";
export const WHATSAPP_CATALOG_URL = "https://wa.me/c/556281695886";

export const PRIORITY_THEME_ROUTES = [
  { slug: "minecraft", label: "Minecraft" },
  { slug: "barbie", label: "Barbie" },
  { slug: "patrulha-canina", label: "Patrulha Canina" },
  { slug: "homem-aranha", label: "Homem Aranha" },
  { slug: "hot-wheels", label: "Hot Wheels" },
  { slug: "fazendinha", label: "Fazendinha" },
  { slug: "sonic", label: "Sonic" },
  { slug: "futebol", label: "Futebol" },
  { slug: "lilo-e-stitch", label: "Lilo e Stitch" },
  { slug: "princesas", label: "Princesas" },
] as const;

export const slugify = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

export const getThemePath = (slug: string) => `/decoracao-${slug}-goianesia`;
