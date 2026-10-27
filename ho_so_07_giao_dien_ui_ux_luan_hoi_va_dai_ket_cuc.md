# HỒ SƠ 07: THIẾT KẾ GIAO DIỆN UI/UX TEXT-BASED, HỆ THỐNG LUÂN HỒI & DANH MỤC ĐẠI KẾT CỤC (ENDINGS)
**Tên dự án:** *Vạn Kiếp Giang Hồ* (Thể loại: Text-based Life Sim / Võ Hiệp Kim Dung)
**Mục tiêu thiết kế:** Hoàn thiện mảnh ghép cuối cùng của bộ tài liệu thiết kế game (GDD): Bố cục màn hình giao diện tối ưu cho trải nghiệm đọc và ra quyết định nhanh trên Mobile/Web (phong cách *BitLife* kết hợp thủy mặc cổ phong), hệ thống Điểm Nghiệp Lực Luân Hồi (Meta-Progression) khi tuyệt tự và 18 Đại Kết Cục (Endings) ghi danh sử sách.

**Phân loại độ tuổi** (chốt 2026-10-27, `ke_hoach/05_LO_HONG_GDD.md` G25): nhắm **17+** (Apple) / **Mature 17+** (IARC). Giữ bạo lực và các lựa chọn tàn nhẫn; cảnh thân mật (kỹ viện, phong lưu, tự cung) chỉ mô tả gián tiếp; với nhân vật dưới 16 tuổi, lựa chọn tàn nhẫn chỉ mô tả ở mức hệ quả, không tả chi tiết.

## PHẦN I: THIẾT KẾ GIAO DIỆN UI/UX TEXT-BASED (MÀN HÌNH DỌC MOBILE-FIRST)

Giao diện của *Vạn Kiếp Giang Hồ* sử dụng tông màu **Giấy Tuyên Thành ngả vàng cổ điển (`#F4EFE6`)** kết hợp mực tàu đen (`#1C1B18`), đỏ chu sa (`#9E2A2B`) cho các cảnh báo sinh tử và xanh thanh ngọc (`#2A6F68`) cho các kỳ ngộ đạo gia. Toàn bộ trải nghiệm gói gọn trên **1 màn hình dọc không cần chuyển cảnh phức tạp**.

### 1. Bố Cục Màn Hình Chính (4 Phân Vùng Cốt Lõi)

| Phân vùng | Vị trí & Tỷ lệ màn hình | Các thành phần hiển thị chi tiết | Tương tác Người dùng |
| :--- | :--- | :--- | :--- |
| **1. Thanh Trạng Thái Nhân Vật (Top Header Bar)** | Trên cùng ($15\%$ chiều cao) | Tên họ, Danh hiệu hiện tại, Tuổi / Tuổi thọ ẩn, Khu vực đang đứng, Môn phái & Chức vị, Thanh máu ($HP$), Nội tức ($MP$) và Ngân lượng. | Chạm vào Tên để mở bảng **Chi tiết Bát Tự & Thiên Phú**; chạm vào Khu vực để mở **Bản đồ Thần Châu**. |
| **2. Cuộn Giấy Biên Niên Sử (Central Scroll Log)** | Giữa màn hình ($65\%$ chiều cao) | Dòng thời gian văn bản tự động cuộn theo từng năm. Mỗi loại sự kiện có **màu chữ kèm biểu tượng đầu dòng** (bảng màu ở mục 1.1), để người mù màu vẫn phân biệt được: **Mực đen** (Sự kiện đời thường), **Đỏ chu sa** ⚔ (Giao chiến / Thù hận), **Tím huyền** ❀ (Tình duyên), **Vàng kim** ✦ (Kỳ ngộ SSS). | Vuốt lên/xuống để đọc lại lịch sử từ năm $0$ tuổi. Các tên NPC và Võ học trong câu văn đều có thể **chạm trực tiếp (Hyperlink/Tooltip)** để xem thông tin nhanh. |
| **3. Khung Quyết Định Sự Kiện / Giao Chiến (Modal Card)** | Nổi đè lên giữa màn hình khi có Sự kiện hoặc Tam Hiệp | Hiển thị đoạn văn miêu tả tình huống kịch tính và $2 - 4$ nút lựa chọn. Mỗi nút ghi rõ gợi ý kiểm định theo ký hiệu chuẩn ở Hồ sơ 06 mục I.2 (Ví dụ: *"[Ngộ tính - Khá]"* cho Roll, nút xám *"Cần Ngân lượng 50"* cho Cổng chưa đạt). Nhãn tỷ lệ theo xác suất thành công thật: **Hiểm** $< 25\%$, **Khó** $25 - 49\%$, **Khá** $50 - 74\%$, **Dễ** $\ge 75\%$. | Chạm chọn phương án. Trong **Quyết Đấu Tam Hiệp**, hiển thị thêm thanh máu đối phương và bộ đếm Hiệp $1/2/3$. |
| **4. Bàn Điều Khiển Hành Động & Nút "+1 Tuổi" (Bottom Dock)** | Dưới cùng ($20\%$ chiều cao, đủ cho 1 hàng ngọc AP, 5 Tab và nút "+1 Tuổi"; Cuộn Biên Niên Sử là nội dung chính của game đọc chữ nên được ưu tiên diện tích) | Hiển thị số **Điểm Hành Động (AP)** còn lại trong năm (dạng các viên ngọc âm dương sáng đèn), 5 Tab chức năng và nút lớn **"+1 TUỔI (Qua Năm)"** ở chính giữa. | Khi dùng hết AP, nút **"+1 Tuổi"** phát sáng hiệu ứng mực loang nhắc người chơi kết thúc năm. |

