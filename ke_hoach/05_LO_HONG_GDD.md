# 05 - LỖ HỔNG GDD VÀ GIẢ ĐỊNH ĐỀ XUẤT

Đây là những chỗ GDD chưa có số hoặc chưa có luật, phát hiện khi lập kế hoạch.
Mỗi lỗ hổng có một **đề xuất** để agent làm tiếp mà không phải đoán (quy tắc 2 `AGENTS.md`).

**Trạng thái (2026-10-27): mọi lỗ hổng G01 - G33 đã chốt.**
Chủ dự án quyết định dùng tên nguyên tác Kim Dung và giao phần còn lại cho người lập kế hoạch tự chốt.
Mỗi quyết định đã được ghi vào hồ sơ GDD ở mục trong bảng dưới; **hồ sơ GDD là nguồn sự thật**, phần mô tả bên dưới chỉ giữ lại làm lý do.
Không quyết định nào đổi số cân bằng đã mô phỏng, nên chưa cần vòng mô phỏng mới; riêng *Âm Dương Hỗ Tế* (G23) và võ học tự sáng tạo (G21) phải chạy mô phỏng khi implement (M3-05, M3-10).

| Mã | Đã ghi ở |
| :--- | :--- |
| G01 | HS01 I |
| G02 | HS01 II.8 (sau Bảng Master) |
| G03 | HS01 IV |
| G04 | HS01 IV |
| G05 | HS01 III.2 |
| G06 | HS01 III.1 |
| G07 | HS01 II.5 |
| G08 | HS01 IV |
| G09 | HS07 IV |
| G10 | `02_COT_MOC_1.md` Phụ lục A (chép vào HS08 ở M0-04) |
| G11 | HS05 I.2 |
| G12 | HS06 I.4 |
| G13 | HS05 IV.1 |
| G14 | HS05 II.1 |
| G15 | HS02 I (quy ước chung) |
| G16 | HS02 I (quy ước chung) |
| G17 | HS02 I (quy ước chung) |
| G18 | HS06 I.4 |
| G19 | HS02 I (quy ước chung) |
| G20 | HS07 II.1 |
| G21 | HS04 III.2 |
| G22 | HS04 III.3 |
| G23 | HS01 V, HS02 II.2, HS02 III.1 |
| G24 | HS07 IV |
| G25 | HS02 (quy ước nguồn), HS07 (đầu Phần I) |
| G26 | HS05 I.2, III.1, III.2 |
| G27 | HS01 V, HS04 I.1 |
| G28 | HS01 V |
| G29 | HS06 II.2 |
| G30 | HS06 III |
| G31 | HS07 I.1 |
| G32 | HS01 IV |
| G33 | HS07 III |

Cách dùng:

1. Task ghi mã `Gxx` ở dòng "Đọc" thì đọc mục GDD ở bảng trên (đọc thêm mục bên dưới nếu cần lý do).
2. Hằng số lấy từ GDD vào `game/src/luat/hang_so.ts` như mọi số GDD khác, chú thích trích mục GDD (ví dụ `// HS01 III.1 Chỉ số gốc theo Gia cảnh (G06)`).
3. Gặp lỗ hổng mới không có ở đây: nếu chặn việc thì hỏi chủ dự án; nếu không thì đặt giả định vào `game/src/luat/gia_dinh.ts` (`// GIẢ ĐỊNH G34`), thêm 1 dòng "Còn mở" ở đầu `REVIEW.md`, và thêm mục `G34`, `G35`... ở cuối file này cùng định dạng.

---

## G01 - Vùng khởi đầu và di chuyển [ĐÃ CHỐT] (REVIEW mục 1.7)

GDD thiếu: vùng khởi đầu quay thế nào, đổi vùng tốn gì, trẻ con có tự đi được không.
Đề xuất:

- M1, M2: mọi kiếp bắt đầu ở Trung Nguyên, chưa có di chuyển.
- M3: vùng khởi đầu theo trọng số Trung Nguyên 40, Giang Nam 25, Tây Vực 12, Nam Cương 12, Bắc Cảnh 11; Võ Lâm Thế Gia lấy vùng của thế gia.
- Dưới 11 tuổi: chỉ đổi vùng qua sự kiện (theo cha mẹ, bị bán, được cứu).
- 11 - 15 tuổi: chỉ đổi vùng qua sự kiện bái sư (sư phụ đưa đi).
- Từ 16 tuổi: hành động *Đổi vùng* tốn 1 AP và 20 lạng lộ phí (Hãn Huyết Bảo Mã: 1 lần 0 AP mỗi năm, HS06 V.2).
- Nhiệm vụ sư môn và Sai phái chỉ làm được khi đang ở vùng của môn phái.

## G02 - Mô tả Phúc duyên và Tuổi thọ [ĐÃ CHỐT]

GDD thiếu: ngưỡng cho 4 mô tả Phúc duyên (HS01 II.8) và mô tả tuổi thọ ẩn (HS01 II.4).
Đề xuất:

- Phúc duyên: $< 30$ Bạc mệnh, $30 - 59$ Bình thường, $60 - 89$ Hồng phúc, $\ge 90$ Thiên mệnh (bám ngưỡng 30 / 60 của HS06 I.3).
- Tuổi thọ, theo số năm còn lại $= $ `tuoiThoMax - tuoi`: $\ge 20$ "Khí huyết dồi dào", $10 - 19$ "Thân thể vững vàng", $5 - 9$ "Tuổi xế chiều", $\le 4$ "Đèn cạn dầu".

## G03 - Hồi HP và Nội tức giữa các năm [ĐÃ CHỐT]

GDD thiếu: HP mất trong năm hồi lúc nào (chỉ có phòng trọ 20 lạng hồi đầy).
Đề xuất (khớp cách `mo_phong.py` coi mỗi trận bắt đầu đầy máu):

- Đầu mỗi năm (bước 12 vòng năm) HP và Nội tức hồi đầy.
- Đang Trọng thương chưa chữa: HP tối đa 50% cho tới khi chữa hoặc hết năm.
- Trong năm, HP mất do sự kiện giữ nguyên cho tới khi nghỉ trọ, dùng thuốc hoặc sang năm.
- Trận Tam Hiệp bắt đầu với HP hiện tại (không tự hồi).

## G04 - Sự kiện cá nhân thứ hai trong năm [ĐÃ CHỐT]

HS01 IV ghi "1 - 2 đoạn" nhưng không nói khi nào có đoạn thứ 2.
Đề xuất: không có sự kiện cố định / hẹn năm đó thì 1 sự kiện ngẫu nhiên, cộng 25% có thêm sự kiện thứ 2; Tuổi 0 không có sự kiện ngẫu nhiên.

## G05 - Danh sách Thiên phú Tuổi 0 [ĐÃ CHỐT]

GDD chỉ có 4 ví dụ, cần đủ để "chọn 1 trong 3" có ý nghĩa.
Đề xuất 12 Thiên phú, trọng số rút theo độ hiếm Trắng 60, Lam 28, Tím 10, Đỏ 2:

| Độ hiếm | Thiên phú | Hiệu ứng |
| :--- | :--- | :--- |
| Trắng | Thân Thể Cường Tráng | Căn cốt $+5$ |
| Trắng | Thông Minh Lanh Lợi | Ngộ tính $+5$ |
| Trắng | Mặt Mũi Khôi Ngô | Mị lực $+5$ |
| Trắng | Số Hưởng | Phúc duyên $+5$ |
| Lam | Đào Hoa Kiếp | Theo HS01 III.2 |
| Lam | Thiên Sinh Thần Lực | Căn cốt $+12$ |
| Lam | Đọc Nhanh Nhớ Lâu | Ngộ tính $+12$ |
| Lam | Kim Khẩu | Mị lực $+8$, Tạp học Thi $+10$ |
| Tím | Tư Chất Ngu Độn | Theo HS01 III.2 |
| Tím | Kinh Mạch Kỳ Dị | Tiến độ Nội công $+20\%$ |
| Đỏ | Cửu Dương Tuyệt Mạch | Theo HS01 III.2 |
| Đỏ | Tiên Thiên Võ Thể | Theo HS05 IV.1 (Tiến độ mọi môn $+20\%$) |

