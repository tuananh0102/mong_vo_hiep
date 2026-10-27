# HỆ THỐNG THIẾT KẾ GIAO DIỆN - VẠN KIẾP GIANG HỒ

Tài liệu này là luật chung cho mọi màn hình của game.
Mục tiêu: người hoặc agent gặp một phần giao diện chưa có vẫn tự dựng được, và kết quả trông như cùng một tay vẽ.
Nội dung gameplay của giao diện (4 phân vùng, 5 Tab, Văn bia, Cửa hàng Luân Hồi) nằm ở [Hồ sơ 07](../ho_so_07_giao_dien_ui_ux_luan_hoi_va_dai_ket_cuc.md).
Tài liệu này quy định *cách thể hiện*.

## 0. Các file

| File | Vai trò |
| :--- | :--- |
| [tokens.css](tokens.css) | Nguồn sự thật duy nhất cho màu, chữ, khoảng cách, bo góc, bóng, chuyển động, lớp. |
| [thanh_phan.css](thanh_phan.css) | Toàn bộ thành phần dùng chung (tiền tố `vk-`). |
| [mau.html](mau.html) | Trang mẫu sống: 4 màn hình ghép sẵn và catalog thành phần. Copy HTML từ đây. |
| [kiem_tra_tuong_phan.py](kiem_tra_tuong_phan.py) | Kiểm tra mọi cặp chữ / nền đạt WCAG AA. |

Xem trang mẫu: chạy lệnh dưới ở thư mục gốc dự án rồi mở `http://localhost:8765/mau.html`.

```bash
python -m http.server 8765 --directory giao_dien
```

Nếu sau này chọn framework (React, Vue, Flutter...), port nguyên tầng token và tên thành phần sang framework đó.
Không đặt lại tên, không đổi giá trị khi port.

## 1. Năm nguyên tắc

1. **Đọc là chính.** Biên Niên Sử là nội dung chính của game, được ưu tiên diện tích và độ dễ đọc (thân văn 17px, giãn dòng 1.6). Mọi thứ khác nhường chỗ cho chữ.
2. **Một màn hình, nhiều lớp.** Không chuyển trang. Nội dung mới mở thành lớp nổi (Sheet, Modal, Popover) đè lên màn hình chính, đóng lại là về đúng chỗ cũ.
3. **Màu không bao giờ đứng một mình.** Mọi màu mang nghĩa phải đi kèm biểu tượng hoặc chữ (⚔, nhãn "Hiểm", tên phẩm cấp...).
4. **Thủy mặc tiết chế.** Nền giấy, chữ mực, điểm nhấn chu sa và ánh kim dùng ít. Không gradient sặc sỡ, không bóng lạnh xanh xám, không emoji màu ngoài bộ ký hiệu ở mục 4.
5. **Quyết định minh bạch.** Mọi lựa chọn luôn hiện chi phí (AP, ngân lượng) và độ khó trước khi chạm. Người chơi không bao giờ phải đoán nút nào bấm được.

## 2. Token

### 2.1. Hai tầng

- **Tầng 1 - Bảng màu gốc** (`--mau-*`): mã màu thật, đặt tên theo chất liệu (giấy, mực, chu sa, thanh ngọc...). Chỉ được tham chiếu trong `tokens.css`.
- **Tầng 2 - Ngữ nghĩa**: đặt tên theo *vai trò* (`--nen`, `--chu-phu`, `--su-kien-giao-chien`, `--pham-3`, `--do-kho-hiem`...). Thành phần chỉ dùng tầng này.

Nhờ vậy chủ đề Tang (Văn bia trắng đen) chỉ cần ghi đè tầng 2 trong `[data-chu-de="tang"]`, không sửa một dòng thành phần nào.

### 2.2. Nhóm token

