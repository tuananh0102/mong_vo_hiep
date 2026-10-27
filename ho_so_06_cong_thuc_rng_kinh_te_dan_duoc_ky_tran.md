# HỒ SƠ 06: CÔNG THỨC TÍNH TOÁN XÁC SUẤT (RNG), KINH TẾ & DANH MỤC ĐAN DƯỢC / KỲ TRÂN DỊ BẢO
**Tên dự án:** *Vạn Kiếp Giang Hồ* (Thể loại: Text-based Life Sim / Võ Hiệp Kim Dung)
**Mục tiêu thiết kế:** Chuẩn hóa toàn bộ hệ thống toán học ngầm (Under-the-hood Math), thuật toán kiểm định xác suất (RNG Check), cân bằng dòng tiền Ngân lượng xuyên suốt vòng đời nhân vật và thiết lập kho tàng Đan Dược – Độc Dược – Kỳ Trân Dị Bảo chuẩn nguyên tác Kim Dung.

## PHẦN I: HỆ THỐNG CÔNG THỨC TOÁN HỌC & KIỂM ĐỊNH XÁC SUẤT (RNG ENGINE)

Để đảm bảo tính công bằng nhưng vẫn giữ được sự kịch tính đặc trưng của dòng game *Life Sim*, mọi phán định trong *Vạn Kiếp Giang Hồ* đều vận hành dựa trên sự kết hợp giữa **Chỉ số Cốt lõi (Hard Stats)**, **Hệ số Phúc Duyên (Luck Modifier)** và **Biến số Ngẫu nhiên (Dice Roll $1 - 100$)**.

### 1. Công Thức Quy Đổi Chỉ Số Chiến Đấu & Sinh Tồn
Từ 4 chỉ số gốc (**Căn Cốt, Ngộ Tính, Phúc Duyên, Mị Lực** trên thang $0 - 100$, có thể vượt ngưỡng $100$ nhờ Kỳ ngộ/Thần công nhưng không bao giờ quá **trần cứng $150$**; mọi phần cộng vượt trần bị bỏ qua, kể cả khi di truyền cho con cái) và **Cấp độ Võ học ($1 - 10$)**, hệ thống tự động tính toán các chỉ số phái sinh mỗi đầu năm:

| Chỉ số Phái sinh | Công thức Toán học Cốt lõi | Giải thích & Ngưỡng giới hạn |
| :--- | :--- | :--- |
| **Sinh Mệnh Tối Đa ($HP_{max}$)** | $HP_{max} = 100 + (\text{Căn Cốt} \times 12) + (\text{Cấp Nội Công} \times 80) + \text{Bonus Độ Tuổi}$ | *Bonus Độ Tuổi:* $+5$/năm từ $1 - 30$ tuổi; giữ nguyên từ $31 - 50$; $-8$/năm sau $50$ tuổi (trừ khi có Nội công Bất lão). |
| **Nội Tức Tối Đa ($MP_{max}$)** | $MP_{max} = 50 + (\text{Căn Cốt} \times 8) + (\text{Cấp Nội Công} \times 150) + \text{Điểm Kỳ Ngộ}$ | Quyết định số lần tung Tuyệt kỹ trong trận Tam Hiệp và khả năng bức độc, hộ thể. |
| **Tốc Độ Lĩnh Ngộ Võ Học ($Exp/AP$)** | $\text{Tiến độ (\%)} = \min\Big(100\%, \ \frac{\text{Ngộ Tính} \times 1.2 + \text{Cấp Sư Phụ} \times 2}{\text{Độ Khó Bí Kíp (Tier Factor)}}\Big)$ | **Đơn vị:** Tiến độ là $\%$ của **một Cấp Võ học**. Mỗi lần dùng 1 AP *"Luyện công"* cho 1 môn sẽ cộng Tiến độ; đủ $100\%$ thì lên 1 cấp, phần dư chuyển sang cấp sau. Mỗi AP tối đa lên 1 cấp. *Cấp Sư Phụ:* Cấp Võ học của người dạy ở chính môn đó ($0$ nếu tự học từ bí kíp). *Tier Factor:* Nhập môn ($1.0$), Thượng thừa ($2.0$), Trấn phái ($3.0$), Thần công SSS ($5.0$). *(Riêng Thái Huyền Kinh / Không Minh Quyền đảo ngược tử số thành $(100 - \text{Ngộ Tính}) \times 1.5$)*. *Hàn Ngọc Sàng* nhân đôi Tiến độ của Nội công. **Mốc tham chiếu:** Võ công bắt đầu ở Cấp 1 nên lên $10/10$ cần 9 lần lên cấp. Ngộ tính $80$ có sư phụ Cấp 10 luyện 1 Thần công SSS lên $10/10$ mất $39$ AP ($10 - 13$ năm); Ngộ tính $50$ tự học mất $75$ AP ($19 - 25$ năm). Bảng đầy đủ do script `mo_phong/mo_phong.py` sinh ra. |
| **Tuổi Thọ Tối Đa ($Age_{max}$)** | $Age_{max} = 65 + \lfloor\min(\text{Căn Cốt Đỉnh}, 100) \times 0.15\rfloor + \text{Cảnh Giới Nội Công} - \text{Điểm Ám Thương}$ | Khung tự nhiên là **$65 - 90$ tuổi**: Căn cốt đóng góp tối đa $+15$ (phần Căn cốt vượt $100$ nhờ kỳ ngộ không tính thêm), Cảnh giới Nội công tối đa $+10$. Chỉ đan dược và kỳ ngộ kéo dài tuổi thọ (ví dụ *Tục Mệnh Bát Hoàn* $+10$) mới vượt được $90$. Ví dụ: Căn cốt $55$, Cảnh giới $10$ $\rightarrow$ $83$ tuổi; Căn cốt $45$, Cảnh giới $7$ $\rightarrow$ $78$ tuổi. Công thức cũ ($55 + $ Căn cốt $\times 0.35 + $ Cảnh giới $\times 2$) cho $95 - 110$ tuổi ở nhân vật Căn cốt cao, mô phỏng thấy người chơi sống trung vị $90 - 99$ tuổi. **Căn Cốt Đỉnh** là giá trị Căn cốt cao nhất nhân vật từng đạt trong đời, không giảm khi lão hóa ($-2$/năm sau 50 tuổi, hoặc sau 60 nếu Cảnh giới Nội công $\ge 8$, chỉ làm giảm Căn cốt hiện tại, HP và sức chiến đấu). Nhờ vậy tuổi thọ không tự co lại theo từng năm. Mỗi lần Trọng thương không chữa trị kịp thời hoặc Tẩu hỏa nhập ma sẽ cộng $+5$ Điểm Ám Thương (Giảm 5 năm tuổi thọ). **Chữa kịp thời** = trong năm đó dùng 1 thuốc trị nội thương (*Bạch Vân Hùng Đảm Hoàn* $350$ lạng hoặc tốt hơn), hoặc nằm dưỡng thương `[Roll: Căn cốt vs 50]` (không tốn tiền; thất bại thì nhận Ám Thương). **Trọng thương** là khi thua bị áp đảo trong trận sinh tử (HP $< 25\%$ ở Hiệp 3, Hồ sơ 02 V.3) mà sống sót, hoặc khi kịch bản ghi rõ. |
| **Võ Lực (Thang $0 - 100$)** | $\text{Võ Lực} = \min\big(100, \ \lfloor\frac{\text{Căn Cốt}}{2}\rfloor + \text{Cấp Võ Học cao nhất} \times 5\big)$ | Chỉ số tóm tắt sức chiến đấu, chỉ dùng cho **Giao chiến nhanh** trong sự kiện (đánh lâu la, ẩu đả). Trận đấu với cao thủ có tên dùng Quyết Đấu Tam Hiệp. |

