# HỒ SƠ 08: LƯỢC ĐỒ DỮ LIỆU (DÀNH CHO NGƯỜI VIẾT NỘI DUNG)

Tài liệu này mô tả từng loại file JSON trong `du_lieu/`.
Người đọc là người viết nội dung (sự kiện, võ học, NPC...), không cần biết lập trình.
Sự thật cuối cùng về cấu trúc là lược đồ zod ở `game/src/du_lieu/luoc_do.ts`.
Khi lược đồ hoặc DSL thêm loại mới, cập nhật đồng thời tài liệu này và `ke_hoach/01_KIEN_TRUC.md` mục 7.
Luật và con số vẫn lấy từ Hồ sơ 01 - 07, tài liệu này chỉ nói cách ghi chúng thành dữ liệu.

## I. Quy ước chung

- Mỗi file là JSON hợp lệ, mã hóa UTF-8.
- Tên trường dùng `snake_case` không dấu, đúng cột "Mã dữ liệu" ở HS01 II.8 khi là chỉ số.
- Mỗi bản ghi có `ma` (duy nhất trong loại của nó, `snake_case`), `ten` (tên hiển thị) và `nguon` (mục GDD gốc, ví dụ `"HS01 I"`, hoặc `"noi_dung_moi"`).
- Với file mỗi bản ghi một file (sự kiện, môn phái), `ma` phải trùng tên file.
- Văn bản không có dấu gạch dài (U+2014) và không có chữ Hán.
- Xác suất kiểm định luôn kẹp trong 5% - 95% (HS06 I.2), người viết nội dung không cần xử lý.

## II. Các loại file

Cột "Lược đồ" cho biết file đã có lược đồ kiểm tra tự động chưa.
File chưa có lược đồ bị `npm run kiem-tra-du-lieu` từ chối ("không có lược đồ cho đường dẫn này") cho tới task tương ứng.

| File | Nội dung | Lược đồ |
| :--- | :--- | :--- |
| `vung.json` | 5 khu vực | Đã có (M0-03) |
| `chi_so.json` | Danh sách chỉ số theo HS01 II.8 | Đã có (M0-05) |
| `gia_canh.json`, `thien_phu.json`, `trang_thai.json`, `nhan.json` | Gia cảnh, Thiên phú, Trạng thái, Nhãn tính cách | M1-02 |
| `vo_hoc/*.json`, `mon_phai/*.json` | Võ học, môn phái | Đã có (M1-01) |
| `vat_pham/*.json`, `hanh_dong.json` | Vật phẩm, hành động | M1-03 |
| `su_kien/<nhom>/<ma>.json` | Sự kiện, một file một sự kiện | M1-05 |
| `dai_su_kien/*.json`, `npc/*.json` | Đại sự kiện, NPC | M2 |
| `ket_cuc.json`, `luan_hoi.json`, `van_ban/*.json`, `ten_hien_thi.json` | Kết cục, Luân Hồi, văn bản hệ thống, tên hiển thị | M1-18 trở đi |

Task nào thêm lược đồ mới phải thêm mục mô tả loại file đó vào mục II này, kèm ví dụ hoàn chỉnh, và thêm ví dụ vào `game/test/vi_du_hs08.test.ts`.
Các mục III (sự kiện, DSL) là mô tả theo thiết kế ở `ke_hoach/01_KIEN_TRUC.md` mục 7, lược đồ zod tương ứng được viết ở M1-05.

### II.1. `vung.json`

Một mảng các vùng.

| Trường | Kiểu | Ý nghĩa |
| :--- | :--- | :--- |
| `ma` | chuỗi | Mã vùng, dùng trong `vung` của sự kiện và điều kiện `{ "la": "vung" }`. |
| `ten` | chuỗi | Tên hiển thị. |
| `nguon` | chuỗi | Mục GDD gốc. |
| `he_so_ky_ngo` | số từ 0 đến 1 | Hệ số vùng đất cộng vào xác suất kỳ ngộ (HS06 I.3). |

