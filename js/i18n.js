/* All texts of the app in German and English. t('key') returns the text for the active language. */
(function () {
  'use strict';
  const T = {
    de: {
      title: 'SBOM-Generator für CycloneDX',
      subtitle: 'Software-Stückliste (SBOM) im Format CycloneDX 1.6 per Formular erstellen',
      intro: 'Trage ein, was du weißt. Weiter unten siehst du jederzeit, welche Vorgaben schon erfüllt sind, und kannst die fertige Datei herunterladen. Alle Eingaben bleiben auf deinem Gerät.',
      btn_example: 'Beispiel laden', btn_new: 'Neu beginnen', btn_import: 'CycloneDX-Datei öffnen', btn_privacy: 'Datenschutz & Rechtliches', btn_lang: 'EN', lang_title: 'English version',
      s1: 'Über diese Stückliste', s1_hint: 'Wer hat die Stückliste erstellt und wann im Entwicklungsablauf?',
      s2: 'Produkt', s2_hint: 'Das Produkt, für das die Stückliste gilt, z. B. die Maschinensoftware oder ein Gerät mit Firmware.',
      s3: 'Komponenten', s3_hint: 'Alles, was im Produkt enthalten ist: Bibliotheken, Betriebssystem, Firmware, zugekaufte Software.',
      s4: 'Prüfung', s4_hint: 'Welche Vorgaben erfüllt die Stückliste schon?',
      s5: 'Ergebnis', s5_hint: 'Die fertige Datei. Sie aktualisiert sich bei jeder Eingabe.',
      f_authorName: 'Ersteller der Stückliste', f_authorName_ph: 'z. B. Max Muster oder Abteilung Product Security',
      f_authorContact: 'E-Mail oder Web-Adresse des Erstellers', f_authorContact_h: 'Das BSI verlangt eine E-Mail-Adresse, ersatzweise eine Web-Adresse (https://…).', f_authorContact_ph: 'z. B. psirt@firma.de',
      f_authorOrg: 'Unternehmen', f_authorOrg_ph: 'z. B. Muster Maschinenbau GmbH',
      f_phase: 'Zeitpunkt der Erstellung', f_phase_h: 'In welcher Phase wurde die Stückliste erstellt? Für ein ausgeliefertes Produkt meist „Build“.',
      f_sbomVersion: 'Version der Stückliste', f_sbomVersion_h: 'Erste Fassung = 1. Bei jeder Korrektur derselben Stückliste um 1 erhöhen.',
      phase_design: 'Entwurf (design)', 'phase_pre-build': 'Vor dem Build (pre-build)', phase_build: 'Build', 'phase_post-build': 'Nach dem Build (post-build)', phase_operations: 'Betrieb (operations)', phase_discovery: 'Bestandsaufnahme (discovery)', phase_decommission: 'Außerbetriebnahme (decommission)',
      f_name: 'Name', f_name_ph_p: 'z. B. Maschinensteuerung XY', f_name_ph_c: 'z. B. openssl',
      f_version: 'Version', f_version_ph: 'z. B. 3.0.13',
      f_type: 'Art',
      f_supplier: 'Hersteller', f_supplier_ph: 'z. B. OpenSSL Software Foundation',
      f_contact: 'E-Mail oder Web-Adresse des Herstellers', f_contact_ph: 'z. B. https://www.openssl.org',
      f_license: 'Lizenz', f_license_h: 'Am besten ein SPDX-Kürzel aus der Vorschlagsliste; sonst frei eintragen, z. B. „Proprietär“.', f_license_ph: 'z. B. Apache-2.0',
      f_purl: 'Package-URL (PURL)', f_purl_h: 'Maschinenlesbare Kennung für Software-Pakete.', f_purl_ph: 'pkg:generic/openssl@3.0.13',
      f_cpe: 'CPE', f_cpe_h: 'Kennung aus dem NVD-Produktverzeichnis, vor allem für Geräte und Firmware.', f_cpe_ph: 'cpe:2.3:a:openssl:openssl:3.0.13:*:*:*:*:*:*:*',
      more: 'Weitere Angaben (Datei, Prüfsumme, BSI TR-03183)',
      f_filename: 'Dateiname', f_filename_h: 'Name der ausgelieferten Datei, ohne Pfad.', f_filename_ph: 'z. B. libssl.so.3',
      f_hashAlg: 'Prüfsummen-Verfahren', f_hashValue: 'Prüfsumme (Hash)', f_hashValue_h: 'Das BSI verlangt SHA-512. Am einfachsten: Datei auswählen, die App rechnet auf deinem Gerät.',
      btn_hash: 'Aus Datei berechnen', hash_busy: 'Berechne …', hash_done: 'Prüfsumme berechnet. Die Datei wurde nicht hochgeladen.', hash_fail: 'Die Prüfsumme konnte nicht berechnet werden.',
      f_exec: 'Ausführbar?', f_archive: 'Archiv?', f_archive_h: 'z. B. zip, tar, jar', f_structured: 'Strukturiert?', f_structured_h: 'Enthält die Datei noch lesbare Angaben zum Inhalt (z. B. ein unkomprimiertes Paket)?',
      opt_unknown: '– nicht angegeben –', opt_yes: 'ja', opt_no: 'nein',
      f_srcUrl: 'Adresse des Quellcodes', f_distUrl: 'Download-Adresse der ausgelieferten Fassung', f_url_ph: 'https://…',
      f_description: 'Beschreibung',
      f_scope: 'Verwendung', scope_required: 'wird benötigt (Standard)', scope_optional: 'optional', scope_excluded: 'nicht ausgeliefert (z. B. nur für Tests)',
      type_application: 'Anwendung', type_library: 'Bibliothek', type_framework: 'Framework', type_firmware: 'Firmware', 'type_operating-system': 'Betriebssystem', type_device: 'Gerät (Hardware)', 'type_device-driver': 'Gerätetreiber', type_container: 'Container', type_platform: 'Plattform', type_file: 'Datei', type_data: 'Daten', 'type_machine-learning-model': 'KI-Modell', 'type_cryptographic-asset': 'Kryptografie-Baustein',
      deps: 'Abhängigkeiten', f_direct: 'Wird direkt vom Produkt verwendet', deps_needs: 'Diese Komponente benötigt selbst:', deps_none: 'Noch keine anderen Komponenten vorhanden.',
      btn_add: 'Komponente hinzufügen', btn_csv: 'Liste importieren (CSV)', btn_del: 'Entfernen', comp_new: 'Neue Komponente', comp_empty: 'Noch keine Komponenten. Klicke auf „Komponente hinzufügen“.',
      csv_hint: 'CSV-Spalten: Name; Version; Hersteller; Art; Lizenz; PURL; CPE. Nur der Name ist Pflicht.',
      csv_done: n => `${n} Komponente(n) importiert`, csv_none: 'In der Datei wurde keine Komponente gefunden.',
      g_cdx: 'CycloneDX-Format', g_cdx_d: 'Die Datei ist formal gültig.',
      g_cisa: 'Mindestangaben 2026 (CISA und Partner)', g_cisa_d: 'Internationale Mindestangaben für Stücklisten, Stand Juli 2026.',
      g_bsi: 'BSI TR-03183-2', g_bsi_d: 'Deutsche Richtlinie, wichtig für den Cyber Resilience Act.',
      sum: (a, b) => `${a} von ${b} erfüllt`, miss_of: (m, n) => `fehlt bei ${m} von ${n}`, st_auto: 'automatisch', st_na: 'nicht enthalten', st_rec: 'empfohlen',
      c_product_name: 'Produktname', c_has_components: 'Mindestens eine Komponente', c_comp_names: 'Jede Komponente hat einen Namen', c_hash_format: 'Prüfsummen haben die richtige Länge', c_ids_format: 'PURL und CPE sind richtig aufgebaut', c_auto: 'Format, Version, Seriennummer, Zeitstempel',
      s_author: 'Ersteller der Stückliste', s_timestamp: 'Zeitstempel', s_format: 'Format und Formatversion', s_context: 'Zeitpunkt der Erstellung', s_tool: 'Werkzeug und Werkzeugversion', s_version: 'Version der Stückliste', s_signature: 'Digitale Signatur des Erstellers',
      k_producer: 'Hersteller', k_name: 'Name', k_version: 'Version', k_identifier: 'Kennung (PURL oder CPE)', k_deps: 'Abhängigkeiten', k_hash: 'Prüfsumme mit Verfahren', k_license: 'Lizenz',
      b_creator: 'Ersteller mit E-Mail oder Web-Adresse', b_timestamp: 'Zeitstempel', b_comp_creator: 'Hersteller mit E-Mail oder Web-Adresse', b_name: 'Name', b_version: 'Version', b_filename: 'Dateiname', b_deps: 'Abhängigkeiten', b_license: 'Lizenz', b_sha512: 'Prüfsumme SHA-512', b_flags: 'Ausführbar / Archiv / Strukturiert', b_identifier: 'Kennung (PURL oder CPE)',
      sig_note: 'Eine digitale Signatur erzeugt dieses Programm nicht. Signiere die Datei bei Bedarf mit einem eigenen Werkzeug.',
      check_note: 'Die Prüfung zeigt, ob die Felder ausgefüllt sind. Ob die Angaben stimmen und die Stückliste vollständig ist, kann nur ein Mensch beurteilen.',
      btn_download: 'CycloneDX-Datei herunterladen', btn_copy: 'In die Zwischenablage kopieren', copied: 'Kopiert', copy_fail: 'Kopieren nicht möglich', downloaded: 'Datei gespeichert (Ordner „Downloads“)',
      preview: 'Vorschau der Datei', stat: (n, kb) => `${n} Komponente(n), ${kb} KB`,
      confirm_new: 'Alle Eingaben löschen und neu beginnen?', confirm_replace: 'Die aktuellen Eingaben werden ersetzt. Fortfahren?', confirm_del: n => `„${n}“ entfernen?`,
      import_fail: 'Die Datei ist keine CycloneDX-Datei im JSON-Format.', import_done: n => `Datei geöffnet: ${n} Komponente(n)`, example_done: 'Beispiel geladen',
      saved_note: 'Deine Eingaben werden automatisch in diesem Browser gespeichert.',
      close: 'Schließen',
      privacy_title: 'Datenschutz und rechtliche Hinweise',
      privacy_html: `<p><strong>Kurz gesagt: Deine Eingaben verlassen dein Gerät nicht.</strong></p>
        <ul>
          <li><strong>Keine Übertragung.</strong> Das Programm läuft vollständig in deinem Browser. Es sendet keine Eingaben an einen Server. Die Seite verbietet sich Netzwerkverbindungen sogar technisch (Content Security Policy).</li>
          <li><strong>Speicherung nur lokal.</strong> Die Eingaben werden im Speicher deines Browsers (localStorage) abgelegt, damit sie nach dem Schließen noch da sind. Sie sind unverschlüsselt. „Neu beginnen“ löscht sie.</li>
          <li><strong>Dateien bleiben lokal.</strong> Wenn du eine Datei für die Prüfsumme auswählst oder eine Stückliste öffnest, wird sie nur auf deinem Gerät gelesen und nicht hochgeladen.</li>
          <li><strong>Keine Cookies, keine Analyse, keine Werbung,</strong> keine Schriften oder Skripte von Dritten.</li>
          <li><strong>Hosting.</strong> Die Seite wird über GitHub Pages ausgeliefert. Wie jeder Webserver verarbeitet GitHub beim Abruf technische Daten wie die IP-Adresse. Darauf hat der Betreiber dieser Seite keinen Einfluss. Wer das vermeiden will, lädt das Programm herunter und öffnet die Datei <code>index.html</code> direkt.</li>
        </ul>
        <p class="muted">Eine Stückliste kann vertraulich sein. Gib die erzeugte Datei nur an Empfänger weiter, die sie erhalten sollen.</p>
        <h3>Rechtliche Hinweise</h3>
        <ul>
          <li><strong>Ohne Gewähr.</strong> Das Programm ist eine Arbeitshilfe. Für Richtigkeit und Vollständigkeit der erzeugten Stückliste ist der Ersteller verantwortlich. Die Prüfung im Programm zeigt nur, ob Felder ausgefüllt sind. Sie belegt keine Konformität mit dem Cyber Resilience Act, der BSI TR-03183 oder anderen Vorgaben und ersetzt keine Rechts- oder Normenberatung. Die Nutzung erfolgt auf eigenes Risiko, soweit das gesetzlich zulässig ist.</li>
          <li><strong>Marken.</strong> Dieses Programm ist ein inoffizielles Werkzeug und kein Produkt des CycloneDX-Projekts. CycloneDX ist ein Standard der OWASP Foundation. SPDX ist ein Projekt der Linux Foundation. Diese und andere genannte Namen gehören ihren jeweiligen Inhabern und werden nur beschreibend verwendet. Es besteht keine Verbindung zu OWASP, CISA oder dem BSI; das Programm ist von ihnen weder geprüft noch empfohlen.</li>
          <li><strong>Beispiel.</strong> Die Beispieldaten sind erfunden. Die genannten Open-Source-Komponenten dienen nur der Veranschaulichung.</li>
          <li><strong>Programmcode.</strong> Erstellt mit Unterstützung eines KI-Assistenten, ohne übernommenen Code, Bibliotheken, Schriften oder Bilder Dritter.</li>
          <li><strong>Kontakt.</strong> Hinweise, auch zu möglichen Rechtsverletzungen, bitte über die Issues des Repositorys auf GitHub. Privates, nicht kommerzielles Projekt.</li>
        </ul>`
    },
    en: {
      title: 'SBOM Generator for CycloneDX',
      subtitle: 'Create a software bill of materials (SBOM) in CycloneDX 1.6 format from a form',
      intro: 'Fill in what you know. At the bottom you can always see which requirements are already met and download the finished file. Everything you enter stays on your device.',
      btn_example: 'Load example', btn_new: 'Start over', btn_import: 'Open CycloneDX file', btn_privacy: 'Privacy & legal', btn_lang: 'DE', lang_title: 'Deutsche Fassung',
      s1: 'About this SBOM', s1_hint: 'Who created the SBOM, and at which point in the development process?',
      s2: 'Product', s2_hint: 'The product the SBOM describes, e.g. the machine software or a device with firmware.',
      s3: 'Components', s3_hint: 'Everything contained in the product: libraries, operating system, firmware, third-party software.',
      s4: 'Check', s4_hint: 'Which requirements does the SBOM already meet?',
      s5: 'Result', s5_hint: 'The finished file. It updates with every entry.',
      f_authorName: 'SBOM author', f_authorName_ph: 'e.g. Jane Doe or Product Security team',
      f_authorContact: 'Email or web address of the author', f_authorContact_h: 'The German BSI requires an email address or, failing that, a web address (https://…).', f_authorContact_ph: 'e.g. psirt@company.com',
      f_authorOrg: 'Company', f_authorOrg_ph: 'e.g. Sample Machinery Ltd',
      f_phase: 'When it was created', f_phase_h: 'In which phase was the SBOM created? For a shipped product usually “Build”.',
      f_sbomVersion: 'SBOM version', f_sbomVersion_h: 'First issue = 1. Increase by 1 each time the same SBOM is corrected.',
      phase_design: 'Design', 'phase_pre-build': 'Pre-build', phase_build: 'Build', 'phase_post-build': 'Post-build', phase_operations: 'Operations', phase_discovery: 'Discovery', phase_decommission: 'Decommission',
      f_name: 'Name', f_name_ph_p: 'e.g. Machine controller XY', f_name_ph_c: 'e.g. openssl',
      f_version: 'Version', f_version_ph: 'e.g. 3.0.13',
      f_type: 'Type',
      f_supplier: 'Producer', f_supplier_ph: 'e.g. OpenSSL Software Foundation',
      f_contact: 'Email or web address of the producer', f_contact_ph: 'e.g. https://www.openssl.org',
      f_license: 'Licence', f_license_h: 'Preferably an SPDX identifier from the suggestions; otherwise free text, e.g. “Proprietary”.', f_license_ph: 'e.g. Apache-2.0',
      f_purl: 'Package URL (PURL)', f_purl_h: 'Machine-readable identifier for software packages.', f_purl_ph: 'pkg:generic/openssl@3.0.13',
      f_cpe: 'CPE', f_cpe_h: 'Identifier from the NVD product dictionary, mainly for devices and firmware.', f_cpe_ph: 'cpe:2.3:a:openssl:openssl:3.0.13:*:*:*:*:*:*:*',
      more: 'More details (file, checksum, BSI TR-03183)',
      f_filename: 'File name', f_filename_h: 'Name of the delivered file, without the path.', f_filename_ph: 'e.g. libssl.so.3',
      f_hashAlg: 'Checksum algorithm', f_hashValue: 'Checksum (hash)', f_hashValue_h: 'The BSI requires SHA-512. Easiest: pick the file and the app computes it on your device.',
      btn_hash: 'Compute from file', hash_busy: 'Computing …', hash_done: 'Checksum computed. The file was not uploaded.', hash_fail: 'The checksum could not be computed.',
      f_exec: 'Executable?', f_archive: 'Archive?', f_archive_h: 'e.g. zip, tar, jar', f_structured: 'Structured?', f_structured_h: 'Does the file still contain readable metadata about its content (e.g. an uncompressed package)?',
      opt_unknown: '– not stated –', opt_yes: 'yes', opt_no: 'no',
      f_srcUrl: 'Source code address', f_distUrl: 'Download address of the delivered form', f_url_ph: 'https://…',
      f_description: 'Description',
      f_scope: 'Usage', scope_required: 'required (default)', scope_optional: 'optional', scope_excluded: 'not shipped (e.g. tests only)',
      type_application: 'Application', type_library: 'Library', type_framework: 'Framework', type_firmware: 'Firmware', 'type_operating-system': 'Operating system', type_device: 'Device (hardware)', 'type_device-driver': 'Device driver', type_container: 'Container', type_platform: 'Platform', type_file: 'File', type_data: 'Data', 'type_machine-learning-model': 'Machine learning model', 'type_cryptographic-asset': 'Cryptographic asset',
      deps: 'Dependencies', f_direct: 'Used directly by the product', deps_needs: 'This component itself needs:', deps_none: 'No other components yet.',
      btn_add: 'Add component', btn_csv: 'Import a list (CSV)', btn_del: 'Remove', comp_new: 'New component', comp_empty: 'No components yet. Click “Add component”.',
      csv_hint: 'CSV columns: name; version; producer; type; licence; PURL; CPE. Only the name is mandatory.',
      csv_done: n => `${n} component(s) imported`, csv_none: 'No component was found in the file.',
      g_cdx: 'CycloneDX format', g_cdx_d: 'The file is formally valid.',
      g_cisa: '2026 Minimum Elements (CISA and partners)', g_cisa_d: 'International minimum elements for an SBOM, as of July 2026.',
      g_bsi: 'BSI TR-03183-2', g_bsi_d: 'German guideline, relevant for the Cyber Resilience Act.',
      sum: (a, b) => `${a} of ${b} met`, miss_of: (m, n) => `missing for ${m} of ${n}`, st_auto: 'automatic', st_na: 'not included', st_rec: 'recommended',
      c_product_name: 'Product name', c_has_components: 'At least one component', c_comp_names: 'Every component has a name', c_hash_format: 'Checksums have the right length', c_ids_format: 'PURL and CPE are well-formed', c_auto: 'Format, version, serial number, timestamp',
      s_author: 'SBOM author', s_timestamp: 'Timestamp', s_format: 'Data format and format version', s_context: 'Generation context', s_tool: 'Tool name and tool version', s_version: 'SBOM version', s_signature: 'Digital signature of the author',
      k_producer: 'Producer', k_name: 'Name', k_version: 'Version', k_identifier: 'Identifier (PURL or CPE)', k_deps: 'Dependency relationships', k_hash: 'Hash value and algorithm', k_license: 'Licence',
      b_creator: 'Creator with email or web address', b_timestamp: 'Timestamp', b_comp_creator: 'Producer with email or web address', b_name: 'Name', b_version: 'Version', b_filename: 'File name', b_deps: 'Dependencies', b_license: 'Licence', b_sha512: 'SHA-512 checksum', b_flags: 'Executable / archive / structured', b_identifier: 'Identifier (PURL or CPE)',
      sig_note: 'This program does not create a digital signature. Sign the file with a tool of your own if required.',
      check_note: 'The check shows whether the fields are filled in. Whether the details are correct and the SBOM is complete can only be judged by a person.',
      btn_download: 'Download CycloneDX file', btn_copy: 'Copy to clipboard', copied: 'Copied', copy_fail: 'Copying not possible', downloaded: 'File saved (“Downloads” folder)',
      preview: 'Preview of the file', stat: (n, kb) => `${n} component(s), ${kb} KB`,
      confirm_new: 'Delete all entries and start over?', confirm_replace: 'The current entries will be replaced. Continue?', confirm_del: n => `Remove “${n}”?`,
      import_fail: 'The file is not a CycloneDX file in JSON format.', import_done: n => `File opened: ${n} component(s)`, example_done: 'Example loaded',
      saved_note: 'Your entries are saved automatically in this browser.',
      close: 'Close',
      privacy_title: 'Privacy and legal notes',
      privacy_html: `<p><strong>In short: what you enter does not leave your device.</strong></p>
        <ul>
          <li><strong>No transmission.</strong> The program runs entirely in your browser. It sends nothing you enter to a server. The page even forbids itself network connections technically (Content Security Policy).</li>
          <li><strong>Local storage only.</strong> Your entries are kept in your browser's storage (localStorage) so they are still there after closing. They are not encrypted. “Start over” deletes them.</li>
          <li><strong>Files stay local.</strong> When you pick a file for the checksum or open an SBOM, it is only read on your device and not uploaded.</li>
          <li><strong>No cookies, no analytics, no advertising,</strong> no fonts or scripts from third parties.</li>
          <li><strong>Hosting.</strong> The page is delivered through GitHub Pages. Like any web server, GitHub processes technical data such as the IP address when the page is requested. The operator of this page has no influence on that. To avoid it, download the program and open the file <code>index.html</code> directly.</li>
        </ul>
        <p class="muted">An SBOM can be confidential. Pass the generated file only to recipients who are meant to have it.</p>
        <h3>Legal notes</h3>
        <ul>
          <li><strong>No warranty.</strong> The program is a working aid. The author of the SBOM is responsible for its correctness and completeness. The check in the program only shows whether fields are filled in. It is no evidence of conformity with the Cyber Resilience Act, BSI TR-03183 or any other rules, and it does not replace legal or standards advice. Use is at your own risk, to the extent permitted by law.</li>
          <li><strong>Trademarks.</strong> This program is an unofficial tool and not a product of the CycloneDX project. CycloneDX is a standard of the OWASP Foundation. SPDX is a project of the Linux Foundation. These and other names mentioned belong to their respective owners and are used descriptively only. There is no affiliation with OWASP, CISA or the BSI; the program is neither reviewed nor endorsed by them.</li>
          <li><strong>Example.</strong> The example data is fictitious. The open-source components named serve as illustration only.</li>
          <li><strong>Program code.</strong> Created with the help of an AI assistant, without code, libraries, fonts or images taken from third parties.</li>
          <li><strong>Contact.</strong> For notices, including about possible infringements, please use the issues of the repository on GitHub. Private, non-commercial project.</li>
        </ul>`
    }
  };

  let lang = 'de';
  try { lang = localStorage.getItem('cdxgen.lang') || ((navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en'); } catch (e) { /* default */ }
  if (!T[lang]) lang = 'de';

  window.I18N = {
    get lang() { return lang; },
    set(l) { lang = T[l] ? l : 'de'; try { localStorage.setItem('cdxgen.lang', lang); } catch (e) { /* ignore */ } document.documentElement.lang = lang; },
    t(key, ...args) { const v = T[lang][key]; return typeof v === 'function' ? v(...args) : (v == null ? key : v); }
  };
  document.documentElement.lang = lang;
})();
