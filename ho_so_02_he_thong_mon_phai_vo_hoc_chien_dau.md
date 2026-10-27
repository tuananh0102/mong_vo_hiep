# HỒ SƠ 02: HỆ THỐNG MÔN PHÁI, VÕ HỌC & CƠ CHẾ GIAO CHIẾN CHUẨN KIM DUNG

**Mục tiêu thiết kế:** Tạo ra một hệ sinh thái võ lâm đa tầng, nơi người chơi dù xuất thân ở bất kỳ đâu cũng có cơ hội tiếp cận võ học. Hệ thống võ công không chỉ là chỉ số sát thương mà gắn liền với triết lý Âm - Dương, Ngũ Hành, tâm cảnh và cơ chế **Quyết Đấu Tam Hiệp** đậm chất điện ảnh kiếm hiệp.

---

> **Quy ước nguồn:** Tên võ công, vật phẩm mặc định theo **nguyên tác Kim Dung**.
> Mục nào đổi chủ, đổi nơi, tự đặt tên hoặc mượn từ tác giả khác được đánh dấu **(phóng tác)** kèm ghi chú nguyên tác.
> Khi nhập data, mọi võ công và vật phẩm có thêm trường `nguon` = `nguyen_tac` / `phong_tac` để đội nội dung không nhầm.
> **Quyết định tên gọi (2026-10-27, chủ dự án):** game dùng **tên nguyên tác Kim Dung** cho nhân vật, võ công, vật phẩm, môn phái. Dữ liệu vẫn giữ trường `nguon` và bảng ánh xạ tên hiển thị (`du_lieu/ten_hien_thi.json`, mặc định rỗng) để đổi được bằng dữ liệu nếu sau này cần.

## PHẦN I: HỆ THỐNG MÔN PHÁI ĐA TẦNG (TỪ ĐẠI PHÁI ĐẾN GIANG HỒ THẢO MỘC)

Người chơi có thể gia nhập môn phái từ năm **7 tuổi đến 16 tuổi** (bái sư chính thức), hoặc **phản sư môn / học lén / kỳ ngộ** khi đã trưởng thành. Các môn phái chia làm 6 nhóm lớn.
Lưu ý: điều kiện "Hiệp nghĩa" khi gia nhập môn phái là do sư môn phán xét, nên được xét theo **Thanh danh** (xem Hồ sơ 01, mục II.2).

**Quy ước chung cho mọi môn phái** (chốt 2026-10-27, `ke_hoach/05_LO_HONG_GDD.md` G15 - G17, G19):
* Mỗi môn phái có ít nhất 1 Nội công Nhập môn và 1 Khinh công Nhập môn. Phái nào mục dưới không ghi thì dùng môn phóng tác "*(Tên phái) Tâm Pháp*" và "*(Tên phái) Thân Pháp*" (trường `nguon` = `phong_tac`).
* Hệ Nội lực của môn không được nêu ở Phần II.2 lấy theo phái: Thiếu Lâm, Cái Bang, Hoa Sơn, Huyết Đao Môn, Minh Giáo là Chí Dương; Võ Đang, Toàn Chân, Tiêu Dao là Trung Hòa; Nga Mi, Cổ Mộ, Nhật Nguyệt, Tinh Túc, Ngũ Độc là Chí Âm; phái còn lại là Trung Hòa.
* Sư phụ truyền miễn phí khi lên bậc: Bậc 1 võ Nhập môn, Bậc 2 Thượng thừa, Bậc 3 trở lên Trấn phái. Cấp võ học của sư phụ (dùng trong công thức Tiến độ, Hồ sơ 06 I.1): Bậc 1 là $6$, Bậc 2 là $8$, Bậc 3 trở lên là $10$.
* **Tàng Kinh Các môn phái** bán thêm các môn *khác* của phái, cùng tier hoặc thấp hơn bậc hiện tại: Nhập môn $50$, Thượng thừa $150$, Trấn phái $400$ Cống hiến. Tiêu Cống hiến làm chậm thăng cấp, đây là đánh đổi có chủ đích.

### 1. Ngũ Đại Danh Môn Chính Phái (Danh tiếng cao, quy củ nghiêm ngặt)

#### A. Thiếu Lâm Tự (Trung Nguyên) - Thái Sơn Bắc Đẩu
* **Điều kiện gia nhập:** Chỉ nhận Nam giới, Hiệp nghĩa $\ge 0$, Căn cốt $\ge 50$. Có thể xuất gia (tăng giới luật, không được cưới vợ) hoặc làm Đệ tử tục gia (chỉ học được ngoại công).
* **Đặc trưng:** Nội công thâm hậu, phòng ngự vô địch, sở hữu **72 Tuyệt Kỹ**. Tuy nhiên, nếu học quá nhiều tuyệt kỹ mà không đọc *Phật Pháp (Thiền Tông)* tương ứng sẽ bị nội thương trầm trọng (Mô-típ Tiêu Viễn Sơn / Mộ Dung Bác).
* **Hệ thống Võ học:**
    * *Nhập môn:* La Hán Quyền, Vi Đà Chử, Phổ Môn Đao Pháp.
    * *Thượng thừa (72 Tuyệt kỹ):* Long Trảo Thủ, Đại Lực Kim Cương Chỉ, Như Lai Thiên Diệp Thủ, Đạt Ma Kiếm Pháp, Nhiên Mộc Đao Pháp, Vô Tướng Kiếp Chỉ.
    * *Trấn phái:* Dịch Cân Kinh, Tẩy Tủy Kinh, Kim Cương Bất Hoại Thể.

#### B. Võ Đang Phái (Trung Nguyên) - Đạo Gia Chính Tông
* **Điều kiện gia nhập:** Hiệp nghĩa $\ge +50$, Ngộ tính $\ge 50$.
* **Đặc trưng:** "Lấy tĩnh chế động, lấy nhu khắc cương". Càng về già (sau 40 tuổi) nội lực càng tinh thuần, khắc chế cứng các môn phái ngoại công cương mãnh.
* **Hệ thống Võ học:**
    * *Nhập môn:* Võ Đang Trường Quyền, Nhu Vân Kiếm Pháp, Miên Chưởng.
    * *Thượng thừa:* Thần Môn Thập Tam Kiếm (chuyên đánh rơi vũ khí đối phương), Huyền Hư Đao Pháp, Hổ Trảo Tuyệt Hộ Thủ (chiêu thức hiểm độc đánh vào hạ bộ, dùng sẽ bị trừ Hiệp nghĩa), Thê Vân Tung (khinh công bậc nhất).
    * *Trấn phái:* Thái Cực Quyền, Thái Cực Kiếm, Thuần Dương Vô Cực Công.

#### C. Toàn Chân Giáo (Trung Nguyên - Chung Nam Sơn) - Huyền Môn Chính Tông
* **Điều kiện gia nhập:** Hiệp nghĩa $\ge +50$, Căn cốt $\ge 45$. Phải xuất gia làm Đạo sĩ (Cấm tửu sắc, không được kết hôn chính thức; nếu phá giới tư thông với đệ tử Cổ Mộ Phái sẽ bị coi là khi sư diệt tổ).
* **Đặc trưng:** Nội công đạo gia tinh thuần, tốc độ tu luyện ban đầu chậm nhưng nền tảng cực vững chắc (Khi dùng Nội công Toàn Chân làm **Tâm pháp chủ đạo**, tỷ lệ Tẩu hỏa nhập ma luôn bằng $0\%$, xem công thức $P_{THNM}$ ở Hồ sơ 06). Cực mạnh khi đánh hội đồng nhờ **Trận pháp**.
* **Mối quan hệ định mệnh:** Nằm sát vách **Cổ Mộ Phái**. Đệ tử Toàn Chân đi tuần núi phía sau có $25\%$ tỷ lệ mỗi năm gặp gỡ nữ đệ tử Cổ Mộ, dễ nảy sinh cốt truyện *"Đạo sĩ động tâm phàm"* (Mô-típ Doãn Chí Bình hoặc Vương Trùng Dương - Lâm Triều Anh).
* **Hệ thống Võ học:**
    * *Nhập môn:* Toàn Chân Kiếm Pháp, Hạo Nhiên Chưởng, Kim Nhạn Công (Khinh công bay thẳng lên vách núi).
    * *Thượng thừa:* Tam Hoa Tụ Đỉnh Chưởng, Đồng Quy Kiếm Pháp (Chiêu thức liều mạng một đổi một với kẻ địch mạnh hơn), **Bắc Đẩu Thất Tinh Trận** (Khi giao chiến có thể gọi thêm 6 đạo sĩ đồng môn lập trận, tăng $150\%$ phòng thủ).
    * *Trấn phái:* **Tiên Thiên Công** (Tuyệt học của Vương Trùng Dương tại Hoa Sơn Luận Kiếm lần 1 – Nội lực Trung hòa chí tôn, tự động đả thông kỳ kinh bát mạch và khắc chế tuyệt đối *Hàm Mô Công* của Bạch Đà Sơn).

