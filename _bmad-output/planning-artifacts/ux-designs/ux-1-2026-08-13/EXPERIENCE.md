---
name: ÊM Commerce
status: final
sources:
  - ../../../specs/spec-clothing-commerce-platform/SPEC.md
  - ../../architecture/architecture-1-2026-08-13/ARCHITECTURE-SPINE.md
updated: 2026-08-14
---

# Clothing Commerce Platform — Experience Spine

> Hợp đồng hành vi cho hai web app độc lập: storefront dành cho khách mua và admin dành cho nhân viên. `DESIGN.md` là nguồn chuẩn về nhận diện thị giác; tài liệu này quyết định cách sản phẩm hoạt động. Các mockup chỉ minh họa; khi có xung đột, hai spine thắng.

## Foundation

- Hai responsive web app trên Next.js + React + Tailwind CSS + shadcn/ui, dùng generated OpenAPI client và TanStack Query cho server state. Storefront và admin không chia sẻ page hay business state; chỉ kế thừa UI primitives, design tokens và API client theo Architecture Spine AD-1/AD-3.
- Storefront mobile-first, hoàn chỉnh từ khám phá đến thanh toán và theo dõi đơn trên điện thoại. Admin desktop-first, dùng được trên tablet cho các tác vụ chính; điện thoại chỉ hỗ trợ xem và thao tác khẩn cấp đơn giản. [ASSUMPTION]
- UI MVP dùng tiếng Việt; hiển thị ngày `dd/MM/yyyy`, giờ theo `Asia/Ho_Chi_Minh`; API vẫn trao đổi UTC ISO-8601. Tiền luôn là số nguyên VND và định dạng `vi-VN`. [ASSUMPTION]
- Theme sáng duy nhất ở MVP. [ASSUMPTION]
- shadcn/ui sở hữu hành vi nền của form, dialog, sheet, table, toast, skeleton và focus management. Chỉ các delta hành vi bên dưới mới ghi đè. Visual state, typography, spacing và contrast tham chiếu `DESIGN.md`; control tương tác dùng `{colors.storefront-control-border}` hoặc `{colors.admin-control-border}`, không dùng hairline trang trí làm boundary.
- Storefront đọc trên `{colors.storefront-canvas}` / `{colors.storefront-ink}`; admin đọc trên `{colors.admin-canvas}` / `{colors.admin-ink}`. Mọi tương tác bàn phím dựa vào `{colors.focus-ring}`; tài liệu này không ghi đè giá trị token.
- Trình duyệt không tự kết luận giá, tồn kho hay thành công thanh toán. Quote, availability và payment/order status từ API là thẩm quyền; VNPAY return chỉ mở màn hình trạng thái để chờ xác minh server.

## Information Architecture

### Storefront

Điều hướng chính: **Mới về · Bộ sưu tập · Bài viết**, cùng Tìm kiếm, Tài khoản và Giỏ hàng. Checkout và Theo dõi đơn là page riêng, không bị nhốt trong modal.

| Surface | Đến từ | Mục đích / trạng thái chính |
|---|---|---|
| Trang chủ / catalog | URL gốc, nav | Khám phá Product đã publish; editorial hero, nhóm sản phẩm, bài viết mới |
| Kết quả tìm kiếm / bộ sưu tập | Search, nav, liên kết campaign | Lọc và duyệt Product đã publish; empty, loading, pagination |
| Product detail | Product card, URL/redirect | Ảnh, nội dung, chọn đúng size × color Variant/SKU, giá và availability theo SKU |
| Danh sách / chi tiết bài viết | Nav, editorial card, URL/redirect | Đọc Post đã publish và đi tiếp tới nội dung/sản phẩm liên quan |
| Giỏ hàng | Header, add-to-cart feedback | Sửa số lượng theo SKU; thông báo thay đổi giá/tồn khi đồng bộ |
| Checkout | Giỏ hàng | Liên hệ, địa chỉ, phương thức COD/VNPAY, server quote và xác nhận đặt hàng |
| Xác nhận đơn | COD success hoặc trạng thái server đã xác nhận | Mã đơn, tóm tắt, bước tiếp theo; không hiển thị thành công chỉ từ browser return |
| Trạng thái thanh toán | VNPAY redirect return, email link | `pending`, `paid`, `failed`, `refund_required`, `refunded`; tự thăm dò có giới hạn khi pending |
| Đăng nhập email OTP | Tài khoản, bước claim | Gửi và xác minh OTP một lần, 15 phút; thiết lập HttpOnly session |
| Yêu cầu tra cứu đơn khách | Footer, email/order help | Nhập email + dữ liệu challenge theo schema; luôn trả thông điệp chống enumeration |
| Theo dõi đơn khách | Email token 15 phút | Order redacted, timeline fulfillment/payment, token hết hạn và xin link mới |
| Đơn hàng của tôi / Order detail | Tài khoản đã xác minh | Lịch sử order đã sở hữu/claim, snapshot bất biến và trạng thái hiện tại |
| Claim đơn khách | Order detail hoặc email claim link | Liên kết order đủ điều kiện vào tài khoản có email khớp; replay cho cùng kết quả |
| Not found / redirect / lỗi hệ thống | URL cũ, lỗi fetch | Giải thích ngắn, đường về catalog; slug cũ tự redirect khi server trả resolution |

### Admin

Điều hướng sidebar theo role: **Tổng quan · Sản phẩm · Bài viết · Đơn hàng · Thư viện · Nhân sự · Cấu hình**. Mục không có permission được ẩn để giảm nhiễu, nhưng API luôn kiểm tra lại quyền.

