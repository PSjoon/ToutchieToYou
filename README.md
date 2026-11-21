# ToutchieToYou · NEON TRASH

## Excluir publicações

Na página de leitura, use **Excluir publicação** e confirme. A exclusão é lógica: a publicação sai da listagem e deixa de abrir pelo link, mas o registro é preservado. No modo local, isso afeta somente este navegador, incluindo posts de demonstração. Backups podem conter os registros arquivados.

No Supabase, execute também `database/enable-post-deletion.sql`, inclusive em projetos criados com o schema atualizado. O script adiciona a coluna necessária e libera apenas a alteração de `deleted_at`; não permite editar título, conteúdo ou autoria. Como o blog não tem autenticação, **qualquer visitante pode excluir qualquer publicação**. Os registros podem ser restaurados pelo proprietário no painel do banco. A exclusão lógica não torna o conteúdo confidencial: os registros ainda existem e a política de leitura do banco permanece pública. Essa seção substitui a informação anterior de que não existe alteração pública: somente a exclusão lógica foi acrescentada.

Blog estático em HTML, CSS e JavaScript puros. Visual cyberpunk maximalista inspirado na paleta da referência: rosa dos óculos, amarelo da jaqueta e roxo do cabelo. Ilustração SVG original, editável e incluída no projeto. NEON TRASH é o nome visual do blog; ToutchieToYou é o nome do projeto.

## Começar

Extraia **o conteúdo** deste pacote dentro de `C:\Users\pedro\Documents\projects\ToutchieToYou`. Preserve a pasta `.git` existente. O README inicial será substituído por esta documentação. Nenhum comando de Git é executado automaticamente.

Não precisa instalar dependências. Com Node.js 22 ou superior:

```bash
npm run dev
```

Abra http://127.0.0.1:4173. Para abrir sem servidor, também é possível usar `index.html`, mas o armazenamento de páginas `file://` pode variar entre navegadores; prefira o servidor local.

```bash
npm run check
npm run build
```

O build apenas copia os arquivos públicos para `dist/`. Banco, documentos e scripts de desenvolvimento ficam fora da publicação.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura semântica, navegação, carregamento dos assets |
| `config.js` | Configuração pública da conexão opcional com o banco |
| `assets/css/style.css` | Layout, cores, responsividade, efeitos e acessibilidade |
| `assets/js/app.js` | Rotas, posts, filtros, editor e persistência |
| `assets/images/` | Ilustrações vetoriais e favicon |
| `database/schema.sql` | Tabela e políticas para publicação compartilhada |
| `docs/ARCHITECTURE.md` | Decisões técnicas, dados, limites e verificações |
| `.github/workflows/pages.yml` | Publicação no GitHub Pages via Actions |
| `server.mjs` | Servidor local sem dependências |
| `build.mjs` | Geração de `dist/` |

## Páginas e recursos

- `#/`: início, posts, busca e filtro por categoria.
- `#/post/ID`: leitura com link individual compartilhável.
- `#/editor`: formulário público, sem login, com prévia e rascunho automático.
- `#/sobre`: manifesto e explicação do projeto.
- Cursor com estrelas, rastro, scanlines, glitch discreto e faixa animada.
- Botão FX para desativar efeitos; preferência de movimento reduzido respeitada.
- Layout para computador e celular, navegação por teclado e foco visível.
- Títulos, subtítulos e citações no editor: `#`, `##`, `###` e `>` no começo de um bloco. Separe blocos por linha vazia. HTML digitado é exibido como texto, sem executar scripts. Não é um interpretador completo de Markdown.

## Onde as postagens ficam salvas

### Modo local (padrão)

Funciona imediatamente e inclui três posts de demonstração. Publicações e rascunhos ficam em `localStorage`, **apenas no navegador e domínio atuais**. Eles não são enviados ao GitHub nem ficam visíveis para outras pessoas. Limpar os dados do navegador remove esse conteúdo. Use **Exportar postagens** para backup JSON. **Importar postagens** mescla pelo ID e substitui a cópia local de IDs repetidos. Posts de demonstração não entram na exportação.

### Modo compartilhado, sem usuários

O GitHub Pages serve arquivos estáticos. Para que qualquer visitante publique pelo editor e todos vejam o post, conecte um projeto Supabase:

1. Crie seu projeto em https://supabase.com.
2. Abra o SQL Editor e execute `database/schema.sql` em um projeto novo.
3. Copie a URL do projeto e a **publishable key** (ou a chave legada `anon`).
4. Preencha `config.js`:

```js
window.BLOG_CONFIG = {
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',
  supabasePublishableKey: 'SUA_CHAVE_PUBLICAVEL'
};
```

5. Envie a alteração para o repositório e aguarde a publicação.
6. Crie uma postagem pelo editor e abra o blog em outro navegador para confirmar o compartilhamento.

Use exclusivamente uma chave publicável. **Nunca coloque `service_role`, chave secreta, senha do banco ou token do GitHub no frontend.** A chave publicável é exposta por definição; as políticas do banco permitem apenas ler e inserir posts. Não há contas ou níveis de usuário. Alteração e exclusão são feitas pelo dono no painel do banco.

Como solicitado, a publicação é aberta: qualquer visitante pode enviar conteúdo e se identificar com qualquer nome. Não há moderação prévia, controle de autoria, CAPTCHA ou limite por IP. Os limites de tamanho existem no cliente e no banco. Antes de divulgar amplamente, avalie adicionar moderação e limitação de envios por um backend. A conexão não foi provisionada neste pacote: é necessário fazer a configuração acima. No modo compartilhado, a página lista os 500 posts mais recentes; rascunhos continuam locais. Os exemplos locais deixam de aparecer. Backups locais não são enviados automaticamente ao banco.

## Publicar no GitHub Pages

1. Copie os arquivos deste projeto para seu repositório, incluindo `.github/` e `.nojekyll`.
2. Use a branch `main` ou ajuste `branches` no workflow.
3. No GitHub, abra **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Faça commit e push dos arquivos. Se o push já aconteceu, execute o workflow pela aba Actions.
5. Aguarde o workflow **Publicar blog no GitHub Pages**. A URL aparece em Settings → Pages e no ambiente `github-pages`.

Os caminhos de assets são relativos e as rotas usam hash: o blog funciona em `https://USUARIO.github.io/ToutchieToYou/` sem regras de redirecionamento. Nenhum token de escrita é necessário no site.

Alternativa sem Actions: publique a branch `main`, pasta `/ (root)`, em Settings → Pages. O `index.html` já está na raiz. Não use as duas estratégias ao mesmo tempo.

## Personalizar

- Nome, textos fixos e manifesto: `index.html` e `assets/js/app.js`.
- Paleta e tipografia: variáveis em `assets/css/style.css`.
- Hero e favicon: SVGs em `assets/images/`.
- Google Fonts é opcional e tem fontes alternativas locais. Nenhuma outra biblioteca externa é carregada.
- Imagens de capa usam URLs HTTPS; escolha imagens estáveis que você tem autorização para publicar.

## Referências

- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Políticas de segurança do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)

Consulte `docs/ARCHITECTURE.md` para detalhes e verificações.

## Validação desta entrega

Verificação de sintaxe JavaScript e build executados com Node. Testes de lógica passaram para início, filtro, leitura, post inexistente, escape de HTML e rejeição de URLs inseguras. A inspeção visual no navegador ficou bloqueada pelas permissões de rede local do ambiente. A publicação compartilhada ainda depende de configurar e testar um projeto Supabase real. Nenhuma alteração foi feita na pasta externa informada nem no GitHub.
