# 03 - CỘT MỐC 2 "GIANG HỒ" (v0.5)

**Kết quả cuối cột mốc:** game có một thế giới sống ở Trung Nguyên.
200 NPC tự tu luyện, thăng chức, chết và được thay thế; Thiên Hạ Phong Vân Bảng xếp hạng họ cùng người chơi.
Người chơi đi được mọi lối chơi mẫu của `mo_phong.py`: Chính phái, Chính phái chuyên tu, Tà phái (có Ma công), Lãng khách, Thương nhân, Sát thủ ẩn danh.
Có việc [Ám] và bại lộ, Ngụy Quân Tử, Đại sự kiện, Hoa Sơn Luận Kiếm, Chưởng môn và Khai Tông Lập Phái, sản nghiệp, Hắc Thị, đủ đan dược và độc dược, Cửa hàng Luân Hồi.
Khoảng 150 sự kiện (đúng đề xuất MVP ở REVIEW mục 7).

**Chưa có** (để M3): vùng ngoài Trung Nguyên và di chuyển, môn phái ngoài 6 phái, Thập Đại Thần Công có cơ chế riêng, tình duyên, hôn nhân, con cái, truyền thừa, kết nghĩa, gia trang, kỳ trân dị thú, Thời Đại Hoàng Kim.

**Quy ước riêng cột mốc này:**

- Mỗi task tự làm phần giao diện của tính năng nó thêm (theo 01 mục 12 và quy trình mục 11 của `giao_dien/HE_THONG_THIET_KE.md`), trừ khi task ghi rõ là việc của task khác.
- Đổi định dạng trạng thái thì tăng `phien_ban` và viết chuyển đổi (01 mục 11). Bản lưu v0.1 phải mở được ở v0.5.
- Mọi sự kiện M1 có `"m2_noi_tiep": true` phải được nối tiếp xong trong cột mốc này (grep để kiểm). Task nào làm phần đó thì xóa cờ.

---

### [ ] M2-01 Mô hình NPC và khởi tạo thế giới

**Phụ thuộc:** M1 xong.
**Đọc:** HS05 I.1; HS02 V.1 (bản mệnh dùng cho AI); `mo_phong.py` hàm `the_gioi_npc`, hằng `NPC_THANH_PHAN`, `CHUC_TEN`, lớp `Doi` (trường); `mo_phong/BAO_CAO.md` mục 15 (thế giới 200 NPC); `05_LO_HONG_GDD.md` G11.
**Tạo:** `game/src/luat/the_gioi/npc.ts`, `khoi_tao.ts`; kiểu `NpcSong`, `TheGioi` trong `kieu.ts`; `du_lieu/npc/mau.json` (mẫu theo lối chơi), mở rộng `npc/ten.json` (danh hiệu, ngoại hiệu); `game/test/the_gioi_khoi_tao.test.ts`.

**Làm:**

1. `NpcSong`: dùng **cùng các trường chỉ số với `NhanVat`** (để mọi hàm luật dùng chung), cộng thêm: `ma`, `ban_menh` (5 loại HS05 I.1), `loi_choi` (5 loại của `NPC_THANH_PHAN`), `quan_he` (`cha`, `me`, `su_phu`, `con[]`, `de_tu[]`), `con_song`, `ngoai_hieu`, `da_dau_voi_nguoi_choi`.
   Tách `NhanVat` thành phần chung `ThucThe` + phần riêng người chơi; sửa mọi chữ ký hàm công thức sang `ThucThe`.
2. `the_gioi`: `npc: Record<MaNpc, NpcSong>`, `mon_phai: Record<MaMonPhai, TrangThaiMonPhai>` (Chưởng môn, Trưởng lão, Ngân khố, quy mô), `xep_hang` (M2-02), `rng` riêng (01 mục 6), `ban_tin` (tin năm nay).
3. `khoiTaoTheGioi(seed, dl)`: sinh 200 NPC theo tỷ lệ `NPC_THANH_PHAN`, phân vào 6 môn phái và Lãng khách; chạy khởi động 100 năm (như `khoi_dong=100` của Python) để tuổi và chức vị trải đều; mỗi môn phái có đủ Chưởng môn và Trưởng lão.
4. Chuyển `npc_tam` của M1 sang NPC sống: `vai` trong sự kiện ưu tiên gắn NPC sống phù hợp (đồng môn cho "Đại Sư Huynh", Trưởng lão cho "vị Trưởng lão"); không có thì sinh NPC mới và thêm vào thế giới.
5. Tăng `phien_ban`, chuyển đổi bản lưu v0.1: tạo thế giới từ `seed` của kiếp.

**Test bắt buộc:** đúng 200 NPC; tỷ lệ lối chơi đúng $\pm 2$ NPC; mỗi môn phái có 1 Chưởng môn; khởi tạo cùng seed ra cùng thế giới; khởi tạo dưới 1 giây (đo trong test, ngưỡng 2 giây để máy CI chậm vẫn qua).

**Xong khi:** test xanh; bản lưu v0.1 mẫu mở được.

---

### [ ] M2-02 NPC sống từng năm và bảng xếp hạng

