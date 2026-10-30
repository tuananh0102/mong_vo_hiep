# HỒ SƠ 04: KỊCH BẢN TRƯỞNG THÀNH, TRANH BÁ VÕ LÂM & LÃO NIÊN (16 – 80+ TUỔI)
**Mục tiêu thiết kế:** Xây dựng khung sườn cho 70% thời lượng cốt lõi của một kiếp người sau khi đã qua tuổi thiếu niên. Giai đoạn này xoay quanh việc thăng tiến địa vị môn phái, hành nghề tự do trên giang hồ, tranh đoạt quyền lực Chưởng môn và các biến cố đặc trưng của tuổi xế chiều.

---

## I. HỆ THỐNG NẤC THANG ĐỊA VỊ & VÒNG LẶP 16 – 60 TUỔI

Từ năm **16 tuổi**, người chơi không còn phụ thuộc gia đình mà bước vào vòng xoay danh lợi của võ lâm với **3 đến 4 Điểm Hành Động (AP)/năm**. Cuộc đời chia làm **2 Con đường lớn**: **Con đường Môn Phái (Sect Path)** và **Con đường Giang Hồ Tự Do (Freelance/Rogue Path)**.

### 1. Lộ trình Thăng tiến trong Môn Phái (5 Bậc)
Mỗi hành động làm nhiệm vụ sư môn hoặc chiến thắng đại hội sẽ tích lũy **Điểm Cống Hiến Môn Phái (Sect Merit)**:

| Cấp bậc | Yêu cầu Cống hiến & Tuổi | Công việc / Hành động mở khóa mỗi năm | Sự kiện Thăng cấp (Promotion Trial) |
| :--- | :--- | :--- | :--- |
| **Bậc 1: Đệ tử Ngoại môn / Tạp dịch** | Từ khi nhập môn ($7 - 16$ tuổi, $0$ điểm). Quá 18 tuổi chưa lên Nội môn: Ngoại môn bị mời xuống núi, riêng Tạp dịch được ở lại trọn đời. | *Bổ củi gánh nước, Tuần tra sơn môn, Nghe sư huynh giảng võ.* | **Khảo hạch Ngoại môn:** Đánh bại 1 đệ tử cùng khóa trong 3 hiệp. |
| **Bậc 2: Đệ tử Nội môn** | $16+$ tuổi ($100$ điểm) | *Xuống núi trừ gian (hoặc thu bảo kê), Luyện võ Thượng thừa, Canh giữ Tàng Kinh Các tầng 1.* | **Lập công xuất sơn:** Hoàn thành 1 nhiệm vụ nguy hiểm (Bắt tên đạo tặc khét tiếng hoặc tìm thảo dược quý). |
| **Bậc 3: Đệ tử Chân truyền** | $20+$ tuổi ($300$ điểm) | *Được Sư phụ truyền thụ riêng 1 môn Trấn phái, Đại diện môn phái đi dự hội võ thiên hạ.* | **Chiến thắng Đại sư huynh:** Tỷ thí công khai giành vị trí "Thủ tọa đại đệ tử" trước mặt toàn phái. |
| **Bậc 4: Trưởng lão / Đường chủ** | $28+$ tuổi ($700$ điểm) | *Nhận đồ đệ riêng, Quản lý ngân khố/hình đường, Tự do ra vào mật thất bản phái.* | **Giải cứu nguy nan:** Bảo vệ môn phái trước một đợt tấn công của kẻ thù. |
| **Bậc 5: Chưởng Môn Nhân / Giáo Chủ** | $35+$ tuổi ($1500$ điểm) | *Toàn quyền thay đổi tôn chỉ môn phái (Chính $\leftrightarrow$ Tà), Phát động chiến tranh thôn tính phái khác!* | **Sự kiện Kế Vị / Soán Ngôi** *(Xem chi tiết Mục II.3)*. |

