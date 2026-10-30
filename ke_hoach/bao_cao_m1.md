# Báo cáo M1: bot và đối chiếu thống kê

Sinh bằng `npm run bot` (1.000 kiếp) và `npm run mo-phong` (2.000 kiếp) trong `game/`.
Đối chiếu với `mo_phong/KET_QUA.md` mục 2, lối chơi Chính phái.

## 1. Bot ngẫu nhiên (`npm run bot`)

* 1.000 kiếp, 1.000 kiếp kết thúc, 0 lỗi, 0 vi phạm bất biến.
* Tuổi chết trung vị 40.
* Nguyên nhân: tử trận 59,0%, thọ chung 40,8%, nhảy vực (Phúc duyên < 30) 0,2%.
* Kết cục đạt: #15 chín lần, #17 hai lần, còn lại kết cục mặc định G09.
* Sự kiện chưa từng gặp: 1/71 (`thoi_noi_ngu_guc`, đã biết, REVIEW mục 9).

## 2. Lối chơi mẫu Chính phái (`npm run mo-phong`)

Bot bám `song_mot_doi`: AP đầu cho việc sư môn, AP cuối kiếm tiền theo thứ tự Python (Sai phái, Săn thưởng, Áp tiêu, Làm thuê), còn lại luyện công.
Sự kiện chọn lựa chọn đầu tiên không nguy hiểm, Tam Hiệp chọn Tiên Hạ Thủ.
Lần chạy 1 (kế vị `sinh_tu`) tuổi mất trung vị 52, tử trận 56,3%, trong đó kế vị giết 45,6% số kiếp.
Chủ dự án chọn đổi `dai_bien_co_ke_vi` lựa chọn A sang `ty_thi` (HS04 II.3: thua chỉ bị trục xuất, khớp `mo_phong.py`).
Bảng dưới là lần chạy 2, sau khi đổi.

| Chỉ số | `mo_phong.py` | TypeScript (2.000 kiếp) | Chênh |
| :--- | ---: | ---: | :--- |
| Tuổi mất trung vị | 84 | 81 | 3 tuổi, đạt (ngưỡng 5) |
| P10 / P90 | 70 / 84 | 37 / 87 | P10 thấp do tử trận sớm |
| Sống tới 50 / 70 / 80 | 96% / 89% / 76% | 73,8% / 68,0% / 53,5% | lớn |
| Tử trận | 5% (Hiệp 3) | 31,1% | lớn (> 5 điểm) |
| Cấp võ học cao nhất lúc 40 | tier 3, cấp 5 | tier 2, cấp 8 | khác |
| Cấp võ học cao nhất lúc 60 | tier 3, cấp 9 | tier 3, cấp 10 | nhỏ |

## 3. Nguyên nhân chênh còn lại

Tử trận theo nguồn (phần trăm số kiếp): săn tiền thưởng 28,4%, `an_oan_cu_keo_den` lựa chọn A 2,8%.

* **Săn tiền thưởng 28,4%:** HS06 II.1 ghi săn suốt đời vẫn khiến 20 - 70% số đời tử trận, nên mức này nằm trong khoảng GDD cảnh báo, còn Python chỉ 5% vì chính sách mẫu của nó dừng săn khi gia sản >= 5.000 lạng và dùng AI chọn hướng riêng. Chưa chứng minh được là khác biệt có chủ đích hay do bot chọn bước Tam Hiệp kém (phán định, chiêu). Việc cần làm tiếp: đo tỷ lệ thắng trận hạng Yếu của bot (GDD: 75 - 85%) bằng `npm run mo-phong` kèm thống kê trận.
* **Lúc 40 tuổi tier thấp hơn Python:** bot luyện môn đầu tiên còn mở thay vì ưu tiên môn tier cao. Hạn chế của bot.

## 4. Kết luận

Tuổi mất trung vị khớp trong 5 tuổi.
Tử trận vẫn lệch quá 5 điểm, ghi vào `REVIEW.md` "Còn mở (M1-19)", chưa kết luận lỗi port.
