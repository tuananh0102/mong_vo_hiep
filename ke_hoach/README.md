# KẾ HOẠCH IMPLEMENT "VẠN KIẾP GIANG HỒ"

Bộ kế hoạch này biến 7 hồ sơ GDD thành một game chạy được, đủ tính năng.
Nó viết cho agent làm theo từng bước, kể cả agent không giỏi suy luận dài.
Mọi việc được chia thành **task** nhỏ, mỗi task có: đọc gì, tạo / sửa file nào, làm từng bước gì, khi nào là xong.

## 0. Đọc theo thứ tự này

| File | Nội dung | Khi nào đọc |
| :--- | :--- | :--- |
| [README.md](README.md) | Tổng quan, 3 cột mốc, quy trình làm 1 task, bảng phủ GDD | Luôn đọc trước |
| [01_KIEN_TRUC.md](01_KIEN_TRUC.md) | Công nghệ, cây thư mục, kiểu dữ liệu, API engine, DSL sự kiện, lưu game, test | Trước task đầu tiên, và khi task ghi "xem 01 mục X" |
| [02_COT_MOC_1.md](02_COT_MOC_1.md) | Nền móng (M0) và Cột mốc 1 "Nhất Kiếp" | Khi làm task `M0-*`, `M1-*` |
| [03_COT_MOC_2.md](03_COT_MOC_2.md) | Cột mốc 2 "Giang Hồ" | Khi làm task `M2-*` |
| [04_COT_MOC_3.md](04_COT_MOC_3.md) | Cột mốc 3 "Vạn Kiếp" (đủ tính năng) | Khi làm task `M3-*` |
| [05_LO_HONG_GDD.md](05_LO_HONG_GDD.md) | 33 chỗ GDD từng thiếu số / luật, nay đã chốt và ghi vào hồ sơ; bảng chỉ mục GDD tương ứng | Khi task gặp chỗ GDD không nói |

Không đọc cả 5 file một lúc.
Chỉ đọc README, mục cần của 01, và đúng task đang làm.

## 1. Mục tiêu

- Game text-based life sim võ hiệp, màn hình dọc mobile-first, chạy trên trình duyệt (cài được như app - PWA).
- Đúng luật và số của GDD (`ho_so_01` ... `ho_so_07`), đúng hệ thống thiết kế giao diện (`giao_dien/`).
- Chơi lại được: cùng seed và cùng chuỗi lựa chọn thì ra cùng kết quả.
- Nội dung (sự kiện, võ học, môn phái, NPC mẫu, đan dược, kết cục) nằm trong file JSON ở `du_lieu/`, không viết cứng trong code.

## 2. Ba cột mốc phát hành

Mỗi cột mốc kết thúc bằng một bản **phát hành được** cho người chơi thật.
Cột mốc sau xây trên cột mốc trước, không viết lại.
Làm xong Cột mốc 3 là game đủ mọi tính năng trong 7 hồ sơ.

| Cột mốc | Tên bản | Người chơi làm được gì | Phạm vi chính |
| :--- | :--- | :--- | :--- |
| **M0** (không phát hành) | Nền móng | Chưa chơi được; có khung dự án, engine rỗng chạy test, dữ liệu kiểm tra được | Dự án TypeScript, RNG, kiểu dữ liệu, DSL sự kiện, kiểm tra dữ liệu, vector đối chiếu từ `mo_phong.py`, khung giao diện |
| **M1** → bản **v0.1 "Nhất Kiếp"** | Chơi thử | Sống trọn **một kiếp** ở Trung Nguyên từ Tuổi 0 đến lúc chết: đầu thai, lớn lên, bái sư 1 trong 4 môn phái hoặc làm Lãng khách, luyện võ, Tam Hiệp, kiếm tiền, già, chết, đọc Văn bia | HS01 II - IV, HS02 II + V, HS03 (phần Trung Nguyên), HS04 I.1 + II + III (rút gọn), HS06 I.1 - I.4 + II.1 - II.4 (rút gọn) + III, HS07 I + II |
| **M2** → bản **v0.5 "Giang Hồ"** | MVP đầy đủ lõi | Một **thế giới sống**: 200 NPC tự sống, Thiên Hạ Phong Vân Bảng, Đại sự kiện và Hoa Sơn Luận Kiếm, Chính - Tà, việc [Ám] và bại lộ, thương nghiệp, Chưởng môn và Khai Tông Lập Phái, Cửa hàng Luân Hồi | HS01 II.3 + V, HS02 I (6 môn phái) + II.2 (Ma công) + IV, HS04 I.2 + II.3 + III.1, HS05 I + III.2 (rút gọn), HS06 đủ trừ V, HS07 I.2 (Tab 5) + III + phần lớn IV |
| **M3** → bản **v1.0 "Vạn Kiếp"** | Đủ tính năng | **Năm vùng**, đủ môn phái, Thập Đại Thần Công, tình duyên, hôn nhân, con cái, **truyền thừa nhiều đời**, kết nghĩa, cừu gia, gia trang, kỳ trân dị thú, đủ 18 kết cục, chế độ Thời Đại Hoàng Kim, PWA offline | Phần còn lại của mọi hồ sơ |

