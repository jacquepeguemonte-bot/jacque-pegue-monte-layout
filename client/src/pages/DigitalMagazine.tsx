import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, BookOpen, Heart, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { PageMeta } from "@/components/PageMeta";
import { PublicPageShell } from "@/components/PublicPageShell";
import { MAGAZINE_CATEGORIES, MAGAZINE_THEMES } from "@/data/magazineThemes";
import { WHATSAPP_CATALOG_URL } from "@/lib/business";

const categoryIntro: Record<string, string> = {
  Todos: "Uma curadoria completa para você encontrar a atmosfera da sua próxima celebração.",
  Meninos: "Aventuras, heróis, velocidade e mundos para comemorar em grande estilo.",
  Meninas: "Cores, personagens e delicadeza para festas cheias de personalidade.",
  Unissex: "Temas versáteis que funcionam para diferentes idades e estilos de festa.",
  Celebrações: "Chás, casamentos, batizados, formaturas e momentos que merecem um cenário especial.",
  "Adultos & sociais": "Composições sofisticadas para aniversários, encontros e comemorações adultas.",
};

export function DigitalMagazine() {
  const [category, setCategory] = useState<(typeof MAGAZINE_CATEGORIES)[number]>("Todos");
  const [query, setQuery] = useState("");

  const filteredThemes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return MAGAZINE_THEMES.filter((theme) => {
      const inCategory = category === "Todos" || theme.category === category;
      const inSearch = !normalized || `${theme.name} ${theme.category}`.toLocaleLowerCase("pt-BR").includes(normalized);
      return inCategory && inSearch;
    });
  }, [category, query]);

  return (
    <PublicPageShell>
      <PageMeta
        title="Revista de Temas | Jacque Pegue & Monte em Goianésia – GO"
        description="Revista digital com o catálogo completo de temas da Jacque Pegue & Monte em Goianésia – GO. Escolha sua inspiração e consulte a disponibilidade pelo WhatsApp."
      />
      <main className="magazine-page">
        <section className="magazine-cover" aria-labelledby="magazine-title">
          <div className="magazine-cover__wash" />
          <div className="magazine-cover__content">
            <p className="magazine-overline"><Sparkles size={14} /> Edição especial · Goianésia — GO</p>
            <h1 id="magazine-title">A festa começa<br /><em>pela inspiração.</em></h1>
            <p className="magazine-cover__dek">Uma revista para folhear sem pressa, descobrir combinações e encontrar o tema que transforma uma comemoração em memória.</p>
            <div className="magazine-cover__actions">
              <a className="magazine-button magazine-button--light" href="#sumario">Folhear a revista <ArrowDown size={16} /></a>
              <a className="magazine-button magazine-button--outline" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Falar com a Jacque <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="magazine-cover__stamp"><span>J</span><strong>Jacque</strong><small>Pegue &amp; Monte</small></div>
          <div className="magazine-cover__issue">VOL. 01<br /><strong>85 temas</strong></div>
        </section>

        <section className="magazine-manifesto" id="sumario">
          <div className="magazine-manifesto__index"><span>01</span><span>02</span><span>03</span><span>04</span></div>
          <div>
            <p className="magazine-overline magazine-overline--pink">O acervo em uma nova leitura</p>
            <h2>Escolher um tema<br /><em>também é criar.</em></h2>
            <p>Na Jacque Pegue &amp; Monte, você encontra kits pensados para retirar, montar e celebrar do seu jeito. Nesta edição, reunimos o catálogo de inspirações em uma experiência mais gostosa de consultar: por clima, por idade, por ocasião ou simplesmente pelo tema que fez seu coração bater mais forte.</p>
            <div className="magazine-manifesto__note"><Heart size={16} fill="currentColor" /> Salve seus favoritos e consulte a disponibilidade pelo WhatsApp.</div>
          </div>
          <div className="magazine-manifesto__side"><BookOpen size={30} /><strong>Como ler</strong><span>Escolha uma seção, toque em um tema e envie uma mensagem pronta para a equipe.</span></div>
        </section>

        <section className="magazine-catalog" id="catalogo-revista" aria-labelledby="catalog-title">
          <div className="magazine-catalog__heading">
            <div><p className="magazine-overline magazine-overline--pink">O grande acervo</p><h2 id="catalog-title">85 maneiras de<br /><em>comemorar.</em></h2></div>
            <p>{categoryIntro[category]}</p>
          </div>
          <div className="magazine-toolbar">
            <div className="magazine-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar um tema..." aria-label="Buscar um tema" /></div>
            <div className="magazine-count"><strong>{filteredThemes.length}</strong><span>inspirações</span></div>
          </div>
          <div className="magazine-filters" role="tablist" aria-label="Filtrar por categoria">
            {MAGAZINE_CATEGORIES.map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? "magazine-filter magazine-filter--active" : "magazine-filter"} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="magazine-grid">
            {filteredThemes.map((theme, index) => <article className="magazine-card" key={`${theme.name}-${index}`}>
              <div className="magazine-card__image"><img src={theme.image} alt={theme.alt || `Decoração ${theme.name} em Goianésia – GO`} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/manus-storage/jacque-catalog-atmosphere_ace0ecd7.jpg"; }} /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="magazine-card__body"><p>{theme.category}</p><h3>{theme.name}</h3><a href={theme.whatsapp} target="_blank" rel="noreferrer">Consultar disponibilidade <ArrowUpRight size={15} /></a></div>
            </article>)}
          </div>
          {filteredThemes.length === 0 && <div className="magazine-empty"><Search size={26} /><h3>Nenhuma inspiração encontrada</h3><p>Tente buscar por outro nome ou escolha outra seção da revista.</p></div>}
        </section>

        <section className="magazine-cta" aria-label="Chamada para orçamento">
          <div><p className="magazine-overline">O próximo capítulo é seu</p><h2>Encontrou o tema<br /><em>da sua festa?</em></h2><p>Envie uma mensagem para a equipe. A disponibilidade e os detalhes do kit são confirmados para a sua data.</p></div>
          <a className="magazine-button magazine-button--dark" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Abrir conversa no WhatsApp <ArrowUpRight size={17} /></a>
        </section>
        <div className="magazine-back"><Link href="/">Voltar para a página inicial</Link></div>
      </main>
    </PublicPageShell>
  );
}