### 2. Ký Hiệu & Công Thức Kiểm Định Trong Sự Kiện (Event Skill Check)

#### 2.1. Bảng Ký Hiệu Chuẩn (Bắt buộc dùng trong mọi kịch bản)
Mọi lựa chọn có điều kiện trong kịch bản phải ghi bằng đúng 1 trong các ký hiệu sau, đặt ngay sau tên lựa chọn:

| Ký hiệu | Ý nghĩa | Hiển thị trên nút | Cần nhánh thất bại? |
| :--- | :--- | :--- | :--- |
| **`[Cổng: X ≥ N]`** | Điều kiện cứng. Không đạt thì không chọn được. | Nút xám, ghi rõ điều kiện còn thiếu (ví dụ *"Cần Ngân lượng 50"*). | Không |
| **`[Cổng ẩn: X ≥ N]`** | Như Cổng nhưng là bí mật. Không đạt thì lựa chọn **không hiện**. | Không hiện khi chưa đạt. | Không |
| **`[Roll: X vs N]`** | Kiểm định xác suất mềm, chỉ số càng cao càng dễ. $N$ là ngưỡng $50\%$. | Tên chỉ số + nhãn tỷ lệ (Hiểm / Khó / Khá / Dễ). | **Bắt buộc** |
| **`[Roll ngược: X vs N]`** | Như Roll nhưng chỉ số càng **thấp** càng dễ (tâm trí ngây ngô, vô tạp niệm). | Như Roll. | **Bắt buộc** |
| **`[Roll: X vs X địch]`** | Kiểm định đối kháng, ngưỡng là chỉ số tương ứng của đối phương. | Như Roll. | **Bắt buộc** |
| **`[Giao chiến nhanh: N]`** | Viết tắt của `[Roll: Võ Lực vs N]`. | Như Roll. | **Bắt buộc** |
| **`[Tam Hiệp: Tên đối thủ]`** | Vào trận Quyết Đấu Tam Hiệp (Hồ sơ 02). | Nút "Giao chiến". | **Bắt buộc** (nhánh Thua) |
| **`[Ngẫu nhiên: p%]`** | Hệ thống quay may rủi thuần túy, **không** chịu ảnh hưởng Phúc duyên. Dùng để chọn biến thể cốt truyện (ví dụ danh tính thật của một NPC). Các biến thể phải cộng lại đủ $100\%$. | Không hiển thị tỷ lệ. | Không (mỗi biến thể là một nhánh) |

**Quy tắc bổ sung:**
* **Điều kiện kích hoạt sự kiện** (ví dụ *"Kỳ ngộ yêu cầu Phúc duyên $\ge 60$"*) luôn mang nghĩa `[Cổng ẩn]` ở cấp sự kiện: không đạt thì sự kiện không xuất hiện. Viết là *"(Điều kiện kích hoạt: ...)"* ở tiêu đề sự kiện.
* **Nhiều chỉ số:** `[Roll: A vs N1 VÀ B vs N2]` dùng **hiệu thấp nhất** trong các $(X_i - N_i)$; `[Roll: A vs N1 HOẶC B vs N2]` dùng **hiệu cao nhất**. Với Cổng, "VÀ / HOẶC" mang nghĩa logic thông thường.
* **Hiệp nghĩa trong Cổng / Roll:** Tuân theo quy tắc Thanh danh / Hiệp nghĩa thật ở Hồ sơ 01 mục II.2. Viết rõ `Thanh danh` hoặc `Hiệp nghĩa thật`.
* **Một lựa chọn có thể kết hợp** Cổng và Roll, ví dụ `[Cổng: Thanh danh ≥ +50] [Roll: Ngộ tính vs 50]`: Cổng xét trước, đạt mới được Roll.
* **Nhãn tỷ lệ hiển thị:** Hiểm ($< 25\%$), Khó ($25 - 49\%$), Khá ($50 - 74\%$), Dễ ($\ge 75\%$). Con số chính xác không hiển thị.
* **Nhánh thất bại** không được là "không có gì xảy ra". Nó phải có hệ quả cốt truyện hoặc chỉ số riêng, ưu tiên mở ra một hướng đi khác thay vì chỉ trừng phạt.

#### 2.2. Công Thức Xác Suất Mềm
Khi người chơi chọn một nhánh `[Roll]` (Ví dụ: *"Cố gắng gồng mình chịu đựng cái lạnh `[Roll: Căn cốt vs 25]`"*), hệ thống không dùng ngưỡng cứng nhắc tuyệt đối mà dùng công thức xác suất mềm để tạo bất ngờ. Chỉ số đúng bằng ngưỡng cho $50\%$ thành công (trước khi tính Phúc duyên):

$$P(\text{Thành Công}) = \text{Clamp}\Big( 50\% + (\text{Chỉ Số Người Chơi} - \text{Ngưỡng Yêu Cầu}) \times 2.5\% + (\text{Phúc Duyên} - 50) \times 0.3\%, \ 5\%, \ 95\% \Big)$$

* **Roll ngược:** Thay $(\text{Chỉ Số Người Chơi} - \text{Ngưỡng Yêu Cầu})$ bằng $(\text{Ngưỡng Yêu Cầu} - \text{Chỉ Số Người Chơi})$.
* **Roll đối kháng:** Ngưỡng Yêu Cầu là chỉ số tương ứng của đối phương.
* **Ngưỡng Bảo Hiểm Tối Thiểu ($5\%$ - "Kỳ Tích Tuyệt Cảnh"):** Dù chỉ số thấp hơn yêu cầu rất nhiều, người chơi luôn có tối thiểu $5\%$ cơ hội lật kèo nhờ may mắn.
* **Ngưỡng Rủi Ro Tối Đa ($95\%$ - "Mã Thất Tiền Đề"):** Dù chỉ số vượt xa yêu cầu, vẫn luôn có $5\%$ xác suất xảy ra biến cố ngoài ý muốn Không có ngoại lệ: mọi kiểm định trong game, kể cả của *Lăng Ba Vi Bộ* hay đan dược cứu mạng, đều bị giới hạn trong khoảng $5\% - 95\%$.

### 3. Công Thức Trọng Số Sự Kiện & Kích Hoạt Kỳ Ngộ (Fortuitous Encounter RNG)
Mỗi khi nhấn **"+1 Tuổi"**, hệ thống quay 1 viên xúc xắc phần trăm ($R \in [0, 100]$) để quyết định loại sự kiện cá nhân xuất hiện trong năm đó:
* **Tỷ lệ xuất hiện Kỳ Ngộ Hiếm ($P_{KyNgo}$):**
  $$P_{KyNgo} = 2\% + (\text{Phúc Duyên} \times 0.12\%) + \text{Hệ Số Vùng Đất} + \text{Trạng Thái Tuyệt Cảnh}$$
  * *Hệ Số Vùng Đất:* Trung Nguyên ($+0\%$), Giang Nam ($+1\%$), Tây Vực / Nam Cương / Bắc Cảnh ($+4\%$ do địa hình hiểm trở nhiều di tích cổ).
  * *Trạng Thái Tuyệt Cảnh (Mô-típ "Rơi xuống vực không chết"):* Khi người chơi vừa thua trận Quyết Đấu và chọn **"Nhảy xuống vách núi / Trôi sông đào thoát"**, kết quả phụ thuộc Phúc Duyên:
    * *Phúc Duyên $\ge 60$:* Sống sót ở mức trần $95\%$ (Quy tắc Cứu Mạng Hồ sơ 02 V.4: không lối thoát nào $100\%$), tỷ lệ $P_{KyNgo}$ ở ngay lượt đó tăng vọt thêm **$+50\%$**!
    * *Phúc Duyên $30 - 59$:* Kiểm định sinh tồn theo công thức mục 2 với ngưỡng $45$. Thành công: sống sót nhưng trọng thương ($+5$ Điểm Ám Thương), không được cộng $P_{KyNgo}$. Thất bại: tử vong.
    * *Phúc Duyên $< 30$:* Tử vong ngay lập tức (Kết cục *Khô Cốt Nơi Đáy Vực*, Hồ sơ 07).