#### D. Cái Bang (Khắp Thần Châu) - Thiên Hạ Đệ Nhất Đại Bang
* **Điều kiện gia nhập:** Không yêu cầu chỉ số, nhưng Gia cảnh phải là *Hàn Vi* hoặc *Bình Dân*, Ngân lượng khi gia nhập $< 10$ lạng. Chia làm **Áo Sạch (Tịnh Y)** và **Áo Bẩn (Ô Y)**.
* **Đặc trưng:** Hệ thống thăng cấp từ 1 Túi đến 9 Túi. Càng lên cao càng được học võ công mạnh và có mạng lưới tình báo khắp thiên hạ.
* **Hệ thống Võ học:**
    * *Nhập môn:* Thái Tổ Trường Quyền, Liên Hoa Lạc, Đồng Chùy Thủ.
    * *Thượng thừa:* Phong Ma Trượng Pháp, Tiêu Dao Du, Tỏa Hầu Cầm Nã Thủ.
    * *Trấn phái:* Hàng Long Thập Bát Chưởng (Dương cương đệ nhất), Đả Cẩu Bổng Pháp (Tinh diệu đệ nhất).

#### E. Nga Mi Phái (Tây Nam) - Tiên Nữ Kiếm Tông
* **Điều kiện gia nhập:** Ưu tiên Nữ giới (Nam giới chỉ được làm đệ tử ngoại môn giữ chức tạp dịch, trừ khi có kỳ ngộ đặc biệt), Mị lực $\ge 50$, Hiệp nghĩa $\ge 0$.
* **Đặc trưng:** Võ công kết hợp giữa sự thanh thoát của Đạo gia và từ bi (nhưng đôi khi cực đoan) của Phật gia. Cực mạnh khi đối đầu với Tà phái.
* **Hệ thống Võ học:**
    * *Nhập môn:* Hồi Phong Phất Liễu Kiếm, Tứ Tượng Chưởng, Kim Đỉnh Miên Chưởng.
    * *Thượng thừa:* Tuyệt Diệt Kiếm Pháp, Thiên Cương Chỉ Huyệt Pháp, Nga Mi Cửu Dương Công.
    * *Trấn phái:* Ỷ Thiên Kiếm Quyết, Phật Quang Phổ Chiếu.

---

### 2. Thế Lực Khởi Nghĩa, Tà Phái & Ma Giáo (Thực lực bá đạo, hành sự bất chấp quy củ)

#### A. Minh Giáo (Tây Vực - Quang Minh Đỉnh) - "Hành Thiện Khứ Ác, Liên Hoa Sáng Thế"
* **Bản chất:** Vốn là giáo phái khởi nghĩa cứu khổ cứu nạn nhân dân khỏi triều đình thối nát, nhưng vì hành tung bí ẩn, ăn mặc kỳ dị và ra tay quyết liệt nên bị Danh môn chính phái vu cho là "Ma Giáo".
* **Điều kiện gia nhập:** Hiệp nghĩa từ $-100$ đến $+300$ (Chính tà đều nhận, miễn là có lòng nghĩa khí với huynh đệ), Căn cốt $\ge 60$.
* **Đặc trưng Gameplay:** Tổ chức gồm Quang Minh Tả/Hữu Sứ, Tứ Đại Pháp Vương, Ngũ Tán Nhân. Nội bộ thường phân tranh khi thái bình, nhưng khi có ngoại xâm (Kịch bản *Lục Đại Phái vây Quang Minh Đỉnh* hoặc *Sơn Hà Phá Toái*), toàn giáo đoàn kết một lòng.
* **Hệ thống Võ học:**
    * *Nhập môn:* Thánh Hỏa Lệnh Công (Bản cơ bản), Ngũ Hành Kỳ Trận Pháp, Phi Sa Tẩu Thạch Thập Tam Thức (phóng tác).
    * *Thượng thừa:* **Hàn Băng Miên Chưởng** (Thanh Dực Bức Vương), **Ưng Trảo Cầm Nã Thủ** (Bạch Mi Ưng Vương), **Thất Thương Quyền** (Kim Mao Sư Vương; nguyên tác là võ công Không Động bị Tạ Tốn cướp bí kíp, nên ở đây chỉ học được qua nhánh của Sư Vương), **Tiêu Diêu Ngự Phong** (phóng tác).
    * *Trấn phái:* **Càn Khôn Đại Na Di (7 Tầng)** (Kích phát tiềm năng cơ thể, sao chép và dịch chuyển lực đạo của mọi chiêu thức trong thiên hạ) & **Thánh Hỏa Lệnh Thần Công (Trọn bộ 6 tấm)**.

#### B. Nhật Nguyệt Thần Giáo (Trung Nguyên/Hà Bắc - Hắc Mộc Nhai) - "Nhật Xuất Đông Phương, Duy Ngã Bất Bại"
* **Bản chất:** Tổ chức Hắc đạo bá quyền thực thụ, sùng bái quyền lực tuyệt đối. Giáo chủ coi giáo chúng như cỏ rác, dùng độc dược khống chế thuộc hạ.
* **Điều kiện gia nhập:** Hiệp nghĩa $\le -150$. Khi lên chức Đường chủ bắt buộc phải uống **Tam Thi Não Thần Đan** (Mỗi năm phải làm xong nhiệm vụ tàn sát do Giáo chủ giao mới được phát thuốc giải, nếu không não sẽ bị sâu cắn chết!).
* **Đặc trưng Gameplay:** Đấu đá chính trị tàn khốc giữa phe **Tiền nhiệm Giáo chủ** (kiểu Nhậm Ngã Hành) và phe **Đương nhiệm Giáo chủ** (kiểu Đông Phương Bất Bại). Người chơi có thể chọn phò tá 1 trong 2 phe hoặc ngư ông đắc lợi giết cả hai để soán ngôi!
* **Hệ thống Võ học:**
    * *Nhập môn:* Hắc Huyết Thần Châm, Nhật Nguyệt Đao Pháp, Quỷ Ngục Âm Phong Hống.
    * *Thượng thừa:* **Đại Phong Vân Phi Chưởng**, **Khai Sơn Chưởng**, **Linh Xà Châm Pháp**.
    * *Trấn phái:* **Hấp Tinh Đại Pháp** (Hút cạn nội lực người khác biến thành của mình, nhưng có nguy cơ dị chủng chân khí phản phệ) & **Quỳ Hoa Bảo Điển** (Bản gốc do Giáo chủ cất giữ trong mật thất Hắc Mộc Nhai).

#### C. Tinh Túc Phái (Tây Vực - Tinh Túc Hải)
* **Điều kiện gia nhập:** Hiệp nghĩa $\le -100$.
* **Đặc trưng:** Không phân biệt tôn ti theo tuổi tác, **ai võ công cao hơn người đó là Đại sư huynh**. Muốn học võ công mới phải dùng ngân lượng mua bảo vật hoặc chọn các câu thoại "Nịnh bợ sư phụ".
* **Hệ thống Võ học:**
    * *Nhập môn:* Tinh Túc Độc Chưởng, Trừu Tủy Chưởng.
    * *Thượng thừa:* Tam Âm Ngô Công Trảo, Trích Tinh Công, Luyện Tâm Đạn (Ám khí độc).
    * *Trấn phái:* Hóa Công Đại Pháp (Phá hủy trực tiếp nội lực đối phương bằng độc tố).

#### D. Ngũ Độc Giáo (Nam Cương)
* **Điều kiện gia nhập:** Bất kỳ, nhưng phải vượt qua thử thách "Vạn Xà Quật" `[Roll: Phúc duyên vs 50 HOẶC Căn cốt vs 60]`.
    * *Thành công:* Bước ra khỏi hang rắn, được nhận làm đệ tử.
    * *Thất bại:* Bị độc xà cắn trọng thương, được kéo ra trong tình trạng hấp hối và không được nhận (Điểm Ám Thương $+5$, Kháng độc $+10\%$). Có thể thử lại sau 2 năm.
