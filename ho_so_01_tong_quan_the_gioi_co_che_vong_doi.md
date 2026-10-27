# HỒ SƠ 01: TỔNG QUAN THẾ GIỚI, HỆ THỐNG CHỈ SỐ & CƠ CHẾ VÒNG ĐỜI
**Tên dự án:** *Vạn Kiếp Giang Hồ* (Thể loại: Text-based Life Sim / Võ Hiệp Kim Dung)

---

## I. BỐI CẢNH THẾ GIỚI: THẬP PHƯƠNG THẦN CHÂU

Thế giới trong game là một lục địa giả tưởng mang tên **Thần Châu**, nơi hội tụ tinh hoa địa lý và văn hóa từ khắp các tác phẩm Kim Dung, chia làm 5 khu vực lớn với đặc trưng sự kiện hoàn toàn khác nhau:

| Khu vực | Đặc trưng Địa lý & Khí hậu | Thế lực / Điểm nóng Võ lâm |
| :--- | :--- | :--- |
| **Trung Nguyên** | Đồng bằng trù phú, thành thị sầm uất, trung tâm văn hóa và chính trị. | Nơi tọa lạc của các đại môn phái Chính đạo (Thiếu Lâm, Võ Đang, Toàn Chân), Tổng đà Cái Bang, Hắc Mộc Nhai và Hoàng thành. |
| **Giang Nam** | Sông nước hữu tình, yên vũ mộng mơ, nơi tập trung giới văn nhân, phú thương. | Các thế gia vọng tộc (như Mộ Dung gia), Đào Hoa Đảo, các bang hội buôn muối, kỹ viện và sát thủ đường. |
| **Tây Vực & Đại Mạc** | Sa mạc cát vàng khắc nghiệt, những ốc đảo bí ẩn và dãy núi tuyết quanh năm. | Quang Minh Đỉnh (Minh Giáo), Tinh Túc Hải, Bạch Đà Sơn, cổ mộ dưới lòng cát. Nơi chứa nhiều độc thuật và tà công. |
| **Nam Cương** | Rừng thiêng nước độc, sương mù bao phủ, địa hình hiểm trở nhiều sơn trại. | Ngũ Độc Giáo, Đại Lý Đoàn Thị, Vạn Thú Sơn Trang. Nổi tiếng với cổ trùng, y thuật dị biệt và kỳ trân dị bảo. |
| **Bắc Cảnh (Quan Ngoại)** | Thảo nguyên mênh mông giáp ranh vùng núi băng giá cực Bắc. | Các bộ lạc du mục thiện chiến, Tuyết Sơn Phái, Băng Hỏa Đảo. Nơi rèn luyện ngoại công bá đạo và săn tìm thần thú. |

---

## II. HỆ THỐNG CHỈ SỐ CỐT LÕI (CORE STATS)

Khi đầu thai ở **Tuổi 0**, người chơi sẽ nhận bộ chỉ số gốc ngẫu nhiên dựa trên **Gia cảnh xuất thân**.

> **Nguồn sự thật duy nhất:** Mục II này (đặc biệt là **Bảng Chỉ Số Master** ở mục 8) định nghĩa toàn bộ chỉ số của game.
> Các hồ sơ khác chỉ được dùng chỉ số có tên trong bảng.
> Khi thêm chỉ số mới, phải bổ sung vào bảng trước.

### 0. Giới Tính
* Người chơi **tự chọn Nam hoặc Nữ** ở Tuổi 0, trước khi hệ thống quay Gia cảnh.
* Giới tính cố định suốt đời và được di truyền ngẫu nhiên ($50/50$) cho con cái.
* Nội dung bị giới hạn theo giới tính:
    * **Thiếu Lâm Tự:** Chỉ nhận Nam giới.
    * **Nga Mi Phái:** Nam giới chỉ được làm đệ tử ngoại môn tạp dịch (trừ kỳ ngộ đặc biệt).
    * **Cổ Mộ Phái:** Chỉ nhận Nữ giới (Nam giới chỉ qua sự kiện ẩn, xem Hồ sơ 03).
    * **Quỳ Hoa Bảo Điển / Tịch Tà Kiếm Phổ:** Chỉ Nam giới luyện được. Nữ giới mở sách chỉ đọc được câu thoại, không luyện được.
    * **Tình duyên & Thiên phú [Đào Hoa Kiếp]:** Áp dụng với NPC khác giới. Hồ sơ 05 hiện viết các nguyên mẫu cho người chơi Nam; người chơi Nữ dùng nguyên mẫu **Lang Quân** tương ứng (cần bổ sung ở Hồ sơ 05).

### 1. Bốn Chỉ số Thiên phú (Thang điểm gốc: $0 - 100$)
* **Căn Cốt (Thể chất & Nội lực):** Quyết định giới hạn Sinh mệnh ($HP$), tốc độ hồi phục sau trọng thương, tuổi thọ tối đa và khả năng tu luyện các môn **Ngoại công / Dương cương nội công** (như *Hàng Long Thập Bát Chưởng*, *Kim Cương Bất Hoại*). Căn cốt thấp dễ chết yểu vì bệnh tật lúc nhỏ.
* **Ngộ Tính (Trí tuệ & Lĩnh ngộ):** Quyết định tốc độ học võ công mới, khả năng tự sáng tạo chiêu thức hoặc phá giải bí kíp. Ngộ tính cao học **Kiếm pháp, Kỳ môn độn giáp, Y thuật** cực nhanh.
    * *Cơ chế đặc biệt:* Một số tuyệt học (như *Thái Huyền Kinh* hay *Không Minh Quyền*) yêu cầu **Ngộ tính cực thấp ($< 20$)** – tâm trí ngây ngô, không tạp niệm mới lĩnh hội được.
