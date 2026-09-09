import { describe, expect, it } from "vitest";

describe("Google OAuth redirect origin", () => {
  it("uses the public site origin configured for the callback", () => {
    const origin = process.env.GOOGLE_OAUTH_REDIRECT_ORIGIN;
    expect(origin).toBe("https://jacquelayout-5igykiqe.manus.space");
    expect(`${origin}/api/google/oauth/callback`).toBe(
      "https://jacquelayout-5igykiqe.manus.space/api/google/oauth/callback",
    );
  });
});