Số theo định mức kỳ ngộ B / A ở HS01 II.7 để không lệch cân bằng.

## G06 - Chỉ số gốc theo Gia cảnh [ĐÃ CHỐT]

HS01 III.1 chỉ mô tả định tính.
Đề xuất: mỗi chỉ số Thiên phú gốc $= $ `nguyen(25, 55)`, rồi cộng theo gia cảnh, kẹp $5 - 95$:

| Gia cảnh | Căn cốt | Ngộ tính | Phúc duyên | Mị lực |
| :--- | :--- | :--- | :--- | :--- |
| Hàn Vi | $-10$ | 0 | $+15$ | 0 |
| Bình Dân | 0 | 0 | 0 | 0 |
| Phú Thương | $-5$ | $+10$ | 0 | $+10$ |
| Võ Lâm Thế Gia | $+10$ | $+5$ | 0 | 0 |

Kiểm lại bằng `mo_phong.ts` (M1-19): nhân vật mẫu của `mo_phong.py` có Căn cốt 45 - 60, Ngộ tính 50 - 65.

## G07 - Lượng tăng khi Học Tạp học [ĐÃ CHỐT]

HS01 II.5: "$+5$ đến $+15$ tùy Ngộ tính".
Đề xuất: $+ \min(15, 5 + \lfloor \text{Ngộ tính} / 10 \rfloor)$.
Cần thầy hoặc sách: gia cảnh Phú Thương / Thế Gia, đang ở môn phái, hoặc có vật phẩm sách tương ứng.

## G08 - Hành động trẻ em và hành động chưa có số [ĐÃ CHỐT]

| Hành động | Tuổi | Hiệu ứng đề xuất |
| :--- | :--- | :--- |
| Nằm nôi | 0 - 5 | HP hồi đầy, Căn cốt $+1$ |
| Tập bò | 0 - 5 | Căn cốt $+1$ |
| Nghe kể chuyện | 0 - 5 | Ngộ tính $+1$ |
| Lục lọi đồ đạc | 0 - 5 | 10% nhặt vật nhỏ (vài lạng) hoặc mở 1 sự kiện "lục lọi" |
| Đọc sách vỡ lòng | 6 - 10 | Ngộ tính $+2$ |
| Rèn thể lực | 6 - 10 | Căn cốt $+2$ |
| Chơi cùng trẻ hàng xóm | 6 - 10 | Mị lực $+2$ |
| Phụ giúp gia đình | 6 - 10 | Ngân lượng $+2$, Hiệp nghĩa $+2$ |
| Đi ăn trộm vặt | 6 - 10 | 5 - 15 lạng, Hiệp nghĩa $-5$ (M2: [Ám] vặt) |
| Khám phá quanh vùng / Hành tẩu giang hồ | 11+ | Mở ngay 1 sự kiện ngẫu nhiên đủ điều kiện (quay kỳ ngộ theo $P_{KyNgo}$ trước) |
| Luyện võ cơ bản (chưa có môn phái) | 11+ | Luyện công môn tự học, cấp sư phụ 0 |

Tổng chỉ số một đứa trẻ chăm chỉ có thể tự cộng từ 0 đến 10 tuổi khoảng $+20$, cùng tầm *Tư Chất Ngu Độn* (HS01 III.2) để không lấn át Thiên phú.

## G09 - Kết cục mặc định [ĐÃ CHỐT]

HS07 IV không nói kiếp không đạt kết cục nào thì sao.
Đề xuất: kết cục **"Giang Hồ Khách Qua Đường"**, không có Điểm Danh Hiệu Kết Cục (0), Văn bia vẫn đủ 4 đoạn.

## G10 - Định mức hiệu ứng khi viết sự kiện [ĐÃ CHỐT]

Xem Phụ lục A.2 ở `02_COT_MOC_1.md`.
Rút từ các sự kiện HS03, HS04 hiện có và cấp kỳ ngộ HS01 II.7.

## G11 - Hành vi NPC mỗi năm [ĐÃ CHỐT]

HS05 I chỉ mô tả định tính.
Đề xuất: NPC là "một đời mô phỏng" chạy chính sách lối chơi của `mo_phong.py` (`song_mot_doi`, `the_gioi_npc`), như `mo_phong/BAO_CAO.md` mục 15 đã kiểm.