* **Phúc Duyên (Khí vận & Kỳ ngộ):** Chỉ số "ẩn" quan trọng nhất. Quyết định tỷ lệ gặp sự kiện hiếm: rơi xuống vực không chết mà nhặt được bí kíp, gặp cao nhân quy ẩn truyền công lực, ăn nhầm trái cây ngàn năm tăng nội lực.
* **Mị Lực (Ngoại hình & Khí chất):** Ảnh hưởng đến thái độ của NPC khi giao tiếp, tỷ lệ thành công khi kết giao bằng hữu, thu phục đệ tử, hoặc tán tỉnh các Hồng nhan/Tri kỷ. Một số môn phái yêu cầu Mị lực cao mới nhận làm đệ tử: *Cổ Mộ Phái* (Mị lực $\ge 75$), *Tiêu Dao Phái* (Mị lực $\ge 80$ kèm Ngộ tính $\ge 80$). Điều kiện đầy đủ xem Hồ sơ 02.

### 2. Bốn Chỉ số Xã hội (Biến động liên tục)
* **Ngân Lượng (Đơn vị: Lạng bạc):** Dùng để mua trang bị, dược liệu, hối lộ quan phủ, bao nuôi môn khách, mở sòng bạc hoặc quyên góp lấy tiếng thơm.
* **Hiệp Nghĩa (Bản chất thật - Thang điểm: $-1000$ đến $+1000$):** Tổng thiện - ác **thực sự** mà nhân vật đã làm, kể cả những việc không ai biết. Người chơi luôn nhìn thấy, NPC thì không.
    * **Quân Tử ($\ge +300$):** Tâm cảnh quang minh, mở khóa các lựa chọn nội tâm chính trực.
    * **Trung Lập / Tà Dị ($-299$ đến $+299$):** Tự do hành xử theo ý thích (phong cách *Đông Tà Hoàng Dược Sư* hoặc *Lệnh Hồ Xung*).
    * **Ma Tâm ($\le -300$):** Mở khóa được các **Ma công tàn độc** (như *Hấp Tinh Đại Pháp*, *Hóa Công Đại Pháp*), bất kể thiên hạ có biết hay không. Ma công mạnh ngang Thần công SSS nhưng có phản phệ (Hồ sơ 02 II.2).
* **Thanh Danh (Tiếng tăm công khai - Thang điểm: $-1000$ đến $+1000$):** Điều **thiên hạ tin** về nhân vật. Bắt đầu bằng $0$, bằng với Hiệp nghĩa cho đến khi nhân vật bắt đầu làm việc mờ ám (xem mục 3).
    * **Chính Nhân Quân Tử ($\ge +300$):** Được người đời kính trọng, danh môn chính phái ưu ái, nhưng bị ràng buộc bởi quy tắc môn quy.
    * **Vô Danh / Lãng Tử ($-299$ đến $+299$):** Không phe nào đặc biệt ưu ái hay truy sát.
    * **Đại Ma Đầu ($\le -300$):** Bị Chính đạo truy sát mỗi khi vào thành thị lớn, được Hắc đạo kính sợ và có thể thống lĩnh Hắc đạo.
* **Danh Vọng (Độ nổi tiếng - Thang điểm: $0$ đến $1000$):** Mức độ **thiên hạ biết đến tên tuổi**, không phân thiện ác (một Đại Ma Đầu có thể có Danh vọng rất cao). Dùng để xét Anh Hùng Thiếp Hoa Sơn Luận Kiếm, điều kiện Khai Tông Lập Phái, khả năng NPC nhận ra người chơi, giá trị lệnh truy nã.
    * *Tăng:* Thắng Quyết Đấu Tam Hiệp công khai trước NPC có tên ($+5$ với đệ tử thường, $+20$ với Trưởng lão, $+50$ với Chưởng môn / Top 10), lập công trong Đại sự kiện, thăng chức môn phái, nhiệm vụ áp tiêu / truy nã thành công.
    * *Giảm:* Thua công khai ($-\frac{1}{2}$ mức tăng tương ứng), mỗi năm ẩn cư / bế quan không xuất hiện trên giang hồ ($-5$/năm).
    * *Tai tiếng:* Khi một hành động **[Ám] lớn** (ám sát, hạ độc, giết người diệt khẩu) bị bại lộ, kể cả bị bắt quả tang lúc thất bại, người chơi được cộng Danh vọng **bằng mức thắng công khai trước chính nạn nhân** ($+5$ đệ tử, $+20$ Trưởng lão, $+50$ Chưởng môn / Top 10), song song với việc Thanh danh bị trừ.
      Việc [Ám] vặt (móc túi, trộm vặt) không sinh tai tiếng. Ác danh lẫy lừng cũng là danh: Đại ma đầu vẫn nhận Anh Hùng Thiếp nếu đủ Chiến lực.
    * *Danh vọng chức vị:* Đang giữ chức **Trưởng lão** được cộng thêm $+150$, **Chưởng môn / Giáo chủ** (kể cả môn phái tự lập) $+300$, tính chung vào Danh vọng hiển thị (trần $1000$).
      Phần này **không tích lũy** và mất ngay khi mất chức (bị trục xuất, thoái vị, môn phái tan rã); Danh vọng cá nhân giữ nguyên.

