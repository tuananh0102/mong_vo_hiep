# Vạn Kiếp Giang Hồ - hướng dẫn cho agent

Game text-based life sim võ hiệp, màn hình dọc mobile-first.
Thiết kế game nằm ở `ho_so_01` đến `ho_so_07`, mô phỏng cân bằng ở `mo_phong/`, review ở `REVIEW.md`.

## Giao diện

Mọi việc liên quan giao diện (màn hình, thành phần, màu, chữ, bố cục) phải theo [giao_dien/HE_THONG_THIET_KE.md](giao_dien/HE_THONG_THIET_KE.md).
Đọc tài liệu đó trước khi viết dòng giao diện đầu tiên.

Tóm tắt luật cứng:

- Token ở `giao_dien/tokens.css`, thành phần ở `giao_dien/thanh_phan.css`, mẫu sống ở `giao_dien/mau.html`.
- Thành phần chỉ dùng token ngữ nghĩa (tầng 2), không viết mã màu, khoảng cách hay cỡ chữ lẻ.
- Gặp phần giao diện chưa có: chọn lớp hiển thị theo mục 6.2, ghép từ thành phần sẵn có, thiếu mới thêm biến thể, vẫn thiếu mới tạo thành phần mới (mục 11).
- Thành phần hoặc màn hình mới phải được thêm vào `mau.html` và mục 7 của tài liệu.
- Sau khi sửa token chạy `python giao_dien/kiem_tra_tuong_phan.py`.
- Kiểm tra bằng mắt ở khung 390 × 844: `python -m http.server 8765 --directory giao_dien` rồi mở `http://localhost:8765/mau.html`.

## Văn bản

- Không dùng dấu gạch dài (em dash), dùng "-".
- Markdown dài: mỗi câu một dòng.
