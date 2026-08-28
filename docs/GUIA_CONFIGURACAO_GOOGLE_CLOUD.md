# Guia de configuração do Google Cloud para o Google Business Profile

Este guia prepara o projeto Google Cloud para uma futura integração oficial das avaliações reais do Perfil da Empresa da Jacque Pegue & Monte. A configuração não deve copiar avaliações por scraping nem usar dados inventados. A conta Google usada no consentimento precisa ser proprietária ou administradora do perfil comercial.

## Visão geral

Há duas etapas separadas: primeiro, a proprietária configura o projeto no Google Cloud e autoriza as APIs; depois, o site implementa o fluxo OAuth 2.0 e passa a consultar as avaliações autorizadas. A integração só deve exibir dados retornados pela API depois que ambas as etapas forem validadas.

| Etapa | Quem executa | Resultado |
|---|---|---|
| Criar projeto e habilitar APIs | Proprietária ou administradora do Google Cloud | Projeto apto a solicitar acesso ao Business Profile |
| Solicitar acesso às APIs | Proprietária ou administradora do perfil | Acesso liberado pela Google, quando aprovado |
| Configurar consentimento OAuth | Administradora do projeto | Tela que explica ao Google quais dados o site acessará |
| Criar cliente OAuth web | Administradora do projeto e responsável técnica do site | Client ID para o login autorizado |
| Autorizar a conta do perfil | Proprietária do Perfil da Empresa | Token OAuth com consentimento explícito |
| Configurar Pub/Sub, opcional | Administradora do Google Cloud | Recebimento de eventos de novas avaliações |

## 1. Entrar no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Entre com uma conta que possa criar projetos ou peça à administradora do Google Workspace/Cloud para realizar os passos.
3. No seletor de projetos, escolha **Novo projeto**.
4. Use um nome identificável, por exemplo `jacque-pegue-monte-business-profile`. O ID do projeto pode ser gerado pelo Google; anote-o.
5. Não compartilhe senha, código de recuperação ou token com terceiros.

## 2. Confirmar o pré-requisito de acesso às APIs

