import React from "react";
import { AlertCircle, CheckCircle2, Clock3, ExternalLink, Loader2, LockKeyhole, MessageSquareQuote, RefreshCw, ShieldCheck, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { buildGoogleReviewsState, clampRating, formatReviewDate, type GoogleReviewsState } from "@/lib/googleReviews";
import { trpc } from "@/lib/trpc";

const GOOGLE_PROFILE_HELP_URL = "https://support.google.com/business/answer/3474122";

function ReviewStars({ rating }: { rating: number }) {
  const safeRating = clampRating(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${safeRating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`h-4 w-4 ${index + 1 <= safeRating ? "fill-[#e83d71] text-[#e83d71]" : "text-[#decbd1]"}`} />
      ))}
    </span>
  );
}

function ConnectionNotice({ onRefresh, isRefreshing, status, lastSyncedAt }: { onRefresh: () => void; isRefreshing: boolean; status: GoogleReviewsState["status"]; lastSyncedAt?: string }) {
  const statusCopy = {
    not_connected: { label: "Aguardando conexão", title: "As avaliações aparecerão aqui", description: "Esta interface está pronta para receber avaliações reais depois que o Google Business Profile for autorizado e sincronizado.", icon: Clock3 },
    loading: { label: "Consultando integração", title: "Verificando avaliações", description: "Estamos consultando o estado salvo da integração oficial do Google Business Profile.", icon: RefreshCw },
    connected: { label: "Conectado", title: "Avaliações sincronizadas", description: lastSyncedAt ? `Última sincronização em ${formatReviewDate(lastSyncedAt)}.` : "A integração oficial está conectada e pronta para exibir avaliações recebidas.", icon: CheckCircle2 },
    error: { label: "Atenção necessária", title: "Não foi possível sincronizar", description: "A integração retornou um erro. Verifique a autorização do Google e tente novamente.", icon: AlertCircle },
  }[status];
  const StatusIcon = statusCopy.icon;
  return (
    <div className="rounded-[26px] border border-[#eddfe2] bg-white p-6 shadow-[0_12px_30px_rgba(94,54,70,.08)] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff0f4] text-[#e83d71]"><ShieldCheck className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#d53b6a]">Integração preparada</p>
            <h2 className="mt-2 font-serif text-3xl text-[#30262b]">{statusCopy.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#76666d]">{statusCopy.description} {status === "not_connected" && "Nenhuma avaliação é exibida antes da conexão oficial."}</p>
          </div>
        </div>
        <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${status === "error" ? "bg-[#fff0f4] text-[#a92d56]" : status === "connected" ? "bg-[#eefaf3] text-[#2f7c4b]" : "bg-[#f7f1ed] text-[#78686e]"}`}><StatusIcon className={`h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`} /> {statusCopy.label}</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["1", "Autorizar", "Conta proprietária do perfil"],
          ["2", "Sincronizar", "Avaliações retornadas pela API"],
          ["3", "Revisar", "Conteúdo pronto para conferência"],
        ].map(([number, title, description]) => <div key={number} className="rounded-2xl border border-[#f0e5e7] bg-[#fffaf8] p-4"><span className="text-xs font-black text-[#e83d71]">{number}</span><strong className="mt-2 block text-sm text-[#4a3940]">{title}</strong><span className="mt-1 block text-xs leading-5 text-[#8a777e]">{description}</span></div>)}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {status !== "connected" && <a href="/api/google/connect" className="inline-flex h-10 items-center justify-center rounded-full bg-[#e83d71] px-5 text-sm font-bold text-white transition hover:bg-[#c62f5d]">Autorizar Google</a>}
        <Button type="button" variant="outline" className="rounded-full border-[#e5d5da] text-[#5d4e54]" onClick={onRefresh} disabled={isRefreshing}><RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />{isRefreshing ? "Verificando..." : status === "connected" ? "Atualizar avaliações" : "Verificar conexão"}</Button>
        <a href={GOOGLE_PROFILE_HELP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-2 text-sm font-bold text-[#d43a68] hover:underline">Ajuda do Google <ExternalLink className="h-3.5 w-3.5" /></a>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: NonNullable<GoogleReviewsState["reviews"]>[number] }) {
  return <article className="rounded-[24px] border border-[#eddfe2] bg-white p-5 shadow-[0_8px_22px_rgba(94,54,70,.06)]"><div className="flex items-start justify-between gap-4"><div><strong className="text-sm text-[#4a3940]">{review.reviewerName}</strong><p className="mt-1 text-xs text-[#9a858d]">{formatReviewDate(review.publishedAt)}</p></div><ReviewStars rating={review.rating} /></div><p className="mt-4 text-sm leading-6 text-[#63545b]">{review.comment}</p>{review.reply && <div className="mt-4 rounded-2xl bg-[#fffaf8] p-4"><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#d53b6a]">Resposta da empresa</p><p className="mt-2 text-sm leading-6 text-[#76666d]">{review.reply}</p></div>}</article>;
}

export function AdminReviewsPage() {
  const { user, loading } = useAuth();
  const reviewsQuery = trpc.googleReviews.adminData.useQuery(undefined, {
    enabled: Boolean(user && user.role === "admin"),
    refetchOnWindowFocus: false,
  });
  const reviewsState = buildGoogleReviewsState(reviewsQuery.data, reviewsQuery.isLoading, reviewsQuery.isError);
  const checkConnection = () => { void reviewsQuery.refetch(); };
  const isRefreshing = reviewsQuery.isFetching;

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#fffaf8] text-[#5b454e]"><Loader2 className="h-7 w-7 animate-spin text-[#e83d71]" /></div>;
  if (!user) return <section className="grid min-h-screen place-items-center bg-[#fffaf8] p-6"><div className="max-w-md rounded-[28px] border border-[#eddfe2] bg-white p-8 text-center shadow-[0_18px_45px_rgba(94,54,70,.12)]"><LockKeyhole className="mx-auto mb-4 h-8 w-8 text-[#e83d71]" /><h1 className="font-serif text-3xl text-[#30262b]">Área administrativa</h1><p className="mt-3 text-sm leading-6 text-[#76666d]">Entre com a conta autorizada para consultar as avaliações da empresa.</p><button className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#e83d71] px-5 text-sm font-bold text-white transition hover:bg-[#c62f5d]" onClick={startLogin}>Entrar para administrar</button></div></section>;
  if (user.role !== "admin") return <section className="grid min-h-screen place-items-center bg-[#fffaf8] p-6"><div className="max-w-md rounded-[28px] border border-[#eddfe2] bg-white p-8 text-center shadow-[0_18px_45px_rgba(94,54,70,.12)]"><LockKeyhole className="mx-auto mb-4 h-8 w-8 text-[#e83d71]" /><h1 className="font-serif text-3xl text-[#30262b]">Acesso restrito</h1><p className="mt-3 text-sm leading-6 text-[#76666d]">Esta conta não tem permissão para consultar avaliações.</p></div></section>;

  const hasReviews = reviewsState.status === "connected" && reviewsState.reviews.length > 0;
  return <DashboardLayout><section className="mx-auto w-full max-w-6xl pb-12"><div className="rounded-[30px] bg-[#35262d] px-6 py-8 text-white shadow-[0_18px_45px_rgba(54,35,44,.16)] sm:px-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#ffb4cb]"><MessageSquareQuote className="h-4 w-4" /> Reputação da empresa</p><h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Avaliações do Google</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Área interna para acompanhar avaliações reais do Perfil da Empresa, após a autorização oficial do Google.</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><strong className="block text-xl">{reviewsState.totalReviews ?? "—"}</strong><span className="text-white/65">avaliações sincronizadas</span></div></div></div><div className="mt-7"><ConnectionNotice onRefresh={checkConnection} isRefreshing={isRefreshing} status={reviewsState.status} lastSyncedAt={reviewsState.lastSyncedAt} /></div>{hasReviews && <><div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-[22px] border border-[#eddfe2] bg-white p-5"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#9a858d]">Nota média</span><strong className="mt-2 block font-serif text-4xl text-[#30262b]">{reviewsState.averageRating?.toFixed(1)}</strong><ReviewStars rating={reviewsState.averageRating ?? 0} /></div><div className="rounded-[22px] border border-[#eddfe2] bg-white p-5"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#9a858d]">Última sincronização</span><strong className="mt-2 block text-lg text-[#4a3940]">{reviewsState.lastSyncedAt ? formatReviewDate(reviewsState.lastSyncedAt) : "—"}</strong></div><div className="rounded-[22px] border border-[#eddfe2] bg-white p-5"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#9a858d]">Origem</span><strong className="mt-2 block text-lg text-[#4a3940]">Google Business Profile</strong></div></div><div className="mt-7 grid gap-4 md:grid-cols-2">{reviewsState.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div></>}{reviewsState.status === "loading" && <div className="mt-7 rounded-[26px] border border-[#eddfe2] bg-white p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-[#e83d71]" /><p className="mt-3 text-sm text-[#76666d]">Consultando o estado da integração...</p></div>}{reviewsState.status === "error" && <div className="mt-7 flex gap-3 rounded-2xl border border-[#f3c9d4] bg-[#fff0f4] p-5 text-sm text-[#a92d56]"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><p>{reviewsState.errorMessage ?? "Não foi possível consultar as avaliações. Verifique a conexão do Google e tente novamente."}</p></div>}{!hasReviews && (reviewsState.status === "not_connected" || reviewsState.status === "connected") && <div className="mt-7 rounded-[26px] border border-dashed border-[#dfcdd3] bg-[#fffaf8] p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-[#cdb6be]" /><h2 className="mt-3 font-serif text-2xl text-[#4a3940]">Nenhuma avaliação disponível para exibir</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8a777e]">Quando a integração oficial estiver autorizada e houver avaliações retornadas pelo Google, elas serão exibidas nesta área. O estado atual não contém dados de demonstração.</p></div>}</section></DashboardLayout>;
}
