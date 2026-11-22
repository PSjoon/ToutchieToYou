# ToutchieToYou · NEON TRASH

Blog da Antonieta para suas antonets: cultura, tecnologia, games e as babadeiras de Night City, com visual cyberpunk e espírito dos blogs dos anos 2010.

[Acessar o blog](https://psjoon.github.io/ToutchieToYou/)

## Navegação

- **Transmissões:** postagens, busca e filtros por categoria.
- **Manifesto:** a história e o propósito do blog.
- **Nova postagem:** editor com prévia ao vivo e rascunho automático.
- **FX:** ativa ou desativa os efeitos visuais. O site também respeita a preferência de movimento reduzido do dispositivo.

Cada postagem possui seu próprio link. O editor aceita títulos com `#`, `##` e `###` e citações com `>` no início de um bloco; separe os blocos com uma linha vazia. A imagem de capa é opcional e deve usar uma URL HTTPS.

## Postagens

As postagens ficam em `data/posts.json`, versionadas no repositório. Ao publicar pelo editor, o site atualiza o arquivo no GitHub por meio de um commit. O GitHub Pages publica a nova versão em seguida, o que pode levar alguns instantes.

Na página de uma postagem, **Excluir publicação** remove o item do JSON e cria um novo commit. Versões anteriores continuam disponíveis no histórico do Git. O rascunho do editor fica armazenado apenas no navegador atual até ser limpo ou publicado.

## Executar localmente

Com Node.js 22 ou superior, sem instalar dependências:

```bash
npm run dev
```

Abra `http://127.0.0.1:4173`. Use um servidor local para que o navegador consiga carregar o arquivo JSON.

Para verificar a sintaxe e gerar a pasta de distribuição:

```bash
npm run check
npm run build
```

O build copia os arquivos públicos, incluindo `data/`, para `dist/`.

## Publicação

O site é hospedado no GitHub Pages a partir da branch `main`. Após um push, acompanhe **Actions → pages build and deployment** para verificar a publicação. O endereço e a origem de publicação também aparecem em **Settings → Pages**.

## Estrutura

| Caminho | Função |
| --- | --- |
| `index.html` | Estrutura e navegação |
| `config.js` | Configuração do repositório e do arquivo de postagens |
| `assets/js/app.js` | Rotas, listagem, editor e publicação |
| `assets/css/` | Aparência e layout responsivo |
| `assets/images/` | Ilustrações e ícone |
| `data/posts.json` | Postagens públicas |
| `server.mjs` | Servidor de desenvolvimento local |
| `build.mjs` | Geração da pasta `dist/` |

O projeto utiliza HTML, CSS e JavaScript, com rotas em hash para funcionar no GitHub Pages. As ilustrações SVG fazem parte do projeto.
