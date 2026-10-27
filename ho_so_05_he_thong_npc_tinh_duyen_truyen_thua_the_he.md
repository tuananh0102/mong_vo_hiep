# HỒ SƠ 05: HỆ THỐNG NHÂN VẬT (NPC), TÌNH DUYÊN, CỪU GIA & TRUYỀN THỪA THẾ HỆ
**Mục tiêu thiết kế:** Biến thế giới text-based không chỉ là những dòng chữ tĩnh mà là một xã hội võ lâm sống động. NPC tự có cuộc đời riêng, biết yêu hận tình thù, biết trả thù rửa hận, và tạo nền tảng cho cơ chế **"Tử Tôn Truyền Thừa"** cân bằng, chặt chẽ (Khi nhân vật chính chết đi, người chơi tiếp tục nhập vai vào con cháu của mình mà không gây lạm phát tài sản).

---

## I. KIẾN TRÚC AI CỦA NPC ĐỘNG (LIVING JIANGHU)

Trong mỗi ván chơi, hệ thống sẽ khởi tạo ngẫu nhiên **200 NPC có tên tuổi** rải rác khắp 5 khu vực và các môn phái. Mỗi khi người chơi bấm **"+1 Tuổi"**, các NPC này cũng tự động thực hiện hành động ngầm:

### 1. Thuộc tính Cốt lõi của một NPC
* **Bản mệnh & Lập trường:** Chính trực, Ngụy quân tử (kiểu Nhạc Bất Quần), Tà ác, Ngông cuồng (kiểu Hoàng Dược Sư), hoặc Si tình (kiểu Lý Mạc Sầu).
* **Tầng lớp & Cảnh giới:** Từ Đệ tử ngoại môn $\rightarrow$ Chân truyền $\rightarrow$ Trưởng lão $\rightarrow$ Chưởng môn / Tuyệt đỉnh cao thủ.
* **Thang điểm Quan hệ với Người chơi ($-100$ đến $+100$):**
  * **$-100$ đến $-60$ (Huyết Hải Thâm Thù):** Gặp mặt là rút đao chém giết không nói nhiều, hoặc thuê sát thủ ám sát người chơi mỗi năm.
  * **$-59$ đến $-20$ (Chướng Mắt / Hiềm Khích):** Thường xuyên châm chọc, phá đám trong các kỳ đại hội, tranh mua vật phẩm ở chợ đấu giá.
  * **$-19$ đến $+20$ (Người Dưng Nước Lã):** Giao tiếp xã giao bình thường.
  * **$+21$ đến $+60$ (Bằng Hữu Giang Hồ):** Có thể rủ đi uống rượu, luận bàn võ công, tặng quà.
  * **$+61$ đến $+100$ (Sinh Tử Chi Giao / Khắc Cốt Ghi Tâm):** Sẵn sàng chắn đao thay người chơi khi lâm nguy, tự nguyện truyền thụ tuyệt học hoặc gả đi theo người chơi.

---

## II. HỆ THỐNG HỒNG NHAN TRI KỶ & TÌNH DUYÊN KIM DUNG

Khác với các game thông thường chỉ cần "tặng quà là cưới được", hệ thống tình duyên ở đây được thiết kế theo đúng các **nguyên mẫu (Archetypes)** kinh điển của Kim Dung, nơi tình yêu luôn đi kèm với trắc trở môn quy và xung đột Chính – Tà.

### 1. Sáu Nguyên Mẫu Hồng Nhan / Lang Quân (Romance Archetypes)