## G12 - Dùng vật phẩm trong trận [ĐÃ CHỐT]

HS06 III: *Kim Sáng Dược* "dùng ngay giữa Hiệp 1 và Hiệp 2".
Đề xuất: tối đa 1 vật phẩm giữa Hiệp 1 và Hiệp 2, không mất lượt; NPC không dùng (giữ khớp `mo_phong.py`).

## G13 - Sinh con, hệ số tình duyên, ngưỡng chống lạm phát [ĐÃ CHỐT]

HS05 IV.1 "có tỷ lệ sinh con" chưa có số.
Đề xuất:

- Đã kết hôn, người vợ 18 - 42 tuổi: 25% mỗi năm có con, tối đa 6 con. Phong lưu một đêm: 5%.
- *Đào Hoa Kiếp*: trọng số sự kiện tình duyên và ghen tuông $\times 2$.
- Phu thê *Ôn Nhu Tri Kỷ*: dưỡng thương Roll Căn cốt cộng $+20$ vào chỉ số.
- Ngưỡng chống lạm phát dùng ở M3-08: qua 5 đời, Chiến lực trung vị lúc 50 tuổi của đời 5 không vượt đời 1 quá 15%, Gia sản trung vị không vượt quá 50%.

## G14 - Nguyên mẫu Lang Quân cho người chơi nữ [ĐÃ CHỐT] (REVIEW mục 8, "Còn mở" ở đầu REVIEW)

Đã thêm vào HS05 II.1:

| Hồng Nhan | Lang Quân tương ứng | Hình tượng |
| :--- | :--- | :--- |
| Thanh Mai Trúc Mã | Tiểu Sư Huynh | Lệnh Hồ Xung thời trẻ |
| Băng Thanh Ngọc Khiết | Ẩn Sĩ Thoát Tục | Hư Trúc |
| Yêu Nữ Ma Giáo / Quận Chúa | Thiếu Chủ Ma Giáo / Vương Tử Ngoại Bang | Dương Khang |
| Hiệp Nữ Lẫm Liệt | Thiếu Hiệp Chính Đạo | Quách Tĩnh, Trương Vô Kỵ |
| Ôn Nhu Tri Kỷ | Thư Sinh Si Tình | Đoàn Dự |
| Độc Phụ Tuyệt Tình | Lãng Tử Hắc Hóa | Lâm Bình Chi |

## G15 - Nội công Nhập môn và Khinh công của mỗi môn phái [ĐÃ CHỐT]

HS02 I nhiều phái chỉ liệt kê ngoại công ở bậc Nhập môn, nhưng mỗi đệ tử cần 1 Tâm pháp chủ đạo và 1 Khinh công.
Đề xuất: phái nào HS02 không ghi thì thêm môn phóng tác "`<Tên phái>` Tâm Pháp" (Nhập môn, nội công) và "`<Tên phái>` Thân Pháp" (Nhập môn, khinh công), `nguon_ten: "phong_tac"`; môn có sẵn trong HS02 (*Kim Nhạn Công*, *Thê Vân Tung*...) thì dùng môn đó.

## G16 - Hệ Nội lực của môn không được nhắc [ĐÃ CHỐT]

HS02 II.2 chỉ liệt kê một số môn.
Đề xuất mặc định theo phái: Thiếu Lâm, Cái Bang, Hoa Sơn, Huyết Đao: Chí Dương; Võ Đang, Toàn Chân, Tiêu Dao: Trung Hòa; Nga Mi, Cổ Mộ, Nhật Nguyệt, Tinh Túc, Ngũ Độc: Chí Âm; Minh Giáo: Chí Dương; phái còn lại: Trung Hòa.

## G17 - Cấp võ học của sư phụ theo bậc [ĐÃ CHỐT]

Dùng `SU_PHU_THEO_BAC` của `mo_phong.py`: Bậc 1 → 6, Bậc 2 → 8, Bậc 3 - 5 → 10; và `TIER_THEO_BAC`: Bậc 1 Nhập môn, Bậc 2 Thượng thừa, Bậc 3+ Trấn phái (truyền miễn phí khi lên bậc).