| Surface | Role / permission | Mục đích / trạng thái chính |
|---|---|---|
| Staff sign-in / session expired | StaffAccount active, allowlisted | Email OTP riêng cho staff, 15 phút, tối đa năm lần thử; thiết lập/khôi phục revocable HttpOnly staff session và trở lại intended route hợp lệ. |
| Tổng quan | Role-aware | Lối tắt và số liệu vận hành trong phạm vi quyền; không lộ PII ngoài projection |
| Product list | OwnerAdmin, CatalogEditor | Tìm/lọc draft, published, archived; tạo và mở Product |
| Product editor | OwnerAdmin, CatalogEditor | Merchandising fields, slug, media, preview/publish/archive; thay đổi published slug cảnh báo redirect |
| Variants & inventory | OwnerAdmin, CatalogEditor | Bảng size × color SKU, giá VND, on-hand/reserved/available; chỉnh stock có version guard |
| Post list / editor / preview | OwnerAdmin, CatalogEditor | Soạn, preview có hạn, publish/archive Post; slug redirect và revalidation feedback |
| Media library / upload | OwnerAdmin, CatalogEditor | Authorize → upload trực tiếp → finalize → attach; retry từng bước, không upload binary qua API |
| Order queue | OwnerAdmin, OrderOperator | Lọc theo order/payment/fulfillment state; cursor pagination; PII chỉ hiện theo projection |
| Order detail & audit | OwnerAdmin, OrderOperator | Snapshot, timeline, payment attempts, fulfillment, allowed transitions và AuditEntry |
| Refund workflow | OwnerAdmin | Request/reconcile `refund_required`/`refunded`; luôn xác nhận amount và reason |
| Nhân sự | OwnerAdmin | Tạo/disable staff, gán role, cảnh báo thay đổi đặc quyền |
| Cấu hình | OwnerAdmin | Đọc cấu hình shipping/payment local. Shipping MVP 30.000 ₫/miễn phí từ 500.000 ₫ là read-only; không có edit control. |
| Permission denied | Mọi protected route | Không render dữ liệu cũ; giải thích quyền đã đổi và cho quay về route hợp lệ |

Modal chỉ sâu một lớp. Tác vụ cần nhiều bước (checkout, product editor, order detail, upload) là page hoặc panel bền vững, không phải chuỗi dialog.

## Voice and Tone

Microcopy bình tĩnh, trực tiếp và trung thực. Brand voice/aesthetic posture nằm trong `DESIGN.md`.

| Tình huống | Dùng | Tránh |
|---|---|---|
| Tồn kho | “Còn 2 sản phẩm ở lựa chọn này.” | “Sắp cháy hàng! Mua ngay!” |
| Quote đổi | “Giá hoặc phí giao hàng vừa được cập nhật. Vui lòng kiểm tra lại.” | “Có lỗi. Thử lại.” |
| VNPAY return | “Đang xác minh thanh toán với VNPAY…” | “Thanh toán thành công” trước IPN |
| Token/OTP | “Nếu thông tin khớp, email hướng dẫn sẽ đến trong ít phút.” | Xác nhận email/order có tồn tại |
| Empty admin | “Chưa có đơn phù hợp với bộ lọc này.” | “Không có dữ liệu.” |
| Transition lỗi | “Không thể chuyển sang Đã giao từ trạng thái hiện tại.” | “Something went wrong.” |

- Không tạo khẩn cấp giả, countdown bán hàng giả, popup ép đăng ký hay lời chúc mừng quá mức.
- Nút dùng động từ + đối tượng: “Thêm vào giỏ”, “Gửi mã đăng nhập”, “Đánh dấu đang xử lý”, “Yêu cầu hoàn tiền”.
- Lỗi form đặt cạnh field và có error summary ở đầu form dài. Correlation ID nằm trong vùng “Chi tiết kỹ thuật” có thể mở, không chiếm câu chính.

## Component Patterns

Visual specs nằm trong `DESIGN.md.Components` hoặc kế thừa shadcn/ui.

| Inherited primitive | Behavioral contract |
|---|---|
| `Button`, `Input`, `Select`, `Checkbox`, `RadioGroup` | Hành vi/semantic shadcn mặc định; form delta, target và announcement áp theo các pattern bên dưới. |
| `Dialog`, `Sheet`, `Popover`, `DropdownMenu` | Focus containment, dismiss và portal theo shadcn; lifecycle rủi ro được siết tại Interaction Primitives. |
| `Table`, `Tabs`, `Skeleton`, `Toast` | Semantic shadcn mặc định; `Tabs` chỉ dùng khi có đủ roving focus/tabpanel, nếu là URL filter thì dùng link/button thường. |