| Nguyên mẫu | Hình tượng Kim Dung tiêu biểu | Đặc điểm Tính cách & Xuất thân | Điều kiện Chinh phục & Biến cố Tình cảm |
| :--- | :--- | :--- | :--- |
| **1. Thanh Mai Trúc Mã (Tiểu Sư Muội / Sư Tỷ)** | Nhạc Linh San, Quách Phù | Ngây thơ, lớn lên cùng người chơi trong môn phái từ năm $10 - 15$ tuổi. | Độ hảo cảm cao sẵn từ nhỏ. **Biến cố:** Dễ bị một gã công tử ngoại môn hào nhoáng hoặc tân đệ tử (kiểu Lâm Bình Chi) cướp mất nếu người chơi có *Mị lực thấp* hoặc bị trục xuất khỏi phái. |
| **2. Băng Thanh Ngọc Khiết (Tiên Tử Ẩn Thế)** | Tiểu Long Nữ, Vương Ngữ Yên | Lạnh lùng, thoát tục, không hiểu sự đời, võ công cực cao hoặc thuộc làu bí kíp thiên hạ. | Không nhận quà cáp bằng tiền. Đòi hỏi người chơi phải có *Phúc duyên cao*, *Hiệp nghĩa trung lập* và vượt qua sự kiện "Đồng sinh cộng tử" (như bị nhốt chung trong mật thất/đáy vực). |
| **3. Yêu Nữ Ma Giáo / Quận Chúa Ngoại Bang** | Triệu Mẫn, Nhậm Doanh Doanh, A Tử | Thông minh tuyệt đỉnh, tà khí, dám yêu dám hận, bất chấp thủ đoạn vì người mình yêu. | Bắt đầu từ mối quan hệ **Kẻ thù ($-50$)**. Qua các lần đấu trí đấu lực trên giang hồ mà nảy sinh tình ý. Yêu cầu người chơi phải chịu áp lực bị Chính đạo chửi rủa là "Cấu kết yêu nữ". |
| **4. Hiệp Nữ Lẫm Liệt / Chưởng Môn Chính Đạo** | Chu Chỉ Nhược, Quách Tương | Mang trên vai trọng trách sư môn, bề ngoài dịu dàng nhưng nội tâm giằng xé giữa Tình và Nghĩa. | Rất coi trọng điểm *Hiệp nghĩa ($+500$ trở lên)*. **Biến cố:** Sư phụ của nàng trước khi chết có thể ép nàng lập lời thề độc "Không được lấy người chơi", đẩy nàng vào con đường hắc hóa nếu người chơi phụ bạc. |
| **5. Ôn Nhu Tri Kỷ (Thị Nữ / Y Nữ)** | Tiểu Chiêu, Song Nhi, Trình Linh Tố | Dịu dàng, hết lòng hy sinh, giỏi y thuật hoặc kỳ môn độn giáp, không bao giờ phản bội. | Dễ chinh phục nhất qua các sự kiện cứu mạng hoặc chuộc thân. Khi kết hôn sẽ giúp người chơi tăng mạnh tốc độ hồi phục nội thương và quản lý gia trang cực tốt. |
| **6. Độc Phụ Tuyệt Tình (Sư Bá / Cao Thủ Hận Tình)** | Lý Mạc Sầu, Khang Mẫn, Mai Siêu Phong | Đẹp sắc sảo nhưng tâm lý bất ổn do từng bị phản bội trong quá khứ. | Cực kỳ nguy hiểm. Nếu người chơi có *Mị lực $\ge 85$* tán tỉnh thành công thì được truyền tà công cực mạnh, nhưng chỉ cần người chơi có thêm nhân tình khác, ả sẽ lập tức hạ độc hoặc giết sạch cả nhà người chơi. |

---

### 2. Kịch bản Sự kiện Tình Duyên Tiêu Biểu: "Chính Tà Bất Lưỡng Lập"

