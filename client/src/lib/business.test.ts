import { describe, expect, it } from "vitest";
import { getThemeDestination, getThemePath, isThemePageAvailable, WHATSAPP_CATALOG_URL } from "./business";

describe("rotas de temas", () => {
  it("abre uma página própria para um tema selecionado na estratégia de SEO", () => {
    expect(isThemePageAvailable("Chá Revelação")).toBe(true);
    expect(getThemeDestination("Chá Revelação")).toBe(getThemePath("Chá Revelação"));
  });

  it("envia temas sem página própria ao catálogo oficial do WhatsApp", () => {
    expect(isThemePageAvailable("Fazendinha Rosa")).toBe(false);
    expect(getThemeDestination("Fazendinha Rosa")).toBe(WHATSAPP_CATALOG_URL);
  });

  it("mantém páginas locais para os novos temas adicionados ao catálogo", () => {
    expect(isThemePageAvailable("Carros")).toBe(true);
    expect(getThemePath("Carros")).toBe("/decoracao-carros-goianesia");
    expect(isThemePageAvailable("Lingerie")).toBe(true);
    expect(getThemePath("Lingerie")).toBe("/decoracao-lingerie-goianesia");
  });
});
