# Integração do carrossel Jacque Pegue e Monte

Este pacote contém duas cópias idênticas do componente React, prontas para uso nos projetos Lovable e Base44. Ambas usam os **63 temas reais** do catálogo, imagens de origem públicas, filtros por categoria, carrossel infinito, navegação automática pausada em interação, setas, teclado, responsividade e CTA para WhatsApp. Os preços não são exibidos.

## Arquivos por plataforma

| Plataforma | Arquivos a copiar | Onde inserir |
|---|---|---|
| Lovable | integrations/lovable/ | Crie ou substitua arquivos em src/components/ e importe o componente na página inicial. |
| Base44 | integrations/base44/ | Crie os mesmos arquivos no painel **Code**, em uma pasta de componentes, e importe na página que contém o catálogo. |

## Lovable

Abra a aba **Code**, crie uma pasta como src/components/jacque-carousel/ e envie os três arquivos da pasta integrations/lovable/. Na página que deve exibir a vitrine (normalmente src/pages/Index.jsx ou src/pages/Index.tsx), inclua:


```jsx
import JacqueThemeCarousel from "@/components/jacque-carousel/JacqueThemeCarousel";

export default function Index() {
  return <main>{/* suas seções atuais */}<JacqueThemeCarousel /></main>;
}
```

Use o chat do Lovable se preferir não editar manualmente: **“Crie os arquivos anexados em src/components/jacque-carousel e renderize JacqueThemeCarousel depois da seção principal da página inicial. Preserve todas as outras seções.”** O editor de código deve estar disponível para edição na conta; caso esteja somente para leitura, peça a alteração pelo chat do próprio projeto ou sincronize o projeto com um repositório Git.

## Base44

No dashboard do aplicativo, abra **Code** e localize a página inicial em **Pages**. Crie uma pasta de componentes, como components/jacque-carousel/, e envie os três arquivos da pasta integrations/base44/. Importe o componente na página:

```jsx
import JacqueThemeCarousel from "../components/jacque-carousel/JacqueThemeCarousel";

// Dentro do JSX da sua página, depois da seção principal:
<JacqueThemeCarousel />
```

Use a prévia em tela dividida para conferir o visual, clique em **Save** e publique somente após revisar a página. Se o caminho de importação for diferente, ajuste-o de acordo com a pasta em que criou os arquivos.

## Personalizações rápidas

| Necessidade | Onde alterar |
|---|---|
| WhatsApp | Passe whatsapp="5562SEUNUMERO" no componente. |
| Título | Passe title="Seu título" ou ajuste a prop padrão. |
| Imagens e temas | Edite catalogThemes.js; cada item contém name, category, slug e image. |
| Cores e dimensões | Ajuste as variáveis e classes em jacque-theme-carousel.css. |

## Fontes consultadas

1. [Lovable — View and edit your project's code](https://docs.lovable.dev/features/code-mode)
2. [Lovable — Sync your project with GitHub](https://docs.lovable.dev/integrations/github)
3. [Base44 — Editing Your App's Code](https://docs.base44.com/documentation/building-your-app/editing-code)
