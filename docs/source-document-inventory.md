# Replacement folder inventory and exceptions

Reviewed against `drive-download-20260924T224130Z-1-001` on September 24, 2026. This is a source-file reconciliation, not an instruction list from the files themselves. The folder has **87 PDFs (84 distinct file hashes)**, one DOCX, and one HTML file. The site uses **79 distinct supplied PDF files** through a TDS button, a private SDS request source mapping, a printable label, or the SKU directory. SDS source PDFs are stored under `source-documents/sds/` outside the published site and can only be supplied by Mid South after a request.

## Still missing

| Product | Missing source | Website action |
| --- | --- | --- |
| FRH-46 | TDS and SDS | Request TDS and Request SDS |
| SNFG series | SDS | Request SDS |

## Supplied but not connected to a product

| File | Reason |
| --- | --- |
| `MSL-C13-9124-40 SAFETY DATA SHEET.pdf` | Cover says `MSL-C13-9124-49`; Section 1 says product `9124-40` and code `JX9124-40`. Held pending client confirmation. |
| `3157-SAFETY DATA SHEET.pdf` | This is the `3157-EP2-UVG` variant. The site maps the other supplied SDS, `MSL-3157 SAFETY DATA SHEET.pdf`, to the EP2 product page because its identifier matches the TDS. |
| `MSL-RU865HD GREASE TECHNICAL DATA SHEET.pdf` | Complete additional product outside the six-page audit scope. Client decision: keep it out of the catalog for now. |
| `MSL-RU865HD GREASE-SAFETY DATA SHEET.pdf` | Companion SDS for RU865 HD; kept out of the catalog per the client. |
| `Blue Star XH 9650 460-1.5- SAFETY DATA SHEET.pdf` | Alternate version of the Blue Star SDS. Its extracted text differs from `MSL-BLUESTAR-SAFETY DATA SHEET.pdf` only by a cover-page `MSL-` prefix and spacing; both show the same June 19, 2018 revision. The site uses the MSL-prefixed file. |

## Duplicate and non-PDF files

- Byte-identical duplicate pairs: `MSL-2090 TECHNICAL DATA SHEET.pdf` / `(1).pdf`; `MSL-2185 TECHNICAL DATA SHEET.pdf` / `(1).pdf`; `2185- SAFETY DATA SHEET.pdf` / `(1).pdf`. Each pair maps to one website document.
- `MSL-2243 TECHNICAL DATA SHEET.docx` is unused. The supplied PDF is the website download.
- `index.html` is unused. It is an HTML page snapshot, not a product document.

## Identifier or grade mismatches needing attention

- **MSL-C13:** 9124-49 on the SDS cover conflicts with 9124-40 in Section 1. The page has a TDS link and Request SDS action, with the conflict disclosed.
- **MSL-2066:** the TDS properties table names Grade 8, while the supplied SDS is labeled `2066-22`. The site names the SDS grade in the request card and asks visitors to confirm the required grade.
- **MSL-4584:** the SDS product names say `4584-32` and `4584-68`, but their Section 1 product codes start with `JX2584`. The site labels requests by the 4584 grade; client confirmation of the manufacturer codes would help.
- **MSL-2284:** the TDS title uses `MSL-2284`; the website and SKU directory use `MSL-2284SBAWHF`. The page connects the TDS and the Grade 46 SDS because both describe biodegradable hydraulic fluid, but the identifier relationship should be confirmed.
- **MSL-6061:** the TDS title uses `MSL-6061`; the website and SKU directory use `MSL-6061FGCF6`. The product description and 6000-hour designation align.
- **MSL-2090:** the TDS properties table lists Grades 4, 10, 22, 32, 46, 68, and 100, while its copy separately names `MSL-2090-20` as direct-food-contact approved and the folder includes Grade 20 and 22 SDS files. The site distinguishes those grades and does not generalize Grade 20 approval.
- **MSL-2082:** the 2020 generic SDS calls it a high-temperature gear lubricant; the TDS and newer Grade 220 SDS call it Synthetic Food Grade Gear Fluid. The page title follows the TDS, while the older SDS is labeled archived.
- **MSL-C12:** the TDS introduction says “up to 450°F”; its properties table lists a 442°F maximum bulk temperature. Application Fit uses the more specific properties-table number.

## Client-resolved match

The client confirmed that the `MSL-RESCUE HTF HD` TDS and `MSL-5133-5` SDS are the same product. Both are connected to the MSL-Rescue HTF HD page.
