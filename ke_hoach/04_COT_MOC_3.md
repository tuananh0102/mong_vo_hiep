# 04 - CỘT MỐC 3 "VẠN KIẾP" (v1.0, ĐỦ TÍNH NĂNG)

**Kết quả cuối cột mốc:** mọi mục của 7 hồ sơ GDD đều chạy trong game.
Năm vùng Thần Châu và di chuyển; đủ môn phái; Thập Đại Thần Công với cơ chế riêng; thần binh, kỳ trân, dị thú; tình duyên, hôn nhân, con cái; truyền thừa nhiều đời với 3 quy tắc chống lạm phát; kết nghĩa, cừu gia đủ hình thức; Bế quan tự sáng tạo; Kinh Mạch Nghịch Hành; đủ 18 kết cục; chế độ Thời Đại Hoàng Kim; cài được như app và chơi offline; khoảng 500 sự kiện.

**Điều kiện mở cột mốc:** không còn lỗ hổng chặn. Tên nguyên tác Kim Dung, rating 17+ và 6 nguyên mẫu Lang Quân đã chốt (HS02 quy ước nguồn, HS07 đầu Phần I, HS05 II.1).

Quy ước giống Cột mốc 2: task tự làm giao diện của mình; đổi định dạng trạng thái thì tăng `phien_ban` và chuyển đổi; bản lưu v0.5 phải mở được.

---

### [ ] M3-01 Năm vùng, bản đồ và di chuyển

**Phụ thuộc:** M2 xong.
**Đọc:** HS01 I; HS06 I.3 (hệ số vùng), V.2 (Hãn Huyết Bảo Mã); HS03 II.1 [D], III.2, IV.5 (điều kiện theo vùng); REVIEW mục 1.7; `05_LO_HONG_GDD.md` G01.
**Tạo:** `game/src/luat/di_chuyen.ts`; `SheetBanDo.tsx` (Bản đồ Thần Châu, mở khi chạm tên vùng ở Header, HS07 I.1); test.

**Làm:**

1. Vùng khởi đầu theo G01 (phụ thuộc gia cảnh); trẻ dưới 11 tuổi chỉ đổi vùng qua sự kiện.
2. Hành động *Đổi vùng* theo G01 (chi phí AP, ngân lượng); Hãn Huyết Bảo Mã: 1 lần đổi vùng miễn phí 0 AP mỗi năm.
3. Hắc Thị chỉ ở Giang Nam / Tây Vực (HS06 II.2): phải đang ở vùng đó.
4. NPC có `vung`; Tab 5 và Tab 3 lọc theo vùng được; sự kiện có `vung` chỉ xảy ra ở vùng đó.
5. Môn phái đặt ở vùng (HS02 I); muốn nhiệm vụ sư môn thì phải ở vùng của môn phái hoặc trả chi phí đi về (G01).
6. Bản đồ: Sheet liệt kê 5 vùng (tên, đặc trưng 1 dòng, thế lực, hệ số kỳ ngộ dạng mô tả "Nhiều di tích cổ"), vùng hiện tại có `aria-current`, nút *Đến đây* kèm chi phí.

**Test bắt buộc:** hệ số kỳ ngộ đúng vùng; đổi vùng trừ đúng chi phí; trẻ 8 tuổi không tự đổi vùng; Bảo Mã miễn phí đúng 1 lần / năm.

**Xong khi:** test xanh; bản đồ kiểm bằng mắt đạt.

---

### [ ] M3-02 Nội dung 0 - 15 tuổi các vùng và bái sư Ẩn Thế

**Phụ thuộc:** M3-01, M3-03 (dữ liệu môn phái).
**Đọc:** HS03 II.1 [D], III.2, IV.4, IV.5, II.2 [B] (bái sư Ẩn Thế năm 7 tuổi); HS02 I.3; Phụ lục A.
**Tạo:** sự kiện trong `du_lieu/su_kien/`.

**Làm:**