Chi tiết từng task ở file cột mốc tương ứng.
Bảng ở mục 6 cho biết mỗi mục GDD do task nào phụ trách, để chắc không sót gì.

## 3. Quy trình làm một task

Làm đúng thứ tự.
Không bỏ bước.

1. **Đọc task** trong file cột mốc. Kiểm tra mọi task ở dòng "Phụ thuộc" đã xong (có commit). Chưa xong thì dừng, làm task phụ thuộc trước.
2. **Đọc nguồn**: chỉ đọc đúng các mục GDD và file ghi ở dòng "Đọc". Dùng cách đọc tiết kiệm ở `AGENTS.md` (lấy mục lục bằng `grep -n "^#"`, rồi Read theo `offset` / `limit`).
3. **Gặp chỗ GDD không nói**: tra [05_LO_HONG_GDD.md](05_LO_HONG_GDD.md).
   - Có trong đó (G01 - G33, đều đã chốt): đọc mục GDD mà bảng đầu file 05 chỉ tới; hằng số vào `game/src/luat/hang_so.ts` như mọi số GDD khác, chú thích trích mục GDD và mã G.
   - Không có: nếu chặn việc thì dừng và hỏi chủ dự án; nếu không chặn thì đặt giả định nhỏ nhất hợp lý, ghi vào `gia_dinh.ts`, thêm 1 dòng vào mục "Còn mở" ở đầu `REVIEW.md` và 1 dòng vào cuối `05_LO_HONG_GDD.md`.
4. **Viết test trước** cho phần luật (file `*.test.ts` ghi ở task). Chạy để thấy nó đỏ.
5. **Viết code** cho đến khi test xanh. Giữ đúng quy ước ở `01_KIEN_TRUC.md` mục 9.
6. **Chạy kiểm tra chung** (mục 4 bên dưới). Tất cả phải xanh.
7. **Kiểm tra bằng mắt** nếu task có giao diện (mục 5).
8. **Commit** một commit cho một task, message dạng `feat(M1-07): vòng năm và AP theo tuổi`. Không gộp nhiều task vào một commit.
9. **Đánh dấu xong**: đổi `- [ ]` thành `- [x]` ở dòng tiêu đề task trong file cột mốc, cùng commit.

Nếu một task quá lớn để xong trong một lần làm, tách nó thành `M1-07a`, `M1-07b` ngay trong file cột mốc rồi làm từng phần.
Không bao giờ để code dở dang làm đỏ test trên nhánh chính.

## 4. Định nghĩa "xong" chung (áp cho mọi task)

Chạy ở thư mục `game/`:

```bash
npm run kiem-tra
```

Lệnh này chạy lần lượt: kiểm tra kiểu (`tsc --noEmit`), lint (`eslint`), kiểm tra dữ liệu (`npm run kiem-tra-du-lieu`), toàn bộ test (`vitest run`).
Tất cả phải báo đạt.

Ngoài ra:

- Không có `Math.random()` trong `game/src/luat/` (lint chặn).
- Không có import React hay DOM trong `game/src/luat/` (lint chặn).
- Không có chuỗi văn bản kịch bản viết cứng trong `game/src/luat/` (văn bản nằm trong `du_lieu/`). Ngoại lệ: văn bản Biên Niên Sử chung do luật sinh ra, đặt trong `du_lieu/van_ban/he_thong.json` và gọi qua khóa.
- Mỗi hàm công thức có chú thích trích mục hồ sơ, ví dụ `// HS06 I.1 Tuổi thọ tối đa`.
- Nếu task đổi luật hoặc số cân bằng (không phải chỉ implement số có sẵn): làm theo quy tắc 3 của `AGENTS.md` (sửa GDD + `mo_phong.py` + chạy lại mô phỏng + ghi vòng mới vào `mo_phong/BAO_CAO.md`). Task bình thường **không** đổi số.
- Thấy lỗi ngoài phạm vi task: ghi vào `REVIEW.md`, không sửa lan.

## 5. Kiểm tra giao diện bằng mắt

Với task có giao diện:

```bash
cd game && npm run dev
```

Mở `http://localhost:5173` ở khung **390 × 844** (dùng `chrome-devtools-axi` theo quy ước của chủ dự án).
Kiểm tra theo `giao_dien/HE_THONG_THIET_KE.md` mục 12:

- Không tràn ngang, không chữ bị cắt, nhãn không xuống dòng sai chỗ.
- Mọi nút tới được bằng phím Tab, thấy viền focus.
- Thêm `data-chu-de="tang"` lên khung: vẫn đọc được.
- Đo tràn bằng JavaScript (`document.documentElement.scrollWidth > innerWidth` phải là `false`).

Thấy gì lệch mắt, kể cả ngoài task, thì sửa luôn nếu nằm trong giao diện vừa động tới; nếu ở chỗ khác thì ghi `REVIEW.md`.

## 6. Bảng phủ GDD (mục nào do task nào làm)

Dùng bảng này để chắc không sót tính năng.
Khi xong Cột mốc 3, mọi dòng phải có task đã đánh dấu xong.

