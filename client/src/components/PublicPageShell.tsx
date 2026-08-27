/**
 * Direção visual: celebração editorial suave — navegação leve, páginas claras e CTA
 * próximo para manter a continuidade entre descoberta, consulta e reserva.
 */
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { BUSINESS, WHATSAPP_URL } from "@/lib/business";

type PublicPageShellProps = {
  children: React.ReactNode;
};

export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div className="seo-page-shell">
      <header className="seo-header">
        <Link href="/" className="seo-brand" aria-label="Jacque Pegue e Monte — página inicial">
          <img src="/manus-storage/jacque-monogram_324287db.png" alt="Símbolo Jacque Pegue e Monte" />
          <span><strong>Jacque</strong><small>Pegue e Monte</small></span>
        </Link>
        <nav className="seo-nav" aria-label="Navegação das páginas">
          <Link href="/festa-infantil-goianesia">Festa infantil</Link>
          <Link href="/pegue-e-monte-goianesia">Pegue & Monte</Link>
          <Link href="/aluguel-decoracao-goianesia">Aluguel</Link>
          <Link href="/contato">Contato</Link>
        </nav>
        <a className="seo-header-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Consultar disponibilidade <ArrowUpRight size={15} /></a>
      </header>
      {children}
      <footer className="seo-footer">
        <div><p className="seo-footer__brand">Jacque <em>Pegue & Monte</em></p><p>{BUSINESS.description}</p></div>
        <div className="seo-footer__links"><Link href="/sobre">Sobre</Link><Link href="/contato">Contato</Link><Link href="/blog">Conteúdos</Link><Link href="/#temas">Ver temas</Link><a href={BUSINESS.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
        <a className="seo-footer__whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Falar pelo WhatsApp</a>
      </footer>
    </div>
  );
}