| Component | Dùng ở đâu | Quy tắc hành vi |
|---|---|---|
| StorefrontHeader | Toàn storefront | Giữ Search, Account và Cart dễ chạm; nav chuyển thành `Sheet` ở mobile; cart count cập nhật qua live region nhưng không cướp focus. |
| ProductCard | Catalog, search, related | Mỗi card có đúng một link mô tả chứa tên Product; Enter mở detail, không nested link; ảnh có aspect ratio cố định và focus ring rõ. |
| VariantSelector | Product detail, admin SKU editor | Size và color là hai `RadioGroup` có label; unavailable disabled nhưng vẫn có tên/lý do; thay đổi cập nhật một SKU-summary live region gồm color × size, giá và availability. |
| PriceBlock | Product detail, cart | Hiện giá đúng SKU; chỉ dùng “Từ …” khi chưa chọn và SKU thực sự khác giá; availability luôn có text, không chỉ màu. |
| CartSummary | Cart, checkout | Mỗi dòng nhận diện Product + size + color; quantity control 44px. Hiện item subtotal, shipping, discount, tax, grand total, `expiresAt`; optimistic update phải rollback khi server từ chối. |
| CheckoutForm | Checkout | Một page theo section; local state chỉ giữ trình bày/input, server Quote là authority; submit khóa double-click và dùng idempotency key. |
| PaymentStatusPanel | VNPAY return, Order detail | Pending polling có backoff, abort request cũ và chỉ nhận projection version tăng; dừng khi terminal/timeout. Một node status bền vững announce đúng một lần khi server state đổi; focus không tự nhảy. |
| OrderTimeline | Guest/account/admin order detail | Sắp xếp theo chiều đọc; payment và fulfillment là hai nhánh riêng, không gộp thành một trạng thái mơ hồ. |
| OtpForm | Customer/staff sign-in, guest/claim challenge | Một input code có label, `autocomplete="one-time-code"`, input mode phù hợp, paste/autofill; focus sau khi challenge tạo. Challenge mới vô hiệu code cũ, tối đa năm lần thử, resend theo server time; mọi lỗi giữ form và không enumeration. |
| AdminShell | Toàn admin | Sidebar/route lọc theo role; collapse vẫn giữ accessible name, mobile dùng `Sheet`. Order row luôn mở được detail tương đương bằng panel/Sheet/page; denial/logout/account switch/session rotation/role change/401/403 xóa protected cache trước render. |
| DataTable | Admin lists | Sort/filter server-side; row có accessible name; selection/action không phụ thuộc checkbox hoặc hover ẩn; dữ liệu nhạy cảm theo projection. |
| StatusBadge | Admin lists/detail | Luôn có text label; cùng một enum dùng cùng một từ trên mọi surface; không dùng màu làm tín hiệu duy nhất. |
| FilterBar | Admin lists | Filter phản ánh vào URL; có “Xóa bộ lọc”; thay filter đưa pagination về cursor đầu và không tự submit khi đang nhập text. |
| ConfirmDialog | Publish/archive, order transition, refund, role change | Nêu trạng thái hiện tại → mới, effect và field bắt buộc; initial focus vào Cancel khi destructive, có title/description, inert background, focus trap, `Esc`, và restore trigger hoặc page heading nếu trigger biến mất. Không nested dialog. |
| MediaUploader | Product/Post media | Hiện ba bước authorize/upload/finalize; retry đúng bước; chỉ asset finalized mới attach được. |
| Toast | Feedback không chặn | Chỉ dùng cho kết quả thoáng qua; lỗi cần hành động nằm inline và không tự biến mất. Không dùng Toast làm nơi duy nhất chứa lỗi form. |
| FormField | Mọi form | Label bền vững, help/error gắn semantics; không dùng placeholder thay label; giữ input sau lỗi có thể retry. |
| ErrorSummary | Checkout và form admin dài | Xuất hiện sau submit lỗi, nhận focus, liệt kê link tới field; lỗi API chung và correlation ID được tách rõ. |
| EmptyState | Lists, search, cart | Phân biệt “chưa có dữ liệu” với “không có kết quả lọc”; có tối đa một primary action. Skeleton loading không được dùng như empty. |
| Pagination | Catalog/admin lists | Cursor do client giữ nguyên, không tự dựng; Previous/Next có disabled state và accessible label; browser Back khôi phục filter/vị trí. |

## State Patterns

### Surface-state matrix

Mọi surface dùng chung: **L** = cold-load skeleton giữ layout; **E** = empty và filtered-empty có nguyên nhân/next step riêng; **F** = focus vào `h1` sau route, vào error summary sau submit lỗi; **X** = inline problem + retry, offline giữ input nhưng khóa mutation; **D** = permission/session denial xóa protected cache trước khi route. `N/A` nghĩa là trạng thái không áp dụng, không phải được phép bỏ qua loading/error semantics.

| Surface | L / E | Focus | Error / offline | Denied / special state |
|---|---|---|---|---|
| Trang chủ / catalog | L; E: chưa publish | F | X; cache ghi “Có thể chưa mới nhất” | N/A; archived không public |
| Search / bộ sưu tập | L; E: xóa filter | F; filter giữ URL | X; retry giữ query | N/A |
| Product detail | L; E: unavailable | F; thiếu variant → group đầu | X; stale SKU refetch | 404/redirect theo server |
| Post list / detail | L; E: chưa có bài | F | X | draft/archived → 404/redirect |
| Giỏ hàng | L; E: “Giỏ đang trống” | F; line lỗi nhận focus | X; stale line giữ exact SKU | N/A |
| Checkout | L quote; E cart → giỏ | F / error summary | X; offline khóa đặt đơn | quote expired/repriced |
| Xác nhận đơn | L projection | F | X; link theo dõi | Chỉ server-confirmed |
| Trạng thái thanh toán | L/pending; không có E | F; auto-update giữ focus | X; bounded retry | terminal/expiry/refund-required |
| Customer OTP | L challenge; không E | code input sau send | X; cooldown/expired/used | intended route được giữ |
| Yêu cầu guest lookup | L; không E | first field / summary | X; response không enumeration | rate-limit theo server |
| Guest tracking | L projection; không E | F | X; reload qua continuation session | token replay/expired → challenge mới |
| My orders / detail | L; E: chưa có đơn | F | X | D; field absent khác `null` |
| Claim order | L eligibility; không E | F / ConfirmDialog lifecycle | X | mismatch/replay/already-owned ổn định |
| Not found / redirect / system error | Không skeleton giả | F | Retry hoặc về catalog | redirect không flash draft |
| Staff sign-in / expired | L challenge; không E | code input sau send | X; cooldown/attempt exhaustion | session expired → intended route hợp lệ |
| Tổng quan | L; E theo widget | F | X; widget fail riêng | D; chỉ projection theo role |
| Product list | L; E theo filter | F | X | D |
| Product editor | L; không E | F / error summary | X; unsaved-change guard | D; conflict giữ draft local |
| Variants & inventory | L; E: chưa có SKU | F vào cell lỗi | X; conflict/refetch | D; unavailable không bị thay thế |
| Post list/editor/preview | L; E list theo filter | F / error summary | X; unsaved-change guard | D; preview expiry |
| Media library/upload | L; E: chưa có asset | F vào step lỗi | X; retry đúng bước | D; chỉ finalized attach |
| Order queue | L; E theo filter | F / row-detail heading | X | D; PII theo projection |
| Order detail/audit | L; không E | F / panel lifecycle | X; transition conflict | D; action theo projection |
| Refund workflow | L; không E | F / ConfirmDialog | X; requesting/reconciling/dead-letter | D; duplicate disabled |
| Nhân sự | L; E: chưa có staff phụ | F / error summary | X; unsaved-change guard | D; role change rotate session |
| Cấu hình | L; không E | F | X | D; shipping MVP read-only |
| Permission denied | Không render stale skeleton | F vào heading | Retry session hoặc route hợp lệ | D là chính trạng thái này |