A documentação do Google informa que o projeto precisa ser aprovado para acesso às Business Profile APIs; sem essa aprovação, algumas APIs não aparecem ou podem retornar erro de permissão. Use a página oficial de [pré-requisitos e solicitação de acesso](https://developers.google.com/my-business/content/prereqs) e envie o pedido com a conta e o projeto corretos.

Se o Perfil da Empresa estiver em uma organização Google Workspace, confirme também que o serviço Google Business Profile está ativado para a conta. Caso contrário, o Google pode retornar `403 PERMISSION_DENIED` mesmo com o projeto configurado.

## 3. Habilitar as APIs

No projeto correto, abra **APIs e serviços → Biblioteca**. Pesquise cada API e clique em **Ativar**. A documentação oficial lista sete APIs associadas ao Business Profile:

1. Google My Business API.
2. My Business Account Management API.
3. My Business Lodging API.
4. My Business Place Actions API.
5. My Business Notifications API.
6. My Business Verifications API.
7. My Business Business Information API.

Para uma primeira versão que apenas lê avaliações, o Google ainda recomenda concluir o conjunto de pré-requisitos e APIs do produto. A API de notificações só será usada se a atualização automática por evento for realmente implementada.

> Se o Console pedir faturamento ou aceite de termos, leia a tela e conclua somente se a conta da empresa estiver de acordo com as condições da Google. A habilitação de API não substitui a aprovação de acesso ao produto.

## 4. Configurar a tela de consentimento OAuth

Abra **APIs e serviços → Tela de consentimento OAuth**. Escolha o tipo adequado para a conta, informe o nome visível do aplicativo e use a marca real da Jacque Pegue & Monte. Cadastre, quando solicitado:

| Campo | Valor recomendado |
|---|---|
| Nome do aplicativo | Jacque Pegue & Monte |
| E-mail de suporte | Um e-mail controlado pela empresa |
| Logotipo | A logomarca oficial da empresa |
| Página inicial | A URL pública definitiva do site |
| Política de privacidade | Uma página pública de privacidade do site |
| Termos de uso | Uma página pública de termos, se o fluxo exigir |
| Domínios autorizados | O domínio efetivamente usado pelo site |
| Contatos do desenvolvedor | E-mail responsável pela manutenção |

A página inicial, a política de privacidade e os termos devem existir e refletir o funcionamento real do aplicativo. Não use URLs de teste como endereço definitivo. A Google informa que o consentimento permite ao proprietário revisar e revogar o acesso posteriormente [1] [2].

## 5. Configurar o escopo

Para o Business Profile, o escopo documentado é:

```text
https://www.googleapis.com/auth/business.manage
```

Esse escopo permite solicitar acesso aos dados gerenciados pelo proprietário. A aplicação deve pedir somente o que for necessário e explicar na tela por que precisa ler avaliações. Não solicite escopos de outros produtos Google sem uma necessidade real.

## 6. Criar o cliente OAuth 2.0 para aplicação web

1. Abra **APIs e serviços → Credenciais**.
2. Clique em **Criar credenciais → ID do cliente OAuth**.
3. Selecione **Aplicativo da Web**.
4. Dê um nome identificável, como `Jacque site - Business Profile OAuth`.
5. Aguarde a implementação do backend informar a URL exata de callback OAuth.
6. Cadastre essa URL em **URIs de redirecionamento autorizados** exatamente como fornecida, incluindo protocolo, domínio, caminho e eventuais barras finais.
7. Cadastre as origens JavaScript autorizadas somente se o fluxo implementado realmente exigir.
8. Crie a credencial e guarde o Client ID e o Client Secret em um gerenciador seguro ou no cofre de segredos do ambiente. Nunca coloque o Client Secret em código público, GitHub, screenshots ou mensagens.

O domínio publicado atual do site é `jacquelayout-5igykiqe.manus.space`. Como o callback exato ainda precisa ser definido pela implementação do site, não invente um caminho OAuth neste momento. O endereço deve ser copiado do backend quando a integração for iniciada.

## 7. Autorizar a conta proprietária do perfil

Quando o site tiver o botão de conexão pronto, a proprietária deverá:

1. Abrir o site e iniciar **Conectar Google Business Profile**.
2. Entrar na conta Google que administra o perfil correto.
3. Conferir o nome do aplicativo, o escopo solicitado e os dados que serão acessados.
4. Aceitar somente se reconhecer o aplicativo e a finalidade.
5. Confirmar que o local selecionado é o da Jacque Pegue & Monte em Goianésia–GO.

O Google envia uma notificação sobre a concessão de acesso e permite removê-lo pela página de permissões da conta [2]. A aplicação deve armazenar tokens apenas no servidor, com criptografia e rotação apropriadas; o navegador não deve receber o Client Secret.

## 8. Configurar atualizações automáticas por Pub/Sub, se escolhido

A automação por evento é opcional. Se for necessária, abra o [Google Cloud Pub/Sub](https://console.cloud.google.com/cloudpubsub), crie um tópico exclusivo e configure a permissão de publicação indicada pela documentação de notificações. Depois, o Business Profile Notifications API deverá apontar para esse tópico por meio de `accounts.updateNotificationSetting`.

O site também precisará de um endpoint HTTPS para receber e validar as mensagens, tratar duplicidade e registrar o horário da última sincronização. Pub/Sub não deve ser configurado apenas para uma demonstração; é necessário implementar a validação, o armazenamento seguro e o tratamento de falhas antes de exibir qualquer atualização.

## 9. Checklist antes de entregar credenciais ao site

| Verificação | Status esperado |
|---|---|
| Projeto Google Cloud correto selecionado | Confirmado |
| Conta tem acesso de proprietária/administradora ao perfil | Confirmado |
| Pedido de acesso às APIs enviado/aprovado | Confirmado pela Google |
| APIs necessárias habilitadas | Confirmado no Console |
| Tela de consentimento revisada | Marca, política e domínio corretos |
| Client ID web criado | Criado |
| Client Secret protegido | Nunca em código ou chat |
| Callback OAuth fornecido pelo backend | Somente após implementação |
| Pub/Sub | Somente se a automação for escolhida |

## 10. O que enviar para a próxima etapa

Não envie senha, código de autenticação, Client Secret ou token pelo chat. Para iniciar a implementação no site, basta informar que o projeto foi criado e fornecer o **ID do projeto**, o **Client ID** por canal seguro e concluir o consentimento Google quando a tela de conexão for aberta. O Client Secret deve ser inserido no cofre de segredos do projeto, não em arquivo versionado.

A integração oficial deve permanecer pausada até que a proprietária confirme que o projeto e o perfil comercial corretos foram autorizados. Enquanto isso, o site pode usar um link público para o Perfil da Empresa, sem copiar avaliações.

## Referências

[1]: https://developers.google.com/my-business/content/basic-setup "Google Business Profile APIs — Basic setup"
[2]: https://developers.google.com/my-business/content/oauth-setup "Google Business Profile APIs — OAuth setup"
[3]: https://developers.google.com/my-business/content/implement-oauth "Google Business Profile APIs — Implement OAuth"
[4]: https://developers.google.com/my-business/content/notification-setup "Google Business Profile APIs — Manage real-time notifications"
[5]: https://developers.google.com/my-business/content/prereqs "Google Business Profile APIs — Prerequisites"
