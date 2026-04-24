/**
 * BLACKFIT — Bridge Supabase para o site público (read-only).
 * - Carrega content_blocks e injeta em [data-cb="page.key"] e [data-cb-attr="page.key|attr"]
 * - Substitui placeholders globais: {{whatsapp}}, {{whatsapp_text=...}}, {{group}}, {{instagram}}, {{address}}
 * - Expõe window.bfData = { posts, insta, blocks, byKey() }
 */
(function () {
  const SB = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  window.bfSB = SB;

  const PAGE = (() => {
    const f = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (f === '' || f === 'index.html') return 'home';
    return f.replace('.html', '');
  })();

  const cache = { blocks: {}, posts: [], insta: [] };
  window.bfData = cache;
  cache.byKey = (k) => cache.blocks[k];

  function applyBlocks(root = document) {
    // 1) Substitui texto direto: data-cb="home.hero_lead"
    root.querySelectorAll('[data-cb]').forEach(el => {
      const key = el.getAttribute('data-cb');
      const v = cache.blocks[key];
      if (v != null) el.textContent = v;
    });
    // 2) Substitui atributo: data-cb-attr="key|attr"
    root.querySelectorAll('[data-cb-attr]').forEach(el => {
      const [key, attr] = el.getAttribute('data-cb-attr').split('|');
      const v = cache.blocks[key];
      if (v != null && attr) el.setAttribute(attr, v);
    });
    // 3) Substitui placeholders {{...}} no innerHTML — só elementos marcados com data-cb-tpl
    root.querySelectorAll('[data-cb-tpl]').forEach(el => {
      let html = el.dataset.cbTplOriginal;
      if (html == null) { html = el.innerHTML; el.dataset.cbTplOriginal = html; }
      el.innerHTML = renderTpl(html);
    });
    // 4) Atualiza href de wa.me e grupo no documento inteiro
    const wa = cache.blocks['global.whatsapp_number'];
    const grp = cache.blocks['global.whatsapp_group'];
    const ig  = cache.blocks['global.instagram_handle'];
    if (wa) document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
      a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + wa.replace(/\D/g, ''));
    });
    if (grp) document.querySelectorAll('a[href*="chat.whatsapp.com"]').forEach(a => a.href = grp);
    if (ig)  document.querySelectorAll('a[href*="instagram.com/"]').forEach(a => {
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

  // Carrega blocos ao abrir
  async function loadBlocks() {
    const { data } = await SB.from('content_blocks').select('page,key,value').in('page', ['global', PAGE]);
    if (data) data.forEach(r => { cache.blocks[r.page + '.' + r.key] = r.value; });
    applyBlocks();
    window.dispatchEvent(new CustomEvent('bfBlocksApplied'));
  }

  // Helpers expostos pra outras páginas usarem
  window.bfLoadPosts = async () => {
    const { data, error } = await SB.from('posts')
      .select('id,title,slug,excerpt,cover_url,views,created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    cache.posts = data || [];
    return cache.posts;
  };
  window.bfLoadPost = async (id) => {
    const { data: p, error } = await SB.from('posts').select('*').eq('id', id).maybeSingle();
    if (error || !p) return null;
    const { data: media } = await SB.from('post_media').select('*').eq('post_id', id).order('position');
    p.media = media || [];
    return p;
  };
  window.bfBumpView = async (id) => {
    try {
      await SB.rpc('bump_view', { p_post_id: Number(id), p_ua: navigator.userAgent.slice(0, 200), p_ip: null });
    } catch {}
  };
  window.bfLoadInsta = async () => {
    const { data } = await SB.from('insta_posts').select('*').order('position').order('created_at', { ascending: false });
    cache.insta = data || [];
    return cache.insta;
  };

  // Boot
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadBlocks);
  else loadBlocks();
})();