## G18 - Hằng số chiến đấu còn là giả định trong `mo_phong.py` [ĐÃ CHỐT]

Copy nguyên giá trị khối "Còn là giả định" của `mo_phong.py`: `BAO_KICH_CO_BAN = 0.10`, `TIEU_HAO_MP_HIEP2 = 0.30`, `SONG_TU = 0.5` (chỉ dùng cho bot), cùng cách `quyet_dau` dùng chúng.
Khi `mo_phong.py` đổi, đổi theo.

## G19 - Tàng Kinh Các môn phái [ĐÃ CHỐT]

HS01 II.6 nói đổi bí kíp bằng Cống hiến nhưng không có giá.
Đề xuất: võ học theo bậc vẫn được truyền miễn phí khi lên bậc (G17, khớp cân bằng); Tàng Kinh Các bán thêm các môn **khác** của phái cùng tier hoặc thấp hơn bậc hiện tại: Nhập môn 50, Thượng thừa 150, Trấn phái 400 Cống hiến.
Tiêu Cống hiến làm chậm thăng cấp: đó là đánh đổi có chủ đích.

## G20 - Lịch thế giới và năm Can Chi [ĐÃ CHỐT]

Đề xuất: `nam_the_gioi` khởi đầu `nguyen(1100, 1199)`; Can Chi tính theo chu kỳ 60 (năm $\equiv 4 \pmod{60}$ là Giáp Tý).
Văn bia ghi "Sinh năm {can_chi}".

## G21 - Sức mạnh võ học tự sáng tạo [ĐÃ CHỐT] (REVIEW mục 8)

Đề xuất: tier Trấn phái (Tier factor 3, Điểm Tier 30); Uy lực $= $ Uy lực cao nhất trong các môn nguồn $\times 1{,}05$, trần 320; hệ theo Tâm pháp chủ đạo; nếu ≥ 2 môn nguồn là SSS thì Điểm Tier 45.
Môn tự sáng tạo **không** được làm môn nguồn cho lần sáng tạo sau (chặn cộng dồn qua nhiều đời).

## G22 - Kinh Mạch Nghịch Hành: người chơi còn điều khiển gì [ĐÃ CHỐT] (REVIEW mục 8)

Đề xuất: vẫn chọn sự kiện và Tam Hiệp; hành động AP chỉ còn *Luyện công* và *Hành tẩu giang hồ*; khóa mua bán, sản nghiệp, quản lý môn phái / gia trang; mỗi năm 30% tự gây sự với một Chưởng môn hoặc người trong Top 10 (Tam Hiệp sinh tử); "+150% sức chiến đấu" là sát thương $\times 2{,}5$.

## G23 - Thần công: nguồn và cách quy cấp [ĐÃ CHỐT] (REVIEW mục 8)

Đề xuất:

- Kỳ Thư Xuất Thế: `[Ngẫu nhiên: 50%]` bảo vật là Cửu Âm Chân Kinh (đủ 2 quyển), 50% là Đồ Long Đao (kèm Vũ Mục Di Thư).
- Long Tượng Bàn Nhược Công: tầng 1 - 10 là cấp 1 - 10 (bỏ tầng 11 - 13); Tier factor tăng theo cấp sao cho Ngộ tính 60 tự học lên tầng 10 mất khoảng 90 AP (≈ 30 năm, HS02 III.1). Hệ số chốt: Tier factor từ Cấp $k$ lên $k + 1$ là $5 	imes 1{,}09^{k-1}$ (HS02 III.1).
- Âm Dương Hỗ Tế: kỳ ngộ cấp S, điều kiện có 1 nội công Chí Dương và 1 Chí Âm cùng cấp $\ge 5$; sau khi có thì $P_{THNM}$ song tu bằng 0. "Nhân đôi sát thương và phòng thủ" phải chạy qua `mo_phong.ts` trước khi bật; nếu Chiến lực vượt khung thì ghi `REVIEW.md`, đề xuất giảm.

## G24 - Một kết cục chính và danh hiệu phụ [ĐÃ CHỐT] (REVIEW mục 8)