Ví dụ hoàn chỉnh:

```json
[
  { "ma": "trung_nguyen", "ten": "Trung Nguyên", "nguon": "HS01 I", "he_so_ky_ngo": 0 },
  { "ma": "giang_nam", "ten": "Giang Nam", "nguon": "HS01 I", "he_so_ky_ngo": 0.01 }
]
```

### II.2. `chi_so.json`

Một mảng, một dòng cho mỗi chỉ số số ở HS01 II.8.
Người viết nội dung chỉ đọc file này để biết mã chỉ số hợp lệ; chỉ số mới phải thêm vào bảng HS01 II.8 trước.

| Trường | Kiểu | Ý nghĩa |
| :--- | :--- | :--- |
| `ma` | chuỗi | Đúng cột "Mã dữ liệu" của HS01 II.8. |
| `ten` | chuỗi | Tên hiển thị. |
| `nhom` | `nhan_than` / `thien_phu` / `xa_hoi` / `noi_cong` / `chien_dau` / `sinh_ton` / `tap_hoc` | |
| `min`, `max` | số, `max` có thể `null` | Thang danh nghĩa. |
| `tran_cung` | số hoặc `null` | Trần thật khi vượt được `max` (Thiên phú: 150). |
| `hien_thi` | `hien` / `ban_an` / `an` | |
| `phai_sinh` | `true` nếu có | Chỉ số tính bằng công thức, không lưu. |
| `nguon` | chuỗi | `"HS01 II.8"`. |

Ví dụ hoàn chỉnh:

```json
[
  { "ma": "can_cot", "ten": "Căn Cốt", "nhom": "thien_phu", "min": 0, "max": 100, "tran_cung": 150, "hien_thi": "hien", "nguon": "HS01 II.8" },
  { "ma": "hp_max", "ten": "Sinh Mệnh tối đa", "nhom": "chien_dau", "min": 0, "max": null, "tran_cung": null, "hien_thi": "hien", "phai_sinh": true, "nguon": "HS01 II.8" }
]
```

### II.3. `vo_hoc/*.json`

Mỗi file là một mảng các võ học.

| Trường | Kiểu | Ý nghĩa |
| :--- | :--- | :--- |
| `ma` | chuỗi | Mã định danh võ học. |
| `ten` | chuỗi | Tên võ học theo GDD. |
| `nguon` | chuỗi | Mục GDD hoặc mã G.. |
| `nguon_ten` | `nguyen_tac` / `phong_tac` | Nguồn tên (01 mục 7.6). |
| `tru_cot` | `noi_cong` / `ngoai_cong` / `khinh_cong` / `tuyet_ky` | Bốn trụ cột võ học (HS02 II.1). |
| `tier` | 1 / 2 / 3 / 4 | 1 Nhập môn, 2 Thượng thừa, 3 Trấn phái, 4 SSS. |
| `he_noi_luc` | `duong` / `am` / `hoa` / `null` | Bắt buộc đối với nội công, còn lại null (HS02 II.2, G16). |
| `loai_binh_khi` | `quyen_chuong` / `chi_trao` / `kiem` / `dao` / `bong` / `am_khi` / `null` | Loại binh khí của ngoại công (HS02 II.1). |
| `uy_luc_lech` | số từ -0.1 đến 0.1 | Độ lệch uy lực chiêu thức (HS06 I.4). |
| `tran_cap` | số nguyên từ 1 đến 10 | Trần cấp luyện công (khinh công có trần theo tier: 4 / 6 / 8 / 10). |
| `dieu_kien_hoc` | `DieuKien` hoặc `null` | Điều kiện để học võ công. |
| `dac_biet` | mảng chuỗi | Mã cơ chế riêng. |
| `mon_phai` | chuỗi hoặc `null` | Môn phái sở hữu, null nếu tự do. |
| `mo_ta` | chuỗi | Mô tả tóm tắt võ học. |