> **Quy tắc đọc điều kiện "Hiệp nghĩa" trong các hồ sơ:**
> * Điều kiện do **NPC hoặc thế lực phán xét** (gia nhập / thăng cấp môn phái, nhận hợp đồng, thái độ NPC, yêu cầu của Hồng nhan, truy sát, truy nã) $\rightarrow$ xét theo **Thanh danh**.
> * Điều kiện về **bản thân nhân vật** (học / luyện võ công, mở khóa lựa chọn nội tâm, Tâm ma, Kết cục, Điểm Luân Hồi) $\rightarrow$ xét theo **Hiệp nghĩa thật**.
> * Mọi hệ quả ghi "Hiệp nghĩa $\pm X$" trong kịch bản mặc định là **hành động công khai**: Hiệp nghĩa và Thanh danh cùng thay đổi $X$. Nếu hành động gắn nhãn **[Ám]**, chỉ Hiệp nghĩa thay đổi (xem mục 3). Một số sự kiện có thể ghi riêng "Thanh danh $\pm X$" (ví dụ được tung hô oan, bị vu oan).

### 3. Cơ chế Hành động Ám & Bại lộ (Mô-típ Ngụy Quân Tử)
Mọi việc ác làm lén (móc túi, hạ độc, ám sát thuê, giết người diệt khẩu, tống tiền, đổ tội) được đánh dấu **[Ám]** trong kịch bản:
* **Gộp việc vặt:** Các việc [Ám] nhỏ lặp lại cùng loại trong một năm (móc túi, trộm vặt, ăn quỵt) tính chung là **1 hành động [Ám]** ghi vào cuối năm, giá trị Hiệp nghĩa bằng tổng của cả năm. Việc [Ám] có nạn nhân cụ thể (ám sát, hạ độc, tống tiền, đổ tội) luôn tính riêng từng lần.
* **Bại lộ tức thời:** Mỗi hành động [Ám] có $20\%$ bị lộ ngay. Giảm còn $5\%$ nếu dùng *Dịch Dung* hoặc độc không dấu vết (*Thất Tâm Hải Đường*).
* **Đổ tội (chỉ khi Dịch Dung):** Khi một việc [Ám] làm lúc đang Dịch Dung bị chọn để lộ ở bước bại lộ hàng năm, có $2/3$ khả năng thiên hạ đổ tội cho **kẻ bị giả dạng**: việc đó rời khỏi danh sách chưa lộ, người chơi không mất Thanh danh, kẻ bị giả dạng thành Cừu gia của nạn nhân (Hồ sơ 05). $1/3$ còn lại lộ ra là người chơi như bình thường. Việc làm bằng mặt thật không bao giờ đổ tội được.
  * *Lý do (`mo_phong/BAO_CAO.md` mục 20):* không có luật này, mỗi hợp đồng ám sát sớm muộn cũng thành một lần lộ (thua thì lộ ngay, thắng thì rò rỉ dần vì xác suất bại lộ hàng năm tăng theo số việc chưa lộ), nên lối chơi "sát thủ giấu mặt" chỉ làm được khoảng $1$ hợp đồng trước khi Thanh danh tụt xuống mức Đại Ma Đầu.
* **Bại lộ hàng năm ("Giang hồ không có bức tường nào không lọt gió"):** Mỗi khi nhấn "+1 Tuổi", $P(\text{bại lộ}) = 2\% \times \text{số hành động [Ám] chưa bị lộ}$ (tối đa $30\%$), hệ thống chọn ngẫu nhiên 1 hành động để lộ.
* **Hệ quả khi bại lộ:** Thanh danh bị trừ $1.5 \times$ giá trị Hiệp nghĩa của hành động đó; nếu là [Ám] lớn thì Danh vọng được cộng theo quy tắc *Tai tiếng* ở mục 2. Nạn nhân và thân nhân (nếu còn sống) nhận người chơi là Cừu gia theo Hồ sơ 05.
* **Đại Vạch Trần:** Khi $\text{Thanh danh} - \text{Hiệp nghĩa} \ge 400$ và tồn tại một NPC có Ngộ tính $\ge 80$ với Hảo cảm $\le -20$ đối với người chơi, mỗi năm có $10\%$ NPC này vạch trần người chơi trước đại hội võ lâm: **Thanh danh lập tức bằng Hiệp nghĩa thật** (dẫn tới kết cục *Ngụy Quân Tử - Thân Bại Danh Liệt*, Hồ sơ 07).

### 4. Chỉ số Nội công & Chiến đấu
> **Quy ước thuật ngữ:** Từ **"Nội lực"** chỉ được dùng trong văn miêu tả và trong cụm **"Hệ Nội lực"** (Chí Dương / Chí Âm / Trung Hòa). Mọi điều kiện, công thức phải dùng **Nội tức** (điểm) hoặc **Cảnh giới Nội công** (cấp).