### Storefront commerce states

| State | Treatment |
|---|---|
| Cold load | Skeleton giữ đúng kích thước ảnh/card/summary; header và nav vẫn dùng được. |
| Empty catalog/search | Phân biệt catalog chưa có nội dung với filter không khớp; cho xóa filter hoặc về Mới về. |
| Variant chưa chọn | CTA “Chọn size và màu”; focus đưa tới nhóm đầu tiên thiếu lựa chọn. |
| Variant hết hàng | Disable add-to-cart, giữ lựa chọn để khách hiểu tổ hợp nào hết; không suy diễn ngày có lại. |
| Cart stale / stock changed | Giữ exact SKU và lý do từng line: archived, unavailable hoặc available quantity thấp hơn; cho remove/chỉnh quantity, tạo Quote mới và yêu cầu chấp nhận; không thay size/color. Nếu không còn line fulfillable, quay về cart recovery thay vì dead-end checkout. |
| Quote active | Hiện `quoteId`, tổng tiền, `expiresAt` và nhãn “Báo giá — chưa giữ hàng”. Countdown chỉ hỗ trợ; submit luôn revalidate bằng `serverTime`. [ASSUMPTION] Hiển thị countdown mm:ss ở 5 phút cuối. |
| Quote expired | Khóa submit, gọi reprice, trình bày các khoản thay đổi trước khi khách xác nhận lại. |
| Place-order pending | Một key cho một immutable submission intent; giữ cùng key qua timeout/reload đến khi có kết quả. Payload đổi/new Quote thì rotate; mismatch hiển thị conflict, không tự resubmit. |
| VNPAY pending | Trạng thái trung tính; polling abort request cũ, chỉ nhận `aggregateVersion` tăng, dừng terminal/timeout. UI dùng continuation capability/session bảo mật, không dùng order code hay browser-return fields để authorize. |
| Payment failed | Nêu reservation còn hiệu lực hay đã hết theo projection; retry tạo PaymentAttempt bất biến mới với key/provider reference mới và server eligibility. Không restart attempt cũ. |
| Reservation active / expired | Chỉ xuất hiện sau place order online, có `reservationId`/`expiresAt` khác Quote. Đồng hồ local không tự kết luận expiry; đến hạn thì refetch projection. Late capture + reacquire thành công thay view bằng paid/confirmed; thất bại là refund-required. |
| Refund required / refunded | Không dùng “đã hủy” thay thế; hiển thị amount, trạng thái và kênh hỗ trợ khi projection cung cấp. |
| OTP/token invalid, used, expired | Một thông điệp an toàn; challenge mới vô hiệu code cũ, tối đa năm lần thử, expiry 15 phút và resend eligibility từ server. Giữ intended route/form; không tiết lộ token từng đúng hay subject/order tồn tại. |
| Guest token redeemed / reload | Redeem atomically, thiết lập Secure/HttpOnly order-scoped continuation session rồi replace URL/history; reload dùng session. Replay/expired cho outcome an toàn và challenge mới. |
| Offline | Không cho checkout/order mutation khi không kết nối; giữ field tại client và cho thử lại. Browsing có thể dùng cache nhưng phải ghi “Có thể chưa mới nhất” cho price/stock. |
| Generic API error | Inline alert chứa câu hành động được + nút thử lại; correlation ID trong details. |

### Admin operational states

| State | Treatment |
|---|---|
| List loading / empty / filtered-empty | Skeleton rows; empty copy đúng nguyên nhân; filter controls vẫn hoạt động. |
| Version conflict | Không ghi đè. Hiện “Dữ liệu đã thay đổi”, tải bản mới và cho sao chép lại input chưa lưu. |
| Permission changed / denied | Xóa cached protected projection, đóng action surface và đưa tới route hợp lệ; không coi menu ẩn là enforcement. |
| Publish/archive pending | Disable action cục bộ; thành công cập nhật lifecycle + preview/public link; revalidation có thể tiếp tục nền. |
| Upload partial failure | Giữ asset và step status; retry upload hoặc finalize tương ứng; không tạo attachment trước finalize. |
| Transition rejected | Giữ Order detail, refresh current state, giải thích guard không đạt; không optimistic-update order state machine. |
| Sensitive mutation pending | Action button busy + idempotency protection; audit result hiển thị sau server confirmation. |
| PII unavailable | Ẩn cả label/value không được project hoặc hiện “Đã ẩn theo quyền”; không render dữ liệu cached từ role trước. |
| Refund request ambiguous | Payment vẫn `refund_required`; action state riêng `requesting`/`reconciling`/`dead_letter`, hiển thị attempt history và audited redrive/escalation; cùng key không tạo request thứ hai. |
| Editor unsaved / invalid | Error gần field + summary; navigation guard cho draft local. Version conflict tải projection mới và cho copy input, không silent overwrite. |

## Interaction Primitives