Ví dụ hoàn chỉnh:

```json
[
  {
    "ma": "thieu_lam_tam_phap",
    "ten": "Thiếu Lâm Tâm Pháp",
    "nguon": "G15, G16",
    "nguon_ten": "phong_tac",
    "tru_cot": "noi_cong",
    "tier": 1,
    "he_noi_luc": "duong",
    "loai_binh_khi": null,
    "uy_luc_lech": 0,
    "tran_cap": 10,
    "mon_phai": "thieu_lam",
    "mo_ta": "Nội công nhập môn tụ khí đan điền của Thiếu Lâm Tự, thuộc hệ Chí Dương."
  }
]
```

### II.4. `mon_phai/*.json`

Mỗi file là một môn phái hoàn chỉnh.

| Trường | Kiểu | Ý nghĩa |
| :--- | :--- | :--- |
| `ma` | chuỗi | Mã môn phái. |
| `ten` | chuỗi | Tên môn phái. |
| `nguon` | chuỗi | Mục GDD gốc. |
| `nguon_ten` | `nguyen_tac` / `phong_tac` | Nguồn tên môn phái. |
| `phe` | `chinh` / `ta` / `trung_lap` | Phe phái của môn phái (HS02 I). |
| `vung` | chuỗi | Mã vùng địa lý môn phái đóng đô. |
| `quy_mo` | `nho` / `vua` / `lon` | Quy mô môn phái (HS02 I, HS04 I). |
| `dieu_kien_gia_nhap` | `DieuKien` | Điều kiện gia nhập môn phái (HS02 I). |
| `vo_hoc_theo_bac` | bảng theo bậc | Danh sách võ học được truyền dạy theo từng bậc (HS04 I.1). |
| `cap_su_phu_theo_bac` | bảng theo bậc | Cấp võ học của sư phụ theo từng bậc (G17). |
| `khao_nghiem` | chuỗi hoặc `null` | Mã sự kiện khảo nghiệm nhập môn (HS03 IV). |
| `dac_quyen` | mảng chuỗi | Đặc quyền môn phái. |
| `mo_ta` | chuỗi | Mô tả tóm tắt môn phái. |

Ví dụ hoàn chỉnh:

```json
{
  "ma": "hoa_son",
  "ten": "Hoa Sơn Phái",
  "nguon": "HS02 I.4",
  "nguon_ten": "nguyen_tac",
  "phe": "chinh",
  "vung": "trung_nguyen",
  "quy_mo": "vua",
  "dieu_kien_gia_nhap": {
    "va": [
      { "so": "ngo_tinh", "op": ">=", "gt": 40 },
      { "so": "hiep_nghia", "op": ">=", "gt": 0 }
    ]
  },
  "vo_hoc_theo_bac": {
    "1": ["hoa_son_kiem_phap", "hoa_son_tam_phap", "hoa_son_than_phap"],
    "2": ["hon_nguyen_chuong"],
    "3": ["tu_ha_than_cong"],
    "4": ["tu_ha_than_cong"],
    "5": ["tu_ha_than_cong"]
  },
  "cap_su_phu_theo_bac": {
    "1": 6,
    "2": 8,
    "3": 10,
    "4": 10,
    "5": 10
  },
  "khao_nghiem": "khao_nghiem_hoa_son",
  "dac_quyen": ["tang_kinh_cac"],
  "mo_ta": "Môn phái danh tiếng trong Ngũ Nhạc Kiếm Phái, chia rẽ giữa Kiếm Tông và Khí Tông."
}
```

## III. Sự kiện

### III.1. Một sự kiện

