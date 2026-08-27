import { useEffect, useMemo, useRef, useState } from "react";
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