* **Đặc trưng:** Nuôi dưỡng 5 loài độc trùng (Rết, Bò cạp, Nhện, Rắn, Cóc) trong cơ thể để chiến đấu và ám sát.
* **Hệ thống Võ học:** Thiên Chu Vạn Độc Thủ (phóng tác: nguyên tác là võ công của Ân Ly; mỗi cấp độ phải cho 100 con nhện hoa cắn, khiến Mị lực giảm dần về $0$ nhưng sát thương độc vô phương cứu chữa), Kim Xà Tiên Pháp, Vạn Cổ Phệ Tâm Quyết.

#### E. Huyết Đao Môn (Bắc Cảnh - Tuyết Sơn)
* **Điều kiện gia nhập:** Hiệp nghĩa $\le -300$ (Ác nhân bị truy nã mới tìm đến).
* **Đặc trưng:** Một đám hòa thượng tà dâm, tàn bạo ẩn náu nơi núi tuyết. Đao pháp quỷ dị, chuyên chém từ những góc độ không tưởng.
* **Hệ thống Võ học:** Huyết Đao Kinh, Huyết Hải Ma Công, Diệt Tuyệt Đao Pháp (phóng tác; máu càng thấp sát thương càng tăng gấp bội).

---

### 3. Môn Phái Ẩn Thế & Kỳ Dị (Yêu cầu Kỳ ngộ hoặc Thiên phú cao)

#### A. Tiêu Dao Phái (Vô Lượng Sơn / Thiên Sơn)
* **Điều kiện gia nhập:** Mị lực $\ge 80$ VÀ Ngộ tính $\ge 80$. Chỉ tuyển nhận qua kỳ ngộ giải cờ vây hoặc cầm kỳ thi họa.
* **Đặc trưng:** Đệ tử cực ít nhưng ai cũng là tuyệt thế cao nhân. Yêu cầu học cả Cầm - Kỳ - Thi - Họa - Y - Độc song song với võ học.
* **Hệ thống Võ học:** Bắc Minh Thần Công, Lăng Ba Vi Bộ, Thiên Sơn Lục Dương Chưởng, Thiên Sơn Chiết Mai Thủ, Tiểu Vô Tướng Công, Bát Hoang Lục Hợp Duy Ngã Độc Tôn Công (Trẻ mãi không già nhưng cứ 30 năm lại bị biến thành đứa trẻ mất sạch công lực trong vài tháng).

#### B. Cổ Mộ Phái (Chung Nam Sơn)
* **Điều kiện gia nhập:** Chỉ nhận **Nữ giới** có Mị lực $\ge 75$ (Nam giới chỉ được nhận qua sự kiện ẩn nếu Mị lực $\ge 75$ VÀ Phúc duyên $\ge 65$, xem Hồ sơ 03). Phải phát thệ cả đời không bước chân khỏi núi (nếu xuống núi sẽ bị coi là phản đồ hoặc kích hoạt cốt truyện Tình Kiếp).
* **Đặc trưng:** Sống trong hầm mộ tối tăm, ngủ trên Hàn Ngọc Sàng (tăng tốc độ luyện nội công gấp đôi).
* **Hệ thống Võ học:** Ngọc Nữ Tâm Kinh (Cần 1 NPC tri kỷ cùng tu luyện), Thiên La Địa Võng Thế, Ngọc Phong Châm, Mỹ Nhân Quyền, Ngân Sách Kim Linh.

#### C. Đào Hoa Đảo (Đông Hải)
* **Điều kiện gia nhập:** Ngộ tính $\ge 75$, tính tình cổ quái (Hiệp nghĩa từ $-200$ đến $+200$).
* **Đặc trưng:** Kết hợp võ công với Kỳ môn ngũ hành, Toán học và Âm luật.
* **Hệ thống Võ học:** Đàn Chỉ Thần Công, Lạc Anh Thần Kiếm Chưởng, Ngọc Tiêu Kiếm Pháp, Bích Hải Triều Sinh Khúc (Dùng tiếng tiêu làm nổ tung tim gan kẻ có nội lực thấp), Lan Hoa Phất Huyệt Thủ.

---

### 4. Các Môn Phái Vừa & Ngũ Nhạc Kiếm Phái (Xương sống của Giang hồ)

Đây là các môn phái người chơi dễ gia nhập nhất ở độ tuổi thiếu niên, chứa đựng nhiều âm mưu tranh quyền đoạt vị nhất:

| Môn Phái | Khu Vực | Đặc Trưng Cốt Truyện | Võ Học Tiêu Biểu |
| :--- | :--- | :--- | :--- |
| **Hoa Sơn Phái** | Trung Nguyên | Chia rẽ sâu sắc giữa **Kiếm Tông** (trọng chiêu thức, mạnh nhanh lúc đầu) và **Khí Tông** (trọng nội lực, vô địch về sau). | Tử Hà Thần Công, Hoa Sơn Kiếm Pháp, Hỗn Nguyên Chưởng, Độc Cô Cửu Kiếm (Kỳ ngộ). |
| **Tung Sơn Phái** | Trung Nguyên | Dã tâm cực lớn, chưởng môn muốn thống nhất các phái nhỏ để đối đầu Thiếu Lâm - Võ Đang. | Đại Tung Dương Thần Chưởng, Hàn Băng Chân Khí, Tung Sơn Thập Thất Lộ Kiếm. |
| **Hằng Sơn / Hành Sơn** | Trung Nguyên / Giang Nam | Hằng Sơn toàn ni cô từ bi (giỏi phòng thủ); Hành Sơn kết hợp kiếm thuật với đàn Hồ Cầm. | Vạn Hoa Kiếm Pháp, Thiên Trường Chưởng (Hằng Sơn); Hành Sơn Ngũ Thần Kiếm, Bách Biến Thiên Huyễn Kiếm (Hành Sơn). |
| **Thanh Thành Phái** | Tây Nam | Bề ngoài danh môn nhưng thực chất hẹp hòi, háo thắng, hay bắt nạt môn phái nhỏ. | Tùng Phong Kiếm Pháp, Vô Ảnh Huyễn Cước, Thanh Thành Tồi Tâm Chưởng. |
| **Tuyết Sơn Phái (Lăng Tiêu Thành)** | Bắc Cảnh | Tự xưng kiếm pháp đệ nhất thiên hạ, kiêu ngạo, tự cô lập trên đỉnh núi băng. | Tuyết Sơn Kiếm Pháp (Lục hợp tuyết hoa), Hàn Mai Thần Công. |
| **Côn Luân Phái** | Tây Vực | Nơi giao thoa giữa văn hóa Trung Nguyên và Tây Vực, nổi tiếng với Cầm kiếm song tuyệt. | Lưỡng Nghi Kiếm Pháp, Côn Luân Thập Tam Thức, Tấn Lôi Kiếm. |
| **Không Động Phái** | Tây Bắc | Môn phái lâu đời, võ công đi theo hướng tự tổn hại bản thân để đổi lấy sát thương tức thời. | Thất Thương Quyền (Tự tổn thương ngũ tạng nếu Cảnh giới Nội công $< 7$), Không Động Pháp Quyết. |

---

### 5. Tứ Đại Võ Lâm Thế Gia (Chỉ gia nhập qua Xuất thân hoặc Ở rể/Môn khách)

1. **Cô Tô Mộ Dung Gia (Giang Nam):**
   * *Võ học:* **Đẩu Chuyển Tinh Di** (Phản đòn sát thương và chiêu thức của kẻ địch trả lại cho chính họ), Tham Hợp Chỉ, Liễu Nhứ Kiếm Pháp.
   * *Gánh nặng:* Luôn bị ép buộc thực hiện mưu đồ "Phục Quốc", nếu từ chối sẽ bị gia tộc truy sát.
2. **Đại Lý Đoàn Thị (Nam Cương):**
   * *Võ học:* Nhất Dương Chỉ, **Lục Mạch Thần Kiếm** (Hóa khí thành kiếm vô hình, yêu cầu Căn cốt $\ge 90$), Khô Vinh Thiền Công.
   * *Đặc quyền:* Xuất thân hoàng gia: khởi đầu với $3,000$ lạng và từ 16 tuổi nhận **trợ cấp hoàng tộc $300$ lạng/năm** (mất vĩnh viễn nếu bị trục xuất khỏi gia tộc hoặc Thanh danh $\le -300$). Được học y thuật trị thương bằng điểm huyệt.
3. **Bạch Đà Sơn Âu Dương Gia (Tây Vực):**
   * *Võ học:* **Hàm Mô Công** (Cóc thần công - Tích tụ lực đạo phản kích một đòn chí mạng), Linh Xà Quyền Pháp, Thần Đà Tuyết Sơn Chưởng.
   * *Đặc quyền:* Điều khiển đàn rắn độc khổng lồ, miễn nhiễm với hầu hết độc dược cấp thấp.
