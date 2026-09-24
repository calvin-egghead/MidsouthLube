# Product audit revision checklist

Source: `Mid_South_Lubricants_Website_Product_Audit.pdf` (September 14, 2026), reconciled with the replacement document folder supplied September 24, 2026. This file tracks implementation in the local site. A checked item means the code and source documents have been verified locally; it does not imply the site has been deployed or client reviewed.

## 1. Product pages

- [x] Add MSL-2185 with its TDS and SDS workflow.
- [x] Add MSL-2245 with its TDS and SDS workflow.
- [x] Add MSL-3157 with its TDS and matching EP2 SDS request workflow. The new folder contains both.
- [x] Add MSL-C13 with its TDS and a Request SDS action.
- [ ] Resolve the 9124-40 / 9124-49 SDS conflict. The supplied SDS is withheld from the site mapping until confirmed. **Client decision requested.**
- [x] Add MSL-Rescue HTF HD with its TDS and MSL-5133-5 SDS on the same page, per the client.
- [x] Add the SNFG series with its TDS and Request SDS action.
- [x] Keep MSL-2033 as an archived legacy SDS reference on MSL-NXT 717. **Client decision received.**

## 2. Document coverage

- [x] Connect MSL-2284 TDS and Grade 46 SDS source from the new folder. The `MSL-2284` / `MSL-2284SBAWHF` naming relationship is logged in the source inventory for client confirmation.
- [x] Keep FRH-46 as Request TDS / Request SDS until files are supplied.
- [x] Connect the newly supplied MSL-6061 TDS.
- [x] Connect the newly supplied MSL-C12 TDS.
- [x] Add newly supplied SDS source files for MSL-2066, MSL-4584, MSL-6066, MSL-6488, and BLUE STAR.
- [x] Keep all SDS actions request-only with prefilled product and grade details. **Client decision received.**
- [x] Label MSL-NXT 717's November 19, 2025 SDS as current and older versions as archived.
- [x] Clarify grade-specific SDS coverage for MSL-2090 and MSL-2288.
- [x] Inventory every supplied file and identify unused files, duplicates, and remaining gaps. See [source inventory](source-document-inventory.md).

## 3. Product content and ordering

- [x] Replace all 84 existing Application Fit placeholders with product-specific, source-grounded copy; provide three entries for each new page too.
- [x] Check the 13 quote-only products against the SKU directory and labels. MSL-2090 now shows its verified Grade 20 drum SKU; the other 12 remain quote-only until verified. **Client decision received.**
- [x] Expand MSL-2066 and MSL-6066 technical descriptions using their TDS files.
- [ ] Expand FRH-46 when a TDS or other authoritative technical source arrives.

## 4. Names and URLs

- [x] Correct the BLUE STAR slug and add a permanent redirect from the old URL.
- [x] Correct the MSL-2082 slug and add a permanent redirect from the old URL.
- [x] Verify that the supplied MSL-2585 TDS and SDS are Grade 68; retain its grade-specific slug.
- [ ] Reconcile MSL-C13's 9124-40 / 9124-49 SDS conflict. **Client decision requested.**

## 5. Final QA

- [x] Update site validation for the 34-product catalog and request-only SDS policy.
- [x] Run lint, tests, production build, and route/document validation (`npm run check`, 11 tests passed, 42 indexable routes).
- [x] Check all 34 product pages at desktop and narrow mobile widths for Application Fit copy, document actions, and horizontal overflow; visually inspect the Rescue page and document cards.
- [x] Record remaining client decisions and missing source files below.

## Client review

- [ ] Review the six new product pages and document actions.
- [ ] Review the replacement Application Fit copy across the catalog.
- [ ] Review the source-file exceptions and naming conflicts.
- [ ] Approve deployment after the C13 identifier decision and any requested edits.

## Open findings for client review

- FRH-46: no TDS or SDS is present in the new folder.
- MSL-C13: SDS cover says `9124-49`; Section 1 identifies `9124-40` and `JX9124-40`.
- MSL-3157: two different Grade EP2 SDS variants are present (`3157-EP2` and `3157-EP2-UVG`). The TDS names Grade EP2 without UVG.
- MSL-RU865 HD grease: a TDS and SDS are supplied, but the audit does not request a page. The client decided to keep it out of the catalog for now.