* **Cảnh Giới Nội Công (Cấp $0 - 10$):** Cấp của môn **Tâm pháp chủ đạo** đang trang bị ($0$ nếu chưa có). Trong các công thức Hồ sơ 06 viết là *"Cấp Nội Công"*. Là thước đo duy nhất cho "nội công thâm hậu" (ví dụ ngưỡng AP Lão niên, Thất Thương Quyền, bức độc).
* **Hệ Nội Lực (Chí Dương / Chí Âm / Trung Hòa):** Thuộc tính của Tâm pháp chủ đạo, dùng cho cơ chế khắc chế (Hồ sơ 02, 06).
* **Nội Tức ($MP$, điểm):** Nguồn năng lượng để tung Tuyệt kỹ, bức độc, hộ thể trong trận. Có giá trị hiện tại và tối đa ($MP_{max}$, công thức Hồ sơ 06). Đan dược / kỳ ngộ "tăng Nội lực" đều quy về **tăng $MP_{max}$**.
* **Sinh Mệnh ($HP$, điểm):** Giá trị hiện tại và tối đa ($HP_{max}$, công thức Hồ sơ 06).
* **Cấp Võ Học (Cấp $1 - 10$ cho từng môn):** Độ thành thạo một môn võ công cụ thể. Bị giới hạn bởi độ hoàn thiện bí kíp (Hồ sơ 05).
* **Cấp Khinh Công (Cấp $0 - 10$):** Cấp của môn Khinh công đang trang bị ($0$ nếu chưa có), không vượt trần theo tier của môn đó (Nhập môn $4$, Thượng thừa $6$, Trấn phái $8$, SSS $10$; Hồ sơ 02 II.1). Khi kịch bản ghi `[Roll: Cấp Khinh công vs ...]`, dùng giá trị $\text{Cấp Khinh Công} \times 10$ để đưa vào công thức kiểm định thang $0 - 100$.
* **Điểm Ám Thương (điểm, $\ge 0$):** Thương tích tích lũy, mỗi điểm giảm 1 năm tuổi thọ tối đa (Hồ sơ 06).
* **Kháng Độc / Kháng Hàn ($0 - 100\%$):** Giảm tương ứng sát thương và thời gian hiệu lực của độc tố / hàn khí. Độc dược chia 4 cấp: **Hạ, Trung, Thượng, Kỳ độc**. Trạng thái *[Bách Độc Bất Xâm]* nghĩa là Kháng Độc $100\%$ với độc cấp Trung trở xuống.
* **Tuổi Thọ Tối Đa ($Age_{max}$, ẩn):** Công thức Hồ sơ 06. Thanh trạng thái chỉ hiển thị dạng mô tả ("Khí huyết dồi dào", "Đèn cạn dầu"...).

### 5. Kỹ năng Tạp học (Thang điểm: $0 - 100$)
Các kỹ năng ngoài võ học, tăng qua hành động **"Học Tạp học"** (1 AP, $+5$ đến $+15$ tùy Ngộ tính, cần có thầy dạy hoặc sách), qua kỳ ngộ hoặc truyền thụ của môn phái:
* **Y Thuật:** Chữa thương, trị độc cho bản thân và NPC, chế đan dược.
* **Độc Thuật:** Chế độc, hạ độc, nuôi độc trùng.
* **Kỳ Môn Độn Giáp:** Phá / bày trận pháp, cơ quan.
* **Cầm, Cờ, Thi, Họa (4 kỹ năng riêng):** Giao tiếp với văn nhân, giải đố, điều kiện vào Tiêu Dao Phái, Đào Hoa Đảo. (Dùng chữ **"Cờ"** thay cho "Kỳ" để không nhầm với *Kỳ Môn Độn Giáp*.)
* Một kỹ năng được coi là **"Đã học"** khi đạt $\ge 20$, **"Tinh thông"** khi đạt $\ge 70$, **"Đại sư"** khi đạt $100$.

### 6. Chỉ số Quan hệ & Tổ chức
* **Hảo Cảm (Theo từng NPC, $-100$ đến $+100$):** Thang mức và hệ quả xem Hồ sơ 05.
* **Cống Hiến Môn Phái (Điểm, $\ge 0$):** Tích lũy trong môn phái hiện tại, dùng để thăng cấp (Hồ sơ 04) và đổi bí kíp ở Tàng Kinh Các. Về $0$ khi rời / phản môn phái.

### 7. Phân loại Thiên Phú, Trạng Thái, Nhãn Tính Cách & Cấp Kỳ Ngộ
* **Thiên Phú (Trait):** Bẩm sinh, chỉ nhận ở Tuổi 0 (chọn 1 trong 3) hoặc khi được sinh ra (di truyền), không mất đi. Chia 4 độ hiếm:
    * **Trắng (Thường)**, **Lam (Hiếm)** - ví dụ *[Đào Hoa Kiếp]*, **Tím (Quý)** - ví dụ *[Tư Chất Ngu Độn]*, **Đỏ (Cực hiếm)** - ví dụ *[Cửu Dương Tuyệt Mạch]*, *[Tiên Thiên Võ Thể]*.