| Nhóm | Tiền tố | Ghi chú |
| :--- | :--- | :--- |
| Nền & bề mặt | `--nen`, `--be-mat-noi`, `--be-mat-lom`, `--phu-mo` | Nổi = thẻ, modal, sheet. Lõm = dock, track, ô trống. |
| Chữ | `--chu`, `--chu-phu`, `--chu-dao`, `--chu-lien-ket` | Chữ trên nền tối dùng `--chu-dao`. |
| Viền | `--vien`, `--vien-dieu-khien`, `--vien-nhan` | Viền thứ bấm được dùng `--vien-dieu-khien` (đạt 3:1). |
| Hành động | `--hanh-dong*`, `--vo-hieu-*`, `--vong-focus` | |
| Sự kiện | `--su-kien-*` | 5 loại, xem mục 4. |
| Phẩm cấp | `--pham-1` đến `--pham-4` | Xem mục 3. |
| Độ khó | `--do-kho-de/kha/kho/hiem` | |
| Thanh chỉ số | `--thanh-hp/mp/tien-do/track` | |
| Chữ | `--font-*`, `--co-chu-xs` đến `--co-chu-2xl`, `--dam-*`, `--dong-*` | |
| Khoảng cách | `--kc-1` (4px) đến `--kc-7` (48px) | Bước 4px. Không dùng giá trị ngoài thang. |
| Bo góc | `--bo-nho/vua/lon/tron` | 2 / 6 / 12 / tròn. |
| Bóng | `--bong-1/2/3` | Bóng mực ấm. |
| Chuyển động | `--tg-nhanh/vua/cham`, `--nhip` | 120 / 200 / 320ms. |
| Lớp | `--lop-dock/sheet/modal/popover` | 10 / 20 / 30 / 40. |

### 2.3. Thêm token

- Thêm token tầng 2 trước, chỉ thêm màu tầng 1 khi thật sự chưa có chất liệu phù hợp.
- Token chữ hoặc nền mới phải được thêm vào danh sách `CHU` / `NEN` trong `kiem_tra_tuong_phan.py`, rồi chạy script đến khi đạt.
- Nếu chủ đề Tang cần khác, ghi đè trong khối `[data-chu-de="tang"]`.

```bash
python giao_dien/kiem_tra_tuong_phan.py
```

## 3. Phẩm cấp 4 bậc thống nhất

GDD dùng nhiều thang khác nhau cho độ hiếm.
Giao diện gộp tất cả về **một thang 4 bậc**, một màu mỗi bậc, để người chơi học một lần là đọc được mọi nơi.
Tên hiển thị trên huy hiệu vẫn giữ đúng tên gốc của từng hệ thống.

| Bậc | Token | Thiên phú (HS01 II.7) | Kỳ ngộ (HS01 II.7) | Võ học (HS02) | Kết cục (HS07 IV) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `--pham-1` mực nhạt | Trắng | B | Nhập môn | B |
| 2 | `--pham-2` lam chàm | Lam | A | Thượng thừa | A |
| 3 | `--pham-3` tím huyền | Tím | S | Trấn phái | SS |
| 4 | `--pham-4` chu sa, viền đậm 2px | Đỏ | SSS | Thần công SSS, Thần binh | SSS |

Dùng: `<span class="vk-huy-hieu" data-pham="3">Trấn phái</span>` hoặc `<span class="vk-nhan" data-pham="4">Cửu Dương Tuyệt Mạch</span>`.
Ma công khi Hiệp nghĩa ≤ -300 hiển thị bậc 4.
Trạng thái và Nhãn tính cách không có phẩm cấp: dùng `.vk-nhan` không có `data-pham`.

## 4. Bộ ký hiệu chuẩn

Chỉ dùng các ký hiệu dưới đây.
Cần ký hiệu mới thì thêm vào bảng này trước, chọn ký tự Unicode đơn sắc (không emoji màu), có nét tương đương các ký hiệu sẵn có.