**Danh hiệu hiện tại ở Thanh Trạng Thái** (chốt 2026-10-27, `ke_hoach/05_LO_HONG_GDD.md` G31), lấy cái đầu tiên đạt: danh hiệu Ngũ Tuyệt → *Võ Lâm Minh Chủ* → chức vị (Chưởng môn / Giáo chủ / Trưởng lão) → mức Thanh danh (*Chính Nhân Quân Tử* / *Đại Ma Đầu*) ghép mức Danh vọng (*Danh hiệp* $\ge 400$, *Đại hiệp* $\ge 700$) → *Vô danh tiểu tốt*.

#### 1.1. Bảng màu chuẩn (nền Giấy Tuyên Thành `#F4EFE6`)

| Vai trò | Mã màu | Tương phản với nền | Dùng cho |
| :--- | :--- | :--- | :--- |
| Mực tàu | `#1C1B18` | $15.0:1$ | Chữ thường, chữ trên mọi nhãn màu |
| Đỏ chu sa | `#9E2A2B` | $6.5:1$ | Chữ sự kiện giao chiến, cảnh báo sinh tử |
| Xanh thanh ngọc | `#2A6F68` | $5.1:1$ | Chữ kỳ ngộ đạo gia |
| Tím huyền | `#5B3A6E` | $8.1:1$ | Chữ sự kiện tình duyên |
| Vàng kim đậm | `#7A5C10` | $5.5:1$ | Chữ kỳ ngộ SSS |
| Vàng kim sáng | `#D4AF37` | $1.8:1$ (**không dùng cho chữ**) | Viền, nền nhãn, hiệu ứng ánh kim; chữ đặt trên nó dùng Mực tàu ($8.2:1$) |

Mọi màu chữ đạt chuẩn WCAG AA ($\ge 4.5:1$). Màu không bao giờ là tín hiệu duy nhất: luôn kèm biểu tượng hoặc nhãn chữ.

Token đầy đủ (thêm lam chàm `#2B4C7E`, thang phẩm cấp 4 bậc), thành phần dùng chung và quy tắc thêm giao diện mới: [giao_dien/HE_THONG_THIET_KE.md](giao_dien/HE_THONG_THIET_KE.md).