4. **Hồ Gia & Miêu Gia Quan Ngoại (Bắc Cảnh):** Hai nhà thế thù trăm năm (Hồ Nhất Đao và Miêu Nhân Phượng), người chơi chỉ vào được một nhà; học lén võ nhà kia là hành động [Ám].
   * *Võ học Hồ gia:* **Hồ Gia Đao Pháp** (Từng chiêu từng thức chậm rãi nhưng kín kẽ không chút sơ hở), Tứ Tượng Bộ Pháp (phóng tác).
   * *Võ học Miêu gia:* **Miêu Gia Kiếm Pháp**.

---

### 6. Các Môn Phái Nhỏ, Bang Hội & Sát Thủ Đường (Tầng lớp đáy giang hồ)

Dành cho người chơi có chỉ số thấp lúc đầu đời, muốn đi lên từ bùn lầy hoặc làm nghề tự do:

* **Phúc Uy Tiêu Cục (Giang Nam):** Học được *Tịch Tà Kiếm Pháp (Bản giả - 72 lộ)* không cần tự cung nhưng uy lực yếu. Hàng năm làm nhiệm vụ Bảo tiêu kiếm rất nhiều Ngân lượng.
* **Hải Sa Bang / Cự Kình Bang (Ven biển):** Buôn lậu muối và thủy chiến. Võ công: *Diêm Chưởng* (Tung muối mù mắt đối phương rồi chém lén), *Phá Lãng Đao Pháp*.
* **Thập Vạn Đại Sơn Trại (Lục lâm thảo khấu):** Chuyên cướp của nhà giàu. Võ công: *Ngũ Hổ Đoạn Môn Đao*, *Quỷ Đầu Đao Pháp*, *Cuồng Phong Khoái Đao*.
* **Hắc Phong Lâu (Sát thủ đường):** Nhận tiền lấy mạng người. Võ công: *Vô Ảnh Châm*, *Ám Dạ Thích Thuật* (Tăng $300\%$ sát thương ở lượt đánh lén đầu tiên).
* **Dược Vương Cốc (Y gia ẩn thế):** Không dạy võ đánh nhau mạnh, nhưng dạy *Châm Cứu Thuật*, *Độc Thủ Dược Vương*, có khả năng tự hồi sinh **1 lần trong đời nếu chết trước 30 tuổi** (tính là hiệu ứng cứu mạng, hồi sinh với $30\%$ HP và Điểm Ám Thương $+10$) hoặc chế thuốc tăng Căn cốt vĩnh viễn.

---

## PHẦN II: CẤU TRÚC & CƠ CHẾ VÕ HỌC CHUYÊN SÂU

Để mang lại cảm giác tu luyện chân thực nhất, võ học trong game được chia thành **4 Trụ cột** và **3 Thuộc tính Nội lực**.

### 1. Bốn Trụ Cột Võ Học của Nhân Vật
Mỗi nhân vật có các ô trang bị võ công (Skill Slots). Số ô của từng trụ cột:

| Trụ cột | Số ô | Ghi chú |
| :--- | :--- | :--- |
| Nội Công - Chủ đạo | $1$ | Luôn có. |
| Nội Công - Phụ trợ | $0$ (Ngộ tính $< 40$), $1$ (Ngộ tính $40 - 69$), $2$ (Ngộ tính $\ge 70$) | Người Ngộ tính thấp tập trung vào 1 môn duy nhất. |
| Ngoại Công | $2 + \lfloor\frac{\text{Ngộ Tính}}{25}\rfloor$, tối đa $6$ | Ngộ tính $10$ có 2 ô, Ngộ tính $100$ có 6 ô. *Song Thủ Hỗ Bác* cộng thêm 1 ô. |
| Khinh Công | $1$ | Luôn có. |
| Tuyệt Kỹ / Trận Pháp | $1 + \lfloor\frac{\text{Căn Cốt}}{50}\rfloor$, tối đa $3$ | Tính theo Căn cốt để lối chơi Ngộ tính thấp vẫn có chiều sâu. |

* **Ngoại lệ Thái Huyền Kinh:** Chiếm 1 ô Nội công chủ đạo nhưng đồng thời được tính là 1 môn Ngoại công (Kiếm) và 1 môn Khinh công ("dung hợp làm một"), giải phóng các ô đó cho võ công khác.
* Khi Ngộ tính hoặc Căn cốt giảm làm mất ô, môn võ ở ô cuối bị tháo ra (vẫn giữ Cấp Võ học, chỉ không trang bị được).

1. **Nội Công Tâm Pháp (1 Môn chủ đạo + tối đa 2 Môn phụ trợ):** Quyết định **Cảnh giới Nội công**, Nội tức tối đa ($MP_{max}$), tốc độ hồi khí mỗi năm và **Hệ Nội lực**.
2. **Ngoại Công Chiêu Thức (Quyền/Chưởng, Chỉ/Trảo, Kiếm, Đao, Kỳ môn/Bổng, Ám khí):** Dùng để tấn công, phá phòng ngự hoặc điểm huyệt.
3. **Khinh Công Thân Pháp (1 Môn):** Quyết định khả năng né tránh trong giao chiến và **tỷ lệ chạy trốn thành công** khi gặp cao thủ quá mạnh trên giang hồ.
   * **Trần cấp theo tier:** Nhập môn tối đa cấp $4$ (*Kim Nhạn Công*), Thượng thừa $6$ (*Thê Vân Tung*), Trấn phái $8$, Thần công SSS $10$ (*Lăng Ba Vi Bộ*, *Thần Hành Bách Biến*). Tiến độ luyện vẫn theo Tier factor như mọi môn võ (Hồ sơ 06 I.1).
   * *Lý do (`mo_phong/BAO_CAO.md` mục 19):* Chiến lực, Giảm trừ và Roll Khinh công chỉ dùng **Cấp**, không dùng tier. Không có trần thì môn Nhập môn (Tier factor $1$) lên cấp $10$ rẻ gấp $3 - 5$ lần môn cao cấp, và mô phỏng cho thấy $100\%$ đời Chính phái dùng khinh công Nhập môn đến cuối đời. Có trần thì khoảng $55\%$ dùng môn Trấn phái, $20\%$ Thượng thừa.
4. **Tuyệt Kỹ Đặc Thù / Trận Pháp:** Các kỹ năng bị động như Phản đòn, Hút nội lực, Giả chết (*Quy Tức Công*), hoặc Dịch dung (*Thuật Dịch Dung*).

### 2. Tam Hệ Nội Lực & Sự Xung Khắc (Âm - Dương - Hòa)
* **Hệ Chí Dương (Đỏ):** *Cửu Dương Thần Công, Dịch Cân Kinh, Tử Hà Thần Công, Thuần Dương Vô Cực Công.*
    * *Ưu điểm:* Sát thương bùng nổ, miễn nhiễm hàn độc, tự động đốt cháy độc tố.
    * *Khắc chế:* Đè bẹp nội lực Hệ Âm khi tỷ thí nội lực trực diện.
    * *Bị khắc chế bởi:* Trung Hòa ("Lấy nhu khắc cương", dương cương càng mạnh càng bị dẫn lệch).
* **Hệ Chí Âm / Hàn Độc (Xanh lam):** *Cửu Âm Chân Kinh, Ngọc Nữ Tâm Kinh, Hàn Băng Chân Khí, Hóa Công Đại Pháp, Quỳ Hoa Bảo Điển.*
    * *Ưu điểm:* Tốc độ ra chiêu cực nhanh, gây trạng thái đóng băng/trúng độc/phong bế huyệt đạo mỗi lượt.
    * *Khắc chế:* Trung Hòa (hàn khí âm độc thấm dần vào kinh mạch, nội lực ôn hòa không đủ cương mãnh để bức ra) và Ngoại công thuần (xuyên thủng các lớp giáp ngoại công dễ dàng).
    * *Bị khắc chế bởi:* Chí Dương.
* **Hệ Trung Hòa / Hỗn Nguyên (Vàng):** *Thái Cực Thần Công, Bắc Minh Thần Công, Tiểu Vô Tướng Công, Tiên Thiên Công.*
    * *Ưu điểm:* Không bị phản phệ, có thể vận dụng mọi loại chiêu thức trong thiên hạ mà không bị giảm uy lực.
    * *Khắc chế:* Chí Dương ("Lấy tĩnh chế động, lấy nhu khắc cương").
    * *Bị khắc chế bởi:* Chí Âm.