| Ký hiệu | Nghĩa | Nơi dùng |
| :--- | :--- | :--- |
| · | Sự kiện đời thường | Biên Niên Sử, `data-loai` mặc định |
| ⚔ | Giao chiến, thù hận, cảnh báo sinh tử | `data-loai="giao-chien"`, Tab Võ Học |
| ❀ | Tình duyên | `data-loai="tinh-duyen"` |
| ✦ | Kỳ ngộ SSS | `data-loai="ky-ngo"` |
| ☯ | Kỳ ngộ đạo gia | `data-loai="dao-gia"` |
| ⛰ | Tu luyện & hành động | Tab 1 |
| ⚭ | Nhân mạch & gia phả | Tab 3 |
| ⛩ | Môn phái & gia trang | Tab 4 |
| ☰ | Thiên Hạ Phong Vân Bảng | Tab 5 |
| 🔒 | Chưa mở khóa (ngoại lệ emoji duy nhất, tự thêm bởi CSS) | `aria-disabled="true"` trên Tab |
| Ngọc vàng | 1 điểm AP | `.vk-ap__ngoc`, `.vk-chi-phi--ap` |

Ký hiệu loại sự kiện được CSS tự chèn kèm chữ cho trình đọc màn hình.
Không gõ tay ký hiệu vào nội dung câu văn.

## 5. Chữ và cách viết

- Tiếng Việt có dấu, giữ từ Hán Việt của GDD. Viết hoa tên riêng, tên võ học, tên Tab: *Hoa Sơn Kiếm Pháp*, *Tu Luyện*.
- Số: dấu chấm phân cách nghìn (`1.250 lạng`), dấu phẩy thập phân. Số trong bảng, thanh, chi phí dùng `tabular-nums` (đã có sẵn trong thành phần).
- Tiền tệ viết `lạng`, AP viết `AP`, điểm Luân Hồi viết `điểm`.
- Nút: động từ ngắn, 1 - 4 từ (*Giao chiến*, *Đổi*, *Bước vào Đài Vọng Hương*). Nút chính của màn hình chính luôn là **+1 Tuổi**.
- Nhãn Tab tối đa khoảng 10 ký tự, không xuống dòng.
- Thân văn sự kiện ở ngôi thứ hai ("bạn" ở Biên Niên Sử, "ngươi" được phép trong lời thoại NPC trong Modal).
- Không dùng dấu gạch dài (em dash). Dùng dấu gạch thường "-".

## 6. Bố cục và chọn lớp hiển thị

### 6.1. Khung

`.vk-man-hinh` chia 3 hàng: Header (`.vk-header`, ~15%) | Biên Niên Sử (`.vk-bien-nien`, ~65%) | Dock (`.vk-dock`, ~20%).
Chiều rộng tối đa 480px, trên desktop căn giữa.
Mọi lớp nổi (`.vk-sheet`, `.vk-phu`) đặt *bên trong* `.vk-man-hinh` để căn theo khung.

### 6.2. Nội dung mới đặt ở đâu?

Đây là câu hỏi đầu tiên khi gặp phần giao diện chưa có.
Đi từ trên xuống, chọn dòng đầu tiên khớp:

| Nếu nội dung là... | Dùng | Ví dụ |
| :--- | :--- | :--- |
| Một việc đã xảy ra, chỉ cần biết | Dòng mới trong Biên Niên Sử (`.vk-bien-nien__muc`) | Lên cấp võ học, nhận tiền thưởng |
| Thông tin nhanh về một tên trong câu | `.vk-lien-ket` mở `.vk-popover` | Chạm tên NPC, tên võ học |
| Bắt buộc người chơi chọn ngay, game dừng chờ | `.vk-modal` trong `.vk-phu` | Sự kiện, Tam Hiệp, xác nhận không hoàn tác |
| Một khu vực để xem / quản lý, có thể đóng bất cứ lúc nào | `.vk-sheet` | 5 Tab, Bát Tự & Thiên Phú, Bản đồ Thần Châu, Gia phả |
| Màn hình kết thúc một kiếp hoặc chuyển giai đoạn lớn | Toàn khung, có thể đổi chủ đề | Văn bia (`data-chu-de="tang"`), Đài Vọng Hương |

