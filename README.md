# SBOM-Generator für CycloneDX

**Deutsch** · [English below](#english)

Inoffizielles Werkzeug, kein Produkt des CycloneDX-Projekts oder der OWASP Foundation. Erstellt eine Software-Stückliste (SBOM) im Format **CycloneDX 1.6 (JSON)** aus einem Formular. Du trägst Produkt und Komponenten ein, das Programm baut die Datei und zeigt, welche Vorgaben schon erfüllt sind.

**Programm öffnen: https://ot-risk-tools.github.io/cyclonedx-sbom-generator/**

Die Sprache stellst du oben rechts um (DE / EN).

## Ausführung

**Im Browser (empfohlen):** Die Adresse oben öffnen. Es ist nichts zu installieren. Das funktioniert unter Windows, macOS, iOS und iPadOS.

**Ohne Internet:** Auf GitHub oben auf *Code → Download ZIP* klicken, die ZIP-Datei entpacken und die Datei `index.html` doppelklicken. Das Programm läuft dann vollständig von deinem Gerät.

## Bedienung in fünf Schritten

1. **Über diese Stückliste:** Wer hat sie erstellt (Name, E-Mail oder Web-Adresse) und in welcher Phase?
2. **Produkt:** Name, Version und Hersteller des Produkts, für das die Stückliste gilt.
3. **Komponenten:** Über *Komponente hinzufügen* jede enthaltene Software eintragen. Eine vorhandene Liste lässt sich als CSV importieren.
4. **Prüfung:** Drei Übersichten zeigen, was noch fehlt.
5. **Ergebnis:** *CycloneDX-Datei herunterladen*.

Zum Ausprobieren: *Beispiel laden*. Eine vorhandene CycloneDX-Datei öffnest du mit *CycloneDX-Datei öffnen* und bearbeitest sie weiter.

## Welche Angaben abgefragt werden

| Angabe | CycloneDX-Feld | CycloneDX 1.6 | Mindestangaben 2026 (CISA) | BSI TR-03183-2 |
|---|---|---|---|---|
| Format und Formatversion | `bomFormat`, `specVersion` | Pflicht | Pflicht | Pflicht |
| Seriennummer, Version der Stückliste | `serialNumber`, `version` | empfohlen | Pflicht (Version) | – |
| Zeitstempel | `metadata.timestamp` | optional | Pflicht | Pflicht |
| Ersteller der Stückliste | `metadata.authors`, `metadata.supplier` | optional | Pflicht | Pflicht, mit E-Mail oder Web-Adresse |
| Zeitpunkt der Erstellung | `metadata.lifecycles` | optional | Pflicht | – |
| Werkzeug und Werkzeugversion | `metadata.tools` | optional | Pflicht | – |
| Digitale Signatur | `signature` | optional | Pflicht | – |
| Name der Komponente | `name` | Pflicht | Pflicht | Pflicht |
| Art der Komponente | `type` | Pflicht | – | – |
| Version | `version` | optional | Pflicht | Pflicht |
| Hersteller | `supplier`, `manufacturer` | optional | Pflicht | Pflicht, mit E-Mail oder Web-Adresse |
| Kennung | `purl`, `cpe` | optional | Pflicht (mindestens eine) | empfohlen |
| Abhängigkeiten | `dependencies` | optional | Pflicht | Pflicht |
| Prüfsumme | `hashes` | optional | Pflicht | Pflicht (SHA-512) |
| Lizenz | `licenses` | optional | Pflicht | Pflicht |
| Dateiname | `properties` (`bsi:component:filename`) | – | – | Pflicht |
| Ausführbar / Archiv / Strukturiert | `properties` (`bsi:component:executable`, `…:archive`, `…:structured`) | – | – | Pflicht |
| Quellcode- und Download-Adresse | `externalReferences` (`vcs`, `distribution`) | optional | – | zusätzlich |

Format, Seriennummer, Zeitstempel, Werkzeug und die Liste der Abhängigkeiten setzt das Programm selbst. Die Prüfsumme berechnet es auf Wunsch aus einer Datei, die du auswählst (SHA-512, SHA-256, SHA-384 oder SHA-1).

## Grenzen

- **Keine digitale Signatur.** Die Mindestangaben 2026 verlangen eine Signatur des Erstellers. Das Programm erzeugt keine; signiere die Datei bei Bedarf mit einem eigenen Werkzeug.
- **Die Prüfung ersetzt keine Fachprüfung.** Sie zeigt, ob Felder ausgefüllt sind, nicht ob die Angaben stimmen oder die Stückliste vollständig ist.
- **Lizenzen:** Nur gängige SPDX-Kürzel werden als SPDX-Kennung geschrieben. Andere Eingaben landen als Lizenzname oder Lizenzausdruck in der Datei.
- **Zuordnung zur BSI TR-03183-2:** Die Feldzuordnung beruht auf der veröffentlichten Eigenschaften-Liste des BSI (`bsi:component:*`) und Zusammenfassungen der Richtlinie in Version 2.1.0. Für einen formalen Nachweis bitte gegen den Originaltext prüfen.
- Die erzeugte Datei wurde mit Trivy eingelesen. Eine Prüfung mit einem Schema-Validator war nicht Teil der Tests.

## Datenschutz und rechtliche Hinweise

Alle Eingaben bleiben auf deinem Gerät. Das Programm sendet nichts an einen Server. Das Programm ist eine Arbeitshilfe ohne Gewähr; für Richtigkeit und Vollständigkeit der Stückliste ist der Ersteller verantwortlich. Genannte Namen wie CycloneDX (OWASP Foundation) und SPDX (Linux Foundation) gehören ihren Inhabern; es besteht keine Verbindung zu OWASP, CISA oder dem BSI. Einzelheiten stehen in [DATENSCHUTZ.md](DATENSCHUTZ.md).

## Quellen

- [CycloneDX 1.6 JSON-Schema](https://cyclonedx.org/schema/bom-1.6.schema.json)
- [BSI TR-03183: Cyber-Resilienz-Anforderungen](https://www.bsi.bund.de/dok/TR-03183-en)
- [BSI: CycloneDX-Eigenschaften für TR-03183](https://github.com/BSI-Bund/tr-03183-cyclonedx-property-taxonomy)
- [Mindestangaben 2026 für eine SBOM, Zusammenfassung](https://fossa.com/blog/cisa-releases-2026-minimum-sbom-elements/)
- [NTIA: The Minimum Elements for an SBOM (2021)](https://www.ntia.doc.gov/files/ntia/publications/sbom_minimum_elements_report.pdf)

---

<a id="english"></a>

# SBOM Generator for CycloneDX

Unofficial tool, not a product of the CycloneDX project or the OWASP Foundation. Creates a software bill of materials (SBOM) in **CycloneDX 1.6 (JSON)** format from a form. You enter the product and its components, the program builds the file and shows which requirements are already met.

**Open the program: https://ot-risk-tools.github.io/cyclonedx-sbom-generator/**

Switch the language at the top right (DE / EN).

## How to run it

**In the browser (recommended):** open the address above. Nothing needs to be installed. It works on Windows, macOS, iOS and iPadOS.

**Without internet:** on GitHub click *Code → Download ZIP*, unpack the ZIP file and double-click `index.html`. The program then runs entirely from your device.

## Five steps

1. **About this SBOM:** who created it (name, email or web address) and in which phase?
2. **Product:** name, version and producer of the product the SBOM describes.
3. **Components:** use *Add component* for every piece of software contained. An existing list can be imported as CSV.
4. **Check:** three overviews show what is still missing.
5. **Result:** *Download CycloneDX file*.

To try it out: *Load example*. Open an existing CycloneDX file with *Open CycloneDX file* and keep editing it.

## Which details are asked for

| Detail | CycloneDX field | CycloneDX 1.6 | 2026 Minimum Elements (CISA) | BSI TR-03183-2 |
|---|---|---|---|---|
| Data format and format version | `bomFormat`, `specVersion` | required | required | required |
| Serial number, SBOM version | `serialNumber`, `version` | recommended | required (version) | – |
| Timestamp | `metadata.timestamp` | optional | required | required |
| SBOM author | `metadata.authors`, `metadata.supplier` | optional | required | required, with email or web address |
| Generation context | `metadata.lifecycles` | optional | required | – |
| Tool name and tool version | `metadata.tools` | optional | required | – |
| Digital signature | `signature` | optional | required | – |
| Component name | `name` | required | required | required |
| Component type | `type` | required | – | – |
| Version | `version` | optional | required | required |
| Producer | `supplier`, `manufacturer` | optional | required | required, with email or web address |
| Identifier | `purl`, `cpe` | optional | required (at least one) | recommended |
| Dependency relationships | `dependencies` | optional | required | required |
| Hash value | `hashes` | optional | required | required (SHA-512) |
| Licence | `licenses` | optional | required | required |
| File name | `properties` (`bsi:component:filename`) | – | – | required |
| Executable / archive / structured | `properties` (`bsi:component:executable`, `…:archive`, `…:structured`) | – | – | required |
| Source code and download address | `externalReferences` (`vcs`, `distribution`) | optional | – | additional |

The program sets format, serial number, timestamp, tool and the list of dependencies by itself. On request it computes the checksum from a file you pick (SHA-512, SHA-256, SHA-384 or SHA-1).

## Limits

- **No digital signature.** The 2026 Minimum Elements require a signature of the author. The program does not create one; sign the file with a tool of your own if required.
- **The check does not replace an expert review.** It shows whether fields are filled in, not whether the details are correct or the SBOM is complete.
- **Licences:** only common SPDX identifiers are written as an SPDX id. Other entries end up in the file as a licence name or licence expression.
- **Mapping to BSI TR-03183-2:** the field mapping is based on the property taxonomy published by the BSI (`bsi:component:*`) and on summaries of version 2.1.0 of the guideline. For formal evidence, please check against the original text.
- The generated file was read with Trivy. A check with a schema validator was not part of the tests.

## Privacy and legal notes

Everything you enter stays on your device. The program sends nothing to a server. The program is a working aid without warranty; the author of the SBOM is responsible for its correctness and completeness. Names such as CycloneDX (OWASP Foundation) and SPDX (Linux Foundation) belong to their owners; there is no affiliation with OWASP, CISA or the BSI. Details are in [DATENSCHUTZ.md](DATENSCHUTZ.md#english).

## Sources

- [CycloneDX 1.6 JSON schema](https://cyclonedx.org/schema/bom-1.6.schema.json)
- [BSI TR-03183: Cyber Resilience Requirements](https://www.bsi.bund.de/dok/TR-03183-en)
- [BSI: CycloneDX property taxonomy for TR-03183](https://github.com/BSI-Bund/tr-03183-cyclonedx-property-taxonomy)
- [2026 Minimum Elements for an SBOM, summary](https://fossa.com/blog/cisa-releases-2026-minimum-sbom-elements/)
- [NTIA: The Minimum Elements for an SBOM (2021)](https://www.ntia.doc.gov/files/ntia/publications/sbom_minimum_elements_report.pdf)