- **Storefront touch-first:** tap/click để hành động; hover chỉ bổ sung. Không có CTA chỉ xuất hiện khi hover. Product image swipe hỗ trợ touch nhưng thumbnail/button vẫn truy cập bằng bàn phím.
- **Admin keyboard-complete:** `Tab` theo reading order; `Enter` kích hoạt primary action đang focus; `Esc` đóng topmost dialog/sheet; `/` focus tìm kiếm khi không ở input. [ASSUMPTION] Không thêm shortcut một phím cho mutation nhạy cảm.
- Search/filter dùng URL state để reload/share/back hoạt động đúng. Không infinite scroll cho admin; dùng cursor pagination. Storefront có thể “Xem thêm”, nhưng URL/back phải khôi phục vị trí và filter.
- Form không submit ngầm khi người dùng đang chọn option. Focus chuyển tới error summary sau submit lỗi. Mỗi app có `SkipLink` tới `<main id="main-content" tabindex="-1">`; client route cập nhật `document.title` rồi focus `h1` ngay, không đợi data animation.
- **Dialog/Sheet lifecycle:** trigger có accessible name; title/description được liên kết; modal làm background inert và trap focus. Destructive `ConfirmDialog` đặt initial focus vào Cancel, `Esc` đóng, close/complete restore trigger; nếu trigger bị refresh/xóa thì focus page heading. Responsive Order detail Sheet giữ cùng actions như desktop và focus heading khi mở.
- **GSAP motion:** dùng `gsap` + `@gsap/react`; markup SSR luôn visible. `useGSAP({scope: rootRef})`, `gsap.matchMedia()` và context cleanup là bắt buộc; timeline cũ bị `kill()` trước state mới, completion/revert `clearProps` opacity/transform. `ScrollTrigger` chỉ lazy-load sau khi below-fold storefront đã usable; admin table, form, checkout critical path và focus semantics không phụ thuộc plugin.
- **Motion map:** hero/section reveal 300–400ms; tối đa 8 product card stagger 40ms; variant/image crossfade 180–240ms; server-confirmed payment crossfade 220ms; admin detail panel 240ms. Animation luôn interruptible, không chặn input/navigation và không trì hoãn state/focus.
- **Progressive enhancement:** no-JS/import-failure baseline luôn visible và dùng được. Nhánh reduced-motion bỏ transform, stagger, scroll-link, chỉ opacity tối đa 100ms. Test bắt buộc: JS disabled, reduced motion, route interrupted, React remount và GSAP import failure; không case nào để `opacity:0`, đổi DOM order, leak inline style hoặc trì hoãn focus.
- **Live regions:** SKU có một polite atomic summary “color × size — giá — availability”; rapid selection debounce/coalesce một announcement. Payment có một persistent `role=status` atomic node chỉ đổi khi projection version/state đổi; unchanged poll và đồng hồ reservation không announce. Terminal update giữ focus và cung cấp link tới Order heading.
- **Credential URL hygiene:** lookup/claim token được redeem server-side ngay, response đặt `Referrer-Policy: no-referrer`, replace tokenized URL/history và không đưa token vào analytics, log, browser storage, DOM/motion/debug attributes.
- **Banned:** nested dialog, fake scarcity, auto-advancing carousel, color-only status, auth token trong browser storage, optimistic order/payment transitions, browser-declared payment success.

## Accessibility Floor

- WCAG 2.2 AA cho cả hai web app. Body text đạt ít nhất 4.5:1; large text/UI component đạt ngưỡng tương ứng trong `DESIGN.md`.
- Touch target tối thiểu 44×44px với khoảng cách 8px khi kề nhau; icon có thể nhỏ hơn nhưng hit area không nhỏ hơn. Body mobile tối thiểu 16px, admin metadata tối thiểu `{typography.meta}`. Zoom 200% không mất nội dung hoặc hành động.
- Mọi input có label bền vững; placeholder không thay label. Required/invalid/description liên kết qua semantics; error summary link đến field lỗi.
- Focus ring dùng `{colors.focus-ring}` và luôn thấy; boundary control đạt 3:1 bằng token theo app. Skip link, main target và route-heading focus theo Interaction Primitives; heading theo thứ bậc và route change thông báo title đúng một lần.
- Variant options expose selected/disabled/unavailable state và tên đầy đủ “Màu Đen, Size M”; swatch luôn có text/accessible name.
- Price, discount, shipping và grand total có label; screen reader không phải suy từ vị trí hoặc màu. Payment và fulfillment status dùng từ đầy đủ.
- DataTable có caption/accessible name, header semantics, sort state, row action có tên gắn với order/product. Horizontal overflow không giấu action chính.
- Live region chỉ dùng cho cart count, SKU summary, quote repriced và payment state thực sự đổi; không announce poll không đổi, timer từng giây hoặc animation completion.
- OTP mặc định là một labelled input có `autocomplete="one-time-code"`, numeric `inputmode` khi schema chỉ nhận số, format/help qua `aria-describedby`, paste/autofill/copy không bị chặn. Focus input sau create challenge; expiry/cooldown là text thường, chỉ announce khi resend vừa khả dụng; form không tự đóng.
- Hình sản phẩm có alt mô tả hữu ích; ảnh trang trí alt rỗng. GSAP không thay đổi DOM reading order, không split chữ cho screen reader và không animate focus ring. Live region announce cart/quote/payment theo state change một lần, độc lập với timeline. Video nếu thêm sau này cần caption/control và tôn trọng reduced motion.
- Storefront mobile phải có menu button 44×44px có label, navigation `Sheet` semantic và focus restoration. Product card là link thực; disclosure dùng `details/summary` hoặc button + `aria-expanded`/`aria-controls`, nội dung vẫn đọc được khi no-JS.
- Sticky CTA/action bar dùng `padding-bottom: calc(12px + env(safe-area-inset-bottom))`, reserve content/scroll padding tương ứng và dynamic viewport units; phải qua iOS/Android, landscape, keyboard-open và 200% zoom mà không che CTA hoặc nội dung cuối.

## Responsive & Platform

| Viewport | Storefront | Admin |
|---|---|---|
| `< 768px` | Một cột với `{spacing.storefront-gutter-mobile}`; nav trong Sheet; Product CTA sticky bottom nhưng không che nội dung; checkout section xếp dọc; bảng order đổi thành card/list có label. | Chỉ tác vụ xem/đổi trạng thái đơn giản; sidebar thành Sheet; table ưu tiên cột chính + row detail. Authoring phức tạp có thể cảnh báo “Nên dùng màn hình lớn”. [ASSUMPTION] |
| `768–1023px` | Grid 2–3 cột; product media/detail xếp hoặc chia cột tùy chiều ngang; checkout summary sticky khi đủ chỗ. | Sidebar collapse; editor một cột; DataTable scroll ngang có cột định danh sticky. |
| `≥ 1024px` | Catalog 3–4 cột trong `{spacing.content-max}`, dùng `{spacing.storefront-gutter-desktop}`; product media + detail hai cột. | Sidebar cố định; nội dung dùng `{spacing.admin-gutter}`; list/detail có panel; filters và batch context cùng hàng khi đủ chỗ. |