```json
{
  "ma": "thoi_noi",
  "nguon": "HS03 II.1",
  "ten": "Lễ Thôi Nôi - Trảo Chu",
  "loai": "co_dinh",
  "loai_hien_thi": "thuong",
  "tuoi": [1, 1],
  "vung": null,
  "dieu_kien": null,
  "trong_so": 0,
  "lap_lai": "mot_lan",
  "mo_ta": "Ngày bạn tròn một tuổi, {cha_me} bày các món đồ trước mặt...",
  "lua_chon": [
    {
      "ma": "a",
      "nhan": "Chộp lấy thanh kiếm gỗ cũ kỹ",
      "ket_qua": {
        "van_ban": "Bạn nắm chặt thanh kiếm gỗ không chịu buông.",
        "hieu_ung": [
          { "cong": { "can_cot": 5 } },
          { "hiep_nghia": 10 },
          { "dat_co": "thien_huong_kiem_khach" }
        ]
      }
    },
    {
      "ma": "d",
      "nhan": "Bắt lấy con rết khô",
      "cong_an": { "la": "vung", "trong": ["nam_cuong", "tay_vuc"] },
      "ket_qua": { "van_ban": "...", "hieu_ung": [ { "cong": { "can_cot": 3, "khang_doc": 20, "doc_thuat": 10 } }, { "hiep_nghia": -20 } ] }
    }
  ]
}
```

Trường của sự kiện:

| Trường | Kiểu | Ý nghĩa |
| :--- | :--- | :--- |
| `ma` | chuỗi `snake_case`, duy nhất toàn game | Trùng tên file. |
| `nguon` | chuỗi | Mục GDD gốc (`"HS03 II.1"`) hoặc `"noi_dung_moi"` cho sự kiện mới viết. |
| `loai` | `co_dinh` / `thuong` / `ky_ngo` / `noi_tiep` / `dai_su_kien` | `noi_tiep` chỉ mở bằng `len_lich` hoặc `tiep`, không bao giờ được quay ngẫu nhiên. |
| `cap_ky_ngo` | `B` / `A` / `S` / `SSS` | Bắt buộc khi `loai = ky_ngo` (HS01 II.7). |
| `loai_hien_thi` | `thuong` / `giao-chien` / `tinh-duyen` / `ky-ngo` / `dao-gia` | Quyết định kiểu hiển thị của dòng Biên Niên Sử. |
| `tuoi` | `[min, max]` | Gồm cả hai đầu. |
| `vung` | danh sách mã vùng hoặc `null` (mọi vùng) | |
| `dieu_kien` | DieuKien hoặc `null` | Điều kiện kích hoạt, nghĩa là Cổng ẩn cấp sự kiện (HS06 I.2). |
| `trong_so` | số $\ge 0$ | Dùng khi quay ngẫu nhiên. |
| `lap_lai` | `mot_lan` / `moi_nam` / `{ "cach_nam": n }` / `{ "toi_da": n }` | |
| `vai` | tùy chọn: `{ "<ten_vai>": MauNpc }` | NPC xuất hiện trong sự kiện (M2). |
| `mo_ta` | mẫu văn bản | Mục III.5. |
| `lua_chon` | 2 đến 4 phần tử | Sự kiện chỉ có 1 hướng thì phải là dòng Biên Niên Sử, không phải hộp thoại. |
| `ghi_chu` | tùy chọn | Bắt buộc giải thích khi hiệu ứng vượt định mức (mục IV.2). |

Trường của một lựa chọn:

| Trường | Ký hiệu GDD | Ý nghĩa |
| :--- | :--- | :--- |
| `ma`, `nhan` | | Mã và chữ trên nút. |
| `cong` | `[Cổng]` | Không đạt: nút xám, ghi điều kiện còn thiếu. |
| `cong_an` | `[Cổng ẩn]` | Không đạt: không hiện. |
| `kiem_dinh` | `[Roll]`, `[Roll ngược]`, `[Roll: X vs X địch]`, `[Giao chiến nhanh]`, `[Tam Hiệp]`, `[Ngẫu nhiên]` | Xem III.2. |
| `nguy` | | `true` nếu có thể chết hoặc mất lớn. |
| `ket_qua` | | Dùng khi **không** có `kiem_dinh`. |
| `thanh_cong`, `that_bai` | | Bắt buộc khi có `kiem_dinh` khác `ngau_nhien`. |
| `chi_phi` | | `{ "ap": 1, "ngan_luong": 50 }`; tự sinh Cổng tương ứng. |

