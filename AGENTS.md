# Vạn Kiếp Giang Hồ - hướng dẫn cho agent

Game text-based life sim võ hiệp, màn hình dọc mobile-first.
Thiết kế game nằm ở `ho_so_01` đến `ho_so_07`, mô phỏng cân bằng ở `mo_phong/`, review ở `REVIEW.md`, giao diện ở `giao_dien/`.

## Quy tắc implement

### Nguồn sự thật

1. Hồ sơ GDD là nguồn sự thật cho luật chơi và mọi con số. Không tự đặt số.
2. GDD thiếu hoặc mâu thuẫn: không đoán im lặng. Nếu chặn việc thì hỏi; nếu không chặn thì dùng giả định, đặt nó ở một chỗ có nhãn `GIẢ ĐỊNH` (như đầu `mo_phong/mo_phong.py`) và ghi vào mục "Còn mở" của `REVIEW.md`.
3. Đổi luật hoặc số cân bằng thì sửa **cùng lúc** hồ sơ GDD và `mo_phong/mo_phong.py`, chạy lại mô phỏng, ghi một vòng mới vào `mo_phong/BAO_CAO.md`.
4. Không sửa tay `mo_phong/KET_QUA.md` (sinh bằng `python mo_phong/mo_phong.py > mo_phong/KET_QUA.md`). `KET_QUA_vong*.md` và `KET_QUA_truoc.md` là ảnh chụp lịch sử, không sửa.

### Dữ liệu và thuật ngữ

5. Tên trường dữ liệu dùng đúng cột "Mã dữ liệu" ở Bảng Chỉ Số Master (HS01 mục II.8), dạng `snake_case` không dấu (`can_cot`, `ngan_luong`). Chỉ số mới phải thêm vào bảng đó trước khi dùng.
6. Giữ đúng các cặp dễ nhầm theo HS01 mục II: **Thanh danh** (thiên hạ thấy) khác **Hiệp nghĩa thật** khác **Danh vọng**; **Thiên phú** khác **Trạng thái** khác **Nhãn tính cách**; **Căn cốt** khác **Căn cốt đỉnh**.
7. Mọi lựa chọn có điều kiện chỉ dùng ký hiệu chuẩn ở HS06 mục I.2 (`[Cổng]`, `[Cổng ẩn]`, `[Roll]`, `[Tam Hiệp]`, `[Ngẫu nhiên]`...). Mọi Roll và Tam Hiệp phải có nhánh thất bại.
8. Xác suất kiểm định luôn kẹp trong `5% - 95%` (HS06 I.2). Không có gì chắc chắn 100%.
9. Nội dung (sự kiện, võ học, NPC, đan dược, kết cục) nằm ở file dữ liệu (JSON), không viết cứng trong code. Code chỉ chứa luật.

### Code

10. Luật game là hàm thuần: nhận trạng thái và RNG, trả trạng thái mới và các dòng Biên Niên Sử. Giao diện chỉ hiển thị, không tính luật.
11. RNG luôn được truyền vào và có seed. Không gọi random toàn cục, để chơi lại và test được.
12. Mỗi công thức một hàm, chú thích trích mục hồ sơ nguồn (ví dụ `# HS06 I.1 Tuổi thọ tối đa`).
13. Logic có nhánh hoặc công thức phải để lại một kiểm tra chạy được (kiểu `kiem_tra()` trong `mo_phong.py` hay `kiem_tra_tuong_phan.py`). Không thêm framework test khi chưa cần.
14. Sửa lỗi: tái hiện lỗi như người chơi gặp trước, rồi mới sửa tận gốc.
15. Làm đúng phạm vi được giao. Thấy lệch ở chỗ khác thì ghi vào `REVIEW.md`, không sửa lan.
- Mã game ở `game/` theo `ke_hoach/01_KIEN_TRUC.md`; kế hoạch và tiến độ ở `ke_hoach/`.
- Ngoại lệ quy tắc 13: `game/` dùng Vitest (game TypeScript nhiều module cần test runner).

### Giao diện

Mọi việc giao diện (màn hình, thành phần, màu, chữ, bố cục) theo [giao_dien/HE_THONG_THIET_KE.md](giao_dien/HE_THONG_THIET_KE.md).

