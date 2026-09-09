
# Validação do callback OAuth

A inspeção do endpoint publicado mostrou que a URI enviada anteriormente ao Google era `https://oc3432w4vo-dqtr4hkfzq-uk.a.run.app/api/google/oauth/callback`, causando `Erro 400: redirect_uri_mismatch`. O servidor agora usa de forma determinística a URI pública `https://jacquelayout-5igykiqe.manus.space/api/google/oauth/callback` para iniciar e concluir a troca OAuth. A correção foi validada com testes, TypeScript e build; a confirmação final depende de repetir a autorização após a publicação.