Mỗi kết quả (`ket_qua`, `thanh_cong`, `that_bai`) có dạng `{ "van_ban": "...", "hieu_ung": [ ... ] }`.

### III.2. Bảng ánh xạ ký hiệu HS06 I.2 sang `kiem_dinh`

| Ký hiệu | JSON |
| :--- | :--- |
| `[Cổng: X ≥ N]` | Trường `cong`: `{ "so": "x", "op": ">=", "gt": N }` |
| `[Cổng ẩn: X ≥ N]` | Trường `cong_an`, cùng dạng |
| `[Roll: X vs N]` | `{ "loai": "roll", "chi_so": "x", "nguong": N }` |
| `[Roll ngược: X vs N]` | `{ "loai": "roll_nguoc", "chi_so": "x", "nguong": N }` |
| `[Roll: A vs N1 VÀ B vs N2]` | `{ "loai": "roll", "va": [ { "chi_so": "a", "nguong": N1 }, { "chi_so": "b", "nguong": N2 } ] }` |
| `[Roll: A vs N1 HOẶC B vs N2]` | `{ "loai": "roll", "hoac": [ ... ] }` |
| `[Roll: X vs X địch]` | `{ "loai": "roll_doi_khang", "chi_so": "x", "doi_thu": "<ma_mau_npc>" }` |
| `[Giao chiến nhanh: N]` | `{ "loai": "giao_chien_nhanh", "nguong": N }` |
| `[Tam Hiệp: Tên]` | `{ "loai": "tam_hiep", "doi_thu": "<ma>", "che_do": "ty_thi" }` hoặc `"sinh_tu"` |
| `[Ngẫu nhiên: p%]` | `{ "loai": "ngau_nhien", "nhanh": [ { "ti_le": p, "ket_qua": { ... } }, ... ] }` |

Ví dụ:

```json
{ "loai": "roll", "chi_so": "can_cot", "nguong": 25 }
{ "loai": "roll_nguoc", "chi_so": "ngo_tinh", "nguong": 40 }
{ "loai": "roll", "va": [ { "chi_so": "ngo_tinh", "nguong": 50 }, { "chi_so": "mi_luc", "nguong": 50 } ] }
{ "loai": "roll", "hoac": [ { "chi_so": "ngo_tinh", "nguong": 75 }, { "chi_so": "ky_mon", "nguong": 50 } ] }
{ "loai": "roll_doi_khang", "chi_so": "ngo_tinh", "doi_thu": "nhi_su_thuc" }
{ "loai": "giao_chien_nhanh", "nguong": 40 }
{ "loai": "tam_hiep", "doi_thu": "dai_su_huynh", "che_do": "sinh_tu" }
{ "loai": "ngau_nhien", "nhanh": [ { "ti_le": 50, "ket_qua": { } }, { "ti_le": 50, "ket_qua": { } } ] }
```

- `va` dùng hiệu thấp nhất, `hoac` dùng hiệu cao nhất (HS06 I.2 quy tắc bổ sung).
- `cap_khinh_cong` trong Roll tự nhân 10 (HS01 II.4).
- `tam_hiep.che_do`: `ty_thi` (không có Tuyệt sát, HS02 V.3) hoặc `sinh_tu`.
- Thêm `"thang_khi": "tru_vung"` cho trận chỉ cần trụ đủ 3 hiệp (HS04 II.2).
- `ngau_nhien`: tổng `ti_le` phải bằng 100; không chịu Phúc duyên (HS06 I.2); không có `thanh_cong` / `that_bai`, mỗi nhánh tự có kết quả.
- Một lựa chọn có thể có cả `cong` và `kiem_dinh`: Cổng xét trước, đạt mới được Roll.

