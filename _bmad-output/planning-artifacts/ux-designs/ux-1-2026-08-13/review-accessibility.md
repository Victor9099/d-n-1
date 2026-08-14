# Accessibility Reviewer Gate

- **Scope:** `DESIGN.md`, `EXPERIENCE.md`, `.memlog.md`, four promoted HTML mocks, and the authentication/commerce source contracts referenced by the UX spines.
- **Lens:** keyboard and focus, semantic HTML, headings and landmarks, screen-reader/live-region behavior, forms/OTP/errors, contrast, touch targets, responsive/safe areas, and GSAP progressive enhancement.
- **Target:** WCAG 2.2 AA for both web apps.
- **Verdict:** **Changes required before the UX artifacts are marked final.** The spines establish a strong accessibility floor, but the promoted mocks contradict it in several load-bearing interactions and a few implementation contracts remain underspecified.

## Severity summary

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 6 |
| Medium | 8 |
| Low | 1 |
| **Total** | **15** |

Severity reflects downstream impact: **High** can remove a core task or produce a broad WCAG failure; **Medium** leaves an important behavior ambiguous or fails a narrower path; **Low** is a quality/readability mismatch that should not block the core task alone.

## Findings

### A11Y-01 — High — Mobile storefront loses its primary navigation

- **Evidence:** `mockups/storefront-home.html:19` sets `.nav{display:none}` below 850px but adds no menu trigger or `Sheet`; `EXPERIENCE.md:92` and `EXPERIENCE.md:175` require mobile navigation in a Sheet.
- **Impact:** mobile and zoomed users lose “Mới về”, “Bộ sưu tập”, and “Bài viết”; keyboard and screen-reader users cannot reach an equivalent control.
- **Required guard:** render a persistent, labelled 44×44px menu button, a semantic navigation Sheet with focus containment, `Esc` close, and focus restoration to the trigger. Keep Search, Account, and Cart reachable outside or inside the same predictable menu.
- **Acceptance evidence:** keyboard-only test at 320/375/414px and 200% zoom reaches every desktop navigation destination and returns focus to the menu trigger after close.

### A11Y-02 — High — Product cards are not actionable elements

- **Evidence:** `mockups/storefront-home.html:42-45` renders each product as an `article` containing non-interactive `div` elements; there is no product-detail link. This conflicts with “Toàn card mở detail” in `EXPERIENCE.md:93`.
- **Impact:** the canonical catalog mock has no keyboard, screen-reader, or pointer path from a product to its detail page.
- **Required guard:** put one descriptive product link around the image/name content or use a stretched-link pattern with exactly one accessible link per card. Its accessible name must include the product name; do not create nested links.
- **Acceptance evidence:** each card is reachable once in tab order, activates with Enter, exposes a useful link name, and retains a visible focus ring.

### A11Y-03 — High — Product disclosures are keyboard-inert

- **Evidence:** `mockups/product-detail.html:23` presents “Chất liệu & chăm sóc”, “Phom dáng”, and “Đổi trả” as plain `div.detail` rows with decorative plus signs.
- **Impact:** essential fit, care, and return information appears interactive visually but cannot be opened by keyboard or announced as expandable.
- **Required guard:** use native buttons inside headings controlling labelled regions with `aria-expanded` and `aria-controls`, or a native `details/summary` pattern. Do not animate height; GSAP may only animate an inner opacity/transform layer after semantic state changes.
- **Acceptance evidence:** Enter/Space toggles each disclosure, expanded state is announced, content remains readable with JS disabled, and reduced-motion skips the reveal transform.

### A11Y-04 — High — Form/control boundaries do not meet non-text contrast

- **Evidence:** the declared storefront border `#D6D3D1` is only **1.49:1** against white and **1.40:1** against the cream canvas; admin border `#CBD5E1` is **1.48:1** against white and **1.42:1** against its canvas (`DESIGN.md:14-28`, `DESIGN.md:200-207`). The admin search/select controls use that border on white in `mockups/admin-orders.html:13,23`. The spines only verify text-pair contrast at `DESIGN.md:250`.
- **Impact:** inputs, selects, and actionable boundaries can be difficult to perceive and fail WCAG 1.4.11 when the low-contrast border is their only boundary.
- **Required guard:** add dedicated `control-border` tokens reaching at least 3:1 against adjacent surfaces, or give controls a surface that reaches 3:1 against the surroundings. Do not globally darken decorative separators; distinguish control boundaries from hairlines.
- **Acceptance evidence:** automated token test and manual contrast check cover default, hover, focus, selected, error, and disabled controls on every permitted surface.

