---
name: ÊM Commerce
description: Hệ thiết kế chung cho storefront thời trang ấm, thư thái và admin vận hành rõ, gọn.
status: final
sources:
  - ../../../specs/spec-clothing-commerce-platform/SPEC.md
  - ../../../specs/spec-clothing-commerce-platform/domain-model.md
  - ../../../specs/spec-clothing-commerce-platform/api-contract.md
  - ../../../specs/spec-clothing-commerce-platform/authorization.md
  - ../../../specs/spec-clothing-commerce-platform/domain-events.md
  - ../../architecture/architecture-1-2026-08-13/ARCHITECTURE-SPINE.md
updated: 2026-08-14
colors:
  storefront-canvas: '#FAF8F3'
  storefront-surface: '#FFFFFF'
  storefront-surface-muted: '#F2EEE7'
  storefront-ink: '#1C1917'
  storefront-ink-muted: '#57534E'
  storefront-border: '#D6D3D1'
  storefront-control-border: '#78716C'
  brand-accent: '#8A4F12'
  on-brand-accent: '#FFFFFF'
  admin-canvas: '#F8FAFC'
  admin-surface: '#FFFFFF'
  admin-surface-muted: '#F1F5F9'
  admin-ink: '#0F172A'
  admin-ink-muted: '#475569'
  admin-border: '#CBD5E1'
  admin-control-border: '#64748B'
  focus-ring: '#2563EB'
  success-ink: '#166534'
  success-surface: '#DCFCE7'
  warning-ink: '#92400E'
  warning-surface: '#FEF3C7'
  danger-ink: '#B91C1C'
  danger-surface: '#FEE2E2'
  info-ink: '#1D4ED8'
  info-surface: '#DBEAFE'
  disabled-surface: '#E7E5E4'
  disabled-ink: '#78716C'
typography:
  display-xl:
    fontFamily: 'Playfair Display, Georgia, serif'
    fontSize: 56px
    fontWeight: '500'
    lineHeight: '1.08'
    letterSpacing: -0.025em
  display-lg:
    fontFamily: 'Playfair Display, Georgia, serif'
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.15'
    letterSpacing: -0.02em
  display-md:
    fontFamily: 'Playfair Display, Georgia, serif'
    fontSize: 30px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.015em
  heading-ui:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.35'
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.55'
  body-strong:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.45'
  ui-sm:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.45'
  label:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.35'
  meta:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
  data:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  '10': 40px
  '12': 48px
  '16': 64px
  '20': 80px
  storefront-gutter-mobile: 20px
  storefront-gutter-desktop: 40px
  admin-gutter: 24px
  content-max: 1280px