### 2. Chi Tiết 5 Tab Chức Năng Ở Thanh Điều Khiển Dưới Cùng
1. **Tab [Tu Luyện & Hành Động] (Tốn AP):** Chứa danh sách các việc làm trong năm theo độ tuổi (Luyện nội công, Nghiên cứu kiếm phổ, Làm nhiệm vụ sư môn, Áp tiêu, Đi dạo phố thị, Bế quan).
2. **Tab [Võ Học & Hành Trang] (0 AP):** Quản lý 4 ô trang bị Võ học (Nội công, Ngoại công, Khinh công, Tuyệt kỹ), mặc Thần binh/Giáp trụ, uống Đan dược hoặc tẩm Độc dược trước trận đấu.
3. **Tab [Nhân Mạch & Gia Phả] (0 AP / Tốn AP tùy việc):** Danh sách Sư phụ, Đồng môn, Hồng nhan tri kỷ, Huynh đệ kết nghĩa, Kẻ thù huyết hải ($-100$) và **Cây Gia Phả Đa Thế Hệ**. Cho phép thực hiện các hành động miễn phí như *Trò chuyện 1 lần/năm* hoặc *Dạy dỗ con cái*.
4. **Tab [Môn Phái & Gia Trang] (Phần Môn Phái mở khóa ngay khi gia nhập môn phái; phần Gia Trang mở khóa từ 16 tuổi):** Xem bảng xếp hạng Cống hiến, vào Tàng Kinh Các đổi bí kíp, hoặc quản lý Gia trang riêng (Xây Tàng Kinh Các gia tộc, đặt *Hàn Ngọc Sàng*, thuê Hộ viện).
5. **Tab [Thiên Hạ Phong Vân Bảng] (0 AP):** Bảng tin thế giới cập nhật biến động của 200 NPC mỗi năm và bảng xếp hạng **Thập Đại Cao Thủ Đương Thời (Ngũ Tuyệt)**, **Thập Đại Ác Nhân**, **Thần Binh Phổ**. Thập Đại Cao Thủ xếp theo **Chiến lực** (Hồ sơ 06 I.5); mỗi dòng hiện tên, môn phái, Chiến lực và tỷ lệ thắng ước tính của người chơi khi đấu với người đó (công thức ở Hồ sơ 06 I.5), để người chơi tự cân rủi ro trước khi thách đấu. Chiến lực của NPC chỉ hiện chính xác khi người chơi đã từng giao đấu hoặc Ngộ tính $\ge 70$; nếu không thì hiện theo khoảng $\pm 30$ điểm. Thập Đại Ác Nhân xếp theo Chiến lực trong số NPC có Thanh danh $\le -300$.

## PHẦN II: HỆ THỐNG BÁO TỬ & VĂN BIA TỔNG KẾT ĐỜI NGƯỜI (EPITAPH SYSTEM)

Khi nhân vật chính qua đời (do hết tuổi thọ, bạo bệnh, tẩu hỏa nhập ma hoặc tử trận ở Hiệp 3), màn hình chuyển sang tông màu **Trắng – Đen trang nghiêm** với hình ảnh một tấm **Bia Đá Cổ** khắc toàn bộ cuộc đời người chơi:

### 1. Bảng Chấm Điểm Tổng Kết Kiếp Người (Life Score & Karma Calculation)
Hệ thống tự động tổng hợp dữ liệu suốt từ năm $0$ tuổi đến năm nhắm mắt xuôi tay để quy đổi thành **Điểm Nghiệp Lực Luân Hồi (Luân Hồi Điểm - Karma Points)**:

$$\text{Tổng Điểm Luân Hồi} = \lfloor\text{Tuổi Thọ} \times 2\rfloor + \lfloor\frac{|\text{Hiệp Nghĩa}|}{5}\rfloor + (\text{Số Môn Võ Cấp 10} \times 50) + (\text{Số Đại Sự Kiện Vượt Qua} \times 100) + \text{Điểm Danh Hiệu Kết Cục}$$

* **Trình Tạo Văn Bia Tự Động (Procedural Epitaph Generator):**
  Hệ thống ghép nối 4 cột mốc lớn nhất trong đời nhân vật thành một bài minh văn khắc trên đá (Người chơi có thể xuất ra ảnh để chia sẻ):
  * *Đoạn 1 (Xuất thân & Thiếu thời):* "Sinh năm Giáp Tý tại đất Giang Nam trong gia cảnh hàn vi, năm 8 tuổi kỳ ngộ Lão ngoan đồng nơi hang sâu..."
  * *Đoạn 2 (Thành tựu Võ học & Danh chấn):* "Năm 25 tuổi một kiếm bại quần hùng trên đỉnh Hoa Sơn, luyện thành Cửu Dương Thần Công và Độc Cô Cửu Kiếm..."
  * *Đoạn 3 (Tình duyên & Ân oán):* "Trọn đời si tình cùng một vị Yêu nữ Minh Giáo, kết nghĩa kim lan cùng 2 bậc hào kiệt, dưới lưỡi kiếm đã tiễn 14 tên đại ma đầu về nơi chín suối..."
  * *Đoạn 4 (Vẫn lạc & Di sản):* "Năm 78 tuổi tọa hóa trên đỉnh Quang Minh Đỉnh, truyền lại cơ nghiệp vạn kim cùng môn tuyệt học tự sáng tạo cho trưởng tử kế thừa."
  * *Lịch năm* (chốt G20): năm thế giới lúc bắt đầu ván quay ngẫu nhiên trong $1100 - 1199$; năm Can Chi theo chu kỳ 60, năm chia 60 dư 4 là Giáp Tý.