**Nguồn Cống hiến:** 1 AP *Nhiệm vụ sư môn* $= +50$; thắng thử thách thăng cấp $+100$; lập công trong Đại sự kiện $+200$. Với 1 AP sư môn mỗi năm, người chơi đủ $1,500$ Cống hiến để tranh ngôi Chưởng môn vào khoảng $35 - 36$ tuổi (đã kiểm chứng bằng `mo_phong/mo_phong.py`).

**Sai Phái Sư Môn (nguồn thu an toàn cho đệ tử):** Từ Bậc 2 (Nội môn) đến Bậc 4 (Trưởng lão), đệ tử được nhận việc có thù lao của môn phái (hộ tống hàng của phái, đòi nợ cho tá điền, tuần tra địa giới), 1 AP mỗi lần.
Thù lao: Nội môn $50 - 150$, Chân truyền $100 - 250$, Trưởng lão $150 - 350$ lạng; kiểm định `[Giao chiến nhanh: 30 / 40 / 50]` theo bậc.
Thất bại chỉ mất thù lao: đệ tử luôn đi cùng đồng môn nên **không có trận sinh tử, không Trọng thương**.
Thù lao thấp hơn săn truy nã và không cộng Danh vọng, đổi lại an toàn; Chưởng môn và người đã rời môn phái không nhận được việc này.

**Danh vọng chức vị:** Trưởng lão được cộng $+150$ Danh vọng, Chưởng môn $+300$ (kể cả Chưởng môn tự lập phái) chừng nào còn giữ chức (Hồ sơ 01 II.2).
Đây là nguồn Danh vọng chính của đệ tử không đi săn truy nã. Bị trục xuất hay thoái vị thì mất phần này, đổi lại sinh hoạt phí cũng không còn được môn phái lo.

**Quyền của Chưởng môn** (chốt 2026-10-27, `ke_hoach/05_LO_HONG_GDD.md` G27):
* *Đổi tôn chỉ Chính ↔ Tà:* đổi phe của môn phái; Thanh danh Chưởng môn $-200$ khi sang Tà, $+100$ khi sang Chính; $30\%$ NPC đệ tử bỏ phái.
* *Tuyển Trưởng lão* cho môn phái (kể cả tự lập): $500$ lạng mỗi người, lấy từ Ngân khố; chỉ tuyển được NPC Lãng khách đang không thuộc phái nào.

**Thất bại Sự kiện Thăng cấp:** Mọi thử thách thăng cấp trong bảng trên đều là `[Tam Hiệp]` hoặc nhiệm vụ có `[Roll]`. Thất bại lần đầu: giữ nguyên cấp bậc và Cống hiến, được thử lại sau 1 năm. Thất bại 2 lần liên tiếp: Cống hiến $-50$ và bị đồng môn coi thường (Hảo cảm của các đồng môn cùng bậc $-10$). Riêng thử thách Bậc 4 *"Giải cứu nguy nan"* thất bại thì môn phái chịu thiệt hại thật: trợ cấp năm đó bằng $0$ và 1 NPC đồng môn có tên tử trận.