components:
  StorefrontHeader:
    background: '{colors.storefront-canvas}'
    foreground: '{colors.storefront-ink}'
    border: '{colors.storefront-border}'
    height-mobile: 60px
    height-desktop: 72px
  ProductCard:
    background: transparent
    foreground: '{colors.storefront-ink}'
    image-ratio: '4 / 5'
    radius: '{rounded.sm}'
    gap: '{spacing.3}'
  VariantSelector:
    background: '{colors.storefront-surface}'
    foreground: '{colors.storefront-ink}'
    border: '{colors.storefront-control-border}'
    selected-border: '{colors.storefront-ink}'
    radius: '{rounded.sm}'
    min-size: 44px
  PriceBlock:
    foreground: '{colors.storefront-ink}'
    secondary: '{colors.storefront-ink-muted}'
    typography: '{typography.body-strong}'
  CartSummary:
    background: '{colors.storefront-surface}'
    foreground: '{colors.storefront-ink}'
    border: '{colors.storefront-border}'
    radius: '{rounded.md}'
    padding: '{spacing.6}'
  CheckoutForm:
    background: '{colors.storefront-surface}'
    foreground: '{colors.storefront-ink}'
    gap: '{spacing.6}'
  PaymentStatusPanel:
    background: '{colors.info-surface}'
    foreground: '{colors.info-ink}'
    border: '{colors.info-ink}'
    radius: '{rounded.md}'
    padding: '{spacing.5}'
  OrderTimeline:
    foreground: '{colors.storefront-ink}'
    muted: '{colors.storefront-ink-muted}'
    connector: '{colors.storefront-border}'
    active: '{colors.brand-accent}'
  OtpForm:
    background: '{colors.storefront-surface}'
    foreground: '{colors.storefront-ink}'
    radius: '{rounded.md}'
    gap: '{spacing.4}'
  AdminShell:
    background: '{colors.admin-canvas}'
    foreground: '{colors.admin-ink}'
    sidebar: '{colors.admin-surface}'
    border: '{colors.admin-border}'
  DataTable:
    background: '{colors.admin-surface}'
    foreground: '{colors.admin-ink}'
    muted: '{colors.admin-ink-muted}'
    border: '{colors.admin-border}'
    row-height: 52px
  StatusBadge:
    radius: '{rounded.full}'
    padding-inline: '{spacing.2}'
    gap: '{spacing.1}'
  FilterBar:
    background: '{colors.admin-surface}'
    foreground: '{colors.admin-ink}'
    border: '{colors.admin-control-border}'
    gap: '{spacing.2}'
  ConfirmDialog:
    background: '{colors.admin-surface}'
    foreground: '{colors.admin-ink}'
    radius: '{rounded.lg}'
    max-width: 480px
  MediaUploader:
    background: '{colors.admin-surface}'
    foreground: '{colors.admin-ink}'
    border: '{colors.admin-border}'
    radius: '{rounded.md}'
  Toast:
    background: '{colors.admin-ink}'
    foreground: '{colors.admin-surface}'
    radius: '{rounded.md}'
  FormField:
    storefront-background: '{colors.storefront-surface}'
    storefront-foreground: '{colors.storefront-ink}'
    storefront-border: '{colors.storefront-control-border}'
    admin-background: '{colors.admin-surface}'
    admin-foreground: '{colors.admin-ink}'
    admin-border: '{colors.admin-control-border}'
    focus: '{colors.focus-ring}'
    error: '{colors.danger-ink}'
    radius: '{rounded.sm}'
    min-height: 44px
  ErrorSummary:
    background: '{colors.danger-surface}'
    foreground: '{colors.danger-ink}'
    border: '{colors.danger-ink}'
    radius: '{rounded.md}'
  EmptyState:
    storefront-foreground: '{colors.storefront-ink-muted}'
    admin-foreground: '{colors.admin-ink-muted}'
    max-width: 480px
    gap: '{spacing.4}'
  Pagination:
    foreground: '{colors.admin-ink}'
    border: '{colors.admin-control-border}'
    active-background: '{colors.admin-ink}'
    active-foreground: '{colors.admin-surface}'
    min-size: 44px
---

## Brand & Style

ÊM đặt cảm giác thoải mái trước cảm giác thúc ép. Storefront giống một tạp chí thời trang dễ mua: ảnh sản phẩm lớn, khoảng thở rộng, chữ có nhịp và lời mời hành động bình tĩnh. Không dùng bộ đếm giả, thông báo khan hiếm không có dữ liệu, hiệu ứng gây giật mình hoặc bảng màu “sale” dày đặc. Sự tin cậy đến từ giá, biến thể, phí vận chuyển và trạng thái thanh toán được trình bày rõ.

Admin là mặt vận hành của cùng thương hiệu nhưng không giả làm tạp chí. Nó ưu tiên quét nhanh dữ liệu, phân biệt trạng thái và hoàn tất tác vụ an toàn. Storefront và admin chia sẻ token thương hiệu, primitive shadcn/ui và quy tắc khả dụng; chúng không chia sẻ page layout hoặc business state, phù hợp với hai web app độc lập trong Architecture Spine.

**Ranh giới nguồn và giả định.** Tên **ÊM**, light theme trong MVP và art direction “warm editorial minimalism” là `[ASSUMPTION]` được ghi trong memlog vì chưa có brand asset. Các quyết định SKU, VND, trạng thái order/payment, quyền staff và hai web app đến từ các source trong frontmatter và thắng nếu có xung đột. Nghiên cứu UI UX Pro Max và reference thị giác chỉ định hướng; DESIGN.md này là hợp đồng thị giác. Khi mockup khác spine, spine thắng.