### 4. Công Thức Tính Sát Thương Trong "Quyết Đấu Tam Hiệp"
Trong mỗi hiệp giao chiến, sát thương thực tế ($DMG$) gây ra cho đối phương được tính qua 4 lớp:

$$DMG = \Big[ \big(\text{Uy Lực Chiêu Thức} \times (1 + \frac{\text{Cấp Võ Học}}{5})\big) + (\text{Nội Tức Hiện Tại} \times 0.08) + \text{Sát Thương Thần Binh} \Big] \times M_{\text{Hiệp 1}} \times M_{\text{Khắc Chế}} \times (1 - \text{Giảm Trừ Phòng Ngự}) \times \text{Biến Thiên}$$

* **Uy Lực Chiêu Thức theo cấp bậc võ học:** Nhập môn $210$, Thượng thừa $250$, Trấn phái $280$, Thần công SSS $320$. Từng môn có thể lệch $\pm 10\%$ quanh mức này để tạo cá tính.
* **Sát Thương Thần Binh:** Lợi khí $+30$, Danh khí $+60$, Thần binh $+100$; không có binh khí đặc biệt thì $0$ (danh sách ở Hồ sơ 02 IV).
* **Giảm Trừ Phòng Ngự** $= \min\big(50\%, \ \text{Căn Cốt} \times 0.3\% + \text{Cấp Khinh Công} \times 2\%\big)$. Cảnh giới Nội công **không** tham gia giảm trừ (nó đã tăng HP và Nội tức).
* **Biến Thiên:** Ngẫu nhiên trong khoảng $0.9 - 1.1$ cho mỗi đòn, để hai bên ngang sức không luôn hòa tuyệt đối.
* **Mục tiêu cân bằng:** Hai bên ngang sức, sau Hiệp 2 bên yếu hơn còn khoảng $20\% - 30\%$ HP ở mọi cấp độ. Bộ số trên đã được kiểm chứng bằng script `mo_phong/mo_phong.py` (bên yếu còn $22\% - 31\%$).

* **Hệ số Chiến thuật Hiệp 1 ($M_{\text{Hiệp 1}}$):**
  * Giá trị cụ thể theo **Ma trận Đối kháng Hiệp 1** ở Hồ sơ 02, Phần V.1. Tóm tắt:
  * *Tiên Hạ Thủ Vi Cường:* $M = 1.10$ ở Hiệp 1. Nếu bị *Thân Pháp Quỷ Mị* khắc chế, chỉ còn $M = 0.90$.
  * *Án Binh Bất Động (Roll Ngộ tính thành công):* Tăng tỷ lệ Bạo kích (Nhìn thấu sơ hở $\times 1.5$ sát thương) thêm $+30\%$ ở Hiệp 2, đồng thời đòn Hiệp 2 của địch chỉ còn $M = 0.95$.
  * Các trường hợp khác: $M = 1.00$.
* **Hệ số Khắc Chế Nội Lực ($M_{\text{Khắc Chế}}$):**
  * Ba hệ tạo thành **vòng khắc chế khép kín**: **Chí Dương $\rightarrow$ Chí Âm $\rightarrow$ Trung Hòa $\rightarrow$ Chí Dương**. Ngoài vòng, **Chí Âm** còn khắc **Ngoại công thuần** (người không có Tâm pháp chủ đạo).
  * *Thuận hệ khắc chế* (Dương đánh Âm, Âm đánh Hòa, Hòa đánh Dương, Âm đánh Ngoại công thuần): $M = 1.05$.
  * *Bị khắc chế ngược* (Âm đánh Dương, Hòa đánh Âm, Dương đánh Hòa, Ngoại công thuần đánh Âm): $M = 0.95$.
  * Mức cũ $1.25 / 0.80$ khiến bên thuận hệ thắng $99\%$ trận ngang sức; mức mới cho khoảng $77\%$.
  * *Cùng hệ hoặc không liên quan:* $M = 1.00$.
  * Trung Hòa **không** còn được cộng thêm Giảm Trừ Phòng Ngự. Ưu thế riêng của Trung Hòa chỉ còn: không bị phản phệ và dùng được mọi loại chiêu thức không giảm uy lực.
* **Xác suất Tẩu Hỏa Nhập Ma Hàng Năm ($P_{THNM}$):**
  Nếu nhân vật đồng thời trang bị $\ge 2$ môn Nội công xung khắc (1 Chí Dương + 1 Chí Âm) mà không có tâm pháp Trung hòa:
  $$P_{THNM} = \max\big(0\%, \ 30\% + (\text{Tổng số môn Tà công} \times 5\%) - (\text{Cấp Tiên Thiên Công / Dịch Cân Kinh} \times 10\%)\big)$$
  * *Ngoại lệ Toàn Chân:* Nếu Tâm pháp chủ đạo là Nội công Toàn Chân, $P_{THNM} = 0\%$ bất kể các môn phụ trợ.
  * *Hàn Ngọc Sàng:* Nhân kết quả cuối cùng với $0.5$.
  * *Ma công phản phệ:* Độc lập với công thức trên, mỗi năm còn trang bị Ma công (Hồ sơ 02 II.2) có thêm $3\%$ tỷ lệ Tẩu Hỏa Nhập Ma (Hàn Ngọc Sàng cũng nhân $0.5$).

### 5. Chỉ Số Chiến Lực (Thiên Hạ Phong Vân Bảng)
Chiến lực là điểm dùng để xếp hạng **Thập Đại Cao Thủ** trên Thiên Hạ Phong Vân Bảng (Hồ sơ 07) và xét Anh Hùng Thiếp (Hồ sơ 01 V).
Nó không tham gia tính sát thương; nó chỉ tóm tắt Tam Hiệp thành một con số để so ai mạnh hơn.

$$\text{Chiến Lực} = \text{Điểm Tier} + 10 \times \text{Cấp Võ Học cao nhất} + 10 \times \text{Cảnh Giới Nội Công} + 2 \times \text{Căn Cốt} + \frac{\text{Thưởng HP theo tuổi}}{10} + 5 \times \text{Cấp Khinh Công} + \frac{\text{Sát Thương Thần Binh}}{5}$$

* **Điểm Tier** của môn võ có cấp cao nhất: Nhập môn $0$, Thượng thừa $20$, Trấn phái $30$, Thần công SSS $45$. Ma công khi Hiệp nghĩa $\le -300$ tính như SSS ($45$).
* **Thưởng HP theo tuổi** là phần cộng theo tuổi trong công thức HP ở mục 1 ($0$ đến $150$, giảm sau 50 tuổi), nên Chiến lực tự giảm khi về già.
* **Khinh công** cộng $5$ điểm mỗi cấp (Giảm trừ $+2\%$ và Roll ra đòn trước ở Hiệp 2); **Thần binh** cộng $6 / 12 / 20$ điểm cho Lợi khí / Danh khí / Thần binh.
* Ví dụ: Trấn phái cấp $10$, Cảnh giới $10$, Căn cốt $60$, 40 tuổi $\rightarrow 30 + 100 + 100 + 120 + 15 = 365$; thêm Khinh công cấp $4$ và Ỷ Thiên Kiếm $\rightarrow 365 + 20 + 20 = 405$.
* **Đọc chênh lệch:** $P(\text{A thắng Tam Hiệp}) \approx \dfrac{1}{1 + e^{-(\text{CL}_A - \text{CL}_B)/16}}$. Chênh $10$ điểm $\approx 65\%$, $20$ điểm $\approx 78\%$, $40$ điểm $\approx 92\%$.
* **Nguồn gốc các hệ số:** hồi quy logistic trên $30,000$ trận Tam Hiệp ngẫu nhiên của `mo_phong/hieu_chinh_chien_luc.py`, rồi làm tròn. Dự đoán đúng bên thắng $84.9\%$ số trận (hồi quy tự do $85.2\%$); Võ Lực chỉ đúng $71.6\%$. Bảng đối chiếu dự đoán / thực tế ở `mo_phong/KET_QUA.md` mục 4.
* **Không tính** (chưa hiệu chỉnh hoặc thay đổi theo trận): hệ khắc chế Nội lực, lựa chọn Hiệp 1, đan dược, Ngộ tính (ảnh hưởng không đáng kể trong hồi quy). Mỗi khi đổi công thức chiến đấu, chạy lại `mo_phong/hieu_chinh_chien_luc.py` để kiểm tra hệ số.
* **Phân biệt với Võ Lực:** Võ Lực (mục 2) vẫn là chỉ số cho `[Giao chiến nhanh]`; Chiến lực chỉ dùng để xếp hạng.

