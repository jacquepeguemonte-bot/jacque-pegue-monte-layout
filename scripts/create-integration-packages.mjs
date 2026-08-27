import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = "/home/ubuntu/jacque-pegue-monte-layout";
const manifestPath = path.join(projectRoot, "data/catalogo-sincronizado.json");
const outputRoot = path.join(projectRoot, "integrations");

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const themes = manifest
  .filter((item) => item.status === "downloaded" && item.name && item.imageSource)
  .map(({ name, category, slug, imageSource }) => ({ name, category, slug, image: imageSource }));

const dataSource = `// Temas reais sincronizados do catálogo Jacque Pegue e Monte.\nexport const CATALOG_THEMES = ${JSON.stringify(themes, null, 2)};\n`;

const componentSource = `import { useEffect, useMemo, useRef, useState } from "react";
import { CATALOG_THEMES } from "./catalogThemes";
import "./jacque-theme-carousel.css";

const CATEGORIES = ["Todos", "Infantil", "Temáticos", "Esportes", "Celebrações"];
const DEFAULT_WHATSAPP = "5562981695886";

export default function JacqueThemeCarousel({
  themes = CATALOG_THEMES,
  whatsapp = DEFAULT_WHATSAPP,
  title = "Temas para virar o cenário da sua história.",
  eyebrow = "Acervo Jacque",
}) {
  const [category, setCategory] = useState("Todos");
  const [position, setPosition] = useState(1);
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const viewportRef = useRef(null);
  const filtered = useMemo(() => category === "Todos" ? themes : themes.filter((theme) => theme.category === category), [category, themes]);
  const slides = useMemo(() => filtered.length ? [filtered[filtered.length - 1], ...filtered, filtered[0]] : [], [filtered]);
  const realIndex = Math.max(0, Math.min(position - 1, filtered.length - 1));

  useEffect(() => {
    setPosition(1);
    setIsTransitioning(false);
    requestAnimationFrame(() => setIsTransitioning(true));
  }, [category]);

  useEffect(() => {
    const updateStep = () => {
      const slide = viewportRef.current?.querySelector(".jtc-slide");
      if (!slide) return;
      const gap = Number.parseFloat(getComputedStyle(viewportRef.current.querySelector(".jtc-track")).gap) || 0;
      setStep(slide.getBoundingClientRect().width + gap);
    };
    updateStep();
    const observer = new ResizeObserver(updateStep);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || filtered.length < 2) return undefined;
    const timer = window.setInterval(() => setPosition((current) => current + 1), 4400);
    return () => window.clearInterval(timer);
  }, [isPaused, filtered.length]);

  const move = (direction) => {
    if (filtered.length < 2) return;
    setIsTransitioning(true);
    setPosition((current) => current + direction);
  };

  const handleTransitionEnd = () => {
    if (position === 0) {
      setIsTransitioning(false);
      setPosition(filtered.length);
    } else if (position === filtered.length + 1) {
      setIsTransitioning(false);
      setPosition(1);
    }
  };

  const selectCategory = (nextCategory) => {
    setCategory(nextCategory);
    setIsPaused(true);
  };

  const consultTheme = (theme) => {
    const text = encodeURIComponent("Olá! Quero consultar o tema " + theme.name + " para a minha festa.");
    window.open("https://wa.me/" + whatsapp + "?text=" + text, "_blank", "noopener,noreferrer");
  };

  return <section className="jtc-section" aria-labelledby="jtc-heading">
    <div className="jtc-heading">
      <p>{eyebrow}</p>
      <h2 id="jtc-heading">{title}</h2>
      <span>{filtered.length} {filtered.length === 1 ? "tema" : "temas"} para explorar</span>
    </div>
    <div className="jtc-filters" role="group" aria-label="Filtrar temas">
      {CATEGORIES.map((item) => <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => selectCategory(item)} aria-pressed={category === item}>{item}</button>)}
    </div>
    <div className="jtc-carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)}>
      <div className="jtc-viewport" ref={viewportRef} tabIndex="0" onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }} aria-roledescription="carousel" aria-label="Carrossel de temas">
        <div className="jtc-track" style={{ transform: "translate3d(-" + (position * step) + "px, 0, 0)", transition: isTransitioning ? "transform 540ms cubic-bezier(.23,1,.32,1)" : "none" }} onTransitionEnd={handleTransitionEnd}>
          {slides.map((theme, index) => <article className="jtc-slide" key={theme.slug + "-" + index} aria-hidden={index === 0 || index === slides.length - 1 ? "true" : undefined}>
            <div className="jtc-card">
              <img src={theme.image} alt={"Decoração " + theme.name + " da Jacque Pegue e Monte"} loading="lazy" />
              <div className="jtc-card__copy"><span>{theme.category}</span><h3>{theme.name}</h3><button type="button" onClick={() => consultTheme(theme)}>Consultar tema <b>↗</b></button></div>
            </div>
          </article>)}
        </div>
      </div>
      <div className="jtc-footer">
        <p className="jtc-count" aria-live="polite"><small>tema atual</small><strong>{String(realIndex + 1).padStart(2, "0")} <i>/</i> {String(filtered.length).padStart(2, "0")}</strong></p>
        <div className="jtc-progress" aria-hidden="true"><span style={{ transform: "scaleX(" + ((realIndex + 1) / Math.max(filtered.length, 1)) + ")" }} /></div>
        <div className="jtc-actions"><button type="button" onClick={() => move(-1)} aria-label="Tema anterior">←</button><button type="button" onClick={() => move(1)} aria-label="Próximo tema">→</button></div>
      </div>
      <p className="jtc-hint">Arraste ou use as setas para descobrir cada tema.</p>
    </div>
  </section>;
}
`;