## PHẦN III: CỬA HÀNG LUÂN HỒI (META-PROGRESSION KHI TUYỆT TỰ / CHƠI VÁN MỚI)

Nếu người chơi chọn **"Truyền Thừa Cho Đời Con"** (đã trình bày ở Hồ sơ 05), ván chơi tiếp tục ngay trong thế giới hiện tại. Nhưng nếu người chơi **Chết Trẻ Tuyệt Tự** hoặc muốn **Khởi Tạo Thế Giới Mới Hoàn Toàn Từ Tuổi 0**, họ sẽ bước vào **Đài Vọng Hương (Cửa Hàng Luân Hồi)** và dùng **Điểm Luân Hồi** tích lũy được để mua các đặc quyền đầu thai:

| Gói Đặc Quyền Đầu Thai (Mở khóa bằng Điểm Luân Hồi) | Chi phí (Điểm) | Hiệu ứng Cố định cho Kiếp Sau (Tuổi 0) |
| :--- | :--- | :--- |
| **1. Đầu Thai Chọn Lọc (Mệnh Cách Tự Quyết)** | $200$ điểm | Thay vì quay ngẫu nhiên, được **chọn thẳng 1 trong 4 Gia cảnh** (Ví dụ: Chọn thẳng *Võ Lâm Thế Gia* hoặc *Hàn Vi*). |
| **2. Túc Tuệ Tiền Kiếp (Giữ Lại Ký Ức)** | $500$ điểm | Bắt đầu ở Tuổi 0 với **Ngộ tính $+20$** và mang sẵn $1$ môn võ công cấp Thượng thừa từ kiếp trước ở trạng thái *Cấp $1/10$* ngay từ năm 5 tuổi! |
| **3. Thiên Mệnh Chi Tử (Khí Vận Ngút Trời)** | $800$ điểm | Khởi đầu với **Phúc duyên cố định ở mức $90$**, đảm bảo trong 15 năm đầu đời chắc chắn gặp ít nhất $2$ Kỳ ngộ cấp S trở lên. |
| **4. Chuyển Thế Trọng Tu (Giữ Lại 1 Thiên Phú Đỏ)** | $1,000$ điểm | Được khóa và mang theo $1$ Thiên phú hiếm từ kiếp trước (độ hiếm Đỏ, như *[Cửu Dương Tuyệt Mạch]* hoặc *[Tiên Thiên Võ Thể]*. Chỉ áp dụng cho Thiên phú, không áp dụng cho Trạng thái như *[Bách Độc Bất Xâm]*) sang kiếp mới. |
| **5. Mở Khóa Kịch Bản Ẩn: "Thời Đại Hoàng Kim"** | $1,500$ điểm | Khởi tạo thế giới mới ở chế độ **Độ Khó Cao (Hardcore Mode)**: Toàn bộ 200 NPC trong thế giới đều có chỉ số tăng $+30\%$, xuất hiện đồng thời cả *Ngũ Tuyệt* đời đầu và các Boss thần thoại. |

**Chi tiết các gói** (chốt 2026-10-27, `ke_hoach/05_LO_HONG_GDD.md` G33):
* Gói 3 *Thiên Mệnh Chi Tử*: hệ thống đếm số Kỳ ngộ cấp S trở lên đã gặp; cuối năm 13 tuổi và 15 tuổi nếu chưa đủ số cần có, lượt chọn sự kiện kế tiếp ép quay 1 Kỳ ngộ cấp S đủ điều kiện.
* Gói 5 *Thời Đại Hoàng Kim*: *Ngũ Tuyệt* đời đầu là 5 NPC có Thần công SSS cấp 10, Cảnh giới Nội công 10, Căn cốt 90, tuổi $45 - 55$, mỗi người trấn một vùng; 3 Boss thần thoại (*Độc Cô Cầu Bại*, *Tảo Địa Tăng*, *Thiên Sơn Đồng Mỗ*) có Chiến lực khoảng 500, không dự Hoa Sơn, chỉ gặp qua sự kiện. Mức $+30\%$ chỉ số áp lên mọi NPC, kể cả hai nhóm này.

