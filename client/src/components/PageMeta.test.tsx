// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { applyPageMeta } from "./PageMeta";

describe("PageMeta", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="description" content=""><link rel="canonical" href="">';
  });

  it("aplica title, description e canonical para uma página local de tema", () => {
    applyPageMeta({
      title: "Decoração Verde Esmeralda & Nude Boho em Goianésia – GO | Jacque Pegue & Monte",
      description: "Decoração Verde Esmeralda & Nude Boho Pegue & Monte em Goianésia – GO. Consulte a disponibilidade do kit para sua comemoração.",
      url: "https://jacquelayout-5igykiqe.manus.space/decoracao-verde-esmeralda-nude-boho-goianesia",
    });

    expect(document.title).toBe("Decoração Verde Esmeralda & Nude Boho em Goianésia – GO | Jacque Pegue & Monte");
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toContain("Verde Esmeralda & Nude Boho");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://jacquelayout-5igykiqe.manus.space/decoracao-verde-esmeralda-nude-boho-goianesia");
  });
});