Các mock được chọn minh họa bốn mode chịu tải: [home/catalog editorial](mockups/storefront-home.html), [product detail mobile](mockups/product-detail.html), [VNPAY pending](mockups/checkout-pending.html) và [admin order exception](mockups/admin-orders.html). Chúng minh họa cách áp token, không mở rộng contract.

## Colors

Storefront dùng canvas kem `{colors.storefront-canvas}` thay cho trắng lạnh; card, form và tóm tắt đơn dùng `{colors.storefront-surface}`. Nội dung chính là `{colors.storefront-ink}`; nội dung phụ dùng `{colors.storefront-ink-muted}`. `{colors.brand-accent}` chỉ nhấn liên kết biên tập, bước đang hoạt động hoặc chi tiết thương hiệu; primary commerce action vẫn là nền ink tối với chữ trắng để không biến accent thành màu “sale”.

Admin dùng bộ slate độc lập `{colors.admin-canvas}` / `{colors.admin-surface}` / `{colors.admin-ink}` để bảng và bộ lọc đọc nhanh. Không đưa nền kem vào từng ô dữ liệu; dấu hiệu thương hiệu xuất hiện ở wordmark, active navigation và focus, không lấn semantic status.

Semantic pairs là hợp đồng dùng chung:

| Ý nghĩa | Ink / surface | Quy tắc |
|---|---|---|
| Thành công / đã hoàn tất | `{colors.success-ink}` / `{colors.success-surface}` | Đi kèm icon và nhãn, không chỉ màu |
| Cần chú ý / đang chờ | `{colors.warning-ink}` / `{colors.warning-surface}` | Dùng cho trạng thái cần theo dõi, không dùng làm CTA |
| Lỗi / hủy / destructive | `{colors.danger-ink}` / `{colors.danger-surface}` | Chỉ dùng khi có lỗi hoặc hành động phá hủy |
| Thông tin / đang xác minh | `{colors.info-ink}` / `{colors.info-surface}` | Phù hợp trạng thái VNPAY return đang chờ xác minh |

Các cặp tải nội dung đã được chọn vượt WCAG AA cho chữ thường: storefront ink/canvas 16.48:1, storefront muted/canvas 7.19:1, accent/canvas 6.17:1, admin ink/canvas 17.06:1, admin muted/canvas 7.24:1; các semantic ink/surface đều ít nhất 5.30:1. Hairline `{colors.storefront-border}` và `{colors.admin-border}` chỉ phân vùng trang trí. Mọi input, select, toggle và control có boundary dùng `{colors.storefront-control-border}` hoặc `{colors.admin-control-border}`; cả hai phải được kiểm thử đạt tối thiểu 3:1 trên canvas lẫn surface tương ứng. Hover dùng ink-muted, selected dùng ink 2px, error dùng `{colors.danger-ink}`, focus dùng `{colors.focus-ring}` outline 2px với offset 2px; disabled vẫn giữ boundary thấy được, đồng thời có text và trạng thái semantic, không chỉ giảm opacity.

## Typography

Storefront dùng **Playfair Display** cho display và heading biên tập, với Georgia fallback; **Inter** đảm nhiệm nội dung, navigation, form, giá và trạng thái. Playfair không dùng cho giá, nút, validation, SKU hoặc bảng. Trên mobile, `display-xl` hạ xuống 40px và `display-lg` hạ xuống 32px; body giữ 16px.

Admin dùng Inter xuyên suốt. `{typography.heading-ui}` dành cho page title; `{typography.body}`, `{typography.ui-sm}`, `{typography.label}` và `{typography.meta}` tạo cấp bậc trong bảng và form. `{typography.data}` dùng `font-variant-numeric: tabular-nums` cho VND, số lượng, mã đơn và timestamp; không dùng monospace làm body chỉ để tạo cảm giác kỹ thuật.