## PHẦN IV: DANH MỤC 18 ĐẠI KẾT CỤC GHI DANH SỬ SÁCH (ENDINGS CATALOG)

Mỗi kiếp người khi khép lại sẽ được hệ thống xét duyệt từ trên xuống dưới để trao tặng **1 Danh Hiệu Đại Kết Cục (Ending Title)** cao quý nhất dựa trên con đường mà người chơi đã đi qua:

* **Danh hiệu phụ** (chốt 2026-10-27, `ke_hoach/05_LO_HONG_GDD.md` G24): mọi kết cục khác cũng đạt được ghi thành danh hiệu phụ dưới Văn bia và mở trong thư viện kết cục, **không** cộng Điểm Luân Hồi.
* **Kết cục mặc định** (chốt G09): kiếp không đạt kết cục nào nhận **[Giang Hồ Khách Qua Đường]**, Điểm Danh Hiệu Kết Cục $= 0$.

### Nhóm 1: Đỉnh Phong Võ Học & Bá Chủ Thiên Hạ (Tier SSS - $+500$ Điểm Luân Hồi)

1. **[Võ Lâm Chí Tôn - Thiên Hạ Đệ Nhất] (Ngũ Tuyệt Đỉnh Phong):**
   * *Điều kiện:* Chiến thắng giải đấu **Hoa Sơn Luận Kiếm** (sự kiện định kỳ mỗi 10 năm) ít nhất 1 lần **và** đứng **số 1 Thập Đại Cao Thủ** trên Thiên Hạ Phong Vân Bảng (xếp theo Chiến lực, Hồ sơ 06 I.5) **ít nhất 10 năm liên tục**, sở hữu ít nhất 2 môn Thần công SSS đạt cấp $10/10$, không thua bất kỳ trận Quyết Đấu Tam Hiệp nào từ năm 25 tuổi.
   * *Ghi chú cân bằng:* Điều kiện cũ "thắng Hoa Sơn 2 lần" gần như không đạt được vì một người chỉ đứng trong Top 10 khoảng 13 năm. Mô phỏng thế giới 200 NPC (`mo_phong/BAO_CAO.md` mục 17): ngay cả NPC cũng chỉ $5\%$ nhiệm kỳ số 1 kéo dài từ 10 năm, và các lối chơi mẫu đạt hai điều kiện đầu ở $0 - 1\%$ số đời. Đây là kết cục đỉnh cao, chỉ dành cho người chủ động săn Thần công SSS và giữ Cảnh giới cao để chậm lão hóa.
   * *Mô tả kết cục:* Tên tuổi của bạn trở thành huyền thoại sống đứng trên đỉnh cao nhất của Thần Châu. Sau khi bạn qua đời, cả võ lâm suốt 100 năm sau vẫn lấy võ học của bạn làm thước đo chuẩn mực.
2. **[Khai Tông Lập Tổ - Nhất Đại Tông Sư]:**
   * *Điều kiện:* Tự lập môn phái riêng (hoặc đưa 1 môn phái nhỏ lên làm Đệ nhất đại phái), tự sáng tạo ra ít nhất **1 môn Tuyệt học riêng lúc Bế quan**, truyền thừa thành công qua ít nhất **3 thế hệ (Ông – Cha – Con)**.
   * *Thời điểm xét:* Đây là **Kết cục Dòng tộc**, không xét ở kiếp của người khai phái mà xét khi **kiếp thứ 3** của dòng tộc khép lại. Điều kiện: môn phái do đời thứ 1 sáng lập vẫn tồn tại, đời thứ 3 từng giữ chức Chưởng môn môn phái đó, và môn Tuyệt học tự sáng tạo vẫn nằm trong Tàng Kinh Các Gia Tộc. Danh hiệu được khắc lên văn bia của **Tổ sư (đời thứ 1)**, còn Điểm Luân Hồi được cộng cho kiếp thứ 3 (cộng thêm vào kết cục riêng của kiếp đó, không thay thế).
   * *Mô tả kết cục:* Từ hai bàn tay trắng, bạn đã sánh ngang với Đạt Ma Sư Tổ và Trương Tam Phong, khai sáng ra một đại môn phái trường tồn vạn đại.
