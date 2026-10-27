# Báo cáo mô phỏng cân bằng (2026-10-26)

Script: [mo_phong.py](mo_phong.py).
Số liệu thô: [KET_QUA.md](KET_QUA.md) (tự sinh, chạy lại bằng `python mo_phong.py > KET_QUA.md`).
Mỗi bảng Tam Hiệp chạy 4.000 trận, mỗi lối chơi chạy 2.000 đời, seed cố định.

## 0. Phạm vi và giả định

Script dùng đúng công thức HS06 (HP, MP, Tiến độ, Tuổi thọ, Võ Lực, xác suất mềm, sát thương, khắc chế), ma trận Hiệp 1 và AI NPC ở HS02, bậc môn phái ở HS04, bảng thu nhập và Nợ ở HS06 Phần II.
GDD còn thiếu nhiều số, script phải tự đặt và ghi trong khối `GIẢ ĐỊNH` ở đầu file:

* Uy lực chiêu thức theo tier: 60 / 120 / 200 / 320.
* Giảm trừ phòng ngự = 3% × Cảnh giới Nội công (tối đa 60%).
* Sát thương dao động ±10% (công thức HS06 không có yếu tố ngẫu nhiên, nên hai bên ngang sức luôn hòa tuyệt đối).
* Án Binh / Thân Pháp gây 60% sát thương ở Hiệp 1 khi không bị khắc.
* Tuyệt kỹ Hiệp 2 tiêu 30% MP tối đa; bạo kích nền 10%.
* 1 AP nhiệm vụ sư môn = 25 Cống hiến.
* Kỳ ngộ cho bí kíp theo cấp: B 50% (không có), A 30% (Thượng thừa), S 15% (Trấn phái), SSS 5%.
* Chính sách AP của 3 lối chơi mẫu: chính / tà phái mỗi năm 1 AP sư môn, 1 AP kiếm tiền, còn lại luyện công; lãng khách 1 AP luyện công, còn lại kiếm tiền cho đến khi Khai Tông.

Các kết luận phụ thuộc giả định được đánh dấu **(phụ thuộc giả định)**.

## 1. Phát hiện chính

### 1.1. 🔴 Khắc chế Nội lực quyết định gần như toàn bộ trận đấu

Hai bên ngang chỉ số, bên thuận hệ thắng **99%**.
Hệ số 1.25 / 0.80 tạo chênh lệch khoảng 56% sát thương, lớn hơn mọi yếu tố khác.
Kiểm tra độ nhạy: kết quả gần như không đổi dù tăng dao động sát thương lên ±25%.

| Hệ số khắc / bị khắc | Dương thắng Âm |
| :--- | ---: |
| 1.25 / 0.80 (hiện tại) | 99% |
| 1.10 / 0.91 | 79% |
| 1.05 / 0.95 | 68% |

**Đề xuất:** hạ về khoảng **1.05 / 0.95**, để khắc chế là lợi thế rõ (khoảng 2:1) chứ không phải án tử.

### 1.2. 🔴 Hiệp 1 quyết định kết quả trận

Khi ép cả hai bên chọn, bên thắng ma trận Hiệp 1 thắng trận **70% - 99%**:

| Người chơi \ NPC | Tiên Hạ Thủ | Án Binh | Thân Pháp |
| :--- | ---: | ---: | ---: |
| Tiên Hạ Thủ | 51% | 99% | 9% |
| Án Binh | 1% | 50% | 70% |
| Thân Pháp | 90% | 29% | 50% |

Hệ quả:

* **Án Binh là lựa chọn yếu nhất** trước mọi tính cách NPC (24% - 48%): thua Tiên Hạ Thủ quá nặng (mất Roll và nhận thêm 10% sát thương), còn phần thưởng khi thắng chỉ là +30% bạo kích có điều kiện.
* **Thân Pháp là lựa chọn tốt nhất** trước 4/5 tính cách. Đặc biệt NPC *Ngông cuồng* (60% Tiên Hạ Thủ) bị khai thác tới 68%.
* Hiệp 2 và Hiệp 3 gần như chỉ còn là thủ tục.

**Đề xuất:** giảm biên độ của ma trận (bên thua chỉ bị $M = 0.8$ thay vì $0.5$, bỏ +10% sát thương nhận vào), tăng thưởng cho Án Binh khi thắng (ví dụ được chọn lại hướng ở Hiệp 2 sau khi thấy lựa chọn của địch), và hạ trọng số Tiên Hạ Thủ của NPC Ngông cuồng xuống 45%.

### 1.3. 🟠 Độ dài trận không đều theo cấp độ (phụ thuộc giả định)

| Mức sức mạnh | Kết thúc do gục trước Hiệp 3 | Phải "Liều mạng" đánh thêm |
| :--- | ---: | ---: |
| Sơ nhập | 0% | 100% |
| Trung | 1% | 99% |
| Cao | 16% | 65% |
| Đỉnh | 53% | 53% |

Ở cấp thấp, sau Hiệp 2 gần như không bên nào dưới 25% HP, nên trận nào cũng rơi vào "Bất phân thắng bại".
Ở cấp đỉnh, một nửa số trận kết thúc bằng gục ngã trước Hiệp 3.
Nguyên nhân: HP tăng tuyến tính chậm (Căn cốt × 12), còn sát thương tăng nhanh theo tier và theo Nội tức (MP × 0.15 với MP tới hơn 2.000).
**Đề xuất:** khi định nghĩa bảng Uy lực, nhắm mục tiêu "sau Hiệp 2 bên yếu hơn còn khoảng 20% - 30% HP" ở mọi cấp, và cân nhắc hạ hệ số Nội tức trong công thức sát thương từ 0.15 xuống khoảng 0.08.

### 1.4. 🟠 Cảnh giới Nội công và tier quá mạnh so với các chỉ số khác (phụ thuộc giả định)

| Người chơi hơn NPC | Tỷ lệ thắng |
| :--- | ---: |
| +1 cấp võ học | 62% |
| +3 cấp võ học | 76% |
| +1 Cảnh giới Nội công | 71% |
| +3 Cảnh giới Nội công | 99% |
| +10 Căn cốt | 69% |
| +1 tier | 96% |

Một cấp Nội công đáng giá hơn một cấp võ học, vì nó tăng cả HP, MP (tức sát thương) và giảm trừ phòng ngự.
**Đề xuất:** bỏ Cảnh giới khỏi một trong ba chỗ (ví dụ giảm trừ phòng ngự nên lấy từ Căn cốt hoặc Khinh công).

### 1.5. 🔴 Không ai lên được Chưởng môn

Cả 3 lối chơi môn phái lên Trưởng lão ở khoảng 40-41 tuổi, nhưng **0%** đạt 1.500 Cống hiến trước 45 tuổi (giới hạn tranh ngôi trong HS04).
Với giả định 25 Cống hiến / AP và 1 AP sư môn mỗi năm, phải tới khoảng 70 tuổi mới đủ 1.500.
GDD chưa ghi tốc độ kiếm Cống hiến, nên đây là con số cần chốt.
**Đề xuất:** cho mỗi AP sư môn khoảng 50 - 60 Cống hiến và cộng thêm Cống hiến khi thắng thử thách thăng cấp / lập công trong Đại sự kiện, để Chưởng môn đến ở khoảng 35 - 42 tuổi.
Kéo theo: kết cục #4 (Giáo chủ) và quyền "Phát động chiến tranh" ở HS01 hiện gần như không thể chạm tới.

### 1.6. 🟠 Tiền chỉ tăng, không có chi phí thường xuyên

Tiền trung vị lúc 70 tuổi: Chính phái khoảng 20.000, Tà phái khoảng 32.000, Lãng khách khoảng 31.000.
Đường cong gần như tuyến tính, không có giai đoạn "khát tiền" sau 20 tuổi, và người chơi không có lý do tiêu tiền ngoài trị thương 20 lạng.
GDD không có **sinh hoạt phí hằng năm** nào.
**Đề xuất:** thêm sinh hoạt phí theo tầng lớp (ví dụ 10 / 50 / 200 lạng mỗi năm cho Bình dân / Nhân sĩ có tiếng / Đại hiệp), và biến Hắc Thị, Tàng Kinh Các, Hộ viện thành các khoản chi người chơi thực sự muốn mua.

### 1.7. 🟠 Kết cục #8 (50.000 lạng) gần như không đạt được

0% - 1% số đời chạm 50.000 lạng ở cả 4 lối chơi, kể cả lãng khách đã Khai Tông.
Hoặc hạ ngưỡng (khoảng 30.000), hoặc thêm nguồn thu chuyên biệt cho lối chơi thương nhân (sòng bạc, buôn muối, cổ phần tiêu cục).

### 1.8. 🟠 Tà phái kiếm tiền dễ hơn Chính phái

Ám sát thuê (tối đa 2 hợp đồng/năm) đóng góp khoảng 17.500 lạng cả đời, nhiều hơn trợ cấp và săn tiền thưởng cộng lại.
Tà phái không bao giờ rơi vào nợ, còn Chính phái và Lãng khách có 13% - 24% số đời mắc nợ ở tuổi 20 do đền tiêu.
Đây có thể là chủ ý ("ác thì giàu"), nhưng cái giá hiện tại nhẹ: thất bại chỉ bị truy sát 3 năm.
**Đề xuất:** giữ thu nhập, nhưng để mỗi hợp đồng ám sát cộng 1 hành động [Ám] vào tỷ lệ bại lộ hằng năm (HS01 II.3), để rủi ro tích lũy theo thời gian.

### 1.9. 🟡 Tuổi thọ không tạo áp lực

Không đời nào chết trước 70 tuổi.
Với Căn cốt khoảng 55 - 60 và Cảnh giới Nội công 10, tuổi thọ tối đa khoảng 94 - 96, vượt khung "65 - 90" ở HS05.
**Đề xuất:** đổi hệ số Cảnh giới trong công thức tuổi thọ từ ×2 xuống ×1, hoặc hạ hằng số 55 xuống 50.

### 1.10. 🟡 Lãng khách phụ thuộc kỳ ngộ, nhưng vẫn ổn

Lãng khách Khai Tông ở 95% số đời, tuổi trung vị 43, chủ yếu bị chặn bởi Danh vọng 500.
Võ học của lãng khách chậm hơn môn phái khoảng 10 năm, đúng tinh thần "đi lên từ bùn lầy".
Môn phái tự lập là nguồn thu lớn nhất của lãng khách sau 45 tuổi.

### 1.11. 🟡 Mốc tham chiếu trong HS06 bị lệch (đã sửa)

HS06 ghi một môn SSS lên 10/10 mất 43 AP và 84 AP.
Vì võ công bắt đầu ở cấp 1 (chỉ cần 9 lần lên cấp), số đúng là **39 AP** và **75 AP**.
Đã sửa trực tiếp trong HS06.
Kết cục #1 (2 môn SSS cấp 10) cần khoảng 78 - 150 AP chỉ riêng cho Ngoại công, tức 20 - 40 năm luyện công thuần túy; chỉ khả thi với lối chơi chuyên tu có Ngộ tính cao.

## 2. Ưu tiên sửa

1. Hạ hệ số khắc chế về khoảng 1.05 / 0.95 (1.1).
2. Giảm biên độ ma trận Hiệp 1 và tăng thưởng cho Án Binh (1.2).
3. Chốt tốc độ kiếm Cống hiến để Chưởng môn đạt được ở 35 - 42 tuổi (1.5).
4. Định nghĩa bảng Uy lực chiêu thức và Giảm trừ phòng ngự, rồi chạy lại script để kiểm tra độ dài trận (1.3, 1.4).
5. Thêm sinh hoạt phí và xem lại ngưỡng kết cục #8 (1.6, 1.7).

Sau mỗi thay đổi, sửa hằng số tương ứng trong script và chạy lại để so sánh.

## 3. Vòng cân bằng 2 (đã áp dụng 5 đề xuất ưu tiên)

Kết quả vòng 1 lưu ở [KET_QUA_truoc.md](KET_QUA_truoc.md), vòng 2 ở [KET_QUA.md](KET_QUA.md).

### 3.1. Thay đổi đã đưa vào hồ sơ

| Hạng mục | Cũ | Mới | Hồ sơ |
| :--- | :--- | :--- | :--- |
| Hệ số khắc chế Nội lực | 1.25 / 0.80 | 1.05 / 0.95 | HS02 V.2, HS06 I.4 |
| Tiên Hạ Thủ ở Hiệp 1 | $M = 1.20$ | $M = 1.10$ | HS02 V.1, HS06 I.4 |
| Tiên Hạ Thủ bị Thân Pháp khắc | Hiệp 1 $M = 0.50$, Hiệp 2 $M = 0.85$ | Hiệp 1 $M = 0.90$, Hiệp 2 không phạt | HS02 V.1, HS06 I.4 |
| Án Binh thua Tiên Hạ Thủ | Mất Roll + nhận thêm 10% sát thương | Chỉ mất Roll | HS02 V.1 |
| Thưởng Án Binh khi Roll thành công | +30% bạo kích | +30% bạo kích và đòn Hiệp 2 của địch $\times 0.95$ | HS02 V.1, HS06 I.4 |
| Sát thương Hiệp 1 của Án Binh / Thân Pháp | Không định nghĩa | $M = 1.00$ | HS02 V.1 |
| AI NPC Ngông cuồng | 60 / 25 / 15 | 45 / 30 / 25 | HS02 V.1 |
| Uy lực chiêu thức theo tier | Không định nghĩa | 210 / 250 / 280 / 320 | HS06 I.4 |
| Hệ số Nội tức trong sát thương | 0.15 | 0.08 | HS06 I.4 |
| Giảm trừ phòng ngự | Không định nghĩa | 0.3% × Căn cốt + 2% × Cấp Khinh công, tối đa 50% | HS06 I.4 |
| Biến thiên sát thương | Không có | ±10% mỗi đòn | HS06 I.4 |
| Cống hiến | Không định nghĩa | Sư môn 50/AP, thăng cấp +100, Đại sự kiện +200 | HS04 I.1 |
| Sinh hoạt phí | Không có | 10 / 50 / 150 / 300 lạng/năm theo Danh vọng | HS06 II.2 |
| Ngưỡng kết cục #8 | 50.000 lạng | 80.000 lạng | HS07 IV |

Bảng Uy lực được chọn bằng tìm kiếm nhị phân trong script, nhắm mục tiêu bên yếu còn 25% HP sau Hiệp 2 ở từng cấp, rồi làm tròn thành dãy tăng dần.
Mức cũ 50.000 lạng bị nâng lên vì sau khi có Cống hiến hợp lý, khoảng một nửa số người làm Chưởng môn đại phái chạm 50.000 lạng.

### 3.2. So sánh trước / sau