### A11Y-05 — High — Admin responsive collapse removes names and the selected-order workspace

- **Evidence:** at widths below 1050px, `mockups/admin-orders.html:16` hides navigation text with `display:none`, leaving numeric glyphs such as “01”, and hides `.detail-panel` entirely. `EXPERIENCE.md:101,175-177` instead requires a labelled rail/Sheet and a reachable row-detail experience.
- **Impact:** collapsed navigation links lose meaningful accessible names because `display:none` removes their text from the accessibility tree; the active order detail and “Tạo lượt giao lại” action disappear without an equivalent route or Sheet.
- **Required guard:** preserve link names through `aria-label` or visually-hidden text that is not `display:none`; expose order detail through a labelled link/button and responsive Sheet/page, with focus moved to its heading and restored on close.
- **Acceptance evidence:** at 768–1024px and 200% zoom, every nav item has a useful accessible name and every order row can open the same guarded actions as desktop.

### A11Y-06 — High — Repeated admin targets fall below the 44×44px floor

- **Evidence:** `mockups/admin-orders.html:12-15` defines Refresh at 42px, search/select at 42px, active-filter remove at 26×26px, row actions at 40×40px, and Clear filter at 40px. This conflicts with the project-wide floor in `EXPERIENCE.md:161` and component rules in `DESIGN.md:302,311`.
- **Impact:** touch, tremor, and coarse-pointer users face error-prone controls in a dense operational path.
- **Required guard:** make every interactive hit area at least 44×44 CSS px with at least 8px separation where targets are adjacent; visual icons may remain smaller inside the hit area.
- **Acceptance evidence:** a DOM/CSS assertion checks bounding boxes for all visible controls at desktop, tablet, and mobile breakpoints.

### A11Y-07 — Medium — Skip-link and route-focus requirements are absent from every promoted mock

- **Evidence:** `EXPERIENCE.md:152-163` requires focus on an error summary or route heading, route-title announcement, and a skip link. None of the four HTML mocks contains a skip link or a programmatically focusable main-content target (`mockups/storefront-home.html:23-50`, `mockups/product-detail.html:17-26`, `mockups/checkout-pending.html:17-23`, `mockups/admin-orders.html:19-33`).
- **Impact:** developers copying canonical mocks can ship long repeated navigation paths and silent client-side route changes.
- **Required guard:** define a shared `SkipLink` and route-focus utility: target the actual application `<main id="main-content" tabindex="-1">`, update `document.title`, and focus the new page `h1` after navigation without waiting for GSAP.
- **Acceptance evidence:** keyboard and screen-reader route tests verify one skip activation and one page-title/heading announcement per navigation.

### A11Y-08 — Medium — Admin tabs implement an incomplete ARIA tabs pattern

- **Evidence:** `mockups/admin-orders.html:22` gives buttons `role="tab"` inside a tablist, but inactive tabs omit `aria-selected="false"`; all tabs omit `aria-controls`, managed `tabindex`, and associated `tabpanel` elements.
- **Impact:** screen-reader users receive a tabs interaction model that keyboard behavior and relationships do not fulfill.
- **Required guard:** either implement the full tabs pattern with roving focus, arrow keys, selected state, controlled panels, and labelled relationships, or model these server/URL filters as ordinary links/buttons without tab roles.
- **Acceptance evidence:** automated accessibility checks plus manual arrow-key/Tab tests match the chosen semantic pattern.

### A11Y-09 — Medium — Variant selection state is inconsistent and dynamic SKU changes lack a concrete announcement target