* **Trạng Thái (Status):** Nhận trong đời qua sự kiện, có thể bị xóa hoặc chữa khỏi. Ví dụ: *[Bách Độc Bất Xâm]*, *[Mình Đồng Da Sắt]*, *[Hàn Độc Phế Phổi]*, *[Tâm Ma Đứt Ruột]*, *[Kinh Mạch Nghịch Hành]*.
* **Nhãn Tính Cách (Tag):** Dấu ấn hành vi, ảnh hưởng lựa chọn và phản ứng NPC. Ví dụ: *[Nhẫn Nhịn Thâm Sâu]*, *[Phá Gia Chi Tử]*, *[Kiêu Ngạo]*.
* **Cấp Kỳ Ngộ:** Mỗi kỳ ngộ được gắn 1 trong 4 cấp theo phần thưởng cao nhất của nó:
    * **B:** Tăng chỉ số nhỏ ($\le +10$), vật phẩm thường.
    * **A:** Võ công Nhập môn / Thượng thừa, đan dược thường, kỹ năng Tạp học.
    * **S:** Võ công Trấn phái, đan dược quý, Thần thú, Thiên phú hoặc Trạng thái hiếm.
    * **SSS:** Thần công SSS, Thần binh.

### 8. Bảng Chỉ Số Master

| Nhóm | Chỉ số | Mã dữ liệu | Thang / Kiểu | Hiển thị | Nguồn tăng / giảm chính |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Nhân thân | Giới tính | `gioi_tinh` | Nam / Nữ | Hiện | Chọn ở Tuổi 0, cố định |
| Nhân thân | Tuổi | `tuoi` | $0+$ | Hiện | $+1$ mỗi lượt |
| Thiên phú | Căn Cốt | `can_cot` | $0 - 100$, vượt được nhờ kỳ ngộ, **trần cứng $150$** | Hiện | Sự kiện, đan dược, kỳ ngộ; $-2$/năm sau 50 tuổi (sau 60 nếu Cảnh giới Nội công $\ge 8$, Hồ sơ 04 III). Hệ thống lưu thêm `can_cot_dinh` (giá trị cao nhất từng đạt) cho công thức tuổi thọ |
| Thiên phú | Ngộ Tính | `ngo_tinh` | $0 - 100$, **trần cứng $150$** | Hiện | Sự kiện, đan dược, kỳ ngộ |
| Thiên phú | Phúc Duyên | `phuc_duyen` | $0 - 100$, **trần cứng $150$** | Bán ẩn (chỉ hiện mô tả: Bạc mệnh / Bình thường / Hồng phúc / Thiên mệnh) | Sự kiện, kỳ ngộ, Thiên phú |
| Thiên phú | Mị Lực | `mi_luc` | $0 - 100$, **trần cứng $150$** | Hiện | Sự kiện, đan dược, độc công (giảm) |
| Xã hội | Ngân Lượng | `ngan_luong` | $\ge 0$ (lạng) | Hiện | Thu nhập / chi tiêu Hồ sơ 06 |
| Xã hội | Gia sản cá nhân | `gia_san` | $\ge 0$ (lạng) | Hiện | Ngân lượng + giá vốn sản nghiệp (Hồ sơ 06 Phần II.5); dùng cho kết cục #8 |
| Tổ chức | Ngân khố Môn phái | `ngan_kho_mon_phai` | $\ge 0$ (lạng), thuộc môn phái chứ không thuộc cá nhân | Hiện khi là Chưởng môn | Lợi tức trừ bảo trì và bổng lộc (Hồ sơ 06 Phần II.1) |
| Xã hội | Nợ | `no[chu_no]` | $\ge 0$ (lạng), theo từng chủ nợ | Hiện | Khoản phải trả không đủ tiền; lãi $20\%$/năm (Hồ sơ 06 Phần II.3) |
| Thiên phú | Chỉ số Bẩm sinh | `can_cot_bam_sinh`, `ngo_tinh_bam_sinh`, `mi_luc_bam_sinh` | Cố định từ Tuổi 0 | Ẩn | Chỉ dùng cho di truyền (Hồ sơ 05) |
| Xã hội | Hiệp Nghĩa | `hiep_nghia` | $-1000 \rightarrow +1000$ | Hiện với người chơi, ẩn với NPC | Mọi hành động thiện / ác, kể cả [Ám] |
| Xã hội | Thanh Danh | `thanh_danh` | $-1000 \rightarrow +1000$ | Hiện | Hành động công khai, bại lộ, vu oan, Kim Bồn Tẩy Thủ |
| Xã hội | Danh Vọng | `danh_vong` | $0 - 1000$ | Hiện | Chiến thắng công khai, Đại sự kiện, thăng chức; cộng Danh vọng chức vị khi đang giữ chức (Trưởng lão $+150$, Chưởng môn $+300$); ẩn cư làm giảm |
| Nội công | Cảnh Giới Nội Công | `canh_gioi_noi_cong` | Cấp $0 - 10$ | Hiện | Tu luyện Tâm pháp chủ đạo |
| Nội công | Hệ Nội Lực | `he_noi_luc` | Dương / Âm / Hòa | Hiện | Theo Tâm pháp chủ đạo |
| Nội công | Nội Tức | `noi_tuc`, `noi_tuc_max` | Điểm | Hiện | Công thức $MP_{max}$, đan dược, kỳ ngộ, tiêu hao trong trận |
| Chiến đấu | Sinh Mệnh | `hp`, `hp_max` | Điểm | Hiện | Công thức $HP_{max}$, thương tích, hồi phục |
| Chiến đấu | Cấp Võ Học | `cap_vo_hoc[mon]` | Cấp $1 - 10$ mỗi môn | Hiện | Luyện công (AP), truyền thụ |
| Chiến đấu | Võ Lực (phái sinh) | `vo_luc` | $0 - 100$ | Hiện | Công thức Hồ sơ 06, chỉ dùng cho Giao chiến nhanh |
| Chiến đấu | Chiến Lực (phái sinh) | `chien_luc` | $0 - 630$ | Hiện | Công thức Hồ sơ 06 I.5 (tier, cấp võ, Cảnh giới, Căn cốt, tuổi, Khinh công, Thần binh); xếp hạng Thập Đại Cao Thủ |
| Chiến đấu | Cấp Khinh Công | `cap_khinh_cong` | Cấp $0 - 10$ | Hiện | Theo môn Khinh công đang trang bị |
| Chiến đấu | Kháng Độc | `khang_doc` | $0 - 100\%$ | Hiện | Kỳ ngộ, Thần công, Trạng thái |
| Chiến đấu | Kháng Hàn | `khang_han` | $0 - 100\%$ | Hiện | Đan dược, Nội công Chí Dương |
| Sinh tồn | Điểm Ám Thương | `am_thuong` | $\ge 0$ | Hiện | Trọng thương, Tẩu hỏa nhập ma; Đại Hoàn Đan xóa |
| Sinh tồn | Tuổi Thọ Tối Đa | `tuoi_tho_max` | Năm | Ẩn (hiện mô tả) | Công thức Hồ sơ 06 |
| Tạp học | Y Thuật, Độc Thuật, Kỳ Môn, Cầm, Cờ, Thi, Họa | `y_thuat`, `doc_thuat`, `ky_mon`, `cam`, `co`, `thi`, `hoa` | $0 - 100$ | Hiện | Học Tạp học (AP), kỳ ngộ, môn phái |
| Quan hệ | Hảo Cảm | `hao_cam[npc]` | $-100 \rightarrow +100$ | Hiện | Giao tiếp, quà, sự kiện (Hồ sơ 05) |
| Tổ chức | Cống Hiến | `cong_hien` | $\ge 0$ | Hiện | Nhiệm vụ sư môn, lập công (Hồ sơ 04) |
| Phân loại | Thiên Phú / Trạng Thái / Nhãn | `thien_phu[]`, `trang_thai[]`, `nhan[]` | Danh sách | Hiện | Mục 7 |