| Mục GDD | Nội dung | Task |
| :--- | :--- | :--- |
| HS01 I | 5 khu vực | M0-03 (dữ liệu vùng), M3-01 (bản đồ, di chuyển) |
| HS01 II.0 | Giới tính | M1-06, M1-05 (cổng theo giới tính) |
| HS01 II.1 | 4 chỉ số Thiên phú | M0-05, M1-06 |
| HS01 II.2 | Ngân lượng, Hiệp nghĩa, Thanh danh, Danh vọng | M0-05, M1-05, M2-06 |
| HS01 II.3 | [Ám], bại lộ, đổ tội, Đại Vạch Trần | M2-06, M2-07 |
| HS01 II.4 | Nội công, chiến đấu | M1-08, M1-11 |
| HS01 II.5 | Tạp học | M1-09 |
| HS01 II.6 | Hảo cảm, Cống hiến | M1-12 (Cống hiến), M2-03 (Hảo cảm) |
| HS01 II.7 | Thiên phú / Trạng thái / Nhãn / Cấp kỳ ngộ | M1-06, M1-14 |
| HS01 II.8 | Bảng Chỉ Số Master | M0-05 |
| HS01 III | Đầu thai, Gia cảnh, Thiên phú bẩm sinh | M1-06 |
| HS01 IV | Vòng năm, AP co giãn | M1-07, M1-09 |
| HS01 V | Đại sự kiện, Hoa Sơn | M2-09, M2-10 |
| HS02 I.1 | Ngũ Đại Danh Môn | M1-12 (Thiếu Lâm, Võ Đang), M3-03 (Toàn Chân, Nga Mi) |
| HS02 I.2 | Tà phái, Ma Giáo | M2-04 (Nhật Nguyệt, Tinh Túc), M3-03 (còn lại) |
| HS02 I.3 - I.6 | Ẩn thế, Ngũ Nhạc, Thế gia, phái nhỏ | M1-12 (Hoa Sơn, Cái Bang), M3-03, M3-04 |
| HS02 II.1 | 4 trụ cột, số ô, trần Khinh công | M1-08 |
| HS02 II.2 | Tam hệ, xung khắc, Ma công | M1-11 (khắc chế), M2-04 (Ma công), M2-05 (Tẩu hỏa) |
| HS02 III.1 | Thập Đại Thần Công | M3-05 |
| HS02 III.2 | Kỳ công, ám khí, tà thuật | M3-06 |
| HS02 IV | Thần binh | M2-13 (binh khí Hắc Thị), M3-06 (hiệu ứng riêng từng món) |
| HS02 V.1 - V.3 | Tam Hiệp | M1-11 |
| HS02 V.4 | Quy tắc Cứu Mạng | M1-11 (khung), M2-15, M3-03d, M3-05, M3-09 (từng hiệu ứng) |
| HS03 I - V | Kịch bản 0 - 15 tuổi | M1-14, M1-15 (Trung Nguyên), M3-02 (vùng khác, Ẩn thế) |
| HS04 I.1 | 5 bậc môn phái, Sai phái | M1-12, M2-08 |
| HS04 I.2 | Lãng khách, 5 nghề | M1-13 (bảo tiêu, truy nã), M2-06 (sát thủ), M2-11 (khai tông), M2-12 (thương nhân) |
| HS04 II.1 - II.3 | Sự kiện 16 - 50 tuổi | M1-15, M2-08 (kế vị) |
| HS04 III.1 | Kim Bồn Tẩy Thủ | M2-07 |
| HS04 III.2 | Bế quan tự sáng tạo | M3-10 |
| HS04 III.3 | Kinh Mạch Nghịch Hành | M3-10 |
| HS05 I | NPC động | M2-01, M2-02, M2-03 |
| HS05 II | Tình duyên, 6 nguyên mẫu, Đại Hôn | M3-07 |
| HS05 III.1 | Kết nghĩa Kim Lan | M3-09 |
| HS05 III.2 | Cừu gia | M2-03 (rút gọn), M3-09 (đủ) |
| HS05 IV.1 | Sinh con, di truyền, dạy con | M3-08 |
| HS05 IV.2 | Qua đời, hao hụt di sản, chuyển kiếp | M3-08 |
| HS06 I.1 | Công thức phái sinh | M0-07 (vector), M1-04 |
| HS06 I.2 | Ký hiệu, xác suất mềm | M0-06, M1-05 |
| HS06 I.3 | Trọng số sự kiện, kỳ ngộ, Tuyệt Cảnh | M1-10, M1-11 |
| HS06 I.4 | Sát thương, khắc chế, Tẩu hỏa | M1-11, M2-05 |
| HS06 I.5 | Chiến lực | M1-04, M2-02 |
| HS06 II.1 | Thu nhập | M1-13, M2-06, M2-08, M2-11 |
| HS06 II.2 | Chi tiêu, Hắc Thị, quy mô môn phái, giá theo đại sự kiện | M1-13, M2-09, M2-11, M2-13 |
| HS06 II.3 | Nợ | M1-13 |
| HS06 II.4 | Ngân lượng khởi đầu | M1-06 |
| HS06 II.5 | Sản nghiệp, thương nghiệp | M2-12 |
| HS06 III | Đan dược | M1-13 (trị thương), M2-15 (đủ) |
| HS06 IV | Độc dược | M2-15 |
| HS06 V | Kỳ trân, dị thú | M3-06 |
| HS07 I.1 | 4 phân vùng màn hình | M0-10, M1-16 |
| HS07 I.2 | 5 Tab | M1-17, M2-14 (Tab 5), M3-01, M3-08 (gia phả) |
| HS07 II | Văn bia, Điểm Luân Hồi | M1-18 |
| HS07 III | Cửa hàng Luân Hồi | M2-16 (gói 1 - 4), M3-11 (gói 5) |
| HS07 IV | 18 kết cục | M1-18 (khung + 4 kết cục), M2-16, M3-12 |