**Phụ thuộc:** M2-01.
**Đọc:** HS05 I; HS06 I.5; HS07 I.2 (Tab 5); `mo_phong.py` `the_gioi_npc`, `song_mot_doi` (phần hành động trong năm); `mo_phong/BAO_CAO.md` mục 15, 17, 19.
**Tạo:** `the_gioi/nam_npc.ts`, `the_gioi/xep_hang.ts`, `the_gioi/ban_tin.ts`; `vong_nam.ts` bước 13; test `the_gioi_nam.test.ts`.

**Làm:**

1. `namNpc(npc, theGioi, rng, dl)`: NPC sống 1 năm bằng **chính hàm luật của người chơi** (luyện công, thăng bậc, kiếm tiền, Tẩu hỏa, lão hóa, chết khi hết thọ, tử trận theo tỷ lệ của lối chơi). Chính sách hành động bám `song_mot_doi` theo `loi_choi`.
2. NPC chết: ghi bản tin, thân nhân giữ ký ức (dùng cho cừu gia), sinh NPC trẻ thay thế (tuổi 12 - 16, cùng môn phái nếu môn phái thiếu người) để giữ 200.
3. Chưởng môn chết hoặc quá già: kế vị trong môn phái (Trưởng lão có Chiến lực cao nhất), ghi bản tin.
4. `xepHang(theGioi, nguoiChoi)`: Thập Đại Cao Thủ (Top 10 Chiến lực, người chơi tham gia xếp), Thập Đại Ác Nhân (Top 10 Chiến lực trong số Thanh danh $\le -300$), Thần Binh Phổ (ai đang giữ binh khí nào, xếp theo bậc binh khí). Lưu lịch sử số 1 theo năm (kết cục #1 cần "10 năm liên tục").
5. Bản tin năm: tối đa 5 dòng nổi bật (lên Chưởng môn, vào / rời Top 10, chết, Đại sự kiện), ưu tiên NPC người chơi quen.
6. Hiệu năng: 1 năm thế giới dưới 30 ms trên máy dev (đo trong test với ngưỡng 100 ms).

**Test bắt buộc:** chạy 3.000 năm thế giới (như `bao_cao_npc`): ngưỡng Chiến lực Top 10 trung vị trong khoảng $\pm 10\%$ của số mới nhất ở `mo_phong/BAO_CAO.md` (393 sau vòng 17), tuổi Thập Đại Cao Thủ chủ yếu 44 - 54; số NPC luôn 200.

**Xong khi:** test xanh; bảng so sánh ghi vào `ke_hoach/bao_cao_m2.md`.

---

### [ ] M2-03 Hảo cảm, giao tiếp, cừu gia rút gọn

**Phụ thuộc:** M2-01.
**Đọc:** HS05 I.1 (thang Hảo cảm), III.2; HS01 IV (Trò chuyện miễn phí); HS06 II.2 (tiệc rượu); HS02 V.3 (Thu kiếm +40 Hảo cảm); `05_LO_HONG_GDD.md` G26.
**Tạo:** `game/src/luat/nhan_mach.ts`; hiệu ứng DSL `hao_cam`, `cuu_gia`; Tab 3 đủ danh sách NPC đã quen; test `nhan_mach.test.ts`.

**Làm:**

1. `hao_cam` theo từng NPC, kẹp $[-100, 100]$; hàm `mucQuanHe(hc)` trả 5 mức HS05 I.1.
2. Hành động miễn phí *Trò chuyện* (1 NPC / lượt, G26); hành động *Mở tiệc rượu* (50 - 150 lạng, +15 Hảo cảm, HS06 II.2); *Tặng quà* (vật phẩm, G26).
3. Hành vi theo mức: NPC Huyết Hải Thâm Thù có xác suất mỗi năm tìm đến (sự kiện Tam Hiệp sinh tử, G26 tỷ lệ); NPC Chướng Mắt phá đám ở Hắc Thị (tăng giá, M2-13); Sinh Tử Chi Giao có thể chắn đao (M3-09 làm đủ).
4. Cừu gia rút gọn (HS05 III.2): người chơi giết NPC có tên → cha, sư phụ, con trai còn sống của NPC đó chuyển Hảo cảm $-100$ (Huyết Thù). Hình thức trả thù đủ ở M3-09; ở M2 chỉ có "tìm đến thách đấu" ở trên.
5. Tab 3: danh sách NPC đã gặp, nhóm theo mức quan hệ, mỗi dòng có tên (`.vk-lien-ket`), môn phái, mức, nút *Trò chuyện* nếu còn lượt.

**Test bắt buộc:** 5 mức đúng ranh giới; giết NPC có cha thì cha thành $-100$; Trò chuyện không vượt 2 việc miễn phí / năm.

**Xong khi:** test xanh; Tab 3 kiểm bằng mắt đạt.

---

### [ ] M2-04 Tà phái: Nhật Nguyệt Thần Giáo, Tinh Túc Phái, Ma công

**Phụ thuộc:** M2-01.
**Đọc:** HS02 I.2 (B Nhật Nguyệt, C Tinh Túc), II.2 (Ma công); HS03 IV.1 [C], IV.4; HS06 I.4, I.5 (Ma công tính như SSS); `mo_phong.py` `Doi.ma_cong`, `Doi.tier_chien`.
**Tạo:** `du_lieu/vo_hoc/nhat_nguyet.json`, `tinh_tuc.json`; `du_lieu/mon_phai/nhat_nguyet.json`, `tinh_tuc.json`; sự kiện khảo nghiệm "Đấu Cổ Sinh Tử" (HS03 IV.4) và lời mời của nhánh [C] HS03 IV.1; xử lý `dac_biet: "ma_cong"`.

**Làm:**

1. Dữ liệu võ học và môn phái như M1-01. Trấn phái Tà phái có `dac_biet: "ma_cong"`.
2. `tierChienDau(vh, nv)` (dùng cho Uy lực và Điểm Tier): Ma công trả 4 khi `hiep_nghia <= -300`, ngược lại trả tier gốc; Tier factor luyện **không đổi** (HS02 II.2).
3. Nối các nhánh M1 có cờ `muon_vao_ta_phai` sang khảo nghiệm Tà phái; xóa `m2_noi_tiep` tương ứng.
4. Huy hiệu phẩm cấp hiển thị bậc 4 khi Ma công đang phát huy (thiết kế mục 3).

**Test bắt buộc:** cùng nhân vật, Hiệp nghĩa $-299$ → Ma công tier 3; $-300$ → tier 4 trong sát thương và Chiến lực; Tiến độ luyện không đổi; vector `vo_gia` vẫn khớp.

**Xong khi:** test xanh; đi được trọn đường Tà phái từ 12 tuổi.

---

### [ ] M2-05 Xung khắc nội lực và Tẩu Hỏa Nhập Ma

**Phụ thuộc:** M2-04.
**Đọc:** HS02 II.2 (Xung Đột Nội Lực, Ma công phản phệ); HS06 I.4 ($P_{THNM}$, ngoại lệ Toàn Chân, Hàn Ngọc Sàng); `mo_phong.py` khối Vòng 6 và Vòng 16, hằng `THNM_*`, `MA_CONG_THNM`.
**Tạo:** `game/src/luat/tau_hoa.ts`; `vong_nam.ts` bước 6; test `tau_hoa.test.ts`.

**Làm:**

1. `pTauHoa(nv, dl)`: đúng công thức HS06 I.4; ngoại lệ Toàn Chân theo `dac_biet` của Tâm pháp chủ đạo; Hàn Ngọc Sàng theo cờ gia trang (M3 mới có vật, code đọc cờ ngay); kẹp $\ge 0\%$.
2. Ma công phản phệ 3% / năm độc lập (HS06 I.4).
3. Hậu quả: HP $-50\%$, Căn cốt $-5$ (`THNM_CAN_COT`, G18), Ám thương $+5$; chết nếu tuổi thọ mới $\le$ tuổi hiện tại (khớp `mo_phong.py`).
4. Cảnh báo trước: khi người chơi trang bị cặp nội công xung khắc, Modal xác nhận ghi rõ rủi ro (thiết kế 6.2: "xác nhận không hoàn tác").

**Test bắt buộc:** song tu Dương + Âm không Trung Hòa = 30%; thêm 2 môn Tà công = 40%; Tiên Thiên Công cấp 5 trừ 50% → 0%; Toàn Chân chủ đạo = 0%; Ma công 3% / năm (100.000 năm giả lập $\pm 0{,}3\%$).

**Xong khi:** test xanh.

---

### [ ] M2-06 Việc [Ám], bại lộ, Tai tiếng, móc túi, ám sát thuê, Dịch Dung

**Phụ thuộc:** M2-03.
**Đọc:** HS01 II.2 (Tai tiếng), II.3 (toàn bộ); HS06 II.1 (móc túi, ám sát thuê, truy sát); HS06 V.1 mục 4 (Dịch Dung); `mo_phong.py` `lam_am`, `ro_ri`, `bai_lo`, `viec_kiem_tien` (phần ám sát), khối Vòng 9, 11, 18.
**Tạo:** `game/src/luat/am.ts`; hiệu ứng `hiep_nghia` + `am`; `vong_nam.ts` bước 1, 7; hành động `moc_tui`, `am_sat_thue`; test `am.test.ts`.

**Làm:**

1. `ViecAm`: `{ gia_tri, loai: 'vat' | 'lon', nan_nhan, dich_dung, nam, mo_ta }`.
2. `lamViecAm(d, rng, dl, ...)`: chỉ Hiệp nghĩa đổi; bại lộ tức thời 20% (5% nếu Dịch Dung hoặc độc không dấu vết); không lộ thì thêm vào `viec_am_chua_lo`. Việc `vat` cùng loại trong năm gom vào một bản ghi tạm, cuối năm (bước 1) chốt thành 1 việc.
3. Bước 7: $P = 2\% \times$ số việc chưa lộ, tối đa 30%; chọn ngẫu nhiên 1 việc; nếu việc làm lúc Dịch Dung thì $2/3$ đổ tội cho kẻ bị giả dạng (việc rời danh sách, kẻ đó thành cừu gia của nạn nhân).
4. `baiLo(d, viec)`: Thanh danh $-1{,}5 \times$ giá trị; việc `lon` cộng Danh vọng theo Tai tiếng (HS01 II.2); nạn nhân và thân nhân còn sống nhận người chơi là cừu gia.
5. Móc túi (HS06 II.1): yêu cầu kỹ năng (cờ *Diệu Thủ Không Không* từ sự kiện, hoặc Cái Bang Ô Y), 20 - 80 lạng, Hiệp nghĩa $-15$ [Ám] `vat`, 20% đụng cao thủ mất 30% HP.
6. Ám sát thuê (Hắc Phong Lâu): điều kiện, thù lao, tối đa 2 hợp đồng / năm, mục tiêu là NPC sống có tên, Tam Hiệp sinh tử; thất bại hoặc bại lộ: Thanh danh $-150$, Tai tiếng, truy sát 3 năm (sự kiện Tam Hiệp mỗi năm, G26 tỷ lệ), Hắc Phong Lâu ngừng giao việc; ngoại lệ Dịch Dung. Điều kiện "Hiệp nghĩa $\le -100$" của HS06 II.1: dùng đúng giá trị mà `mo_phong.py` dùng (đọc `viec_kiem_tien`); nếu khác quy tắc đọc HS01 II.2 thì ghi `REVIEW.md` "Còn mở".
7. Đổi các sự kiện M1 có `m2_noi_tiep` liên quan (trộm vặt, Bẫy Sư Thúc, móc túi Bát Cơm Chó...) sang [Ám] thật.
8. Giao diện: Sheet Bát Tự hiện cả Hiệp nghĩa thật và Thanh danh, kèm 1 dòng "Có {n} việc chưa ai biết" (người chơi luôn thấy bản chất thật, HS01 II.2).

**Test bắt buộc:** bản sao các assert về [Ám] trong `kiem_tra()` của `mo_phong.py` (Dịch Dung: Thanh danh chỉ ∈ {0, -150}; 300 lần rò rỉ có tỷ lệ đổ tội 0,6 - 0,74); gom việc vặt; trần 30%; Tai tiếng.

**Xong khi:** test xanh.

---

### [ ] M2-07 Đại Vạch Trần và Kim Bồn Tẩy Thủ

**Phụ thuộc:** M2-06, M2-02.
**Đọc:** HS01 II.3 (Đại Vạch Trần); HS04 III.1; HS07 IV #10.
**Tạo:** bước 7 phần Đại Vạch Trần; sự kiện `kim_bon_tay_thu` (+ trận kẻ thù cũ); hành động "Tổ chức lễ Kim Bồn Tẩy Thủ" (40+); test.

**Làm:**

1. Mỗi năm: nếu `thanh_danh - hiep_nghia >= 400` và có NPC sống Ngộ tính $\ge 80$, Hảo cảm $\le -20$ với người chơi → 10% NPC đó vạch trần: Thanh danh = Hiệp nghĩa; ghi cờ `bi_vach_tran` (kết cục #10 đọc cờ này cùng điều kiện Chưởng môn).
2. Kim Bồn Tẩy Thủ: đưa Thanh danh âm về 0 (Hiệp nghĩa không đổi); đã giết > 5 NPC có tên thì kẻ thù cũ mạnh nhất còn sống đến (Tam Hiệp); thua theo HS04 III.1 (giết 1 người thân `[Ngẫu nhiên: 50 / 50]`, M2 chưa có gia đình thì thay bằng đệ tử / NPC thân nhất); chờ 5 năm mới làm lại.
3. Đặt cờ `da_kim_bon` (kết cục #5 đọc ở M3).

**Test bắt buộc:** điều kiện Đại Vạch Trần đủ / thiếu từng vế; tỷ lệ 10%; Kim Bồn không đổi Hiệp nghĩa.

**Xong khi:** test xanh.

---

### [ ] M2-08 Môn phái đầy đủ và kế vị

**Phụ thuộc:** M2-02.
**Đọc:** HS04 I.1, II.3; HS01 II.2 (Danh vọng chức vị); HS07 IV #16 (phản môn).
**Tạo / sửa:** `mon_phai.ts`, sự kiện thăng cấp và kế vị dùng NPC sống; test.

**Làm:**

1. Thử thách thăng cấp dùng NPC đồng môn thật (Khảo hạch Ngoại môn: đệ tử cùng khóa; Chiến thắng Đại sư huynh: Chân truyền mạnh nhất; Giải cứu nguy nan: thất bại thì 1 NPC đồng môn có tên tử trận và trợ cấp năm đó bằng 0).
2. Kế vị Chưởng môn HS04 II.3 kích hoạt khi Chưởng môn NPC chết / già và người chơi đủ điều kiện Bậc 5; Đại Sư Huynh là NPC thật, thua thì thành Kẻ Thù Truyền Kiếp; nhánh [C] là [Ám] thật.
3. Chưởng môn: đổi tôn chỉ Chính ↔ Tà (đổi `phe` môn phái, Thanh danh đệ tử...: hệ quả chưa có trong GDD → G27); Danh vọng chức vị cộng / mất đúng lúc.
4. Phản môn: rời phái để vào phái khác; đếm số lần phản môn (kết cục #16 cần ≥ 3); môn phái cũ ghi người chơi là phản đồ (Hảo cảm đồng môn giảm, G26).
5. Người bị trục xuất có thể quay về đoạt lại sư môn: sự kiện thách đấu Chưởng môn đương nhiệm (nội dung ở M2-17).

**Test bắt buộc:** Danh vọng hiển thị +150 khi lên Trưởng lão, mất khi bị trục xuất; đếm phản môn; kế vị chỉ mở khi có điều kiện.

**Xong khi:** test xanh.

---

### [ ] M2-09 Đại sự kiện 1 - 4

**Phụ thuộc:** M2-02, M2-06.
**Đọc:** HS01 V (toàn bộ bảng); HS06 II.2 mục 5 (giá theo đại sự kiện), II.5 (Đầu cơ); HS07 IV #3, #4, #12, #16; REVIEW mục 8 (Võ Lâm Minh Chủ cần điều kiện, Kỳ Thư Xuất Thế chưa nói môn SSS); `05_LO_HONG_GDD.md` G23, G27.
**Tạo:** `game/src/luat/the_gioi/dai_su_kien.ts`; `du_lieu/dai_su_kien/ky_thu_xuat_the.json`, `ma_giao_dong_chinh.json`, `son_ha_pha_toai.json`, `huyet_an_me_vu.json`; sự kiện từng hồi trong `du_lieu/su_kien/dai_su_kien/`; test.

**Làm:**

1. Lịch: ở tuổi 18, 30, 42, 54 của người chơi bốc 1 trong 4, không trùng sự kiện ngay trước; Chưởng môn có lệnh "Phát động chiến tranh" chọn sự kiện cho mốc kế tiếp (HS01 V).
2. Mỗi Đại sự kiện 3 năm, 3 hồi; mỗi hồi là ≥ 1 sự kiện `loai: "dai_su_kien"` đưa vào hàng đợi năm đó (01 mục 5.6 bước 2), có biến thể theo phe người chơi (Chính / Tà / Lãng khách / Thương nhân).
3. Điểm đóng góp của người chơi trong sự kiện (cờ số) quyết định phần thưởng Năm 3 (G27).
4. Kết quả thế giới: phe thắng, Tà phái bị phong ấn 20 năm, thuế máu, bảo vật về tay ai (NPC hoặc người chơi); NPC trong thế giới cũng tham gia (tử trận, lập công) theo xác suất (G27).
5. Giá thị trường: bảng hệ số giá trong `the_gioi` khi sự kiện đang chạy (HS06 II.2 mục 5); mọi hàm mua bán đọc hệ số này.
6. Đặt cờ cho kết cục: giữ Tương Dương, đầu hàng phong vương, mở cổng thành, Giáo chủ dẫn quân đánh bại Lục đại phái.

**Test bắt buộc:** 4 mốc tuổi, không lặp liền; Chưởng môn phát động chọn đúng; hệ số giá trong 3 năm Sơn Hà Phá Toái; mỗi sự kiện đủ 3 hồi và mọi nhánh có kết.

**Xong khi:** test xanh; chơi qua mỗi Đại sự kiện ít nhất 1 lần bằng bot (`npm run bot` in số lần gặp từng sự kiện).

---

### [ ] M2-10 Hoa Sơn Luận Kiếm

**Phụ thuộc:** M2-02, M2-09.
**Đọc:** HS01 V (dòng 5); HS07 IV #1; `mo_phong.py` `hoa_son`; `mo_phong/BAO_CAO.md` mục 11, 13, 16, 17; `05_LO_HONG_GDD.md` G28.
**Tạo:** `the_gioi/hoa_son.ts`; sự kiện mời, khán giả, hộ vệ, phá đám, các vòng đấu; test.

**Làm:**

1. Mỗi năm thế giới tận cùng 0; trùng năm Đại sự kiện ngẫu nhiên thì lùi sang năm sau khi sự kiện kia kết thúc.
2. Anh Hùng Thiếp: Thập Đại Cao Thủ VÀ Danh vọng hiển thị $\ge 400$ (HS01 V).
3. Người chơi chưa đủ tư cách: chọn Khán giả / Hộ vệ sư môn / Kẻ phá đám (thách 1 người trong Top 10, thắng thì giành suất).
4. Thể thức: bám `hoa_son` của Python (G28); người chơi đấu 3 trận Tam Hiệp liên tiếp, HP / Nội tức chỉ hồi một phần giữa các trận (G28).
5. Thắng: danh hiệu Ngũ Tuyệt (G28 cách gán), cờ `thang_hoa_son` + số lần, Danh vọng.
6. NPC cũng thi khi người chơi không tham gia; kết quả lên bản tin.

**Test bắt buộc:** đúng năm, lùi năm; điều kiện mời; người thắng được ghi nhận; tỷ lệ Chính phái mẫu được mời khớp `BAO_CAO.md` (đo ở M2-18).

**Xong khi:** test xanh.

---

### [ ] M2-11 Chưởng môn, Ngân khố, Khai Tông Lập Phái

**Phụ thuộc:** M2-08.
**Đọc:** HS06 II.1 (Lợi tức, Bổng lộc, biển thủ), II.2 mục 3 - 4 (quy mô, bảo trì); HS04 I.2 mục 4; HS07 IV #2 (chuẩn bị dữ liệu cho M3).
**Tạo:** `game/src/luat/chuong_mon.ts`; Tab 4 phần Chưởng môn; hành động *Khai Tông Lập Phái*; test.

**Làm:**

1. Ngân khố môn phái tách khỏi túi riêng (HS01 II.8); lợi tức, bảo trì, bổng lộc tự động ở bước 3 - 4 vòng năm.
2. Thiếu bảo trì: mỗi năm 1 Trưởng lão bỏ đi, Danh vọng Chưởng môn $-20$; 3 năm liền thì tụt quy mô.
3. Quy mô Nhỏ / Vừa / Lớn theo điều kiện HS06 II.2 mục 4 (đếm Trưởng lão là NPC sống).
4. Biển thủ: rút từ Ngân khố là [Ám] ($-50$ Hiệp nghĩa mỗi 1.000 lạng).
5. Chi Ngân khố công khai: tuyển Trưởng lão (NPC Lãng khách đủ Chiến lực, G27 chi phí), chiến tranh môn phái (nối M2-09).
6. Khai Tông Lập Phái: tuổi 30+, Danh vọng $\ge 500$, 5.000 lạng từ túi riêng, có võ Thượng thừa; người chơi gõ tên môn phái (kiểm độ dài, không ký tự lạ); tạo `TrangThaiMonPhai` mới quy mô Nhỏ, người chơi Bậc 5; NPC Lãng khách có thể gia nhập.
7. Tab 4 khi là Chưởng môn: Ngân khố, quy mô và điều kiện lên quy mô kế, danh sách Trưởng lão, nút các quyết định.

**Test bắt buộc:** Ngân khố không tính vào Gia sản; bổng lộc lấy phần còn lại khi Ngân khố thiếu; tụt quy mô sau 3 năm thiếu; Khai tông trừ đúng 5.000 lạng.

**Xong khi:** test xanh.

---

### [ ] M2-12 Sản nghiệp và Thương nghiệp

**Phụ thuộc:** M2-09 (Đầu cơ đọc Đại sự kiện).
**Đọc:** HS06 II.5 (toàn bộ); HS04 I.2 mục 5; HS07 IV #8; `mo_phong.py` `dau_tu`, `mua_san_nghiep`, `kinh_doanh`, khối Vòng 4.
**Tạo:** `game/src/luat/san_nghiep.ts`; hành động mua / quản lý / bán; Tab 4 phần Gia Trang (từ 16 tuổi, HS07 I.2) hiện sản nghiệp và Hộ viện; test.

**Làm:**

1. 5 loại sản nghiệp đúng bảng HS06 II.5: vốn, lợi tức, rủi ro, `[Ngẫu nhiên]` và `[Giao chiến nhanh]` tương ứng.
2. Quy tắc chung: 1 AP quản lý mỗi loại mỗi năm (không bỏ AP thì không sinh lợi); bán lại 1 AP thu 80%; không mua khi còn Nợ; tiền mặt $\ge 10.000$ thì 10% / năm bị tống tiền.
3. Hộ viện 1.000 lạng / năm: đẩy lui tống tiền, miễn bảo kê sòng bạc.
4. Diêm dẫn: Danh vọng $\ge 400$ hoặc hối lộ 1.000 lạng [Ám] $-20$.
5. Đầu cơ: tích trữ 1 mặt hàng, bán vào năm đầu Đại sự kiện kế tiếp với hệ số đúng / sai.
6. `giaSan(nv)` = Ngân lượng + giá vốn sản nghiệp (HS06 II.5).

**Test bắt buộc:** bản sao assert `gia_san` trong `kiem_tra()` của Python; không bỏ AP thì không có lợi tức; Sơn Hà Phá Toái cắt muối 3 năm; đầu cơ đúng thu $\times 3$, sai thu 60%.

**Xong khi:** test xanh.

---

### [ ] M2-13 Hắc Thị Đấu Giá Hội và binh khí

**Phụ thuộc:** M2-12.
**Đọc:** HS06 II.2 mục 2; HS02 IV (thang Thần binh, nguồn binh khí); HS06 V.1 mục 4 (Mặt nạ Dịch Dung 1.500); `mo_phong.py` khối Vòng 17 (`HAC_THI_*`); `05_LO_HONG_GDD.md` G29.
**Tạo:** `game/src/luat/hac_thi.ts`; `du_lieu/vat_pham/binh_khi.json`; Modal đấu giá; test.

**Làm:**

1. Mỗi 5 năm mở phiên (M2 coi như người chơi đến được; M3-01 thêm yêu cầu vùng Giang Nam / Tây Vực); hành động "Đi đấu giá" 1 AP.
2. 3 món ngẫu nhiên: đan dược ngàn năm, tàn quyển võ học, binh khí (mỗi món 1/3 là binh khí; Lợi khí 80%, Danh khí 20%; Thần binh không bao giờ lên sàn).
3. Đấu giá (G29): mỗi món hiện giá sàn; NPC Phú thương / Thế gia tranh giá cho ra giá chốt $= $ sàn $\times U(1; 1{,}5)$; người chơi chọn *Trả giá chốt*, *Bỏ qua*, hoặc *Đợi người mua xong rồi chặn đường cướp* ([Ám] lớn, Tam Hiệp sinh tử với người mua, bại lộ theo M2-06). NPC Chướng Mắt có mặt thì giá chốt cộng thêm (G29).
4. Binh khí: ô `binh_khi`, Sát thương Thần binh vào DMG và Chiến lực (HS06 I.4, I.5); Thần Binh Phổ (M2-02) đọc dữ liệu này.
5. Cảnh báo dòng tiền (HS06 II.2 mục 2): Modal mua binh khí khi Gia sản < 5.000 ghi 1 dòng nhắc rủi ro (không chặn).

**Test bắt buộc:** chu kỳ 5 năm; tỷ lệ món là binh khí ≈ 1/3; có ít nhất 1 binh khí ở ≈ 70% phiên (10.000 phiên giả lập $\pm 2\%$); giá chốt trong $[1{,}0; 1{,}5] \times$ sàn.

**Xong khi:** test xanh.

---

### [ ] M2-14 Tab 5 Thiên Hạ Phong Vân Bảng

**Phụ thuộc:** M2-02.
**Đọc:** HS07 I.2 mục 5; HS06 I.5 (tỷ lệ thắng ước tính); thiết kế mục 7 (`.vk-bang`).
**Tạo:** `TabPhongVan.tsx`; `xem.ts` `xemPhongVan`; hành động *Thách đấu* (G26 chi phí AP).

**Làm:**

1. Mở khóa Tab 5 (bỏ `aria-disabled`).
2. 3 bảng chuyển qua lại: Thập Đại Cao Thủ, Thập Đại Ác Nhân, Thần Binh Phổ; dòng người chơi có `aria-current="true"` nếu có mặt.
3. Mỗi dòng: tên (`.vk-lien-ket`), môn phái, Chiến lực (chính xác nếu đã từng giao đấu hoặc Ngộ tính $\ge 70$, ngược lại khoảng $\pm 30$), tỷ lệ thắng ước tính dạng nhãn độ khó (công thức logistic HS06 I.5, kẹp 5 - 95%).
4. Bản tin năm dưới cùng.
5. Nút *Thách đấu* mở Tam Hiệp `ty_thi` với NPC đó.

**Xong khi:** kiểm bằng mắt đạt; khoảng $\pm 30$ không lộ số thật qua `xem.ts` (test).

---

### [ ] M2-15 Đan dược, độc dược, hiệu ứng cứu mạng

**Phụ thuộc:** M1-13, M2-06.
**Đọc:** HS06 III (toàn bộ), IV (toàn bộ); HS02 V.3 (lật kèo bằng ám khí / độc), V.4; HS01 II.4 (Kháng Độc, 4 cấp độc); `05_LO_HONG_GDD.md` G30.
**Tạo:** `du_lieu/vat_pham/doc_duoc.json`; `game/src/luat/doc.ts`; xử lý `dac_biet` của từng đan dược; test.

**Làm:**

1. Mọi đan dược HS06 III đúng công dụng: *Thiên Vương Bảo Tâm Đan* là hiệu ứng cứu mạng thứ 3 trong thứ tự HS02 V.4 (có thể tắt trong Tab 2); *Đại Hoàn Đan* xóa Ám thương; *Tục Mệnh Bát Hoàn* +10 tuổi thọ; *Hắc Ngọc Đoạn Tục Cao* chữa *[Tàn Phế]*; Kháng Thuốc đúng HS06 III.
2. Độc: tẩm binh khí / ám khí trước trận (Tab 2), phát tác trong Tam Hiệp theo bảng HS06 IV; hạ độc lén trong giao tiếp `[Roll: Ngộ tính vs Ngộ tính địch HOẶC Độc thuật vs Ngộ tính địch]`, thành công là [Ám], thất bại lộ ngay, Hảo cảm $-60$ và vào giao chiến.
3. Kháng Độc giảm sát thương và thời gian hiệu lực; *[Bách Độc Bất Xâm]* miễn độc cấp Trung trở xuống.
4. Hiệp 3 "Tung Ám Khí / Độc Dược" khi Thất thế (HS02 V.3), trừ mạnh Hiệp nghĩa.
5. Y thuật / Độc thuật chế thuốc (HS01 II.5): G30.
6. Biến động giá theo Đại sự kiện áp cho thuốc và độc.

**Test bắt buộc:** mỗi đan dược, mỗi độc dược 1 test hiệu ứng; *Thiên Vương Bảo Tâm Đan* chỉ kích hoạt khi không có hiệu ứng ưu tiên cao hơn và chỉ 1 lần / trận; Thập Hương khóa Nội tức đến hết trận.

**Xong khi:** test xanh.

---

### [ ] M2-16 Kết cục mở rộng và Cửa hàng Luân Hồi

**Phụ thuộc:** M2-07, M2-09, M2-10, M2-12.
**Đọc:** HS07 III (gói 1 - 4), IV (#1, #3, #4, #7, #8, #10, #12, #16); HS05 IV.2 trường hợp 2; `05_LO_HONG_GDD.md` G24.
**Tạo / sửa:** `ket_cuc.ts` (bật thêm kết cục), `luan_hoi.ts`; `du_lieu/luan_hoi.json`; màn **Đài Vọng Hương** (toàn khung) dùng `.vk-uu-dai`; test.

**Làm:**

1. Bật hàm kiểm tra cho #1, #3, #4, #7, #8, #10, #12, #16 theo đúng điều kiện HS07 IV (đọc cờ và thống kê đã ghi ở các task trước). Kết cục cần dữ liệu M3 (ví dụ #7 cần *Mãng Cổ Chu Thiềm*) thì xét với phần đã có và ghi chú.
2. Thống kê đời cần thêm (nếu chưa có): số trận Tam Hiệp thua từ 25 tuổi, số năm liên tục đứng số 1, số NPC cứu sống bằng thuốc, số cao thủ khống chế, số môn phái đã phản.
3. Đài Vọng Hương mở sau Văn bia khi tuyệt tự (M2: mọi kiếp tuyệt tự) hoặc khi chọn "Khởi tạo thế giới mới".
4. Gói 1 - 4 đúng HS07 III. Gói 3 "chắc chắn gặp ít nhất 2 Kỳ ngộ cấp S trong 15 năm đầu": cơ chế bảo đảm (đếm kỳ ngộ S đã gặp, đến cuối 13 và 15 tuổi chưa đủ thì ép quay kỳ ngộ S đủ điều kiện). Gói 4 chỉ cho Thiên phú Đỏ của kiếp vừa qua.
5. Meta (`vkgh.meta`): Điểm Luân Hồi, gói đã mua cho kiếp kế, danh sách kết cục đã đạt (thư viện kết cục hiện mờ những cái chưa đạt).

**Test bắt buộc:** mỗi kết cục bật 1 test đạt + 1 test thiếu đúng 1 điều kiện; mua gói trừ điểm; gói áp đúng ở `tao_kiep`; gói 3 đảm bảo 2 kỳ ngộ S qua 1.000 kiếp.

**Xong khi:** test xanh; luồng chết → Văn bia → Đài Vọng Hương → đầu thai chạy trên giao diện.

---

### [ ] M2-17 Nội dung lên 150 sự kiện

**Phụ thuộc:** các task M2 có sự kiện liên quan.
**Đọc:** Phụ lục A ở `02_COT_MOC_1.md`; HS02 I.2; HS04 I.2; HS05 I, III.2.
**Tạo:** sự kiện mới trong `du_lieu/su_kien/`.

**Làm:** viết thêm cho tới khi **tổng ≥ 150** sự kiện, đạt các hạn mức tối thiểu:

| Nhóm | Tối thiểu |
| :--- | :--- |
| 0 - 15 tuổi (tổng) | 60 |
| 16 - 80 tuổi (tổng) | 90 |
| Mỗi môn phái trong 6 phái | 6 sự kiện riêng (nhập môn, đời sống môn phái, thăng cấp) |
| Tà phái / Ma Tâm (Hiệp nghĩa ≤ -300) | 8 |
| Cơ hội làm việc [Ám] | 10 (mỗi cái có lựa chọn công khai thay thế) |
| Lãng khách | 10 |
| Thương nhân | 8 |
| Chưởng môn / Khai tông | 8 |
| NPC theo mức quan hệ (bằng hữu, cừu thù) | 10 |
| Lão niên 51+ | 12 |

Gói theo nhóm, mỗi nhóm một commit `content(M2-17): ...`.

**Xong khi:** kiểm tra dữ liệu xanh; bot 2.000 kiếp gặp mọi sự kiện ít nhất 1 lần (sự kiện "chết" phải sửa điều kiện hoặc bỏ).

---

### [ ] M2-18 Đối chiếu cân bằng với `mo_phong`

**Phụ thuộc:** M2-01 đến M2-16.
**Đọc:** `mo_phong/BAO_CAO.md` mục vòng mới nhất và mục 15 - 20; `mo_phong.py` `LOI_CHOI`, `song_mot_doi`.
**Tạo / sửa:** `game/cong_cu/mo_phong.ts` (6 lối chơi mẫu); `ke_hoach/bao_cao_m2.md`.

**Làm:**

1. Port 6 chính sách lối chơi mẫu của `mo_phong.py` thành bot.
2. Chạy 2.000 đời mỗi lối chơi trong thế giới 200 NPC; in cùng các bảng mà `bao_cao_vong_doi` và `bao_cao_npc` in ra.
3. So từng số với `mo_phong/BAO_CAO.md`. Lệch > 3 điểm % hoặc > 5 năm: tìm lỗi port, sửa. Lệch có chủ đích (do sự kiện kịch bản): ghi `REVIEW.md` "Còn mở" kèm số, **không tự đổi số GDD**.
4. Đặc biệt kiểm: tỷ lệ Thương nhân đạt #8 (khoảng 8 - 13%), Tà phái vào Top 10 (khoảng 1/4 đời), tử trận Chính phái (khoảng 10%), sát thủ ẩn danh làm được khoảng 5 hợp đồng.

**Xong khi:** `bao_cao_m2.md` có bảng so sánh đủ; không còn lệch chưa giải thích.

---

### [ ] M2-19 Phát hành v0.5 "Giang Hồ"

**Phụ thuộc:** mọi task M2.

**Làm:** như M1-20, thêm:

1. Bản lưu v0.1 mở được và chơi tiếp.
2. Chơi tay trọn 6 kiếp, mỗi kiếp một lối chơi mẫu.
3. Kiểm hiệu năng: "+1 Tuổi" dưới 100 ms trên điện thoại tầm trung (đo bằng `performance.now()` trong dev, giả lập CPU chậm 4× ở DevTools).
4. Hỏi chủ dự án trước khi đăng và trước khi push tag `v0.5.0`.
5. Cập nhật đoạn trạng thái đầu `REVIEW.md`.

**Xong khi:** bản v0.5 đăng được, chơi được mọi lối chơi mẫu.
