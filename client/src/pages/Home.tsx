/**
 * Direção visual: celebração editorial suave — narrativa arejada, cápsulas flutuantes,
 * atmosfera pastel e rosa pitanga para conversão. A referência inspira a composição,
 * mas esta página usa conteúdo e ativos próprios de Jacque Pegue e Monte.
 */
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  PartyPopper,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { CATALOG_THEMES } from "@/data/catalogThemes";
import { PageMeta } from "@/components/PageMeta";
import { trpc } from "@/lib/trpc";
import { DEFAULT_FEATURED_THEME_SLUGS, getThemeDestination, isThemePageAvailable, slugify, WHATSAPP_CATALOG_URL } from "@/lib/business";

const WHATSAPP = "https://wa.me/5562981695886?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20os%20kits%20da%20Jacque%20Pegue%20e%20Monte!";

const NAV_ITEMS = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
];

const HOME_THEME_PREVIEW = CATALOG_THEMES.filter((theme) => DEFAULT_FEATURED_THEME_SLUGS.includes(slugify(theme.name) as (typeof DEFAULT_FEATURED_THEME_SLUGS)[number])).slice(0, 3);
const CATALOG_HERO_THEME = CATALOG_THEMES[3] ?? CATALOG_THEMES[0];

const STEPS = [
  ["01", "Escolha seu tema", "Navegue pelo acervo, encontre o kit que combina com sua celebração e fale com a gente."],
  ["02", "Reserve a data", "Confirmamos a disponibilidade e organizamos sua retirada com todo o cuidado."],
  ["03", "Retire e monte", "Seu kit sai preparado, higienizado e acompanhado das orientações que você precisa."],
  ["04", "Celebre do seu jeito", "Você monta em minutos, curte cada momento e devolve tudo no horário combinado."],
];

const BENEFITS = [
  ["Economia que cabe no plano", "Visual de festa especial sem a complexidade e o custo de uma montagem completa.", "01"],
  ["Kits leves e práticos", "Peças pensadas para caber no carro e tornar a retirada simples.", "02"],
  ["Acervo bem cuidado", "Cada item é higienizado e revisado para chegar bonito na sua comemoração.", "03"],
  ["Apoio de verdade", "Da escolha à devolução, você conta com orientação direta pelo WhatsApp.", "04"],
];

