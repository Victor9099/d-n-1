# Spine Pair Review — Clothing Commerce Platform

## Overall verdict

Hai spine **adequate nhưng chưa nên chốt final**: các quyết định commerce quan trọng, visual direction và hợp đồng GSAP mới đã rõ, nhất quán với server authority và reduced motion. Khoảng trống có tác động downstream lớn nhất là state coverage chưa đi hết từng surface trong IA, staff sign-in vẫn chưa có contract, và màu biên control không đạt mục tiêu non-text contrast; không có token reference hỏng hay color token thiếu hex.

## 1. Flow coverage — adequate

Đã đối chiếu 12 capability trong `SPEC.md` với bảy Key Flow. CAP-1 đến CAP-9 đều được trace tới flow có protagonist được đặt tên, bước đánh số, climax và failure path; CAP-10 đến CAP-12 chỉ xuất hiện trong Coverage Notes.

### Findings

- **[medium]** CAP-10, CAP-11 và CAP-12 không có Key Flow như rubric yêu cầu; ghi chú giải thích chúng không phải end-user flow nhưng CAP-10 vẫn có các beat nhìn thấy được như email, reservation expiry và cache refresh, còn CAP-11/12 có protagonist vận hành là integration owner/contributor. (`EXPERIENCE.md:281-283`). *Fix:* thêm một flow vận hành ngắn cho CAP-10 và một flow contributor/integration gate gộp CAP-11/12, hoặc thêm trace table nêu rõ từng capability là non-interactive và nơi downstream story lấy acceptance behavior.

## 2. Token completeness — adequate

Đã kiểm toàn bộ frontmatter token và mọi reference dạng `{path.to.token}` trong hai spine. Tất cả reference đều resolve; 26 color token đều là hex; typography, rounded, spacing và component token đúng kiểu. Contrast text pairs và focus target đã được nêu.

### Findings

- **[high]** Token biên control không đủ tương phản để tự mô tả boundary: `storefront-border` trên trắng/canvas chỉ khoảng 1.49:1/1.40:1, `admin-border` trên trắng/canvas khoảng 1.48:1/1.42:1, trong khi `FormField`, `VariantSelector`, filter và table control dùng các border này (`DESIGN.md:18,27,134-140,200-207,235-250`). Với input trắng trên surface trắng, câu “border không là tín hiệu duy nhất” chưa được hiện thực hóa bằng cue khác. *Fix:* tạo token `control-border` đạt 3:1 trên surface tương ứng, hoặc cam kết underline/fill/shape persistent đạt non-text contrast; ghi target cho normal, selected, error và focus combinations.
- **[medium]** `FormField` chỉ token hóa palette storefront dù được dùng “Mọi form”, còn `EmptyState` chỉ dùng `admin-ink-muted` dù được dùng cho search/cart storefront (`DESIGN.md:200-217`; `EXPERIENCE.md:105-107`). *Fix:* tách `StorefrontFormField`/`AdminFormField` và storefront/admin empty-state variants, hoặc thêm token theo context vào cùng component object.

## 3. Component coverage — adequate

Hai mươi custom/composed component trong `DESIGN.md.components` đều có visual row trong DESIGN.md và behavioral row cùng tên trong EXPERIENCE.md. Phần lớn component commerce chịu tải — SKU, quote, payment, order timeline, tables, forms — có quy tắc thực, không phải mô tả một từ.

### Findings

- **[medium]** Các primitive được gọi đích danh — `Button`, `Input`, `Select`, `Dialog`, `Sheet`, `Table`, `Tabs`, `Popover`, `DropdownMenu`, `Checkbox`, `RadioGroup`, cùng `Skeleton` — không có row đối ứng ở cả hai bảng; câu kế thừa shadcn giải thích nguồn nhưng chưa đáp ứng dual-row mechanical contract (`DESIGN.md:284-286`; `EXPERIENCE.md:16,20,88,115-116`). *Fix:* thêm một bảng “Inherited primitives” ở cả hai spine với cùng tên và rule “shadcn default; no delta”, hoặc ngừng gọi chúng là canonical component names ngoài câu inheritance.

## 4. State coverage — thin

Đã walk toàn bộ 14 storefront surface và 13 admin surface trong IA, rồi đối chiếu các bảng Storefront commerce states, Admin operational states, Interaction Primitives và Accessibility Floor. Commerce critical states được mô tả tốt, đặc biệt SKU, quote expiry/reprice, VNPAY pending/refund-required, token privacy, concurrency conflict và permission change.

### Findings

- **[high]** State tables chưa map rõ state theo từng IA surface. Thiếu hoặc chỉ được bao phủ gián tiếp cho Post list/detail, cart empty/cold-load, order confirmation, OTP send/resend/rate-limit, guest lookup/tracking empty/error, account order history, claim success/replay, not-found/redirect; phía admin còn thiếu Overview, Product/Post editor validation/unsaved changes, Refund, Staff và Config cold-load/empty/error/offline (`EXPERIENCE.md:24-65,113-145`). *Fix:* thêm surface-state matrix liệt kê tối thiểu cold-load, empty/filtered-empty, focus, error/offline và permission-denied “where applicable”, với cross-reference tới pattern chung để tránh lặp prose.
- **[high]** `Staff sign-in / session expired` là IA surface nhưng cơ chế authentication được ghi là chưa có API baseline, nên không thể định nghĩa submit, expiry, recovery, denied và focus/error states cho downstream implementation (`EXPERIENCE.md:53`). *Fix:* đóng contract staff auth ở source/OpenAPI trước finalization, rồi thêm component/state/failure path tương ứng; nếu ngoài scope MVP, loại surface khỏi IA và ghi rõ external prerequisite.