---

## III. CƠ CHẾ ĐẦU THAI & THIÊN PHÚ ĐẦU ĐỜI (TUỔI 0)

Khi bắt đầu ván mới, hệ thống quay ngẫu nhiên **Gia cảnh** và cho phép chọn **1 trong 3 Thiên phú (Traits)** đi kèm:

### 1. Các nhóm Gia cảnh (Random tại Tuổi 0)
1. **Hàn Vi / Khốn Khổ ($35\%$ tỷ lệ):** Con ăn mày, trẻ mồ côi thời loạn, con nông dân mất mùa. Ngân lượng $= 0$, Căn cốt thấp do suy dinh dưỡng, nhưng thường có **Phúc duyên cao**.
2. **Bình Dân / Thị Tỉnh ($35\%$ tỷ lệ):** Con thợ rèn, con chủ quán trọ, gia đình tiều phu. Chỉ số cân bằng, cuộc sống yên bình từ $0 - 12$ tuổi.
3. **Phú Thương / Quan Lại ($20\%$ tỷ lệ):** Con nhà buôn lụa Giang Nam, con quan huyện. Ngân lượng khởi đầu cao ($500 - 1,500$ lạng, bảng đầy đủ ở Hồ sơ 06 Phần II.4), Mị lực và Ngộ tính cao, nhưng dễ gặp biến cố "Gia đạo suy vi".
4. **Võ Lâm Thế Gia / Ẩn Thế ($10\%$ tỷ lệ):** Hậu duệ danh môn, con của đại hiệp hoặc ma đầu ẩn danh. Có sẵn võ công gia truyền từ năm 5 tuổi, nhưng mặc định mang sẵn **Kẻ thù truyền kiếp**.

### 2. Ví dụ về Thiên phú bẩm sinh (Innate Traits)
* **[Cửu Dương Tuyệt Mạch]:** Căn cốt $+30$, nội lực tự tăng mỗi năm, nhưng nếu trước năm 20 tuổi không tìm được võ công hệ Dương hoặc Hàn băng bảo vật để cân bằng thì sẽ bạo thể mà chết.
* **[Tư Chất Ngu Độn]:** Ngộ tính bị khóa vĩnh viễn ở mức $10$ (không thể tăng bằng bất kỳ cách nào). Bù lại, từ $0$ đến $15$ tuổi, mỗi năm Căn cốt $+2$ và Phúc duyên $+3$ (tổng tối đa $+32$ Căn cốt, $+48$ Phúc duyên). Sau 15 tuổi phần thưởng dừng lại, nhưng Ngộ tính vẫn bị khóa. Là con đường chính để luyện *Thái Huyền Kinh*, *Không Minh Quyền*, *Song Thủ Hỗ Bác*, đổi lại học mọi võ công khác cực chậm.
* **[Đào Hoa Kiếp]:** Mị lực $+25$, cực dễ khiến NPC khác giới đem lòng yêu mến, nhưng tỷ lệ cao sẽ dẫn đến các sự kiện ghen tuông, tình sát đẫm máu.

