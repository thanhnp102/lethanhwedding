# Website cưới Mai Lê & Phúc Thành — Hướng dẫn

Web tĩnh thuần HTML/CSS/JS, mobile-first. Không cần server. Deploy free lên Vercel.

## Cấu trúc thư mục

```
lethanhwedding/
├── index.html              ← cấu trúc trang (HTML)
├── tao-link.html           ← công cụ tạo link mời theo tên khách
├── google-apps-script.gs   ← code đẩy RSVP lên Google Sheet
├── HƯỚNG DẪN.md            ← file này
└── assets/
    ├── css/
    │   └── style.css       ← toàn bộ giao diện (màu, font, layout)
    ├── js/
    │   └── main.js         ← xử lý (đếm ngược, RSVP, song ngữ, nhạc…)
    ├── img/
    │   ├── hero.jpg         ← ảnh bìa trang chủ
    │   ├── g1.jpg … g8.jpg  ← 8 ảnh album
    │   ├── venue1.jpg       ← ảnh card Lễ Vu Quy
    │   ├── venue2.jpg       ← ảnh card Lễ Thành Hôn
    │   ├── qr-code.jpeg     ← mã QR chuyển khoản (section Mừng cưới)
    │   └── timeline/        ← icon các mốc thời gian (1-1…2-3)
    └── audio/
        └── music.mp3        ← nhạc nền
```

---

## 1. Xem thử trên máy

Nhấp đúp `index.html` để mở bằng trình duyệt. Mọi thứ chạy được trừ RSVP (cần làm bước 2). Nhạc nền sẽ tự phát sau lần chạm/cuộn đầu tiên (trình duyệt chặn autoplay ngay khi mở — đây là quy định chung, không sửa được).

---

## 2. Nối RSVP vào Google Sheet (5 phút)

Đây là bước duy nhất cần thao tác. Khách điền form → dữ liệu tự về Sheet của anh.

1. Vào `sheet.new` tạo 1 Google Sheet mới, đặt tên ví dụ **RSVP Đám cưới**.
2. Trên Sheet, mở menu **Tiện ích mở rộng (Extensions) → Apps Script**.
3. Xoá hết code mẫu, mở file `google-apps-script.gs` trong thư mục này, copy toàn bộ dán vào.
4. Bấm **Triển khai (Deploy) → Bản triển khai mới (New deployment)**.
   - Loại (Select type): **Web app**
   - Thực thi với tư cách (Execute as): **Me** (chính anh)
   - Ai có quyền truy cập (Who has access): **Anyone (Bất kỳ ai)** ← bắt buộc
5. Bấm **Deploy**, cấp quyền (Authorize) khi Google hỏi (chọn tài khoản → Advanced → Go to project → Allow).
6. Copy **Web app URL** (dạng `https://script.google.com/macros/s/..../exec`).
7. Mở `assets/js/main.js` bằng trình soạn thảo (hoặc TextEdit), tìm dòng đầu file:

   ```js
   const RSVP_ENDPOINT = "";
   ```

   Dán URL vào giữa hai dấu ngoặc kép:

   ```js
   const RSVP_ENDPOINT = "https://script.google.com/macros/s/..../exec";
   ```

8. Lưu file. Xong — mỗi xác nhận của khách sẽ thành một dòng mới trong Sheet.

> Kiểm tra nhanh: mở URL `.../exec` bằng trình duyệt, nếu thấy dòng "RSVP endpoint dang hoat dong." là deploy thành công.

> Nếu sau này sửa `google-apps-script.gs`: vào **Deploy → Manage deployments → Edit (bút chì) → Version: New version → Deploy**. URL giữ nguyên.

Nếu **chưa** điền `RSVP_ENDPOINT`, form vẫn hiện "Cảm ơn" nhưng dữ liệu chỉ lưu tạm trong trình duyệt khách (anh không xem được). Nhớ làm bước này trước khi gửi link cho khách.

---

## 3. Deploy lên Vercel (miễn phí, có link gửi khách)

### Cách A — kéo thả (nhanh nhất, không cần Git)

1. Tạo tài khoản tại https://vercel.com (đăng nhập bằng Google).
2. Cài Vercel CLI: mở Terminal gõ `npm i -g vercel`.
3. Trong Terminal, `cd` vào thư mục này rồi gõ `vercel`. Làm theo hướng dẫn → ra link `https://ten-du-an.vercel.app`.

### Cách B — qua GitHub (tự cập nhật khi sửa)