3. **[Vị Quốc Vị Dân - Hiệp Chi Đại Giả] (Mô-típ Quách Tĩnh):**
   * *Điều kiện:* Điểm Hiệp nghĩa đạt mức tối đa **$+1000$**, bảo vệ thành công Tương Dương trong đại sự kiện **Sơn Hà Phá Toái** (hoặc hy sinh thân mình cùng tòa thành ở Hiệp 3 để cứu bá tánh).
   * *Mô tả kết cục:* *"Hiệp chi đại giả, vị quốc vị dân"*. Dù sống hay chết, bách tính khắp Trung Nguyên đều lập đền thờ bạn, hương khói ngàn năm không dứt.
4. **[Nhật Xuất Đông Phương - Duy Ngã Độc Tôn] (Ma Đạo Chí Tôn):**
   * *Điều kiện:* Điểm Hiệp nghĩa đạt **$-1000$**, với tư cách **Giáo chủ** Nhật Nguyệt Thần Giáo / Tinh Túc Phái dẫn quân đánh bại Lục đại phái trong sự kiện **Ma Giáo Đông Chinh** (Giáo chủ có thể tự phát động sự kiện này ở mốc 42 hoặc 54 tuổi, xem Hồ sơ 01 mục V), luyện thành *Quỳ Hoa Bảo Điển* hoặc *Hấp Tinh Đại Pháp* cấp tối đa.
   * *Mô tả kết cục:* Cả võ lâm run rẩy dưới gót chân bạn. Các chưởng môn danh môn chính phái mỗi khi nhắc đến tên bạn đều phải biến sắc, thiên hạ quy về một mối bá quyền tàn khốc.

### Nhóm 2: Kỳ Nhân Dị Sĩ & Ẩn Thế Cao Nhân (Tier SS - $+350$ Điểm Luân Hồi)

5. **[Tiêu Dao Giang Hồ - Thần Tiên Quyến Lữ] (Mô-típ Dương Quá – Tiểu Long Nữ / Lệnh Hồ Xung – Nhậm Doanh Doanh):**
   * *Điều kiện:* Sở hữu võ công cấp Trấn phái trở lên, từng vượt qua sự kiện *"Đại Hôn Đẫm Máu"* bảo vệ thê tử, chủ động làm lễ **Kim Bồn Tẩy Thủ** rút lui khỏi giang hồ trước năm 50 tuổi và sống hạnh phúc bên 1 người tri kỷ duy nhất đến cuối đời.
   * *Mô tả kết cục:* Mặc kệ thế gian tranh đoạt Đồ Long hay Cửu Âm, bạn cùng người thương cưỡi điêu dạo bước nơi sơn cốc, đàn tiêu hòa tấu, để lại sau lưng những lời đồn đại đầy ngưỡng mộ của hậu thế.
6. **[Thiên Hạ Đệ Nhất Điên Nhân] (Mô-típ Âu Dương Phong / Chu Bá Thông):**
   * *Điều kiện:* Kết thúc cuộc đời trong trạng thái **[Kinh Mạch Nghịch Hành / Điên Loạn]** nhưng vẫn đánh bại ít nhất 3 Chưởng môn hoặc cao thủ Top 10 thế giới trong lúc điên.
   * *Mô tả kết cục:* Chẳng biết mình là ai, chẳng cần nhớ chiêu thức tên gì, bạn cười ha hả đi trồng cây chuối về cõi cực lạc trong sự kính sợ tột độ của quần hùng.
7. **[Thần Y Cứu Thế - Dược Vương Tái Thế] / [Vạn Độc Ma Quân]:**
   * *Điều kiện:* Y thuật (hoặc Độc thuật) đạt mức Đại sư ($100$), từng dùng máu *Mãng Cổ Chu Thiềm* hoặc *Đại Hoàn Đan* cứu sống hơn 20 NPC có tên tuổi (hoặc dùng *Thất Tâm Hải Đường* / *Sinh Tử Phù* khống chế hơn 20 cao thủ).
   * *Mô tả kết cục:* Diêm Vương muốn người canh ba chết, nhưng bạn có thể giữ người lại đến canh năm (hoặc ngược lại, bạn chính là Diêm Vương trên nhân thế).
