# Publicação no GitHub: Jacque Pegue e Monte

Este guia descreve uma publicação segura do site React/Vite no **GitHub Pages**, com atualizações automáticas sempre que houver um envio de código para a branch `main`. O projeto utiliza `pnpm`, gera os arquivos de produção em `dist/public` e possui rotas internas para páginas de serviços e temas.

> **Importante:** ainda não foi criado nenhum repositório nem publicada nenhuma versão no GitHub. A publicação é um ato externo e deve acontecer somente após a escolha do nome do repositório e a conferência dos arquivos que serão públicos.

## 1. Escolha a estrutura de publicação

Para este projeto, o caminho mais simples é criar um repositório chamado, por exemplo, `jacque-pegue-monte`. O endereço inicial ficará no formato abaixo:

| Tipo de endereço | URL esperada | Configuração `base` do Vite |
|---|---|---|
| Repositório de projeto | `https://SEU-USUARIO.github.io/jacque-pegue-monte/` | `/jacque-pegue-monte/` |
| Repositório de usuário ou domínio próprio | `https://SEU-USUARIO.github.io/` ou domínio próprio | `/` |

O projeto já foi preparado para receber uma variável `VITE_BASE_PATH`. A configuração do workflow usa automaticamente `/${{ github.event.repository.name }}/`, adequada ao primeiro caso. Se você usar um domínio próprio ou um repositório do tipo `SEU-USUARIO.github.io`, troque esse valor por `/`.

## 2. Prepare uma cópia portátil das imagens

As imagens da versão atual são fornecidas pelo armazenamento do ambiente gerenciado e aparecem no código como caminhos iniciados em `/manus-storage/`. Esse caminho **não existe no GitHub Pages**. Antes de enviar o projeto ao GitHub, é necessário criar uma exportação portátil, com as imagens do acervo, logo e fundos incluídos na pasta pública do site e os links atualizados.

| O que precisa entrar na exportação | Destino recomendado no repositório |
|---|---|
| Fotos dos 63 temas | `client/public/media/temas/` |
| Logo e imagens de hero | `client/public/media/marca/` |
| Fotos editoriais e fundos | `client/public/media/editorial/` |

Não publique arquivos com informações privadas, planilhas de operação, logs ou credenciais. O site e seu conteúdo ficarão acessíveis publicamente no endereço do GitHub Pages, mesmo que a possibilidade de Pages em repositórios privados dependa do plano ou da organização.[1]

## 3. Crie o repositório e envie o código

Depois de preparar a exportação portátil, abra um terminal dentro da pasta do projeto e execute os comandos abaixo. Substitua `SEU-USUARIO` se optar por usar a URL SSH; o comando com `gh` cria o repositório privado por padrão.

```bash
git init
git add .
git commit -m "Publicação inicial do site Jacque Pegue e Monte"
gh repo create jacque-pegue-monte --private --source=. --remote=origin --push
git branch -M main
git push -u origin main
```

Se preferir que o código-fonte também seja público, crie o repositório como público diretamente na interface do GitHub ou execute `gh repo create jacque-pegue-monte --public --source=. --remote=origin --push`.

## 4. Adicione o workflow de publicação

Copie o modelo pronto em `docs/templates/deploy-github-pages.yml` para o caminho abaixo no repositório que será publicado:

```text
.github/workflows/deploy-github-pages.yml
```

O workflow instala as dependências com `pnpm`, cria a build em `dist/public`, copia `index.html` para `404.html` e publica o artefato. A cópia para `404.html` é necessária porque este site usa rotas de cliente, como `/decoracao-roblox-goianesia`; o GitHub Pages não oferece um redirecionamento de servidor para aplicações de página única.

```bash
mkdir -p .github/workflows
cp docs/templates/deploy-github-pages.yml .github/workflows/deploy-github-pages.yml
git add .github/workflows/deploy-github-pages.yml vite.config.ts
git commit -m "Configura publicação automática no GitHub Pages"
git push
```

## 5. Ative o GitHub Pages

No GitHub, entre no repositório e abra **Settings → Pages**. Em **Build and deployment**, selecione **GitHub Actions** como a fonte de publicação. Após o próximo `git push`, abra a aba **Actions**, selecione o workflow “Publicar site no GitHub Pages” e acompanhe a etapa “Publicar no GitHub Pages”. O endereço da página aparece ao final da execução.[1] [2]

> O Vite requer uma etapa de build. Por isso, o caminho com **GitHub Actions** é mais adequado do que publicar uma branch estática diretamente.[2]

## 6. Faça a validação após publicar

Abra a URL produzida pelo GitHub e confira a home, o catálogo externo do WhatsApp, o mapa em `/contato` e pelo menos três páginas de tema. Também teste uma rota aberta diretamente, por exemplo `.../decoracao-roblox-goianesia`, para confirmar que o fallback de SPA está ativo.

| Item de validação | Resultado esperado |
|---|---|
| Home | Todos os botões de catálogo levam ao WhatsApp correto. |
| Imagens | Logo, fotos editoriais e temas carregam sem usar `/manus-storage/`. |
| Rotas internas | Serviço, contato e página de tema abrem diretamente. |
| Celular | Menu, CTAs, mapa e imagens são legíveis em tela estreita. |
| Atualização | Um novo `git push` para `main` cria uma publicação automática. |

## 7. Atualizações futuras

Após a primeira publicação, o ciclo é curto: edite o site, valide localmente com `pnpm check && pnpm build`, faça `git add`, `git commit` e `git push`. O workflow fará a atualização do GitHub Pages automaticamente.

O GitHub Pages é adequado para a parte estática do site. Integrações automáticas com Google Business Profile, avaliações reais ou planilhas privadas exigem uma camada de servidor para manter credenciais seguras; não exponha chaves do Google no código do navegador.

## Referências

[1] [GitHub Docs — Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

[2] [Vite — Deploying a Static Site: GitHub Pages](https://vite.dev/guide/static-deploy)