- Next/Image hoặc tương đương phải giữ tỷ lệ 4:5 và `sizes` đúng để tránh layout shift. Public Product/Post vẫn crawlable và URL có thể share; rendering/cache strategy không được làm hỏng publication revalidation.
- Không phụ thuộc gesture, hover hoặc pointer chính xác. Browser back/forward giữ navigation/filter/cart state theo nguồn tương ứng.

## Product-specific Rules

- **Variant/SKU là đơn vị mua:** mọi lựa chọn, cart line, availability và order snapshot phải nêu size × color; Product-level price chỉ được ghi “Từ …” nếu nhiều SKU khác giá.
- **Giỏ không giữ hàng:** copy không nói “đã giữ”. Reservation online bắt đầu khi place order; hết sau 30 phút theo database time.
- **Shipping:** summary hiển thị 30.000 ₫ khi merchandise subtotal dưới 500.000 ₫, miễn phí từ 500.000 ₫; discount/tax không đổi threshold. UI chỉ hiển thị kết quả server.
- **Guest privacy:** guest lookup page không cho đoán order bằng mã công khai; challenge/token 15 phút, redacted projection, rate limit và thông điệp không xác nhận tồn tại. Redeem tạo order-scoped ContinuationSession; raw token bị loại khỏi URL/history trước khi render app shell hoặc telemetry.
- **Idempotency:** key thuộc một actor/scope + canonical payload + command. Giữ key qua timeout/reload; rotate sau material edit/new Quote/new PaymentAttempt/refund/admin command; same-key/different-payload là conflict có lời giải thích, không phải retry mù.
- **Projection monotonicity:** order/payment UI chỉ áp `OrderStatusProjection.aggregateVersion` mới hơn, abort fetch cũ, stop polling khi terminal. Animation không được commit domain state hoặc hoàn tất bằng stale closure.
- **Protected cache:** query key chứa subject + permission projection; clear đồng bộ khi logout, account switch, session rotation, role change, 401/403 hoặc offline permission invalidation trước khi subject khác render.
- **Không có customer cancel ở MVP:** Order detail không hiện nút hủy khi API không có operation tương ứng. Hướng khách tới kênh hỗ trợ nếu business cung cấp. [NOTE FOR UX] Kênh hỗ trợ chưa được định nghĩa.
- **Claim:** không thay đổi recipient/address/order line snapshot; replay cho cùng ownership outcome.
- **Contract prerequisites:** spec baseline đã chốt `getCheckoutPaymentStatus`, `retryVnpayPayment`, `redeemGuestLookup`, `createOrderClaimChallenge` và `redeemOrderClaim`, cùng schema/session/outcome bắt buộc. Frontend chỉ dùng generated client; executable `contracts/openapi.yaml` phải hiện thực đúng baseline và qua compatibility gates trước story implementation.

### Commerce presentation matrix

Ba chiều Order, PaymentAttempt và fulfillment luôn hiển thị tách biệt. Các row dưới là tổ hợp hợp lệ/canonical để copy không drift; tổ hợp ngoài state machine bị coi là contract error, không được “sửa” bằng label UI.

| Order | Payment | Fulfillment | Nhãn chính / khách hàng | Next action, stock và admin wording |
|---|---|---|---|---|
| `pending_payment` | `pending` | Chưa xử lý | “Đang xác minh thanh toán” | Poll projection; stock chỉ “đang giữ đến …” nếu có reservation ID; admin “Chờ thanh toán”. |
| `confirmed` | `paid` | Chờ xử lý | “Đã thanh toán · Đơn đã xác nhận” | Có thể xử lý; stock đã consume; admin nêu selected settlement. |
| `processing` | `paid` | Đang xử lý | “Đơn đang được chuẩn bị” | Fulfillment actions theo projection; không payment action. |
| `shipped` | `paid` | Đang giao | “Đã thanh toán · Đang giao” | Không restock; admin theo dõi giao. |
| `delivered` | `paid` | Đã giao | “Đã giao” | Terminal fulfillment; payment vẫn ghi “Đã thanh toán”. |
| `confirmed` / `processing` | `cod_due` | Chờ/đang xử lý | “Thanh toán khi nhận hàng” | Stock đã consume; admin “COD chưa thu”. |
| `shipped` | `cod_due` | Đang giao | “Đang giao · Thanh toán khi nhận” | Delivery confirmation atomically collects COD. |
| `delivered` | `cod_collected` | Đã giao | “Đã giao · Đã thu COD” | Terminal; admin có audit collection. |
| `delivery_failed` | `paid` | Giao thất bại | “Giao hàng chưa thành công” | Không restock trước audited return; admin reship/cancel theo allowed actions. |
| `delivery_failed` | `cod_due` | Giao thất bại | “Giao hàng chưa thành công · Chưa thu COD” | Không restock; reship hoặc audited return. |
| `cancelled` | `failed` | Không giao | “Đơn đã hủy · Thanh toán không thành công” | Reservation released; retry chỉ nếu server quảng bá action trước cancellation terminal. |
| `cancelled` | `cod_cancelled` | Không giao/đã hoàn hàng | “Đơn đã hủy · Không thu COD” | Stock restore đúng một lần theo guard. |
| `cancelled` hoặc server-projected pre-terminal | `refund_required` | Dừng fulfillment | “Khoản thanh toán cần được hoàn” | Không gọi “đã hoàn”; stock theo projection; admin hiển thị RefundAction substate. |
| `cancelled` | `refunded` | Không giao | “Đã hoàn tiền” | Chỉ sau provider evidence; nêu amount, thời điểm khi projected. |
| `confirmed` | `paid` sau late capture | Chờ xử lý | “Thanh toán hoàn tất sau khi xác minh” | Chỉ khi stock reacquire thành công; thay mọi expiry/failure view cũ bằng version mới. |