8. **[Phú Khả Địch Quốc - Thiên Hạ Đệ Nhất Trang Chủ]:**
   * *Điều kiện:* **Gia sản cá nhân** lúc cuối đời **$\ge 50,000$ lạng bạc** (Ngân lượng cộng giá vốn sản nghiệp theo Hồ sơ 06 Phần II.5, không tính Ngân khố môn phái; mô phỏng cho thấy lối chơi võ học thuần túy chỉ đạt tối đa khoảng $40,000$, còn lối chơi Thương nhân chạm mốc này ở khoảng $8\%$ số đời), thâu tóm toàn bộ vật phẩm ở Hắc Thị Đấu Giá Hội, dùng tiền bạc mua chuộc cả quan phủ lẫn các đại môn phái.
   * *Mô tả kết cục:* Không cần tự tay rút kiếm, chỉ một cái búng tay ném thỏi vàng của bạn cũng đủ khiến các cao thủ đệ nhất thiên hạ phải lao vào chém giết lẫn nhau.
9. **[Độc Cô Cầu Bại - Kiếm Ma Tịch Mịch]:**
   * *Điều kiện:* Chỉ dùng duy nhất các môn Kiếm pháp (*Độc Cô Cửu Kiếm*, *Huyền Thiết Kiếm Pháp*), cả đời **không kết hôn, không nhận đệ tử, không gia nhập môn phái**, chỉ có **Thần Điêu** bầu bạn và lần lượt đánh bại trong Quyết Đấu Tam Hiệp **toàn bộ 10 người** đang đứng trong bảng **Thập Đại Cao Thủ Đương Thời** (tại thời điểm tỷ thí, không cần cùng một năm).
   * *Mô tả kết cục:* *"Tung hoành giang hồ hơn ba mươi năm, giết sạch cừu khấu, bại hết anh hùng, tìm một địch thủ để cầu một trận thua mà không được..."* Bạn chôn kiếm dưới thung lũng sâu rồi lặng lẽ quy ẩn.

### Nhóm 3: Bi Kịch Giang Hồ & Hồng Trần Luân Lạc (Tier A & B - $+100$ đến $+200$ Điểm Luân Hồi)

10. **[Ngụy Quân Tử - Thân Bại Danh Liệt] (Mô-típ Nhạc Bất Quần):**
    * *Điều kiện:* Từng làm Chưởng môn Chính phái với **Thanh danh** $> +300$ trong khi **Hiệp nghĩa thật** $\le 0$ (nhờ các hành động **[Ám]** như giết đồng môn đổ tội, ăn trộm bí kíp, tự cung luyện *Tịch Tà Kiếm Phổ*), rồi bị kích hoạt sự kiện **Đại Vạch Trần** (Hồ sơ 01 mục II.3) trước đại hội võ lâm!
11. **[Tình Trường Đa Đoạn - Huyết Nhuộm Đào Hoa] (Bi kịch Đào Hoa Kiếp):**
    * *Điều kiện:* Có quan hệ tình cảm ($\ge 80$ Hảo cảm) với từ **3 Hồng nhan tri kỷ trở lên cùng lúc**, trong đó có ít nhất 1 người thuộc nguyên mẫu **[Độc Phụ Tuyệt Tình]** hoặc **[Yêu Nữ Ma Giáo]**, dẫn đến sự kiện ghen tuông bị chính các nhân tình hợp sức hạ độc/đâm chết trên giường!
12. **[Phục Quốc Đại Mộng - Hoàng Lương Nhất Mộng] (Mô-típ Mộ Dung Phục):**
    * *Điều kiện:* Xuất thân Thế gia (Mộ Dung gia) hoặc đầu hàng ngoại bang để được phong vương trong sự kiện *Sơn Hà Phá Toái*, phản bội bằng hữu và người yêu để đổi lấy ngai vàng nhưng cuối cùng thất bại trắng tay, ngồi dưới gốc cây nhận đám trẻ con làm thần dân.
13. **[Trọn Đời Làm Tạp Dịch - Tảo Địa Thần Tăng Ẩn Mình]:**
    * *Điều kiện:* Gia nhập Thiếu Lâm / Võ Đang / Toàn Chân ở vị trí **Đệ tử Tạp dịch / Hỏa đầu tăng**, suốt 60 năm không thèm thi thăng cấp lên Nội môn mà chỉ quét chùa, đọc kinh và âm thầm luyện *Dịch Cân Kinh / Tiên Thiên Công* lên cấp $10/10$.
14. **[Bình Phàm Tiểu Nhân Vật - An Nhiên Tự Tại]:**
    * *Điều kiện:* Không học bất kỳ môn võ công nào quá cấp 3, cả đời chỉ làm chủ quán trọ, tiều phu hoặc tiêu sư nhỏ ở Giang Nam, cưới một người vợ hiền lành (hoặc lấy một người chồng hiền lành), sinh 3 đứa con và qua đời trên giường bệnh (chết tự nhiên) ở tuổi $70$ trở lên trong sự quây quần của con cháu.