const styleSource = `/* Carrossel Jacque Pegue e Monte — responsivo, sem preço e sem dependências adicionais. */
.jtc-section{padding:72px 24px;background:linear-gradient(135deg,#fff8f5,#fff 49%,#f4faf8);color:#2b2025}.jtc-heading{max-width:720px;margin:0 auto 24px;text-align:center}.jtc-heading p{margin:0 0 10px;color:#e83d71;font:800 10px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase}.jtc-heading h2{margin:0;font:600 clamp(36px,5vw,64px)/.96 Georgia,serif;letter-spacing:-.055em}.jtc-heading span{display:block;margin-top:14px;color:#806b74;font:600 13px/1.5 Arial,sans-serif}.jtc-filters{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:0 auto 28px}.jtc-filters button{padding:9px 13px;border:1px solid #eadde1;border-radius:999px;color:#634c55;background:#fff;font:800 11px/1 Arial,sans-serif;cursor:pointer;transition:transform 160ms ease,background 160ms ease,color 160ms ease}.jtc-filters button:hover,.jtc-filters button.is-active{color:#fff;background:#e83d71;transform:translateY(-2px)}.jtc-carousel{width:min(1180px,100%);margin:auto}.jtc-viewport{overflow:hidden;outline:none;touch-action:pan-y}.jtc-viewport:focus-visible{outline:3px solid rgba(232,61,113,.35);outline-offset:6px}.jtc-track{display:flex;gap:18px;will-change:transform}.jtc-slide{flex:0 0 calc((100% - 36px)/3);min-width:0}.jtc-card{position:relative;min-height:390px;overflow:hidden;display:flex;align-items:flex-end;border:4px solid rgba(255,255,255,.9);border-radius:26px;background:#684954;box-shadow:0 16px 36px rgba(94,48,70,.17)}.jtc-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 450ms cubic-bezier(.23,1,.32,1)}.jtc-card:hover img{transform:scale(1.055)}.jtc-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 36%,rgba(34,19,26,.86))}.jtc-card__copy{position:relative;z-index:1;width:100%;padding:19px;color:#fff}.jtc-card__copy span{display:inline-flex;padding:5px 8px;border:1px solid rgba(255,255,255,.5);border-radius:999px;background:rgba(10,6,8,.15);font:800 9px/1 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}.jtc-card h3{margin:13px 0 8px;font:500 31px/1 Georgia,serif;letter-spacing:-.045em}.jtc-card__copy button{padding:0;border:0;color:#fff;background:none;font:800 12px/1 Arial,sans-serif;cursor:pointer;text-decoration:underline;text-underline-offset:4px}.jtc-card__copy button b{margin-left:5px;font-size:15px}.jtc-footer{display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center;margin-top:19px}.jtc-count{display:grid;gap:3px;margin:0}.jtc-count small{color:#806b74;font:800 9px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}.jtc-count strong{font:600 24px/1 Georgia,serif}.jtc-count i{color:#e83d71;font-style:normal}.jtc-progress{height:5px;overflow:hidden;border-radius:99px;background:rgba(85,52,63,.13)}.jtc-progress span{display:block;width:100%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#e83d71,#ff9bb9);transform-origin:left;transition:transform 350ms cubic-bezier(.23,1,.32,1)}.jtc-actions{display:flex;gap:8px}.jtc-actions button{width:45px;height:45px;border:1px solid #eadde1;border-radius:50%;color:#e83d71;background:#fff;font-size:21px;cursor:pointer;box-shadow:0 8px 18px rgba(94,48,70,.1);transition:transform 180ms ease,background 180ms ease,color 180ms ease}.jtc-actions button:hover{color:#fff;background:#e83d71;transform:translateY(-3px)}.jtc-actions button:focus-visible{outline:3px solid rgba(232,61,113,.35);outline-offset:3px}.jtc-hint{margin:13px 0 0;color:#806b74;font:600 11px/1.5 Arial,sans-serif}@media(max-width:760px){.jtc-section{padding:60px 17px}.jtc-track{gap:14px}.jtc-slide{flex-basis:calc((100% - 14px)/2)}.jtc-card{min-height:330px;border-radius:21px}.jtc-card h3{font-size:25px}}@media(max-width:480px){.jtc-slide{flex-basis:84%}.jtc-footer{grid-template-columns:1fr auto;gap:12px}.jtc-progress{grid-column:1/-1;grid-row:2}.jtc-hint{max-width:265px}}@media(prefers-reduced-motion:reduce){.jtc-track,.jtc-card img,.jtc-filters button,.jtc-actions button,.jtc-progress span{transition:none}}
`;