Không có toast hay thông báo nổi tự biến mất: mọi thông báo là một dòng Biên Niên Sử.
Không mở Modal chồng Modal; Sheet có thể mở Modal xác nhận.

## 7. Danh mục thành phần

Xem trực quan và copy HTML ở [mau.html](mau.html).

| Thành phần | Lớp gốc | Dùng khi | Biến thể / trạng thái |
| :--- | :--- | :--- | :--- |
| Khung màn hình | `.vk-man-hinh` | Gốc của mọi màn hình trong game | |
| Thanh trạng thái | `.vk-header` | Header trên cùng | `__ten`, `__vung` là nút mở Sheet |
| Biên Niên Sử | `.vk-bien-nien` | Dòng thời gian | `__nam` (dính trên), `__muc[data-loai]` |
| Liên kết trong câu | `.vk-lien-ket` | Tên NPC / võ học / vật phẩm chạm được | |
| Thẻ xem nhanh | `.vk-popover` | Thông tin 1 - 3 dòng | `__tieu-de` có thể kèm huy hiệu |
| Lớp phủ + Thẻ quyết định | `.vk-phu > .vk-modal` | Sự kiện bắt buộc chọn | `__tieu-de`, `__than`, `__lua-chon` |
| Phương án | `.vk-lua-chon` | Mỗi lựa chọn trong Modal | `--nguy`, `aria-disabled="true"` (Cổng chưa đạt) |
| Bảng Tam Hiệp | `.vk-tam-hiep` + `.vk-hiep` | Trong Modal giao chiến | `.vk-hiep__o[aria-current="step"]` |
| Dock | `.vk-dock` | Đáy màn hình chính | `__hanh-dong` chứa AP và +1 Tuổi |
| Ngọc AP | `.vk-ap > .vk-ap__ngoc` | Số AP còn lại | `data-sang="true"` |
| Nút +1 Tuổi | `.vk-nut.vk-nut--chinh.vk-nut--lon.vk-qua-nam` | Qua năm | `data-nhac="true"` khi hết AP |
| Tab | `.vk-tabs > li > .vk-tab` | 5 Tab ở Dock | `aria-selected`, `aria-disabled` (khóa) |
| Sheet | `.vk-sheet` | Nội dung Tab, bảng chi tiết | `__tay-cam`, `__dau`, `__tieu-de`, `__than` |
| Tiêu đề mục | `.vk-tieu-de-muc` | Chia nhóm trong Sheet | |
| Danh sách | `.vk-danh-sach > li > .vk-dong` | Mọi danh sách: hành động, NPC, vật phẩm | `__chinh`, `__tieu-de`, `__meta`, `__phu`; `disabled` |
| Chi phí | `.vk-chi-phi` | AP, ngân lượng, điểm | `--ap` (có ngọc) |
| Ô trang bị | `.vk-o-luoi > .vk-o` | Ô võ học, binh khí, giáp | `data-trong="true"` |
| Bảng | `.vk-bang` | Xếp hạng, so sánh nhiều cột | `.so` căn phải, `tr[aria-current="true"]` là người chơi |
| Thẻ ưu đãi | `.vk-uu-dai` | Món mua / đổi bằng điểm | Nút `disabled` ghi rõ "Thiếu N điểm" |
| Văn bia | `.vk-van-bia` | Màn hình báo tử | Đặt trong `data-chu-de="tang"` |
| Nút | `.vk-nut` | Hành động chung | `--chinh`, `--nguy`, `--lon`, `--khoi`, `disabled` |
| Huy hiệu | `.vk-huy-hieu` | Phẩm cấp, độ khó, nhãn ngắn | `data-pham="1-4"`, `data-do-kho="de/kha/kho/hiem"` |
| Nhãn đặc tính | `.vk-nhan` | Thiên phú, Trạng thái, Tính cách | `data-pham` (chỉ Thiên phú) |
| Thanh chỉ số | `.vk-thanh` | HP, MP, tiến độ | `--hp`, `--mp`, `--tien-do`; `style="--ti-le: 72%"` |
| Số | `.vk-so` | Số đứng riêng ngoài thành phần | |