| Chỉ số | Vòng 1 | Vòng 2 |
| :--- | ---: | ---: |
| Bên thuận hệ thắng (ngang sức) | 99% | 77% |
| Bên thắng ma trận Hiệp 1 thắng trận (T>Q / Q>D / D>T) | 99% / 70% / 90% | 70% / 70% / 62% |
| Lựa chọn cố định tốt nhất trước AI NPC | 54% - 68% | 51% - 55% |
| HP bên yếu sau Hiệp 2 (Sơ nhập → Đỉnh) | 75% → 29% | 31% → 24% |
| Trận phải "Liều mạng" (Sơ nhập → Đỉnh) | 100% → 53% | 61% → 25% |
| +1 tier so với địch | 96% | 78% |
| +3 Cảnh giới Nội công | 99% | 91% |
| Lên Chưởng môn (Chính / Tà) | 0% / 0% | 48% / 57%, tuổi trung vị 35 - 36 |
| Tiền lúc 70 tuổi, trung vị (Chính / Tà / Lãng khách) | 20.359 / 32.191 / 31.175 | 30.698 / 68.558 / 24.380 |
| Chạm ngưỡng kết cục #8 (Chính / Tà / Lãng khách) | 0% / 0% / 0% (ngưỡng 50.000) | 0% / 2% / 0% (ngưỡng 80.000) |

Ghi chú: vòng 1 dùng giả định Uy lực 60 / 120 / 200 / 320, nên các dòng về độ dài trận và chênh lệch tier chỉ so sánh tương đối.

### 3.3. Vấn đề mới lộ ra ở vòng 2

* 🔴 **Khoảng 50% người tranh ngôi Chưởng môn bị phế võ công.** Script luôn chọn nhánh [A] (tỷ thí tại linh đường, HS04 II.3) với đối thủ ngang sức, nên đây là tung đồng xu, và thua là mất toàn bộ cấp võ học. Hậu quả quá nặng cho một sự kiện gần như bắt buộc. Đề xuất: thua thì bị trục xuất nhưng giữ võ công, chỉ phế võ công khi người chơi chọn [C] (đánh lén) và thất bại.
* 🟠 **Tà phái lúc 70 tuổi giàu gấp đôi Chính phái** (68.558 so với 30.698), vì có cả lợi tức Giáo chủ lẫn ám sát thuê. Đề xuất 1.8 ở vòng 1 (tính mỗi hợp đồng ám sát là 1 hành động [Ám] cho tỷ lệ bại lộ hằng năm) vẫn chưa áp dụng.
* 🟠 **Lợi tức Chưởng môn đại phái là nguồn thu áp đảo** (lãi ròng 1.500 lạng/năm suốt khoảng 35 năm). Cân nhắc tách ngân khố môn phái khỏi túi riêng của Chưởng môn.
* 🟡 **Tuổi thọ vẫn chưa tạo áp lực** (mục 1.9 chưa áp dụng).

## 4. Vòng cân bằng 3 (xử lý 3 vấn đề ở mục 3.3)

Kết quả vòng 2 lưu ở [KET_QUA_vong2.md](KET_QUA_vong2.md), vòng 3 ở [KET_QUA_vong3.md](KET_QUA_vong3.md).

### 4.1. Thay đổi đã đưa vào hồ sơ

| Hạng mục | Cũ | Mới | Hồ sơ |
| :--- | :--- | :--- | :--- |
| Thua tỷ thí kế vị Chưởng môn | Phế võ công (mọi cấp võ học về 1) và bị đuổi | Bị trục xuất, **giữ nguyên võ công**, Cống hiến về 0, Đại Sư Huynh thành Kẻ Thù Truyền Kiếp | HS04 II.3 |
| Ám sát thuê | Gắn nhãn [Ám] nhưng không nói rõ hệ quả về sau | Mỗi hợp đồng thành công là 1 hành động [Ám]: 20% lộ ngay, còn lại cộng vào tỷ lệ bại lộ hằng năm. Bại lộ lúc nào cũng bị Thanh danh -150 và truy sát 3 năm (không nhận hợp đồng mới) | HS06 II.1 |
| Lợi tức môn phái | Vào túi riêng Chưởng môn | Vào **Ngân khố môn phái**; Chưởng môn chỉ nhận bổng lộc 100 / 250 / 400 lạng/năm. Rút thêm là hành động [Ám] "Biển thủ công quỹ" | HS06 II.1, HS04 I.2, HS01 II.8 |
| Kết cục #8 | 80.000 lạng (vòng 2) | Trả về **50.000 lạng cá nhân**, không tính Ngân khố | HS07 IV |

Script cũng áp dụng đầy đủ cơ chế bại lộ hằng năm của HS01 II.3 cho mọi hành động [Ám] (cả móc túi), và kẹp Thanh danh trong khoảng -1000 đến +1000.

### 4.2. So sánh vòng 2 / vòng 3