#### [Sự kiện Đỉnh Cao]: Đại Hôn Đẫm Máu Trên Đại Điện
* **Điều kiện kích hoạt:** Người chơi là đệ tử Chính phái (Hiệp nghĩa $> 300$), nhưng lại quyết định kết hôn với một **Yêu nữ Ma Giáo** (Hoặc ngược lại).
* **Diễn biến:** Ngày bạn bái đường thành thân, Sư phụ và các vị đồng môn dẫn đầu 3 đại môn phái bất ngờ đạp đổ cổng hỷ đường, chỉ kiếm vào mặt tân nương của bạn: *"Nghịch đồ! Hôm nay ngươi tự tay đâm chết con yêu nữ này thì vẫn là đệ tử bản phái, bằng không đừng trách sư môn thanh lý môn hộ!"*
* **Lựa chọn sinh tử:**
  * **[A] Nắm chặt tay nàng, vung kiếm chém đứt vạt áo Bội phản sư môn (Mô-típ Dương Quá / Trương Vô Kỵ):**
    * *Hệ quả:* Lập tức bị trục xuất khỏi môn phái, điểm Hiệp nghĩa giảm $300$, bị Chính đạo truy sát trong 5 năm tới. Tuy nhiên, độ hảo cảm của Thê tử đạt mức tuyệt đối **[Sinh Tử Tương Tùy]** (Nàng sẽ truyền cho bạn tuyệt học trấn phái của Ma Giáo và cùng bạn ẩn cư hoặc gây dựng thế lực riêng).
  * **[B] Cắn răng đâm một kiếm vào vai nàng để diễn kịch lừa sư phụ, sau đó tìm cách cứu nàng trong ngục tối `[Roll: Ngộ tính vs 70]`:**
    * *Thành công:* Giữ được chức vị trong phái, nửa đêm cướp ngục đưa nàng đi trốn ở Giang Nam.
    * *Thất bại:* Kiếm đâm lệch vào tim hoặc nàng tưởng bạn phản bội thật nên tuyệt vọng tự vẫn trước mặt bạn. Bạn nhận trạng thái vĩnh viễn **[Tâm Ma Đứt Ruột]** *(Mỗi năm giảm $5$ Căn cốt, nhưng uy lực các môn võ công hệ Âm/Sầu khổ như Ám Nhiên Tiêu Hồn Chưởng tăng $50\%$).*
  * **[C] Nghe lời sư phụ, ra tay hạ sát nàng để bảo toàn danh tiếng và chức Chưởng môn tương lai:**
    * *Hệ quả:* Giữ vững địa vị Chính đạo, được Sư phụ truyền ngôi sớm. Nhưng toàn bộ thế lực Ma Giáo của cha nàng sẽ lập tức phát lệnh **Huyết Sát Lệnh** truy lùng bạn đến cuối đời.

---

## III. KẾT NGHĨA KIM LAN & HỆ THỐNG CỪU GIA (ÂN OÁN GIANG HỒ)

### 1. Kết Nghĩa Kim Lan (Mô-típ Kiều Phong – Hư Trúc – Đoàn Dự)
* Người chơi có thể kết bái huynh đệ/tỷ muội với tối đa **2 NPC cùng chí hướng** `[Cổng: Hảo cảm ≥ 80]`.
* **Lợi ích Gameplay:**
  * **Truyền công & Hợp kích:** Mỗi năm có thể chọn hành động *"Uống rượu luận võ"* cùng huynh đệ để học ké 1 chiêu thức trong bộ võ công của họ.
  * **Cứu giá:** Khi người chơi gặp sự kiện bị kẻ thù vây sát dẫn đến tử vong ($HP$ về $0$), `[Ngẫu nhiên: 50%]` Huynh đệ kết nghĩa sẽ bất ngờ từ trên trời rơi xuống đỡ đòn chí mạng và đưa người chơi chạy thoát (người chơi còn $10\%$ HP, huynh đệ nhận Điểm Ám Thương $+5$). Đây là một **Hiệu ứng Cứu Mạng**, tuân theo giới hạn 1 lần/trận và thứ tự ưu tiên ở Hồ sơ 02, Phần V.4.
* **Rủi ro Phản bội:** Nếu kết nghĩa nhầm với NPC có tính cách **[Ngụy Quân Tử]** hoặc **[Tham Lam]**, khi người chơi nhặt được Thần binh/Bí kíp cấp Thần, gã huynh đệ này có thể bỏ độc vào rượu để cướp đoạt!

