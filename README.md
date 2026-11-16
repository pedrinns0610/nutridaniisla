> **v1.3.1:** Correção visual do ícone do campo "Sobre o que gostaria de conversar?". A versão completa não inclui CNAME para preservar a prévia no GitHub Pages.

# Danielle Isla · Site V1.3.0 (SEO Belo Horizonte + GitHub Pages)

**Site:** https://nutridaniisla.com.br/  
**Tecnologia:** HTML, CSS e JavaScript puros; sem npm, Node.js, banco ou build.  
**Hospedagem:** GitHub Pages; **Cloudflare:** apenas DNS.  
**Contato:** (31) 99177-0836; WhatsApp 5531991770836.

## O que mudou na V1.3.0

- `<title>` e `<meta name="description">` focados em *nutricionista em Belo Horizonte (BH)*.
- Conteúdo **visível e original** sobre atendimento em Belo Horizonte, integrado ao design editorial, além de perguntas úteis a visitantes.
- Endereço canônico **https://nutridaniisla.com.br/** (versão sem www), metadados Open Graph e Twitter e imagem de compartilhamento 1200×630 em `images/danielle-isla-compartilhamento.jpg`.
- JSON-LD no HTML com tipos **Person**, **WebSite** e **WebPage**, apenas fatos conhecidos. **Não** há LocalBusiness, endereço físico, horários, avaliações, CRN ou especializações inventados.
- `robots.txt` apontando para `sitemap.xml`; sitemap de uma única página (o site é uma landing).
- Arquivo `CNAME` com `nutridaniisla.com.br` para o GitHub Pages.
- Preservado o formulário WhatsApp, menu, botão flutuante, rodapé e todos os estilos responsivos existentes.

## 1. Publicar sem terminal/npm

1. Faça upload do **conteúdo** deste ZIP na raiz do repositório GitHub existente, substituindo os arquivos alterados. O `index.html`, `CNAME`, `robots.txt` e `sitemap.xml` devem ficar na raiz.
2. Acesse **Settings → Pages**. Confirme **Deploy from a branch**, branch `main`, `/(root)`.
3. Em **Custom domain**, informe `nutridaniisla.com.br` (mesmo valor do arquivo `CNAME`) e salve. GitHub Pages e Cloudflare devem estar apontados corretamente para emissão do certificado.
4. Depois que o certificado for disponibilizado, habilite **Enforce HTTPS**.

> Observação: se já existir um `CNAME` diferente ou se o site estiver em outro domínio, confirme as configurações antes de substituir. Esta versão tem como URL oficial `https://nutridaniisla.com.br/`.

## 2. DNS na Cloudflare (somente DNS, sem Cloudflare Pages)

**Domínio raiz `nutridaniisla.com.br`:** crie estes 4 registros `A`, todos com `Nome = @` e **Proxy = DNS only** (nuvem cinza) inicialmente:

| Tipo | Nome | Conteúdo |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**www:** crie `CNAME` com `Nome = www`, `Conteúdo = SEU-USUARIO.github.io` (**substituir pelo proprietário real do repositório**, não incluir nome do repositório); deixar **DNS only** inicialmente. Quando o domínio raiz e `www` estiverem corretamente configurados, o GitHub Pages pode fazer o redirecionamento de `www` para a versão canônica.

Não deixe registros A/AAAA/CNAME conflitantes para os mesmos nomes. Não é necessário criar `AAAA` para funcionar com os registros `A` acima; se usar AAAA, utilize apenas os endereços oficiais do GitHub. Confirme **HTTPS** e redirecionamento antes de anunciar o domínio.

Documentação: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 3. Google Search Console: ativação necessária após publicação

1. Acesse https://search.google.com/search-console e **Adicionar propriedade → Domínio**: `nutridaniisla.com.br` (sem https e sem www).
2. Copie o **TXT de verificação individual fornecido pelo Google** e adicione à zona DNS na Cloudflare (`Tipo: TXT`, `Nome: @`, `Conteúdo: google-site-verification=...`). **Não invente** o código.
3. Após a propagação, clique em **Verificar** no Search Console.
4. Acesse **Sitemaps** e envie `https://nutridaniisla.com.br/sitemap.xml` (ou apenas `sitemap.xml` conforme o campo exibido).
5. Use **Inspeção de URL** para `https://nutridaniisla.com.br/`, teste a URL publicada e solicite indexação. A indexação e o posicionamento **não são imediatos nem garantidos**.
6. Acompanhe **Páginas** e **Desempenho**; pesquise consultas como “danielle isla nutricionista”, “nutricionista em belo horizonte”, “nutricionista bh”, “consulta nutricional belo horizonte”.
7. Teste o JSON-LD em https://validator.schema.org/ e a página em https://search.google.com/test/rich-results (sem prometer recursos especiais; dados Person/WebPage/WebSite são para compreensão semântica).

## 4. O que precisa ser confirmado para melhorar o SEO local de verdade

- **Registro CRN** da Danielle e texto profissional autêntico. Após confirmação, incluir no conteúdo público (e, se relevante, em dados estruturados).
- **Foto profissional real**, trajetória e os serviços efetivamente prestados.
- **Local de atendimento em Belo Horizonte**, se há atendimento presencial, e quais bairros ou áreas são atendidos. Por enquanto, o site **não inventa endereço nem modalidade**.
- Redes sociais oficiais e eventual Google Business Profile **somente se o atendimento atender aos critérios de elegibilidade**; criar perfil com endereço/localização inventados prejudica confiança.
- Após receber dados consistentes, produzir conteúdos úteis e específicos para serviços reais (por exemplo, atendimento clínico geral ou esportivo **apenas se forem áreas confirmadas**), em vez de criar páginas cheias de palavras-chave sem conteúdo útil.

## 5. Como editar WhatsApp e demais dados

Edite `js/config.js` diretamente no GitHub (ícone lápis). O número oficial já está incluído no formulário e botão flutuante.

Arquivos estáticos básicos: `index.html`, `css/style.css`, `js/main.js`, `js/config.js`, `images/`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `CNAME`.

## 6. Observações importantes

- Palavras-chave foram usadas **naturalmente** em título, descrição e conteúdo. Uma meta tag `keywords` repetitiva **não melhora o ranking no Google**.
- Google pode substituir o título e a descrição conforme a busca; isso é normal.
- O sitemap serve para descoberta, não é garantia de indexação.
- GitHub Pages é estático; formulário abre WhatsApp para confirmação do usuário, sem banco de dados.
- Arquivos `CNAME`, sitemap e canonical apontam ao domínio futuro. **Antes de o DNS e HTTPS estarem funcionando, o site no endereço temporário do GitHub pode aparecer com canonical para um endereço ainda inacessível.** Configure o domínio em seguida e evite enviar o sitemap antes de o site estar acessível pelo domínio final.

Referências oficiais:  
https://developers.google.com/search/docs/appearance/title-link  
https://developers.google.com/search/docs/appearance/snippet  
https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap  
https://developers.google.com/search/docs/appearance/structured-data/local-business  
https://developers.google.com/search/docs/monitor-debug/search-console-start
