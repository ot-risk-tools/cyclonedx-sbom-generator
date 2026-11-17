/* CycloneDX 1.6 (JSON): build a BOM from the form state, read an existing BOM back in, and check completeness.
 * Field mapping follows the CycloneDX 1.6 schema, the 2026 Minimum Elements for an SBOM (CISA and partners)
 * and BSI TR-03183-2 (with the "bsi:component:*" property taxonomy). No network access anywhere. */
(function () {
  'use strict';
  const TOOL = { name: 'SBOM Generator for CycloneDX (unofficial)', version: '1.0.1' };
  const TYPES = ['application', 'library', 'framework', 'firmware', 'operating-system', 'device', 'device-driver', 'container', 'platform', 'file', 'data', 'machine-learning-model', 'cryptographic-asset'];
  const PHASES = ['design', 'pre-build', 'build', 'post-build', 'operations', 'discovery', 'decommission'];
  const HASH_LEN = { 'SHA-512': 128, 'SHA-256': 64, 'SHA-384': 96, 'SHA-1': 40, 'MD5': 32, 'SHA3-256': 64, 'SHA3-384': 96, 'SHA3-512': 128 };
  // Common SPDX identifiers. Only these are written as license.id (the schema accepts SPDX ids only); anything else becomes a name or an expression.
  const SPDX = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', '0BSD', 'ISC', 'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later', 'LGPL-2.1-only', 'LGPL-2.1-or-later', 'LGPL-3.0-only', 'LGPL-3.0-or-later', 'AGPL-3.0-only', 'AGPL-3.0-or-later', 'MPL-2.0', 'EPL-1.0', 'EPL-2.0', 'EUPL-1.2', 'CDDL-1.0', 'Unlicense', 'CC0-1.0', 'CC-BY-4.0', 'Zlib', 'BSL-1.0', 'OpenSSL', 'Python-2.0', 'PostgreSQL', 'Artistic-2.0', 'OFL-1.1', 'curl', 'BSD-4-Clause', 'Apache-1.1', 'WTFPL'];

  const s = v => String(v == null ? '' : v).trim();
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s(v));
  const isUrl = v => /^https?:\/\/\S+$/i.test(s(v));
  const isContact = v => isEmail(v) || isUrl(v);
  const hashOk = (alg, v) => { const h = s(v); return !!h && new RegExp('^[0-9a-fA-F]{' + (HASH_LEN[alg] || 0) + '}$').test(h); };
  const purlOk = v => !s(v) || /^pkg:[a-z0-9.+-]+\/\S+$/i.test(s(v));
  const cpeOk = v => !s(v) || /^cpe:2\.3:[aho*-]:\S+$/i.test(s(v)) || /^cpe:\/[aho]:\S+$/i.test(s(v));

  function newSerial() {
    const u = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
    return 'urn:uuid:' + u.toLowerCase();
  }

  /** Removes undefined values, empty strings, empty arrays and empty objects */
  function clean(o) {
    if (Array.isArray(o)) { const a = o.map(clean).filter(x => x !== undefined); return a.length ? a : undefined; }
    if (o && typeof o === 'object') {
      const r = {};
      Object.keys(o).forEach(k => { const v = clean(o[k]); if (v !== undefined) r[k] = v; });
      return Object.keys(r).length ? r : undefined;
    }
    return (o === '' || o == null) ? undefined : o;
  }

  function entity(name, contact) {
    const n = s(name), c = s(contact);
    if (!n && !c) return undefined;
    return { name: n || undefined, url: isUrl(c) ? [c] : undefined, contact: isEmail(c) ? [{ email: c }] : undefined };
  }

  function licenses(v) {
    const l = s(v);
    if (!l) return undefined;
    if (SPDX.includes(l)) return [{ license: { id: l } }];
    if (/\s(AND|OR|WITH)\s/.test(l)) return [{ expression: l }];
    return [{ license: { name: l } }];
  }

  const FLAG = {
    exec: { name: 'bsi:component:executable', yes: 'executable', no: 'non-executable' },
    archive: { name: 'bsi:component:archive', yes: 'archive', no: 'no archive' },
    structured: { name: 'bsi:component:structured', yes: 'structured', no: 'unstructured' }
  };

  function component(c, ref, isProduct) {
    const props = [];
    if (s(c.filename)) props.push({ name: 'bsi:component:filename', value: s(c.filename) });
    Object.keys(FLAG).forEach(k => { if (c[k] === 'yes' || c[k] === 'no') props.push({ name: FLAG[k].name, value: FLAG[k][c[k]] }); });
    const ext = [];
    if (isUrl(c.srcUrl)) ext.push({ type: 'vcs', url: s(c.srcUrl) });
    if (isUrl(c.distUrl)) ext.push({ type: 'distribution', url: s(c.distUrl) });
    const org = entity(c.supplier, c.contact);
    return clean({
      'bom-ref': ref,
      type: TYPES.includes(c.type) ? c.type : (isProduct ? 'application' : 'library'),
      supplier: org,
      manufacturer: org,
      name: s(c.name) || (isProduct ? 'unnamed product' : 'unnamed component'),
      version: s(c.version),
      description: s(c.description),
      scope: (!isProduct && ['optional', 'excluded'].includes(c.scope)) ? c.scope : undefined,
      hashes: hashOk(c.hashAlg, c.hashValue) ? [{ alg: c.hashAlg, content: s(c.hashValue).toLowerCase() }] : undefined,
      licenses: licenses(c.license),
      cpe: cpeOk(c.cpe) ? s(c.cpe) : undefined,
      purl: purlOk(c.purl) ? s(c.purl) : undefined,
      externalReferences: ext,
      properties: props
    });
  }

  function build(state) {
    const sb = state.sbom, ids = new Set(state.components.map(c => c.id));
    const contact = s(sb.authorContact);
    const bom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      serialNumber: sb.serial,
      version: Math.max(1, parseInt(sb.version, 10) || 1),
      metadata: clean({
        timestamp: new Date().toISOString(),
        lifecycles: PHASES.includes(sb.phase) ? [{ phase: sb.phase }] : undefined,
        tools: { components: [{ type: 'application', name: TOOL.name, version: TOOL.version }] },
        authors: (s(sb.authorName) || isEmail(contact)) ? [{ name: s(sb.authorName), email: isEmail(contact) ? contact : undefined }] : undefined,
        component: component(state.product, 'product', true),
        supplier: (s(sb.authorOrg) || isUrl(contact)) ? { name: s(sb.authorOrg) || s(sb.authorName), url: isUrl(contact) ? [contact] : undefined } : undefined
      }),
      components: state.components.map(c => component(c, c.id, false)),
      dependencies: [{ ref: 'product', dependsOn: state.components.filter(c => c.direct !== false).map(c => c.id) }]
        .concat(state.components.map(c => ({ ref: c.id, dependsOn: (c.deps || []).filter(d => ids.has(d) && d !== c.id) })))
    };
    return bom;
  }

  // ---------- Read an existing CycloneDX file back into the form ----------
  function licenseText(arr) {
    const x = (arr || [])[0];
    if (!x) return '';
    return x.expression || (x.license && (x.license.id || x.license.name)) || '';
  }
  function fromComponent(c, base) {
    const prop = n => ((c.properties || []).find(p => p.name === n) || {}).value;
    const flag = k => { const v = prop(FLAG[k].name); return v === FLAG[k].yes ? 'yes' : v === FLAG[k].no ? 'no' : ''; };
    const org = c.supplier || c.manufacturer || {};
    const ext = t => ((c.externalReferences || []).find(e => e.type === t) || {}).url || '';
    const h = (c.hashes || []).find(x => x.alg === 'SHA-512') || (c.hashes || [])[0] || {};
    return Object.assign(base, {
      name: c.name || '', version: c.version || '', type: TYPES.includes(c.type) ? c.type : base.type,
      supplier: org.name || c.publisher || c.group || '',
      contact: ((org.contact || [])[0] || {}).email || (org.url || [])[0] || '',
      license: licenseText(c.licenses), purl: c.purl || '', cpe: c.cpe || '',
      filename: prop('bsi:component:filename') || '', hashAlg: HASH_LEN[h.alg] ? h.alg : 'SHA-512', hashValue: h.content || '',
      exec: flag('exec'), archive: flag('archive'), structured: flag('structured'),
      scope: c.scope || '', srcUrl: ext('vcs'), distUrl: ext('distribution'), description: c.description || ''
    });
  }

  /** blankComp() supplies a fresh component with default values and a new id */
  function parse(j, blankComp) {
    if (!j || j.bomFormat !== 'CycloneDX') throw new Error('not-cyclonedx');
    const m = j.metadata || {};
    const author = (m.authors || [])[0] || {};
    const sup = m.supplier || m.manufacturer || {};
    const refMap = {}, components = [];
    const walk = arr => (arr || []).forEach(c => {
      const n = fromComponent(c, blankComp());
      if (c['bom-ref']) refMap[c['bom-ref']] = n.id;
      n.direct = false;
      components.push(n);
      walk(c.components);
    });
    walk(j.components);
    const rootRef = m.component && m.component['bom-ref'];
    let sawRoot = false;
    (j.dependencies || []).forEach(d => {
      const list = (d.dependsOn || []).map(r => refMap[r]).filter(Boolean);
      if (rootRef && d.ref === rootRef) { sawRoot = true; components.forEach(c => { if (list.includes(c.id)) c.direct = true; }); }
      else { const c = components.find(x => x.id === refMap[d.ref]); if (c) c.deps = list; }
    });
    if (!sawRoot) components.forEach(c => { c.direct = true; });
    const product = fromComponent(m.component || {}, Object.assign(blankComp(), { id: 'product', type: 'application' }));
    product.id = 'product';
    return {
      sbom: {
        authorName: author.name || '', authorContact: author.email || (sup.url || [])[0] || '', authorOrg: sup.name || '',
        phase: ((m.lifecycles || [])[0] || {}).phase || 'build',
        version: (parseInt(j.version, 10) || 1) + 1,
        serial: /^urn:uuid:/.test(j.serialNumber || '') ? j.serialNumber : newSerial()
      },
      product, components
    };
  }

  // ---------- Completeness checks ----------
  /** Returns [{group, id, state:'ok'|'miss'|'auto'|'na', miss, total, rec}] */
  function checks(state) {
    const sb = state.sbom, p = state.product, comps = state.components, all = [p].concat(comps);
    const out = [];
    const one = (group, id, ok, rec) => out.push({ group, id, state: ok ? 'ok' : 'miss', rec: !!rec });
    const auto = (group, id) => out.push({ group, id, state: 'auto' });
    const each = (group, id, list, fn, rec) => { const miss = list.filter(c => !fn(c)).length; out.push({ group, id, state: miss ? 'miss' : 'ok', miss, total: list.length, rec: !!rec }); };
    const has = k => c => !!s(c[k]);

    // CycloneDX format
    one('cdx', 'c_product_name', !!s(p.name));
    one('cdx', 'c_has_components', comps.length > 0, true);
    each('cdx', 'c_comp_names', comps, has('name'));
    each('cdx', 'c_hash_format', all, c => !s(c.hashValue) || hashOk(c.hashAlg, c.hashValue));
    each('cdx', 'c_ids_format', all, c => purlOk(c.purl) && cpeOk(c.cpe));
    auto('cdx', 'c_auto');

    // 2026 Minimum Elements (CISA and partners)
    one('cisa', 's_author', !!s(sb.authorName));
    auto('cisa', 's_timestamp'); auto('cisa', 's_format');
    one('cisa', 's_context', PHASES.includes(sb.phase));
    auto('cisa', 's_tool'); auto('cisa', 's_version');
    out.push({ group: 'cisa', id: 's_signature', state: 'na' });
    each('cisa', 'k_producer', all, has('supplier'));
    each('cisa', 'k_name', all, has('name'));
    each('cisa', 'k_version', all, has('version'));
    each('cisa', 'k_identifier', comps, c => (s(c.purl) && purlOk(c.purl)) || (s(c.cpe) && cpeOk(c.cpe)));
    auto('cisa', 'k_deps');
    each('cisa', 'k_hash', comps, c => hashOk(c.hashAlg, c.hashValue));
    each('cisa', 'k_license', all, has('license'));

    // BSI TR-03183-2
    one('bsi', 'b_creator', isContact(sb.authorContact));
    auto('bsi', 'b_timestamp');
    each('bsi', 'b_comp_creator', all, c => isContact(c.contact));
    each('bsi', 'b_name', all, has('name'));
    each('bsi', 'b_version', all, has('version'));
    each('bsi', 'b_filename', all, has('filename'));
    auto('bsi', 'b_deps');
    each('bsi', 'b_license', all, has('license'));
    each('bsi', 'b_sha512', all, c => c.hashAlg === 'SHA-512' && hashOk(c.hashAlg, c.hashValue));
    each('bsi', 'b_flags', all, c => ['exec', 'archive', 'structured'].every(k => c[k] === 'yes' || c[k] === 'no'));
    each('bsi', 'b_identifier', comps, c => !!s(c.purl) || !!s(c.cpe), true);
    return out;
  }

  window.CDX = { TOOL, TYPES, PHASES, HASH_LEN, SPDX, build, parse, checks, newSerial, isContact, hashOk, purlOk, cpeOk };
})();