### 2. Lộ trình Tản Tu / Giang Hồ Lãng Khách (Không vào Môn phái)
Nếu người chơi chọn làm Lãng khách (như Dương Quá giai đoạn sau hoặc Hồ Phỉ), họ kiếm tiền và danh vọng qua **5 Nghề nghiệp Giang hồ**:
1. **Bảo Tiêu (Tiêu sư):** Nhận áp tải hàng hóa từ Trung Nguyên đi Tây Vực/Giang Nam. Tỷ lệ gặp sơn tặc cướp tiêu, nhưng kiếm nhiều bạc và rèn luyện thực chiến cực nhanh.
2. **Thợ Săn Tiền Thưởng (Lục Phiến Môn / Bộ Khoái):** Nhận lệnh truy nã của triều đình đi bắt các Đại ma đầu. Tăng mạnh *Hiệp nghĩa* và *Ngân lượng*.
3. **Sát Thủ Thuê (Hắc Đạo):** Nhận hợp đồng ám sát các quan lại hoặc chưởng môn. Nếu thất bại sẽ bị cả võ lâm truy nã.
4. **Khai Tông Lập Phái (Mở khóa ở Tuổi $30+$):**
   * *Điều kiện:* Danh vọng $\ge 500$, Ngân lượng $\ge 5000$ lạng, đã sở hữu ít nhất 1 môn võ cấp Thượng thừa trở lên.
   * *Chi phí:* $5,000$ lạng lấy từ túi riêng của người sáng lập. Từ đó lợi tức môn phái đi vào **Ngân khố môn phái**, người sáng lập chỉ nhận bổng lộc Chưởng môn (Hồ sơ 06 Phần II.1).
   * *Hiệu ứng:* Mua lại một ngọn núi ở Giang Nam hoặc Bắc Cảnh, tự đặt tên môn phái (VD: *Vô Danh Kiếm Phái*, *Hắc Phong Sơn Trại*), tuyển mộ NPC lang thang về làm trưởng lão và viết ra cuốn bí kíp trấn phái của riêng mình!
5. **Thương Nhân / Trang Chủ (Mở khóa ở Tuổi $16+$, mô-típ Lâm Chấn Nam của Phúc Uy Tiêu Cục, Vi Tiểu Bảo):**
   * *Khởi đầu:* Bán hàng rong (*Tiểu thương*), góp vốn từng phần vào tiêu cục, rồi mở rộng sang buôn muối, sòng bạc và đầu cơ ở Hắc Thị trước mỗi Đại sự kiện.
   * *Đánh đổi:* Mỗi loại sản nghiệp ngốn 1 AP quản lý mỗi năm, nên Thương nhân luyện võ chậm và yếu hơn hẳn người cùng tuổi; cướp tiêu, bảo kê và tống tiền đều là `[Giao chiến nhanh]` mà Thương nhân thường thua, nên phải bỏ tiền thuê Hộ viện.
   * *Đích đến:* Kết cục *Phú Khả Địch Quốc* (Hồ sơ 07, gia sản cá nhân $\ge 50,000$). Quy tắc và con số đầy đủ ở Hồ sơ 06 Phần II.5.

---

## II. KỊCH BẢN SỰ KIỆN ĐỈNH CAO GIAI ĐOẠN THANH NIÊN & TRUNG NIÊN (16 – 50 TUỔI)

### 1. [Sự kiện Cột Mốc Tuổi 16 – 20]: Nhiệm Vụ Xuất Sơn Đầu Tiên – "Giang Hồ Hiểm Ác"
* **Bối cảnh:** Lần đầu tiên bạn một mình rời khỏi sơn môn xuống phố thị. Tại một quán rượu ven đường ở Giang Nam, bạn thấy một đám ác bá địa phương đang ép hai cha con người hát rong phải bán thân gán nợ. Nhưng nhìn kỹ trên thắt lưng tên cầm đầu, hắn đeo lệnh bài của một Thế gia lớn có giao tình với sư phụ bạn!
* **Lựa chọn:**
  * **[A] Rút kiếm tương trợ, đánh gãy răng đám ác bá `[Giao chiến nhanh: 40]`:**
    * *Thành công:* Cứu được hai cha con (Cô con gái trở thành NPC Tri kỷ **[Ôn Nhu Tri Kỷ]** có thể gặp lại sau này). *Hiệp nghĩa $+50$, nhưng khi về núi bị Sư phụ phạt quỳ từ đường mất 1 AP năm sau vì tội gây thù chuốc oán.*
    * *Thất bại:* Đám ác bá đông người, bạn bị đánh trọng thương nằm giữa quán, hai cha con bị lôi đi trước mắt. *(Hiệp nghĩa $+20$ vì dám ra tay, HP $-50\%$, Điểm Ám Thương $+5$ nếu không trị thương trong năm, vẫn bị Sư phụ phạt 1 AP năm sau)*. Mở sự kiện nối tiếp **"Giải cứu Ca Nữ"** trong 2 năm tới: có thể đột nhập phủ Thế gia cứu cô con gái (nếu thành công, cô vẫn trở thành **[Ôn Nhu Tri Kỷ]**); quá 2 năm cô bị bán sang Tây Vực và chỉ có thể gặp lại qua kỳ ngộ.
  * **[B] Bỏ ra 50 lạng bạc chuộc thân cho hai cha con để giữ hòa khí đôi bên `[Cổng: Ngân lượng ≥ 50]`:**
    * *Hệ quả:* *Ngân lượng $-50$, Hiệp nghĩa $+20$, Ngộ tính $+5$.* Hai bên đều nể mặt bạn là người biết điều.
  * **[C] Ngồi uống rượu làm ngơ, thậm chí còn chỉ điểm cho tên ác bá cách bắt người:**
    * *Hệ quả:* Tên ác bá cười lớn mời bạn về phủ của hắn làm khách quý, tặng bạn một túi bạc. *(Hiệp nghĩa $-80$, Ngân lượng $+100$, mở khóa đường dây buôn lậu ngầm)*.

