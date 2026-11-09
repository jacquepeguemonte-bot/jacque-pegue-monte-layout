import { describe, expect, it } from "vitest";
import { MAGAZINE_CATEGORIES, MAGAZINE_THEMES } from "./magazineThemes";

describe("magazine catalog", () => {
  it("mantém os 85 registros coletados da página pública de inspirações", () => {
    expect(MAGAZINE_THEMES).toHaveLength(85);
    expect(MAGAZINE_THEMES.every((theme) => theme.name && theme.image && theme.whatsapp.includes("wa.me"))).toBe(true);
  });

  it("oferece filtros editoriais úteis para a descoberta", () => {
    expect(MAGAZINE_CATEGORIES).toEqual(["Todos", "Meninos", "Meninas", "Unissex", "Celebrações", "Adultos & sociais"]);
    expect(new Set(MAGAZINE_THEMES.map((theme) => theme.category))).toEqual(new Set(MAGAZINE_CATEGORIES.slice(1)));
  });
});