## 8. Quy ước đặt tên và trạng thái

- **Lớp:** `.vk-khoi`, `.vk-khoi__phan`, `.vk-khoi--bien-the` (BEM), tên tiếng Việt không dấu, nối bằng gạch ngang.
- **Biến thể theo dữ liệu game** dùng `data-*`, giá trị khớp trường dữ liệu: `data-loai`, `data-pham`, `data-do-kho`, `data-trong`, `data-sang`, `data-nhac`, `data-chu-de`. Code chỉ việc đổ giá trị từ JSON vào thuộc tính.
- **Biến thể thuần hình thức** dùng modifier `--`: `vk-nut--chinh`, `vk-thanh--hp`.
- **Trạng thái tương tác** dùng thuộc tính gốc, không tạo lớp `.is-*`: `disabled`, `aria-disabled`, `aria-selected`, `aria-current`, `hidden`.
- CSS riêng của trang mẫu dùng tiền tố `.mau-`, không bao giờ xuất hiện trong game.

## 9. Từ ký hiệu kịch bản sang giao diện

Ký hiệu chuẩn ở [Hồ sơ 06 mục I.2](../ho_so_06_cong_thuc_rng_kinh_te_dan_duoc_ky_tran.md) hiển thị như sau:

| Ký hiệu | Hiển thị |
| :--- | :--- |
| `[Cổng: X ≥ N]` đạt | `.vk-lua-chon` bình thường, không hiện điều kiện. |
| `[Cổng: X ≥ N]` chưa đạt | `.vk-lua-chon[aria-disabled="true"]`, dòng kiểm định ghi "Cần X N". |
| `[Cổng ẩn: ...]` chưa đạt | Không render. |
| `[Roll ...]`, `[Roll ngược ...]`, `[Giao chiến nhanh: N]` | Dòng kiểm định: tên chỉ số + `.vk-huy-hieu[data-do-kho]`. Nhãn theo xác suất thật: **Hiểm** < 25%, **Khó** 25 - 49%, **Khá** 50 - 74%, **Dễ** ≥ 75%. Không hiện số %. |
| Phương án có thể chết hoặc mất lớn | Thêm `.vk-lua-chon--nguy`. |
| `[Tam Hiệp: Tên]` | Phương án ghi "Giao chiến"; khi vào trận Modal có `.vk-tam-hiep`. |
| `[Ngẫu nhiên: p%]` | Không hiện gì về tỷ lệ. |
| Hành động tốn AP | `.vk-chi-phi.vk-chi-phi--ap` ở `__phu` của dòng. Hết AP thì dòng `disabled`. |

## 10. Khả năng tiếp cận (bắt buộc)

