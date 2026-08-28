import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("@/const", () => ({ startLogin: vi.fn() }));
vi.mock("@/components/DashboardLayout", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock("@/components/ui/button", () => ({ Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <button {...props}>{children}</button> }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    googleReviews: {
      adminData: { useQuery: vi.fn() },
    },
  },
}));

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { AdminReviewsPage } from "./AdminReviewsPage";

const adminUser = { id: 1, role: "admin" as const };
const useAuthMock = vi.mocked(useAuth);
const useQueryMock = vi.mocked(trpc.googleReviews.adminData.useQuery);

function renderWithQuery(query: Record<string, unknown>) {
  useAuthMock.mockReturnValue({ user: adminUser, loading: false, error: null, isAuthenticated: true, logout: vi.fn() } as never);
  useQueryMock.mockReturnValue(query as never);
  return renderToStaticMarkup(<AdminReviewsPage />);
}

describe("AdminReviewsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the disconnected state without fabricated reviews", () => {
    const html = renderWithQuery({ isLoading: false, isError: false, isFetching: false, data: { status: "not_connected", reviews: [] }, refetch: vi.fn() });
    expect(html).toContain("Aguardando conexão");
    expect(html).toContain("Nenhuma avaliação disponível para exibir");
    expect(html).not.toContain("Cliente autorizado");
  });

  it("renders the error state with an actionable status", () => {
    const html = renderWithQuery({ isLoading: false, isError: true, isFetching: false, data: undefined, refetch: vi.fn() });
    expect(html).toContain("Atenção necessária");
    expect(html).toContain("Não foi possível consultar");
  });

  it("renders the connected state without claiming reviews exist when the list is empty", () => {
    const html = renderWithQuery({ isLoading: false, isError: false, isFetching: false, data: { status: "connected", reviews: [], totalReviews: 0 }, refetch: vi.fn() });
    expect(html).toContain("Conectado");
    expect(html).toContain("Atualizar avaliações");
    expect(html).toContain("Nenhuma avaliação disponível para exibir");
  });
});