### 2. [Sự kiện Môn Phái Tuổi 22 – 28]: Cám Dỗ Tại Tàng Kinh Các
* **Bối cảnh:** Một đêm mưa gió khi bạn đang giữ chức Đệ tử Nội môn trực đêm ở Tàng Kinh Các, bạn phát hiện một bóng đen đang lật giở cuốn bí kíp cấm của bản phái. Khi đánh rơi khăn che mặt của kẻ đó, bạn bàng hoàng nhận ra đó chính là **Nhị Sư Thúc** – người bề ngoài luôn đạo mạo giảng giải đạo lý cho bạn!
* **Lựa chọn:**
  * **[A] Hét lớn báo động cho Chưởng môn và các Trưởng lão (Chính trực):**
    * *Hệ quả:* Nhị Sư Thúc lao vào đánh nhau với bạn để diệt khẩu `[Tam Hiệp: Nhị Sư Thúc]`. Trận này người chơi không cần thắng, chỉ cần **không bị đánh gục trước khi hết Hiệp 3**.
    * *Thành công (Trụ vững đủ 3 hiệp hoặc thắng):* Chưởng môn kịp đến bắt giữ hắn $\rightarrow$ Bạn được thăng thẳng lên **Đệ tử Chân truyền**, *Cống hiến $+200$*.
    * *Thất bại (Bị đánh gục):* Chưởng môn đến kịp cứu mạng bạn nhưng Nhị Sư Thúc đã phá cửa sổ trốn thoát cùng cuốn bí kíp cấm. *(Cống hiến $+100$, Điểm Ám Thương $+5$, không được thăng cấp. Nhị Sư Thúc trở thành phản đồ với Hảo cảm $-100$, gia nhập 1 Tà phái và có thể quay lại báo thù trong 5 năm tới)*.
  * **[B] Nhắm mắt làm ngơ, dùng bí mật này ép Nhị Sư Thúc phải chép cho mình 1 bản bí kíp (Tâm cơ):**
    * *Hệ quả:* *Hiệp nghĩa $-50$ **[Ám]**.* Nhị Sư Thúc cắn răng đưa cho bạn bản sao môn võ công Thượng thừa và $300$ lạng bạc bịt miệng. Tuy nhiên, mỗi năm sau đó `[Ngẫu nhiên: 15%]` lão ta sẽ tìm cách đẩy bạn vào chỗ chết trong các nhiệm vụ, kích hoạt sự kiện **"Bẫy Sư Thúc"**:
    * *Phát hiện bẫy* `[Roll: Ngộ tính vs 60]` *thành công:* Bạn né được cạm bẫy và nắm được bằng chứng. Có thể chọn tố giác (Nhị Sư Thúc bị trục xuất, nhưng lão khai ra chuyện bạn tống tiền: hành động [Ám] **bại lộ**) hoặc tiếp tục giữ bí mật.
    * *Thất bại:* Rơi vào ổ phục kích, chịu thương nặng (HP $-60\%$, Điểm Ám Thương $+5$). Nếu HP về $0$ trong lúc này thì tử vong.