15. **[Hồng Nhan Bạc Mệnh / Anh Hùng Đoản Mệnh]:**
    * *Điều kiện:* Đã sở hữu thiên phú cao hoặc học được Thần công nhưng bị chết trẻ trước năm **25 tuổi** do bạo phát *[Cửu Dương Tuyệt Mạch]*, bị Cừu gia của cha mẹ truy sát, hoặc uống nhầm độc dược.
16. **[Phản Đồ Vạn Thế Thóa Mạ (Thiên Cổ Tội Nhân)]:**
    * *Điều kiện:* Phản bội từ 3 môn phái trở lên trong một đời người (Học võ xong lại phản sư môn chạy sang phái khác), hoặc mở cổng thành Tương Dương cho quân Bắc Cảnh tràn vào tàn sát võ lâm.
17. **[Khô Cốt Nơi Đáy Vực - Kỳ Ngộ Bất Thành]:**
    * *Điều kiện:* Phúc duyên $< 30$, cố tình chọn nhảy xuống vách núi tìm bí kíp khi bị truy sát nhưng không gặp cây thông hay hang động nào mà... rơi thẳng xuống đá vỡ sọ chết ngay lập tức!
18. **[Chết Yểu Từ Trong Nôi - Kiếp Người Chưa Trọn]:**
    * *Điều kiện:* Qua đời ở giai đoạn $0 - 10$ tuổi do đói rét, bệnh tật hoặc ăn nhầm cóc độc trong đầm lầy mà Căn cốt quá thấp. *(Hệ thống tặng bù $+50$ Điểm Luân Hồi an ủi để đầu thai lại ngay)*.

## PHẦN V: TỔNG KẾT CẤU TRÚC DỰ ÁN "VẠN KIẾP GIANG HỒ" (MASTER INDEX)

Với việc hoàn thành **Hồ sơ 07**, toàn bộ hệ thống thiết kế của dự án *Vạn Kiếp Giang Hồ* đã tạo thành một vòng tròn khép kín, sẵn sàng để chuyển hóa thành cơ sở dữ liệu (JSON/Database) và lập trình logic:

* **Hồ sơ 01:** Thế giới Thần Châu (5 khu vực), 6 Chỉ số gốc, Cơ chế Đầu thai Tuổi 0, Kinh tế Hành động (AP co giãn theo tuổi) & 5 Đại Sự Kiện Thế Giới Động.
* **Hồ sơ 02:** Hệ sinh thái 20+ Môn phái & Thế lực, Tam hệ Nội lực (Âm - Dương - Hòa), 10 Đại Thần Công SSS, Thần Binh Lợi Khí & Cơ chế giao chiến **"Tam Hiệp Định Sinh Tử"**.
* **Hồ sơ 03:** Kịch bản chi tiết giai đoạn Ấu Thơ & Thiếu Niên ($0 - 15$ tuổi), Lễ Thôi Nôi, Kỳ ngộ tuổi thơ và các bài Khảo nghiệm Bái sư.
* **Hồ sơ 04:** Lộ trình thăng tiến Môn phái (5 bậc) & Nghề nghiệp Lãng khách ($16 - 80+$ tuổi), Sự kiện Tranh đoạt ngôi Chưởng môn, Bế quan tự sáng tạo võ học & Kinh mạch nghịch hành tuổi già.
* **Hồ sơ 05:** Kiến trúc AI của 200 NPC động, 6 Nguyên mẫu Hồng nhan tri kỷ, Kết nghĩa Kim lan, Hệ thống Cừu gia báo thù & Cơ chế **"Tử Tôn Truyền Thừa"** (Kèm 3 quy tắc chống lạm phát di sản).
* **Hồ sơ 06:** Công thức Toán học & Xác suất (RNG Engine), Kinh tế Ngân lượng & Chống lạm phát (Hắc Thị, Gia trang), Danh mục Linh Đan Diệu Dược, Kỳ Độc Tà Giáo & Dị Thú Đồng Hành.
* **Hồ sơ 07:** Giao diện UI/UX Text-based màn hình dọc, Hệ thống Văn bia Tổng kết, Cửa hàng Luân Hồi (Meta-progression) & 18 Đại Kết Cục (Endings).