Văn bản tiếng Việt phải dùng font subset có đầy đủ dấu. Tải font bằng `next/font`, giữ fallback metrics gần tương đương để hạn chế layout shift; nếu font không tải được, hierarchy vẫn phải rõ bằng size và weight.

## Layout & Spacing

Toàn hệ thống dùng nhịp 4px trong frontmatter. Storefront mobile dùng gutter `{spacing.storefront-gutter-mobile}`, desktop dùng `{spacing.storefront-gutter-desktop}`, khung tối đa `{spacing.content-max}`. Catalog desktop là grid 4 cột ở màn hình rộng, 3 cột ở laptop, 2 cột trên mobile; ảnh luôn giữ tỉ lệ 4:5 và không đổi chiều cao sau load. Khoảng giữa section dùng `{spacing.16}`–`{spacing.20}` để tạo nhịp biên tập, nhưng cart/checkout thu lại còn `{spacing.6}`–`{spacing.10}` để hỗ trợ quyết định.

Admin desktop dùng sidebar cố định 240px và gutter `{spacing.admin-gutter}`. Nội dung có thể mở rộng đến chiều rộng viewport; bảng không bị ép vào max-width của storefront. Tablet thu sidebar thành rail/sheet, giữ filter và primary action nhìn thấy. Mật độ bảng mặc định 52px mỗi row; không giảm thấp hơn 44px cho row có hành động.

Grid không được phá thứ tự DOM. Asymmetry trên storefront chỉ là bố cục thị giác; keyboard và screen-reader order vẫn theo luồng đọc. Ở mọi breakpoint, một cụm hành động chính chỉ có một CTA primary.

## Elevation & Depth

Hierarchy chủ yếu đến từ màu nền, border và spacing. Storefront card không có shadow mặc định; hover desktop dùng `0 8px 24px rgba(28, 25, 23, 0.08)` cùng translateY tối đa 2px. Checkout summary và dialog có thể dùng cùng ambient shadow ở opacity thấp.

Admin dùng `0 1px 2px rgba(15, 23, 42, 0.06)` cho floating toolbar, popover và sticky header. Không xếp nhiều shadow để mô phỏng chiều sâu; sheet/dialog là lớp nổi duy nhất. Overlay dùng `rgba(15, 23, 42, 0.48)`.

Motion phục vụ phản hồi và nhịp editorial, dùng GSAP theo phạm vi hẹp. Micro-interaction giữ 150–220ms; hero/section reveal 300–400ms; easing mặc định `power2.out`; exit ngắn hơn enter. Chỉ animate `opacity` và `transform`: UI control tối đa 4px, editorial reveal tối đa 12px, admin detail panel tối đa 16px. Product-grid stagger 40ms và không quá 8 card trong một sequence. Không pin section, SplitText, parallax trên nội dung đọc, transition overlay dài hoặc animation layout properties.

Storefront dùng hero reveal, below-fold section/card reveal và crossfade ảnh/variant. Checkout chỉ crossfade khi **server-confirmed state** đổi. Admin không animate table rows; chỉ dùng panel/dialog entrance để giữ spatial continuity. Markup SSR khởi đầu visible; JS chỉ áp `gsap.fromTo()` sau hydration trong component ref được scope bởi `useGSAP`. Mỗi timeline phải interruptible, `kill()` timeline cũ trước state mới, `context.revert()` khi unmount và `clearProps: 'opacity,transform'` khi complete/revert để không để lại nội dung ẩn. `ScrollTrigger` chỉ lazy-load sau khi nội dung đã dùng được. `gsap.matchMedia()` tách nhánh `prefers-reduced-motion: reduce`, bỏ transform/stagger/scroll-link và chỉ cho opacity tối đa 100ms; no-JS, import failure, route interruption và remount đều phải giữ content visible, DOM order và focus tức thời.

## Shapes

Storefront dùng `{rounded.sm}` cho ảnh và variant control, `{rounded.md}` cho form/summary, `{rounded.lg}` cho dialog. Góc nhỏ giữ cảm giác editorial, tránh giao diện quá “app”. Admin dùng `{rounded.sm}`–`{rounded.md}` để đọc như công cụ vận hành.