1. Chuyển nguyên văn: Thiềm Thừ Đỏ (Nam Cương / Tây Vực), Đấu Cổ Sinh Tử phiên bản Ngũ Độc Giáo, 3 sự kiện ẩn của Cổ Mộ / Tiêu Dao / Đào Hoa Đảo (HS03 IV.5 bảng), nhánh "bái sư Ẩn Thế ngay ở tuổi 7".
2. Mỗi vùng ngoài Trung Nguyên có ≥ 12 sự kiện 0 - 15 tuổi riêng (đời sống, kỳ ngộ, bái sư).
3. Mỗi gia cảnh × vùng có ít nhất 1 sự kiện phù hợp.

**Xong khi:** kiểm tra dữ liệu xanh; bot gặp mọi sự kiện mới.

---

### [ ] M3-03 Đủ môn phái

Làm theo 4 phần, mỗi phần một commit.

**Phụ thuộc:** M3-01.
**Đọc:** HS02 I (toàn bộ, theo từng phần dưới); HS04 I.1; Phụ lục A.
**Tạo:** `du_lieu/mon_phai/*.json`, `du_lieu/vo_hoc/*.json`, sự kiện nhập môn và đời sống của từng phái; xử lý `dac_quyen` / `dac_biet` mới.

#### [ ] M3-03a Còn lại của Ngũ Đại Danh Môn

Toàn Chân (xuất gia cấm kết hôn, $P_{THNM} = 0$ khi chủ đạo, Bắc Đẩu Thất Tinh Trận, 25% / năm gặp Cổ Mộ), Nga Mi (nam chỉ làm tạp dịch ngoại môn). Thiếu Lâm: Đệ tử tục gia (chỉ học ngoại công) và xuất gia.

#### [ ] M3-03b Tà phái và Ma Giáo còn lại

Minh Giáo, Ngũ Độc Giáo, Huyết Đao Môn (Ma công tương ứng HS02 II.2).

#### [ ] M3-03c Ngũ Nhạc và môn phái vừa

Đủ danh sách HS02 I.4 (ngoài Hoa Sơn đã có).

#### [ ] M3-03d Phái nhỏ, bang hội, sát thủ đường, Ẩn Thế

HS02 I.6 (Hải Sa Bang, Thập Vạn Đại Sơn Trại, Hắc Phong Lâu, Dược Vương Cốc với hồi sinh 1 lần trước 30 tuổi là hiệu ứng cứu mạng thứ 4 HS02 V.4) và HS02 I.3 (Tiêu Dao, Cổ Mộ, Đào Hoa Đảo; Cổ Mộ chỉ nhận nữ trừ sự kiện ẩn).

**Mỗi môn phái:** điều kiện gia nhập đúng HS02 I (Thanh danh, không Hiệp nghĩa thật); đủ võ học HS02 liệt kê; ≥ 6 sự kiện riêng; quy mô mặc định (HS06 II.2 mục 4); NPC trong thế giới được phân vào.

**Xong khi (cả M3-03):** test đếm đủ môn phái và võ học theo danh sách tên copy từ HS02; bot gia nhập được mọi phái ít nhất 1 lần trong 5.000 kiếp.

---

### [ ] M3-04 Tứ Đại Võ Lâm Thế Gia

**Phụ thuộc:** M3-03.
**Đọc:** HS02 I.5; HS06 II.4 (Đại Lý Đoàn Thị); HS07 IV #12.
**Tạo:** dữ liệu 4 thế gia; nhánh gia cảnh Võ Lâm Thế Gia chọn thế gia cụ thể; cơ chế ở rể / môn khách (cần M3-07 cho ở rể).

**Làm:**

1. Chỉ vào qua xuất thân, ở rể hoặc làm môn khách (HS02 I.5).
2. Đại Lý Đoàn Thị: 3.000 lạng khởi đầu, $+300$ / năm từ 16 tuổi.
3. Mộ Dung gia: cờ phục quốc cho kết cục #12.

**Xong khi:** test điều kiện vào, thu nhập Đoàn Thị.

---

### [ ] M3-05 Thập Đại Thần Công SSS