## PHẦN II: HỆ THỐNG KINH TẾ VĨ MÔ & CÂN BẰNG DÒNG TIỀN (NGÂN LƯỢNG)

Đơn vị tiền tệ duy nhất trong game là **Lạng Bạc (Ngân Lượng)**. Hệ thống kinh tế được thiết kế theo nguyên tắc **"Khát tiền ở đầu đời, Dư dả ở trung niên, Đốt tiền vào đại nghiệp ở cuối đời"** để người chơi không bao giờ mất động lực kiếm bạc.

### 1. Bảng Thu Nhập Theo Nguồn & Giai Đoạn (Income Streams)

| Nguồn Thu Nhập | Yêu cầu / Cấp độ | Thu nhập (Lạng bạc / 1 AP) | Rủi ro & Hệ quả Đi kèm |
| :--- | :--- | :--- | :--- |
| **Làm thuê vặt / Tiểu nhị / Bổ củi** | Tuổi $11 - 18$ (Thị tỉnh) | $5 - 15$ lạng | An toàn tuyệt đối, Căn cốt $+1$. |
| **Tiểu thương (bán hàng rong)** | Tuổi $16+$ | $50 - 150$ lạng | `[Roll: Ngộ tính vs 50]`, thất bại chỉ nhận một nửa. Các sản nghiệp sinh lợi đều (tiêu cục, muối, sòng bạc, đầu cơ) xem mục 5 bên dưới. |
| **Móc túi (Diệu Thủ Không Không)** | Kỹ năng Giang hồ / Ô Y Phái | $20 - 80$ lạng | Hiệp nghĩa $-15$ **[Ám]**; mọi lần móc túi trong cùng năm gộp thành 1 hành động [Ám] (Hồ sơ 01 II.3), lộ thì Thanh danh $-1.5\times$ tổng của năm đó. Có $20\%$ tỷ lệ đụng trúng cao thủ và bị đánh gãy tay (Mất $30\%$ HP). |
| **Trợ cấp Đệ tử Môn phái** | Ngoại môn $\rightarrow$ Nội môn $\rightarrow$ Chân truyền $\rightarrow$ Trưởng lão | $10 \rightarrow 30 \rightarrow 50 \rightarrow 200$ lạng/năm *(Tự động nhận, tốn 0 AP. Chưởng môn hưởng "Bổng lộc Chưởng Môn" bên dưới thay cho trợ cấp)* | Nếu môn phái bị Tà giáo đánh phá, trợ cấp năm đó bằng $0$. |
| **Sai Phái Sư Môn** | Bậc 2 - 4 trong môn phái | Nội môn $50 - 150$, Chân truyền $100 - 250$, Trưởng lão $150 - 350$ lạng | `[Giao chiến nhanh: 30 / 40 / 50]` theo bậc; thất bại chỉ mất thù lao, không Trọng thương (Hồ sơ 04 I.1). Mô phỏng: thay săn truy nã bằng việc này giảm tỷ lệ tử trận của Chính phái từ $25\%$ xuống $13\%$ số đời. |
| **Áp Tiêu (Bảo Tiêu Đường Dài)** | `[Cổng: Căn cốt ≥ 50]` | $100 - 300$ lạng | `[Ngẫu nhiên: 35%]` gặp Sơn tặc cướp tiêu, phải `[Giao chiến nhanh: 50]`. Thắng: giữ nguyên tiền, Danh vọng $+20$. Thua: mất thù lao và phải **đền gấp đôi thù lao của chuyến đó**; thiếu bao nhiêu thì ghi thành **Nợ** (xem mục 3 bên dưới). |
| **Săn Tiền Thưởng (Lục Phiến Môn)** | Võ công Thượng thừa trở lên | Bảng truy nã 3 hạng, so với người chơi: **Yếu** $150 - 400$, **Ngang** $250 - 800$, **Mạnh** $600 - 1,500$ lạng | Phải đánh thắng tội phạm truy nã (Tam Hiệp sinh tử). Hiệp nghĩa $+40$. Bảng hiển thị hạng của mục tiêu: **Yếu** (Căn cốt, Ngộ tính khoảng $80\%$ người chơi, thắng khoảng $75 - 85\%$), **Ngang** (khoảng $50\%$), **Mạnh** (cao hơn 1 cấp võ học, khoảng $20\%$). Thua bị áp đảo thì tội phạm có thể Tuyệt sát (Hồ sơ 02 V.3). Mô phỏng: săn mỗi năm suốt đời, kể cả chỉ nhận hạng Yếu, vẫn khiến $20 - 70\%$ số đời tử trận (Chính phái cao nhất vì bắt đầu săn từ 18 tuổi); người chơi cần biết dừng. |
| **Ám Sát Thuê (Hắc Phong Lâu)** | Hiệp nghĩa $\le -100$ | $400 - 1500$ lạng | **Tối đa 2 hợp đồng/năm.** Mỗi hợp đồng là 1 trận `[Tam Hiệp: mục tiêu]` (mục tiêu là NPC có tên). Hiệp nghĩa $-100$ **[Ám]**. Mỗi hợp đồng thành công là 1 hành động [Ám] theo Hồ sơ 01 mục II.3: $20\%$ bại lộ ngay, nếu không thì cộng vào tỷ lệ bại lộ hằng năm. Nếu thất bại hoặc bị bại lộ (ngay lúc đó hay nhiều năm sau): Thanh danh $-150$, Danh vọng cộng theo quy tắc *Tai tiếng* (Hồ sơ 01 II.2), và bị quan phủ cùng Chính đạo truy sát 3 năm, trong thời gian đó Hắc Phong Lâu không giao hợp đồng mới. **Ngoại lệ Dịch Dung:** thất bại khi đang Dịch Dung thì mục tiêu chỉ thấy mặt giả: hợp đồng thất bại không bị lộ ngay mà thành 1 hành động [Ám] chưa lộ (có thể đổ tội, Hồ sơ 01 II.3). |
| **Lợi tức Môn Phái → Ngân Khố** | Chưởng môn / Tự lập phái | Lợi tức theo quy mô: **Nhỏ** $500$, **Vừa** $1,500$, **Lớn** $3,000$ lạng/năm, đi thẳng vào **Ngân khố môn phái**, không vào túi riêng *(tự động, 0 AP)* | Ngân khố tự trả **phí bảo trì** (đã gồm lương Trưởng lão): Nhỏ $200$, Vừa $700$, Lớn $1,500$ lạng/năm. Điều kiện quy mô và hậu quả khi không trả xem mục 2, ý 4 "Quy Mô Môn Phái" bên dưới. |
| **Bổng lộc Chưởng Môn** | Đang giữ chức Chưởng môn / Giáo chủ | Nhỏ $100$, Vừa $250$, Lớn $400$ lạng/năm, rút từ Ngân khố *(tự động, 0 AP; Ngân khố không đủ thì nhận phần còn lại)* | Muốn lấy thêm tiền từ Ngân khố cho việc riêng là hành động **[Ám] "Biển thủ công quỹ"**: mỗi $1,000$ lạng rút ra tính Hiệp nghĩa $-50$. Ngân khố được dùng công khai cho việc của môn phái (xây Tàng Kinh Các, thuê Hộ viện, chiến tranh môn phái) và **không** tính vào Ngân lượng cá nhân hay kết cục *Phú Khả Địch Quốc*. Khi Chưởng môn qua đời hoặc mất chức, Ngân khố ở lại với môn phái. |