### 3. [Sự kiện Tranh Bá Tuổi 35 – 45]: Đại Biến Cố Kế Vị Chưởng Môn
* **Bối cảnh:** Sư phụ của bạn tuổi cao sức yếu (hoặc trúng độc trọng thương), gọi bạn và **Đại Sư Huynh** (người có dã tâm lớn nhưng lòng dạ hẹp hòi) vào giường bệnh. Sư phụ muốn truyền chiếc nhẫn Chưởng môn cho bạn, nhưng chưa kịp trối trăng xong thì tắt thở. Đại Sư Huynh lập tức rút kiếm vu khống bạn hạ độc thí sư để cướp ngôi!
* **Lựa chọn:**
  * **[A] Chấp nhận tỷ thí phân thắng bại ngay tại linh đường để chứng minh trong sạch:**
    * *Hệ quả:* `[Tam Hiệp: Đại Sư Huynh]`.
    * *Thắng:* Toàn phái tâm phục khẩu phục tôn bạn làm **Tân Chưởng Môn**.
    * *Thua:* Bị trục xuất khỏi môn phái nhưng **giữ nguyên võ công**. *(Thanh danh $-100$ vì bị coi là kẻ thí sư, Cống hiến về $0$. Đại Sư Huynh lên ngôi Chưởng môn và trở thành **Kẻ Thù Truyền Kiếp**. Người chơi chuyển sang con đường Lãng khách, có thể Khai Tông Lập Phái hoặc quay về đoạt lại sư môn sau này)*. Mô phỏng cho thấy nhánh này là tung đồng xu với đối thủ ngang sức, nên hình phạt phế võ công cũ (mất toàn bộ cấp võ học) quá nặng.
  * **[B] Dùng Ngộ tính và Mị lực vạch trần vết độc trên chén thuốc chính là loại độc mà Đại Sư Huynh từng mua ở Tây Vực `[Roll: Ngộ tính vs 75 VÀ Mị lực vs 70]`:**
    * *Thành công:* Các vị Trưởng lão kiểm tra chén thuốc, nhận ra chân tướng. Đại Sư Huynh hoảng loạn phản bội môn phái chạy trốn sang Tà giáo (Trở thành **Kẻ Thù Truyền Kiếp** sẽ dẫn quân quay lại báo thù sau 5 năm), còn bạn lên ngôi Chưởng môn không tốn một giọt máu!
    * *Thất bại:* Lời buộc tội thiếu chứng cứ, các Trưởng lão nghi ngờ cả hai người. Đại Sư Huynh cười lạnh đòi phân xử bằng kiếm. *(Thanh danh $-50$, bắt buộc chuyển sang nhánh [A] tỷ thí tại linh đường)*.
  * **[C] Tiên hạ thủ vi cường – Nhân lúc chưa ai bước vào phòng, giết luôn Đại Sư Huynh rồi đổ tội thí sư cho hắn `[Cổng ẩn: Hiệp nghĩa thật < 0]` `[Roll: Võ Lực vs Võ Lực địch]` (đánh lén nên dùng Võ Lực thay vì Tam Hiệp):**
    * *Hệ quả:* Một mũi tên trúng hai đích! Bạn vừa độc chiếm ngôi Chưởng môn, vừa mang tiếng thơm là người "Thanh lý môn hộ báo thù cho ân sư" (Mô-típ Nhạc Bất Quần). *(Hiệp nghĩa $-200$ **[Ám]**, Thanh danh $+100$, Danh vọng $+50$. Nếu sau này bại lộ, Thanh danh bị trừ theo quy tắc Hồ sơ 01 mục II.3)*.
    * *Thất bại:* Đòn đánh lén trượt tâm mạch, Đại Sư Huynh gào lên cầu cứu. Các Trưởng lão ập vào thấy cảnh bạn cầm kiếm đứng trên hắn: hành động [Ám] **bại lộ ngay**. *(Hiệp nghĩa $-200$, Thanh danh $-300$, bị trục xuất khỏi môn phái và bị cả phái truy sát trong 5 năm. Đại Sư Huynh sống sót lên ngôi Chưởng môn và trở thành **Kẻ Thù Truyền Kiếp**)*.