1. Đẩy thư mục này lên một repo GitHub.
2. Vào Vercel → **Add New → Project → Import** repo đó → **Deploy**.
3. Mỗi lần push code mới, Vercel tự deploy lại.

Sau khi có link, gửi cho khách qua Zalo/Facebook/thiệp QR đều được.

### Tên miền riêng (tuỳ chọn)
Nếu muốn `tenmiengcuaanh.com`: mua tại Vercel hoặc nhà cung cấp khác (Namecheap, GoDaddy…), rồi vào **Vercel → Project → Settings → Domains** thêm vào và trỏ DNS theo hướng dẫn Vercel.

---

## 4. Thay ảnh / nhạc / nội dung

**Thay ảnh:** chép ảnh mới vào `assets/img/`, đặt trùng tên cũ (`hero.jpg`, `g1.jpg`…) là xong. Nên nén ảnh xuống dưới ~400KB mỗi tấm để web nhẹ (web hiện tổng ~7MB).

**Đổi ảnh bìa:** thay `assets/img/hero.jpg`. Ảnh chụp ngang đẹp nhất. Trên điện thoại web tự crop lệch về **bên phải** (giữ đúng khoảnh khắc tay nắm của ảnh hiện tại) — nếu ảnh mới có chủ thể ở giữa/trái, sửa dòng `object-position:72% center` trong `assets/css/style.css` thành `center` hoặc `30% center`.

**Thay nhạc:** chép file mp3 mới vào `assets/audio/music.mp3` (trùng tên).

**Đổi mã QR mừng cưới:** thay `assets/img/qr-code.jpeg` bằng ảnh QR mới (giữ trùng tên). Section "Mừng cưới" cuối trang là hộp phong bao chữ Hỷ, khách chạm để mở ra QR.

**Sửa chữ (ngày giờ, địa điểm, lời mời):** mở `index.html`, các nội dung đều là tiếng Việt dễ tìm (Ctrl+F "Lễ Vu Quy", "White Palace"…).

---

## 5. Thiệp mời theo tên từng khách

Mỗi khách có thể nhận một link riêng, mở ra sẽ thấy dòng "Thân mời [tên]" trên ảnh bìa, và ô xác nhận RSVP tự điền sẵn tên.

Cách hoạt động: thêm `?guest=tên` vào cuối link. Ví dụ:
`https://lethanhwedding.online/?guest=anh%20Jeremy%20%26%20gia%20%C4%91%C3%ACnh`

Không cần gõ tay phần mã hoá đó — mở file **`tao-link.html`** (nhấp đúp), dán danh sách khách mỗi dòng một tên, bấm "Tạo link". Công cụ tự sinh toàn bộ link đã chuẩn hoá, có nút Copy từng link và nút chia sẻ Zalo. Nhớ sửa ô "link gốc" thành đúng tên miền của bạn trước khi tạo.

Khách mở link không có tên (link gốc trơn) vẫn xem bình thường, chỉ không hiện dòng chào riêng.

`tao-link.html` là công cụ nội bộ của bạn — có thể deploy cùng web (truy cập tại `lethanhwedding.online/tao-link.html`) hoặc giữ riêng trong máy, tuỳ ý.

## 6. Song ngữ Việt / Anh

Web có sẵn 2 ngôn ngữ. Khách bấm nút **EN / VI** ở góc trên phải (cạnh nút nhạc) để chuyển. Hoặc gửi thẳng link tiếng Anh bằng `?lang=en`:

- Tiếng Việt (mặc định): `lethanhwedding.online/`
- Tiếng Anh: `lethanhwedding.online/?lang=en`
- Kèm tên khách: `lethanhwedding.online/?lang=en&guest=Mr%20Jeremy`

Trong `tao-link.html`, tích ô **"Tạo link tiếng Anh"** thì mọi link sinh ra tự kèm `?lang=en` — tiện gửi khách nước ngoài.

## 7. Việc nên làm trước khi gửi khách

- [ ] Làm xong bước 2 (RSVP → Sheet) và test thử gửi 1 form.
- [ ] Deploy Vercel, mở link trên điện thoại kiểm tra.
- [ ] (Tuỳ chọn) Đổi ảnh `og:image` trong `index.html` thành URL tuyệt đối, ví dụ `https://ten-du-an.vercel.app/assets/img/hero.jpg`, để khi gửi link Zalo/Facebook hiện ảnh xem trước.
- [ ] Kiểm tra 2 bản đồ chỉ đúng địa điểm (Google Maps tự tìm theo địa chỉ — nếu lệch, lấy link nhúng chính xác từ Google Maps thay vào `src` của iframe).
```
