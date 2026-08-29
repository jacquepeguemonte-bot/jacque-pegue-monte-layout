# Integração com Google Business Profile

## Situação atual

Não há conector ativo para Google Business Profile na sessão. As conexões disponíveis relacionadas ao Google não concedem acesso ao perfil comercial nem às avaliações. Portanto, **não existe autorização atual para importar ou exibir avaliações reais**.

## Requisitos confirmados

Cada chamada às APIs do Business Profile exige um token OAuth 2.0. A conta que autoriza deve ter permissão de proprietária ou administradora sobre o perfil da Jacque Pegue & Monte, e o projeto no Google Cloud deve ter as APIs pertinentes habilitadas. O escopo documentado para o gerenciamento é `https://www.googleapis.com/auth/business.manage` [1].

As atualizações de avaliações podem ser tratadas por notificações do Google Cloud Pub/Sub. A documentação indica suporte para avaliações novas ou atualizadas, mas requer um tópico configurado na conta do perfil comercial e um endpoint seguro para receber as notificações [2].

| Alternativa | Resultado no site | Configuração necessária | Indicação |
|---|---|---|---|
| Link direto ao perfil do Google | Visitantes podem consultar avaliações no Google; nenhuma avaliação é copiada para o site. | Apenas a URL pública confirmada do perfil. | Caminho mais simples, sem credenciais e sem manutenção técnica. |
| Integração oficial de avaliações | O site mostra somente avaliações reais, armazenadas e atualizadas por uma integração autorizada. | Projeto Google Cloud, OAuth 2.0, consentimento de proprietária, APIs habilitadas e, para atualização por evento, Pub/Sub. | Indicado quando a proprietária autorizar a configuração técnica completa. |

> A integração não deve usar avaliações inventadas, resultados extraídos de páginas públicas ou dados sem consentimento da proprietária do perfil.

## Próxima decisão necessária

Para implementar a segunda alternativa, é necessário receber a autorização explícita para configurar a integração oficial e os dados do projeto Google Cloud (ou criar um projeto com acesso da proprietária). Sem isso, o site deve manter o link público como alternativa segura.

## Referências

[1]: https://developers.google.com/my-business/content/implement-oauth "Google Business Profile APIs — Implement OAuth with Business Profile APIs"
[2]: https://developers.google.com/my-business/content/notification-setup "Google Business Profile APIs — Manage real-time notifications"

## Limite de escopo do catálogo

O Google Business Profile será usado somente para avaliações reais da empresa, após OAuth e autorização da conta proprietária. Ele **não** é fonte de temas nem de disponibilidade de kits.

A fonte oficial dos temas permanece o catálogo canônico alimentado por planilha/Google Drive e revisado pela proprietária. O site não promete atualização automática de temas neste momento; a seleção de destaques é administrada pelo painel protegido e a atualização do catálogo continua controlada pela fonte oficial. Qualquer automação futura de planilha/Drive deverá ser tratada separadamente, com agendamento, tratamento de erro e validação antes de publicação.