---

## III. KỊCH BẢN GIAI ĐOẠN XẾ CHIỀU & LÃO QUÁI VẬT (50 – 80+ TUỔI)

Khi bước qua tuổi 50, nhân vật bắt đầu bị giảm dần **Căn cốt ($-2$ mỗi năm)** do lão hóa tự nhiên. Người có **Cảnh giới Nội công $\ge 8$** được nội lực giữ thân, chỉ bắt đầu giảm từ sau **60 tuổi** (mô-típ "lão quái vật": Hồng Thất Công, Hoàng Dược Sư vẫn ở đỉnh cao khi đã ngoài 50). Không giảm chút nào nếu luyện *Dịch Cân Kinh*, *Cửu Dương Thần Công*, *Tiên Thiên Công* hoặc *Bát Hoang Lục Hợp Công*). Đây là lúc mở ra các sự kiện chỉ dành riêng cho bậc "Tiền bối cao nhân":

### 1. Sự kiện "Kim Bồn Tẩy Thủ" (Rửa Tay Gác Kiếm - Tuổi 40+)
* **Điều kiện:** Từ **40 tuổi** trở đi, người chơi có thể chủ động chọn hành động **"Tổ chức lễ Kim Bồn Tẩy Thủ"** để đưa *Thanh danh âm* về $0$ (Hiệp nghĩa thật không thay đổi, ác nghiệp đã làm vẫn còn đó) và rút lui khỏi ân oán giang hồ, chuyển sang chăm sóc con cháu.
* **Biến số kịch tính:** Nếu trong đời bạn từng giết quá 5 NPC có tên tuổi, trong ngày bạn đang nhúng tay vào chậu vàng trước mặt quần hùng, **Kẻ thù cũ sẽ đạp cổng xông vào đòi nợ máu** (Giống bi kịch của Lưu Chính Phong trong *Tiếu Ngạo Giang Hồ*). Bạn buộc phải đánh trận cuối cùng của cuộc đời để bảo vệ vợ con! `[Tam Hiệp: Kẻ thù cũ mạnh nhất còn sống]`
    * *Thắng:* Lễ Kim Bồn Tẩy Thủ hoàn tất trước mặt quần hùng, kẻ thù tử trận hoặc bỏ chạy. Thanh danh âm được đưa về $0$ như bình thường, Danh vọng $+50$.
    * *Thua:* Chậu vàng bị đạp đổ, buổi lễ **thất bại** (Thanh danh không được tẩy). Kẻ thù giết 1 người thân `[Ngẫu nhiên: 50% Thê tử / 50% 1 người con]` (nếu không có, thay bằng 1 Huynh đệ kết nghĩa hoặc Đệ tử) rồi rút đi. Người chơi sống sót với HP $1$ và Điểm Ám Thương $+10$, nhận Trạng thái [Tâm Ma Đứt Ruột]. Có thể tổ chức lại lễ sau ít nhất 5 năm.