### III.3. Điều kiện (`DieuKien`)

```json
{ "so": "can_cot", "op": ">=", "gt": 50 }
{ "la": "gioi_tinh", "trong": ["nu"] }
{ "co": "gap_quai_nhan" }
{ "thien_phu": "tu_chat_ngu_don" }
{ "trang_thai": "bach_doc_bat_xam" }
{ "nhan": "nhan_nhin_tham_sau" }
{ "vo_hoc": "doc_co_cuu_kiem", "cap_toi_thieu": 1 }
{ "vat_pham": "khan_lua_mat_do" }
{ "va": [ ... ] }
{ "hoac": [ ... ] }
{ "khong": { ... } }
```

- `so`: mã chỉ số trong `du_lieu/chi_so.json` (theo HS01 II.8) cộng các mã phái sinh và kỹ thuật: `tuoi`, `vo_luc`, `chien_luc`, `canh_gioi_noi_cong`, `cap_khinh_cong`, `bac_mon_phai`, `cong_hien`, `danh_vong` (luôn là Danh vọng hiển thị).
- `op`: `>=`, `<=`, `>`, `<`, `==`, `!=`.
- `la`: trường liệt kê: `gioi_tinh`, `gia_canh`, `vung`, `mon_phai`, `he_noi_luc`, `chinh_ta` (phe của môn phái).
- Hiệp nghĩa: viết `hiep_nghia` (bản chất thật) hoặc `thanh_danh` đúng quy tắc HS01 II.2.
  NPC phán xét thì dùng `thanh_danh`; điều kiện nội tâm thì dùng `hiep_nghia`.

### III.4. Hiệu ứng (`HieuUng`)

Mỗi hiệu ứng là object có đúng 1 khóa:

| Hiệu ứng | Ví dụ | Ghi chú |
| :--- | :--- | :--- |
| `cong` | `{ "cong": { "can_cot": 5, "ngan_luong": -50 } }` | Cộng số. **Không** dùng cho `hiep_nghia`, `thanh_danh` (dùng khóa riêng). Ngân lượng âm quá số đang có thì phần thiếu thành Nợ chỉ khi có `"no_neu_thieu": "<chu_no>"`, nếu không thì lựa chọn phải có `cong` đủ tiền. |
| `cong_phan_tram` | `{ "cong_phan_tram": { "hp": -20 } }` | Phần trăm của giá trị tối đa (`hp`, `noi_tuc`). |
| `hiep_nghia` | `{ "hiep_nghia": 50 }` | Công khai: Hiệp nghĩa và Thanh danh cùng đổi (HS01 II.2). |
| `hiep_nghia` + `am` | `{ "hiep_nghia": -100, "am": "lon", "nan_nhan": "dai_su_huynh" }` | [Ám]: chỉ Hiệp nghĩa đổi, tạo việc [Ám] chưa lộ (`am`: `vat` hoặc `lon`, HS01 II.3). |
| `thanh_danh` | `{ "thanh_danh": -150 }` | Chỉ Thanh danh (bị vu oan, được tung hô). |
| `danh_vong` | `{ "danh_vong": 20 }` | |
| `dat_co`, `xoa_co` | `{ "dat_co": "x" }`, `{ "dat_co": { "x": 3 } }` | Cờ cốt truyện. |
| `them_trang_thai`, `xoa_trang_thai` | `{ "them_trang_thai": "han_doc_phe_phoi" }` | Có thể kèm `"so_nam": 10`. |
| `them_nhan` | `{ "them_nhan": "quat_cuong" }` | |
| `hoc_vo_hoc` | `{ "hoc_vo_hoc": "song_thu_ho_bac", "cap": 1 }` | Kèm `"hoan_thien": 60` cho bản thiếu. |
| `nhan_vat_pham`, `mat_vat_pham` | `{ "nhan_vat_pham": "lenh_bai_huyen_thiet", "so_luong": 1 }` | |
| `gia_nhap_mon_phai` | `{ "gia_nhap_mon_phai": "vo_dang", "bac": 1 }` | |
| `roi_mon_phai` | `{ "roi_mon_phai": "truc_xuat" }` | `tu_roi` / `truc_xuat` / `phan_mon`. |
| `cong_hien`, `thang_bac` | `{ "cong_hien": 200 }`, `{ "thang_bac": 3 }` | `thang_bac` đặt thẳng bậc. |
| `doi_gia_canh` | `{ "doi_gia_canh": "binh_dan" }` | |
| `trong_thuong` | `{ "trong_thuong": true }` | HS06 I.1. |
| `mat_ap_nam_sau` | `{ "mat_ap_nam_sau": 1 }` | "Bị phạt quỳ mất 1 AP năm sau". |
| `len_lich` | `{ "len_lich": { "su_kien": "giai_cuu_ca_nu", "sau_nam": 1, "han_nam": 2 } }` | Hẹn sự kiện nối tiếp. |
| `tiep` | `{ "tiep": "nhanh_bai_su_ta_phai" }` | Mở ngay sự kiện khác (không qua năm). |
| `hao_cam` | `{ "hao_cam": { "vai": "truong_lao", "doi": -40 } }` | M2. |
| `cuu_gia` | `{ "cuu_gia": "hac_y_nhan" }` | M2 rút gọn, M3 đủ. |
| `ghi_ke_thu` | `{ "ghi_ke_thu": "hac_y_chuong_phap" }` | Kẻ thù truyền kiếp (HS01 III.1). |
| `chet` | `{ "chet": "an_doc" }` | Kết thúc kiếp. |
| `dong` | `{ "dong": { "van_ban": "...", "loai_hien_thi": "ky-ngo" } }` | Thêm 1 dòng Biên Niên Sử riêng. |

