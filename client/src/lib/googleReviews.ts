export type GoogleReview = {
  id: string;
  reviewerName: string;
  reviewerPhotoUrl?: string;
  rating: number;
  comment: string;
  publishedAt: string;
  updatedAt?: string;
  reply?: string;
};

export type GoogleReviewsStatus = "not_connected" | "connected" | "loading" | "error";

export type GoogleReviewsState = {
  status: GoogleReviewsStatus;
  reviews: GoogleReview[];
  averageRating?: number;
  totalReviews?: number;
  lastSyncedAt?: string;
  errorMessage?: string;
};

/** Estado inicial seguro: nenhum depoimento é exibido antes da autorização e sincronização oficiais. */
export const EMPTY_GOOGLE_REVIEWS_STATE: GoogleReviewsState = {
  status: "not_connected",
  reviews: [],
};

export function formatReviewDate(value: string, locale = "pt-BR") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não disponível";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export function clampRating(rating: number) {
  return Math.min(5, Math.max(0, Math.round(rating * 10) / 10));
}

export type GoogleReviewsQueryData = {
  status: "not_connected" | "connected" | "error";
  reviews: Array<{
    reviewId: string;
    reviewerName: string;
    reviewerPhotoUrl?: string | null;
    rating: number;
    comment: string;
    publishedAt: Date | string;
    updatedAt?: Date | string | null;
    reply?: string | null;
  }>;
  averageRating?: number;
  totalReviews?: number;
  lastSyncedAt?: Date | string;
  errorMessage?: string;
};

export function buildGoogleReviewsState(data: GoogleReviewsQueryData | undefined, isLoading: boolean, isError: boolean): GoogleReviewsState {
  if (isLoading) return { ...EMPTY_GOOGLE_REVIEWS_STATE, status: "loading" };
  if (isError) return { status: "error", reviews: [], errorMessage: "Não foi possível consultar o estado da integração. Tente novamente." };
  if (!data) return EMPTY_GOOGLE_REVIEWS_STATE;
  return {
    status: data.status,
    reviews: data.reviews.map((review) => ({
      id: review.reviewId,
      reviewerName: review.reviewerName,
      reviewerPhotoUrl: review.reviewerPhotoUrl ?? undefined,
      rating: review.rating,
      comment: review.comment,
      publishedAt: review.publishedAt instanceof Date ? review.publishedAt.toISOString() : String(review.publishedAt),
      updatedAt: review.updatedAt ? (review.updatedAt instanceof Date ? review.updatedAt.toISOString() : String(review.updatedAt)) : undefined,
      reply: review.reply ?? undefined,
    })),
    averageRating: data.averageRating,
    totalReviews: data.totalReviews,
    lastSyncedAt: data.lastSyncedAt ? (data.lastSyncedAt instanceof Date ? data.lastSyncedAt.toISOString() : String(data.lastSyncedAt)) : undefined,
    errorMessage: data.errorMessage,
  };
}
