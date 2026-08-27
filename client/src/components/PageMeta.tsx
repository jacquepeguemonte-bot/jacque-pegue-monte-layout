/** Direção visual: metadados discretos e úteis para encontrar a marca localmente. */
import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
};

export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    descriptionTag?.setAttribute("content", description);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    canonical?.setAttribute("href", window.location.href);
  }, [description, title]);

  return null;
}
