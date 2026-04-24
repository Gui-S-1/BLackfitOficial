/**
 * BLACKFIT / ELEGANCE — Bridge Supabase para o site público (read-only).
 * - Lê window.BF_BRAND ('blackfit' | 'elegance'); padrão 'blackfit'
 * - Carrega content_blocks da marca + 'global' da marca
 * - Aplica em [data-cb], [data-cb-attr], [data-cb-tpl] com {{key}}
 * - Atualiza href de WhatsApp/grupo/Instagram
 * - bfSetMeta() injeta meta og:title / og:description / og:image dinamicamente
 */
(function () {
  const SB = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  window.bfSB = SB;

  const BRAND = (window.BF_BRAND || 'blackfit').toLowerCase();
  window.BF_BRAND = BRAND;

  const PAGE = (() => {
    const f = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (f === '' || f === 'index.html') return 'home';
    return f.replace('.html', '');
  })();

  const cache = { blocks: {}, posts: [], insta: [] };
  window.bfData = cache;
  cache.byKey = (k) => cache.blocks[k];

  function applyBlocks(root = document) {
    root.querySelectorAll('[data-cb]').forEach(el => {
      const v = cache.blocks[el.getAttribute('data-cb')];
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll('[data-cb-attr]').forEach(el => {
      const [key, attr] = el.getAttribute('data-cb-attr').split('|');
      const v = cache.blocks[key];
      if (v != null && attr) el.setAttribute(attr, v);
    });
    root.querySelectorAll('[data-cb-tpl]').forEach(el => {
      let html = el.dataset.cbTplOriginal;
      if (html == null) { html = el.innerHTML; el.dataset.cbTplOriginal = html; }
      el.innerHTML = renderTpl(html);
    });

    const wa  = cache.blocks['global.whatsapp_number'];
    const txt = cache.blocks['global.whatsapp_text'] || '';
    const grp = cache.blocks['global.whatsapp_group'];
    const ig  = cache.blocks['global.instagram_handle'];
    if (wa) {
      const num = wa.replace(/\D/g, '');
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
        try {
          const u = new URL(a.href);
          u.pathname = '/' + num;
          if (txt && !u.searchParams.get('text')) u.searchParams.set('text', txt);
          a.href = u.toString();
        } catch {}
      });
    }
    if (grp) document.querySelectorAll('a[href*="chat.whatsapp.com"]').forEach(a => a.href = grp);
    if (ig) document.querySelectorAll('a[href*="instagram.com/"]').forEach(a => {
      if (/instagram\.com\/[^\/]+\/?$/.test(a.href)) a.href = 'https://instagram.com/' + ig;
    });
  }
  function renderTpl(s) {
    return String(s).replace(/\{\{\s*([a-z_.]+)\s*\}\}/gi, (_, k) => {
      const v = cache.blocks[k] ?? cache.blocks['global.' + k] ?? cache.blocks[PAGE + '.' + k];
      return v == null ? '' : String(v).replace(/[<>]/g, c => ({'<':'&lt;','>':'&gt;'}[c]));
    });
  }
  window.bfApplyBlocks = applyBlocks;

  async function loadBlocks() {
    const { data } = await SB.from('content_blocks')
      .select('page,key,value')
      .eq('brand', BRAND)
      .in('page', ['global', PAGE]);
    if (data) data.forEach(r => { cache.blocks[r.page + '.' + r.key] = r.value; });
    applyBlocks();
    window.dispatchEvent(new CustomEvent('bfBlocksApplied'));
  }

  window.bfLoadPosts = async () => {
    const { data, error } = await SB.from('posts')
      .select('id,title,slug,excerpt,cover_url,views,created_at')
      .eq('brand', BRAND)
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    cache.posts = data || [];
    return cache.posts;
  };
  window.bfLoadPost = async (id) => {
    const { data: p, error } = await SB.from('posts')
      .select('*')
      .eq('id', id)
      .eq('brand', BRAND)
      .maybeSingle();
    if (error || !p) return null;
    if (!p.media || !p.media.length) {
      const { data: media } = await SB.from('post_media').select('url,type,position').eq('post_id', id).order('position');
      if (media && media.length) p.media = media;
    }
    return p;
  };
  window.bfBumpView = async (id) => {
    try {
      await SB.rpc('bump_view', { p_post_id: Number(id), p_ua: navigator.userAgent.slice(0, 200), p_ip: null });
    } catch {}
  };
  window.bfLoadInsta = async () => {
    const { data } = await SB.from('insta_posts')
      .select('*')
      .eq('brand', BRAND)
      .order('position').order('created_at', { ascending: false });
    cache.insta = data || [];
    return cache.insta;
  };

  /** Atualiza/insere meta tags Open Graph (preview ao compartilhar link) */
  window.bfSetMeta = ({ title, description, image, url }) => {
    const upsert = (key, val, prop) => {
      if (val == null) return;
      const sel = prop ? `meta[property="${key}"]` : `meta[name="${key}"]`;
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        if (prop) el.setAttribute('property', key); else el.setAttribute('name', key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };
    if (title) document.title = title;
    upsert('description', description);
    upsert('og:type', 'article', true);
    upsert('og:title', title, true);
    upsert('og:description', description, true);
    upsert('og:image', image, true);
    upsert('og:url', url || location.href, true);
    upsert('twitter:card', 'summary_large_image');
    upsert('twitter:title', title);
    upsert('twitter:description', description);
    upsert('twitter:image', image);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadBlocks);
  else loadBlocks();
})();