`RefundAction` hiển thị phụ: `not_requested` → “Chưa yêu cầu”; `requesting` → “Đang gửi yêu cầu”; `reconciling` → “Đang đối soát”; `dead_letter` → “Cần xử lý thủ công”; `complete` chỉ đi cùng provider-verified `refunded`. COD `cod_cancelled` và `cod_collected` không bao giờ được gọi là online failed/refunded.

## Inspiration & Anti-patterns

- [UI UX Pro Max research artifact](.working/research-ui-pro.md) ghi các signal đã nhận (ảnh 4:5, warm neutral, editorial hierarchy, admin table/status) và các hướng đã từ chối (motion phô diễn, visual density đồng nhất). Artifact chỉ là provenance; spine/source thắng khi xung đột.
- Lấy tín hiệu từ các storefront thời trang tối giản: ảnh sản phẩm lớn, khoảng trắng rộng, nhịp editorial và catalog hierarchy rõ; không sao chép brand hoặc bố cục cụ thể.
- Lấy tín hiệu từ commerce admin data-dense: filter gần dữ liệu, status rõ chữ, detail/audit cùng ngữ cảnh.
- Từ chối countdown gây áp lực, sale popup, carousel tự chạy, điều hướng bí ẩn và dashboard trang trí không dẫn tới hành động.
- Từ chối một visual density cho cả hai app: storefront cần thư thái; admin cần mật độ vận hành. Chúng chia sẻ token và từ vựng, không chia sẻ page layout.

Mock coverage đã chọn:

- [Storefront home/catalog](mockups/storefront-home.html) — canonical entry, navigation, editorial hero và product grid.
- [Product detail mobile](mockups/product-detail.html) — load-bearing SKU color × size selection, stock và sticky add-to-cart.
- [Checkout VNPAY pending](mockups/checkout-pending.html) — payment uncertainty sau browser return, reservation time và order summary.
- [Admin orders](mockups/admin-orders.html) — desktop data density, filter, redacted PII, `delivery_failed` detail và guarded reship action.

Mock chỉ minh họa một state canonical cho mỗi surface; spine và source contract thắng khi có xung đột.

Audit trail: `.working/key-storefront-home.html` → `mockups/storefront-home.html`, `.working/key-product-detail.html` → `mockups/product-detail.html`, `.working/key-checkout-pending.html` → `mockups/checkout-pending.html`, `.working/key-admin-orders.html` → `mockups/admin-orders.html`. Các file `.working/key-*` là bản audit trùng nội dung, không phải consumer inputs riêng.

## Key Flows

### Flow 1 — Mai mua áo bằng VNPAY trên điện thoại (CAP-1, CAP-4, CAP-5)

1. Mai, 27 tuổi, mở storefront sau giờ làm và vào “Mới về”.
2. Cô mở Product detail, xem ảnh và chọn màu “Nâu cacao”, size M; giá và tồn kho cập nhật theo đúng Variant/SKU.
3. Mai thêm SKU vào giỏ, mở Checkout, nhập email, số điện thoại, địa chỉ và chọn VNPAY.
4. Server trả Quote gồm subtotal, shipping, discount, tax, grand total và expiry; Mai kiểm tra rồi đặt đơn.
5. Storefront chuyển sang VNPAY. Khi quay lại, màn hình chỉ nói “Đang xác minh thanh toán”.
6. **Climax:** server nhận capture hợp lệ, giữ được stock và chuyển payment/order sang `paid/confirmed`; màn hình đổi thành xác nhận đơn với mã và email theo dõi — không cần Mai đoán tiền đã đi đâu.

Failure: IPN chậm → giữ pending, monotonic polling có giới hạn và cho đóng trang. Capture đến sau reservation expiry: reacquire stock thành công → projection mới thay view bằng `paid/confirmed` với lời giải thích thanh toán hoàn tất sau trì hoãn; thất bại → `refund_required`, không nói đơn đã xác nhận.

### Flow 2 — Phúc đặt COD không tạo tài khoản và tra cứu sau đó (CAP-4, CAP-5, CAP-6)

1. Phúc chọn đúng size × color SKU, thêm vào giỏ và checkout như khách.
2. Anh chọn COD; Quote được revalidate trước submit.
3. Server atomically consume stock, tạo Order `confirmed` và payment `cod_due`.
4. **Climax:** trang xác nhận nói rõ “Thanh toán khi nhận hàng”, mã đơn và email sẽ chứa link tra cứu bảo mật; không ép tạo tài khoản.
5. Hai ngày sau Phúc vào “Theo dõi đơn”, gửi lookup challenge và mở token một lần từ email; server redeem rồi thay URL bằng ContinuationSession HttpOnly order-scoped.
6. Trang guest tracking chỉ hiện projection redacted và timeline hiện tại; reload/back dùng session, không dùng lại raw token.

Failure: token hết hạn/đã dùng → cùng một thông điệp an toàn và CTA gửi link mới; hệ thống không xác nhận order/email có tồn tại. Token không vào referrer, history, storage, telemetry hoặc log.

### Flow 3 — An đăng nhập bằng email OTP và claim đơn khách (CAP-6, CAP-8)

1. An mở Tài khoản, nhập email và nhận OTP 15 phút.
2. Cô paste OTP; session được thiết lập bằng Secure/HttpOnly cookie, không có token trong local storage.
3. Từ email đơn khách đủ điều kiện, An mở claim link; storefront xác nhận cô đang dùng verified email khớp snapshot.
4. An chọn “Liên kết đơn này”.
5. **Climax:** Order xuất hiện trong “Đơn hàng của tôi” nhưng recipient, address và line snapshots giữ nguyên; mở lại claim link trả cùng ownership result.

