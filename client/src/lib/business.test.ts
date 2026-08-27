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
});
