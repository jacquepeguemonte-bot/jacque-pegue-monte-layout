import { describe, expect, it } from "vitest";
import { PUZZLE_DECORATIONS } from "./imagesData";

describe("Jacque Puzzle catalog", () => {
  it("mantém kits com dados suficientes para o jogo e conversão", () => {
    expect(PUZZLE_DECORATIONS.length).toBeGreaterThanOrEqual(12);
    expect(PUZZLE_DECORATIONS.every((item) => item.id && item.themeName && item.imageUrl && item.catalogUrl && item.itemsIncluded.length > 0)).toBe(true);
  });
});