### 2. Bảng Chi Tiêu & Cơ Chế "Đốt Tiền" (Money Sinks)
Để ngăn chặn lạm phát khi người chơi tích lũy hàng vạn lạng bạc ở tuổi 40+, game thiết lập các kênh tiêu tiền chiến lược:

1. **Sinh Hoạt & Giao Tiếp Giang Hồ ($10 - 500$ lạng):**
   * **Sinh hoạt phí hằng năm (tự động trừ từ 16 tuổi, theo Danh vọng):** Vô danh (Danh vọng $< 100$) $10$ lạng; Có tiếng ($100 - 399$) $50$ lạng; Danh hiệp ($400 - 699$) $150$ lạng; Đại hiệp / Đại ma đầu ($\ge 700$) $300$ lạng. Không đủ tiền thì ghi thành Nợ. **Còn ở trong môn phái** (từ Ngoại môn đến Chưởng môn, kể cả môn phái tự lập) thì ăn ở trên núi: sinh hoạt phí tối đa $50$ lạng/năm dù Danh vọng cao; rời môn phái thì áp lại bảng trên.
   * Thuê phòng trọ thượng hạng hồi phục $100\%$ HP/MP: $20$ lạng.
   * Mở tiệc rượu ở tửu lầu kết giao NPC ($+15$ Hảo cảm): $50 - 150$ lạng.
   * Hối lộ Sư phụ Tinh Túc Phái / Quan phủ xóa lệnh truy nã: $200 - 1000$ lạng.
2. **Đấu Giá Hắc Thị & Vạn Bảo Lâu ($500 - 10,000$ lạng):**
   * Mỗi 5 năm một lần tại Giang Nam hoặc Tây Vực, **Hắc Thị Đấu Giá Hội** sẽ mở cửa bán 3 vật phẩm ngẫu nhiên (Đan dược ngàn năm, Tàn quyển võ học, binh khí; mỗi món có $1/3$ là binh khí, nên khoảng $70\%$ phiên có ít nhất 1 binh khí). Đi đấu giá tốn $1$ AP. Người chơi phải đấu giá trực tiếp với các NPC Phú thương/Thế gia (Nếu trả giá cao quá có thể chọn phương án: *"Đợi người khác mua xong rồi ra cổng chặn đường cướp!"*).
     * *Giá binh khí:* **Lợi khí** ($80\%$ số binh khí lên sàn) giá sàn $2,000$ lạng, **Danh khí** ($20\%$) giá sàn $6,000$ lạng; giá chốt bằng giá sàn $\times 1.0 - 1.5$ tùy NPC tranh giá. Thần binh không bán (Hồ sơ 02 IV).
     * *Cảnh báo dòng tiền (mô phỏng, `mo_phong/BAO_CAO.md` mục 19):* mua binh khí khi gia sản còn dưới khoảng $5,000$ lạng đẩy người chơi quay lại săn truy nã để bù tiền, và tỷ lệ tử trận của Chính phái tăng gấp đôi ($6\% \rightarrow 13\%$).
3. **Chi Phí Khai Tông Lập Phái & Duy Trì Gia Trang ($5,000 - 20,000$ lạng):**
   * Mua núi lập phái: $5,000$ lạng.
   * Xây dựng **Tàng Kinh Các Gia Tộc Cấp Cao**: $3,000$ lạng/cấp (Giúp tăng độ hoàn thiện bí kíp truyền lại cho Đời Con từ $60\%$ lên $80\%$, tức cấp tối đa từ $6/10$ lên $8/10$).
   * Thuê **Hộ Viện Cao Thủ** bảo vệ Gia trang (Giúp Đời Con tự động vượt qua sự kiện *"Quần Hùng Trục Lộc"* khi Đời Cha vừa mất): $1,000$ lạng/năm.
4. **Quy Mô Môn Phái (Áp dụng cho Chưởng môn & Môn phái tự lập):**
   * **Nhỏ:** Mặc định khi vừa Khai Tông Lập Phái.
   * **Vừa:** Danh vọng Chưởng môn $\ge 600$ VÀ có ít nhất $3$ Trưởng lão.
   * **Lớn:** Danh vọng Chưởng môn $\ge 850$, có ít nhất $6$ Trưởng lão VÀ môn phái sở hữu ít nhất 1 môn võ Trấn phái hoặc 1 môn Tuyệt học tự sáng tạo.
   * Các đại phái sẵn có (Thiếu Lâm, Võ Đang, Cái Bang, Minh Giáo, Nhật Nguyệt...) mặc định quy mô **Lớn**; Ngũ Nhạc và phái vừa là **Vừa**; bang hội nhỏ là **Nhỏ**.
   * **Ngân khố không đủ trả phí bảo trì:** Mỗi năm thiếu, 1 Trưởng lão bỏ đi và Danh vọng Chưởng môn $-20$; thiếu 3 năm liên tiếp thì môn phái tụt 1 quy mô.

5. **Biến Động Giá Cả Theo Đại Sự Kiện (Dynamic Market Modifier):**
   * Khi xảy ra đại sự kiện **Sơn Hà Phá Toái (Chiến loạn)**: Giá Lương thực và Đan dược trị thương tăng **$\times 300\%$**, giá Bí kíp võ công giảm còn $50\%$ (do nhiều gia tộc phá sản bán tháo).
   * Khi xảy ra **Huyết Án Mê Vụ**: Giá Ám khí, Độc dược và Chi phí thuê Hộ viện tăng **$\times 250\%$**.

### 3. Nợ Nần (Debt)
Ngân lượng không bao giờ âm. Khi phải chi trả mà không đủ tiền (đền tiêu, thua cược, phạt), phần thiếu được ghi thành **Nợ** kèm tên chủ nợ:
* **Lãi:** $20\%$/năm, cộng dồn vào Nợ mỗi khi nhấn "+1 Tuổi".
* **Khấu trừ tự động:** Khi còn Nợ, $50\%$ mọi khoản thu nhập bị chủ nợ thu trước.
* **Quá hạn 3 năm:** Chủ nợ thuê người đòi nợ, kích hoạt sự kiện `[Giao chiến nhanh: 40]` mỗi năm (thua: HP $-30\%$, Thanh danh $-30$). Quá hạn 5 năm: chủ nợ báo quan, người chơi bị truy nã như kẻ quỵt nợ (Thanh danh $-100$).
* **Truyền thừa:** Nợ của Đời Cha chuyển sang Đời Con **trước** khi áp dụng quy tắc kế thừa $30\%$ ngân lượng ("Phụ trái tử hoàn").

### 4. Ngân Lượng Khởi Đầu Theo Gia Cảnh
| Gia cảnh | Ngân lượng lúc Tuổi 0 | Thu nhập gia đình (đến 15 tuổi, tự động) |
| :--- | :--- | :--- |
| Hàn Vi / Khốn Khổ | $0$ | $0$ |
| Bình Dân / Thị Tỉnh | $10 - 30$ | $+5$ lạng/năm |
| Phú Thương / Quan Lại | $500 - 1,500$ | $+50$ lạng/năm (mất khi gặp biến cố "Gia đạo suy vi") |
| Võ Lâm Thế Gia / Ẩn Thế | $200 - 800$ | $+20$ lạng/năm |
| *Riêng Đại Lý Đoàn Thị* | $3,000$ | $+300$ lạng/năm từ 16 tuổi (trợ cấp hoàng tộc, Hồ sơ 02) |

