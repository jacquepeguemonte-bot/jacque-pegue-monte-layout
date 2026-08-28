import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { getGoogleReviewsAdminData, listThemeHighlights, replaceThemeHighlights } from "./db";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

const themeSlug = z.string().min(1).max(128).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  themeHighlights: router({
    list: publicProcedure.query(() => listThemeHighlights()),
    replace: adminProcedure.input(z.object({
      themeSlugs: z.array(themeSlug).max(12).refine((slugs) => new Set(slugs).size === slugs.length, "Não repita um tema na seleção."),
    })).mutation(({ input }) => replaceThemeHighlights(input.themeSlugs)),
  }),
  googleReviews: router({
    adminData: adminProcedure.query(() => getGoogleReviewsAdminData()),
  }),
});

export type AppRouter = typeof appRouter;
