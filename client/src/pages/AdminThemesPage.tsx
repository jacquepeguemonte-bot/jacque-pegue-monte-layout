/** Gestão interna: seleção editorial dos temas mais visíveis na experiência pública. */
import { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, Loader2, LockKeyhole, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { CATALOG_THEMES } from "@/data/catalogThemes";
import { DEFAULT_FEATURED_THEME_SLUGS, getThemeDestination, isThemePageAvailable, slugify } from "@/lib/business";
import { trpc } from "@/lib/trpc";

const MAX_HIGHLIGHTS = 12;

export function AdminThemesPage() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const highlightsQuery = trpc.themeHighlights.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const saveHighlights = trpc.themeHighlights.replace.useMutation({
    onSuccess: (data) => {
      setSelectedSlugs(data.map((item) => item.themeSlug));
      void utils.themeHighlights.list.invalidate();
      toast.success("Temas em destaque atualizados.");
    },
    onError: () => toast.error("Não foi possível salvar os destaques. Tente novamente."),
  });
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([...DEFAULT_FEATURED_THEME_SLUGS]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || highlightsQuery.isLoading) return;
    const savedSlugs = (highlightsQuery.data ?? []).map((item) => item.themeSlug);
    setSelectedSlugs(savedSlugs.length > 0 ? savedSlugs : [...DEFAULT_FEATURED_THEME_SLUGS]);
    setInitialized(true);
  }, [highlightsQuery.data, highlightsQuery.isLoading, initialized]);

  const selectedSet = useMemo(() => new Set(selectedSlugs), [selectedSlugs]);
  const toggleTheme = (themeSlug: string) => {
    if (selectedSet.has(themeSlug)) {
      setSelectedSlugs((current) => current.filter((slug) => slug !== themeSlug));
      return;
    }
    if (selectedSlugs.length >= MAX_HIGHLIGHTS) {
      toast.error(`Escolha no máximo ${MAX_HIGHLIGHTS} temas em destaque.`);
      return;
    }
    setSelectedSlugs((current) => [...current, themeSlug]);
  };

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#fffaf8] text-[#5b454e]"><Loader2 className="h-7 w-7 animate-spin text-[#e83d71]" /></div>;
  if (!user) return <section className="grid min-h-screen place-items-center bg-[#fffaf8] p-6"><div className="max-w-md rounded-[28px] border border-[#eddfe2] bg-white p-8 text-center shadow-[0_18px_45px_rgba(94,54,70,.12)]"><LockKeyhole className="mx-auto mb-4 h-8 w-8 text-[#e83d71]" /><h1 className="font-serif text-3xl text-[#30262b]">Área administrativa</h1><p className="mt-3 text-sm leading-6 text-[#76666d]">Entre com a conta autorizada para escolher quais temas aparecem em destaque no site.</p><button className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#e83d71] px-5 text-sm font-bold text-white transition hover:bg-[#c62f5d]" onClick={startLogin}>Entrar para administrar</button></div></section>;
  if (user.role !== "admin") return <section className="grid min-h-screen place-items-center bg-[#fffaf8] p-6"><div className="max-w-md rounded-[28px] border border-[#eddfe2] bg-white p-8 text-center shadow-[0_18px_45px_rgba(94,54,70,.12)]"><LockKeyhole className="mx-auto mb-4 h-8 w-8 text-[#e83d71]" /><h1 className="font-serif text-3xl text-[#30262b]">Acesso restrito</h1><p className="mt-3 text-sm leading-6 text-[#76666d]">Esta conta não tem permissão para alterar os destaques. Entre com a conta proprietária do projeto.</p></div></section>;

  return <DashboardLayout><section className="mx-auto w-full max-w-6xl pb-12"><div className="rounded-[30px] bg-[#35262d] px-6 py-8 text-white shadow-[0_18px_45px_rgba(54,35,44,.16)] sm:px-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#ffb4cb]"><Sparkles className="h-4 w-4" /> Curadoria da vitrine</p><h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Temas em destaque</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Selecione até {MAX_HIGHLIGHTS} temas para aparecer primeiro no site. Quando um tema não possui página própria, o clique leva ao catálogo oficial no WhatsApp.</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><strong className="block text-xl">{selectedSlugs.length}/{MAX_HIGHLIGHTS}</strong><span className="text-white/65">selecionados</span></div></div></div><div className="mt-7 flex flex-col gap-4 rounded-[26px] border border-[#eddfe2] bg-white p-5 shadow-[0_12px_30px_rgba(94,54,70,.08)] sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-2xl text-[#30262b]">Escolha editorial</h2><p className="mt-1 text-sm text-[#76666d]">Páginas próprias estão disponíveis para os 12 temas definidos na estratégia de SEO.</p></div><button type="button" onClick={() => saveHighlights.mutate({ themeSlugs: selectedSlugs })} disabled={saveHighlights.isPending || selectedSlugs.length === 0} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#e83d71] px-5 text-sm font-bold text-white transition hover:bg-[#c62f5d] disabled:cursor-not-allowed disabled:opacity-60"><Save className="h-4 w-4" />{saveHighlights.isPending ? "Salvando..." : "Salvar destaques"}</button></div>{highlightsQuery.isError && <p className="mt-4 rounded-xl bg-[#fff0f4] px-4 py-3 text-sm text-[#a92d56]">Não foi possível carregar a seleção salva. A seleção recomendada continua visível e poderá ser salva novamente.</p>}<div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{CATALOG_THEMES.map((theme) => { const themeSlug = slugify(theme.name); const isSelected = selectedSet.has(themeSlug); const hasPage = isThemePageAvailable(theme.name); return <article key={theme.name} className={`overflow-hidden rounded-[24px] border bg-white transition ${isSelected ? "border-[#e83d71] shadow-[0_10px_26px_rgba(232,61,113,.17)]" : "border-[#eddfe2] shadow-[0_8px_22px_rgba(94,54,70,.07)]"}`}><img className="h-44 w-full object-cover" src={theme.image} alt="" loading="lazy" /><div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#d53b6a]">{theme.category}</p><h3 className="mt-1 font-serif text-2xl leading-none text-[#30262b]">{theme.name}</h3></div><button type="button" onClick={() => toggleTheme(themeSlug)} aria-pressed={isSelected} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${isSelected ? "border-[#e83d71] bg-[#e83d71] text-white" : "border-[#dfcdd3] text-[#b49ba4] hover:border-[#e83d71] hover:text-[#e83d71]"}`} aria-label={`${isSelected ? "Remover" : "Adicionar"} ${theme.name} dos destaques`}><Check className="h-4 w-4" /></button></div><div className="mt-4 flex items-center justify-between gap-3 text-xs"><span className={`rounded-full px-2.5 py-1 font-bold ${hasPage ? "bg-[#fff0f4] text-[#bf315c]" : "bg-[#f7f1ed] text-[#78686e]"}`}>{hasPage ? "Página própria" : "Direciona ao WhatsApp"}</span><a href={getThemeDestination(theme.name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#d43a68] hover:underline">Testar <ExternalLink className="h-3.5 w-3.5" /></a></div></div></article>; })}</div></section></DashboardLayout>;
}