**Phụ thuộc:** M3-03.
**Đọc:** HS02 III.1 (toàn bộ), II.1 (ngoại lệ Thái Huyền Kinh), II.2 (Âm Dương Hỗ Tế), V.1 (Độc Cô Cửu Kiếm Phá Thức, Quỳ Hoa ra đòn trước), V.2 (Song Thủ, Đẩu Chuyển Tinh Di, Bắc Minh / Hấp Tinh), V.4 (Thần Chiếu Kinh, thuộc III.2); HS06 I.1 (Tiến độ đảo ngược); REVIEW mục 8 (Kỳ Thư Xuất Thế); `05_LO_HONG_GDD.md` G23.
**Tạo:** `du_lieu/vo_hoc/than_cong.json`; `game/src/luat/vo_hoc_dac_biet.ts` (một hàm cho mỗi mã `dac_biet`); kỳ ngộ SSS cho từng thần công; test.

**Làm:** mỗi thần công một mã `dac_biet` và một nhóm test:

| Thần công | Cơ chế phải có |
| :--- | :--- |
| Cửu Âm Chân Kinh | 2 quyển Thượng / Hạ; chỉ Hạ quyển thì Hiệp nghĩa $-100$ / năm luyện (Mai Siêu Phong); đủ + Phạn văn → bản đầy đủ |
| Cửu Dương Thần Công | Nhận qua Bạch Viên (M3-06); bách độc bất xâm, không lão hóa (HS04 III), phản chấn quyền cước, chữa Trọng thương sau 1 năm |
| Độc Cô Cửu Kiếm | Án Binh → Phá Thức khắc cả Tiên Hạ Thủ và Thân Pháp; chém bay vũ khí khi đúng loại |
| Quỳ Hoa / Tịch Tà | Chỉ nam; Tự cung (mất kết hôn / sinh con, Mị lực giảm) → Tier factor 2,5, $+10\%$ / cấp sát thương và tốc độ; Hiệp 1 ra đòn trước từ cấp 5 khi trùng hướng; không tự cung → `[Roll: Cảnh giới × 10 vs 90]` mỗi lần luyện, thất bại chết |
| Thái Huyền Kinh | Ngộ tính < 20; Tiến độ đảo ngược; 1 ô = nội công + kiếm + khinh công; Ngộ tính cao nhìn vách đá có thể chết |
| Lục Mạch Thần Kiếm | Căn cốt < 90 thì 50% không bắn ra ở mỗi đòn |
| Ám Nhiên Tiêu Hồn Chưởng | Chỉ mạnh khi có Trạng thái đau khổ / thất tình / mất tri kỷ hoặc cụt tay |
| Song Thủ Hỗ Bác | Ngộ tính < 40; thêm 1 ô Ngoại công; Hiệp 2 chọn 2 chiêu |
| Huyền Thiết Kiếm Pháp | Cần Huyền Thiết Trọng Kiếm và Căn cốt $\ge 80$ |
| Long Tượng Bàn Nhược Công | 13 tầng, thời gian luyện nhân đôi mỗi tầng (G23 cách quy về cấp 1 - 10) |
| Thần Chiếu Kinh (III.2) | Hiệu ứng cứu mạng ưu tiên 1, hồi 50% HP và Nội tức |
| Bắc Minh / Hấp Tinh, Đẩu Chuyển / Càn Khôn | Nút đặc biệt Hiệp 2 (Hút Nội Lực, Tá Lực Đả Lực) |
| Âm Dương Hỗ Tế | Trạng thái dung hợp: sát thương và phòng thủ nhân đôi, không còn Tẩu hỏa song tu (nguồn: kỳ ngộ, G23) |

Kỳ Thư Xuất Thế (M2-09) trao thần công theo G23.

**Xong khi:** mọi test cơ chế xanh; `mo_phong.ts` cho thấy Chiến lực Top 10 chưa vượt khung của `BAO_CAO.md` quá 10% (nếu vượt: ghi `REVIEW.md`, đề xuất vòng cân bằng mới theo quy tắc 3 `AGENTS.md`, chờ chủ dự án duyệt).

---

### [ ] M3-06 Kỳ công, Thần binh, Kỳ trân, Dị thú

**Phụ thuộc:** M3-05.
**Đọc:** HS02 III.2, IV; HS06 V.1, V.2.
**Tạo:** dữ liệu và xử lý `dac_biet` tương ứng; ô Tọa kỵ và Linh thú trong Tab 2; test.

**Làm:**

