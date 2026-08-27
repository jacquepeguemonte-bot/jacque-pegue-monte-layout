/** Direção visual: celebração editorial suave — rotas de temas aprofundam a descoberta e preservam a home como um caminho curto até o catálogo. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { AboutPage, BlogIndexPage, ContactPage, ServicePage, ThemeDetailPage } from "./pages/SeoPages";
import { CATALOG_THEMES } from "./data/catalogThemes";
import { slugify } from "./lib/business";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/festa-infantil-goianesia"} component={() => <ServicePage kind="festa-infantil" />} />
      <Route path={"/pegue-e-monte-goianesia"} component={() => <ServicePage kind="pegue-e-monte" />} />
      <Route path={"/aluguel-decoracao-goianesia"} component={() => <ServicePage kind="aluguel" />} />
      <Route path={"/decoracao-festa-goianesia"} component={() => <ServicePage kind="decoracao" />} />
      <Route path={"/sobre"} component={AboutPage} />
      <Route path={"/contato"} component={ContactPage} />
      <Route path={"/blog"} component={BlogIndexPage} />
      {CATALOG_THEMES.map((theme) => {
        const themeSlug = slugify(theme.name);
        return <Route key={themeSlug} path={`/decoracao-${themeSlug}-goianesia`} component={() => <ThemeDetailPage themeSlug={themeSlug} />} />;
      })}
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

/** Direção visual: celebração editorial suave — uma abertura curta apresenta a marca sem atrasar o acesso ao catálogo. */
function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leaveTimer = window.setTimeout(() => setLeaving(true), reducedMotion ? 30 : 760);
    const hideTimer = window.setTimeout(() => setVisible(false), reducedMotion ? 50 : 1180);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`initial-loader${leaving ? " initial-loader--leaving" : ""}`} aria-live="polite" aria-label="Carregando o site Jacque Pegue e Monte">
      <div className="initial-loader__brand">
        <img src="/manus-storage/logo-jpm-lovable_2d35525f.jpeg" alt="" />
        <p>Jacque <em>Pegue &amp; Monte</em></p>
      </div>
      <div className="initial-loader__bar" aria-hidden="true"><span /></div>
      <span className="initial-loader__label">Preparando sua celebração</span>
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <InitialLoader />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
