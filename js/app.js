/* CycloneDX SBOM Generator – form, storage and output. Everything runs in the browser; nothing is sent anywhere. */
(function () {
  'use strict';
  const t = I18N.t;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const STORE = 'cdxgen.state.v1';
  const uid = () => 'c-' + Math.random().toString(36).slice(2, 10);

  const blankComp = () => ({ id: uid(), name: '', version: '', type: 'library', supplier: '', contact: '', license: '', purl: '', cpe: '', filename: '', hashAlg: 'SHA-512', hashValue: '', exec: '', archive: '', structured: '', scope: '', srcUrl: '', distUrl: '', description: '', direct: true, deps: [] });
  const blankState = () => ({
    sbom: { authorName: '', authorContact: '', authorOrg: '', phase: 'build', version: 1, serial: CDX.newSerial() },
    product: Object.assign(blankComp(), { id: 'product', type: 'application' }),
    components: []
  });

  let state = load();
  const open = new Set();
  let hashTarget = null;

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && s.sbom && s.product && Array.isArray(s.components)) return s;
    } catch (e) { /* empty */ }
    return blankState();
  }
  let saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ } }, 300); }
  const obj = o => o === 'sbom' ? state.sbom : o === 'product' ? state.product : state.components.find(c => c.id === o);

  // ---------- Form building blocks ----------
  function inp(o, k, label, x) {
    x = x || {};
    const v = obj(o)[k];
    return `<label class="field ${x.wide ? 'wide' : ''}"><span class="lbl">${esc(label)}</span>${x.hint ? `<small>${esc(x.hint)}</small>` : ''}
      <input data-o="${o}" data-k="${k}" value="${esc(v == null ? '' : v)}" placeholder="${esc(x.ph || '')}" ${x.list ? `list="${x.list}"` : ''} ${x.type ? `type="${x.type}" min="1" step="1"` : ''} autocomplete="off" spellcheck="false"></label>`;
  }
  function sel(o, k, label, options, x) {
    x = x || {};
    const v = obj(o)[k] || '';
    return `<label class="field"><span class="lbl">${esc(label)}</span>${x.hint ? `<small>${esc(x.hint)}</small>` : ''}
      <select data-o="${o}" data-k="${k}">${options.map(([val, text]) => `<option value="${esc(val)}" ${val === v ? 'selected' : ''}>${esc(text)}</option>`).join('')}</select></label>`;
  }
  const yesNo = () => [['', t('opt_unknown')], ['yes', t('opt_yes')], ['no', t('opt_no')]];

  function compFields(c, isProduct) {
    const o = c.id;
    const others = state.components.filter(x => x.id !== c.id);
    return `
      <div class="grid">
        ${inp(o, 'name', t('f_name') + ' *', { ph: t(isProduct ? 'f_name_ph_p' : 'f_name_ph_c') })}
        ${inp(o, 'version', t('f_version'), { ph: t('f_version_ph') })}
        ${sel(o, 'type', t('f_type'), CDX.TYPES.map(x => [x, t('type_' + x)]))}
        ${inp(o, 'supplier', t('f_supplier'), { ph: isProduct ? t('f_authorOrg_ph') : t('f_supplier_ph') })}
        ${inp(o, 'contact', t('f_contact'), { ph: t('f_contact_ph') })}
        ${inp(o, 'license', t('f_license'), { ph: t('f_license_ph'), hint: t('f_license_h'), list: 'spdxList' })}
        ${inp(o, 'purl', t('f_purl'), { ph: t('f_purl_ph'), hint: t('f_purl_h') })}
        ${inp(o, 'cpe', t('f_cpe'), { ph: t('f_cpe_ph'), hint: t('f_cpe_h') })}
      </div>
      <details class="more" data-more="${o}" ${open.has('more-' + o) ? 'open' : ''}><summary>${esc(t('more'))}</summary>
        <div class="grid">
          ${inp(o, 'filename', t('f_filename'), { ph: t('f_filename_ph'), hint: t('f_filename_h') })}
          ${sel(o, 'hashAlg', t('f_hashAlg'), Object.keys(CDX.HASH_LEN).map(a => [a, a]))}
          <div class="field wide"><span class="lbl">${esc(t('f_hashValue'))}</span><small>${esc(t('f_hashValue_h'))}</small>
            <div class="row"><input data-o="${o}" data-k="hashValue" value="${esc(c.hashValue)}" class="mono grow" autocomplete="off" spellcheck="false" aria-label="${esc(t('f_hashValue'))}">
            <button type="button" class="btn" data-a="hash" data-id="${o}">${esc(t('btn_hash'))}</button></div></div>
          ${sel(o, 'exec', t('f_exec'), yesNo())}
          ${sel(o, 'archive', t('f_archive'), yesNo(), { hint: t('f_archive_h') })}
          ${sel(o, 'structured', t('f_structured'), yesNo(), { hint: t('f_structured_h') })}
          ${isProduct ? '' : sel(o, 'scope', t('f_scope'), [['', t('scope_required')], ['optional', t('scope_optional')], ['excluded', t('scope_excluded')]])}
          ${inp(o, 'srcUrl', t('f_srcUrl'), { ph: t('f_url_ph') })}
          ${inp(o, 'distUrl', t('f_distUrl'), { ph: t('f_url_ph') })}
          ${inp(o, 'description', t('f_description'), { wide: true })}
        </div>
      </details>
      ${isProduct ? '' : `<div class="deps"><div class="lbl">${esc(t('deps'))}</div>
        <label class="check"><input type="checkbox" data-o="${o}" data-k="direct" ${c.direct !== false ? 'checked' : ''}><span>${esc(t('f_direct'))}</span></label>
        <div class="small muted">${esc(others.length ? t('deps_needs') : t('deps_none'))}</div>
        <div class="chips">${others.map(x => `<label class="chip"><input type="checkbox" data-dep="${x.id}" data-o="${o}" ${(c.deps || []).includes(x.id) ? 'checked' : ''}><span>${esc(x.name || t('comp_new'))}${x.version ? ' ' + esc(x.version) : ''}</span></label>`).join('')}</div>
      </div>`}`;
  }

  const compTitle = c => `<strong>${esc(c.name || t('comp_new'))}</strong> <span class="muted">${esc(c.version || '')}</span>`;
  function compCard(c) {
    const isOpen = open.has(c.id);
    return `<details class="comp" data-comp="${c.id}" ${isOpen ? 'open' : ''}>
      <summary><span class="ttl" data-title="${c.id}">${compTitle(c)}</span><span class="tag">${esc(t('type_' + c.type))}</span>
        <button type="button" class="btn small danger" data-a="del" data-id="${c.id}">${esc(t('btn_del'))}</button></summary>
      <div class="body">${isOpen ? compFields(c, false) : ''}</div>
    </details>`;
  }

  // ---------- Page ----------
  function render() {
    document.title = t('title');
    const sb = state.sbom;
    $('#app').innerHTML = `
      <header class="top"><div class="wrap">
        <div><h1>${esc(t('title'))}</h1><p>${esc(t('subtitle'))}</p></div>
        <div class="row">
          <button class="btn ghost" data-a="example">${esc(t('btn_example'))}</button>
          <button class="btn ghost" data-a="import">${esc(t('btn_import'))}</button>
          <button class="btn ghost" data-a="new">${esc(t('btn_new'))}</button>
          <button class="btn ghost" data-a="privacy">${esc(t('btn_privacy'))}</button>
          <button class="btn ghost" data-a="lang" title="${esc(t('lang_title'))}" aria-label="${esc(t('lang_title'))}">${esc(t('btn_lang'))}</button>
        </div>
      </div></header>
      <main class="wrap">
        <p class="intro">${esc(t('intro'))}</p>
        <section class="card"><h2><span class="n">1</span>${esc(t('s1'))}</h2><p class="muted">${esc(t('s1_hint'))}</p>
          <div class="grid">
            ${inp('sbom', 'authorName', t('f_authorName'), { ph: t('f_authorName_ph') })}
            ${inp('sbom', 'authorContact', t('f_authorContact'), { ph: t('f_authorContact_ph'), hint: t('f_authorContact_h') })}
            ${inp('sbom', 'authorOrg', t('f_authorOrg'), { ph: t('f_authorOrg_ph') })}
            ${sel('sbom', 'phase', t('f_phase'), CDX.PHASES.map(p => [p, t('phase_' + p)]), { hint: t('f_phase_h') })}
            ${inp('sbom', 'version', t('f_sbomVersion'), { type: 'number', hint: t('f_sbomVersion_h') })}
          </div>
        </section>
        <section class="card"><h2><span class="n">2</span>${esc(t('s2'))}</h2><p class="muted">${esc(t('s2_hint'))}</p>
          ${compFields(state.product, true)}
        </section>
        <section class="card"><h2><span class="n">3</span>${esc(t('s3'))} <span class="count" id="compCount"></span></h2><p class="muted">${esc(t('s3_hint'))}</p>
          <div id="compList">${state.components.map(compCard).join('') || `<div class="empty">${esc(t('comp_empty'))}</div>`}</div>
          <div class="row" style="margin-top:12px"><button class="btn primary" data-a="add">＋ ${esc(t('btn_add'))}</button><button class="btn" data-a="csv">${esc(t('btn_csv'))}</button></div>
          <p class="small muted">${esc(t('csv_hint'))}</p>
        </section>
        <section class="card"><h2><span class="n">4</span>${esc(t('s4'))}</h2><p class="muted">${esc(t('s4_hint'))}</p>
          <div id="checks" class="checks"></div>
          <p class="small muted">${esc(t('check_note'))}</p>
        </section>
        <section class="card"><h2><span class="n">5</span>${esc(t('s5'))}</h2><p class="muted">${esc(t('s5_hint'))}</p>
          <div class="row"><button class="btn primary big" data-a="download">${esc(t('btn_download'))}</button><button class="btn" data-a="copy">${esc(t('btn_copy'))}</button><span class="muted small" id="stat"></span></div>
          <details class="more" data-more="preview" ${open.has('more-preview') ? 'open' : ''}><summary>${esc(t('preview'))}</summary><pre id="preview" class="mono"></pre></details>
        </section>
        <p class="small muted foot">${esc(t('saved_note'))} · <a href="#" data-a="privacy">${esc(t('btn_privacy'))}</a> · CycloneDX 1.6 · v${esc(CDX.TOOL.version)}</p>
      </main>
      <datalist id="spdxList">${CDX.SPDX.map(x => `<option value="${x}">`).join('')}</datalist>
      <div id="modal" class="modal" hidden><div class="modal-card" role="dialog" aria-modal="true"><div class="modal-head"><h2 id="modalTitle"></h2><button class="btn small" data-a="close">${esc(t('close'))}</button></div><div id="modalBody"></div></div></div>
      <div id="toast" class="toast" role="status" aria-live="polite"></div>
      <input type="file" id="filePick" hidden>`;
    refresh();
  }

  function checksHtml() {
    const list = CDX.checks(state);
    return ['cdx', 'cisa', 'bsi'].map(g => {
      const items = list.filter(c => c.group === g);
      const counted = items.filter(c => c.state !== 'na' && !c.rec);
      const ok = counted.filter(c => c.state !== 'miss').length;
      const all = ok === counted.length;
      return `<div class="check-card ${all ? 'ok' : ''}"><h3>${esc(t('g_' + g))}</h3><div class="small muted">${esc(t('g_' + g + '_d'))}</div>
        <div class="sum ${all ? 'ok' : 'open'}">${all ? '✓ ' : ''}${esc(t('sum', ok, counted.length))}</div>
        <ul>${items.map(c => {
          const icon = c.state === 'ok' || c.state === 'auto' ? '✓' : c.state === 'na' ? '–' : (c.rec ? '○' : '✗');
          const cls = c.state === 'ok' || c.state === 'auto' ? 'ok' : c.state === 'na' ? 'na' : (c.rec ? 'rec' : 'miss');
          const note = c.state === 'auto' ? t('st_auto') : c.state === 'na' ? t('st_na') : (c.state === 'miss' && c.total != null ? t('miss_of', c.miss, c.total) : (c.rec && c.state === 'miss' ? t('st_rec') : ''));
          return `<li class="${cls}"><span class="ic">${icon}</span><span>${esc(t(c.id))}${note ? ` <span class="muted small">(${esc(note)}${c.rec && c.total != null && c.state === 'miss' ? ', ' + esc(t('st_rec')) : ''})</span>` : ''}</span></li>`;
        }).join('')}</ul>
        ${g === 'cisa' ? `<div class="small muted">${esc(t('sig_note'))}</div>` : ''}</div>`;
    }).join('');
  }

  const bomText = () => JSON.stringify(CDX.build(state), null, 2);
  function refresh() {
    const text = bomText();
    const pre = $('#preview'); if (pre) pre.textContent = text;
    const ch = $('#checks'); if (ch) ch.innerHTML = checksHtml();
    const st = $('#stat'); if (st) st.textContent = t('stat', state.components.length, Math.max(1, Math.round(text.length / 1024)));
    const cc = $('#compCount'); if (cc) cc.textContent = '(' + state.components.length + ')';
  }

  let toastT;
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3200); }
  function modal(title, html) { $('#modalTitle').textContent = title; $('#modalBody').innerHTML = html; $('#modal').hidden = false; }

  function download(name, content) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'application/vnd.cyclonedx+json' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const fileSafe = s => String(s || '').trim().replace(/[^\w.\-]+/g, '_').replace(/^_+|_+$/g, '');

  function pick(accept, cb) {
    const f = $('#filePick'); f.value = ''; f.accept = accept;
    f.onchange = () => { if (f.files[0]) cb(f.files[0]); };
    f.click();
  }

  function example() {
    const mk = o => Object.assign(blankComp(), o);
    const a = mk({ name: 'openssl', version: '3.0.13', type: 'library', supplier: 'OpenSSL Software Foundation', contact: 'https://www.openssl.org', license: 'Apache-2.0', purl: 'pkg:generic/openssl@3.0.13', cpe: 'cpe:2.3:a:openssl:openssl:3.0.13:*:*:*:*:*:*:*', filename: 'libssl.so.3', exec: 'yes', archive: 'no', structured: 'no', srcUrl: 'https://github.com/openssl/openssl', direct: false });
    const b = mk({ name: 'log4j-core', version: '2.23.1', type: 'library', supplier: 'The Apache Software Foundation', contact: 'https://logging.apache.org', license: 'Apache-2.0', purl: 'pkg:maven/org.apache.logging.log4j/log4j-core@2.23.1', filename: 'log4j-core-2.23.1.jar', exec: 'yes', archive: 'yes', structured: 'yes' });
    const c = mk({ name: 'OPC UA Gateway', version: '1.4.0', type: 'application', supplier: I18N.lang === 'de' ? 'Muster Maschinenbau GmbH' : 'Sample Machinery Ltd', contact: 'psirt@example.com', license: I18N.lang === 'de' ? 'Proprietär' : 'Proprietary', purl: 'pkg:generic/opcua-gateway@1.4.0', filename: 'opcua-gateway', exec: 'yes', archive: 'no', structured: 'no', deps: [a.id] });
    const d = mk({ name: 'Debian GNU/Linux', version: '12', type: 'operating-system', supplier: 'Debian', contact: 'https://www.debian.org', license: 'GPL-2.0-or-later', cpe: 'cpe:2.3:o:debian:debian_linux:12.0:*:*:*:*:*:*:*' });
    state = blankState();
    Object.assign(state.sbom, { authorName: 'Product Security', authorContact: 'psirt@example.com', authorOrg: c.supplier, phase: 'build' });
    Object.assign(state.product, { name: I18N.lang === 'de' ? 'Maschinensteuerung Beispiel' : 'Example machine controller', version: '2.1.0', type: 'application', supplier: c.supplier, contact: 'psirt@example.com', license: c.license, filename: 'controller-2.1.0.img', exec: 'yes', archive: 'yes', structured: 'no' });
    state.components = [c, a, b, d];
    open.clear(); save(); render(); toast(t('example_done'));
  }

  function importCsv(text) {
    let n = 0;
    text.split(/\r?\n/).filter(l => l.trim()).forEach((l, i) => {
      const cols = l.split(l.includes(';') ? ';' : l.includes('\t') ? '\t' : ',').map(x => x.trim().replace(/^"|"$/g, ''));
      if (i === 0 && /^name$/i.test(cols[0])) return;
      if (!cols[0]) return;
      const type = (cols[3] || '').toLowerCase();
      state.components.push(Object.assign(blankComp(), { name: cols[0], version: cols[1] || '', supplier: cols[2] || '', type: CDX.TYPES.includes(type) ? type : 'library', license: cols[4] || '', purl: cols[5] || '', cpe: cols[6] || '' }));
      n++;
    });
    if (!n) return toast(t('csv_none'));
    save(); render(); toast(t('csv_done', n));
  }

  async function hashFile(file, id) {
    const c = obj(id); if (!c) return;
    const web = { 'SHA-512': 'SHA-512', 'SHA-256': 'SHA-256', 'SHA-384': 'SHA-384', 'SHA-1': 'SHA-1' };
    if (!web[c.hashAlg]) c.hashAlg = 'SHA-512';
    toast(t('hash_busy'));
    try {
      const buf = await crypto.subtle.digest(web[c.hashAlg], await file.arrayBuffer());
      c.hashValue = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (!c.filename) c.filename = file.name;
      open.add('more-' + id); if (id !== 'product') open.add(id);
      save(); render(); toast(t('hash_done'));
    } catch (e) { toast(t('hash_fail')); }
  }

  // ---------- Events ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el) return;
    const a = el.dataset.a;
    if (el.tagName === 'A' || el.closest('summary')) e.preventDefault();
    switch (a) {
      case 'lang': I18N.set(I18N.lang === 'de' ? 'en' : 'de'); render(); break;
      case 'privacy': modal(t('privacy_title'), t('privacy_html')); break;
      case 'close': $('#modal').hidden = true; break;
      case 'example': if (!hasData() || confirm(t('confirm_replace'))) example(); break;
      case 'new': if (confirm(t('confirm_new'))) { state = blankState(); open.clear(); try { localStorage.removeItem(STORE); } catch (err) { /* ignore */ } render(); } break;
      case 'add': { const c = blankComp(); state.components.push(c); open.add(c.id); save(); render(); const f = document.querySelector(`[data-comp="${c.id}"] input[data-k="name"]`); if (f) f.focus(); break; }
      case 'del': {
        const c = obj(el.dataset.id);
        if (c && (!c.name || confirm(t('confirm_del', c.name)))) {
          state.components = state.components.filter(x => x.id !== c.id);
          state.components.forEach(x => { x.deps = (x.deps || []).filter(d => d !== c.id); });
          save(); render();
        }
        break;
      }
      case 'csv': pick('.csv,.txt', f => f.text().then(importCsv)); break;
      case 'hash': hashTarget = el.dataset.id; pick('', f => hashFile(f, hashTarget)); break;
      case 'import': pick('.json,.cdx', f => f.text().then(txt => {
        if (hasData() && !confirm(t('confirm_replace'))) return;
        try { state = CDX.parse(JSON.parse(txt), blankComp); open.clear(); save(); render(); toast(t('import_done', state.components.length)); }
        catch (err) { toast(t('import_fail')); }
      })); break;
      case 'download': {
        const p = state.product;
        download((fileSafe([p.name, p.version].filter(Boolean).join('-')) || 'sbom') + '.cdx.json', bomText());
        toast(t('downloaded')); break;
      }
      case 'copy': (navigator.clipboard ? navigator.clipboard.writeText(bomText()) : Promise.reject()).then(() => toast(t('copied')), () => toast(t('copy_fail'))); break;
    }
  });
  const hasData = () => !!(state.product.name || state.components.length || state.sbom.authorName);

  function onEdit(e) {
    const el = e.target;
    if (el.dataset.dep) {
      const c = obj(el.dataset.o); if (!c) return;
      const s = new Set(c.deps || []); el.checked ? s.add(el.dataset.dep) : s.delete(el.dataset.dep); c.deps = [...s];
    } else if (el.dataset.o && el.dataset.k) {
      const o = obj(el.dataset.o); if (!o) return;
      o[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value;
      if (el.dataset.k === 'name' || el.dataset.k === 'version') { const ttl = document.querySelector(`[data-title="${el.dataset.o}"]`); if (ttl) ttl.innerHTML = compTitle(o); }
    } else return;
    save(); refresh();
  }
  document.addEventListener('input', onEdit);
  document.addEventListener('change', onEdit);

  // Build a component's fields only when it is opened, so the dependency list is always current
  document.addEventListener('toggle', e => {
    const d = e.target;
    if (!d.matches) return;
    if (d.matches('details[data-comp]')) {
      const id = d.dataset.comp;
      if (!d.open) { open.delete(id); return; }
      open.add(id);
      const c = obj(id); if (c) d.querySelector('.body').innerHTML = compFields(c, false);
    } else if (d.matches('details[data-more]')) {
      d.open ? open.add('more-' + d.dataset.more) : open.delete('more-' + d.dataset.more);
    }
  }, true);

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal') && !$('#modal').hidden) $('#modal').hidden = true; });
  document.addEventListener('click', e => { if (e.target.id === 'modal') e.target.hidden = true; });

  render();
})();