---

## IV. VÒNG LẶP GAMEPLAY THEO NĂM & KINH TẾ HÀNH ĐỘNG (YEARLY LOOP & AP ECONOMY)

Mỗi lượt chơi tương ứng với **1 Năm tuổi** (Nhấn nút **"+1 Tuổi"**). Trong mỗi năm sẽ diễn ra 3 giai đoạn:

1. **Giai đoạn Hành động chủ động (Player Action):** Người chơi sử dụng **Điểm Hành Động (AP)** để chọn làm các việc như: *Luyện công, Làm nhiệm vụ sư môn, Đi làm kiếm tiền, Giao du kết bạn, Hành tẩu giang hồ (Khám phá), Trị thương*.
2. **Giai đoạn Sự kiện cá nhân (Personal Event):** Hệ thống kích hoạt 1-2 đoạn hội thoại/tình huống dựa trên độ tuổi, vị trí hiện tại, môn phái và chỉ số.
3. **Giai đoạn Biến động Thế giới (World Chronicle):** Bảng tin giang hồ cập nhật các sự kiện tự sinh của NPC trên khắp thế giới mà không cần người chơi can thiệp.

### Cơ chế Điểm Hành Động (AP) Co Giãn Theo Độ Tuổi
Thay vì cố định một mức AP gây thiếu hụt khi trưởng thành, lượng AP mỗi năm sẽ biến đổi theo **Giai đoạn sinh học** của nhân vật, đi kèm các **Hành động Phụ miễn phí (0 AP)**:

| Giai đoạn | Độ tuổi | Điểm Hành Động (AP/Năm) | Cơ chế Hành động Miễn phí (0 AP - Tối đa 2 việc/năm) |
| :--- | :--- | :--- | :--- |
| **Ấu Thơ & Đồng Niên** | $0 - 10$ tuổi | **2 AP** | Chưa mở khóa. Tập trung vào phát triển chỉ số gốc. |
| **Thiếu Niên & Thanh Niên** | $11 - 30$ tuổi | **3 AP** | *Trò chuyện với 1 NPC, Mua sắm ở chợ.* |
| **Trung Niên Đỉnh Phong** | $31 - 50$ tuổi | **4 AP** | Như trên + **1 lượt Giao việc cho đệ tử** hoàn toàn miễn phí. |
| **Lão Niên** | $51 - 70$ tuổi | **3 AP** *(Nếu Cảnh giới Nội công $\ge 8$ giữ nguyên **4 AP**)* | Thể lực suy giảm nhưng có thể dùng tiền/uy danh sai khiến đệ tử làm thay việc kiếm tiền. |
| **Cổ Lai Hy** | $71+$ tuổi | **2 AP** | Chỉ tập trung vào *Bế quan, Nghiên cứu tự sáng tạo võ học, Truyền công* hoặc *Dưỡng già*. |

**Ghi chú về Hành động Miễn phí:**
* Các thao tác giao diện như *Xem bảng tin thế giới (Thiên Hạ Phong Vân Bảng)*, *Thay đổi trang bị / Võ học*, *Uống đan dược* luôn tốn 0 AP và **không tính** vào giới hạn 2 việc/năm.
* **Chỉ dạy con cái:** Không gắn với độ tuổi của cha mẹ. Từ khi người chơi có ít nhất 1 người con trong độ tuổi $3 - 15$, mỗi năm được thêm **1 lượt Chỉ dạy con cái** miễn phí (ngoài giới hạn 2 việc/năm). Chi tiết xem Hồ sơ 05.

---

## V. CƠ CHẾ "MỒI LỬA" CỐT TRUYỆN ĐỘNG (DYNAMIC WORLD CRISIS)

Đại Sự Kiện Võ Lâm chia làm 2 loại:

* **Đại sự kiện Ngẫu nhiên (Sự kiện 1 - 4):** Khi nhân vật chính đạt các mốc **18, 30, 42 và 54 tuổi**, hệ thống bốc ngẫu nhiên 1 trong 4 sự kiện này làm trục chính cho giai đoạn đó. Không bốc lại sự kiện vừa xảy ra ở mốc liền trước.
* **Chủ động phát động:** Nếu người chơi đang là **Chưởng môn / Giáo chủ** (Bậc 5, xem Hồ sơ 04), có thể dùng quyền *"Phát động chiến tranh"* để chọn thẳng 1 trong 4 sự kiện ở mốc kế tiếp thay vì bốc ngẫu nhiên (Ví dụ: Giáo chủ Tà phái chọn *Ma Giáo Đông Chinh* để tự mình dẫn quân đánh Trung Nguyên).
* **Đại sự kiện Định kỳ (Sự kiện 5 - Hoa Sơn Luận Kiếm):** Không nằm trong pool bốc ngẫu nhiên. Diễn ra theo **lịch thế giới**, vào mỗi năm thế giới có số tận cùng là $0$ (mỗi 10 năm 1 lần), nên một đời người thường chứng kiến $6 - 8$ lần. Nếu trùng năm với một Đại sự kiện Ngẫu nhiên, Hoa Sơn Luận Kiếm lùi sang năm kế tiếp sau khi sự kiện kia kết thúc.

