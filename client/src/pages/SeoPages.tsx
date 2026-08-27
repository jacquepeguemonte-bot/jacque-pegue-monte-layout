/**
 * Direção visual: celebração editorial suave — conteúdo local legível, fotos reais
 * do acervo e CTAs objetivos para transformar interesse em conversa.
 */
import { ArrowRight, CheckCircle2, ChevronRight, MapPin, MessageCircle, PackageCheck, Phone, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { PageMeta } from "@/components/PageMeta";
import { PublicPageShell } from "@/components/PublicPageShell";
import { CATALOG_THEMES } from "@/data/catalogThemes";
import { BUSINESS, getThemePath, PRIORITY_THEME_ROUTES, slugify, WHATSAPP_CATALOG_URL, WHATSAPP_URL } from "@/lib/business";

type ServiceKey = "festa-infantil" | "pegue-e-monte" | "aluguel" | "decoracao";

const serviceContent: Record<ServiceKey, { title: string; description: string; eyebrow: string; h1: string; lead: string; points: string[] }> = {
  "festa-infantil": {
    title: "Festa Infantil em Goianésia – GO | Jacque Pegue & Monte",
    description: "Festa infantil em Goianésia – GO com kits de decoração para retirar, montar e comemorar. Conheça os temas da Jacque Pegue & Monte.",
    eyebrow: "Festas infantis em Goianésia",
    h1: "Festa Infantil em Goianésia: Escolha o Tema e Monte Você Mesmo",
    lead: "Encontre um tema que combine com a sua comemoração, consulte a disponibilidade e retire o kit para montar a festa do seu jeito.",
    points: ["Temas infantis para aniversários e comemorações em família.", "Retirada e devolução combinadas diretamente no atendimento.", "Orientação para organizar o kit e montar com praticidade."],
  },
  "pegue-e-monte": {
    title: "Pegue & Monte em Goianésia – Decoração de Festas",
    description: "Pegue & Monte em Goianésia: escolha seu tema, reserve, retire o kit, monte a decoração e devolva conforme a locação.",
    eyebrow: "Como funciona",
    h1: "Pegue & Monte em Goianésia – Decoração de Festas",
    lead: "Um jeito prático de preparar sua decoração: você escolhe o tema, confirma a data, retira o kit e monta o cenário para celebrar.",
    points: ["Escolha o tema que conversa com a ocasião.", "Consulte a disponibilidade antes de reservar.", "Retire, monte, celebre e devolva conforme o atendimento."],
  },
  aluguel: {
    title: "Aluguel de Decoração para Festas em Goianésia – GO",
    description: "Aluguel de decoração para festas em Goianésia – GO. Veja temas e consulte a disponibilidade de kits Pegue & Monte.",
    eyebrow: "Aluguel de decoração",
    h1: "Aluguel de Decoração para Festas em Goianésia – GO",
    lead: "A Jacque Pegue & Monte oferece kits de decoração para festas infantis, aniversários, chá revelação e outras comemorações em Goianésia.",
    points: ["Kits de decoração para diferentes momentos e estilos de celebração.", "Imagens reais para ajudar na escolha do tema.", "Atendimento direto para alinhar disponibilidade e retirada."],
  },
  decoracao: {
    title: "Decoração de Festa em Goianésia – GO | Jacque Pegue & Monte",
    description: "Decoração de festa em Goianésia – GO com o modelo Pegue & Monte: kits para retirar, montar e celebrar com praticidade.",
    eyebrow: "Decoração de festas",
    h1: "Decoração de Festa em Goianésia – GO",
    lead: "Para aniversário, festa infantil, chá revelação e outras comemorações, você escolhe um kit, fala com a equipe e organiza a decoração com autonomia.",
    points: ["Temas para diferentes faixas etárias e tipos de evento.", "Modelo Pegue & Monte com atendimento local em Goianésia.", "Catálogo organizado para você visualizar e consultar o tema ideal."],
  },
};

const processSteps = ["Escolha o tema", "Verifique a disponibilidade", "Reserve com a equipe", "Retire o kit", "Monte a decoração", "Realize a festa", "Devolva conforme combinado"];

function PageHero({ eyebrow, title, lead, image }: { eyebrow: string; title: string; lead: string; image?: string }) {
  return <section className="seo-hero"><div className="seo-hero__glow" /><div className="seo-content seo-hero__layout"><div className="seo-hero__copy"><p className="seo-eyebrow"><Sparkles size={14} />{eyebrow}</p><h1>{title}</h1><p>{lead}</p><div className="seo-hero__actions"><a className="seo-button seo-button--primary" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Abrir catálogo <MessageCircle size={17} /></a><Link className="seo-button seo-button--secondary" href="/">Conhecer a Jacque <ArrowRight size={17} /></Link></div></div>{image && <figure className="seo-hero__photo"><img src={image} alt="Kit de decoração Jacque Pegue e Monte em Goianésia – GO" /></figure>}</div></section>;
}

function PriorityThemes() {
  const priorityThemes = PRIORITY_THEME_ROUTES.map((route) => CATALOG_THEMES.find((theme) => slugify(theme.name) === route.slug)).filter(Boolean);
  return <section className="seo-priority"><div className="seo-content"><p className="seo-eyebrow">Temas em destaque</p><h2>Comece por um tema<br /><em>que a criança já ama.</em></h2><div className="seo-priority__grid">{priorityThemes.map((theme) => theme && <Link key={theme.name} href={getThemePath(slugify(theme.name))} className="seo-priority__card"><img src={theme.image} alt={`Decoração ${theme.name} Pegue & Monte em Goianésia – GO`} loading="lazy" /><span>{theme.name}<ChevronRight size={16} /></span></Link>)}</div><a href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer" className="seo-text-link">Explorar todos os temas <ArrowRight size={16} /></a></div></section>;
}

export function ServicePage({ kind }: { kind: ServiceKey }) {
  const content = serviceContent[kind];
  const heroSlugs: Record<ServiceKey, string> = { "festa-infantil": "princesas", "pegue-e-monte": "fazendinha", aluguel: "jardim-encantado", decoracao: "hot-wheels" };
  const heroTheme = CATALOG_THEMES.find((theme) => slugify(theme.name) === heroSlugs[kind]);
  return <PublicPageShell><PageMeta title={content.title} description={content.description} /><PageHero eyebrow={content.eyebrow} title={content.h1} lead={content.lead} image={heroTheme?.image} /><section className="seo-split"><div className="seo-content seo-split__grid"><div><p className="seo-eyebrow">Uma escolha mais simples</p><h2>Praticidade para montar<br /><em>uma festa com a sua cara.</em></h2><p className="seo-body">{BUSINESS.description}</p></div><div className="seo-check-list">{content.points.map((point) => <p key={point}><CheckCircle2 size={18} />{point}</p>)}</div></div></section>{kind === "pegue-e-monte" && <section className="seo-process"><div className="seo-content"><p className="seo-eyebrow">Passo a passo</p><h2>Você escolhe. A gente<br /><em>orienta o caminho.</em></h2><ol>{processSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol></div></section>}<PriorityThemes /><section className="seo-cta"><div className="seo-content"><PackageCheck size={31} /><h2>Encontrou um tema<br /><em>para a sua data?</em></h2><p>Fale com a equipe para confirmar a disponibilidade e organizar sua retirada.</p><a className="seo-button seo-button--light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Consultar disponibilidade <MessageCircle size={17} /></a></div></section></PublicPageShell>;
}

export function AboutPage() {
  const heroTheme = CATALOG_THEMES.find((theme) => slugify(theme.name) === "jardim-encantado");
  return <PublicPageShell><PageMeta title="Sobre a Jacque Pegue & Monte | Goianésia – GO" description="Conheça a Jacque Pegue & Monte, empresa de aluguel de kits de decoração para festas em Goianésia – GO." /><PageHero eyebrow="Sobre a Jacque" title="Jacque Pegue & Monte — Decoração de Festas em Goianésia" lead={BUSINESS.description} image={heroTheme?.image} /><section className="seo-split"><div className="seo-content seo-split__grid"><div><p className="seo-eyebrow">O modelo Pegue & Monte</p><h2>Você cuida do momento.<br /><em>O kit acompanha.</em></h2><p className="seo-body">A proposta é oferecer opções para você escolher o tema, conversar com a equipe, retirar o kit e organizar sua comemoração com autonomia.</p></div><div className="seo-check-list"><p><CheckCircle2 size={18} />Atendimento local em {BUSINESS.location}.</p><p><CheckCircle2 size={18} />Acervo com temas para diferentes comemorações.</p><p><CheckCircle2 size={18} />Informações de retirada e devolução alinhadas no atendimento.</p></div></div></section><PriorityThemes /></PublicPageShell>;
}

export function BlogIndexPage() {
  const heroTheme = CATALOG_THEMES.find((theme) => slugify(theme.name) === "jardim-encantado");
  return <PublicPageShell><PageMeta title="Conteúdos sobre festas em Goianésia | Jacque Pegue & Monte" description="Conteúdos em preparação sobre festas, temas e o modelo Pegue & Monte em Goianésia – GO." /><PageHero eyebrow="Conteúdos da Jacque" title="Ideias para escolher, planejar e celebrar." lead="Estamos preparando conteúdos úteis sobre temas, organização da festa e o modelo Pegue & Monte. Enquanto isso, o catálogo e a equipe estão prontos para ajudar na sua escolha." image={heroTheme?.image} /><section className="seo-split"><div className="seo-content seo-split__grid"><div><p className="seo-eyebrow">Em preparação</p><h2>Conteúdo útil,<br /><em>sem encher a sua festa de dúvida.</em></h2><p className="seo-body">Os próximos conteúdos vão responder perguntas reais sobre como escolher o tema, organizar a retirada e montar uma decoração com praticidade.</p></div><div className="seo-check-list"><p><CheckCircle2 size={18} />Como escolher um tema para festa infantil.</p><p><CheckCircle2 size={18} />Como funciona o modelo Pegue & Monte.</p><p><CheckCircle2 size={18} />Ideias para comemorações em Goianésia.</p></div></div></section><PriorityThemes /></PublicPageShell>;
}

export function ContactPage() {
  const heroTheme = CATALOG_THEMES.find((theme) => slugify(theme.name) === "cha-de-revelacao");
  const mapQuery = encodeURIComponent(BUSINESS.mapAddress);
  return <PublicPageShell><PageMeta title="Contato | Jacque Pegue & Monte – Goianésia – GO" description="Entre em contato com a Jacque Pegue & Monte em Goianésia – GO para consultar a disponibilidade dos kits de decoração." /><PageHero eyebrow="Contato" title="Entre em Contato com a Jacque Pegue & Monte" lead="Consulte a disponibilidade do tema para sua data, tire dúvidas e combine os detalhes da retirada diretamente com a equipe." image={heroTheme?.image} /><section className="seo-contact"><div className="seo-content seo-contact__grid"><div className="seo-contact__details"><p className="seo-eyebrow">Atendimento em Goianésia</p><h2>Vamos falar sobre<br /><em>a sua comemoração?</em></h2><a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer"><MapPin size={20} /><span>{BUSINESS.address}</span><ArrowRight size={16} /></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Phone size={19} /><span>{BUSINESS.phoneLabel}</span><ArrowRight size={16} /></a><p className="seo-contact__hours">Os horários de atendimento e retirada são confirmados diretamente com a equipe.</p><a className="seo-button seo-button--primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Falar pelo WhatsApp <MessageCircle size={17} /></a></div><div className="seo-map"><iframe title="Mapa da Jacque Pegue e Monte em Goianésia" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div></section></PublicPageShell>;
}

export function ThemeDetailPage({ themeSlug }: { themeSlug: string }) {
  const theme = CATALOG_THEMES.find((item) => slugify(item.name) === themeSlug);
  if (!theme) return <PublicPageShell><PageMeta title="Tema não encontrado | Jacque Pegue & Monte" description="Conheça os temas disponíveis da Jacque Pegue & Monte em Goianésia – GO." /><section className="seo-empty"><div className="seo-content"><h1>Esse tema não está disponível nesta página.</h1><p>Veja o catálogo atualizado ou fale com a equipe para consultar a opção que procura.</p><a className="seo-button seo-button--primary" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Ver catálogo</a></div></section></PublicPageShell>;
  const related = CATALOG_THEMES.filter((item) => item.category === theme.category && item.name !== theme.name).slice(0, 3);
  const title = `Decoração ${theme.name} em Goianésia – GO | Jacque Pegue & Monte`;
  return <PublicPageShell><PageMeta title={title} description={`Decoração ${theme.name} Pegue & Monte em Goianésia – GO. Consulte a disponibilidade do kit para sua comemoração.`} /><section className="theme-detail"><div className="theme-detail__image"><img src={theme.image} alt={`Decoração ${theme.name} Pegue & Monte para festa em Goianésia – GO`} /></div><div className="theme-detail__copy"><p className="seo-eyebrow">Tema {theme.category}</p><h1>Decoração {theme.name}<br /><em>em Goianésia – GO</em></h1><p>Um tema do acervo Jacque Pegue & Monte para você consultar, retirar e montar na sua celebração.</p><a className="seo-button seo-button--primary" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Ver no catálogo completo <MessageCircle size={17} /></a><a className="seo-text-link" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Ver todos os temas <ArrowRight size={16} /></a></div></section><section className="seo-split theme-detail__info"><div className="seo-content seo-split__grid"><div><p className="seo-eyebrow">Como reservar</p><h2>Confirme a data e<br /><em>organize sua retirada.</em></h2><p className="seo-body">A disponibilidade e a composição do kit são confirmadas diretamente no atendimento, conforme a data da sua comemoração.</p></div><div className="seo-check-list"><p><CheckCircle2 size={18} />Consulte a disponibilidade para a data desejada.</p><p><CheckCircle2 size={18} />Alinhe retirada, devolução e as orientações com a equipe.</p><p><CheckCircle2 size={18} />Use a foto real do tema para planejar seu cenário.</p></div></div></section><section className="seo-related"><div className="seo-content"><p className="seo-eyebrow">Você também pode gostar</p><h2>Mais temas para<br /><em>continuar explorando.</em></h2><div className="seo-related__grid">{related.map((item) => <article key={item.name}><img src={item.image} alt={`Decoração ${item.name} em Goianésia – GO`} loading="lazy" /><h3>{item.name}</h3><Link href={getThemePath(slugify(item.name))}>Ver este tema <ArrowRight size={15} /></Link></article>)}</div></div></section></PublicPageShell>;
}