- Token ở `giao_dien/tokens.css`, thành phần ở `giao_dien/thanh_phan.css`, mẫu sống ở `giao_dien/mau.html`.
- Thành phần chỉ dùng token ngữ nghĩa (tầng 2), không viết mã màu, khoảng cách hay cỡ chữ lẻ.
- Gặp phần giao diện chưa có: chọn lớp hiển thị theo mục 6.2, ghép từ thành phần sẵn có, thiếu mới thêm biến thể, vẫn thiếu mới tạo thành phần mới (mục 11).
- Thành phần hoặc màn hình mới phải được thêm vào `mau.html` và mục 7 của tài liệu.
- Sau khi sửa token chạy `python giao_dien/kiem_tra_tuong_phan.py`.
- Kiểm tra bằng mắt ở khung 390 × 844: `python -m http.server 8765 --directory giao_dien` rồi mở `http://localhost:8765/mau.html`.

### Văn bản

- Không dùng dấu gạch dài (em dash), dùng "-".
- Markdown dài: mỗi câu một dòng.
- Dẫn chiếu hồ sơ theo **mục** (`HS06 I.2`), không theo số dòng: số dòng lệch sau mỗi lần sửa.

## Làm việc tiết kiệm token

### Bản đồ đọc

Hồ sơ có những dòng bảng dài hàng nghìn ký tự, đọc cả file rất tốn.
Luôn lấy mục lục trước, rồi chỉ đọc đúng mục.

| File | Cỡ | Cách đọc |
| :--- | :--- | :--- |
| `ho_so_01` ... `ho_so_07` | 16 - 51 KB | `grep -n "^#" <file>` lấy mục lục, rồi Read theo `offset`/`limit`. Cần một dòng bảng thì `grep -n "<tên dòng>"`. |
| `REVIEW.md` | 44 KB | Chỉ đọc đoạn trạng thái đầu file (khoảng 20 dòng) và mục đang cần. |
| `mo_phong/BAO_CAO.md` | 95 KB | `grep -n "^## " ` rồi đọc mục vòng mới nhất. Vòng cũ chỉ đọc khi cần lý do của một quyết định. |
| `mo_phong/mo_phong.py` | 68 KB | Dùng codegraph (`codegraph_context`, `codegraph_search`) hoặc `grep -n "^def \|^[A-Z_]* ="`. Số giả định ở khối `GIẢ ĐỊNH` đầu file. |
| `mo_phong/KET_QUA*.md` | 9 - 22 KB | Bỏ qua. Cần số liệu mới thì chạy script và grep đầu ra. |
| `giao_dien/HE_THONG_THIET_KE.md` | 18 KB | Đọc mục 6.2, 7, 11 trước; mục khác khi cần. |
| `giao_dien/thanh_phan.css` | 21 KB | `grep -n "============" ` lấy danh sách khối, đọc đúng khối. |
| `giao_dien/mau.html` | 30 KB | `grep -n "<h3>\|<figcaption>"` tìm mẫu cần copy, đọc vùng quanh đó. |
| `ke_hoach/*.md` | - | Đọc README trước, rồi đúng task. |

### Thói quen

- Tìm trước, đọc sau: grep tên mục, tên chỉ số, tên lớp CSS để biết chính xác dòng cần đọc.
- Gom các lệnh đọc / tìm độc lập vào cùng một lượt gọi song song.
- Sửa bằng Edit nhỏ, không ghi lại cả file lớn. Không đọc lại file vừa sửa để kiểm tra.
- Chạy script có đầu ra dài thì lọc: `python mo_phong/mo_phong.py --kiem-tra` chỉ chạy kiểm tra; khi cần số liệu thì `| grep` đúng bảng cần xem.
- Kiểm tra giao diện: ưu tiên `read_page` / `get_page_text` và JavaScript đo tràn; chỉ chụp màn hình khi cần soi thẩm mỹ, chụp vùng nhỏ hoặc `scale` thấp.
- Không giao việc cho subagent khi vài lệnh grep là đủ. Chỉ dùng subagent cho việc quét rất rộng, nhận về kết luận chứ không nhận nội dung file.
- Trả lời ngắn: kết quả, file đã sửa, điều chưa xong. Không chép lại nội dung hồ sơ vào câu trả lời.