- **Evidence:** color buttons correctly expose `aria-pressed` in `mockups/product-detail.html:21`, but the selected size alone has `aria-pressed="true"` while unselected sizes omit `aria-pressed="false"` in `mockups/product-detail.html:22`. The price and stock update behavior required by `EXPERIENCE.md:94-95,164,167` has no identified live/status region in the mock.
- **Impact:** assistive-technology users may not receive a stable selected/unselected state or learn that price/availability changed after a color/size choice.
- **Required guard:** prefer labelled `RadioGroup` controls for mutually exclusive color and size choices, or apply `aria-pressed` consistently to every toggle. Add one polite, atomic SKU-summary status containing selected color × size, price, and availability; suppress duplicate announcements during rapid changes.
- **Acceptance evidence:** VoiceOver/NVDA tests announce group label, option, state, unavailability reason, and exactly one updated SKU summary.

### A11Y-10 — Medium — Payment polling does not yet pin terminal-state announcement and focus behavior

- **Evidence:** the current notice has `role="status"` in `mockups/checkout-pending.html:20`, while the page heading and actionable result area are outside it (`mockups/checkout-pending.html:19-22`). `EXPERIENCE.md:98,127,154,167` requires bounded polling, server-confirmed transition, a crossfade, and one announcement, but does not identify which stable node changes or where focus remains.
- **Impact:** a transition to paid, failed, expired, or `refund_required` can be visually obvious but announced partially, repeatedly on each poll, or accompanied by unexpected focus movement.
- **Required guard:** maintain one persistent `role="status" aria-atomic="true"` summary whose text changes only when the server state changes; never announce unchanged polls or a per-second reservation timer. Keep focus in place for automatic updates and provide an explicit link to the resulting order heading.
- **Acceptance evidence:** fake-timer tests assert zero announcements for unchanged polls and exactly one meaningful announcement for each terminal transition, including reservation-expired and late-capture/refund-required outcomes.

### A11Y-11 — Medium — OTP behavior is directionally correct but not implementation-complete

- **Evidence:** `DESIGN.md:298` and `EXPERIENCE.md:100,130,162,168` require paste, autofill, safe errors, and resend, while the API only guarantees a 15-minute challenge (`api-contract.md:24-25,62`; `SPEC.md:68`). No contract pins `autocomplete="one-time-code"`, appropriate `inputmode`, accessible expiry/cooldown messaging, focus after challenge creation, or resend/error announcement behavior.
- **Impact:** the only customer sign-in method can become cumbersome with mobile keyboards/password managers or create noisy/silent error and cooldown states.
- **Required guard:** specify one labelled code input by default with `autocomplete="one-time-code"`, suitable `inputmode`, paste support, and format instructions via `aria-describedby`; focus it after challenge creation. Treat expiry/cooldown as ordinary text, announce only availability changes, keep the form open, and use the same non-enumerating message for invalid/used/expired tokens.
- **Acceptance evidence:** keyboard, screen-reader, paste, autofill, expired-token, rate-limit, resend, and wrong-code tests across mobile Safari/Chrome and desktop NVDA/VoiceOver.

### A11Y-12 — Medium — Dialog focus lifecycle is delegated but not explicitly contracted

- **Evidence:** `DESIGN.md:286,303` inherits shadcn primitives and defines dialog copy, while `EXPERIENCE.md:105,150,156` defines `Esc` and no nested dialogs. It does not pin initial focus, background inertness, title/description relationships, or focus restoration for destructive actions and responsive Sheets.
- **Impact:** publish, refund, role change, and order transitions can open with unsafe initial focus or return users to a vanished/disabled trigger after server refresh.
- **Required guard:** define initial focus per risk (usually Cancel for destructive confirmation), `aria-labelledby`/`aria-describedby`, modal focus containment, inert background, `Esc` behavior, and fallback focus restoration to the page heading when the trigger no longer exists.
- **Acceptance evidence:** keyboard tests cover open, full focus cycle, `Esc`, confirm/cancel, server rejection, and trigger removal.

### A11Y-13 — Medium — GSAP prose needs executable no-motion/no-JS guards