Mỗi Đại sự kiện kéo dài **3 Năm liên tiếp**, chia làm 3 Hồi: **Khởi phát (Năm 1) $\rightarrow$ Cao trào (Năm 2) $\rightarrow$ Kết cục (Năm 3)**:

| Đại Sự Kiện | Năm 1: Khởi Phát (Gieo mầm) | Năm 2: Cao Trào (Lựa chọn phe phái) | Năm 3: Đại Kết Cục & Phần Thưởng |
| :--- | :--- | :--- | :--- |
| **1. Kỳ Thư Xuất Thế** *(Tranh đoạt Cửu Âm / Đồ Long Đao)* | Tin đồn bảo vật xuất hiện ở Giang Nam. Các tiêu cục và môn phái nhỏ bị đồ sát hàng loạt. Người chơi có thể đi thu thập mảnh bản đồ. | Quần hùng tụ họp tại Vương Bàn Sơn hoặc Hoa Sơn. Người chơi chọn: *Minh tranh (Đấu võ đài công khai)* hoặc *Ám đoạt (Hạ độc vào nguồn nước của quần hùng)*. | Người giữ được bảo vật cuối cùng phải chịu sự truy sát của cả thiên hạ trong 3 năm, nhưng nếu sống sót sẽ luyện thành Thần công SSS. |
| **2. Ma Giáo Đông Chinh** *(Cuộc chiến Chính - Tà)* | Tà phái Tây Vực/Hắc Mộc Nhai đánh úp 2 môn phái nhỏ ở Trung Nguyên. Lục đại phái phát lệnh triệu tập đệ tử. | **Trận chiến tại Quang Minh Đỉnh / Hắc Mộc Nhai:** Người chơi đánh tiên phong cho phe mình chọn, hoặc làm nội gián hai mang bán đứng đồng môn. | Nếu Chính đạo thắng: Tà phái bị phong ấn 20 năm, người chơi được phong *Võ Lâm Minh Chủ*. Nếu Ma giáo thắng: Thành thị Trung Nguyên phải nộp thuế máu cho Ma giáo! |
| **3. Sơn Hà Phá Toái** *(Bảo vệ Tương Dương)* | Đại quân Thiết kỵ Bắc Cảnh tràn qua biên ải. Giá lương thực và thuốc trị thương trong game tăng gấp 3 lần. | **Đêm ám sát doanh trại giặc:** Người chơi lẻn vào trại địch cứu con tin hoặc ám sát Quốc sư Tây Tạng. Có thể chọn đầu hàng giặc làm *phong vương*! | **Huyết chiến giữ thành:** Dựa trên tổng điểm đóng góp và *Vũ Mục Di Thư*. Giữ được thành sẽ lưu danh sử sách ($+1000$ Hiệp nghĩa). |
| **4. Huyết Án Mê Vụ** *(Mô-típ "Dĩ Bỉ Chi Đạo Hoàn Thi Bỉ Thân")* | Mỗi năm có 3 vị Chưởng môn/Cao thủ chết dưới chính tuyệt kỹ của mình. Lòng người hoang mang, nghi kỵ lẫn nhau. | Người chơi bị vu oan là hung thủ (hoặc được mời làm thám tử điều tra). Điều tra `[Roll: Ngộ tính vs 70]` để tìm ra hung thủ thật sự (Thường là Mộ Dung gia hoặc 1 Boss ẩn). *Thất bại:* điều tra sai hướng; nếu đang bị vu oan thì Thanh danh $-150$ và bị Chính đạo truy bắt đến hết sự kiện. Kẻ chủ mưu tự lộ diện ở Năm 3 với sức mạnh $+20\%$ vì không bị ngăn chặn sớm. | Đánh bại Kẻ chủ mưu đứng sau màn kịch để tịch thu toàn bộ bí kíp mà hắn đã ăn cắp của các phái. |
| **5. Hoa Sơn Luận Kiếm** *(Định kỳ mỗi 10 năm theo lịch thế giới)* | Thiệp mời "Anh Hùng Thiếp" gửi đến những ai đứng trong **Thập Đại Cao Thủ** (Top 10 **Chiến lực** trên Thiên Hạ Phong Vân Bảng, Hồ sơ 06 I.5 và Hồ sơ 07) **và** có `[Cổng: Danh vọng ≥ 400]` (mức *Danh hiệp*, tính cả Danh vọng chức vị). Danh vọng chỉ là ngưỡng sàn "đủ tiếng để được mời", không xếp hạng, để các Chưởng môn không chiếm hết suất chỉ nhờ chức vị. Người chơi chưa đủ tư cách vẫn có thể lên Hoa Sơn với vai trò *Khán giả, Hộ vệ cho sư môn* hoặc *Kẻ phá đám* (thách đấu 1 người trong Top 10 để giành suất thay thế). | Tỷ thí vòng loại trên đỉnh núi tuyết Hoa Sơn suốt 7 ngày 7 đêm (Đấu liên tiếp 3 trận Tam Hiệp không được hồi máu hoàn toàn). | Người chiến thắng cuối cùng nhận danh hiệu **Đông Tà / Tây Độc / Nam Đế / Bắc Cái / Trung Thần Thông (Ngũ Tuyệt)** – Mở khóa toàn bộ đặc quyền ngoại giao khắp Thần Châu! |