`{rounded.full}` chỉ dùng cho `StatusBadge`, avatar và indicator tròn; không dùng pill cho mọi nút hoặc mọi input. Ảnh phải khớp radius của container. Icon dùng Lucide nét 1.5–2px, kích thước 18–20px trong control; không dùng emoji, icon fill pha trộn hoặc icon không có text/accessible name khi ý nghĩa không hiển nhiên.

## Components

Hệ thống kế thừa shadcn/ui cho primitive; bảng ngắn sau là registry kế thừa, không mở rộng `components` frontmatter và không tạo design-system song song. Giữ đúng cấu trúc semantic, focus management và API của shadcn; bảng custom/composed phía sau chỉ mô tả delta. Tên component là canonical giữa DESIGN.md và EXPERIENCE.md.

| Inherited primitive | Visual contract |
|---|---|
| `Button`, `Input`, `Select`, `Checkbox`, `RadioGroup` | shadcn default structure; dùng typography, radius, focus và control-border theo app context; không có visual delta khác. |
| `Dialog`, `Sheet`, `Popover`, `DropdownMenu` | shadcn layer/overlay mặc định; dùng surface/ink theo app context và focus contract chung. |
| `Table`, `Tabs`, `Skeleton`, `Toast` | shadcn default; table hairline dùng decorative border, còn control bên trong dùng control-border; custom delta chỉ nằm ở component rows bên dưới. |

| Component | Visual contract và state |
|---|---|
| `StorefrontHeader` | Nền `{colors.storefront-canvas}`, border hairline; desktop cao 72px, mobile 60px. Active link dùng underline ink, không đổi chỉ bằng màu. Sticky header có tonal background đặc, không blur làm giảm tương phản. |
| `ProductCard` | Ảnh 4:5 chiếm ưu thế; tên tối đa hai dòng, `PriceBlock` ngay dưới. Skeleton giữ đúng aspect ratio. Hover chỉ áp dụng thiết bị có hover; sold-out phủ nhãn chữ rõ, không giảm opacity toàn card. |
| `VariantSelector` | Mỗi size/color tối thiểu 44×44px. Selected có border ink 2px và check/icon; unavailable có chữ “Hết”, strike-through nhẹ và disabled cursor. Focus ring nằm ngoài selected border. |
| `PriceBlock` | Giá VND dùng `{typography.body-strong}` và tabular numbers; canh phải trong summary, canh trái trên product. Không hiển thị số thập phân hoặc ký hiệu tiền tệ mơ hồ. |
| `CartSummary` | Surface trắng, hairline border, total có divider và weight 600. Phí vận chuyển/free-shipping dùng text đầy đủ; không dùng progress bar tạo áp lực. |
| `CheckoutForm` | Single-column trên mobile; các section contact, address, shipping và payment phân bằng spacing/header, không bằng nhiều nested card. CTA dark-ink full-width trên mobile. |
| `PaymentStatusPanel` | Pending dùng info pair + spinner có text “Đang xác minh thanh toán”; success/warning/error đổi sang semantic pair tương ứng. Không lấy browser return làm success styling trước server confirmation. |
| `OrderTimeline` | Dot + connector + nhãn + timestamp; current step dùng accent và `aria-current`, completed dùng success, failed/cancelled dùng danger. Luôn có text, không chỉ màu. |
| `OtpForm` | Một input code dễ paste/autofill hoặc nhóm digit có accessible single value; timer/resend dùng muted text. Error xuất hiện dưới field và trong `ErrorSummary` khi submit. |
| `AdminShell` | Sidebar surface trắng, active item có nền muted + left indicator + weight 600. Header chứa page title, role context và primary action; không dùng serif cho admin chrome. |
| `DataTable` | Header sticky khi danh sách dài; 52px row, hairline separators, cell padding 12–16px. Selected/focus row có outline và background; horizontal overflow có affordance, không cắt dữ liệu. |
| `StatusBadge` | Semantic ink/surface, icon 12–14px và label tiếng Việt. Badge không chứa action; tối đa một badge chính/cell, trạng thái phụ thành text. |
| `FilterBar` | Search, filter, sort và count trong một vùng; control cao 40–44px, wrap trên tablet. Active filter có label và nút xóa rõ, không chỉ đổi màu. |
| `ConfirmDialog` | Tiêu đề nêu hành động/đối tượng; destructive action dùng danger, cancel/close vẫn dễ thấy. Nội dung tối đa 480px; không dùng dialog cho thông báo chỉ cần toast. |
| `MediaUploader` | Drop zone border dashed nhưng có button upload chuẩn; thumbnail 4:5 cho product hoặc ratio nội dung cho post. Uploading có progress + tên file; failed có retry và message. |
| `Toast` | Xác nhận tác vụ nền ngắn, không chứa thông tin duy nhất. Success/info mặc định ink surface; error dùng danger pair. Auto-dismiss tối thiểu 5 giây, pause on hover/focus. |
| `FormField` | Một canonical component với hai context bắt buộc: storefront dùng `storefront-*`, admin dùng `admin-*` trong token object. Label luôn hiển thị; control min-height 44px và dùng control-border ≥3:1; helper/error bên dưới. Focus ring 2px; error thêm icon + text. Disabled và read-only khác nhau bằng cursor, nền và wording. |
| `ErrorSummary` | Nằm đầu form sau submit, danger pair, heading ngắn và anchor tới field lỗi. Không dùng cho lỗi field đơn trước submit. |
| `EmptyState` | Storefront dùng `{colors.storefront-ink-muted}`, admin dùng `{colors.admin-ink-muted}`. Khoảng trống có chủ đích, title + nguyên nhân/next step + tối đa một primary action; illustration chỉ là phụ. |
| `Pagination` | Cursor-based UI dùng Previous/Next và position/count khi API cung cấp; button tối thiểu 44px. Disabled state vẫn đọc được; không giả page number khi backend không có offset. |