### III.5. Mẫu văn bản

- Biến trong ngoặc nhọn: `{ten}`, `{tuoi}`, `{vung}`, `{mon_phai}`, `{su_phu}`, `{vai:truong_lao}` (tên NPC gắn vai), `{cha_me}`.
- Theo giới tính người chơi: `{gt:sư huynh|sư tỷ}` (vế trước cho nam, vế sau cho nữ).
- Theo giới tính NPC gắn vai: `{gt_vai:truong_lao:lão|bà}`.
- Ngôi thứ hai "bạn" ở Biên Niên Sử; "ngươi" chỉ trong lời thoại NPC.
- Tên võ học và vật phẩm viết bằng `{vo_hoc:ma}`, `{vat_pham:ma}`, không gõ thẳng tên, để ánh xạ tên hiển thị (`ten_hien_thi.json`) có tác dụng.

## IV. Hướng dẫn viết sự kiện

### IV.1. Quy trình

1. Đọc GDD của giai đoạn tuổi và vùng; chọn mô-típ Kim Dung phù hợp (HS03 và HS04 là giọng văn mẫu).
2. Tạo file `du_lieu/su_kien/<nhom>/<ma>.json`, `ma` trùng tên file.
3. Viết `mo_ta` 2 - 5 câu, ngôi "bạn", tình huống có xung đột rõ.
4. Viết 2 - 4 lựa chọn, mỗi lựa chọn là một **lối sống khác nhau** (chính trực / khôn ngoan / tàn nhẫn / liều lĩnh), không có lựa chọn trội tuyệt đối.
5. Mọi lựa chọn có kiểm định phải có nhánh thất bại **có hệ quả và mở hướng khác** (HS06 I.2, mẫu tốt: "Đại Hôn Đẫm Máu" [B] ở HS05 II.2).
6. Chạy kiểm tra dữ liệu (mục V).

### IV.2. Định mức hiệu ứng