> **Cơ chế "Xung Đột Nội Lực" & "Âm Dương Giao Thái":**
> Nếu người chơi cùng lúc luyện 1 môn Chí Dương và 1 môn Chí Âm mà không có thiên phú hoặc kỳ ngộ điều hòa, mỗi năm sẽ có $30\%$ tỷ lệ **Tẩu Hỏa Nhập Ma** (Mất $50\%$ HP, Căn cốt $-5$, Điểm Ám Thương $+5$; nặng thì hóa điên làm loạn giang hồ). Ngược lại, nếu tìm được cách dung hợp (như Trương Vô Kỵ hoặc Dương Quá), nhân vật sẽ mở khóa trạng thái **Âm Dương Hỗ Tế** – sát thương và phòng thủ nhân đôi!
> * *Cách mở khóa (chốt G23):* kỳ ngộ cấp S, chỉ xuất hiện khi đang có 1 Nội công Chí Dương và 1 Nội công Chí Âm cùng đạt cấp $\ge 5$. Sau khi có trạng thái này, tỷ lệ Tẩu Hỏa do song tu bằng $0$. Mức "nhân đôi" phải chạy mô phỏng (`mo_phong/`) trước khi bật trong game; nếu Chiến lực vượt khung Thập Đại Cao Thủ thì mở vòng cân bằng mới.

> **Cơ chế "Ma Công" (đặc quyền của Tà phái):**
> Võ công Trấn phái của Tà phái là **Ma công**: *Hấp Tinh Đại Pháp* (Nhật Nguyệt), *Hóa Công Đại Pháp* (Tinh Túc), *Huyết Hải Ma Công* (Huyết Đao Môn), *Vạn Cổ Phệ Tâm Quyết* (Ngũ Độc Giáo).
> Chỉ phát huy khi **Hiệp nghĩa $\le -300$** (Ma Tâm, Hồ sơ 01 II.2); Hiệp nghĩa cao hơn thì Ma công chỉ là một môn Trấn phái bình thường.
> * *Sức mạnh:* Uy lực chiêu thức và Điểm Tier Chiến lực tính **như Thần công SSS** ($320$ và $45$, Hồ sơ 06 I.4, I.5), nhưng Tier factor vẫn là Trấn phái ($3$), nên học nhanh hơn SSS.
> * *Phản phệ:* Mỗi năm còn trang bị Ma công có $3\%$ tỷ lệ **Tẩu Hỏa Nhập Ma** (Căn cốt $-5$, Điểm Ám Thương $+5$, không phải tán công). Trung bình khoảng $1,6$ lần mỗi đời, tức mất khoảng $8$ năm tuổi thọ và $10$ Chiến lực.
> * *Lý do (mô phỏng `mo_phong/BAO_CAO.md` mục 18):* không có Ma công, Tà phái chỉ chiếm khoảng $1\%$ Thập Đại Cao Thủ; có Ma công thì khoảng $10\% - 13\%$, và khoảng $1/4$ đời Tà phái vào Top 10 ít nhất 1 lần (Chính phái khoảng $40\%$). Mức phản phệ $0\%$ cho Tà phái $28\%$ Top 10 (quá mạnh), $10\%$ đưa về lại $2\%$.

---

## PHẦN III: KHO TÀNG TUYỆT HỌC GIANG HỒ & KỲ THƯ THẤT TRUYỀN

Đây là những bộ võ công **không thuộc về môn phái cố định nào** (hoặc đã thất truyền), người chơi chỉ có thể đạt được qua các sự kiện Kỳ Ngộ, Tranh đoạt Bảo vật, hoặc giải mã bí mật trong kiếp sống:

### 1. Thập Đại Thần Công Đỉnh Phong (Tier SSS)

1. **Cửu Âm Chân Kinh (Thượng & Hạ quyển):**
   * *Nguồn gốc:* Hoàng Thường sáng tác. Chia làm Nội công (Bắc Đẩu Đại Pháp, Dịch Cân Đoán Cốt Thiên) và Ngoại công (Cửu Âm Bạch Cốt Trảo, Thôi Tâm Chưởng, Bạch Mãng Tiên Pháp).
   * *Điểm đặc sắc:* Nếu chỉ nhặt được quyển Hạ mà không có quyển Thượng (như Mai Siêu Phong), người chơi phải giết người lấy sọ luyện công (Hiệp nghĩa giảm $-100$/năm, biến thành Tà ma). Nếu có đủ 2 quyển + đọc hiểu *Phạn văn tổng cương*, sẽ trở thành đệ nhất cao thủ Chính đạo.
2. **Cửu Dương Thần Công:**
   * *Nguồn gốc:* Chép trong kẽ chữ cuốn *Lăng Già Kinh*, giấu trong bụng vượn trắng ở Côn Luân. Nhận được khi thu phục **Bạch Viên Côn Luân** (Hồ sơ 06 Phần V.2), đây là cùng một sự kiện.
   * *Hiệu ứng:* Nội lực tự sinh sôi vô tận, bách độc bất xâm, tự động phản chấn gãy xương kẻ địch dùng quyền cước đánh vào người, chữa lành mọi vết thương chí mạng sau 1 năm.
3. **Độc Cô Cửu Kiếm:**
   * *Nguồn gốc:* Kiếm ma Độc Cô Cầu Bại truyền lại (Qua Phong Thanh Dương hoặc Kiếm Mộ).
   * *Cơ chế:* Không cần nội lực! Gồm 9 thức: *Tổng Quyết Thức, Phá Kiếm, Phá Đao, Phá Thương, Phá Tiên, Phá Tác, Phá Chưởng, Phá Tiễn, Phá Khí*. Khi đối thủ dùng đúng loại binh khí nào, người chơi sẽ có lựa chọn **"Nhìn thấu sơ hở - Một kiếm tất sát"** vô hiệu hóa hoàn toàn chiêu thức đó.
4. **Quỳ Hoa Bảo Điển / Tịch Tà Kiếm Phổ:**
   * *Câu thoại kinh điển khi mở sách:* *"Dục luyện thần công, dẫn đao tự cung"*.
   * *Sự đánh đổi:* Nếu chọn **Tự cung**: Mị lực giảm mạnh (giọng nói the thé, râu rụng), vĩnh viễn mất dòng lựa chọn Kết hôn / Sinh con nối dõi, tâm tính ngày càng thất thường. Đổi lại: **tốc độ tu luyện cực nhanh** (Tier Factor chỉ $2.5$ như võ công Thượng thừa, thay vì $5.0$ của Thần công SSS) và **Tốc độ ra đòn + Sát thương tăng $+10\%$ mỗi Cấp Võ học** của môn này (tối đa $+100\%$ ở Cấp $10/10$). Ở Hiệp 1 Tam Hiệp, người luyện Quỳ Hoa từ Cấp 5 trở lên luôn ra đòn trước khi hai bên chọn trùng hướng tiếp cận. Nếu không tự cung mà cố luyện: `[Roll: Cảnh giới Nội công × 10 vs 90]` mỗi lần luyện; thất bại thì nổ mạch máu chết tại chỗ.
5. **Thái Huyền Kinh (Hiệp Khách Đảo):**
   * *Điều kiện:* Ngộ tính phải $< 20$ (Không biết chữ). Những kẻ Ngộ tính cao nhìn vào vách đá sẽ bị cuốn vào giải nghĩa chữ nghĩa đến mức thổ huyết mà chết. Người mù chữ nhìn nét chữ thành hình người múa kiếm, tự động dung hợp cả Nội công, Kiếm pháp, Khinh công làm một.
6. **Lục Mạch Thần Kiếm:**
   * *Cơ chế:* 6 ngón tay phóng ra 6 đạo kiếm khí (Thiếu Thương, Thương Dương, Trung Xung, Quan Xung, Thiếu Xung, Thiếu Trạch). Nếu Căn cốt $< 90$, kiếm khí sẽ **lúc linh lúc không** (tỷ lệ $50\%$ bắn ra được, $50\%$ đứng ngây người bị đánh – chuẩn mô-típ Đoàn Dự).
7. **Ám Nhiên Tiêu Hồn Chưởng:**
   * *Điều kiện kích hoạt:* Do người chơi tự sáng tạo hoặc học từ Thần Điêu Đại Hiệp, nhưng **chỉ phát huy uy lực khi đang mang trạng thái [Đau Khổ Tột Cùng / Thất Tình / Mất Tri Kỷ]** hoặc khi bị cụt 1 cánh tay. Nếu cuộc sống viên mãn hạnh phúc, bộ chưởng pháp này yếu như quyền cước thông thường!
