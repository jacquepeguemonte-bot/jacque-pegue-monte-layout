import { describe, expect, it } from "vitest";
import { buildGoogleReviewsState, clampRating, EMPTY_GOOGLE_REVIEWS_STATE, formatReviewDate } from "./googleReviews";

describe("googleReviews", () => {
  it("starts disconnected without fabricated reviews", () => {
    expect(EMPTY_GOOGLE_REVIEWS_STATE.status).toBe("not_connected");
    expect(EMPTY_GOOGLE_REVIEWS_STATE.reviews).toEqual([]);
    expect(EMPTY_GOOGLE_REVIEWS_STATE.averageRating).toBeUndefined();
  });

  it("clamps ratings to the Google five-star range", () => {
    expect(clampRating(-1)).toBe(0);
    expect(clampRating(4.46)).toBe(4.5);
    expect(clampRating(9)).toBe(5);
  });

  it("formats valid review dates and handles invalid values", () => {
    expect(formatReviewDate("2026-08-28T12:00:00.000Z")).toMatch(/2026/);
    expect(formatReviewDate("not-a-date")).toBe("Data não disponível");
  });

  it("maps loading and error query states without creating review content", () => {
    expect(buildGoogleReviewsState(undefined, true, false).status).toBe("loading");
    expect(buildGoogleReviewsState(undefined, false, true).status).toBe("error");
    expect(buildGoogleReviewsState(undefined, false, true).reviews).toEqual([]);
  });

  it("preserves a connected state without inventing review content", () => {
    const state = buildGoogleReviewsState({
      status: "connected",
      totalReviews: 0,
      reviews: [],
    }, false, false);

    expect(state.status).toBe("connected");
    expect(state.totalReviews).toBe(0);
    expect(state.reviews).toEqual([]);
  });
});
