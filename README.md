# ToutchieToYou · NEON TRASH

## Excluir publicações

Depois de informar o token no painel editorial, abra uma publicação e use **Excluir publicação**. A remoção atualiza `data/posts.json` com um commit; o histórico do Git conserva versões anteriores do arquivo.

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
| `config.js` | Repositório e caminho do JSON publicado |
| `assets/css/style.css` | Layout, cores, responsividade, efeitos e acessibilidade |
| `assets/js/app.js` | Rotas, posts, filtros, editor e persistência |
| `assets/images/` | Ilustrações vetoriais e favicon |
| `data/posts.json` | Fonte pública e versionada das postagens |
| `docs/ARCHITECTURE.md` | Decisões técnicas, dados, limites e verificações |
| `.github/workflows/pages.yml` | Publicação no GitHub Pages via Actions |
| `server.mjs` | Servidor local sem dependências |
| `build.mjs` | Geração de `dist/` |

## Páginas e recursos

- `#/`: início, posts, busca e filtro por categoria.
- `#/post/ID`: leitura com link individual compartilhável.
- `#/editor`: painel de administração com prévia, rascunho local e commit no GitHub.
- `#/sobre`: manifesto e explicação do projeto.
- Cursor com estrelas, rastro, scanlines, glitch discreto e faixa animada.
- Botão FX para desativar efeitos; preferência de movimento reduzido respeitada.
- Layout para computador e celular, navegação por teclado e foco visível.
- Títulos, subtítulos e citações no editor: `#`, `##`, `###` e `>` no começo de um bloco. Separe blocos por linha vazia. HTML digitado é exibido como texto, sem executar scripts. Não é um interpretador completo de Markdown.

## Onde as postagens ficam salvas

### GitHub Pages + JSON (configuração atual)

As postagens públicas ficam em `data/posts.json`, versionadas no próprio repositório. No editor do site, informe um **fine-grained personal access token** do GitHub com acesso somente ao repositório `PSjoon/ToutchieToYou` e permissão **Contents: Read and write**. Ao salvar, o site cria um commit que atualiza esse JSON; o GitHub Actions publica a alteração automaticamente.

O token é usado apenas na memória da aba e não é gravado em `localStorage`, no JSON ou no repositório. Não use token clássico amplo, senha, chave SSH nem `service_role`. Como o token concede escrita no repositório, o editor deve ser usado somente por você.

Para criar o token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens. Restrinja o acesso ao repositório indicado e defina uma expiração curta. Ao final da publicação, recarregue a página ou feche a aba para descartar o token da memória.

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
- [API Contents do GitHub](https://docs.github.com/rest/repos/contents)

Consulte `docs/ARCHITECTURE.md` para detalhes e verificações.

## Validação desta entrega

O workflow do GitHub Pages executa a verificação de sintaxe e o build antes de cada publicação. O arquivo `data/posts.json` também é validado pelo editor antes de ser publicado.
