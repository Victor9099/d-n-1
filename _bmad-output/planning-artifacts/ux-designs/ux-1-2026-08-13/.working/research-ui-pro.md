# UI/UX Pro Max research capture

Date: 2026-08-13

## Queries

- Design system: `Vietnam clothing ecommerce comfortable premium editorial minimal mobile-first` (variance 7, motion 4, density 3)
- Admin: `commerce admin catalog inventory orders data dense` (variance 4, motion 2, density 8)
- Stack guidance: Next.js and shadcn/ui
- UX guidance: contrast, keyboard access, touch targets, body size, forms, dialogs, data tables

## Signals adopted

- Warm minimalist editorial storefront with generous whitespace and 4:5 product imagery.
- Playfair Display for editorial headings and Inter for interface/body text.
- Dark ink as the primary action color; ochre is a restrained accent, not the only state cue.
- Data-dense admin with neutral slate surfaces, compact tables, explicit filters, status labels with text and icon.
- `next/image` with declared dimensions/aspect ratios and responsive `sizes` to avoid layout shift.
- Semantic shadcn/ui primitives for forms, dialogs, tables and focus handling.
- WCAG 2.2 AA floor: 4.5:1 body contrast, 44x44 touch targets, 16px mobile body copy, keyboard-complete flows.
- GSAP subtle/standard presets after explicit user override: 300–400ms viewport reveals, 30–50ms grid stagger capped at eight items, and transform/opacity-only transitions.
- `@gsap/react` scoped `useGSAP` cleanup, optional storefront `ScrollTrigger`, bundle analysis, and a visible no-JS/reduced-motion baseline.

## Signals rejected or superseded

- ~~GSAP for MVP~~ was originally rejected, then explicitly superseded by the user on 2026-08-14. The adopted scope remains narrow; complex pinning, SplitText, long overlays and animation-gated navigation stay rejected.
- A separate Fira font family for admin: increases font cost and weakens cohesion; Inter covers both apps, with system mono only for IDs/codes.
- Bright playful gradients: conflict with the requested comfortable, calm customer feeling.
- Dark mode in MVP: not required by source scope and would double state/contrast verification.

## External visual references

- FitFlux fashion ecommerce: https://dribbble.com/shots/25547051-Fashion-Ecommerce-Website-Design-FitFlux
- Streamline fashion admin dashboard: https://dribbble.com/shots/25638662-Super-Admin-Dashboard-Streamline-Fashion-Operations
- Stellarstyle minimalist ecommerce: https://dribbble.com/shots/22019079-Stellarstyle-Minimalist-E-Commerce-Responsive-Page-Website
- Shopify Flow / Sanctuary: https://themes.shopify.com/themes/flow/presets/sanctuary

These references provide visual signals only. Product SPEC, OpenAPI, authorization and architecture remain authoritative.

## GSAP scope selected on 2026-08-14

| Surface | Trigger | Motion | Guardrail |
|---|---|---|---|
| Storefront hero | First hydrated view | Copy/image reveal, 360ms, `power2.out`, y ≤ 12px | Content visible without JS; no route blocking |
| Product grid | Viewport entry | Up to 8 cards, 320ms, 40ms stagger | `ScrollTrigger` only below fold; no SEO-hidden baseline |
| Product detail | Variant/image change | 180–240ms crossfade | Selection and price update immediately; motion never delays state |
| Checkout status | Server-confirmed status change | 220ms crossfade | `aria-live` announces once; browser return never animates directly to success |
| Admin order detail | Row opens detail panel | 240ms x ≤ 16px + fade | Focus moves by DOM behavior, not animation; table rows do not stagger |

`prefers-reduced-motion: reduce` disables transform, stagger and parallax; only an optional ≤100ms opacity change remains. Animations are interruptible and reverted on component unmount.