8. **Song Thủ Hỗ Bác Thuật (Của Chu Bá Thông):**
   * *Điều kiện:* Tâm tư thuần khiết, Ngộ tính $< 40$.
   * *Hiệu ứng:* Tay trái đánh một chiêu, tay phải đánh một chiêu – cho phép nhân vật **ra đòn 2 lần trong cùng 1 lượt chiến đấu**, hoặc tự kết hợp *Toàn Chân Kiếm Pháp* + *Ngọc Nữ Kiếm Pháp* thành *Ngọc Nữ Tố Tâm Kiếm* mà không cần bạn đồng hành!
9. **Huyền Thiết Kiếm Pháp:**
   * *Điều kiện:* Sở hữu thanh *Huyền Thiết Trọng Kiếm* (nặng 81 cân, yêu cầu Căn cốt $\ge 80$ mới cầm nổi) và luyện kiếm dưới thác nước hoặc sóng biển Đông Hải.
   * *Triết lý:* "Trọng kiếm vô phong, đại xảo bất công" – Không có chiêu thức hoa mỹ, mỗi nhát chém dùng sức nặng ngàn cân đè bẹp mọi kỹ xảo.
10. **Long Tượng Bàn Nhược Công (Mật Tông Tây Tạng):**
    * *Cơ chế:* Chia làm 13 tầng. Mỗi tầng tăng sức mạnh cơ bắp tương đương 1 con rồng và 1 con voi cổ đại. Tuy nhiên, càng lên tầng cao thời gian luyện càng nhân đôi (tầng 10 mất 30 năm). Chỉ có người chơi có tuổi thọ cực cao hoặc kỳ ngộ tăng tốc mới đạt tầng 10 (mỗi đấm nặng ngàn cân).
    * *Quy về Cấp Võ học (chốt G23):* tầng $1 - 10$ là Cấp $1 - 10$; tầng $11 - 13$ chỉ là văn miêu tả, không có trong game. Tier factor khi luyện từ Cấp $k$ lên $k + 1$ là $5 \times 1.09^{k-1}$, nên Ngộ tính $60$ tự học cần khoảng $90$ AP (khoảng 30 năm) để lên tầng 10.

---

### 2. Các Môn Kỳ Công, Ám Khí & Tà Thuật Độc Đáo

Để các lựa chọn trong game đa dạng, người chơi không nhất thiết phải làm kiếm khách mà có thể dùng các võ học kỳ quái:

* **Sinh Tử Phù (Ám khí):** Dùng nội lực ngưng tụ nước rượu hoặc nước trà thành những mảnh băng mỏng chứa độc tố âm hàn phóng vào huyệt đạo đối phương. Kẻ trúng chiêu không chết ngay nhưng mỗi năm vào đúng ngày đó sẽ ngứa ngáy đau đớn sống không bằng chết – **buộc NPC đó phải trở thành nô bộc trung thành của người chơi** để xin thuốc giải hàng năm!
* **Kim Xà Kiếm Pháp & Kim Xà Chùy:** Bộ võ công tà dị của Kim Xà Lang Quân Hạ Tuyết Nghi, chuyên dùng kiếm hình con rắn móc gãy binh khí địch.
* **Thần Hành Bách Biến / Lăng Ba Vi Bộ:** Hai môn khinh công tối thượng. Khi sở hữu, trong mọi sự kiện bị bao vây bởi hàng trăm quân lính hoặc cao thủ, nút **"Mỉm cười phủi áo bỏ đi"** luôn xuất hiện với `[Roll: Cấp Khinh công vs Cấp Khinh công cao nhất trong đám vây]` được cộng thêm $+30$ vào chỉ số (vẫn bị giới hạn tối đa $95\%$). *Thất bại:* bị chặn lại, phải giao chiến.
* **Nhiếp Hồn Đại Pháp (Di Hồn Đại Pháp):** Nhìn thẳng vào mắt NPC có Ngộ tính thấp hơn mình để thôi miên, bắt họ tự khai ra nơi giấu ngân lượng, bí kíp hoặc tự đâm kiếm vào bụng mình.
* **Huyết Đao Kinh & Thần Chiếu Kinh:**
    * *Thần Chiếu Kinh:* Nội công chí thuần nhất thiên hạ, có khả năng **Cải tử hoàn sinh** (Lần đầu tiên người chơi bị đánh về $0$ HP trong một trận đấu, trái tim ngừng đập rồi tự động kích hoạt Thần Chiếu Kinh đập trở lại, hồi $50\%$ HP và $50\%$ Nội tức! Tính là hiệu ứng cứu mạng của trận, xem Phần V.4).

---

## PHẦN IV: HỆ THỐNG THẦN BINH LỢI KHÍ (WEAPONS & ARTIFACTS)

Võ học Kim Dung không thể tách rời các món Thần binh. Khi sở hữu Thần binh phù hợp với bộ võ công, uy lực sẽ tăng vọt và mở ra các dòng văn bản miêu tả chiến đấu riêng biệt:

**Sát thương Thần binh** (cộng thẳng vào DMG, Hồ sơ 06 I.4) chia 3 bậc: **Lợi khí** $+30$ (*Đả Cẩu Bổng*, *Thánh Hỏa Lệnh*, binh khí của danh gia), **Danh khí** $+60$ (*Kim Xà Kiếm*, *Huyền Thiết Trọng Kiếm*), **Thần binh** $+100$ (*Đồ Long Đao*, *Ỷ Thiên Kiếm*). Nhuyễn Vị Giáp (giáp) và ám khí (Bạo Vũ Lê Hoa Châm) không thuộc thang này. Mô phỏng: ở mức Thượng thừa 5/10, Thần binh $+100$ nâng tỷ lệ thắng trước đối thủ ngang sức lên khoảng $87\%$; ở mức SSS 10/10 chỉ còn khoảng $77\%$ vì sát thương cộng thẳng nên loãng dần khi võ học mạnh lên.

**Nguồn binh khí:** Lợi khí và Danh khí mua ở Hắc Thị Đấu Giá Hội (giá ở Hồ sơ 06 II.2). **Thần binh** (Đồ Long Đao, Ỷ Thiên Kiếm) là độc nhất, không bao giờ lên sàn đấu giá: chỉ có qua Đại sự kiện *Kỳ Thư Xuất Thế* hoặc kỳ ngộ cấp SSS.

1. **Đồ Long Đao:** *"Võ lâm chí tôn, Bảo đao Đồ Long..."* – Nặng gần trăm cân, chém sắt như chém bùn. Giấu bên trong là *Vũ Mục Di Thư* (Giúp người chơi thống lĩnh quân đội đánh bại ngoại bang trong kịch bản "Sơn Hà Phá Toái").
2. **Ỷ Thiên Kiếm:** Sắc bén vô song, khắc tinh của mọi loại giáp trụ. Giấu bên trong là bí kíp *Cửu Âm Chân Kinh* và *Hàng Long Thập Bát Chưởng*. (Nếu cho Đồ Long Đao và Ỷ Thiên Kiếm chém vào nhau sẽ gãy đôi để lấy bí kíp).
3. **Kim Xà Kiếm:** Lưỡi kiếm phân nhánh như lưỡi rắn, tỏa ánh vàng kỳ dị, tăng sát thương độc và khả năng khóa vũ khí.
4. **Huyền Thiết Trọng Kiếm:** Không mũi nhọn, không lưỡi sắc, dùng cho người đi theo con đường "Đại xảo bất công".
5. **Đả Cẩu Bổng:** Cây gậy trúc xanh biếc như ngọc của Bang chủ Cái Bang. Khi cầm cây gậy này bước vào bất kỳ quán trọ hay thành thị nào, đệ tử Cái Bang địa phương đều tự động quỳ lạy dâng thông tin mật và ngân lượng.
6. **Thánh Hỏa Lệnh (6 Tấm):** Đúc từ Bạch Kim Huyền Thiết cứng không thể phá hủy, trên bề mặt khắc văn tự Ba Tư chứa bộ võ công quỷ dị của Sơn Trung Lão Nhân.
7. **Nhuyễn Vị Giáp (Áo giáp nhím):** Mặc bên trong áo thường. Bất kỳ kẻ nào dùng Quyền/Chưởng/Trảo đánh vào người chơi đều bị gai nhọn tẩm độc đâm nát bàn tay, đồng thời đao kiếm thông thường không thể đâm thủng.
8. **Bạo Vũ Lê Hoa Châm / Khổng Tước Linh (phóng tác, mượn từ Cổ Long chứ không phải Kim Dung):** Ám khí cơ quan tối thượng. Chỉ có $3$ lần sử dụng trong cả cuộc đời. Mỗi lần bấm nút gây sát thương bằng $80\%$ $HP_{max}$ của địch, bỏ qua Giảm Trừ Phòng Ngự. Với NPC trong **Thập Đại Cao Thủ** hoặc đối thủ đã chọn *Án Binh Bất Động* ở Hiệp 1 (đang đề phòng), sát thương chỉ còn $40\%$ $HP_{max}$.