### 5. Sản Nghiệp & Thương Nghiệp (Lối chơi Thương nhân)
Đây là nguồn thu chính của lối chơi Thương nhân và là con đường thực tế duy nhất tới kết cục *Phú Khả Địch Quốc* (Hồ sơ 07).
Mọi lối chơi đều được mua sản nghiệp từ 16 tuổi, nhưng sản nghiệp ăn vào quỹ AP nên người dồn sức cho võ học hay môn phái khó giữ được nhiều.

**Quy tắc chung:**
* **Quản lý:** Mỗi **loại** sản nghiệp đang sở hữu cần **1 AP "Quản lý sản nghiệp" mỗi năm**.
  Năm nào không bỏ AP thì loại đó không sinh lợi (quản sự bỏ túi), nhưng vốn vẫn còn.
* **Gia sản cá nhân** = Ngân lượng + giá vốn sản nghiệp (cổ phần tiêu cục, vốn muối, giá mua sòng bạc, hàng tồn Hắc Thị).
  Gia sản là con số dùng cho kết cục #8; Ngân khố môn phái không tính vào.
* **Bán lại:** Muốn rút vốn khỏi một sản nghiệp tốn 1 AP và chỉ thu về $80\%$ giá vốn.
* **Không đầu tư khi đang Nợ:** Còn Nợ thì không mua thêm sản nghiệp được (chủ nợ giữ sổ).
* **Tiền nhiều sinh họa:** Khi Ngân lượng mặt $\ge 10,000$, mỗi năm `[Ngẫu nhiên: 10%]` Hắc đạo tống tiền, phải `[Giao chiến nhanh: 60]`.
  Thua: mất $10\%$ Ngân lượng mặt.
  Thuê **Hộ Viện Cao Thủ** ($1,000$ lạng/năm, mục 2 ý 3) thì tự động đẩy lui, đồng thời miễn đòi bảo kê sòng bạc.

| Sản nghiệp | Vốn | Lợi tức / năm (khi đã bỏ AP quản lý) | Rủi ro & Hệ quả |
| :--- | :--- | :--- | :--- |
| **Tiểu thương (bán hàng rong)** | Không cần vốn, 1 AP, từ 16 tuổi | $50 - 150$ lạng, `[Roll: Ngộ tính vs 50]`; thất bại chỉ được một nửa | An toàn. Đây là việc kiếm tiền đầu đời của người không đủ Căn cốt đi áp tiêu. |
| **Cổ phần Tiêu cục** *(Phúc Uy, Long Môn...)* | $1,000$ lạng / phần, tối đa $10$ phần | Cổ tức $6\%$ vốn | `[Ngẫu nhiên: 15%]` mất một chuyến tiêu lớn. Người chơi đích thân đốc tiêu: `[Giao chiến nhanh: 50]`. Thắng: giữ nguyên cổ tức. Thua: năm đó không có cổ tức và mất $10\%$ số phần (tối thiểu 1 phần). |
| **Buôn Muối** | Bội số $1,000$, tối đa $10,000$ lạng | $7\%$ vốn | Muối là hàng triều đình độc quyền, cần **Diêm dẫn**: Danh vọng $\ge 400$ thì được cấp, nếu không phải hối lộ quan phủ $1,000$ lạng (hành động **[Ám]**, Hiệp nghĩa $-20$). Khi đại sự kiện *Sơn Hà Phá Toái* đang diễn ra, đường muối bị cắt: lợi tức bằng $0$ cả 3 năm. |
| **Sòng Bạc (Đổ Phường)** | $4,000$ lạng, tối đa 1 sòng | $300 - 900$ lạng | Kinh doanh công khai nhưng mang tiếng: Thanh danh $-10$/năm (không phải [Ám]). `[Ngẫu nhiên: 20%]` bang phái địa phương đòi bảo kê, phải `[Giao chiến nhanh: 60]`; thua thì năm đó bị lấy trắng lợi tức. Có Hộ viện, hoặc Hiệp nghĩa $\le -100$ (Hắc đạo nể mặt), thì miễn. |
| **Đầu Cơ Hắc Thị** | Tối đa $10,000$ lạng hàng mỗi lần, tốn 1 AP vào năm tích trữ | Không có lợi tức đều. Bán vào năm đầu của Đại sự kiện ngẫu nhiên kế tiếp (mốc 18 / 30 / 42 / 54 tuổi, Hồ sơ 01) | Chọn 1 mặt hàng khi tích trữ: **Lương thực & Đan dược** (thắng khi sự kiện là *Sơn Hà Phá Toái*, thu về $\times 3.0$ vốn) hoặc **Ám khí & Độc dược** (thắng khi là *Huyết Án Mê Vụ*, thu về $\times 2.5$). Đoán sai: bán tháo thu về $60\%$ vốn. Người chơi biết lịch mốc nhưng không biết sự kiện nào sẽ được bốc, chỉ biết sự kiện vừa xảy ra sẽ không lặp lại. |