1. Kỳ công HS02 III.2: Sinh Tử Phù (biến NPC bại trận thành nô bộc, Hiệp 3 lựa chọn [D]), Kim Xà Kiếm Pháp, Lăng Ba Vi Bộ / Thần Hành Bách Biến (nút "Mỉm cười phủi áo bỏ đi" +30, kẹp 95%), Nhiếp Hồn Đại Pháp, Huyết Đao Kinh.
2. Thần binh HS02 IV từng món: Đồ Long Đao (Vũ Mục Di Thư cho Sơn Hà Phá Toái), Ỷ Thiên Kiếm, chém nhau gãy để lấy bí kíp, Đả Cẩu Bổng (Cái Bang dâng tin và bạc), Thánh Hỏa Lệnh, Nhuyễn Vị Giáp (ô giáp), Bạo Vũ Lê Hoa Châm (3 lần / đời, 80% / 40% HP_max).
3. Kỳ trân HS06 V.1: Mãng Cổ Chu Thiềm, Thiên Sơn Tuyết Liên (xóa giới hạn kháng thuốc 1 lần), Hàn Ngọc Sàng (đặt ở Gia trang, M3-08), Mặt nạ Dịch Dung (đã có M2), Thưởng Thiện Phạt Ác Lệnh (Hiệp Khách Đảo, dẫn tới Thái Huyền Kinh).
4. Dị thú HS06 V.2: tối đa 1 Tọa kỵ + 1 Linh thú; điều kiện thu phục là sự kiện kỳ ngộ; hiệu ứng trong trận và hằng năm.

**Xong khi:** mỗi vật có 1 test hiệu ứng; mỗi vật có ít nhất 1 đường nhận được trong dữ liệu sự kiện.

---

### [ ] M3-07 Tình duyên và hôn nhân

**Phụ thuộc:** M2-03, M3-03. Đọc thêm G14 (Lang Quân, HS05 II.1), G25 (rating, HS07 đầu Phần I).
**Đọc:** HS05 II (toàn bộ); HS01 II.0 (giới hạn theo giới tính), III.2 (*Đào Hoa Kiếp*); HS07 IV #5, #11; HS06 IV (Tình Hoa); REVIEW mục 8 (nhân vật nữ).
**Tạo:** `game/src/luat/tinh_duyen.ts`; `du_lieu/nguyen_mau_tinh_duyen.json`; NPC có `nguyen_mau`; sự kiện tình duyên; test.

**Làm:**