const FAQ_ITEMS = [
  ["O que vem no kit de decoração?", "Os kits reúnem painel, cilindros ou mesas, suportes, boleiras, displays e peças relacionadas ao tema. A composição exata é confirmada com você no atendimento."],
  ["As peças cabem em carro de passeio?", "Sim. Os kits são organizados para que as peças sejam transportadas com praticidade. Antes da retirada, orientamos a melhor forma de acomodar tudo."],
  ["Como funciona a retirada e a devolução?", "Combinamos o horário de retirada e o prazo de devolução no momento da reserva. Assim, você aproveita o evento com planejamento e tranquilidade."],
  ["Como garanto a reserva do meu tema?", "Basta chamar no WhatsApp, confirmar a disponibilidade da data e formalizar a reserva com a equipe."],
  ["Como consulto a disponibilidade?", "Envie a data e o tema que você procura pelo WhatsApp. A equipe confirma o que está disponível para a sua comemoração."],
  ["Onde retiro a decoração?", "A retirada é combinada com a equipe na R. 25, 328 — Centro, em Goianésia – GO."],
  ["Vocês fazem a montagem?", "O modelo Pegue & Monte é pensado para você retirar o kit e montar sua decoração. Se precisar alinhar uma necessidade específica, fale com a equipe."],
];

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand-lockup${compact ? " brand-lockup--compact" : ""}`} href="#inicio" aria-label="Jacque Pegue e Monte — início">
      <img src="https://lh3.googleusercontent.com/a-/ALV-UjV7qig-kmUwLvTwpBPFbRz_esDD-LUSO7TA0qlxRVrzZOCaTL9h=w1521" alt="Símbolo Jacque Pegue e Monte" />
      <span>
        <strong>Jacque</strong>
        <small>Pegue e Monte</small>
      </span>
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><Sparkles size={14} strokeWidth={2.4} />{children}</p>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const highlightsQuery = trpc.themeHighlights.list.useQuery(undefined, { staleTime: 60_000, refetchOnWindowFocus: false });
  const homeThemePreview = useMemo(() => {
    const highlighted = (highlightsQuery.data ?? []).map((highlight) => CATALOG_THEMES.find((theme) => slugify(theme.name) === highlight.themeSlug)).filter((theme): theme is (typeof CATALOG_THEMES)[number] => Boolean(theme));
    return (highlighted.length > 0 ? highlighted : HOME_THEME_PREVIEW).slice(0, 3);
  }, [highlightsQuery.data]);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell">
      <PageMeta title="Jacque Pegue & Monte | Decoração de Festas em Goianésia – GO" description="Aluguel de kits de decoração para festas em Goianésia – GO. Escolha seu tema, retire, monte e devolva. Festa infantil, aniversário, chá revelação e muito mais. Conheça a Jacque Pegue & Monte." />
      <header className="site-header">
        <div className="header-inner">
          <BrandLockup />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <a className="header-admin-link" href="/admin/avaliacoes">Área da equipe</a>
          <a className="header-cta" href={WHATSAPP} target="_blank" rel="noreferrer">Ver disponibilidade <ArrowUpRight size={16} /></a>
          <button className="menu-trigger" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Navegação móvel">
            {NAV_ITEMS.map((item) => <a onClick={closeMenu} key={item.href} href={item.href}>{item.label}<ChevronRight size={17} /></a>)}
            <a onClick={closeMenu} className="mobile-nav__cta" href={WHATSAPP} target="_blank" rel="noreferrer">Consultar no WhatsApp <ArrowUpRight size={17} /></a>
          </nav>
        )}
      </header>

      <section className="hero" id="inicio" aria-labelledby="hero-heading">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-content">
          <img className="hero-logo-art" src="/manus-storage/logo-jpm-lovable_2d35525f.jpeg" alt="Logotipo Jacque Pegue e Monte" />
          <p className="hero-kicker">Festas e locações em Goianésia — GO</p>
          <p className="hero-signature">A sua celebração começa com um tema especial.</p>
          <h1 id="hero-heading">Kits de decoração para festas <em>em Goianésia – GO.</em></h1>
          <p className="hero-subtitle">Alugue sua decoração, retire, monte e comemore. Encontre kits para festas infantis, aniversários, chá revelação, chá de bebê e outras comemorações.</p>
          <div className="hero-actions">
          <a className="button button--primary" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Abrir catálogo completo <ArrowUpRight size={18} /></a>
            <a className="button button--ghost" href="#como-funciona">Como funciona <ChevronDown size={18} /></a>
          </div>
        </div>
        <div className="hero-note hero-note--left"><span><PackageCheck size={17} /></span><p><strong>Kit completo</strong>Retire pronto para celebrar</p></div>
        <div className="hero-note hero-note--right"><span><ShieldCheck size={17} /></span><p><strong>Reserva organizada</strong>Suporte em cada etapa</p></div>
        <div className="hero-scroll">role para descobrir <span /></div>
      </section>

      <section className="story-section" id="sobre" aria-labelledby="sobre-heading">
        <div className="story-image" role="img" aria-label="Equipe preparando uma decoração de festa" />
        <div className="story-copy">
          <Eyebrow>Mais leve para você, mais bonito para a festa</Eyebrow>
          <h2 id="sobre-heading">Escolha, retire, monte.<br /><em>Do seu jeito.</em></h2>
          <p>Na Jacque Pegue e Monte, acreditamos que montar uma comemoração pode ser simples, afetiva e cheia de estilo. Você encontra o tema, pega as peças com praticidade e cria o cenário para o seu momento.</p>
          <div className="story-metrics">
            <div><strong>+{CATALOG_THEMES.length}</strong><span>temas no acervo</span></div>
            <div><strong>Local</strong><span>atendimento em Goianésia</span></div>
          </div>
          <a className="text-link" href="#como-funciona">Entenda a experiência <ArrowUpRight size={17} /></a>
          <div className="home-service-links" aria-label="Conheça nossos serviços"><a href="/festa-infantil-goianesia">Festa infantil <ArrowUpRight size={14} /></a><a href="/pegue-e-monte-goianesia">Pegue & Monte <ArrowUpRight size={14} /></a><a href="/aluguel-decoracao-goianesia">Aluguel de decoração <ArrowUpRight size={14} /></a></div>
        </div>
      </section>

      <section className="catalog-gateway" id="catalogo" aria-labelledby="catalogo-heading">
        <div className="catalog-gateway__art">
          {CATALOG_HERO_THEME && <img src={CATALOG_HERO_THEME.image} alt={`Decoração ${CATALOG_HERO_THEME.name} do acervo Jacque Pegue e Monte`} />}
          <span>Acervo com {CATALOG_THEMES.length} temas</span>
        </div>
        <div className="catalog-gateway__copy">
          <Eyebrow>Escolha sem pressa</Eyebrow>
          <h2 id="catalogo-heading">O catálogo completo<br />já está no <em>WhatsApp.</em></h2>
          <p>Confira todos os temas, veja as fotos do acervo e converse com a equipe sobre a sua data em um único lugar.</p>
          <ol className="catalog-gateway__steps"><li><span>01</span>Abra o catálogo completo.</li><li><span>02</span>Encontre a inspiração para a sua festa.</li><li><span>03</span>Chame a equipe para confirmar a data.</li></ol>
          <a className="button button--primary" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Ver catálogo no WhatsApp <ArrowUpRight size={18} /></a>
          <p className="catalog-gateway__note">Você será direcionada para o catálogo oficial da Jacque Pegue e Monte.</p>
        </div>
      </section>

      <section className="home-theme-preview" aria-labelledby="inspiracao-heading">
        <div className="section-intro"><Eyebrow>Um gostinho do acervo</Eyebrow><h2 id="inspiracao-heading">Páginas para se inspirar<br /><em>antes de escolher.</em></h2><p>Os destaques são escolhidos pela Jacque. Temas com página própria ajudam na inspiração; os demais levam você ao catálogo atualizado no WhatsApp.</p></div>
        <div className="home-theme-preview__grid">{homeThemePreview.map((theme) => { const hasPage = isThemePageAvailable(theme.name); return <a key={theme.name} className="home-theme-preview__card" href={getThemeDestination(theme.name)} target={hasPage ? undefined : "_blank"} rel={hasPage ? undefined : "noreferrer"}><img src={theme.image} alt={`Decoração ${theme.name} Pegue & Monte em Goianésia – GO`} loading="lazy" /><span><small>{theme.category}{hasPage ? "" : " · Catálogo"}</small><strong>{theme.name}</strong><ArrowUpRight size={17} /></span></a>; })}</div>
        <div className="home-theme-preview__actions"><a className="text-link" href="/festa-infantil-goianesia">Conheça as páginas de tema <ArrowUpRight size={17} /></a><a className="text-link" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Abrir todos os temas <ArrowUpRight size={17} /></a></div>
      </section>

      <section className="steps-section" id="como-funciona" aria-labelledby="como-heading">
        <div className="section-intro steps-heading">
          <Eyebrow>Sem complicação</Eyebrow>
          <h2 id="como-heading">Seu kit pronto para<br /><em>acompanhar a festa.</em></h2>
          <p>Um caminho simples, com clareza desde a escolha do tema até a devolução das peças.</p>
        </div>
        <div className="steps-list">
          {STEPS.map(([number, title, description]) => <article className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><ChevronRight size={22} className="step-arrow" /></article>)}
        </div>
      </section>

      <section className="services-section" id="diferenciais" aria-labelledby="diferenciais-heading">
        <div className="services-art" role="img" aria-label="Detalhes de uma decoração de festa elegante" />
        <div className="services-copy">
          <Eyebrow>Por que escolher a Jacque</Eyebrow>
          <h2 id="diferenciais-heading">Festa bonita não precisa ser <em>complicada.</em></h2>
          <p>Os nossos kits foram pensados para entregar praticidade de verdade, sem abrir mão do cuidado com cada detalhe do cenário.</p>
          <div className="benefit-grid">
            {BENEFITS.map(([title, text, index]) => <article key={title}><span>{index}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="cta-strip" aria-label="Chamada para orçamento">
        <div><PartyPopper size={29} /><p className="eyebrow eyebrow--light">Agenda aberta</p></div>
        <h2>Já imaginou o tema<br />da sua próxima festa?</h2>
        <a className="button button--light" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Abrir catálogo <MessageCircle size={18} /></a>
      </section>

      <section className="faq-contact" id="contato">
        <div className="faq-panel" aria-labelledby="faq-heading">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 id="faq-heading">Planeje com<br /><em>tranquilidade.</em></h2>
          <div className="faq-list">
            {FAQ_ITEMS.map(([question, answer], index) => (
              <article className={`faq-item${openFaq === index ? " faq-item--open" : ""}`} key={question}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} /></button>
                <div className="faq-answer"><p>{answer}</p></div>
              </article>
            ))}
          </div>
        </div>
        <aside className="contact-card" aria-label="Informações de contato">
          <p className="contact-card__label">Venha retirar seu kit</p>
          <h2>Jacque<br /><em>Pegue e Monte</em></h2>
          <p className="contact-card__intro">Em Goianésia, com atendimento próximo para fazer sua ideia acontecer.</p>
          <div className="contact-details">
            <a href="https://www.google.com/maps/search/?api=1&query=R.%2025,%20328,%20Centro,%20Goian%C3%A9sia,%20GO" target="_blank" rel="noreferrer"><MapPin size={19} /><span>R. 25, 328 — Centro<br />Goianésia — GO</span><ArrowUpRight size={16} /></a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer"><Phone size={18} /><span>(62) 98169-5886</span><ArrowUpRight size={16} /></a>
            <div><Clock3 size={18} /><span>Horários de retirada<br />confirmados no atendimento</span></div>
          </div>
          <a className="instagram-link" href="https://www.instagram.com/jacque_pegue_monte" target="_blank" rel="noreferrer"><Instagram size={18} /> @jacque_pegue_monte</a>
        </aside>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><BrandLockup /><p>Decoração para celebrar o que importa, com praticidade para você viver cada momento.</p></div>
          <div className="footer-links"><p>Navegue</p>{NAV_ITEMS.slice(1).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <div className="footer-links"><p>Atendimento</p><a href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Catálogo no WhatsApp</a><a href="https://www.instagram.com/jacque_pegue_monte" target="_blank" rel="noreferrer">Instagram</a><a href="#catalogo">Como consultar</a><a href="/admin/avaliacoes">Área administrativa</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Jacque Pegue e Monte. Goianésia — GO.</span><span>Feito para celebrar com leveza.</span></div>
      </footer>

      <a className="whatsapp-float" href={WHATSAPP} aria-label="Falar no WhatsApp" target="_blank" rel="noreferrer"><MessageCircle size={24} fill="currentColor" /></a>
    </main>
  );
}