---

## PHẦN V: CƠ CHẾ GIAO CHIẾN TEXT-BASED – "TAM HIỆP ĐỊNH SINH TỬ"

Mọi cuộc giao tranh trong game được chia làm 2 cấp độ: **Giao chiến Nhanh (Quick Clash - 1 đoạn văn)** dành cho đám lâu la thảo khấu, và **Quyết Đấu Tam Hiệp (3-Round Tactical Text Duel)** dành cho Cao thủ có tên tuổi hoặc Khảo nghiệm môn phái.

Một trận Quyết Đấu diễn ra qua **3 Hiệp (3 màn hình quyết định)** liên tiếp. Mỗi nhân vật có 2 thanh trạng thái: **Sinh Mệnh ($HP$)** và **Nội Tức ($MP$/Stamina)**.

### 1. HIỆP 1: KHỞI THỦ & TRANH ĐOẠT TIÊN CƠ (So sánh Khinh Công & Ngộ Tính)
Màn hình mô tả thế đứng và khí thế của đối phương. Người chơi chọn 1 trong 3 hướng tiếp cận:
* **[Tiên Hạ Thủ Vi Cường - Tấn công dồn dập]:** Cộng thêm $10\%$ sát thương ở Hiệp 1, nhưng nếu đối phương chọn *Thân Pháp Quỷ Mị* thì người chơi bị lộ sơ hở ở Hiệp 2 (xem Ma trận bên dưới).
* **[Án Binh Bất Động - Quan sát chiêu lộ]** `[Roll: Ngộ tính vs Ngộ tính địch]`:
    * *Thành công:* Nhìn thấu Hệ Nội lực và vũ khí của địch, giúp tăng $30\%$ tỷ lệ Chính xác và Né tránh ở Hiệp 2.
    * *Thất bại:* Quan sát quá lâu mà không nhìn ra sơ hở, đối phương chiếm tiên cơ: ở Hiệp 2 địch ra đòn trước và được $+10\%$ sát thương.
    * *Kích hoạt Võ học đặc thù:* Nếu người chơi có **Độc Cô Cửu Kiếm**, lựa chọn này biến thành ***"[Phá Kiếm/Phá Đao Thức]: Nhìn thấu sơ hở chí mạng"*** $\rightarrow$ Chém bay vũ khí địch ngay từ Hiệp 1!
* **[Thân Pháp Quỷ Mị - Du đấu tiêu hao]** `[Roll: Cấp Khinh công vs Cấp Khinh công địch]` (quy về thang $0 - 100$ bằng cách nhân 10):
    * *Thành công:* Câu giờ được 1 hiệp (độc của bạn trên người địch phát tác thêm 1 lần), hoặc mở sẵn đường máu để chạy trốn (Tỷ lệ chạy thoát ở Hiệp 2 tăng lên $80\%$).
    * *Thất bại:* Bị đối phương bám sát, tốn sức vô ích: mất $15\%$ Nội tức tối đa và không được cộng tỷ lệ chạy thoát.

#### Ma trận Đối kháng Hiệp 1
Hai bên chọn **cùng lúc, bí mật**. Ba hướng tiếp cận khắc nhau theo vòng: **Tiên Hạ Thủ $\rightarrow$ Án Binh $\rightarrow$ Thân Pháp $\rightarrow$ Tiên Hạ Thủ**.
* *Tiên Hạ Thủ khắc Án Binh:* đánh tới trước khi đối phương kịp nhìn ra chiêu lộ.
* *Án Binh khắc Thân Pháp:* đứng yên quan sát nên nhìn thấu bộ pháp du đấu.
* *Thân Pháp khắc Tiên Hạ Thủ:* né tránh đòn dồn dập, khiến kẻ tấn công kiệt sức và lộ sơ hở.

| Người chơi \ Đối thủ | **Tiên Hạ Thủ** | **Án Binh** | **Thân Pháp** |
| :--- | :--- | :--- | :--- |
| **Tiên Hạ Thủ** | *Cương đối cương:* cả hai cùng có $M = 1.10$ ở Hiệp 1. | **Người chơi thắng:** $M = 1.10$; đối thủ mất lượt Roll quan sát. | **Người chơi thua:** đòn bị né một phần ($M = 0.90$ ở Hiệp 1); đối thủ được hiệu ứng Thân Pháp mà không cần Roll. |
| **Án Binh** | **Người chơi thua:** mất lượt Roll quan sát; đối thủ có $M = 1.10$. | *Gườm nhau:* Hiệp 1 không gây sát thương. Hai bên `[Roll: Ngộ tính vs Ngộ tính địch]`, bên thắng được hiệu ứng Án Binh và ra đòn trước ở Hiệp 2. | **Người chơi thắng:** Roll quan sát được cộng $+20$ vào Ngộ tính; hiệu ứng Thân Pháp của đối thủ (câu giờ, tăng tỷ lệ chạy) bị vô hiệu. |
| **Thân Pháp** | **Người chơi thắng:** được hiệu ứng Thân Pháp mà không cần Roll; đòn của đối thủ bị né một phần ($M = 0.90$). | **Người chơi thua:** hiệu ứng Thân Pháp bị vô hiệu; đối thủ Roll quan sát với $+20$ Ngộ tính. | *Vờn nhau:* Hiệp 1 không gây sát thương, cả hai mất $10\%$ Nội tức tối đa; tỷ lệ chạy thoát ở Hiệp 2 của cả hai bên $+30\%$. |

* **Hiệu ứng Án Binh khi Roll quan sát thành công:** $+30\%$ tỷ lệ bạo kích ở Hiệp 2 **và** đòn Hiệp 2 của đối thủ chỉ còn $95\%$ sát thương (đã đọc trước chiêu thức).
* **Ngoài các ô trên,** Án Binh và Thân Pháp gây sát thương bình thường ($M = 1.00$) ở Hiệp 1.
* **Mục tiêu cân bằng (đã kiểm chứng bằng `mo_phong/mo_phong.py`):** bên thắng ma trận thắng trận khoảng $60\% - 70\%$, không có lựa chọn cố định nào thắng quá $55\%$ trước AI NPC.
* **Độc Cô Cửu Kiếm:** Lựa chọn *Án Binh* biến thành *Phá Thức*, khắc cả *Tiên Hạ Thủ* lẫn *Thân Pháp* (vẫn hòa khi gặp *Án Binh*). Đây là ưu thế riêng của Thần công SSS này.
* **Các ô "thắng / thua" thay thế Roll riêng của lựa chọn** ở trên khi văn bản ma trận ghi "không cần Roll" hoặc "mất lượt Roll". Các trường hợp còn lại vẫn Roll như bình thường.

#### Cách NPC chọn hướng tiếp cận (AI Hiệp 1)
NPC chọn theo trọng số dựa trên **Bản mệnh** (Hồ sơ 05), sau đó điều chỉnh:

| Bản mệnh NPC | Tiên Hạ Thủ | Án Binh | Thân Pháp |
| :--- | :--- | :--- | :--- |
| Chính trực | $34\%$ | $33\%$ | $33\%$ |
| Ngụy quân tử | $20\%$ | $50\%$ | $30\%$ |
| Tà ác | $50\%$ | $20\%$ | $30\%$ |
| Ngông cuồng | $45\%$ | $30\%$ | $25\%$ |
| Si tình | $30\%$ | $30\%$ | $40\%$ |

* Nếu Cấp Khinh công của NPC cao hơn người chơi từ $3$ cấp trở lên: chuyển $15\%$ từ Tiên Hạ Thủ sang Thân Pháp.
* Nếu Ngộ tính của NPC cao hơn người chơi từ $20$ trở lên: NPC "đọc vị" thói quen, cộng $+20\%$ cho lựa chọn khắc chế hướng mà người chơi dùng nhiều nhất trong 5 trận Tam Hiệp gần nhất (lấy đều từ các lựa chọn còn lại).
* Trọng số luôn được chuẩn hóa lại về tổng $100\%$, không lựa chọn nào dưới $10\%$.

