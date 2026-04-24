# BLACKFIT — Site Oficial

Site institucional da **BLACKFIT Suplementos** + sub-marca **Elegance Fitwear**.

## Stack

- HTML + CSS + JavaScript vanilla
- Backend: **Supabase** (PostgreSQL + Auth + Storage)
- Sem build, sem dependências de runtime

## Rodar localmente

Basta abrir `index.html` no navegador, ou rodar um servidor estático:

```powershell
# opção 1 — Python
python -m http.server 8080

# opção 2 — Node (live-server, com auto-reload)
npx live-server --port=8080
```

Depois abra http://localhost:8080

## Estrutura

```
site/
├─ index.html          Home (hero, stats, bio)
├─ sobre.html          Sobre a empresa
├─ suplementos.html    Categoria de suplementos
├─ roupas.html         Sub-marca Elegance Fitwear
├─ contato.html        Contato + endereço
├─ blog.html           Lista de posts e Instagram
├─ post.html           Post individual (?id=N)
├─ styles.css          Estilo principal
├─ script.js           Animações, parallax, interações
├─ supabase-config.js  URL + anon key do projeto
├─ bf-supabase.js      Bridge: carrega blocos editáveis e listagens
└─ assets/             Imagens e vídeos estáticos
```

## Sistema de conteúdo dinâmico

Qualquer elemento HTML com **`data-cb="page.key"`** terá seu texto trocado pelo valor armazenado no banco (tabela `content_blocks`).

Exemplos:

```html
<!-- texto trocado -->
<h1 data-cb="home.hero_title">Título padrão</h1>

<!-- atributo trocado: data-cb-attr="page.key|nome_do_atributo" -->
<span data-count="3000" data-cb-attr="home.stat1_value|data-count">0</span>

<!-- template com placeholders {{...}} -->
<p data-cb-tpl>© 2026 · {{global.address_line}}</p>
```

O painel admin (repo `23472a342d72347m2384i2934n`) edita esses blocos em tempo real.

## Posts do blog

São carregados via `window.bfLoadPosts()` (lista) e `window.bfLoadPost(id)` (individual). A função `window.bfBumpView(id)` registra a visualização (rate-limited a 1 view por IP a cada 30 min).

## Deploy

Como é 100% estático, basta enviar a pasta para qualquer hospedagem:

- **Netlify**: `netlify deploy --dir=. --prod`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: ativar Pages na branch `main`
- **Hostinger / cPanel**: subir via FTP

A integração com Supabase já está configurada na pasta. Não há variáveis de ambiente para definir.

## Backend Supabase

Schema, RPCs e seed estão no arquivo `supabase/schema.sql` deste mesmo repo (no painel admin separado).

URL do projeto: `https://cgdwiirwtttjykoevett.supabase.co`

---

© BLACKFIT Suplementos · Hidrolândia/GO