**Số liệu kiểm chứng** (`mo_phong/mo_phong.py`, lối chơi mẫu *Thương nhân*: gia cảnh Phú Thương, Căn cốt 45, Ngộ tính 65, không vào môn phái, ưu tiên sòng bạc → muối → tiêu cục, thuê Hộ viện khi tiền mặt vượt $11,000$):
* Gia sản trung vị: $8,200$ lúc 40 tuổi, $14,700$ lúc 50, $25,300$ lúc 60, $38,800$ lúc 70; tuổi mất trung vị $79$ (có tính tử trận và Tẩu hỏa nhập ma).
* Khoảng $8\%$ số đời chạm $50,000$ trước khi mất (kết cục #8 ở mức hiếm); mọi lối chơi võ học thuần túy vẫn ở $0\%$.
* Đổi lại, đến 70 tuổi võ học chỉ khoảng cấp 7 và Cảnh giới Nội công 7, trong khi các lối chơi võ học đã đạt cấp 10 / Cảnh giới 10 từ khoảng 60 tuổi.

## PHẦN III: DANH MỤC ĐAN DƯỢC CHÍNH TÔNG (LINH ĐAN DIỆU DƯỢC)

Đan dược trong *Vạn Kiếp Giang Hồ* được chia thành 3 nhóm: **Trị Thương Cấp Cứu**, **Tăng Trưởng Nội Tức/Căn Cốt** và **Độc Môn Giải Dược**.

> **Cơ chế "Kháng Thuốc / Đan Độc Tích Tụ":**
> Các loại đan dược tăng vĩnh viễn Căn cốt hoặc Nội tức tối đa ($MP_{max}$) chỉ phát huy $100\%$ hiệu quả ở **lần sử dụng đầu tiên trong đời**. Lần thứ 2 hiệu quả giảm còn $50\%$, từ lần thứ 3 trở đi hoàn toàn vô tác dụng (hoặc gây nổ mạch máu nếu lạm dụng).

| Tên Đan Dược | Nguồn gốc / Môn phái sở hữu | Giá trị (Lạng bạc) | Công dụng Gameplay Chi tiết |
| :--- | :--- | :--- | :--- |
| **Kim Sáng Dược** | Phổ biến khắp các tiệm thuốc | $15$ lạng | Hồi phục ngay $30\%$ $HP$. Có thể bấm dùng ngay giữa Hiệp 1 và Hiệp 2 trong trận đấu. |
| **Tiểu Hoàn Đan** | Thiếu Lâm Tự / Toàn Chân Giáo | $150$ lạng | Hồi phục $50\%$ $MP$, tăng vĩnh viễn $+100$ Nội tức tối đa ($MP_{max}$) và $+2$ Căn cốt ở lần đầu uống. |
| **Đại Hoàn Đan** | Bảo vật trấn tự của Thiếu Lâm | $2,500$ lạng *(Không bán ở chợ)* | "Cải tử hoàn sinh" – Hồi đầy $100\%$ $HP/MP$, xóa bỏ toàn bộ **Điểm Ám Thương**, tăng vĩnh viễn **$+500$ Nội tức tối đa** (Tương đương 10 năm khổ luyện) và $+8$ Căn cốt! |
| **Cửu Hoa Ngọc Lộ Hoàn** | Đào Hoa Đảo (Đông Tà chế luyện từ sương sớm hoa đào) | $800$ lạng | Hồi phục $80\%$ $HP/MP$, hóa giải mọi loại độc tố cấp Trung trở xuống, đồng thời tăng $+3$ Mị lực và $+3$ Ngộ tính nhờ hương thơm thanh khiết. |
| **Hắc Ngọc Đoạn Tục Cao** | Tây Vực (Kim Cương Môn / Triệu Mẫn) | $1,500$ lạng | **Thần dược nối xương duy nhất** chữa được trạng thái **[Tàn Phế / Đứt Kinh Mạch / Cụt Chi]** khi bị kẻ thù phế võ công ở Hiệp 3! |
| **Thiên Vương Bảo Tâm Đan** | Dược Vương Cốc / Hoàng Cung | $1,200$ lạng | Giữ cho tâm mạch bất diệt: Khi mang theo trong người, nếu bị đánh về $0$ $HP$, tự động kích hoạt giữ lại $1$ $HP$ (đan bị tiêu hao) rồi người chơi được bỏ chạy với `[Roll: Cấp Khinh công vs Cấp Khinh công địch]` cộng thêm $+40$ vào chỉ số. Chạy thất bại thì trận đấu tiếp tục với $1$ HP. Tính là **hiệu ứng cứu mạng** của trận (Hồ sơ 02, Phần V.4). |
| **Bạch Hùng Đảm Hoàn** (phóng tác, khác với Bạch Vân Hùng Đảm Hoàn nguyên tác của Hằng Sơn) | Tuyết Sơn Phái / Bắc Cảnh | $600$ lạng | Chế từ mật gấu trắng cực Bắc. Tăng $+5$ Căn cốt, tăng $+30\%$ Kháng hàn trong 10 năm. |
| **Bạch Vân Hùng Đảm Hoàn** | Hằng Sơn Phái | $350$ lạng | Thuốc trị nội thương chuyên dụng của các ni cô Hằng Sơn, hồi $60\%$ $HP$ và xóa trạng thái *Xuất huyết / Nội chấn*. |
| **Tục Mệnh Bát Hoàn** | Lão Đầu Tử (Giang Hồ Dị Nhân) | $2,000$ lạng | Tập hợp 8 vị thuốc quý ngàn năm: Kéo dài **Tuổi Thọ Tối Đa thêm $+10$ năm**, cực kỳ quý giá cho các Lão quái vật muốn sống thêm để tự sáng tạo võ học! |

## PHẦN IV: DANH MỤC ĐỘC DƯỢC & KỲ ĐỘC TÀ GIÁO (POISONS & VENOMS)

Độc dược có thể dùng theo 2 cách: **Tẩm vào Binh khí/Ám khí** trước trận Quyết Đấu Tam Hiệp, hoặc **Hạ độc lén vào trà/rượu** trong giai đoạn Giao tiếp với NPC `[Roll: Ngộ tính vs Ngộ tính địch HOẶC Độc thuật vs Ngộ tính địch]`.
* *Thành công:* Độc phát tác theo bảng dưới, hành động tính là **[Ám]**.
* *Thất bại:* NPC phát hiện chén rượu có độc, hành động [Ám] **bại lộ ngay**, Hảo cảm của NPC $-60$ và lập tức chuyển sang giao chiến (Tam Hiệp nếu là NPC có tên, Giao chiến nhanh nếu là lâu la).

| Tên Độc Dược | Nguồn gốc / Đặc tính | Cách Giải Độc | Hiệu ứng Gameplay (Trong Chiến đấu & Cốt truyện) |
| :--- | :--- | :--- | :--- |
| **Mông Hãn Dược (Thuốc Mê)** | Lục lâm thảo khấu / Hắc điếm | Tự tỉnh sau 1 canh giờ hoặc dùng Nội lực bức ra | Dùng trong sự kiện giao tiếp: Nếu NPC có Căn cốt $< 60$, lập tức ngủ mê mệt, cho phép người chơi **Lột sạch túi tiền/Bí kíp** mà không cần giao chiến (Hiệp nghĩa $-50$ **[Ám]**). |
| **Thập Hương Nhuyễn Cân Tán** | Tây Vực / Quận chúa Triệu Mẫn | Chỉ có thuốc giải độc môn của người hạ độc (hoặc có *Cửu Dương Thần Công*) | Không màu không mùi. Kẻ trúng độc toàn thân mềm nhũn, **Nội tức ($MP$) lập tức khóa về $0$**, không thể sử dụng bất kỳ chiêu thức Nội công hay Tuyệt kỹ nào **đến hết trận đấu**. Nếu không có thuốc giải, dư độc còn lại sau trận khiến Nội tức tối đa giảm $50\%$ trong **1 năm**. |
| **Tam Thi Não Thần Đan** | Nhật Nguyệt Thần Giáo | Phát giải dược định kỳ mỗi năm vào dịp Đoan Ngọ | Độc trùng ngủ trong não. Dùng để **Khống chế Thuộc hạ / NPC bại trận**: Bắt NPC phải nộp $50\%$ thu nhập hoặc đi ám sát kẻ thù thay người chơi mỗi năm. |
| **Đoạn Trường Thảo / Tình Hoa Độc** | Tuyệt Tình Cốc | Tuyệt Tình Đan (Hoặc lấy Độc trị Độc bằng chính Đoạn Trường Thảo) | Kỳ độc gắn liền với ái tình: Cứ mỗi khi nhân vật tương tư hoặc thực hiện hành động *Trò chuyện với Tri kỷ*, độc tố phát tác gây mất $25\%$ $HP$. |
| **Băng Phách Ngân Châm Độc** | Xích Luyện Tiên Tử Lý Mạc Sầu | Đốt cháy bằng Nội công hệ Chí Dương (Cảnh giới Nội công $\ge 8$) hoặc Cửu Hoa Ngọc Lộ Hoàn | Tẩm trên ngân châm: Khi chạm vào da thịt lập tức biến thành màu đen, mỗi hiệp chiến đấu rút $15\%$ $HP$ và làm giảm $30\%$ tốc độ Né tránh của đối phương. |
| **Bi Tô Thanh Phong** | Tây Hạ Nhất Phẩm Đường | Nước mắt chảy ra khi ngửi mùi thuốc giải đặc chế | Độc khí dạng khói phát tán diện rộng: Dùng trong các trận **Đại Chiến Phe Phái / Vây Công Gia Trang**, làm giảm $40\%$ sức chiến đấu của toàn bộ đám đông kẻ địch! |
| **Hạc Đỉnh Hồng / Khổng Tước Đảm** | Hoàng Cung / Sát Thủ Đường | Vô phương cứu chữa nếu đã nuốt xuống bụng | Độc dược tự sát hoặc ám sát tức thời: Giết chết ngay lập tức bất kỳ NPC nào có Căn cốt $< 75$ nếu lừa họ uống phải chén rượu độc. |
| **Thất Tâm Hải Đường** | Dược Vương Cốc (Độc Thủ Dược Vương) | Chỉ truyền nhân Dược Vương Cốc mới giải được | Không đau không ngứa, không phát hiện được mạch tượng. Đúng 1 năm sau khi trúng độc, nạn nhân đang cười nói sẽ tự động tắt thở (Ám sát gần như hoàn hảo: hành động **[Ám]** chỉ có $5\%$ bại lộ tức thời thay vì $20\%$, xem Hồ sơ 01 mục II.3). |

## PHẦN V: KỲ TRÂN DỊ BẢO, THẦN THÚ & PHƯƠNG TIỆN GIANG HỒ (ARTIFACTS & COMPANIONS)

Ngoài Thần binh lợi khí đã nêu ở Hồ sơ 02, thế giới Thần Châu còn ẩn chứa những món **Kỳ Trân Dị Bảo (Tiên thiên linh vật)** và **Thần Thú Đồng Hành** mang lại đặc quyền vượt trội cho cả gia tộc:

### 1. Kỳ Trân Thiên Địa (Sử dụng 1 lần hoặc Trang bị Gia Trang)
1. **Máu Mãng Cổ Chu Thiềm (Vạn Độc Chi Vương):**
   * *Nguồn gốc:* Kỳ ngộ cực hiếm ở đầm lầy Vô Lượng Sơn (Nam Cương).
   * *Công dụng:* Khi nuốt sống con cóc đỏ ngàn năm này, nhân vật đạt cảnh giới **[Vạn Độc Bất Xâm Tuyệt Đối]** (Miễn nhiễm $100\%$ mọi loại độc dược trong game, kể cả *Thập Hương Nhuyễn Cân Tán*), đồng thời máu của người chơi biến thành thuốc giải bách độc cứu sống mọi NPC!
2. **Thiên Sơn Tuyết Liên / Nhân Sâm Ngàn Năm (Bắc Cảnh):**
   * *Nguồn gốc:* Mọc trên vách băng Tuyết Sơn, do mãng xà khổng lồ canh giữ.
   * *Công dụng:* Tăng trực tiếp **$+300$ Nội tức tối đa**, $+10$ Căn cốt và xóa bỏ giới hạn "Kháng thuốc" của cơ thể thêm 1 lần.
3. **Hàn Ngọc Sàng (Giường Ngọc Lạnh Ngàn Năm):**
   * *Nguồn gốc:* Bảo vật của Cổ Mộ Phái (Có thể cướp đoạt hoặc được tặng khi kết hôn với truyền nhân Cổ Mộ).
   * *Công dụng:* Đặt tại Gia trang. Bất kỳ ai (kể cả Đời Con) nằm ngủ và luyện công trên giường này mỗi năm sẽ được **Nhân đôi ($200\%$) tốc độ tu luyện Nội công** và giảm một nửa xác suất Tẩu hỏa nhập ma! Mất vĩnh viễn nếu Gia trang bị đốt trong sự kiện *"Quần Hùng Trục Lộc"* (không thể mang theo làm di vật).
4. **Khuôn Mặt Nạ Da Người (Thuật Dịch Dung Của A Châu):**
   * *Nguồn gốc:* Học từ kỳ ngộ Giang Nam hoặc mua ở Hắc Thị ($1,500$ lạng).
   * *Công dụng:* Cho phép người chơi **Giả dạng thành một NPC bất kỳ** trong 1 năm: Có thể lẻn vào Tàng Kinh Các của phái khác đọc trộm bí kíp mà không bị phát hiện, hoặc đi giết người rồi đổ vấy tội ác cho kẻ mà mình đang giả dạng! Luật cụ thể: bại lộ tức thời $5\%$, đổ tội $2/3$ khi bị rò rỉ (Hồ sơ 01 II.3), hợp đồng ám sát thất bại không bị lộ ngay (Phần II.1).
5. **Thưởng Thiện Phạt Ác Lệnh (Lệnh Bài Hiệp Khách Đảo):**
   * *Nguồn gốc:* Cứ 10 năm một lần, hai sứ giả Áo Vàng sẽ mang lệnh bài phát cho các Chưởng môn.
   * *Công dụng:* Có thể chọn **Chấp nhận đi uống cháo Lạp Bát** (Cơ hội lĩnh ngộ *Thái Huyền Kinh* hoặc chết mất xác nếu Ngộ tính cao nhưng võ công thấp), hoặc **Ném lệnh bài này vào mặt kẻ thù** để ép hắn phải đi Hiệp Khách Đảo thay mình!

### 2. Dị Thú & Tọa Kỵ Đồng Hành (Mounts & Companions)
Mỗi nhân vật có thể sở hữu tối đa **1 Tọa Kỵ** và **1 Linh Thú Chiến Đấu** (Truyền thừa nguyên vẹn sang Đời Con khi nhân vật chính qua đời, trừ khi Đời Con thua sự kiện *"Quần Hùng Trục Lộc"*: khi đó Tọa kỵ / Linh thú được tính là di vật và chịu quy tắc "chỉ giữ 1 món" ở Hồ sơ 05):

| Tên Thần Thú / Tọa Kỵ | Khu vực Xuất hiện | Điều kiện Thu phục | Hiệu ứng Trợ chiến & Hành tẩu |
| :--- | :--- | :--- | :--- |
| **Hãn Huyết Bảo Mã** | Thảo nguyên Bắc Cảnh / Đại Mạc | Phúc duyên $\ge 60$ + Chiến thắng đàn sói hoang cứu ngựa | **Giảm 50% chi phí thời gian di chuyển** giữa 5 khu vực Thần Châu (Mỗi năm được đổi vùng bản đồ 1 lần miễn phí tốn $0$ AP). Tỷ lệ chạy trốn trên cạn $+30\%$. |
| **Thần Điêu** (nguyên tác: con điêu bầu bạn với Độc Cô Cầu Bại; tên "Độc Cô Đinh Điêu" là phóng tác) | Kiếm Mộ / Thung lũng Tương Dương | Căn cốt $\ge 75$, Hiệp nghĩa $\ge +200$, chia sẻ mật rắn Bồ Tư Khúc Xà | Mỗi năm dẫn người chơi đi ăn **Mật Rắn Dị Chủng** ($+50$ Nội tức tối đa/năm). Trong trận Quyết Đấu, Thần Điêu vỗ cánh quạt gió giúp giảm $20\%$ chính xác của kẻ địch! |
| **Bạch Viên Côn Luân (Khỉ Trắng Cổ Đại)** | Thung lũng Côn Luân (Tây Vực) | Ngộ tính $\ge 60$, dùng kỹ năng Y thuật mổ bụng khỉ lấy sách rồi khâu lại cứu sống nó | Lần thu phục đầu tiên: lấy được *Lăng Già Kinh* chứa **Cửu Dương Thần Công** (Hồ sơ 02 Phần III). Sau đó mỗi năm Bạch Viên tự động đi hái trái cây rừng và thảo dược mang về tặng chủ nhân (Ngẫu nhiên nhận được *Chu Quả* hoặc *Đào Tiên* tăng $+3$ Căn cốt). |
| **Mãng Xà Bạch Đà / Vạn Độc Ngô Công** | Tây Vực / Nam Cương | Đệ tử Bạch Đà Sơn hoặc Ngũ Độc Giáo (Độc thuật $\ge 70$) | Trong Hiệp 2 của trận Quyết Đấu, tự động phóng ra cắn lén đối phương, gây sát thương độc bằng $10\%$ $HP_{max}$ của địch mà không tốn lượt hành động. |
| **Song Điêu Trắng (Bạch Điêu Đôi)** | Đào Hoa Đảo / Mông Cổ | Mị lực $\ge 70$, bắn cung cứu chim khỏi đàn ưng đen | Tăng $+15$ Mị lực và $+10$ Danh vọng. Cho phép gửi **Thư tín triệu hồi Bằng hữu / Thê tử** ở cách xa vạn dặm đến trợ chiến ngay tức khắc! |