| Loại | Chỉ số gốc | Hiệp nghĩa | Ngân lượng | Danh vọng | Khác |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Sự kiện thường 0 - 15 tuổi | $\pm 2$ đến $\pm 8$ | $\pm 10$ đến $\pm 50$ | $\pm 2$ đến $\pm 50$ | 0 | Nhãn tính cách, cờ |
| Sự kiện thường 16+ | $\pm 2$ đến $\pm 8$ | $\pm 20$ đến $\pm 100$ | $\pm 20$ đến $\pm 300$ | $\pm 5$ đến $\pm 30$ | Cống hiến $\le 100$ |
| Sự kiện bước ngoặt (khảo nghiệm, kế vị) | $\pm 5$ đến $\pm 15$ | $\pm 50$ đến $\pm 200$ | tùy GDD | $\pm 20$ đến $\pm 100$ | Gia nhập / rời môn phái |
| Kỳ ngộ B | $\le +10$ | | | | Vật phẩm thường (HS01 II.7) |
| Kỳ ngộ A | $\le +15$ | | | | Võ Nhập môn / Thượng thừa, Tạp học $+10$ đến $+15$ |
| Kỳ ngộ S | $\le +25$ | | | | Võ Trấn phái, đan dược quý, Thiên phú / Trạng thái hiếm |
| Kỳ ngộ SSS | | | | | Thần công SSS, Thần binh (chỉ M3) |

Số vượt định mức phải có lý do ghi trong trường `ghi_chu` của sự kiện.
Kiểm tra ngữ nghĩa chặn kỳ ngộ vượt cấp.

### IV.3. Danh sách tự kiểm trước khi nộp

- [ ] Đúng ký hiệu chuẩn, mọi Roll / Tam Hiệp có nhánh thất bại có hệ quả.
- [ ] Điều kiện do NPC phán xét dùng `thanh_danh`; điều kiện nội tâm dùng `hiep_nghia` (HS01 II.2).
- [ ] Việc ác làm lén có `am` (từ M2).
- [ ] Có biến thể cho người chơi nữ khi câu văn phụ thuộc giới tính (`{gt:..|..}`).
- [ ] Không nhắc tên võ học / vật phẩm trực tiếp, dùng `{vo_hoc:ma}`, `{vat_pham:ma}`.
- [ ] Nhân vật dưới 16 tuổi: lựa chọn tàn nhẫn chỉ mô tả ở mức hệ quả (REVIEW mục 6 đề xuất rating).
- [ ] Không em dash, không chữ Hán, mỗi câu kết thúc bằng dấu câu.

## V. Kiểm tra trước khi nộp

Chạy trong thư mục `game/`:

```bash
npm run kiem-tra-du-lieu
```

Kết quả `OK (n tệp)` là đạt.
Lỗi được in từng dòng kèm đường dẫn file.
Các luật kiểm tra ngữ nghĩa (báo lỗi, không phải cảnh báo):

1. File không khớp lược đồ.
2. `ma` trùng, hoặc `ma` khác tên file.
3. Tham chiếu tới mã không tồn tại (võ học, vật phẩm, trạng thái, sự kiện `tiep` / `len_lich`, môn phái, vùng, chỉ số).
4. Lựa chọn có `kiem_dinh` (trừ `ngau_nhien`) mà thiếu `thanh_cong` hoặc `that_bai`.
5. Nhánh `that_bai` không có hiệu ứng nào.
6. `ngau_nhien` có tổng `ti_le` khác 100.
7. Sự kiện có ít hơn 2 hoặc nhiều hơn 4 lựa chọn.
8. `cong` trên `hiep_nghia` / `thanh_danh`.
9. Văn bản chứa dấu gạch dài hoặc chữ Hán.
10. Mẫu văn bản dùng biến không tồn tại.
11. `loai = ky_ngo` thiếu `cap_ky_ngo`, hoặc phần thưởng vượt cấp.
12. Thiếu `nguon`.

Một số luật chỉ có hiệu lực khi lược đồ loại file tương ứng đã được thêm (xem mục II).