### 2. Sự kiện "Bế Quan Nghiên Cứu - Tự Sáng Tạo Võ Học" (Tuổi 55+)
* **Điều kiện:** `[Cổng: Ngộ tính ≥ 85 VÀ đã học ít nhất 3 môn võ cấp Thượng thừa/Trấn phái trở lên]`.
* **Diễn biến:** Bạn tự nhốt mình trong sơn động suốt 3 năm liên tiếp (Tốn toàn bộ AP của 3 năm).
* **Kết quả** `[Roll: Ngộ tính vs 90]`:
  * *Thành công:* Dung hợp toàn bộ sở học cả đời để **Sáng tạo ra 1 Môn Tuyệt Học Mới** (Người chơi được **tự gõ tên môn võ từ bàn phím**, ví dụ: *Vạn Kiếp Thần Kiếm* hay *Tiêu Dao Ma Chưởng*!).
  * Môn võ này sẽ được lưu vĩnh viễn vào **Tàng Kinh Các Gia Tộc** ở mức độ hoàn thiện $100\%$ cho Đời Con kế thừa mà không bị giảm uy lực!
  * *Thất bại:* Chân khí các môn võ xung đột dữ dội ở năm bế quan thứ 3, bạn Tẩu hỏa nhập ma. Môn võ vẫn được sáng tạo và đặt tên nhưng chỉ đạt độ hoàn thiện $60\%$ (Cấp tối đa $6/10$, đời sau có thể hoàn thiện theo quy tắc Hồ sơ 05). *(Điểm Ám Thương $+10$; `[Ngẫu nhiên: 25%]` nhận ngay Trạng thái [Kinh Mạch Nghịch Hành] ở mục 3 bên dưới, bỏ qua điều kiện tuổi)*.
* **Sức mạnh môn tự sáng tạo** (chốt 2026-10-27, `ke_hoach/05_LO_HONG_GDD.md` G21):
  * Tier Trấn phái (Tier factor $3$, Điểm Tier Chiến lực $30$); nếu có từ 2 môn nguồn là Thần công SSS thì Điểm Tier $45$.
  * Uy lực chiêu thức $= $ Uy lực cao nhất trong các môn nguồn $\times 1.05$, trần $320$. Hệ Nội lực theo Tâm pháp chủ đạo lúc bế quan. Loại môn (nội công / ngoại công) người chơi chọn khi đặt tên.
  * Môn tự sáng tạo **không** được dùng làm môn nguồn cho lần bế quan sau, kể cả của đời con, để không cộng dồn qua nhiều thế hệ.

### 3. Sự kiện "Tẩu Hỏa Nhập Ma Tuổi Già – Kinh Mạch Nghịch Hành" (Mô-típ Âu Dương Phong)
* **Điều kiện kích hoạt:** Tuổi $\ge 60$, từng học quá nhiều môn võ xung khắc Âm - Dương hoặc luyện *Cửu Âm Chân Kinh* bản thiếu.
* **Diễn biến:** Một buổi sáng thức dậy, đầu óc bạn quay cuồng, bạn quên sạch tên tuổi của mình, quên cả mặt vợ con, đi bằng hai tay trồng cây chuối khắp giang hồ và hỏi bất kỳ ai gặp trên đường: *"Ta là ai? Ngươi có phải là con trai của ta không?"*
* **Hệ quả Gameplay:**
  * Mất quyền kiểm soát các hành động Quản lý gia tộc/Mua bán, nhưng **Sức mạnh chiến đấu tăng vọt $+150\%$** (Do đánh chiêu thức ngược xuôi không theo quy luật nào khiến mọi cao thủ đều bó tay).
  * Đây là trạng thái cực kỳ thú vị để kết thúc kiếp sống trong vai một "Thiên hạ đệ nhất điên nhân" trước khi truyền ngôi cho Đời Con!
  * **Phạm vi điều khiển** (chốt G22): người chơi vẫn chọn trong sự kiện và Tam Hiệp. Hành động tốn AP chỉ còn *Luyện công* và *Hành tẩu giang hồ*; mua bán, sản nghiệp, quản lý môn phái và gia trang bị khóa. Mỗi năm `[Ngẫu nhiên: 30%]` nhân vật tự gây sự với 1 Chưởng môn hoặc 1 người trong Thập Đại Cao Thủ (Tam Hiệp sinh tử). "Sức chiến đấu $+150\%$" nghĩa là sát thương gây ra $\times 2.5$. Trạng thái không chữa được.