### 2. HIỆP 2: NỘI LỰC & TUYỆT KỸ GIAO PHONG (Trọng tâm Sát thương & Khắc chế)
* **Thứ tự ra đòn:** Bên giành tiên cơ ở Hiệp 1 (Án Binh quan sát thắng, hoặc đối thủ quan sát thất bại) ra đòn trước. Nếu không bên nào có tiên cơ: `[Roll: Cấp Khinh công × 10 vs Cấp Khinh công địch × 10]`, bên thắng ra đòn trước; cùng cấp Khinh công thì ngẫu nhiên. Ra đòn trước rất đáng giá (có thể hạ gục đối thủ trước khi họ kịp đánh), nên đây là Roll chứ không phải luật tuyệt đối: hơn 1 cấp Khinh công chỉ có khoảng $75\%$ ra đòn trước.
Đây là lúc hai bên tung ra **Tuyệt kỹ Thượng thừa / Trấn phái** và so kè **Nội lực**:
* **Cơ chế Khắc chế Tam Hệ Nội Lực (Tự động tính toán):**
    * Vòng khắc chế khép kín: **Chí Dương $\rightarrow$ Chí Âm $\rightarrow$ Trung Hòa $\rightarrow$ Chí Dương**. Bên khắc gây thêm $5\%$ sát thương, bên bị khắc chỉ gây $95\%$ sát thương (hai bên ngang sức thì bên khắc thắng khoảng $3/4$ số trận).
    * **Chí Dương** khắc **Chí Âm/Hàn Độc** (Đốt cháy độc tố, gây thêm sát thương nội thương).
    * **Chí Âm** khắc **Trung Hòa** (Hàn khí thấm dần vào kinh mạch) và **Ngoại Công Thuần Túy / Phòng Ngự Cứng** (Hàn khí xuyên qua giáp, làm chậm tốc độ của địch).
    * **Trung Hòa (Thái Cực / Bắc Minh / Tiên Thiên)** khắc **Chí Dương** (Lấy nhu khắc cương, dẫn lệch lực đạo dương cương). Công thức chuẩn xem Hồ sơ 06, Phần I.4.
* **Cách các Tuyệt Học vận hành trong Hiệp 2:**
    * *Song Thủ Hỗ Bác:* Cho phép người chơi tích chọn **2 chiêu thức Ngoại công cùng lúc** trong bảng chọn của Hiệp 2!
    * *Đẩu Chuyển Tinh Di / Càn Khôn Đại Na Di:* Xuất hiện nút đặc biệt ***"[Tá Lực Đả Lực]"*** – Nếu đoán đúng đối phương sẽ tung đòn sát thương mạnh ở hiệp này, bạn miễn nhiễm sát thương và trả lại $100\%$ sát thương đó vào người địch.
    * *Bắc Minh Thần Công / Hấp Tinh Đại Pháp:* Thay vì gây sát thương máu, chọn đòn **"Hút Nội Lực"** làm cạn sạch Nội tức của địch khiến chúng không thể tung tuyệt chiêu ở Hiệp 3.

### 3. HIỆP 3: PHÂN ĐỊNH SINH TỬ (Trảm Sát, Tha Mạng hoặc Lật Kèo)
Hiệp 3 luôn diễn ra sau Hiệp 2. Một bên được coi là **Áp đảo** khi đối phương có $HP < 25\%$ hoặc đã hết sạch Nội tức; bên còn lại là **Thất thế**.
* **Nếu không bên nào thỏa điều kiện trên (Bất phân thắng bại):** Hai bên được chọn *Thu kiếm hòa nhau, hẹn ngày tái đấu* (không ai mất gì, Hảo cảm $+10$ nếu đối phương Chính trực) hoặc *Liều mạng đánh tiếp* (đấu lại Hiệp 2 thêm 1 lần, sau đó bắt buộc phân định theo % HP còn lại: bên cao hơn là Áp đảo).
* **Nếu Người chơi Chiến thắng (Áp đảo):**
    * *Khi NPC áp đảo người chơi trong trận sinh tử* (truy nã, ám sát, cừu gia; **không** áp dụng cho tỷ thí trong môn phái), NPC chọn Tuyệt sát theo bản mệnh: Tà ác $60\%$, Ngông cuồng $30\%$, Ngụy quân tử $30\%$, Si tình $10\%$, Chính trực $0\%$; còn lại NPC tha mạng và người chơi chịu **Trọng thương** (Hồ sơ 06 I.1). Bị Tuyệt sát thì người chơi chọn lối thoát ở mục "Thất thế" bên dưới (Khinh công bỏ chạy `[Roll: Võ Lực vs Võ Lực địch]`, nhảy vực theo Hồ sơ 06 I.3, hoặc Hiệu ứng Cứu Mạng); không thoát được là tử trận.
    * **[A] Tung đòn Tuyệt sát (Giết chết tại chỗ):** Lột sạch ngân lượng và bí kíp mang theo của NPC. *Hiệp nghĩa giảm (nếu giết người Chính đạo), kích hoạt Hệ thống Cừu Gia từ thân nhân của kẻ chết.*
    * **[B] Phế bỏ võ công / Chặt một cánh tay:** Kẻ địch sống sót nhưng trở thành phế nhân, giảm nguy cơ bị báo thù trực tiếp nhưng tâm lý kẻ địch hóa điên.
    * **[C] Thu kiếm nhường nhịn ("Thừa nhượng rồi!"):** Tăng mạnh *Danh vọng* và *Hiệp nghĩa*. NPC có tính cách *Chính trực* sẽ tăng $+40$ Hảo cảm và có thể kết giao bằng hữu.
    * **[D] Gieo Sinh Tử Phù / Ép uống Tam Thi Não Thần Đan (Nếu có võ công tương ứng):** Biến cao thủ vừa bại trận thành thuộc hạ trung thành tuyệt đối!
* **Nếu Người chơi Thất thế (Sắp chết - $HP < 25\%$ hoặc cạn Nội tức):**
    * Kích hoạt bị động (Passive): **Diệt Tuyệt Đao Pháp** (Tăng $200\%$ sát thương đòn cuối). Nếu đòn kết liễu của địch đưa HP về $0$, hiệu ứng cứu mạng (nếu có) kích hoạt theo **Quy tắc Cứu Mạng** bên dưới.
    * Lựa chọn lật kèo bẩn: **Tung Ám Khí / Độc Dược** (*Bạo Vũ Lê Hoa Châm*, *Vô Ảnh Châm*, *Tung vôi bột*) để giết ngược đối thủ trong lúc chúng chủ quan (Trừ mạnh Hiệp nghĩa).
    * Lựa chọn **Đầu hàng chịu nhục** hoặc **Thi triển Khinh công bỏ chạy**.

### 4. QUY TẮC CỨU MẠNG (Chống "Bất tử")
Các hiệu ứng giúp thoát chết được gọi chung là **Hiệu ứng Cứu Mạng**: *Thần Chiếu Kinh*, *Thiên Vương Bảo Tâm Đan* (Hồ sơ 06), *Huynh đệ Cứu giá* (Hồ sơ 05), *Dược Vương Cốc hồi sinh*.
* **Mỗi trận đấu (hoặc mỗi sự kiện bị vây sát) chỉ kích hoạt tối đa 1 Hiệu ứng Cứu Mạng.** Lần thứ hai HP về $0$ trong cùng trận là tử vong (hoặc bị bắt / bị phế, tùy kịch bản).
* **Thứ tự ưu tiên** khi HP về $0$ (hệ thống tự kích hoạt cái đầu tiên đủ điều kiện): 1) *Thần Chiếu Kinh* (nội tại, không tiêu hao) $\rightarrow$ 2) *Huynh đệ Cứu giá* (`[Ngẫu nhiên: 50%]`, huynh đệ phải còn sống) $\rightarrow$ 3) *Thiên Vương Bảo Tâm Đan* (tiêu hao 1 viên) $\rightarrow$ 4) *Dược Vương Cốc hồi sinh* (1 lần trong đời, chỉ trước 30 tuổi). Người chơi có thể tắt từng hiệu ứng tiêu hao trong Tab Hành Trang để để dành.
* **Không hiệu ứng nào đảm bảo $100\%$:** mọi lựa chọn bỏ chạy, kể cả từ *Lăng Ba Vi Bộ* hay *Thiên Vương Bảo Tâm Đan*, đều là `[Roll]` bị giới hạn tối đa $95\%$ (Hồ sơ 06, Phần I.2).