Failure: email không khớp hoặc token invalid → không claim, không đề xuất reassignment; copy hướng dẫn đăng nhập đúng email. Claim initiation gửi challenge không enumeration tới immutable order email; executable OpenAPI phải cung cấp operation trước build.

### Flow 4 — Lan xuất bản một Product có SKU và media (CAP-2, CAP-9, CAP-1)

1. Lan, CatalogEditor, mở Sản phẩm và tạo Product draft.
2. Cô thêm các tổ hợp size × color, nhập giá VND và stock cho từng SKU; bảng hiển thị on-hand/reserved/available riêng.
3. Lan xin presigned upload, tải ảnh thẳng lên object storage, finalize rồi attach asset.
4. Cô mở protected preview, sửa merchandising fields và slug.
5. Lan chọn Publish; `ConfirmDialog` (nhãn “Xác nhận xuất bản”) tóm tắt tác động public/redirect.
6. **Climax:** API xác nhận `published`; admin hiện public link, storefront chỉ thấy bản đã publish và cache được revalidate qua event.

Failure: finalize media lỗi → asset giữ trạng thái bước và cho retry; publish bị chặn nếu required public fields/asset chưa hợp lệ. Version conflict → tải bản mới, không ghi đè im lặng.

### Flow 5 — Lan xuất bản bài viết editorial (CAP-3, CAP-9)

1. Lan mở Bài viết, tạo Post draft và gắn finalized media.
2. Cô xem preview qua quyền có hạn, kiểm tra URL và nội dung.
3. Lan publish; admin chờ server confirmation và hiển thị public link.
4. **Climax:** Post xuất hiện ở Bài viết trên storefront; slug cũ redirect nếu đã đổi và draft không hề lộ công khai.

Failure: preview authorization hết hạn → yêu cầu tạo preview mới; không fallback sang public draft URL.

### Flow 6 — Huy xử lý đơn giao thất bại (CAP-7, CAP-8)

1. Huy, OrderOperator, lọc Order queue theo `delivery_failed`.
2. Anh mở Order detail; payment, fulfillment, snapshot và audit timeline được tách rõ.
3. Huy chọn reship (`delivery_failed → processing`) hoặc chuyển ca cho OwnerAdmin khi cần refund/cancel.
4. Với returned stock, allowed action chỉ mở sau audited return receipt theo server guard.
5. **Climax:** transition được server chấp nhận, timeline thêm actor/time/effect và queue cập nhật; Huy biết stock/payment không bị UI tự suy diễn.

Failure: trạng thái đã được người khác đổi → API từ chối expected-state; UI refresh order, giữ reason đã nhập và chỉ hiển thị các transition mới được phép.

### Flow 7 — Vy quản lý quyền nhân sự và hoàn tiền (CAP-7, CAP-8)

1. Vy, OwnerAdmin, vào Nhân sự, tạo/disable staff hoặc gán một role rõ permission scope.
2. `ConfirmDialog` (nhãn “Xác nhận thay đổi quyền”) nêu thay đổi đặc quyền; server ghi immutable audit entry và rotate/revoke session khi cần.
3. Vy mở Refund workflow từ payment `refund_required`, kiểm tra order, attempt, amount và reason.
4. Cô gửi request một lần và theo dõi reconciliation.
5. **Climax:** payment hiển thị `refunded` từ server/provider evidence và audit timeline nối được actor, attempt, amount — không có thao tác “đánh dấu hoàn tiền” thuần UI.

Failure: permission bị đổi giữa phiên → API deny, UI xóa protected cache và route về surface hợp lệ.

### Flow 8 — Minh đăng nhập staff bằng email OTP (CAP-8)

1. Minh, OrderOperator active trong allowlist, mở Admin; intended route được giữ ở server/session-safe navigation state.
2. Anh nhập email; response luôn trung tính. Nếu hợp lệ, challenge staff riêng được gửi, hết hạn 15 phút và code cũ bị vô hiệu khi gửi code mới.
3. Focus tới input OTP có paste/autofill; server cho tối đa năm lần thử và trả resend eligibility/rate-limit không enumeration.
4. **Climax:** xác minh thành công thiết lập revocable Secure/HttpOnly staff session; Admin tải projection đúng `OrderOperator` rồi đưa Minh về intended route nếu còn quyền.

Failure: expired/used/wrong/exhausted dùng một thông điệp an toàn, giữ form và cho challenge mới khi server cho phép. Session hết hạn/role đổi → clear cache trước render, quay về sign-in hoặc route hợp lệ; không flash PII từ session cũ.

## Coverage Notes

| Capability | Vì sao không là flow UI độc lập | UX trace / acceptance owner |
|---|---|---|
| CAP-10 | Worker/outbox effect, không phải navigation goal | Pending/retry/dead-letter, reservation expiry, email, late-capture và revalidation chỉ hiện server-confirmed projection; Flow 1, State Patterns và admin audit là acceptance UX; worker/event stories lấy reliability từ Architecture AD-11/domain-events. |
| CAP-11 | Integration contract cho contributor/agent | Generated client, enum/problem details và mocks phải render đúng mọi surface-state/matrix ở spine; contract-owner story chạy compatibility + consumer tests trước frontend/backend merge. |
| CAP-12 | Local delivery/quality gate cho contributor | Hai app phải chạy trong Compose và key flows dùng generated mocks; infra/CI story kiểm healthcheck, lint/type/contract/affected tests và Conventional Commit, không thêm màn hình người dùng. |

[NOTE FOR UX] Còn một quyết định nội dung không chặn contract: kênh hỗ trợ hiển thị cho khách. Product/Post fields, payment continuation/retry/claim operations, PII projections, staff OTP, challenge limits và shipping read-only đã được source contract đóng. Staff email OTP vẫn là `[ASSUMPTION]` có thể thay qua một spec update sau.
