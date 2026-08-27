/**
 * Direção visual: celebração editorial suave — navegação leve, páginas claras e CTA
 * próximo para manter a continuidade entre descoberta, consulta e reserva.
 */
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { BUSINESS, WHATSAPP_CATALOG_URL } from "@/lib/business";

type PublicPageShellProps = {
  children: React.ReactNode;
};

export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div className="seo-page-shell">
      <header className="seo-header">
        <Link href="/" className="seo-brand" aria-label="Jacque Pegue e Monte — página inicial">
          <img src="https://lh3.googleusercontent.com/a-/ALV-UjV7qig-kmUwLvTwpBPFbRz_esDD-LUSO7TA0qlxRVrzZOCaTL9h=w1521" alt="Símbolo Jacque Pegue e Monte" />
          <span><strong>Jacque</strong><small>Pegue e Monte</small></span>
        </Link>
        <nav className="seo-nav" aria-label="Navegação das páginas">
          <Link href="/festa-infantil-goianesia">Festa infantil</Link>
          <Link href="/pegue-e-monte-goianesia">Pegue & Monte</Link>
          <Link href="/aluguel-decoracao-goianesia">Aluguel</Link>
          <Link href="/contato">Contato</Link>
        </nav>
        <a className="seo-header-cta" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Abrir catálogo <ArrowUpRight size={15} /></a>
      </header>
      {children}
      <footer className="seo-footer">
        <div><p className="seo-footer__brand">Jacque <em>Pegue & Monte</em></p><p>{BUSINESS.description}</p></div>
        <div className="seo-footer__links"><Link href="/sobre">Sobre</Link><Link href="/contato">Contato</Link><Link href="/blog">Conteúdos</Link><a href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">Ver catálogo</a><a href={BUSINESS.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
        <a className="seo-footer__whatsapp" href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Abrir catálogo</a>
      </footer>
    </div>
  );
}