Primary button storefront dùng nền `{colors.storefront-ink}`, chữ `{colors.storefront-surface}`, radius `{rounded.sm}`, cao tối thiểu 44px. Admin primary action dùng nền `{colors.admin-ink}` và chữ `{colors.admin-surface}`. Destructive action luôn dùng danger token; outline/ghost variants không được nhầm với disabled.

Control-boundary tokens áp dụng cho trạng thái normal, hover, selected, error, focus và disabled trên cả canvas/surface được phép; decorative separators vẫn dùng border hairline riêng. Không được lấy shadow làm cue boundary duy nhất.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Dùng ảnh 4:5 nhất quán, khoảng thở rộng và hierarchy chữ để tạo chất thời trang | Dùng carousel tự chạy, masonry gây nhảy layout hoặc quá nhiều card shadow |
| Giữ primary commerce action dark-ink; dùng ochre tiết chế cho thương hiệu/current step | Dùng accent cho mọi CTA, sale badge, trạng thái và decoration cùng lúc |
| Trình bày size × color, giá và stock ở cấp SKU | Gộp trạng thái stock/giá vào Product hoặc để UI ngụ ý một giá chung |
| Hiển thị phí vận chuyển, grand total và payment state bằng text rõ | Dùng progress, countdown hoặc “sắp hết” để gây áp lực khi không có dữ liệu |
| Dùng semantic pair + icon + label cho trạng thái | Chỉ đổi màu badge, dot hoặc row để truyền đạt trạng thái |
| Giữ storefront mobile-first và admin data-dense desktop-first | Ép cả hai app dùng cùng page template hoặc cùng mật độ |
| Dùng Inter, tabular numbers và sticky headers cho dữ liệu admin | Dùng Playfair trong bảng, form hoặc status vì mục đích trang trí |
| Giữ focus ring, label, 44px target và reduced-motion; dùng GSAP có mục đích, scope và cleanup | Ẩn outline, dùng placeholder làm label, animate layout property hoặc để motion chặn navigation/state |
| Dùng Lucide icon thống nhất và text cho action khó đoán | Dùng emoji, icon từ nhiều bộ hoặc div giả button |
| Coi spine và source contracts là authority | Để mockup, reference site hoặc library default âm thầm ghi đè spine |