1. 6 nguyên mẫu Hồng Nhan và 6 nguyên mẫu Lang Quân tương ứng (G14) với điều kiện chinh phục và biến cố đúng HS05 II.1.
2. Hảo cảm tình duyên dùng chung thang Hảo cảm; mốc $\ge 80$ là "có quan hệ tình cảm" (HS07 #11).
3. Kết hôn: sự kiện lễ thành hôn; ràng buộc môn phái (Toàn Chân, Thiếu Lâm xuất gia cấm; Quỳ Hoa tự cung mất lựa chọn).
4. Đại Hôn Đẫm Máu (HS05 II.2): đủ 3 nhánh, nhánh [B] thất bại cho *[Tâm Ma Đứt Ruột]*.
5. Ghen tuông khi ≥ 3 người cùng lúc và có Độc Phụ / Yêu Nữ (#11); Độc Phụ hạ độc khi có nhân tình khác; Thanh Mai bị cướp khi Mị lực thấp hoặc bị trục xuất.
6. *Đào Hoa Kiếp*: tăng tỷ lệ sự kiện tình duyên và sự kiện ghen tuông (G13 hệ số).
7. Phu thê *Ôn Nhu Tri Kỷ*: tăng hồi phục nội thương (chữa Trọng thương dễ hơn, G13) và quản lý gia trang.
8. Mọi văn bản tình duyên có biến thể theo giới tính người chơi; cảnh thân mật mô tả gián tiếp (G25).

**Xong khi:** test từng nguyên mẫu, Đại Hôn 3 nhánh, #11 đạt được trong bot có chính sách "đa tình".

---

### [ ] M3-08 Con cái, truyền thừa nhiều đời, Gia trang, Gia phả

**Phụ thuộc:** M3-07.
**Đọc:** HS05 IV (toàn bộ); HS01 IV (dạy con miễn phí); HS06 II.2 mục 3 (Tàng Kinh Các gia tộc, Hộ viện), II.3 (Nợ chuyển cho con), V.1 mục 3 (Hàn Ngọc Sàng), V.2 (Tọa kỵ / Linh thú truyền thừa); HS07 I.2 mục 3 (Cây Gia Phả), III, IV #2; `05_LO_HONG_GDD.md` G13.
**Tạo:** `game/src/luat/truyen_thua.ts`, `gia_trang.ts`; `TabNhanMach.tsx` phần Gia phả; màn *Chọn người kế thừa*; test.

**Làm:**

1. Sinh con (G13 xác suất), giới tính 50 / 50; di truyền từ chỉ số bẩm sinh, hồi quy về trung bình trên 70, $\pm 15$, kẹp 0 - 100; Phúc duyên quay theo Gia cảnh; *Tiên Thiên Võ Thể* 30% khi cả cha mẹ từng đạt cấp 10 Trấn phái / SSS.
2. Con là `NpcSong` lớn lên trong thế giới; lượt dạy con miễn phí mỗi năm khi có con 3 - 15 tuổi (truyền tối đa 2 môn, gửi môn phái bằng hữu, chiều chuộng → *Phá Gia Chi Tử* / *Kiêu Ngạo* khi Ngân lượng > 5.000).
3. Đệ tử Chân truyền nhận làm con nuôi được tính là người kế thừa.
4. Chết khi có người kế thừa: màn chọn 1 người; áp 3 quy tắc: võ học thành bản chép tay 60% (80% nếu Tàng Kinh Các gia tộc đã nâng; võ tự sáng tạo giữ 100%), Ngân lượng còn 30% **sau khi** trừ Nợ chuyển sang con, sự kiện Quần Hùng Trục Lộc nếu cha có > 3.000 lạng hoặc Thần binh / SSS (Hộ viện giúp tự thắng; thua thì gia trang cháy, chỉ ôm 1 di vật).
5. Người kế thừa trở thành `nhan_vat`; NPC cũ của họ chuyển thành người chơi, giữ quan hệ; thế giới không reset; Biên Niên Sử kiếp mới bắt đầu bằng dòng chuyển kiếp.
6. Gia trang: Tàng Kinh Các gia tộc (3.000 lạng / cấp), Hàn Ngọc Sàng (nhân đôi Tiến độ nội công, giảm nửa Tẩu hỏa), Hộ viện; chỉ đời sau khôi phục bản chép tay lên 10/10 khi Ngộ tính $\ge 80$ hoặc học từ truyền nhân gốc.
7. `dong_toc`: các đời, Tổ sư; kết cục dòng tộc #2 xét khi đời thứ 3 kết thúc.
8. Cây Gia Phả trong Tab 3: các đời, vợ / chồng, con, người đang chơi `aria-current`.
9. Tuyệt tự: sang Đài Vọng Hương như M2.

**Test bắt buộc:** công thức di truyền với các ví dụ tính tay; Nợ trừ trước 30%; bản chép tay giới hạn cấp 6; Quần Hùng Trục Lộc kích hoạt đúng điều kiện; chống lạm phát: bot chạy 5 đời liên tiếp, Chiến lực và Gia sản trung vị đời 5 không vượt đời 1 quá ngưỡng ghi ở G13 (nếu vượt: ghi `REVIEW.md`, đề xuất cân bằng).

**Xong khi:** test xanh; chơi tay 3 đời liên tiếp trên giao diện.

---

### [ ] M3-09 Kết nghĩa Kim Lan và Cừu gia đủ hình thức

**Phụ thuộc:** M3-08.
**Đọc:** HS05 III (toàn bộ); HS02 V.4 (Huynh đệ Cứu giá ưu tiên 2).
**Tạo:** `game/src/luat/ket_nghia.ts`, mở rộng `nhan_mach.ts`; test.

**Làm:**

1. Kết nghĩa tối đa 2 NPC, Cổng Hảo cảm $\ge 80$; hành động *Uống rượu luận võ* học ké 1 chiêu (G26 cách quy ra Tiến độ).
2. Cứu giá: `[Ngẫu nhiên: 50%]` khi HP về 0, người chơi còn 10% HP, huynh đệ Ám thương $+5$; tuân thủ thứ tự cứu mạng.
3. Phản bội: huynh đệ bản mệnh Ngụy quân tử / Tham lam có thể hạ độc khi người chơi có Thần binh / bí kíp cấp Thần.
4. Cừu gia đủ HS05 III.2: kẻ thù giàu thuê Hắc Phong Lâu ám sát; Tà phái nhắm vợ con (đầu độc, bắt cóc, sự kiện giải cứu); con của kẻ bị giết tu luyện rồi thách đấu năm người chơi 50 tuổi (NPC con được ưu tiên kỳ ngộ, G26).

**Xong khi:** test từng hình thức; bot gặp đủ các hình thức trong 5.000 kiếp.

---

### [ ] M3-10 Bế quan tự sáng tạo và Kinh Mạch Nghịch Hành

**Phụ thuộc:** M3-05, M3-08.
**Đọc:** HS04 III.2, III.3; HS07 IV #2, #6; REVIEW mục 8; `05_LO_HONG_GDD.md` G21, G22.
**Tạo:** `game/src/luat/be_quan.ts`; ô nhập tên môn võ (kiểm độ dài, ký tự); test.

**Làm:**

1. Bế quan: 55+, Cổng Ngộ tính $\ge 85$ và $\ge 3$ môn Thượng thừa / Trấn phái; tốn toàn bộ AP 3 năm liên tiếp; `[Roll: Ngộ tính vs 90]` ở năm 3.
2. Thành công: người chơi gõ tên; môn mới có chỉ số theo G21; lưu vào Tàng Kinh Các gia tộc 100%. Thất bại: hoàn thiện 60%, Ám thương $+10$, 25% vào Kinh Mạch Nghịch Hành.
3. Kinh Mạch Nghịch Hành (60+, song tu xung khắc nhiều hoặc Cửu Âm bản thiếu): sức chiến đấu $+150\%$; phần "mất quyền kiểm soát" theo G22; đếm số Chưởng môn / Top 10 đánh bại trong lúc điên (kết cục #6).

**Xong khi:** test xanh; môn tự sáng tạo không trở thành "vũ khí vô hạn" qua 5 đời (kiểm bằng bot như M3-08).

---

### [ ] M3-11 Thời Đại Hoàng Kim (gói Luân Hồi 5)

**Phụ thuộc:** M3-05.
**Đọc:** HS07 III gói 5; `05_LO_HONG_GDD.md` G33.
**Tạo:** tùy chọn khởi tạo thế giới; dữ liệu Ngũ Tuyệt đời đầu và Boss thần thoại; test.

**Làm:** 200 NPC chỉ số $+30\%$; xuất hiện đồng thời Ngũ Tuyệt đời đầu và Boss (G33 danh sách và chỉ số); bật bằng gói 1.500 điểm; nhãn chế độ hiện ở Header và Văn bia.

**Xong khi:** test hệ số $+30\%$; bot chạy được 500 kiếp ở chế độ này.

---

### [ ] M3-12 Đủ 18 kết cục, danh hiệu phụ, xuất ảnh Văn bia

**Phụ thuộc:** M3-07 đến M3-10.
**Đọc:** HS07 II, IV (toàn bộ); REVIEW mục 8 (#14 "≥ 70 tuổi", #18 gồm Tuổi 0, nhiều kết cục); `05_LO_HONG_GDD.md` G24.
**Tạo / sửa:** `ket_cuc.ts` bật nốt #2, #5, #6, #9, #11, #14 và hoàn thiện #7; danh hiệu phụ (G24); nút *Lưu ảnh Văn bia*.

**Làm:**

1. Bật mọi kết cục còn lại, mỗi cái 1 test đạt + 1 test thiếu.
2. #2 là Kết cục Dòng tộc: khắc lên Văn bia Tổ sư, điểm cộng cho kiếp thứ 3.
3. Danh hiệu phụ theo G24.
4. Xuất ảnh: vẽ Văn bia lên `<canvas>` bằng token màu chủ đề Tang (đọc biến CSS bằng `getComputedStyle`), tải về PNG hoặc `navigator.share` nếu có. Không dùng thư viện ngoài.
5. Thư viện kết cục trong Đài Vọng Hương: 18 ô, ô chưa đạt hiện mờ và chỉ hiện tên nhóm.

**Xong khi:** bot 10.000 kiếp với chính sách hỗn hợp đạt mỗi kết cục ít nhất 1 lần, trừ #1 và #2 (cho phép đạt bằng bot chuyên biệt); bảng tần suất ghi `ke_hoach/bao_cao_m3.md`.

---

### [ ] M3-13 Nội dung lên 500 sự kiện

**Phụ thuộc:** các task M3 có nội dung.
**Đọc:** Phụ lục A ở `02_COT_MOC_1.md`.

Chia thành gói, mỗi gói một commit:

| Gói | Nội dung | Tối thiểu |
| :--- | :--- | :--- |
| M3-13a | 0 - 15 tuổi, 5 vùng | tổng 0 - 15 đạt 150 |
| M3-13b | 16 - 50 tuổi, đời sống giang hồ theo vùng | 120 |
| M3-13c | 51+ tuổi, lão niên, truyền dạy, hồi tưởng | 50 |
| M3-13d | Môn phái (mỗi phái ≥ 6) | đủ mọi phái |
| M3-13e | Tình duyên, hôn nhân, gia đình, con cái | 60 |
| M3-13f | Kỳ ngộ (B ≥ 30, A ≥ 25, S ≥ 15, SSS = mỗi thần công / thần binh ≥ 1) | 70 |

**Xong khi:** tổng ≥ 500; kiểm tra dữ liệu xanh; bot gặp mọi sự kiện.

---

### [ ] M3-14 PWA, hiệu năng, khả năng tiếp cận, tên hiển thị

**Phụ thuộc:** M3-12.
**Đọc:** 01 mục 1 (PWA), 7.6; thiết kế mục 10, 12; `05_LO_HONG_GDD.md` G25.

**Làm:**

1. `vite-plugin-pwa`: manifest (tên, màu nền `--nen`, biểu tượng), cache toàn bộ tài nguyên, chơi được khi tắt mạng.
2. Hiệu năng: "+1 Tuổi" < 100 ms trên CPU chậm 4×; Biên Niên Sử 80 năm cuộn mượt (ảo hóa danh sách nếu cần, không thêm thư viện: chỉ render các năm gần màn hình).
3. Rà khả năng tiếp cận toàn game theo thiết kế mục 10 (bàn phím, focus, `aria-*`, trình đọc màn hình đọc dòng Biên Niên Sử mới).
4. Tên hiển thị: giữ tên nguyên tác (G25), `ten_hien_thi.json` để rỗng nhưng vẫn phải chạy được; grep dữ liệu để chắc mọi tên võ học / vật phẩm trong văn bản đi qua biến.
5. Rà nội dung theo rating đã chọn (G25).

**Xong khi:** Lighthouse PWA đạt cài được; kiểm bằng mắt toàn game đạt; tắt mạng vẫn chơi được.

---

### [ ] M3-15 Cân bằng tổng và phát hành v1.0 "Vạn Kiếp"

**Phụ thuộc:** mọi task M3.

**Làm:**

1. `npm run mo-phong` toàn bộ lối chơi + truyền thừa 5 đời; so `mo_phong/BAO_CAO.md`; lệch có chủ đích phải có vòng cân bằng mới được chủ dự án duyệt (quy tắc 3 `AGENTS.md`).
2. Duyệt bảng phủ GDD (README mục 6): mọi dòng có task đã xong; mục GDD nào chưa có task thì tạo task và làm trước khi phát hành.
3. `05_LO_HONG_GDD.md`: lỗ hổng mới phát sinh khi implement (G34 trở đi) đều đã có quyết định và đã đưa vào GDD.
4. Chơi tay 5 dòng tộc, mỗi dòng ≥ 2 đời, trên điện thoại thật.
5. Hỏi chủ dự án trước khi đăng và push tag `v1.0.0`.
6. Cập nhật đoạn trạng thái đầu `REVIEW.md`.

**Xong khi:** v1.0 đăng được; bảng phủ GDD đủ dấu xong.