- **Evidence:** `DESIGN.md:274-276`, `EXPERIENCE.md:153-155,169`, and `.memlog.md:23-25` correctly limit GSAP and require a visible SSR baseline, cleanup, and reduced-motion path. They do not yet define how reveal setup avoids hydration flash, how inline styles are cleared after interruption, or which tests prove content never remains at `opacity:0` after navigation/unmount.
- **Impact:** implementation can satisfy the prose nominally yet flash visible content backward, leave content hidden after an interrupted timeline, or delay heading focus behind animation.
- **Required guard:** begin from visible SSR markup; scope `useGSAP` to a component ref; use `gsap.matchMedia()` and context cleanup; clear transient inline properties on completion/revert; never include focus or semantic state in a timeline. Lazy-load `ScrollTrigger` only after content is usable. Reduced-motion and no-JS paths must skip transform/stagger and expose all content immediately.
- **Acceptance evidence:** tests with JS disabled, `prefers-reduced-motion: reduce`, interrupted route navigation, React remount, and failed GSAP import verify visible content, unchanged DOM order, immediate focus, and no leaked inline hiding styles.

### A11Y-14 — Medium — Sticky mobile actions do not define safe-area behavior

- **Evidence:** `mockups/product-detail.html:13,25` pins the add-to-cart bar to the bottom with fixed padding and draws a device home indicator, but does not use `env(safe-area-inset-bottom)`. `EXPERIENCE.md:175` requires the sticky CTA not to cover content.
- **Impact:** on notched/home-indicator devices or browser UI changes, the primary action can overlap the system gesture area or obscure the end of the product content.
- **Required guard:** use padding such as `calc(12px + env(safe-area-inset-bottom))`, reserve matching scroll padding/content space, and test dynamic viewport units and 200% zoom. Apply the same rule to checkout/action bars.
- **Acceptance evidence:** iOS safe-area emulation, Android browser chrome, landscape, keyboard-open, and 200% zoom retain an unobscured CTA and last content element.

### A11Y-15 — Low — Canonical admin metadata is smaller than the design token

- **Evidence:** `DESIGN.md:83-87` defines metadata at 13px, but `mockups/admin-orders.html:10-15` repeatedly uses 11px for address chrome, role labels, table headers, badges, sublabels, hints, and technical links.
- **Impact:** dense low-vision reading becomes harder, especially at laptop scaling, even though WCAG does not prescribe a universal minimum font size.
- **Required guard:** keep operational metadata at the 13px token; reserve 11px for non-product browser-frame decoration only. Validate that row height and wrapping still work at 200% zoom.
- **Acceptance evidence:** token/lint check rejects product UI text below 13px and visual regression covers 200% zoom.

## Verified strengths

- All four mocks set `lang="vi"`, include a viewport meta tag, and maintain a single visible `h1`; the storefront and admin heading sequences shown are coherent.
- Visible focus colors are not the issue: `#2563EB` measures **5.17:1** on white and **4.87:1** on the storefront cream. The declared text-pair calculations in `DESIGN.md:250` were independently reproduced: 16.48:1, 7.19:1, 6.17:1, 17.06:1, and 7.24:1 respectively.
- Product selectors use `fieldset/legend`; unavailable XL remains named and disabled (`mockups/product-detail.html:21-22`). Product imagery has useful accessible names while inline SVG detail is hidden from duplicate announcement (`mockups/product-detail.html:19`; `mockups/storefront-home.html:35-45`).
- The admin table has a caption, scoped column headers, textual status badges, redacted PII, and order-specific row-action names (`mockups/admin-orders.html:24-31`).
- The VNPAY mock does not infer success from browser return, includes human-readable pending text, and stops its CSS spinner under reduced motion (`mockups/checkout-pending.html:14,19-22`).
- The GSAP contract rejects SplitText, parallax reading content, layout-property animation, focus animation, and animation-gated state; this is the right baseline (`DESIGN.md:274-276`; `EXPERIENCE.md:153-155,169`).

## Required close-out order

1. Fix the six High findings in both spine and canonical mocks: mobile navigation, product links, disclosures, control-boundary contrast, admin responsive access, and touch targets.
2. Add shared implementation contracts for skip/route focus, dialogs, SKU/payment live regions, OTP, and safe-area sticky controls.
3. Turn the GSAP alternate paths into acceptance tests before adopting reveal utilities broadly.
4. Re-run automated HTML/accessibility checks plus keyboard, screen-reader, 200% zoom, reduced-motion, and no-JS smoke tests. Final status should remain `draft` until High findings have evidence-backed closure.