| Chỉ số | Vòng 2 | Vòng 3 |
| :--- | ---: | ---: |
| Bị phế võ công khi tranh ngôi | 42% - 52% | 0% (42% - 50% bị trục xuất, giữ võ công) |
| Tiền lúc 70 tuổi, trung vị: Chính / Tà / Lãng khách / Chuyên tu | 30.698 / 68.558 / 24.380 / 46.056 | 17.100 / 29.875 / 13.847 / 12.581 |
| Tỷ lệ tiền Tà / Chính lúc 70 tuổi | 2,2 lần | 1,75 lần |
| Thu nhập ám sát thuê cả đời (Tà phái, trung bình) | 15.362 | 11.434 |
| Ngân khố môn phái lúc cuối đời (trung vị, người đang làm Chưởng môn) | (chưa tách) | 11.700 - 37.400 |
| Chạm 50.000 lạng cá nhân (kết cục #8) | 38% - 57% ở các lối chơi môn phái | 0% ở mọi lối chơi |

Phần Tam Hiệp không đổi so với vòng 2 (cùng seed, không sửa công thức chiến đấu).

### 4.3. Nhận xét

* ✅ Không còn người chơi nào bị mất sạch võ công chỉ vì thua một trận tung đồng xu.
* ✅ Khoảng cách giàu nghèo giữa Tà và Chính thu hẹp từ 2,2 lần xuống 1,75 lần. Phần chênh còn lại đến từ móc túi tuổi thơ, ám sát thuê, và sinh hoạt phí thấp hơn do Danh vọng thấp. Đây có thể giữ làm chủ ý ("ác thì giàu hơn, nhưng Thanh danh chạm đáy -1000").
* 🟠 **Tà phái bị lộ trung bình 19 lần mỗi đời**, chủ yếu do mỗi lần móc túi đều là 1 hành động [Ám]. Thanh danh trung vị chạm -1000 trước 70 tuổi. Nếu muốn lối chơi "ma đầu ẩn mình", cần gộp các việc vặt (móc túi) thành 1 hành động [Ám] mỗi năm thay vì mỗi lần.
* 🟠 **Kết cục #8 giờ không lối chơi võ học nào đạt được** (cao nhất khoảng 43.000 lạng). Đây là chủ ý của vòng này: kết cục dành cho lối chơi thương nhân, nhưng GDD **chưa có** nguồn thu thương nhân nào (sòng bạc, buôn muối, cổ phần tiêu cục, đầu cơ Hắc Thị). Cần thiết kế trước khi giữ kết cục này.
* 🟡 **Khai Tông Lập Phái không còn sinh lời cho cá nhân:** người sáng lập bỏ ra 5.000 lạng, chỉ nhận lại 100 - 400 lạng/năm bổng lộc. Lãng khách lúc 70 tuổi nghèo hơn vòng 2 khoảng 10.000 lạng. Động lực Khai Tông giờ là di sản (Ngân khố, kết cục #2) thay vì tiền, cần nói rõ trong UI.


## 5. Vòng cân bằng 4 (lối chơi Thương nhân cho kết cục #8)

Kết quả vòng 4 ở [KET_QUA_vong4.md](KET_QUA_vong4.md).

### 5.1. Thiết kế đã đưa vào hồ sơ

| Hạng mục | Nội dung | Hồ sơ |
| :--- | :--- | :--- |
| Nghề thứ 5 của Lãng khách | **Thương Nhân / Trang Chủ**, mở từ 16 tuổi | HS04 I.2 |
| Quy tắc sản nghiệp | Mỗi loại sản nghiệp cần 1 AP quản lý/năm, không thì không sinh lợi. Bán lại thu 80% vốn. Đang Nợ thì không mua thêm. | HS06 II.5 |
| Tiểu thương | 1 AP, 50 - 150 lạng, Roll Ngộ tính vs 50 | HS06 II.1, II.5 |
| Cổ phần tiêu cục | 1.000 lạng/phần, tối đa 10 phần, cổ tức 6%; 15% mất tiêu (Giao chiến nhanh 50), thua thì mất 10% số phần | HS06 II.5 |
| Buôn muối | Tối đa 10.000 lạng, lãi 8%; cần Diêm dẫn (Danh vọng 400 hoặc hối lộ 1.000 lạng [Ám]); Sơn Hà Phá Toái cắt đường muối 3 năm | HS06 II.5 |
| Sòng bạc | 4.000 lạng, 300 - 900 lạng/năm, Thanh danh -10/năm; 20% bị đòi bảo kê (Giao chiến nhanh 60) | HS06 II.5 |
| Đầu cơ Hắc Thị | Tích trữ năm trước mốc đại sự kiện, tối đa 10.000 lạng; đúng sự kiện thu ×3,0 (Sơn Hà) / ×2,5 (Huyết Án), sai thu 60% | HS06 II.5 |
| Tiền nhiều sinh họa | Tiền mặt ≥ 10.000: 10%/năm bị tống tiền (Giao chiến nhanh 60), thua mất 10% tiền mặt; Hộ viện 1.000 lạng/năm thì miễn | HS06 II.5 |
| Kết cục #8 | Đo bằng **Gia sản cá nhân** (tiền mặt + giá vốn sản nghiệp), vẫn 50.000 | HS07 IV, HS01 II.8 |

Script thêm lối chơi mẫu *Thương nhân*: gia cảnh Phú Thương (1.000 lạng, +50/năm đến 15 tuổi), Căn cốt 45, Ngộ tính 65, không vào môn phái.
Chính sách: không đầu tư khi nợ, giữ 300 lạng dự trữ, mua sòng bạc → muối (hối lộ lấy Diêm dẫn) → cổ phần tiêu cục, đầu cơ 50% tiền mặt vào năm trước mỗi mốc (đoán khác sự kiện vừa qua), thuê Hộ viện khi tiền mặt vượt 11.000.
Script cũng bốc lịch 4 đại sự kiện ngẫu nhiên cho mỗi đời theo HS01 (không lặp sự kiện ở mốc liền trước).

### 5.2. Tinh chỉnh lãi suất

Bản nháp đầu (cổ tức 10%, muối 15%, sòng 500 - 1.500) cho **98%** Thương nhân chạm 50.000, trung vị lúc 70 tuổi 86.800.
Các lần chỉnh (2.000 đời mỗi lần, 2 seed):

| Cổ tức / Muối / Sòng bạc | Chạm 50.000 | Gia sản 70 tuổi TV / P90 |
| :--- | ---: | ---: |
| 10% / 15% / 500 - 1.500 | 98% | 86.800 / 103.300 |
| 8% / 12% / 400 - 1.000 | 92% | 61.700 / 72.800 |
| 7% / 10% / 400 - 1.000 | 64% | 52.500 / 61.600 |
| **6% / 8% / 300 - 900 (chọn)** | **10 - 11%** | **43.000 / 50.000** |
| 5% / 8% / 200 - 800 | 0,5% | 38.900 / 44.400 |

### 5.3. Kết quả

| Chỉ số | Thương nhân |
| :--- | ---: |
| Gia sản trung vị 40 / 50 / 60 / 70 tuổi | 9.915 / 19.219 / 34.970 / 43.349 |
| Chạm 50.000 (kết cục #8) / còn giữ lúc cuối đời | 10% / 9% |
| Gia sản cao nhất (P99) | 61.463 |
| Võ học cao nhất lúc 70 tuổi (trung vị) | tier 3 cấp 6, Cảnh giới 7 (lối võ học: cấp 10, Cảnh giới 10) |
| Thanh danh lúc 70 tuổi (trung vị) | -170 (do sòng bạc) |
| Chi Hộ viện cả đời (trung bình) | 8.901 |

Các lối chơi cũ: chạm 50.000 vẫn 0%, P99 cao nhất 39.523 (Tà phái).
Số liệu khác khớp vòng 3 trong biên độ ngẫu nhiên (script bốc thêm lịch đại sự kiện nên luồng RNG đổi).
Riêng *Chính phái chuyên tu* có trung vị tiền 70 tuổi nhảy từ 12.581 xuống 1.970 vì phân bố hai đỉnh: 49% lên Chưởng môn (có bổng lộc), 51% bị trục xuất; P10 / P90 không đổi.

### 5.4. Nhận xét

* ✅ Kết cục #8 đạt được ở mức hiếm (khoảng 1 trên 10 đời Thương nhân) và chỉ qua lối chơi Thương nhân.
* ✅ Có đánh đổi thật: Thương nhân yếu võ hơn hẳn, thua phần lớn các `[Giao chiến nhanh]` nên phải nuôi Hộ viện.
* 🟠 **Ngưỡng rất nhạy:** giảm cổ tức 1 điểm % và lợi tức sòng bạc 100 lạng là tỷ lệ đạt rơi từ 10% về 0,5%; tăng cổ tức và muối mỗi thứ 1 - 2 điểm % là lên 64%. Gia sản Thương nhân dồn sát quanh trung vị (P90 chỉ hơn trung vị 16%). Khi chỉnh bất kỳ số nào ở HS06 II.5 cần chạy lại script.
* 🟠 **Đầu cơ Hắc Thị gần như hòa vốn** (lãi ròng trung bình +300 lạng cả đời) vì Thương nhân dồn hết tiền vào sản nghiệp, tiền mặt lúc tích trữ ít. Nếu muốn đầu cơ là nguồn "đổi đời" tạo đuôi phân bố dày hơn, cần cho phép vay Hắc Thị để đầu cơ, hoặc tăng hệ số trúng.
* 🟡 **Lối lai chưa mô phỏng:** người chơi môn phái vẫn được mua sản nghiệp. Script chưa có lối chơi lai (ví dụ Chưởng môn dùng AP dư đầu tư), nên 0% ở các lối võ học là cận dưới.

## 6. Vòng cân bằng 5 (đề xuất 1.9: tuổi thọ trong khung 65 - 90)

Kết quả vòng 5 ở [KET_QUA_vong5.md](KET_QUA_vong5.md).

### 6.1. Thay đổi

| Hạng mục | Cũ | Mới | Hồ sơ |
| :--- | :--- | :--- | :--- |
| Công thức tuổi thọ | $55 + \lfloor CC_{đỉnh} \times 0.35\rfloor + NC \times 2 - Ám$ (khung thực tế 55 - 110) | $65 + \lfloor\min(CC_{đỉnh}, 100) \times 0.15\rfloor + NC - Ám$ (khung 65 - 90, chỉ đan dược / kỳ ngộ vượt được) | HS06 I.1 |
| Lãi buôn muối | 8% | 7% (tinh chỉnh lại kết cục #8, xem 6.3) | HS06 II.5 |
| Kết cục *Bình phàm* | Qua đời ở tuổi 75 | Qua đời ở tuổi 70 trở lên (công thức mới cho người võ học ≤ cấp 3 khoảng 70 - 78 tuổi) | HS07 IV |
| Script | Dừng ở 70 tuổi | Chạy tới lúc chết thật (tối đa 120), báo cáo thêm mốc 80, 90 và phân bố Age_max | `mo_phong.py` |

Self-check thêm 2 assert: Căn cốt đỉnh 55 không Nội công → 73; Căn cốt 150, Cảnh giới 10 → đúng trần 90.

### 6.2. Tuổi mất (2.000 đời mỗi lối chơi)

Cột "cũ" là công thức cũ chạy tới lúc chết thật (vòng 1 - 4 cắt ở 70 tuổi nên không thấy).

| Lối chơi | Cũ: trung vị / P10 - P90 | Mới: trung vị / P10 - P90 | Sống tới 80 (mới) |
| :--- | ---: | ---: | ---: |
| Chính phái | 96 / 91 - 96 | 84 / 80 - 84 | 88% |
| Tà phái | 90 / 84 - 90 | 81 / 78 - 81 | 80% |
| Lãng khách | 99 / 93 - 99 | 85 / 81 - 85 | 94% |
| Chính phái chuyên tu | 95 / 95 - 95 | 83 / 83 - 83 | 100% |
| Thương nhân | 90 / 84 - 96 | 81 / 78 - 84 | 56% |

### 6.3. Hệ quả với kết cục #8

* **Vòng 4 chỉ đạt 10% vì script cắt ở 70 tuổi.** Chạy công thức tuổi thọ cũ tới lúc chết thật, Thương nhân chạm 50.000 ở **44%** số đời và Tà phái ở 3,6%, vì có thêm 20 - 25 năm thu lợi tức.
* Với tuổi thọ mới, giữ lãi suất vòng 4 cho 26%. Hạ lãi muối từ 8% xuống 7% đưa về **13%** (12 - 13% qua 2 seed). Các phương án khác đã thử: cổ tức 5% cho 8%, sòng bạc 200 - 800 cho 13 - 14%, cổ tức 5% + muối 7% cho 2 - 3%.
* Lối chơi võ học vẫn 0%; cao nhất (P99) là Tà phái 46.763, sát ngưỡng.

### 6.4. Nhận xét

* ✅ Tuổi thọ nằm gọn trong khung 65 - 90 ở HS05, và giờ mới thực sự là một nguồn lực: Thương nhân Căn cốt 45 chỉ có 56% sống tới 80, Lãng khách Căn cốt cao có 94%.
* ✅ Căn cốt và Nội công vẫn có giá trị cho tuổi thọ (chênh khoảng 6 năm giữa các lối chơi), nhưng không còn đẩy ai lên trăm tuổi.
* 🟠 **Tà phái P99 gia sản 46.763**, chỉ cách ngưỡng #8 khoảng 3.000. Nếu sau này thêm thu nhập cho Tà phái, kết cục #8 sẽ mở cho lối chơi võ học. Cần chạy lại script sau mỗi thay đổi kinh tế.
* 🟡 **Ám thương gần như không xảy ra trong mô phỏng** (chỉ khi bị thương mà không có 20 lạng chữa), nên P10 và P90 tuổi mất sát nhau. Trong game thật, Tẩu hỏa nhập ma và trọng thương sự kiện sẽ kéo phân bố rộng hơn; script chưa mô hình các sự kiện đó.
* 🟡 Ở mốc 80 tuổi, Thương nhân trung vị có võ học cấp 10 / Cảnh giới 10: đây là thiên lệch sống sót (người Nội công cao sống lâu hơn), không phải Thương nhân tự dưng luyện nhanh.

## 7. Vòng cân bằng 6 (Trọng thương, tử trận, Tẩu hỏa nhập ma)

Kết quả vòng 6 ở [KET_QUA_vong6.md](KET_QUA_vong6.md).

### 7.1. Cơ chế thêm vào script

| Cơ chế | Cách mô phỏng | Nguồn |
| :--- | :--- | :--- |
| Trận sinh tử | Săn tiền thưởng và ám sát thuê. Tỷ thí trong môn phái (thăng cấp, kế vị) không chết người. | HS02 V.3 |
| Tuyệt sát | Khi người chơi thua bị áp đảo, NPC Tuyệt sát theo bản mệnh: Tà ác 60%, Ngông cuồng 30%, Ngụy quân tử 30%, Si tình 10%, Chính trực 0% (giả định, đã ghi vào HS02 V.3) | HS02 V.3 |
| Thoát chết | Người chơi chọn lối có xác suất cao hơn: Khinh công bỏ chạy `[Roll: Võ Lực vs Võ Lực địch]` hoặc nhảy vực theo Phúc duyên (≥ 60: 95% và kỳ ngộ năm sau +50%; 30 - 59: Roll vs 45, sống thì Ám thương +5; < 30: chết) | HS06 I.3, HS02 V.4 |
| Trọng thương | Thua mà sống sót. Có ≥ 350 lạng thì mua Bạch Vân Hùng Đảm Hoàn, không thì dưỡng thương `[Roll: Căn cốt vs 50]`, thất bại Ám thương +5 | HS06 I.1, III |
| Tẩu hỏa nhập ma | Kỳ ngộ cho nội công hệ ngẫu nhiên; nếu khác cực Âm / Dương với nội công chính thì 50% người chơi song tu (giả định). Song tu: 30%/năm (+5% Tà công) Tẩu hỏa, Ám thương +5, Căn cốt -5, rồi tán công 1 môn. Trung Hòa miễn nhiễm. | HS06 I.4, HS02 |
| Bế quan sáng tạo võ học (55+) | Không mô phỏng: cần Ngộ tính ≥ 85, không lối chơi mẫu nào đạt | HS04 III.2 |

### 7.2. Phát hiện: săn tiền thưởng mỗi năm là án tử

Bản đầu dùng đối thủ ngang sức như các vòng trước: Chính phái chết trung vị **46 tuổi**, 82% số đời chết vì giao đấu.
Mỗi đời Chính phái đánh khoảng 55 trận sinh tử, mỗi trận thua khoảng 7% thành tử trận, rủi ro cộng dồn qua 50 năm.
GDD không có cách nào để người chơi chọn mức rủi ro, nên đã bổ sung **bảng truy nã 3 hạng** vào HS06 II.1 (Yếu 150 - 400, Ngang 250 - 800, Mạnh 600 - 1.500 lạng).
Nhưng chỉ chọn hạng Yếu vẫn chưa đủ (Chính phái vẫn 69% tử trận); cái quyết định là **người chơi có biết dừng không**:

| Chính sách săn truy nã (hạng Yếu) | Chính / Tà / Lãng khách / Thương nhân: % chết vì giao đấu | Kết cục #8 Thương nhân |
| :--- | :--- | ---: |
| Mỗi năm suốt đời | 69% / 21% / 38% / 27% | 5% |
| Chỉ đến 50 tuổi | 19% / 14% / 6% / 12% | 8% |
| **Chỉ khi gia sản < 5.000 (chọn)** | **25% / 12% / 10% / 4%** | **8%** |

Người chơi mẫu giờ chỉ liều mạng khi cần tiền.
Ám sát thuê của Tà phái không đổi (tối đa 2 hợp đồng/năm, đối thủ ngang sức).

### 7.3. Tuổi mất

| Lối chơi | Vòng 5: trung vị / P10 - P90 | Vòng 6: trung vị / P10 - P90 | Chết vì giao đấu | Tẩu hỏa (số đời) |
| :--- | ---: | ---: | ---: | ---: |
| Chính phái | 84 / 80 - 84 | 84 / 52 - 84 | 25% | 0% (Trung Hòa) |
| Tà phái | 81 / 78 - 81 | 79 / 68 - 81 | 12% | 10% |
| Lãng khách | 85 / 81 - 85 | 83 / 68 - 85 | 11% | 22% |
| Chính phái chuyên tu | 83 / 83 - 83 | 83 / 83 - 83 | 0% | 0% |
| Thương nhân | 81 / 78 - 84 | 79 / 72 - 84 | 5% | 22% |

Kết cục #8 của Thương nhân giảm từ 13% xuống **8%** (có người chết sớm, có người mất tiền mua thuốc), vẫn ở mức hiếm nên không chỉnh lại lãi suất.
Các lối chơi võ học vẫn 0% (P99 cao nhất 38.969, Tà phái).

### 7.4. Nhận xét

* ✅ Phân bố tuổi mất đã rộng: P10 giờ là 52 - 72 tuổi thay vì sát trung vị. Cái chết sớm đến từ lựa chọn của người chơi (liều mạng vì tiền, song tu Âm Dương), đúng tinh thần "giang hồ hiểm ác".
* ✅ Thuốc trị nội thương 350 lạng tạo một khoản chi thật: Tà phái tiêu trung bình khoảng 2.500 lạng cả đời cho thuốc.
* 🟠 **Chính phái rủi ro nhất** (25% chết vì giao đấu, P10 tuổi mất 52), vì được môn phái truyền võ Thượng thừa nên đi săn truy nã từ 18 tuổi khi cấp võ học còn thấp. Cân nhắc: Chính phái có nhiệm vụ sư môn thay thế săn truy nã, hoặc trợ cấp Nội môn / Chân truyền cao hơn để bớt khát tiền.
* 🟠 **Nhảy vực gần như là bảo hiểm sinh mạng cho người Phúc duyên ≥ 60** (95% sống, lại còn +50% kỳ ngộ). HS06 cũ ghi "Chắc chắn sống sót", trái với Quy tắc Cứu Mạng; đã sửa thành trần 95%. Nếu vẫn thấy quá mạnh, nên thêm Ám thương +5 cho cả nhánh này.
* 🟡 **Chính phái chuyên tu không bao giờ chết sớm** vì không đánh trận sinh tử nào. Trong game thật, sự kiện cừu gia và Đại sự kiện sẽ ép họ vào trận; script chưa mô hình các sự kiện cốt truyện đó.
* 🟡 Tẩu hỏa nhập ma hiếm khi giết người (≤ 1% số đời), chủ yếu bào mòn 5 năm tuổi thọ, vì người chơi tán công ngay sau lần đầu. Nếu muốn Âm Dương song tu thành canh bạc thật, cần cho song tu một lợi ích trong chiến đấu để người chơi chịu giữ lâu.

## 8. Vòng cân bằng 7 (giảm rủi ro tử trận của Chính phái)

Kết quả vòng 7 ở [KET_QUA_vong7.md](KET_QUA_vong7.md).

### 8.1. Chẩn đoán

Phân loại các ca tử trận của Chính phái ở vòng 6 theo trạng thái lúc chết (1.500 đời):

| Trạng thái lúc chết | Số ca |
| :--- | ---: |
| Đang là Nội môn / Chân truyền / Trưởng lão (Bậc 2 - 4) | 83 |
| Đang là Chưởng môn | 12 |
| **Đã bị trục xuất** sau khi thua tranh ngôi | **279** |

Khoảng 75% ca tử trận xảy ra **sau** khi bị trục xuất (khoảng 50% số đời Chính phái).
Người bị đuổi khỏi núi mất trợ cấp, túi còn ít, nên phải đi săn truy nã sinh tử để sống.
Vì vậy "giảm rủi ro từ 18 tuổi" phải đi kèm giữ được tiền tích lũy lúc bị trục xuất.

### 8.2. Các phương án đã thử (1.500 đời, cùng seed)

| Phương án | Chính phái chết vì giao đấu | P10 tuổi mất | Tiền 70 tuổi (TV) |
| :--- | ---: | ---: | ---: |
| Vòng 6 (Bậc 2 - 4 đi săn truy nã) | 25% | 52 | 16.174 |
| Tăng trợ cấp Nội môn / Chân truyền lên 80 / 150 | 13% | 65 | 16.485 |
| Sai phái sư môn, thất bại thì Trọng thương | 30% | 45 | 16.004 |
| **Sai phái sư môn, thất bại chỉ mất thù lao (chọn)** | **12%** | **68** | **17.612** |
| Sai phái thù lao ×1,5 | 5% | 80 | 16.444 |
| Sai phái ×1,5 + trợ cấp 80 / 150 | 2% | 82 | 18.661 |

* Sai phái mà thất bại bị Trọng thương thì **tệ hơn** không có gì: thua `[Giao chiến nhanh]` khá thường xuyên lúc Võ Lực còn thấp, mỗi lần mất 350 lạng tiền thuốc, nên lúc bị trục xuất túi còn ít hơn.
* Tăng trợ cấp cũng hiệu quả, nhưng là tiền cho không (0 AP), làm yếu áp lực kinh tế đầu đời mà HS06 muốn giữ ("Khát tiền ở đầu đời").
* Thù lao ×1,5 trở lên gần như xóa rủi ro, phân bố tuổi mất lại co về sát trung vị.

### 8.3. Thay đổi đã đưa vào hồ sơ

| Hạng mục | Nội dung | Hồ sơ |
| :--- | :--- | :--- |
| Sai Phái Sư Môn | Bậc 2 - 4, 1 AP. Thù lao Nội môn 50 - 150, Chân truyền 100 - 250, Trưởng lão 150 - 350 lạng. `[Giao chiến nhanh: 30 / 40 / 50]`, thất bại chỉ mất thù lao, không trận sinh tử. Không cộng Danh vọng. | HS04 I.1, HS06 II.1 |
| Người chơi mẫu | Đệ tử Bậc 2 - 4 nhận Sai phái thay cho săn truy nã. Chưởng môn và người bị trục xuất vẫn săn truy nã khi gia sản < 5.000. | `mo_phong.py` |

### 8.4. Kết quả (2.000 đời, seed chính)

| Chỉ số | Vòng 6 | Vòng 7 |
| :--- | ---: | ---: |
| Chính phái chết vì giao đấu | 25% | 13% |
| Chính phái tuổi mất P10 / trung vị | 52 / 84 | 64 / 84 |
| Chính phái sống tới 70 / 80 | 76% / 66% | 88% / 79% |
| Chính phái tiền lúc 70 tuổi (TV) | 15.969 | 16.391 |
| Chính phái Danh vọng lúc 70 tuổi (TV) | 600 | **330** |
| Tà phái chết vì giao đấu | 12% | 12% |
| Thương nhân kết cục #8 | 8% | 9% |

Lãng khách, Chính phái chuyên tu không đổi (không vào môn phái hoặc không kiếm tiền).

### 8.5. Nhận xét

* ✅ Chính phái giờ ngang Tà phái về rủi ro tử trận (khoảng 12 - 13%), và phần lớn rủi ro còn lại đến từ một biến cố có ý nghĩa: thua tranh ngôi bị đuổi khỏi núi.
* ✅ Đệ tử có lựa chọn thật: Sai phái an toàn nhưng ít tiền, săn truy nã nhiều tiền và Danh vọng nhưng có thể chết.
* 🟠 **Danh vọng Chính phái lúc 70 tuổi giảm gần một nửa** (600 → 330), vì Danh vọng trước đây chủ yếu đến từ thắng truy nã (+20/trận). Danh vọng là điều kiện của quy mô môn phái (Vừa ≥ 600, Lớn ≥ 850), Khai Tông (≥ 500) và Diêm dẫn (≥ 400). Cân nhắc cho Sai phái thành công +5 Danh vọng, hoặc cho chức Trưởng lão / Chưởng môn một lượng Danh vọng hằng năm.
* 🟡 Người bị trục xuất vẫn là nhóm rủi ro nhất. Nếu muốn giảm thêm, có thể cho người bị trục xuất mang theo một phần Cống hiến quy ra bạc (ví dụ 1 Cống hiến = 1 lạng).

## 9. Vòng cân bằng 8 (bù Danh vọng cho Chính phái)

Kết quả vòng 8 ở [KET_QUA_vong8.md](KET_QUA_vong8.md).

### 9.1. Phát hiện: Danh vọng cá nhân cao kéo người bị trục xuất vào chỗ chết

Danh vọng quyết định sinh hoạt phí (HS06 II.2: ≥ 400 trả 150 lạng/năm, ≥ 700 trả 300 lạng/năm).
Mọi cách cộng Danh vọng **tích lũy** đều làm người bị trục xuất mang theo Danh vọng cao, phải trả sinh hoạt phí cao đúng lúc mất thu nhập, nên quay lại săn truy nã sinh tử:

| Phương án (1.500 đời, seed 7) | Chính phái Danh vọng 40 / 50 / 70 tuổi | Tiền 70 tuổi | Chết vì giao đấu |
| :--- | :--- | ---: | ---: |
| Vòng 7 | 200 / 280 / 320 | 17.612 | 12% |
| Sai phái thành công +5 | 255 / 365 / 390 | 16.716 | 20% |
| Sai phái thành công +10 | 320 / 430 / 430 | 16.553 | 26% |
| Chức vị cộng hằng năm: Trưởng lão +10, Chưởng môn +15 | 320 / 515 / 820 | 13.439 | 20% |
| Như trên + trần sinh hoạt phí 50 khi ở trong môn | 315 / 515 / 830 | 17.783 | 18% |
| **Danh vọng chức vị phẳng (Trưởng lão +150, Chưởng môn +300) + trần sinh hoạt phí 50 (chọn)** | **440 / 510 / 560** | **17.224** | **11%** |
| Chức vị phẳng + Sai phái +5 | 480 / 560 / 620 | 16.890 | 18% |

Riêng Chính phái chuyên tu (không kiếm tiền) với Danh vọng cộng hằng năm thì tiền lúc 70 tuổi rơi từ 1.871 xuống 226, vì sinh hoạt phí ăn hết trợ cấp.

### 9.2. Thay đổi đã đưa vào hồ sơ

| Hạng mục | Nội dung | Hồ sơ |
| :--- | :--- | :--- |
| Danh vọng chức vị | Đang giữ chức Trưởng lão +150, Chưởng môn / Giáo chủ +300 (kể cả tự lập phái), tính vào Danh vọng hiển thị (trần 1000). Không tích lũy, mất ngay khi mất chức. | HS01 II.2 và Bảng Master, HS04 I.1 |
| Sinh hoạt phí trong môn phái | Còn ở trong môn phái (Ngoại môn đến Chưởng môn, kể cả tự lập phái) thì tối đa 50 lạng/năm dù Danh vọng cao. Rời môn phái thì áp lại bảng theo Danh vọng. | HS06 II.2 |

Script: thêm `Doi.dv` (Danh vọng hiển thị = cá nhân + chức vị) và dùng nó cho sinh hoạt phí, Diêm dẫn, quy mô môn phái tự lập; self-check thêm 2 assert cho trần 1000 và việc mất Danh vọng chức vị ngoài môn phái.

### 9.3. Kết quả (2.000 đời, seed chính)

| Lối chơi | Danh vọng 70 tuổi: vòng 7 → 8 | Tiền 70 tuổi: vòng 7 → 8 | Chết vì giao đấu: vòng 7 → 8 |
| :--- | ---: | ---: | ---: |
| Chính phái | 330 → **560** | 16.391 → 15.217 | 13% → **10%** |
| Tà phái | 120 → 420 | 22.892 → 22.394 | 12% → 12% |
| Lãng khách | 660 → 920 | 7.637 → **13.099** | 10% → 6% |
| Chính phái chuyên tu | 120 → 420 | 12.633 → 12.477 | 0% → 0% |
| Thương nhân | 340 → 340 | 39.442 → 39.174 | 4% → 3% |

Thương nhân kết cục #8 vẫn 9%; các lối chơi võ học vẫn 0%.

### 9.4. Nhận xét

* ✅ Danh vọng Chính phái lúc 70 tuổi về lại khoảng 560 (vòng 6: 600) mà rủi ro tử trận còn giảm thêm (10%).
* ✅ Hiệu ứng phụ có lợi: **Lãng khách tự lập phái** giờ có +300 Danh vọng chức vị nên môn phái lên quy mô Vừa / Lớn nhanh hơn, bổng lộc cả đời tăng từ 5.800 lên 9.000 lạng, tiền lúc 70 tuổi tăng 70%. Vấn đề "Khai Tông không còn sinh lời" ở mục 4.3 nhẹ đi đáng kể.
* ✅ Danh vọng giờ đọc được đúng nghĩa: phần cá nhân là thành tích, phần chức vị là "cái ghế". Mất ghế thì mất tiếng, đúng tinh thần giang hồ.
* 🟡 **Tà phái Giáo chủ cũng được +300** nên Danh vọng Tà phái tăng từ 120 lên 420; kết hợp Thanh danh -1000 thì đúng hình ảnh "Đại ma đầu nổi tiếng". Không ảnh hưởng tiền vì Tà phái cũng ăn ở trong giáo.
* 🟡 Kết cục và sự kiện dùng ngưỡng Danh vọng (Anh Hùng Thiếp Hoa Sơn, quy mô môn phái) giờ dễ đạt hơn với người giữ chức. Cần rà lại ngưỡng Anh Hùng Thiếp (HS01 V) khi chốt.

## 10. Vòng cân bằng 9 (gộp móc túi thành 1 hành động [Ám] mỗi năm)

Kết quả vòng 9 ở [KET_QUA_vong9.md](KET_QUA_vong9.md).

### 10.1. Chẩn đoán

Từ khi script chạy tới lúc chết (vòng 5), Tà phái bị lộ trung bình **31 lần mỗi đời**.
Tách theo loại (1.000 đời, đã gộp móc túi theo năm để đếm): khoảng 38 năm có móc túi và 14 hợp đồng ám sát.
Tà phái móc túi **38 năm mỗi đời**, kể cả lúc là Giáo chủ 40 - 70 tuổi với hơn 10.000 lạng: khi đang bị truy sát (không nhận được ám sát) hoặc gia sản vượt ngưỡng săn truy nã ở vòng 6, AP kiếm tiền rơi xuống móc túi.
Đây là lỗi chính sách của người chơi mẫu, không phải của GDD.

### 10.2. Thay đổi

| Hạng mục | Nội dung | Nơi sửa |
| :--- | :--- | :--- |
| Gộp việc vặt | Việc [Ám] nhỏ lặp lại cùng loại trong một năm (móc túi, trộm vặt, ăn quỵt) tính là 1 hành động [Ám] ghi vào cuối năm, Hiệp nghĩa bằng tổng cả năm. Việc có nạn nhân cụ thể (ám sát, hạ độc, tống tiền, đổ tội) vẫn tính từng lần. | HS01 II.3, HS06 II.1 |
| Chính sách người chơi mẫu | Chỉ móc túi khi gia sản < 5.000 lạng (cùng ngưỡng "khát tiền" với săn truy nã); AP dư chuyển sang luyện công | `mo_phong.py` |
| Script | Truy sát sau khi ám sát bại lộ giờ gắn cờ `am_sat` thay vì đoán theo `gia_tri >= 100` (một năm móc túi gộp lại có thể chạm 100) | `mo_phong.py` |

### 10.3. Tác dụng tách riêng (Tà phái, 2.000 đời, seed chính)

| Cấu hình | Hành động [Ám] mỗi đời | Bị lộ mỗi đời |
| :--- | ---: | ---: |
| Vòng 8 | trên 52 (mỗi lần móc túi tính riêng) | 31,4 |
| Chỉ gộp móc túi | 52 | 24,9 |
| Chỉ sửa chính sách | 30 | 20,0 |
| **Gộp + sửa chính sách** | **24** | **15,5** |

### 10.4. Kết quả Tà phái

| Chỉ số | Vòng 8 | Vòng 9 |
| :--- | ---: | ---: |
| Bị lộ mỗi đời | 31,4 | **15,6** |
| Thu nhập móc túi cả đời | 2.874 | 825 |
| Võ học / Cảnh giới lúc 50 tuổi | cấp 6 / 6 | **cấp 10 / 10** |
| Sống tới 80 tuổi | 38% | **72%** (Cảnh giới 10 nâng Age_max) |
| Tiền lúc 70 tuổi | 22.394 | 20.838 |
| Tỷ lệ tiền Tà / Chính lúc 70 tuổi | 1,47 lần | 1,37 lần |
| Thanh danh 20 / 30 / 50 tuổi | -368 / -840 / -1000 | -345 / -818 / -1000 |

Các lối chơi khác không đổi (chênh trong biên độ ngẫu nhiên).

### 10.5. Nhận xét

* ✅ Số lần lộ giảm một nửa, và Tà phái hết cảnh Giáo chủ đi móc túi. Thời gian đó dồn vào luyện công nên Tà phái mạnh hơn và sống lâu hơn hẳn.
* ✅ Khoảng cách giàu nghèo Tà / Chính tiếp tục thu hẹp (2,2 lần ở vòng 2 → 1,37 lần).
* 🟠 **Thanh danh Tà phái vẫn chạm -1000 trước 50 tuổi**, giờ chủ yếu do ám sát thuê: khoảng 14 hợp đồng mỗi đời, mỗi lần lộ -150, thất bại cũng -150 ngay. Lối chơi "ma đầu ẩn mình" vẫn chưa khả thi bằng con đường ám sát. Muốn mở lối này cần mô phỏng Dịch Dung (bại lộ tức thời 5%) hoặc giảm số hợp đồng tối đa mỗi năm.
* 🟡 Script dùng Thanh danh ≤ -100 làm cổng nhận ám sát, trong khi HS06 ghi cổng là **Hiệp nghĩa** ≤ -100 (giá trị thật, ẩn). Với Tà phái mẫu hai con số trùng nhau vì Khảo nghiệm Tinh Túc là việc công khai; khi mô phỏng ngụy quân tử cần tách Hiệp nghĩa thật khỏi Thanh danh trong script.

## 11. Rà ngưỡng Danh vọng của Anh Hùng Thiếp (Hoa Sơn Luận Kiếm)

Không sửa công thức nào, nên kết quả vòng 9 ([KET_QUA_vong9.md](KET_QUA_vong9.md)) giữ nguyên.
Script chỉ thêm 3 trường vào snapshot (`dvcn` Danh vọng cá nhân, `vl` Võ Lực, `chuc` chức vụ) để đo; báo cáo sinh ra không đổi một byte.

### 11.1. Điều kiện cũ

HS01 V ghi: Anh Hùng Thiếp gửi cho ai có "Danh vọng **và** Võ học nằm trong Top 10 thế giới" (trong 200 NPC).
Sau vòng 8, mọi Chưởng môn / Giáo chủ được +300 Danh vọng chức vị, nên Top 10 Danh vọng gần như mặc định là 10 Chưởng môn lớn nhất. Điều này khớp nguyên tác (Ngũ Tuyệt lần 1 đều là người đứng đầu một phái hoặc một vùng), nhưng điều kiện "và" khiến một cao thủ không giữ chức gần như không bao giờ được mời.

### 11.2. Phân bố trong mô phỏng (2.000 đời mỗi lối chơi, seed chính)

Danh vọng hiển thị (gồm chức vị) / Danh vọng cá nhân / Võ Lực, trung vị:

| Lối chơi | 40 tuổi | 50 tuổi | 70 tuổi | Làm Chưởng môn lúc 70 |
| :--- | :--- | :--- | :--- | ---: |
| Chính phái | 370 / 200 / 56 | 500 / 310 / 61 | 560 / 340 / 61 | 66% |
| Tà phái | 420 / 120 / 47 | 420 / 120 / 70 | 420 / 120 / 52 | 57% |
| Lãng khách | 400 / 400 / 60 | 840 / 560 / 70 | 920 / 640 / 62 | 85% (tự lập phái) |
| Chính phái chuyên tu | 90 / 90 / 69 | 90 / 90 / 79 | 90 / 90 / 59 | 49% |
| Thương nhân | 240 / 240 / 60 | 320 / 320 / 65 | 340 / 340 / 45 | 6% |

Tỷ lệ số đời được mời ít nhất 1 lần / ít nhất 2 lần nếu chỉ xét Danh vọng (Hoa Sơn mỗi 10 năm, độ lệch năm thế giới ngẫu nhiên), kèm tuổi trung vị lần mời đầu:

| Ngưỡng | Chính phái | Tà phái | Lãng khách | Chuyên tu | Thương nhân |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hiển thị ≥ 400 (chọn)** | **84% / 82% (44)** | **55% / 54% (40)** | **98% / 97% (44)** | **49% / 49% (41)** | **36% / 36% (47)** |
| Hiển thị ≥ 500 | 63% / 60% (49) | 0% | 93% / 91% (50) | 0% | 17% / 17% (47) |
| Hiển thị ≥ 600 | 36% / 33% (56) | 0% | 93% / 90% (51) | 0% | 14% / 11% (54) |
| Hiển thị ≥ 800 | 16% / 13% (56) | 0% | 89% / 84% (51) | 0% | 9% / 5% (67) |
| Cá nhân ≥ 400 | 39% / 37% (53) | 0% | 98% / 97% (44) | 0% | 36% / 36% (47) |
| Cá nhân ≥ 600 | 7% / 6% (57) | 0% | 67% / 66% (52) | 0% | 9% / 9% (50) |

### 11.3. Quyết định

Anh Hùng Thiếp = **Thập Đại Cao Thủ (Top 10 võ học trên Thiên Hạ Phong Vân Bảng) VÀ Danh vọng hiển thị ≥ 400** (mức *Danh hiệp* có sẵn ở HS06 II.2), đã sửa ở HS01 V.

* Danh vọng chỉ là **ngưỡng sàn**, không xếp hạng: tránh việc 10 Chưởng môn chiếm hết suất nhờ +300 chức vị, và giữ được nguyên tác (mọi Chưởng môn / Giáo chủ đều đủ tiếng, kể cả Tà phái kiểu Tây Độc).
* Ngưỡng ≥ 500 trở lên loại sạch Tà phái và Chính phái chuyên tu, hai lối chơi **mạnh võ nhất** (Võ Lực 70 - 79 lúc 50 tuổi), vì họ không có chiến thắng công khai nào. Ngưỡng 400 cho họ vào nhờ chức vị.
* Ai chưa đủ Danh vọng vẫn có cửa "Kẻ phá đám" (thách đấu 1 người trong Top 10 để giành suất), đúng kiểu cao thủ ẩn dật.
* Lần mời thứ hai đến gần như chắc chắn với ai đã được mời lần đầu (cột "ít nhất 2 lần" sát cột "ít nhất 1 lần"), nên kết cục #1 (thắng Hoa Sơn 2 lần) không bị chặn bởi Danh vọng.

### 11.4. Vấn đề lộ ra

* 🟠 **Võ Lực không dùng để xếp Thập Đại Cao Thủ được.** Võ Lực = Căn cốt / 2 + cấp võ cao nhất × 5, không tính tier bí kíp và Cảnh giới Nội công. Thương nhân (võ cấp 7) có Võ Lực 60 - 80, ngang Chính phái cấp 10. Cần định nghĩa một chỉ số **Chiến lực** cho Phong Vân Bảng (gồm tier, cấp, Cảnh giới), tốt nhất hiệu chỉnh từ tỷ lệ thắng Tam Hiệp trong script.
* 🟠 **Tai tiếng không sinh Danh vọng.** HS01 nói Danh vọng "không phân thiện ác", nhưng mọi lần bại lộ [Ám] chỉ trừ Thanh danh. Tà phái có Danh vọng cá nhân chỉ 120 dù bị lộ 15 lần mỗi đời. Đề xuất: bại lộ hành động [Ám] lớn (ám sát, hạ độc) cộng Danh vọng, ví dụ +10 mỗi lần, để "Đại ma đầu" thật sự nổi tiếng.
* 🟡 **Mô phỏng thiếu nhiều nguồn Danh vọng** (thắng Tam Hiệp công khai trước NPC có tên +5 / +20 / +50, lập công Đại sự kiện) và thiếu suy giảm khi ẩn cư (-5/năm). Các tỷ lệ ở 11.2 là cận dưới với lối chơi hiếu chiến và cận trên với lối chơi ẩn cư.

## 12. Chỉ số Chiến lực cho Thiên Hạ Phong Vân Bảng

Kết quả ở [KET_QUA_vong10.md](KET_QUA_vong10.md) (mục 4 mới và cột "Chiến lực" trong bảng vòng đời); mục 1 - 3 không đổi.
Script hiệu chỉnh: [hieu_chinh_chien_luc.py](hieu_chinh_chien_luc.py).

### 12.1. Phương pháp

* Sinh 30.000 cặp võ giả ngẫu nhiên (Căn cốt, Ngộ tính 20 - 100, tuổi 18 - 70, Cảnh giới 0 - 10, tier 1 - 4, cấp 1 - 10, hệ Nội lực và bản mệnh ngẫu nhiên); một nửa là cặp gần sức để có nhiều trận sát nút. Mỗi cặp đánh 1 trận Tam Hiệp bằng `quyet_dau`.
* Fit hồi quy logistic $P(A\ thắng) = \sigma(w \cdot (x_A - x_B))$ bằng Newton (không cần numpy), 24.000 trận để fit, 6.000 trận để kiểm tra.
* Hai ứng viên: (A) chỉ số lý thuyết $\ln(\text{Sát thương gốc} \times \text{HP} / (1 - \text{Giảm trừ}))$, đúng cấu trúc phân thắng bằng % HP còn lại; (B) tổ hợp tuyến tính tier, cấp, Cảnh giới, Căn cốt, Ngộ tính, thưởng HP theo tuổi.

| Mô hình | Log-loss (kiểm tra) | Đoán đúng bên thắng |
| :--- | ---: | ---: |
| Võ Lực hiện tại | 0,529 | 73,6% |
| (A) Lý thuyết, 1 tham số | 0,373 | 82,9% |
| (B) Tuyến tính tự do, 8 tham số | 0,371 | 82,6% |
| **(B) làm tròn: Chiến lực (chọn)** | **0,374** | **82,5%** |

Trọng số tự do (log-odds): tier Thượng thừa 1,20, Trấn phái 1,84, SSS 2,71; mỗi cấp võ 0,627; mỗi Cảnh giới 0,604; mỗi điểm Căn cốt 0,106; Ngộ tính 0,006 (bỏ); thưởng HP tuổi 0,006 mỗi điểm.
Chia cho trọng số cấp võ để 1 cấp = 10 điểm rồi làm tròn.

### 12.2. Công thức (HS06 I.5)

**Chiến lực = Điểm tier (0 / 20 / 30 / 45) + 10 × Cấp võ cao nhất + 10 × Cảnh giới + 2 × Căn cốt + Thưởng HP theo tuổi / 10**

$P(A\ thắng) \approx 1 / (1 + e^{-\Delta CL / 18})$: chênh 10 điểm ≈ 64%, 20 điểm ≈ 75%, 40 điểm ≈ 90%.
Đã thử các biến thể: Căn cốt ×1,7 (log-loss 0,373), ×1,5 (0,377); bỏ thưởng tuổi (0,381). Chọn ×2 cho dễ nhẩm.

Đối chiếu trên 8.000 cặp mới (KET_QUA.md mục 4):

| Chênh Chiến lực | Thắng thực tế | Thắng dự đoán |
| :--- | ---: | ---: |
| 0 - 9 | 57% | 57% |
| 10 - 19 | 72% | 70% |
| 20 - 29 | 80% | 80% |
| 30 - 39 | 87% | 87% |
| ≥ 40 | 95% | 95% |

### 12.3. Chiến lực trung vị theo lối chơi

| Lối chơi | 50 tuổi | 60 tuổi | 70 tuổi |
| :--- | ---: | ---: | ---: |
| Chính phái chuyên tu | 361 | 313 | 265 |
| Tà phái | 325 | 287 | 239 |
| Lãng khách | 305 | 287 | 259 |
| Chính phái | 289 | 291 | 273 |
| Thương nhân | 285 | 237 | 199 |

Khác với Võ Lực (Thương nhân 60 - 80, ngang Chính phái), Chiến lực xếp đúng: người chuyên tu mạnh nhất, Thương nhân yếu nhất từ 60 tuổi.
Đỉnh Chiến lực rơi vào khoảng 50 tuổi rồi giảm vì Căn cốt -2/năm và thưởng HP tuổi giảm, khớp với ý đồ "lão quái vật" chỉ mạnh nhờ kỳ ngộ / đan dược.

### 12.4. Thay đổi trong hồ sơ

| Hạng mục | Nội dung | Hồ sơ |
| :--- | :--- | :--- |
| Công thức Chiến lực | Mục mới I.5 kèm cách đọc chênh lệch, nguồn gốc hệ số, những gì chưa tính | HS06 I.5 |
| Bảng Master | Dòng `chien_luc` (0 - 560) | HS01 II.8 |
| Anh Hùng Thiếp | Thập Đại Cao Thủ = Top 10 Chiến lực | HS01 V |
| Phong Vân Bảng | Thập Đại Cao Thủ xếp theo Chiến lực, hiện tỷ lệ thắng ước tính; Chiến lực NPC chỉ hiện chính xác khi đã giao đấu hoặc Ngộ tính ≥ 70 (không thì hiện khoảng ±30); Thập Đại Ác Nhân xếp theo Chiến lực trong số NPC Thanh danh ≤ -300 | HS07 I |

Script: thêm `VoGia.chien_luc`, hằng số `CL_*`, mục báo cáo `bao_cao_chien_luc`, cột Chiến lực trong bảng vòng đời và 1 assert self-check (ví dụ 365 điểm ở HS06).

### 12.5. Nhận xét

* ✅ Chiến lực dự đoán thắng thua sát thực tế ở mọi khoảng chênh, và đủ đơn giản để người chơi tự nhẩm.
* 🟡 Căn cốt chiếm tỷ trọng lớn (60 Căn cốt = 120 điểm, ngang 12 cấp võ) vì nó cùng lúc tăng HP, MP và Giảm trừ. Đúng với công thức chiến đấu hiện tại, nhưng nếu đội thiết kế muốn võ học quan trọng hơn thể chất thì nên giảm hệ số HP theo Căn cốt (12/điểm) trước, rồi hiệu chỉnh lại.
* 🟡 Khinh công, Thần binh và hệ khắc chế chưa có trong Chiến lực vì script chưa mô phỏng chúng (Khinh công luôn 0, không có Thần binh). Khi bổ sung, chạy lại `hieu_chinh_chien_luc.py` với thêm đặc trưng.
* 🟡 Các đề xuất hiển thị ở HS07 (độ chính xác theo Ngộ tính, tiêu chí Thập Đại Ác Nhân) là thiết kế mới, chưa có số liệu mô phỏng NPC để kiểm chứng.

## 13. Vòng cân bằng 11 (tai tiếng sinh Danh vọng)

Kết quả vòng 11 ở [KET_QUA_vong11.md](KET_QUA_vong11.md).

### 13.1. Thay đổi

| Hạng mục | Nội dung | Hồ sơ |
| :--- | :--- | :--- |
| Tai tiếng | Bại lộ hành động [Ám] lớn (ám sát, hạ độc, giết người diệt khẩu), kể cả bị bắt quả tang khi thất bại, cộng Danh vọng **bằng mức thắng công khai trước chính nạn nhân** (+5 / +20 / +50 theo HS01 II.2). Việc [Ám] vặt không sinh tai tiếng. | HS01 II.2, II.3; HS06 II.1 |
| Script | `TAI_TIENG = 20` (mục tiêu ngang sức ≈ cấp Trưởng lão). Hợp đồng ám sát thất bại giờ đi qua `bai_lo` nên được đếm là 1 lần bại lộ (trước đây chỉ trừ Thanh danh mà không đếm). | `mo_phong.py` |

Lưu ý cách đếm: Tà phái giờ "bị lộ" 26,3 lần mỗi đời thay vì 15,6, vì khoảng 11 hợp đồng thất bại mỗi đời nay được tính; Thanh danh và tiền không đổi vì phần trừ Thanh danh vẫn như cũ.

### 13.2. Quét mức tai tiếng (Tà phái, 2.000 đời, ngưỡng Anh Hùng Thiếp Danh vọng ≥ 400)

| Tai tiếng mỗi lần lộ | Được mời ≥ 1 lần | Riêng người không làm Giáo chủ | Danh vọng cá nhân 70 tuổi |
| ---: | ---: | ---: | ---: |
| 0 (vòng 10) | 55% | 1% | 120 |
| 10 | 60% | 9% | 280 |
| **20 (chọn, = thắng công khai trước Trưởng lão)** | **93%** | **86%** | **440** |
| 30 | 95% | 90% | 600 |
| 50 | 96% | 92% | 940 |

Không chọn một hằng số riêng mà dùng lại thang thắng công khai có sẵn: giết một Chưởng môn nổi tiếng hơn giết một đệ tử, đúng logic, và không thêm số mới cho đội thiết kế phải giữ.

### 13.3. Kết quả Tà phái

| Chỉ số | Vòng 10 | Vòng 11 |
| :--- | ---: | ---: |
| Danh vọng hiển thị 40 / 50 / 70 tuổi | 420 / 420 / 420 | 540 / 600 / 720 |
| Tiền 70 tuổi (trung vị / P10) | 20.838 / 10.286 | 20.664 / 8.075 |
| Chết vì giao đấu | 12% | 14% |
| Chi mua núi lập phái (trung bình) | 8 | 1.042 |

Người Tà phái bị trục xuất giờ đủ Danh vọng 500 để Khai Tông (khoảng 1 / 5 số đời), đúng ví dụ *Hắc Phong Sơn Trại* ở HS04.
Đổi lại, người bị trục xuất mang Danh vọng cao phải trả sinh hoạt phí 150 lạng/năm nên P10 tiền giảm và tử trận nhích từ 12% lên 14% (cùng cơ chế đã thấy ở vòng 8).
Các lối chơi khác không đổi (chênh do luồng ngẫu nhiên).

### 13.4. Rà lại Anh Hùng Thiếp (Danh vọng ≥ 400), kèm Chiến lực ở các lần được mời

| Lối chơi | Được mời ≥ 1 / ≥ 2 lần | Tuổi lần mời đầu | Chiến lực khi được mời (TV / P90) | Được mời khi không giữ chức |
| :--- | :--- | ---: | :--- | ---: |
| Chính phái | 84% / 82% | 44 | 273 / 345 | 30% |
| **Tà phái** | **93% / 77%** (vòng 10: 55%) | 43 | 248 / 316 | **36%** |
| Lãng khách | 98% / 97% | 44 | 260 / 327 | 70% |
| Chính phái chuyên tu | 49% / 49% | 41 | 301 / 361 | 0% |
| Thương nhân | 36% / 35% | 46 | 225 / 275 | 36% |

* ✅ Tà phái giờ được mời ngang Chính phái, và 36% số đời được mời khi không giữ chức nào: ma đầu nổi tiếng nhờ ác danh, đúng hình mẫu Tây Độc / Đinh Xuân Thu.
* ✅ Hai cổng bổ sung cho nhau: Thương nhân qua cổng Danh vọng 36% nhưng có Chiến lực thấp nhất (225), nên sẽ rớt ở cổng Top 10 Chiến lực; chuyên tu có Chiến lực cao nhất (301) nhưng chỉ được mời khi làm Chưởng môn, phần còn lại đi đường "Kẻ phá đám".
* 🟡 Tà phái chỉ 77% được mời từ 2 lần trở lên (các lối khác gần bằng tỷ lệ 1 lần), vì Danh vọng của Tà phái thường chỉ vượt 400 sau 40 tuổi và một phần chết trận trước lần Hoa Sơn kế tiếp. Không ảnh hưởng kết cục #1 vì Tà phái khó đạt điều kiện "không thua trận nào từ 25 tuổi".
* 🟡 Chưa thể kiểm chứng cổng Top 10 Chiến lực vì script chưa mô phỏng 200 NPC. Chiến lực P90 khi được mời (275 - 361) là mốc tham chiếu khi thiết kế phân bố Chiến lực của NPC.

## 14. Vòng cân bằng 12 (Khinh công, Thần binh và hiệu chỉnh lại Chiến lực)

Kết quả ở [KET_QUA_vong12.md](KET_QUA_vong12.md); chỉ mục 4 (đối chiếu Chiến lực) đổi so với vòng 11, vì các lối chơi mẫu chưa luyện Khinh công hay có Thần binh.

### 14.1. Cơ chế thêm vào script

| Cơ chế | Cách mô phỏng | Nguồn |
| :--- | :--- | :--- |
| Giảm trừ theo Khinh công | +2% mỗi cấp (đã có công thức, trước đây Khinh công luôn 0) | HS06 I.4 |
| Thứ tự ra đòn Hiệp 2 | Bên có tiên cơ Hiệp 1 ra trước; không thì `[Roll: Khinh công × 10 vs Khinh công địch × 10]` | **Mới**, HS02 V.2 |
| AI Hiệp 1 | NPC hơn ≥ 3 cấp Khinh công chuyển 15% từ Tiên Hạ Thủ sang Thân Pháp | HS02 V.1 |
| Sát thương Thần binh | Cộng thẳng vào DMG: Lợi khí +30, Danh khí +60, Thần binh +100 | **Mới**, HS02 IV, HS06 I.4 |

### 14.2. Phát hiện: luật "Khinh công cao hơn thì ra đòn trước" quá mạnh

GDD không ghi thứ tự ra đòn ở Hiệp 2; script từ vòng 1 giả định bên Khinh công cao hơn **luôn** ra trước.
Khi bật Khinh công, chỉ hơn 1 cấp đã thắng 72% (mức Trung), hơn 2 cấp thắng 77%, mạnh hơn cả +1 cấp võ (75%).
Ra đòn trước có thể hạ gục đối thủ trước khi họ kịp đánh, nên một luật tuyệt đối biến 1 cấp Khinh công thành lợi thế quyết định.
Đổi sang Roll theo ký hiệu chuẩn:

| Chênh Khinh công (đối thủ ngang sức) | Trung: tuyệt đối → Roll | Đỉnh: tuyệt đối → Roll |
| :--- | :--- | :--- |
| +1 cấp | 72% → 65% | 62% → 60% |
| +2 cấp | 77% → 76% | 69% → 70% |
| +5 cấp | 84% → 84% | 84% → 83% |
| +10 cấp | 98% → 97% | 97% → 97% |

Roll chủ yếu làm mềm chênh lệch 1 cấp; từ 2 cấp trở lên phần Giảm trừ (+2%/cấp) chiếm ưu thế.
Khinh công vẫn rất đáng luyện: +2 cấp ngang +1 cấp võ ở mức Trung.

### 14.3. Tác động của Thần binh (đối thủ ngang sức)

| Thần binh | Trung (Thượng thừa 5/10) | Đỉnh (SSS 10/10) |
| :--- | ---: | ---: |
| Lợi khí +30 | 66% | 61% |
| Danh khí +60 | 78% | 70% |
| Thần binh +100 | 87% | 77% |

Vì cộng thẳng vào sát thương, Thần binh quý nhất với người còn yếu và loãng dần khi võ học mạnh lên. Đây là chủ ý hợp lý (Thần binh giúp kẻ yếu lật kèo), nhưng nếu muốn Thần binh luôn đáng giá ở đỉnh thì đổi sang dạng nhân (ví dụ ×1,05 / ×1,10 / ×1,15).

### 14.4. Hiệu chỉnh lại Chiến lực

30.000 trận ngẫu nhiên, Khinh công 0 - 10, Thần binh {0, 0, 30, 60, 100}:

| Mô hình | Log-loss | Đoán đúng |
| :--- | ---: | ---: |
| Võ Lực | 0,551 | 71,6% |
| Chiến lực vòng 10 (không có Khinh công, Thần binh) | 0,400 | 80,5% |
| Lý thuyết ln(DMG × HP hiệu dụng) | 0,340 | 85,4% |
| Tuyến tính tự do (10 tham số) | 0,332 | 85,2% |
| **Chiến lực mới (làm tròn)** | **0,336** | **84,9%** |

Trọng số tự do quy về thang 1 cấp võ = 10 điểm: Khinh công 4,8 → **5 điểm / cấp**; Thần binh 0,19 → **Sát thương Thần binh / 5** (Lợi khí 6, Danh khí 12, Thần binh 20 điểm); các hệ số cũ giữ nguyên (Cảnh giới 9,9; Căn cốt 1,8; tier 17 / 28 / 41 so với 20 / 30 / 45 đang dùng: thử 15 / 30 / 40 không tốt hơn).
Thang đo đổi từ 18 xuống **16** (chênh 10 điểm ≈ 65%, 20 ≈ 78%, 40 ≈ 92%).

**Chiến lực = Tier (0 / 20 / 30 / 45) + 10 × Cấp võ + 10 × Cảnh giới + 2 × Căn cốt + Thưởng tuổi / 10 + 5 × Cấp Khinh công + Sát thương Thần binh / 5**

Đối chiếu trên 8.000 cặp mới (KET_QUA.md mục 4): dự đoán và thực tế lệch tối đa 2 điểm % ở mọi khoảng chênh (58/58, 73/72, 84/82, 90/90, 96/97).

### 14.5. Thay đổi trong hồ sơ

| Hồ sơ | Nội dung |
| :--- | :--- |
| HS02 IV | Thang Sát thương Thần binh 3 bậc, phân loại các món hiện có, ghi chú tác động |
| HS02 V.2 | Luật thứ tự ra đòn Hiệp 2 (tiên cơ, rồi Roll Khinh công) |
| HS06 I.4 | Dòng Sát Thương Thần Binh trong công thức sát thương |
| HS06 I.5 | Công thức Chiến lực mới, thang đo 16, độ chính xác 84,9%, ví dụ có Khinh công và Thần binh |
| HS01 II.8 | Bảng Master: Chiến lực 0 - 630, thêm Khinh công và Thần binh vào nguồn |

Script: `VoGia.than_binh`, `chon_ai(..., dich)`, Roll thứ tự Hiệp 2, `CL_KHINH_CONG`, `CL_THAN_BINH`, `CL_THANG_DO = 16`, thêm 1 assert (405 điểm); `hieu_chinh_chien_luc.py` sinh Khinh công / Thần binh ngẫu nhiên và in thêm dòng so sánh Võ Lực và Chiến lực hiện hành.

### 14.6. Còn mở

* 🟡 Các lối chơi mẫu chưa luyện Khinh công và chưa nhặt Thần binh, nên số liệu vòng đời chưa phản ánh hai thứ này. Cần thêm chính sách luyện ô Khinh công và nguồn Thần binh (kỳ ngộ, Hắc Thị) nếu muốn kiểm tra kinh tế / tuổi thọ với chúng.
* 🟡 Thần binh dạng cộng thẳng loãng ở cấp đỉnh (xem 14.3); quyết định giữ hay đổi sang dạng nhân thuộc về đội thiết kế.

## 15. Mô phỏng 200 NPC: kiểm chứng Thập Đại Cao Thủ và cổng Top 10 của Anh Hùng Thiếp

Kết quả ở [KET_QUA_vong13.md](KET_QUA_vong13.md) mục 5 (mới); mục 1 - 4 không đổi.

### 15.1. Mô hình

* Mỗi NPC là **một đời chạy đúng luật như người chơi** (`song_mot_doi`), nên bậc môn phái, Chiến lực, Danh vọng (kể cả chức vị, tai tiếng) theo tuổi đều nhất quán với các vòng trước.
* Kho 500 đời mỗi lối chơi; NPC rút theo tỷ lệ giả định (HS05 chưa có): Chính phái 35%, Tà phái 20%, Lãng khách 20%, Thương nhân 15%, Chính phái chuyên tu 10%. Tuổi đều 16 - 80 trong số người còn sống ở tuổi đó.
* Mỗi kỳ Hoa Sơn bốc lại 200 NPC (dân số dừng), xếp theo Chiến lực; 400 kỳ.
* Người chơi: mỗi đời trong kho, ở mỗi kỳ Hoa Sơn (mỗi 10 năm, độ lệch năm ngẫu nhiên) so Chiến lực với ngưỡng Top 10 của một thế giới ngẫu nhiên, rồi xét thêm Danh vọng ≥ 400.
* Script: `song_mot_doi(..., ghi_nam=True)` ghi (Chiến lực, Danh vọng, chức) mỗi năm; báo cáo `bao_cao_npc`. Như các lối chơi mẫu, NPC chưa có Khinh công và Thần binh.

### 15.2. Thập Đại Cao Thủ

| Chỉ số | Giá trị |
| :--- | :--- |
| Chiến lực người thứ 10 (ngưỡng Top 10) | trung vị 341, P10 - P90: 335 - 351 |
| Tuổi thành viên | trung vị 50, P10 - P90: 44 - 54 |
| Theo lối sống | Chính phái 42%, chuyên tu 36%, Lãng khách 18%, Thương nhân 2%, Tà phái 1% |
| Theo chức vụ | Chưởng môn 69%, không chức 30%, Trưởng lão 0% |
| Có Danh vọng ≥ 400 (nhận được thiếp) | 78% (trung bình khoảng 8 / 10 người được mời, còn lại là cao thủ ẩn dật đi đường "Kẻ phá đám") |

### 15.3. Người chơi

| Lối chơi | Vào Top 10 ≥ 1 lần | Anh Hùng Thiếp ≥ 1 / ≥ 2 lần | Tuổi lần mời đầu | Từng đứng số 1 |
| :--- | ---: | ---: | ---: | ---: |
| Chính phái | 36% | 36% / 1% | 51 | 5% |
| Tà phái | 3% | 3% / 0% | 50 | 0% |
| Lãng khách | 28% | 23% / 1% | 50 | 1% |
| Chính phái chuyên tu | 86% | 44% / 16% | 46 | 3% |
| Thương nhân | 7% | 0% / 0% | 47 | 0% |

So với mục 13.4 (chỉ xét Danh vọng), cổng Chiến lực là cổng lọc thật: Chính phái 84% → 36%, Lãng khách 98% → 23%, Thương nhân 36% → 0%.

### 15.4. Độ nhạy (300 đời mỗi lối, 200 kỳ)

| Biến thể | Ngưỡng Top 10 (P10 / P90) | Chính / Tà / Lãng khách / Chuyên tu được mời ≥ 1 lần | ≥ 2 lần |
| :--- | :--- | :--- | :--- |
| Tỷ lệ gốc | 335 / 355 | 36% / 2% / 22% / 43% | 2% / 0% / 1% / 12% |
| Chuyên tu 20% | 341 / 356 | 28% / 0% / 13% / 42% | 0% / 0% / 0% / 7% |
| Không có chuyên tu | 329 / 349 | 41% / 7% / 25% / 44% | 5% / 0% / 1% / 20% |
| Tỷ lệ gốc, Hoa Sơn **5 năm** một lần | 335 / 355 | 43% / 3% / 30% / 43% | **25% / 0% / 14% / 43%** |

Các kết luận dưới đây đứng vững qua mọi tỷ lệ NPC đã thử.

### 15.5. Phát hiện

* 🔴 **Kết cục #1 (thắng Hoa Sơn ≥ 2 lần) gần như không đạt được.** Chiến lực đạt đỉnh khoảng 50 tuổi rồi giảm khoảng 5 điểm/năm (Căn cốt -2/năm, thưởng HP theo tuổi giảm), nên một người chỉ ở trong Top 10 khoảng 10 năm (44 - 54 tuổi), vừa đúng một kỳ Hoa Sơn. Chỉ 1 - 2% đời Chính phái / Lãng khách được mời 2 lần, chưa nói đến thắng. Hướng sửa (cần đội thiết kế chọn):
  1. Hoa Sơn 5 năm một lần (≥ 2 lần mời: 14 - 43%), nhưng lệch nguyên tác (các kỳ Luận Kiếm cách nhau hàng chục năm).
  2. Đổi điều kiện kết cục #1 thành "thắng Hoa Sơn 1 lần **và** giữ số 1 Phong Vân Bảng ≥ 10 năm", hoặc thắng 2 lần tính cả các trận "Kẻ phá đám" ở kỳ mình không được mời.
  3. Làm chậm suy giảm tuổi già cho người Cảnh giới cao (ví dụ Cảnh giới ≥ 8 thì Căn cốt chỉ giảm từ 60 tuổi), đúng hình mẫu "lão quái vật" Kim Dung.
* 🟠 **Tà phái gần như không bao giờ vào Thập Đại Cao Thủ** (1% thành viên, 3% số đời). Vòng 11 đã mở cổng Danh vọng cho Tà phái, nhưng nút thắt thật là Chiến lực: Tà phái mẫu khởi đầu Căn cốt 45 (Chính phái 55), mất 20 Chiến lực, và lại không được luyện đủ vì ám sát, móc túi chiếm AP. Mô phỏng chưa có các tà công tăng sức nhanh (Hấp Tinh Đại Pháp, Hóa Công Đại Pháp, Cửu Âm Bạch Cốt Trảo), vốn là đặc trưng của Tà phái. Nếu GDD muốn Tây Độc / Đinh Xuân Thu có chỗ trên bảng, Tà phái cần một cơ chế bù (tà công Tier factor thấp hơn, hoặc hút Nội lực cộng Cảnh giới).
* 🟡 **Thương nhân bị cổng Chiến lực loại sạch** (0% được mời) dù 36% đủ Danh vọng: đúng ý đồ.
* 🟡 **Cao thủ ẩn dật có thật trong bảng:** 30% thành viên Top 10 không giữ chức (chủ yếu chuyên tu bị trục xuất), khoảng 22% không đủ Danh vọng nhận thiếp. Cửa "Kẻ phá đám" ở HS01 V có người dùng thật.
* 🟡 Tỷ lệ NPC theo lối sống là giả định; nên ghi chính thức vào HS05 khi chốt, vì nó dời ngưỡng Top 10 khoảng ±6 điểm.

## 16. Vòng cân bằng 14 (lão hóa chậm cho người Cảnh giới cao)

Kết quả ở [KET_QUA_vong14.md](KET_QUA_vong14.md).

### 16.1. Thay đổi

| Hạng mục | Cũ | Mới | Hồ sơ |
| :--- | :--- | :--- | :--- |
| Tuổi bắt đầu giảm Căn cốt (-2/năm) | Sau 50 tuổi với mọi người | Sau 50; **sau 60 nếu Cảnh giới Nội công ≥ 8** (vẫn miễn hẳn với Dịch Cân Kinh, Cửu Dương, Tiên Thiên Công, Bát Hoang Lục Hợp) | HS04 III, HS01 II.8, HS06 I.1 |

Script: hàm `tuoi_bat_dau_lao_hoa`, hằng số `LAO_HOA_*`, 1 assert. NPC dùng chung luật nên cũng già chậm hơn.
Thưởng HP theo tuổi (giảm sau 50) giữ nguyên.

### 16.2. Thập Đại Cao Thủ và Anh Hùng Thiếp

| Chỉ số | Vòng 13 | Vòng 14 |
| :--- | :--- | :--- |
| Ngưỡng Top 10 Chiến lực (TV, P10 - P90) | 341 (335 - 351) | **358** (351 - 361) |
| Tuổi thành viên Top 10 (TV, P10 - P90) | 50 (44 - 54) | 53 (46 - 59) |
| Theo lối sống | Chính 42%, chuyên tu 36%, Lãng khách 18%, Thương nhân 2%, Tà 1% | Chính 57%, chuyên tu 31%, Lãng khách 12%, Thương nhân 0%, Tà 0% |
| Chưởng môn trong Top 10 | 69% | 83% |

| Lối chơi | Vào Top 10: vòng 13 → 14 | Anh Hùng Thiếp ≥ 2 lần: vòng 13 → 14 | Từng đứng số 1 |
| :--- | :--- | :--- | :--- |
| Chính phái | 36% → 42% | **1% → 11%** | 5% → 3% |
| Tà phái | 3% → 0% | 0% → 0% | 0% → 0% |
| Lãng khách | 28% → 18% | 1% → 3% | 1% → 5% |
| Chính phái chuyên tu | 86% → 81% | 16% → 12% | 3% → 1% |
| Thương nhân | 7% → 0% | 0% → 0% | 0% → 0% |

### 16.3. Vòng đời

| Lối chơi | Chiến lực 70 tuổi: vòng 13 → 14 | Sống tới 80 | Khác |
| :--- | :--- | :--- | :--- |
| Chính phái | 273 → 288 | 82% → 85% | Chết vì giao đấu 10% → 9% |
| Tà phái | 239 → 279 | 69% → 71% | |
| Lãng khách | 259 → 289 | 67% → 66% | Tiền 70 tuổi 13.021 → 14.361 |
| Chính phái chuyên tu | 265 → 305 | 100% | |
| Thương nhân | 199 → 209 | 45% → 43% | Kết cục #8: 8% → 10% |

Hiệu chuẩn Chiến lực (KET_QUA.md mục 4) vẫn khớp, lệch tối đa 2 điểm %.

### 16.4. Nhận xét

* ✅ Cao thủ già giữ sức lâu hơn: Chiến lực lúc 70 tuổi tăng 15 - 40 điểm, Thập Đại Cao Thủ trải rộng tới 59 tuổi, Chưởng môn chiếm 83% bảng, gần với hình ảnh Ngũ Tuyệt hơn.
* 🟠 **Kết cục #1 vẫn rất khó**: Chính phái được mời 2 lần tăng từ 1% lên 11%, nhưng người khác chỉ 3 - 12%, và đây mới là được mời, chưa phải thắng 2 lần. Lý do: bảng xếp hạng là **tương đối**, NPC cũng già chậm nên ngưỡng Top 10 tăng theo (341 → 358). Cửa sổ ở trong Top 10 chỉ nới từ khoảng 10 lên khoảng 13 năm, vẫn ngắn hơn hai kỳ Hoa Sơn. Muốn kết cục #1 khả thi cần kết hợp thêm một hướng ở mục 15.5 (ví dụ tính cả trận "Kẻ phá đám", hoặc "thắng 1 lần và giữ số 1 Phong Vân Bảng 10 năm").
* 🟠 **Lãng khách vào Top 10 giảm** (28% → 18%): Lãng khách đạt Cảnh giới 8 muộn (khoảng 60 tuổi) nên hưởng lợi ít, trong khi ngưỡng tăng chung.
* 🟠 **Tà phái rơi hẳn khỏi bảng** (0%) dù Chiến lực lúc 60 tuổi đã lên 327, vì ngưỡng tăng lên 358. Vấn đề Tà phái thiếu Chiến lực (mục 15.5) càng rõ.

## 17. Kết cục #1 mới: thắng Hoa Sơn 1 lần và giữ số 1 Phong Vân Bảng ≥ 10 năm

Kết quả ở [KET_QUA.md](KET_QUA.md) mục 5 (viết lại); mục 1 - 4 không đổi.

### 17.1. Thay đổi mô hình NPC

Vòng 13 bốc lại 200 NPC độc lập mỗi kỳ Hoa Sơn, nên không đo được "giữ số 1 nhiều năm".
Giờ `the_gioi_npc` chạy một **thế giới liên tục** 3.000 năm (sau 100 năm khởi động): mỗi năm 200 NPC già thêm 1 tuổi, người mất được thay bằng một đời mới 16 tuổi.
Người chơi được đặt vào thế giới ở một năm sinh ngẫu nhiên và so Chiến lực với Top 10 của từng năm.
Giải Hoa Sơn (`hoa_son`): 3 trận Tam Hiệp liên tiếp với 3 người được mời khác, mỗi trận thắng với xác suất theo Chiến lực (HS06 I.5); chưa tính việc HP không hồi đầy giữa các trận, nên tỷ lệ thắng là cận trên.

Các chỉ số Top 10 khớp vòng 14 (ngưỡng 357, tuổi 46 - 59, Chưởng môn 83%), xác nhận mô hình liên tục không làm lệch kết quả cũ.

### 17.2. Nhiệm kỳ số 1 của NPC

Một NPC đứng số 1 liên tục trung vị **2 năm**, P90 7 năm, dài nhất 16 năm; chỉ **5%** nhiệm kỳ kéo dài ≥ 10 năm.
Chiến lực đỉnh chỉ giữ được vài năm (tăng tới khoảng 50 - 60 tuổi rồi giảm), và luôn có người khác đang lên.

### 17.3. Tỷ lệ đạt (500 đời mỗi lối chơi)

| Lối chơi | Vào Top 10 | Anh Hùng Thiếp ≥ 1 / ≥ 2 | Thắng Hoa Sơn ≥ 1 / ≥ 2 | Số 1 liên tục ≥ 10 năm | Kết cục #1 cũ | **Kết cục #1 mới** |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| Chính phái | 42% | 41% / 9% | 7% / 0% | 0% | 0% | **0%** |
| Tà phái | 0% | 0% / 0% | 0% / 0% | 0% | 0% | **0%** |
| Lãng khách | 28% | 16% / 3% | 3% / 0% | 2% | 0% | **1%** |
| Chính phái chuyên tu | 93% | 42% / 15% | 8% / 0% | 0% | 0% | **0%** |
| Thương nhân | 0% | 0% / 0% | 0% / 0% | 0% | 0% | **0%** |

Các biến thể đã thử (cùng thế giới, tỷ lệ "thắng Hoa Sơn 1 lần + ..."):

| Lối chơi | số 1 liên tục ≥ 10 | số 1 cộng dồn ≥ 10 | số 1 liên tục ≥ 5 | số 1 cộng dồn ≥ 5 | Top 3 liên tục ≥ 10 |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Chính phái | 0,0% | 0,0% | 0,4% | 0,4% | 1,0% |
| Lãng khách | 0,4% | 0,4% | 1,2% | 1,2% | 0,6% |
| Chính phái chuyên tu | 0,0% | 0,0% | 0,2% | 0,2% | 0,0% |
| Tà phái, Thương nhân | 0% | 0% | 0% | 0% | 0% |

### 17.4. Nhận xét

* ✅ Điều kiện mới thay được "thắng 2 lần" (0% ở mọi lối chơi) bằng một điều kiện đo được và có người đạt (Lãng khách 1%).
* 🟠 **Kết cục #1 vẫn ở mức 0 - 1%**, và đây là cận trên vì chưa tính 2 môn SSS cấp 10 và "không thua từ 25 tuổi". Mọi biến thể nới lỏng đều ≤ 1,2%, vì nút thắt đầu tiên là **thắng Hoa Sơn**, chỉ 3 - 8% kể cả với người được mời: phải thắng liền 3 trận trước những người mạnh nhất thiên hạ.
* 🟡 Có thể chấp nhận cho một kết cục đỉnh cao, nhưng nên lưu ý: các lối chơi mẫu không chủ động săn Thần công SSS hay Thần binh. Người chơi tối ưu cho kết cục này (săn kỳ ngộ SSS, giữ Cảnh giới ≥ 8, có Thần binh) sẽ đạt cao hơn; cần một lối chơi mẫu "Võ si" để đo trước khi chốt.
* 🟡 Tà phái vẫn 0% ở mọi chỉ số Phong Vân Bảng (xem 15.5).
* ✅ **Quyết định (2026-10-26):** giữ kết cục #1 ở mức 0 - 1% như một kết cục đỉnh cao; không thêm lối chơi mẫu "Võ si".

## 18. Vòng cân bằng 16 (Tà phái và Thập Đại Cao Thủ)

Kết quả ở [KET_QUA.md](KET_QUA.md); vòng 15 lưu ở [KET_QUA_vong15.md](KET_QUA_vong15.md).

### 18.1. Chẩn đoán

Ở vòng 15, Chiến lực đỉnh của Tà phái hẹp bất thường: P50 334, P90 335, đúng bằng $30 + 100 + 100 + 2 \times 45 + 15$.
Tà phái mẫu không thiếu luyện công (lên cấp võ 10 và Cảnh giới 10 lúc 50 tuổi, sớm hơn Chính phái); toàn bộ khoảng cách nằm ở **Căn cốt**:

| Nguyên nhân | Căn cốt mất | Chiến lực mất | Loại |
| :--- | ---: | ---: | :--- |
| Script bỏ sót *Căn cốt +10* của lựa chọn [A] khảo nghiệm Tinh Túc (HS03 mục 4), chỉ áp Hiệp nghĩa -150 | 10 | 20 | Lỗi mô phỏng |
| Tuổi 11 - 18 Tà phái mẫu móc túi thay vì Làm thuê (Làm thuê: Căn cốt +1/năm, HS06 II.1) | khoảng 7 | khoảng 14 | Giả định lối chơi |
| Chính phái mẫu khởi đầu Căn cốt 55, Tà phái 45 | 10 | 20 | Giả định lối chơi |

Có một hiệu ứng ngược: với Căn cốt 45 < 50, Tà phái mẫu không đủ điều kiện Áp tiêu, nên khi đã giàu (≥ 5.000 lạng, ngừng móc túi và săn truy nã) AP kiếm tiền rơi vào luyện công, biến Tà phái mẫu thành "chuyên tu" ngoài ý muốn.
Sửa lỗi +10 Căn cốt làm Tà phái đủ điều kiện Áp tiêu, nên đỉnh trung vị **giảm** 334 → 292 trong khi P90 tăng 335 → 355; vào Top 10 chỉ tăng 0% → 9%, chiếm 1% bảng.

Kết luận: với luật hiện tại, Tà phái và Chính phái tăng sức như nhau, nhưng Tà phái **không có lợi thế riêng nào** để bù cho việc mất AP vào ám sát, móc túi, và tuổi thơ không có nguồn Căn cốt.
Trong khi đó Kim Dung luôn có ma đầu trong hàng tuyệt đỉnh (Tây Độc trong Ngũ Tuyệt, Đông Phương Bất Bại, Đinh Xuân Thu), và GDD đã hứa Ma Tâm mở khóa "Ma công tàn độc" (HS01 II.2) mà chưa cho Ma công một con số nào.

### 18.2. Thay đổi đưa vào hồ sơ

| Hạng mục | Nội dung | Hồ sơ |
| :--- | :--- | :--- |
| Ma công | Trấn phái của Tà phái (Hấp Tinh, Hóa Công, Huyết Hải Ma Công, Vạn Cổ Phệ Tâm Quyết) khi Hiệp nghĩa ≤ -300: Uy lực 320 và Điểm Tier 45 như SSS, Tier factor vẫn 3 | HS02 II.2 (khối mới), HS06 I.5, HS01 II.2 |
| Phản phệ | Mỗi năm còn trang bị Ma công: 3% Tẩu Hỏa Nhập Ma (Căn cốt -5, Ám thương +5, không tán công), Hàn Ngọc Sàng nhân 0,5 | HS02 II.2, HS06 I.4 |

Script: hằng số `MA_CONG*`, `Doi.ma_cong`, `Doi.tier_chien`, phản phệ trong vòng năm, 2 assert; sửa lỗi Căn cốt +10 khảo nghiệm Tinh Túc.

### 18.3. Quét mức phản phệ (300 đời mỗi lối, 1.500 năm thế giới)

| Phản phệ / năm | Tà phái trong Thập Đại Cao Thủ (3 seed) | Đời Tà phái vào Top 10 | Tẩu Hỏa Nhập Ma TB / đời |
| :--- | :--- | :--- | ---: |
| Không có Ma công | 1% | 9% | 0,1 |
| 0% | 28% | 43% | 0,1 |
| 2% | 18% | 32% | 1,1 |
| **3%** | **10% - 13%** | **23% - 27%** | **1,6** |
| 5% | 6% - 9% | 16% - 19% | 2,2 |
| 10% | 2% | 7% | 3,8 |

Chọn 3%: tỷ lệ Tà phái trên bảng gần tỷ lệ NPC Tà phái (20%) nhưng thấp hơn, giữ Chính phái là dòng chính.

### 18.4. Kết quả (2.000 đời, thế giới 3.000 năm, seed chính)

| Chỉ số | Vòng 15 | Vòng 16 |
| :--- | :--- | :--- |
| Ngưỡng Top 10 Chiến lực (TV) | 357 | 361 |
| Thành phần Thập Đại Cao Thủ | Chính 57%, chuyên tu 30%, Lãng khách 12%, Tà 0% | Chính 54%, chuyên tu 24%, **Tà 13%**, Lãng khách 9% |
| Tà phái vào Top 10 / được mời Hoa Sơn ≥ 1 lần | 0% / 0% | **26% / 20%** |
| Tà phái thắng Hoa Sơn ≥ 1 lần | 0% | 3% |
| Tà phái: Chiến lực 60 tuổi (TV) | 327 | 324 |
| Tà phái: tuổi mất TV (P10 / P90), sống tới 80 | 81 (69 / 81), 71% | **73 (63 / 83), 14%** |
| Tà phái: Tẩu hỏa nhập ma (số đời có), chết vì Tẩu hỏa | 10%, 0% | 80%, 12% |
| Lãng khách vào Top 10 | 28% | 20% |

Mục 1 - 4 của KET_QUA.md không đổi ngoài nhiễu ngẫu nhiên.

### 18.5. Nhận xét

* ✅ Tà phái có chỗ trên Phong Vân Bảng (13% Thập Đại Cao Thủ, 1/5 đời Tà phái nhận Anh Hùng Thiếp), nhờ đặc quyền riêng chứ không phải nhờ nới luật chung.
* ✅ Cái giá đúng tinh thần Kim Dung: Tà phái sống ngắn hơn khoảng 8 năm, 12% chết vì Tẩu hỏa nhập ma (Âu Dương Phong hóa điên, Đông Phương Bất Bại). Vẫn có 70% đời Tà phái sống tới 70 tuổi (mốc của kết cục #14), dù một phần trong số đó sau này chết vì Tẩu hỏa chứ không mất tự nhiên.
* 🟡 Người chơi Tà phái tối ưu sẽ **tán Ma công lúc về già** để dừng phản phệ (Chiến lực lúc đó đã giảm theo tuổi). Lối chơi mẫu chưa làm điều này, nên tuổi thọ Tà phái ở trên là cận dưới. Nên thêm vào kịch bản một sự kiện "Phế bỏ ma công, quy y" để người chơi có lựa chọn này một cách có chủ đích.
* 🟡 Lãng khách vào Top 10 giảm 28% → 20% vì bảng là tương đối: Tà phái chiếm chỗ của những người ở sát ngưỡng.
* 🟡 Ma công tính như SSS về Uy lực nên Tà phái nào có thêm kỳ ngộ SSS cũng không mạnh hơn nữa (đã ở trần tier). Đây là chủ ý: kỳ ngộ SSS là con đường của Chính phái, Ma công là con đường của Tà phái.

## 19. Vòng cân bằng 17 (lối chơi mẫu luyện Khinh công và mua binh khí)

Kết quả ở [KET_QUA.md](KET_QUA.md); vòng 16 lưu ở [KET_QUA_vong16.md](KET_QUA_vong16.md).
Bảng vòng đời có thêm cột "Khinh công (TV)" và các dòng "Mua Lợi khí / Danh khí ở Hắc Thị".

### 19.1. Phát hiện 1: tier của môn Khinh công không có giá trị

Chiến lực (+5 / cấp), Giảm trừ (+2% / cấp), Roll ra đòn trước và Roll Thân Pháp đều chỉ dùng **Cấp** Khinh công (HS01 II.5, HS06 I.4, I.5).
Môn Nhập môn (Tier factor 1) lên cấp rẻ gấp 3 lần môn Trấn phái và 5 lần môn SSS, nên theo luật cũ người chơi hợp lý luôn luyện Kim Nhạn Công lên cấp 10 và bỏ qua Lăng Ba Vi Bộ.
Mô phỏng chính sách "chọn môn rẻ nhất để vượt cấp hiện tại": **100%** đời Chính phái dùng khinh công Nhập môn đến cuối đời, Khinh công cấp 10 từ trước 40 tuổi ở mọi lối chơi trong môn phái.

Sửa (HS02 II.1, HS01 II.5): **trần cấp theo tier**: Nhập môn 4, Thượng thừa 6, Trấn phái 8, SSS 10.
Sau khi sửa, môn Khinh công đang dùng lúc cuối đời của Chính phái: Trấn phái 55%, Nhập môn 26%, Thượng thừa 18%, SSS 1%.

### 19.2. Phát hiện 2: GDD chưa có giá binh khí

HS06 II.2 chỉ ghi Hắc Thị bán "Thần binh" trong khoảng giá chung 500 - 10.000 lạng; HS02 IV không nói binh khí lấy ở đâu.
Đề xuất đưa vào hồ sơ (HS06 II.2, HS02 IV):

| Hạng mục | Giá trị | Lý do |
| :--- | :--- | :--- |
| Phiên Hắc Thị | 5 năm 1 lần, 3 món, mỗi món 1/3 là binh khí (khoảng 70% phiên có binh khí), tốn 1 AP | Giữ nguyên HS06, chỉ thêm tỷ lệ |
| Lợi khí (+30, +6 Chiến lực) | 80% số binh khí lên sàn, giá sàn 2.000 lạng | Rẻ hơn mua núi lập phái; mua được khoảng 40 - 50 tuổi |
| Danh khí (+60, +12 Chiến lực) | 20%, giá sàn 6.000 lạng | Tiêu được khoản dư của tuổi 55+ |
| Giá chốt | Giá sàn × 1,0 - 1,5 | NPC tranh giá |
| Thần binh (+100) | Không bán; chỉ qua Kỳ Thư Xuất Thế hoặc kỳ ngộ SSS | Đồ Long Đao, Ỷ Thiên Kiếm là độc nhất |

### 19.3. Phát hiện 3: mua binh khí khi còn ít tiền là án tử

Chính sách thử đầu tiên (mua khi còn dư 2.000 lạng tiền mặt) đẩy gia sản xuống dưới 5.000, khiến lối chơi mẫu quay lại săn truy nã để bù tiền:

| Chính phái | Không mua | Mua khi dư 2.000 tiền mặt | Mua khi gia sản sau mua ≥ 5.000 |
| :--- | ---: | ---: | ---: |
| Tử trận Hiệp 3 | 6% | **13%** | 5% |
| Tuổi mất P10 | 77 | 53 | 70 |
| Sống tới 80 | 85% | 70% | 76% |

Lối chơi mẫu giữ chính sách thứ 3; HS06 II.2 ghi thêm cảnh báo này cho người viết hướng dẫn và AI NPC.
Thương nhân mẫu không mua binh khí vì binh khí không giúp gì cho nghề buôn (Giao chiến nhanh chống tống tiền dùng Võ Lực, không có Thần binh); thử cho mua thì kết cục #8 giảm 10% → 4%.

### 19.4. Kết quả (2.000 đời, thế giới 3.000 năm, seed chính)

| Chỉ số | Vòng 16 | Vòng 17 |
| :--- | :--- | :--- |
| Khinh công TV lúc 30 / 60 / 80 tuổi (Chính phái) | 0 / 0 / 0 | 4 / 4 / 8 |
| Khinh công TV lúc 60 tuổi (chuyên tu / Tà / Lãng khách / Thương nhân) | 0 | 8 / 4 / 4 / 4 |
| Mua Lợi khí / Danh khí (Chính phái) | - | 85% (51 tuổi) / 26% (68 tuổi) |
| Mua Lợi khí / Danh khí (Tà phái) | - | 91% (43 tuổi) / 34% (59 tuổi) |
| Chi cho binh khí cả đời (TB, Chính / Tà / Lãng khách / chuyên tu) | - | 3.970 / 4.802 / 3.721 / 2.019 lạng |
| Tiền TV lúc 70 tuổi (Chính phái) | 16.580 | 10.020 |
| Chiến lực TV lúc 60 tuổi (Chính / Tà / Lãng khách / chuyên tu) | 309 / 324 / 307 / 353 | 321 / 362 / 319 / 393 |
| Ngưỡng Top 10 Chiến lực (TV) | 361 | **393** |
| Tuổi Thập Đại Cao Thủ (TV, P10 - P90) | 53 (47 - 59) | 56 (51 - 62) |
| Thành phần Thập Đại Cao Thủ | Chính 54%, chuyên tu 24%, Tà 13%, Lãng khách 9% | Chính 55%, chuyên tu 27%, Tà 14%, **Lãng khách 4%** |
| Vào Top 10 (Chính / Tà / Lãng khách / chuyên tu) | 42% / 26% / 20% / 92% | 41% / 30% / **7%** / 84% |
| Kết cục #1 mới (mọi lối chơi) | 0 - 1% | 0% |
| Kết cục #8 (Thương nhân) | 10% | 11% |
| Tử trận Hiệp 3 (Chính phái) | 6% | 5% |

Mục 1, 3, 4 của KET_QUA.md không đổi ngoài nhiễu (Tam Hiệp và hiệu chuẩn Chiến lực đã có Khinh công, Thần binh từ vòng 12).

### 19.5. Nhận xét

* ✅ Khinh công giờ có lựa chọn thật: môn Nhập môn rẻ để lên nhanh 4 cấp lúc trẻ, môn Trấn phái / SSS là mục tiêu dài hạn khi võ học chính đã gần max.
* ✅ Hắc Thị là kênh đốt tiền hiệu quả cho tuổi trung niên (Chính phái giảm khoảng 6.500 lạng lúc 70 tuổi) mà không làm ai mắc nợ, nếu người chơi không mua khi đang khát tiền.
* ✅ Ngưỡng Top 10 tăng 32 điểm nhưng là tăng đều (mọi người cùng có Khinh công, binh khí), thứ tự lối chơi giữ nguyên trừ Lãng khách. Chiến lực tối đa thực tế khoảng 410 (SSS 10/10, Cảnh giới 10, Căn cốt 60, Khinh công 10, Danh khí), dưới trần lý thuyết 630 ở HS01 II.8.
* 🟠 **Lãng khách tụt khỏi Thập Đại Cao Thủ** (9% → 4% bảng, 20% → 7% đời vào Top 10). Lãng khách mẫu dồn khoảng 3/4 AP vào kiếm tiền, nên không còn AP luyện khinh công Trấn phái sau khi lên cấp 4, trong khi người trong môn phái (đặc biệt chuyên tu) có thêm 20 Chiến lực từ khinh công cấp 8. Nguyên nhân gốc là lối chơi mẫu (Lãng khách là lính đánh thuê), không phải luật; nhưng nếu muốn hình mẫu Lệnh Hồ Xung / Dương Quá có chỗ trên bảng, cần một lối chơi "Lãng khách tu luyện" hoặc nguồn khinh công cao cấp cho người không môn phái (kỳ ngộ khinh công riêng).
* 🟡 Thần binh +100 chưa có trong mô phỏng vì chỉ có 2 món trong cả thiên hạ; ảnh hưởng của nó lên Phong Vân Bảng là chuyện của 1 - 2 người, không đổi phân bố.

## 20. Vòng cân bằng 18 (lối chơi "ma đầu ẩn mình" qua ám sát thuê)

Kết quả ở [KET_QUA.md](KET_QUA.md); vòng 17 lưu ở [KET_QUA_vong17.md](KET_QUA_vong17.md).

### 20.1. Sửa mô phỏng: tách Hiệp nghĩa thật khỏi Thanh danh

Mục 10.5 đã ghi script dùng Thanh danh thay cho Hiệp nghĩa làm cổng nhận ám sát.
Giờ `Doi.hiep_nghia` là chỉ số riêng: việc [Ám] chỉ trừ Hiệp nghĩa, việc công khai đổi cả hai (khảo nghiệm Tinh Túc, sòng bạc -10/năm, săn tiền thưởng +40 theo HS06 II.1, trước đây script bỏ sót).
Cổng Hắc Phong Lâu (Hiệp nghĩa ≤ -100) và cổng Ma công (≤ -300) dùng Hiệp nghĩa thật.
Các lối chơi cũ không đổi ngoài nhiễu (Tà phái mẫu làm việc ác công khai từ 12 tuổi nên hai chỉ số gần như trùng nhau), trừ Thanh danh Thương nhân lúc 50 tuổi giờ là +210 nhờ săn tiền thưởng.

### 20.2. Chẩn đoán: vì sao không giấu được

Lối chơi mẫu mới **"Sát thủ ẩn danh"**: Lãng khách không môn phái, giết người đầu tiên lúc 16 tuổi (Hiệp nghĩa -100 [Ám], mở cửa Hắc Phong Lâu), mua Dịch Dung (1.500 lạng, HS06 V.4) ngay khi đủ tiền, chỉ nhận hợp đồng khi đã Dịch Dung, tối đa 1 hợp đồng/năm, không móc túi, không săn truy nã (Hiệp nghĩa +40 sẽ tự đóng cửa Hắc Phong Lâu).

Với luật cũ, mỗi hợp đồng sớm muộn đều thành một lần lộ:

* **Thua là lộ ngay.** Mục tiêu là NPC ngang sức nên khoảng 40% hợp đồng thất bại; HS06 II.1 cho thất bại bại lộ tức thời, kể cả khi đang Dịch Dung.
* **Thắng thì rò rỉ dần.** Xác suất bại lộ hằng năm là 2% × số việc chưa lộ, nên số lần lộ tăng theo bình phương thời gian. Mô hình riêng (chỉ cơ chế bại lộ, 20.000 lần): 1 hợp đồng/năm, đã giảm lộ ngay còn 5% nhờ Dịch Dung, lần lộ đầu rơi vào năm thứ 6 (trung vị) và 30 năm lộ trung bình 7,7 lần (Thanh danh -1.150).

Dịch Dung trong GDD đã hứa "giết người rồi đổ vấy tội cho kẻ mình giả dạng" (HS06 V.4) nhưng chưa có luật nào cho việc đó.

### 20.3. Thay đổi đưa vào hồ sơ

| Luật | Nội dung | Hồ sơ |
| :--- | :--- | :--- |
| Đổ tội | Việc [Ám] làm khi Dịch Dung, nếu bị chọn ở bước bại lộ hằng năm: 2/3 khả năng tội đổ cho kẻ bị giả dạng (việc đó rời danh sách, người chơi không mất Thanh danh), 1/3 lộ như thường | HS01 II.3, HS06 V.4 |
| Thất bại khi Dịch Dung | Hợp đồng ám sát thất bại lúc Dịch Dung không lộ ngay mà thành 1 việc [Ám] chưa lộ | HS06 II.1 |

Mô hình riêng, 1 hợp đồng/năm trong 20 năm, Thanh danh khởi đầu 0: tỷ lệ còn trên mức Đại ma đầu (≤ 2 lần lộ) theo tỷ lệ đổ tội: 0 → 16%, 1/2 → 50%, **2/3 → 66%**, 0,8 → 78%; với 2 hợp đồng/năm: 3% / 18% / 31% / 44%. Chọn 2/3: sát thủ cẩn thận thường giấu được, kẻ tham thì không.

### 20.4. Kết quả trong vòng đời (1.000 đời mỗi biến thể)

| Biến thể | Hợp đồng / đời | Bị lộ / đời | Thu từ ám sát | Thanh danh > -300 lúc 50 tuổi | Thanh danh TV lúc 50 / 70 |
| :--- | ---: | ---: | ---: | ---: | :--- |
| Sát thủ kỷ luật (ngừng khi Thanh danh ≤ -150), luật cũ | 1,2 | 1,8 | 621 | 69% | -150 / -150 |
| **Sát thủ kỷ luật, luật mới** | **5,5** | 2,0 | 2.843 | 71% | -150 / -150 |
| Sát thủ trọn đời (không ngừng), luật cũ | 19,3 | 13,7 | 9.878 | 7% | -1.000 / -1.000 |
| Sát thủ trọn đời, luật mới | 30,8 | 5,2 | 15.284 | 26% | -450 / -750 |
| Thử thêm: thời hiệu 10 năm cho việc làm khi Dịch Dung, trọn đời (không đưa vào) | khoảng 32 * | 4,0 | 16.526 | 31% | - |
| Thử thêm: chỉ nhận mục tiêu hạng Yếu như bảng truy nã, trọn đời (không đưa vào) | khoảng 32 * | 5,5 | 14.391 | 26% | - |

* Hai dòng thử thêm chạy trước khi script có bộ đếm hợp đồng; số đo được là 33,5 và 33,7 việc [Ám] mỗi đời, gồm cả án mạng đầu tiên lúc 16 tuổi.

Lối chơi mẫu trong KET_QUA.md là bản "kỷ luật, luật mới": sống tới 80 tuổi 58% (Tà phái 14%), tuổi mất TV 82, gần như không vào Top 10 (1%) vì không môn phái và không có tai tiếng để lấy Danh vọng.

### 20.5. Nhận xét

* ✅ Hai luật Dịch Dung giảm số lần lộ mỗi hợp đồng khoảng 3 lần và kéo dài sự nghiệp giấu mặt gấp khoảng 4,5 lần (1,2 → 5,5 hợp đồng trước khi phải dừng). Dịch Dung giờ là món đồ có giá trị rõ cho lối chơi Hắc đạo.
* ✅ Hai cách làm ác giờ khác nhau rõ: **Đại ma đầu lừng danh** (Tà phái: lộ nhiều, Thanh danh -1.000, nhưng tai tiếng cho Danh vọng và Anh Hùng Thiếp) và **sát thủ vô danh** (Thanh danh quanh -150, sống lâu, giàu vừa, không ai biết tên).
* 🟠 **Sát thủ giấu mặt trọn đời vẫn không khả thi** (26% còn trên mức Đại ma đầu lúc 50 tuổi, Thanh danh TV -750 lúc 70) và đây là **chủ ý**: nguyên tắc "giang hồ không có bức tường nào không lọt gió" ở HS01 II.3 nghĩa là việc ác tích lũy rồi sẽ lộ. Thời hiệu 10 năm chỉ thêm 5 điểm % nên không đưa vào. Lối ra hợp lệ cho người chơi: ngừng sớm, rửa tiếng bằng Kim Bồn Tẩy Thủ từ 40 tuổi (HS04 III), hoặc tạo vỏ bọc bằng việc thiện công khai (săn truy nã +40 Thanh danh mỗi lần, nhưng cũng +40 Hiệp nghĩa nên phải giết thêm để giữ cổng Hắc Phong Lâu).
* 🟡 Kết cục #10 Ngụy Quân Tử dùng cùng cơ chế nhưng đi qua sự kiện HS04 II.2 [B] và II.3 [C] chứ không qua ám sát thuê; chưa mô phỏng, vì cần thêm nguồn Thanh danh công khai cho Chính phái mẫu (hiện chỉ có săn truy nã).