- Chữ đạt 4.5:1, viền điều khiển đạt 3:1 - do `kiem_tra_tuong_phan.py` canh.
- Vùng chạm tối thiểu `--cham-toi-thieu` (44px).
- Mọi thứ bấm được là `<button>` (hoặc `<a>` nếu là điều hướng), không gắn sự kiện chạm lên `<div>`.
- Focus luôn thấy được (đã có `:focus-visible` toàn cục, không được tắt).
- Modal có `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Sheet của Tab có `role="tabpanel"`.
- Biên Niên Sử có `aria-live="polite"` để trình đọc màn hình đọc dòng mới.
- Ký hiệu trang trí trong HTML đặt `aria-hidden="true"`; ngọc AP có `aria-label` tổng ("còn 2 trên 4").
- Chuyển động tôn trọng `prefers-reduced-motion` (đã có sẵn, nút +1 Tuổi đổi sang viền tĩnh).

## 11. Quy trình thêm giao diện mới

1. **Đọc GDD** của phần đó để biết dữ liệu nào phải hiện và người chơi quyết định gì.
2. **Chọn lớp hiển thị** theo bảng mục 6.2.
3. **Ghép từ thành phần có sẵn** ở mục 7. Phần lớn màn hình mới chỉ là Sheet + `.vk-tieu-de-muc` + `.vk-danh-sach` / `.vk-o-luoi` / `.vk-bang` + huy hiệu.
4. **Thiếu thì thêm biến thể** (`--bien-the` hoặc giá trị `data-*` mới) cho thành phần gần nhất, trước khi nghĩ tới thành phần mới.
5. **Vẫn thiếu thì tạo thành phần mới** trong `thanh_phan.css`:
   - Đặt ở khối có tiêu đề `/* ============ TÊN ============ */`, tên lớp theo mục 8.
   - Màu, chữ, khoảng cách, bo góc, bóng chỉ lấy từ token tầng 2. Kích thước riêng (chiều cao, đường kính) được khai báo tại chỗ.
   - Trạng thái bằng thuộc tính gốc. Vùng chạm ≥ 44px.
   - Chạy được trong cả chủ đề Tang mà không cần sửa thêm.
6. **Thêm vào [mau.html](mau.html)**: một ô trong mục Thành phần (ghi tên lớp gốc), và nếu là màn hình mới thì thêm một khung điện thoại ghép sẵn với dữ liệu thật từ GDD.
7. **Cập nhật tài liệu này**: dòng mới ở mục 7, ký hiệu mới ở mục 4, quyết định mới ở mục 13.
8. **Kiểm tra** theo mục 12.

## 12. Danh sách kiểm tra trước khi xong

- [ ] `python giao_dien/kiem_tra_tuong_phan.py` báo đạt.
- [ ] Không có mã màu, `px` khoảng cách hay cỡ chữ lẻ trong `thanh_phan.css` (`grep -n "#[0-9A-Fa-f]\{3,6\}\|--mau-" giao_dien/thanh_phan.css` chỉ ra kết quả trong chú thích).
- [ ] Mở `mau.html` ở khung 390 × 844: không tràn ngang, không chữ bị cắt, nhãn không xuống dòng sai chỗ, khoảng cách đều.
- [ ] Thử thêm `data-chu-de="tang"` lên khung: vẫn đọc được.
- [ ] Mọi phần tử bấm được dùng Tab bàn phím tới được và thấy viền focus.
- [ ] Mục 7 và mục 4 của tài liệu này đã cập nhật.

## 13. Nhật ký quyết định

| Ngày | Quyết định | Lý do |
| :--- | :--- | :--- |
| 2026-10-27 | Nền tảng tham chiếu là HTML + CSS thuần (biến CSS). | HS07 nhắm Mobile/Web, chưa chọn framework; CSS thuần port được sang mọi framework. |
| 2026-10-27 | Gộp mọi thang độ hiếm về 4 bậc, màu theo Thiên phú (Trắng / Lam / Tím / Đỏ). | Thiên phú là hệ duy nhất GDD đã đặt tên màu; một thang giúp người chơi học một lần. |
| 2026-10-27 | Kỳ ngộ đạo gia dùng ký hiệu ☯. | HS07 chỉ quy định màu thanh ngọc, thiếu ký hiệu, vi phạm nguyên tắc 3. |
| 2026-10-27 | Thêm màu lam chàm `#2B4C7E` cho liên kết, MP, phẩm cấp 2. | Thiên phú Lam cần màu; MP cần phân biệt với HP chu sa. |
| 2026-10-27 | Nội dung 5 Tab mở bằng Sheet, Header vẫn thấy. | Giữ nguyên tắc "một màn hình": luôn thấy HP, tuổi, ngân lượng khi quản lý. |
| 2026-10-27 | Không có toast. | Biên Niên Sử đã là nơi ghi mọi thông báo; thêm toast tạo hai nguồn sự thật. |
| 2026-10-27 | Font Noto Serif (dự phòng Georgia). | Hỗ trợ đủ dấu tiếng Việt, hợp chất cổ phong, miễn phí. |