const guideSource = `# Integração do carrossel Jacque Pegue e Monte

Este pacote contém duas cópias idênticas do componente React, prontas para uso nos projetos Lovable e Base44. Ambas usam os **63 temas reais** do catálogo, imagens de origem públicas, filtros por categoria, carrossel infinito, navegação automática pausada em interação, setas, teclado, responsividade e CTA para WhatsApp. Os preços não são exibidos.

## Arquivos por plataforma

| Plataforma | Arquivos a copiar | Onde inserir |
|---|---|---|
| Lovable | integrations/lovable/ | Crie ou substitua arquivos em src/components/ e importe o componente na página inicial. |
| Base44 | integrations/base44/ | Crie os mesmos arquivos no painel **Code**, em uma pasta de componentes, e importe na página que contém o catálogo. |

## Lovable

Abra a aba **Code**, crie uma pasta como src/components/jacque-carousel/ e envie os três arquivos da pasta integrations/lovable/. Na página que deve exibir a vitrine (normalmente src/pages/Index.jsx ou src/pages/Index.tsx), inclua:


\`\`\`jsx
import JacqueThemeCarousel from "@/components/jacque-carousel/JacqueThemeCarousel";

export default function Index() {
  return <main>{/* suas seções atuais */}<JacqueThemeCarousel /></main>;
}
\`\`\`

Use o chat do Lovable se preferir não editar manualmente: **“Crie os arquivos anexados em src/components/jacque-carousel e renderize JacqueThemeCarousel depois da seção principal da página inicial. Preserve todas as outras seções.”** O editor de código deve estar disponível para edição na conta; caso esteja somente para leitura, peça a alteração pelo chat do próprio projeto ou sincronize o projeto com um repositório Git.

## Base44

No dashboard do aplicativo, abra **Code** e localize a página inicial em **Pages**. Crie uma pasta de componentes, como components/jacque-carousel/, e envie os três arquivos da pasta integrations/base44/. Importe o componente na página:

\`\`\`jsx
import JacqueThemeCarousel from "../components/jacque-carousel/JacqueThemeCarousel";

// Dentro do JSX da sua página, depois da seção principal:
<JacqueThemeCarousel />
\`\`\`

Use a prévia em tela dividida para conferir o visual, clique em **Save** e publique somente após revisar a página. Se o caminho de importação for diferente, ajuste-o de acordo com a pasta em que criou os arquivos.

## Personalizações rápidas

| Necessidade | Onde alterar |
|---|---|
| WhatsApp | Passe whatsapp="5562SEUNUMERO" no componente. |
| Título | Passe title="Seu título" ou ajuste a prop padrão. |
| Imagens e temas | Edite catalogThemes.js; cada item contém name, category, slug e image. |
| Cores e dimensões | Ajuste as variáveis e classes em jacque-theme-carousel.css. |

## Fontes consultadas

1. [Lovable — View and edit your project's code](https://docs.lovable.dev/features/code-mode)
2. [Lovable — Sync your project with GitHub](https://docs.lovable.dev/integrations/github)
3. [Base44 — Editing Your App's Code](https://docs.base44.com/documentation/building-your-app/editing-code)
`;

for (const platform of ["lovable", "base44"]) {
  const folder = path.join(outputRoot, platform);
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(path.join(folder, "catalogThemes.js"), dataSource);
  await fs.writeFile(path.join(folder, "JacqueThemeCarousel.jsx"), componentSource);
  await fs.writeFile(path.join(folder, "jacque-theme-carousel.css"), styleSource);
}
await fs.writeFile(path.join(outputRoot, "README.md"), guideSource);
console.log(JSON.stringify({ themes: themes.length, outputRoot }, null, 2));