### 2. Hệ thống Cừu Gia & Vòng Xoáy Báo Thù
Trong giang hồ, mỗi khi người chơi chọn kết liễu mạng sống của một NPC trong lúc tỷ thí, hệ thống sẽ kiểm tra **Mạng lưới quan hệ của NPC đó**:
* **Cha già, Sư phụ hoặc Con trai của kẻ bị giết** sẽ lập tức chuyển trạng thái quan hệ với người chơi thành **$-100$ (Huyết Thù)**.
* **Các hình thức trả thù theo năm:**
  * *Thuê Sát Thủ:* Nếu kẻ thù giàu có (Phú thương/Thế gia), chúng sẽ chi bạc thuê **Hắc Phong Lâu** ám sát bạn vào ban đêm.
  * *Đầu độc giếng nước / Bắt cóc người thân:* Nếu kẻ thù là Tà phái, chúng không đánh trực diện mà nhắm vào Thê tử hoặc Con cái đang ở nhà của bạn.
  * *Quân tử báo thù 10 năm chưa muộn:* Con trai của kẻ bị bạn giết có thể lặng lẽ đi tìm kỳ ngộ, luyện thành tuyệt kỹ rồi đột ngột xuất hiện thách đấu sinh tử với bạn đúng vào năm bạn 50 tuổi!

---

## IV. HỆ THỐNG HẬU DUỆ, CHỐNG LẠM PHÁT DI SẢN & TRUYỀN THỪA THẾ HỆ

Đây là cơ chế cốt lõi giữ chân người chơi hàng trăm giờ giống với dòng game *BitLife*: **Cái chết không phải là kết thúc (Game Over), mà là sự chuyển giao đầy thử thách cho thế hệ tiếp theo.**

### 1. Sinh Con & Nuôi Dạy Hậu Duệ
Sau khi Kết hôn (hoặc có sự kiện *"Phong lưu một đêm"* ở tửu lầu/kỹ viện), người chơi có tỷ lệ sinh con.
* **Di truyền Chỉ số (Genetics):** Chỉ số gốc (*Căn cốt, Ngộ tính, Mị lực*) của đứa trẻ khi sinh ra được tính từ **Chỉ số Bẩm sinh** của cha mẹ (giá trị lúc Tuổi 0 của họ, sau khi cộng Gia cảnh và Thiên phú), **không** tính phần tăng nhờ đan dược, kỳ ngộ hay tu luyện:
  * $\text{Trung bình} = \frac{\text{Bẩm sinh Cha} + \text{Bẩm sinh Mẹ}}{2}$. Nếu Trung bình $> 70$, phần vượt $70$ chỉ được tính một nửa ("Hồi quy về trung bình").
  * $\text{Chỉ số con} = \text{Trung bình (đã điều chỉnh)} \pm 15$ (ngẫu nhiên), giới hạn trong $0 - 100$.
  * **[Tiên Thiên Võ Thể] (Thiên phú Đỏ):** `[Ngẫu nhiên: 30%]` nếu **cả cha và mẹ** đều từng đạt Cấp $10/10$ ở ít nhất 1 môn Trấn phái hoặc Thần công SSS. Hiệu ứng: tốc độ Tiến độ lĩnh ngộ $+20\%$ cho mọi môn võ.
  * Phúc duyên của con không di truyền, được quay theo Gia cảnh như người chơi mới.
* **Định hướng Giáo dục (Từ $3 - 15$ tuổi của con):** Bất kể người chơi đang ở độ tuổi nào, chỉ cần có ít nhất 1 người con trong độ tuổi $3 - 15$, người chơi có **1 lượt miễn phí (0 AP)** mỗi năm để dạy con:
  * *Đích thân truyền thụ võ công:* Con cái có thể học sẵn tối đa **2 môn võ công** mà người chơi đang sở hữu trước khi đứa trẻ tròn 16 tuổi.
  * *Gửi vào môn phái của bằng hữu:* Nhờ huynh đệ kết nghĩa làm sư phụ cho con mình.
  * *Chiều chuộng quá mức (Nếu Ngân lượng $> 5000$):* Đứa trẻ dễ sinh ra tính cách **[Phá Gia Chi Tử]** hoặc **[Kiêu Ngạo]** (giống Dương Khang).

---

### 2. Cơ chế Qua Đời, Hao Hụt Di Sản & Chuyển Kiếp Kế Thừa

Khi nhân vật chính **Đạt giới hạn tuổi thọ (Thường từ $65 - 90$ tuổi tùy Căn cốt và Cảnh giới Nội công, xem công thức $Age_{max}$ ở Hồ sơ 06)** hoặc **Tử trận trên giang hồ**, màn hình **"Vẫn Lạc" (Qua Đời)** sẽ hiện ra:

#### Trường hợp 1: Đã có Con Cái (hoặc Đệ tử Chân truyền nhận làm Con nuôi)
Người chơi được quyền chọn **1 người con bất kỳ** để tiếp tục chơi tiếp ngay trong chính Thế giới hiện tại mà không bị reset lịch sử. Tuy nhiên, để tránh lạm phát sức mạnh (Snowball Effect), quá trình chuyển giao sẽ áp dụng **3 Quy tắc Hao hụt & Thử thách Gia tộc**:

1. **Quy tắc "Thần Công Bất Truyền Chi Bí" (Hao hụt Võ học):**
   * Khi Đời Cha qua đời, các môn võ công lưu lại trong *Tàng Kinh Các gia tộc* (trừ môn võ do Đời Cha tự sáng tạo lúc bế quan) tự động chuyển thành **[Bản Chép Tay Của Tiên Phụ] (Độ hoàn thiện: $60\%$)**.
   * Quy tắc quy đổi: **Độ hoàn thiện $X\%$ $\rightarrow$ Cấp tối đa $X/10$** (Bản $60\%$ đạt tối đa Cấp $6/10$; nâng Tàng Kinh Các Gia Tộc lên $80\%$ đạt tối đa Cấp $8/10$, xem Hồ sơ 06).
   * Đời Con khi học từ bản chép tay chỉ đạt tối đa **Cấp $6/10$** của môn võ đó. Muốn khôi phục lên $10/10$ (Bản hoàn chỉnh), Đời Con bắt buộc phải có **Ngộ tính $\ge 80$** để tự lĩnh ngộ lại, hoặc phải đi tìm truyền nhân gốc của môn phái đó để tỷ thí/học bù.
2. **Quy tắc "Tài Sản Bất Minh & Thuế Quan Phủ" (Hao hụt Ngân lượng):**
   * Ngân lượng mặt chỉ được kế thừa tối đa **$30\%$** (Phần còn lại bị dùng để tổ chức tang lễ, mua chuộc quan phủ giữ đất, hoặc bị quản gia/vợ lẽ biển thủ khi chủ nhân vừa nhắm mắt).
3. **Sự kiện Cố định khi Chuyển Kiếp: "Quần Hùng Trục Lộc - Giữ Gìn Cơ Nghiệp":**
   * Ngay năm đầu tiên Đời Con lên nắm quyền, nếu Đời Cha từng có *Ngân lượng $> 3000$* hoặc sở hữu *Thần Binh / Bí kíp cấp SSS*, hệ thống lập tức kích hoạt sự kiện **Kẻ thù cũ & Đạo tặc vây công gia trang**:
     * **Nếu Thực lực Đời Con đủ mạnh (Thắng trận Quyết Đấu Tam Hiệp):** Giữ được Gia trang, giữ được Thần binh và uy chấn giang hồ ngay lập tức.
     * **Nếu Thực lực Đời Con quá yếu (Thua trận):** Gia trang bị đốt trụi! Toàn bộ vật phẩm đặt tại Gia trang (*Hàn Ngọc Sàng*, Tàng Kinh Các Gia Tộc) bị mất. Người chơi chỉ được chọn **ôm 1 món di vật duy nhất** (1 thanh Thần binh HOẶC 1 cuốn Bí kíp gốc HOẶC giữ lại 1 Tọa kỵ / Linh thú) nhảy xuống sông trốn thoát, bắt đầu lại từ hai bàn tay trắng với mối huyết thù diệt môn (*"Phụ trái tử hoàn"*)!

#### Trường hợp 2: Chết Trẻ, Tuyệt Tự (Không có con cái cũng không có đệ tử)
Nếu chết khi chưa có người nối dõi, hệ thống sẽ tính tổng **Điểm Thành Tựu Kiếp Này (Karma Points)** dựa trên danh vọng, võ học đã đạt được để quy đổi thành **Đặc Quyền Đầu Thai (Luân Hồi)** cho ván chơi mới ở Tuổi 0 (Giữ lại 1 Thiên phú hiếm hoặc tăng tỷ lệ sinh ra trong Võ lâm thế gia ở kiếp sau).