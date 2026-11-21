# Arquitetura

## Escolhas

Aplicação estática sem framework e sem dependências npm. Uma única entrada HTML e rotas por hash mantêm links individuais funcionando no GitHub Pages, inclusive ao recarregar um post. CSS, JavaScript e ilustrações ficam separados. O build usa apenas APIs nativas do Node e publica exclusivamente os arquivos necessários.

## Fluxo de dados

`config.js` é carregado antes de `app.js`. Sem configuração, o repositório de posts combina exemplos e registros locais. Com URL e chave publicável configuradas, leitura e inserção usam a API REST do Supabase. Falhas de conexão aparecem na interface e não geram falsa confirmação de publicação. O modo compartilhado não cai silenciosamente para armazenamento local.

O formulário usa validação nativa, limites de tamanho e validação de campos após trim. Um envio recebe UUID e data ISO. O botão é desativado durante o envio. Rascunhos são preservados em erros. A prévia e os posts escapam caracteres HTML antes de renderizar. URLs de capa aceitam apenas HTTPS. O formato de texto suporta títulos e citações em blocos, sem HTML arbitrário ou Markdown externo.

## Modelo de postagem

| Campo | Tipo e limite |
| --- | --- |
| id | UUID nos novos posts; string de até 100 caracteres na importação local |
| title | Texto obrigatório, até 140 caracteres |
| author | Texto obrigatório, até 60 caracteres |
| category | Tecnologia, Cultura, Games ou Devaneios |
| excerpt | Texto obrigatório, até 280 caracteres |
| body | Texto obrigatório, até 40.000 caracteres |
| cover | URL HTTPS opcional, até 2.000 caracteres |
| created_at | Data/hora ISO válida |

Backups são arrays desses objetos, com até 500 posts e arquivo de até 3 MB. O armazenamento do navegador também possui uma cota própria. Quando indisponível ou cheio, a interface informa a falha. Os exemplos usam IDs descritivos e só existem no modo local.

## Escopo e limites

- Sem login, permissões por usuário ou gestão pública de exclusão.
- Sem uploads de arquivos para o banco: apenas URL de capa.
- Sem analytics, comentários, rastreadores ou cookies próprios.
- Fontes e imagens remotas dependem de rede.
- Sem paginação de arquivo: consulta compartilhada limitada a 500 posts.
- Datas e autoria enviadas pelo cliente não são identidade ou auditoria confiáveis.
- A proteção contra spam exige serviço de backend; não há segredo que possa ficar seguro em JS público.
- SEO básico via metadados na entrada; posts por hash não recebem páginas HTML independentes ou metadados sociais individuais. Para SEO avançado, evoluir para geração estática de cada post.

## Verificação manual

1. Abra o início, filtre categorias e busque um termo inexistente.
2. Abra um post, copie seu endereço e recarregue.
3. Vá ao editor, escreva e confira a prévia. Recarregue e confirme o rascunho.
4. Publique localmente, abra o post e recarregue.
5. Exporte JSON, importe em outro navegador e confira os registros.
6. Digite `<script>alert(1)</script>` no conteúdo: deve aparecer apenas como texto.
7. Tente uma URL de capa `javascript:`: deve ser rejeitada.
8. Teste o botão FX, teclado e tela estreita.
9. Após configurar Supabase, publique em um navegador e confira em outro. Essa etapa depende de um banco real configurado.