Đề xuất: Văn bia trao 1 kết cục chính (cao nhất theo thứ tự HS07 IV, tính điểm); các kết cục khác cũng đạt thành "danh hiệu phụ" ghi dưới Văn bia và mở trong thư viện, không cộng điểm.
Sửa luôn: #14 "qua đời ở tuổi 70 trở lên, mất tự nhiên"; #18 tính cả Tuổi 0.

## G25 - Tên nguyên tác hay phóng tác, rating [ĐÃ CHỐT] (REVIEW mục 6)

Đã chốt: dùng tên nguyên tác Kim Dung (chủ dự án quyết); rating 17+. Vẫn dùng tên nguyên tác trong dữ liệu, mọi văn bản đi qua `tenHienThi` (01 mục 7.6) để đổi được bằng dữ liệu; viết nội dung theo đề xuất rating 17+ của REVIEW mục 6 (bạo lực giữ, cảnh thân mật mô tả gián tiếp, nhân vật dưới 16 tuổi chỉ mô tả hệ quả).

## G26 - Số liệu tương tác NPC [ĐÃ CHỐT]

Đề xuất:

- *Trò chuyện*: `[Roll: Mị lực vs 50]`, thành công Hảo cảm $+6$, thất bại $+1$ và NPC hiểu lầm một câu (dòng Biên Niên Sử).
- *Tặng quà*: Hảo cảm $+ \min(15, \lfloor \text{giá} / 20 \rfloor)$; Băng Thanh Ngọc Khiết không nhận quà bằng tiền.
- NPC Huyết Hải Thâm Thù: mỗi NPC 15% / năm tìm đến, tối đa 1 lần / năm cho toàn bộ cừu thù.
- Truy sát sau ám sát bại lộ: 50% / năm gặp sát thủ hoặc bộ khoái (Tam Hiệp sinh tử) trong 3 năm.
- Phản môn: Hảo cảm của mọi đồng môn cũ $-30$.
- *Thách đấu* từ Tab 5: 1 AP.
- *Uống rượu luận võ* với huynh đệ kết nghĩa: 1 lần Tiến độ ở môn của huynh đệ với cấp sư phụ = cấp của huynh đệ.
- Con của kẻ bị giết: $P_{KyNgo} \times 2$ khi mô phỏng NPC.

## G27 - Chi tiết Đại sự kiện và tôn chỉ môn phái [ĐÃ CHỐT] (REVIEW mục 8)

Đề xuất:

- Mỗi hồi người chơi được 0 - 3 điểm đóng góp tùy lựa chọn; tổng 3 hồi $\ge 6$ là lập công lớn (Cống hiến $+200$ theo HS04 I.1, Danh vọng $+50$ đến $+100$, phần thưởng riêng của sự kiện), $3 - 5$ lập công nhỏ (một nửa), $\le 2$ không có.
- Võ Lâm Minh Chủ (Ma Giáo Đông Chinh): Chính đạo thắng **và** người chơi ở phe Chính **và** đóng góp $\ge 6$ **và** Danh vọng $\ge 600$.
- Phe thắng: so tổng Chiến lực Top 10 của mỗi phe, cộng $+40$ Chiến lực cho phe người chơi nếu đóng góp $\ge 6$, đưa vào công thức logistic HS06 I.5.
- NPC tham chiến: 5% tử trận mỗi người mỗi Đại sự kiện.
- Đổi tôn chỉ Chính ↔ Tà: Thanh danh người chơi $-200$ (sang Tà) hoặc $+100$ (sang Chính), 30% NPC đệ tử bỏ phái.
- Tuyển Trưởng lão cho phái tự lập: 500 lạng / người từ Ngân khố.

## G28 - Thể thức Hoa Sơn và danh hiệu Ngũ Tuyệt [ĐÃ CHỐT]

Đề xuất:

- Thể thức theo hàm `hoa_son` của `mo_phong.py`; khi người chơi dự: 3 trận Tam Hiệp liên tiếp với 3 người được mời khác, mạnh dần theo Chiến lực; giữa các trận hồi 30% HP và Nội tức.
- Danh hiệu Ngũ Tuyệt theo vùng người thắng đang ở: Giang Nam → Đông Tà, Tây Vực → Tây Độc, Nam Cương → Nam Đế, Bắc Cảnh → Bắc Cái, Trung Nguyên → Trung Thần Thông (M1, M2 chỉ có Trung Nguyên nên là Trung Thần Thông).
- "Đặc quyền ngoại giao": Cổng Thanh danh của mọi môn phái coi như đạt; Hảo cảm khởi điểm với NPC mới $+20$; giá chợ $-20\%$.

## G29 - Cơ chế đấu giá Hắc Thị [ĐÃ CHỐT]

Đề xuất: như M2-13 (giá chốt $= $ sàn $\times U(1; 1{,}5)$ theo `mo_phong.py`); có NPC Chướng Mắt với người chơi tham dự thì giá chốt $\times 1{,}2$; giá đan dược ngàn năm và tàn quyển lấy theo giá đan dược HS06 III và tier võ học (Thượng thừa 1.500, Trấn phái 4.000).

## G30 - Chế đan và chế độc [ĐÃ CHỐT]

HS01 II.5 nói Y thuật / Độc thuật "chế đan dược", "chế độc" nhưng không có luật.
Đề xuất: hành động *Luyện đan* / *Chế độc* 1 AP, nguyên liệu 50% giá bán, `[Roll: Y thuật vs N]` (hoặc Độc thuật) với N theo món: Kim Sáng Dược 20, Bạch Vân Hùng Đảm Hoàn 50, Tiểu Hoàn Đan 70, Cửu Hoa Ngọc Lộ Hoàn 90; thất bại mất nguyên liệu và 10% bị phản độc (HP $-20\%$).
Đan dược "không bán ở chợ" (Đại Hoàn Đan) không chế được.

## G31 - Danh hiệu ở Header [ĐÃ CHỐT]

HS07 I.1 có "Danh hiệu hiện tại" nhưng không nói nguồn.
Đề xuất thứ tự ưu tiên: danh hiệu Ngũ Tuyệt → Võ Lâm Minh Chủ → chức vị (Chưởng môn / Giáo chủ / Trưởng lão) → mức Thanh danh (Chính Nhân Quân Tử / Đại Ma Đầu) ghép mức Danh vọng (Danh hiệp $\ge 400$, Đại hiệp $\ge 700$) → "Vô danh tiểu tốt".

## G32 - Hành động tuổi già [ĐÃ CHỐT]

HS01 IV nhắc *Bế quan*, *Truyền công*, *Dưỡng già* cho 71+ nhưng không có hiệu ứng.
Đề xuất: *Bế quan* 1 AP = 1 lần luyện nội công với Tiến độ $\times 1{,}5$, tính là 1 năm ẩn cư (Danh vọng $-5$); *Dưỡng già* 1 AP: HP đầy và 10% giảm 5 Ám thương; *Truyền công* (M3-08) 1 AP: chuyển 10% Nội tức tối đa của mình cho con / đệ tử (người nhận được cộng vào `noi_tuc_cong_them`), người truyền mất phần đó.

## G33 - Thời Đại Hoàng Kim [ĐÃ CHỐT]

Đề xuất: Ngũ Tuyệt đời đầu là 5 NPC Thần công SSS cấp 10, Cảnh giới 10, Căn cốt 90, tuổi 45 - 55, mỗi người một vùng; 3 Boss thần thoại Chiến lực khoảng 500 (*Độc Cô Cầu Bại*, *Tảo Địa Tăng*, *Thiên Sơn Đồng Mỗ*), không tham gia Hoa Sơn, chỉ gặp qua sự kiện; cộng 30% chỉ số áp lên mọi NPC kể cả hai nhóm này.

---

## Điểm "Còn mở" sẵn có trong REVIEW cần đo lại khi implement

- Lãng khách tụt khỏi Thập Đại Cao Thủ (4%) sau vòng 17: đo lại ở M2-18, ghi số vào `bao_cao_m2.md`.
- Kết cục #10 Ngụy Quân Tử chưa mô phỏng: M2-18 thêm lối chơi mẫu "Ngụy Quân Tử" (Chính phái làm [Ám] có kiểm soát), đo tỷ lệ đạt.