## 5. Visual reference coverage — adequate

`mockups/` có bốn HTML và cả hai spine đều link inline, nêu chính xác điều mỗi mock minh họa; tuyên bố “spines win on conflict” xuất hiện rõ. Bốn file `.working/key-*.html` có SHA-256 trùng đúng với bốn mock đã promote; `imports/` không có user artifact, chỉ `.gitkeep`.

### Findings

- **[medium]** `.working/research-ui-pro.md` là artifact có quyết định và bốn external visual reference nhưng không được spine nào link inline; phần Inspiration chỉ mô tả tín hiệu chung nên consumer không thể truy nguồn/rejects (`EXPERIENCE.md:191-196`; `.working/research-ui-pro.md`). *Fix:* link artifact tại Inspiration & Anti-patterns và nói nó minh họa adopted/rejected signals; nhắc lại spine thắng khi xung đột.
- **[low]** Bốn `.working/key-*.html` là orphan theo literal rubric dù là bản audit trùng byte với promoted mocks. (`.working/key-admin-orders.html`, `.working/key-checkout-pending.html`, `.working/key-product-detail.html`, `.working/key-storefront-home.html`). *Fix:* thêm một câu audit-trail mapping `.working/key-* → mockups/*`, hoặc chỉ coi `mockups/*` là reference và ghi rõ `.working` duplicates không phải consumer inputs.

## 6. Bloat & overspecification — adequate

Phần lớn chi tiết phục vụ quyết định implementation và test được; Product-specific Rules gom invariants thay vì chép lại toàn bộ source, còn motion values giới hạn GSAP đủ cụ thể để các agent không tạo animation khác nhau.

### Findings

- **[low]** Một số invariant được lặp ở Foundation, State Patterns, Product-specific Rules và Key Flows (server authority, VNPAY return display-only, quote/reservation), làm EXPERIENCE.md dài hơn cần thiết và tăng nguy cơ drift (`EXPERIENCE.md:14-22,113-132,147-156,182-189,209-279`). *Fix:* giữ rule canonical ở Product-specific Rules/Interaction Primitives và dùng cross-reference ngắn trong flow/state thay vì tái mô tả contract.

## 7. Inheritance discipline — adequate

Tất cả path trong `sources` của cả hai spine resolve. CAP names được dùng nguyên văn, domain nouns chính (`Product`, `Post`, `Variant/SKU`, `Order`, `PaymentAttempt`) nhất quán, và mọi token reference trong EXPERIENCE.md resolve về DESIGN.md. `SPEC.md` dẫn tới bốn companion nên source chain của EXPERIENCE.md vẫn truy được.

### Findings

- **[low]** Canonical component name bị đổi thành “Guarded Action Dialog” trong hai flow trong khi bảng gọi `ConfirmDialog`; ngoài ra frontmatter pair dùng hai `name` khác nhau và `updated: 2026-08-13` dù GSAP override được ghi ngày 2026-08-14 (`EXPERIENCE.md:247,274`; `DESIGN.md:2,12`; `EXPERIENCE.md:2,7`). *Fix:* dùng `ConfirmDialog` xuyên suốt (có thể thêm display label tiếng Việt), đồng bộ project name và ngày cập nhật khi finalize.

## 8. Shape fit — strong

DESIGN.md giữ đúng thứ tự canonical: Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts. EXPERIENCE.md có đủ Foundation, IA, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Key Flows; Responsive & Platform và Inspiration & Anti-patterns đều được kích hoạt đúng bởi hai app/breakpoint và reference research. Product-specific Rules và Coverage Notes có ích trực tiếp cho commerce/multiagent handoff; không có section vô chủ.

### Findings

Không có finding bổ sung.

## Mechanical notes

- Source resolution: 6/6 path trong DESIGN.md tồn tại; 2/2 path trong EXPERIENCE.md tồn tại.
- Token references: không có reference hỏng; không có color token thiếu hex; không có light/dark pair cần thiết vì MVP khai báo light-only.
- Mockups: `mockups/storefront-home.html`, `mockups/product-detail.html`, `mockups/checkout-pending.html`, `mockups/admin-orders.html` đều được link và mô tả trong cả hai spine.
- Working/import inventory: `.working/research-ui-pro.md`; bốn `.working/key-*.html` trùng byte với mock đã promote; `.working/.gitkeep` và `imports/.gitkeep` là housekeeping, không phải visual reference.
- GSAP update: scope, duration, easing, stagger cap, interruptibility, `useGSAP` cleanup, `ScrollTrigger` boundary, no-JS baseline và `prefers-reduced-motion` alternate path đều đã có (`DESIGN.md:274-276`; `EXPERIENCE.md:152-155`). Không thấy motion mâu thuẫn với server-authoritative payment/order state.
- Mermaid: hai spine không chứa Mermaid; không có syntax cần kiểm.
- Finding counts: **critical 0 · high 3 · medium 4 · low 3**.
