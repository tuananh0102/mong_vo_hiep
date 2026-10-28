# 02 - NỀN MÓNG (M0) VÀ CỘT MỐC 1 "NHẤT KIẾP" (v0.1)

**Kết quả cuối cột mốc:** người chơi mở trang web trên điện thoại, đầu thai ở Trung Nguyên, sống trọn một kiếp từ Tuổi 0 đến khi chết, đọc Văn bia và nhận Điểm Luân Hồi.
Có 4 môn phái (Thiếu Lâm, Võ Đang, Hoa Sơn, Cái Bang) hoặc làm Lãng khách, đủ Tam Hiệp, kiếm tiền, Nợ, đan dược trị thương, khoảng 60 sự kiện.

**Chưa có trong cột mốc này** (để M2, M3): thế giới 200 NPC, Phong Vân Bảng (Tab 5 khóa), [Ám] và bại lộ, Đại sự kiện, sản nghiệp, Hắc Thị, tình duyên, con cái, truyền thừa, các vùng ngoài Trung Nguyên, Cửa hàng Luân Hồi.
Đối thủ trong trận là NPC tạm sinh theo mẫu sức mạnh, chưa phải NPC sống.

Trước khi làm: đọc [README.md](README.md) mục 3 - 5 và [01_KIEN_TRUC.md](01_KIEN_TRUC.md).

---

## PHẦN M0 - NỀN MÓNG

### [x] M0-01 Khởi tạo dự án `game/`

**Phụ thuộc:** không.
**Đọc:** 01 mục 1, 2, 9; `AGENTS.md`.
**Tạo / sửa:** `game/*` (khung), `.gitignore`, `.claude/launch.json`, `AGENTS.md`.

**Làm:**

1. Ở thư mục gốc dự án chạy `npm create vite@latest game -- --template react-ts`.
2. Trong `game/`: `npm install`, rồi `npm install zod @fontsource/noto-serif`, rồi `npm install -D vitest tsx eslint @eslint/js typescript-eslint eslint-plugin-react-hooks`.
3. Xóa toàn bộ nội dung mẫu của Vite (`App.css`, `index.css`, logo, `assets/`), để `src/main.tsx` render một `<div className="vk-man-hinh">` rỗng.
4. `tsconfig.app.json`: bật `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`, `"noFallthroughCasesInSwitch": true`.
5. `vite.config.ts`: thêm `server: { fs: { allow: ['..'] } }` để nạp `../giao_dien/*.css` và `../du_lieu/**/*.json`; thêm khối `test: { environment: 'node', include: ['test/**/*.test.ts'] }`.
6. `src/main.tsx` import theo thứ tự: `@fontsource/noto-serif/vietnamese-400.css`, `@fontsource/noto-serif/vietnamese-700.css`, `../../giao_dien/tokens.css`, `../../giao_dien/thanh_phan.css`.
7. `eslint.config.js`: cấu hình `typescript-eslint` mức `recommended-type-checked`; thêm luật riêng cho `src/luat/**`:
   - `no-restricted-properties`: cấm `Math.random`.
   - `no-restricted-imports`: cấm `react`, `react-dom`, mọi đường dẫn chứa `giao_dien`.
   - `no-restricted-globals`: cấm `window`, `document`, `localStorage`.
8. `package.json` scripts:
   - `"dev": "vite"`, `"build": "tsc -b && vite build"`, `"test": "vitest run"`, `"lint": "eslint ."`, `"typecheck": "tsc -b --noEmit"`.
   - `"kiem-tra-du-lieu": "tsx cong_cu/kiem_tra_du_lieu.ts"` (tạo file giữ chỗ in `OK`, M0-03 làm thật).
   - `"kiem-tra": "npm run typecheck && npm run lint && npm run kiem-tra-du-lieu && npm run test"`.
9. Tạo `test/khung.test.ts` với 1 test `expect(1 + 1).toBe(2)` để `vitest` có việc chạy.
10. `.gitignore` gốc: thêm `game/node_modules/`, `game/dist/`, `game/coverage/`.
11. `.claude/launch.json`: thêm cấu hình `"name": "game"`, `"runtimeExecutable": "npm"`, `"runtimeArgs": ["run", "dev", "--prefix", "game"]`, `"port": 5173`.
12. `AGENTS.md` mục "Code": thêm 2 gạch đầu dòng:
    - "Mã game ở `game/` theo `ke_hoach/01_KIEN_TRUC.md`; kế hoạch và tiến độ ở `ke_hoach/`."
    - "Ngoại lệ quy tắc 13: `game/` dùng Vitest (game TypeScript nhiều module cần test runner)."
    Thêm dòng vào bảng "Bản đồ đọc": `ke_hoach/*.md` - đọc README trước, rồi đúng task.

**Xong khi:** `cd game && npm run kiem-tra` xanh; `npm run dev` mở trang nền giấy (màu `--nen`) không lỗi console.

---

### [x] M0-02 RNG có seed

**Phụ thuộc:** M0-01.
**Đọc:** 01 mục 6.
**Tạo:** `game/src/luat/rng.ts`, `game/test/rng.test.ts`.

**Làm:**

1. Viết `splitmix32(seed)` sinh 4 số khởi tạo, và lớp nội bộ `Sfc32` với trạng thái `[a, b, c, d]` (số nguyên không dấu 32-bit, dùng `>>> 0`).
2. Xuất kiểu `Rng` với các hàm: `so()`, `nguyen(a, b)`, `trung(p)`, `layTrangThai()`.
3. Xuất `rngTuSeed(seed: number): Rng`, `taoRng(trangThai): Rng`, `chonTheoTrongSo<T>(rng, ds: {gia_tri: T; trong_so: number}[]): T | null` (trả `null` khi tổng trọng số bằng 0).

**Test bắt buộc:**

- Cùng seed cho cùng dãy 1.000 số.
- `layTrangThai` rồi `taoRng` tiếp tục đúng dãy (lấy 10 số, lưu, tạo lại, 10 số tiếp theo khớp với rng gốc).
- `so()` luôn trong $[0, 1)$; `nguyen(1, 6)` ra đủ 1 - 6, không ra 0 hay 7 (100.000 lần).
- `chonTheoTrongSo` với trọng số 1 : 3 cho tỷ lệ $25\% \pm 1\%$ trên 100.000 lần.

**Xong khi:** test xanh.

---

### [x] M0-03 Lược đồ và nạp dữ liệu

**Phụ thuộc:** M0-01.
**Đọc:** 01 mục 2, 7, 8.
**Tạo:** `game/src/du_lieu/luoc_do.ts`, `nap.ts`, `nap_node.ts`, `nap_vite.ts`, `kiem_tra_ngu_nghia.ts`; `game/cong_cu/kiem_tra_du_lieu.ts`; thư mục `du_lieu/` với `vung.json` tối thiểu; test `game/test/nap.test.ts`.

**Làm:**

1. `luoc_do.ts`: khai báo lược đồ zod cho `Vung` (`ma`, `ten`, `nguon`, `he_so_ky_ngo`) làm mẫu. Các lược đồ khác thêm dần ở task sau. Xuất kiểu bằng `z.infer`.
2. `nap.ts`: hàm thuần `napDuLieu(tep: Record<string, unknown>): DuLieu`:
   - `tep` là ánh xạ đường dẫn tương đối (từ `du_lieu/`) → nội dung JSON đã parse.
   - Định tuyến theo đường dẫn: `vung.json` → `dl.vung`, `su_kien/**` → `dl.su_kien`, ...
   - Parse từng file bằng lược đồ tương ứng; lỗi thì gom lại kèm đường dẫn file.
   - Chạy `kiemTraNguNghia(dl)`; có lỗi thì ném 1 lỗi liệt kê tất cả.
   - Trả `dl` đã `Object.freeze` sâu, các danh sách đổi thành `Record<ma, ...>` để tra nhanh.
3. `nap_vite.ts`: `import.meta.glob('../../../du_lieu/**/*.json', { eager: true, import: 'default' })`, chuẩn hóa khóa về đường dẫn tương đối, gọi `napDuLieu`. Xuất hằng `DU_LIEU`.
4. `nap_node.ts`: đọc đệ quy `du_lieu/` bằng `node:fs`, gọi `napDuLieu`. Chỉ script trong `cong_cu/` dùng file này.
5. `kiem_tra_ngu_nghia.ts`: khung hàm `kiemTraNguNghia(dl): string[]`, chạy lần lượt các luật ở 01 mục 7.4. Luật nào chưa có dữ liệu để kiểm thì viết sẵn, chạy trên danh sách rỗng.
6. `cong_cu/kiem_tra_du_lieu.ts`: gọi `nap_node`, in `OK (n tệp)` hoặc in từng lỗi và `process.exit(1)`.
7. `du_lieu/vung.json`: 5 vùng theo HS01 I, hệ số kỳ ngộ theo HS06 I.3 (Trung Nguyên 0, Giang Nam 0,01, ba vùng còn lại 0,04).

**Test bắt buộc:** nạp bộ dữ liệu thật thành công; một file sai lược đồ (tạo trong test, không ghi đĩa) làm `napDuLieu` ném lỗi có tên file.

**Xong khi:** `npm run kiem-tra` xanh, in `OK`.

---

### [x] M0-04 Hồ sơ 08: Lược đồ dữ liệu

**Phụ thuộc:** M0-03.
**Đọc:** 01 mục 7, 8; REVIEW mục 7 (đề xuất Hồ sơ 08).
**Tạo:** `ho_so_08_luoc_do_du_lieu.md`.

**Làm:**

1. Viết tài liệu cho **người viết nội dung** (không phải lập trình viên): từng loại file trong `du_lieu/`, từng trường, ví dụ hoàn chỉnh, bảng ánh xạ ký hiệu HS06 I.2 → `kiem_dinh` JSON.
2. Chép bảng DSL điều kiện và hiệu ứng từ 01 mục 7.2, 7.3 (HS08 là bản chính cho người viết nội dung; khi DSL thêm loại mới, cập nhật cả 01 và HS08).
3. Thêm mục "Hướng dẫn viết sự kiện" chép từ Phụ lục A của file này.
4. Thêm mục "Kiểm tra trước khi nộp": chạy `npm run kiem-tra-du-lieu` trong `game/`.
5. Mỗi câu một dòng, không em dash.
6. Ghi vào `REVIEW.md` mục 7: "Hồ sơ 08 schema: đã có ở `ho_so_08_luoc_do_du_lieu.md`."

**Xong khi:** tài liệu có đủ mọi loại file đang có lược đồ; ví dụ trong tài liệu qua được lược đồ zod (copy ví dụ vào 1 test `test/vi_du_hs08.test.ts`).

---

### [x] M0-05 Kiểu trạng thái và chỉ số

**Phụ thuộc:** M0-03.
**Đọc:** HS01 II (toàn bộ, nhất là II.8 Bảng Chỉ Số Master); 01 mục 4.
**Tạo:** `game/src/luat/kieu.ts`, `chi_so.ts`, `hang_so.ts`, `gia_dinh.ts`; `du_lieu/chi_so.json`; `game/test/chi_so.test.ts`.

**Làm:**

1. `du_lieu/chi_so.json`: một dòng cho mỗi chỉ số số trong HS01 II.8: `ma` (đúng "Mã dữ liệu"), `ten`, `nhom`, `min`, `max`, `tran_cung` (150 cho 4 chỉ số Thiên phú), `hien_thi` (`hien` / `ban_an` / `an`), `nguon: "HS01 II.8"`.
2. `kieu.ts`: viết đầy đủ các kiểu ở 01 mục 4.1. Mỗi trường có chú thích ngắn trích mục GDD.
3. `chi_so.ts`:
   - `docChiSo(nv, ma)`: đọc chỉ số lưu hoặc gọi hàm phái sinh (phái sinh viết ở M1-04; tạm để `throw new Error('M1-04')` cho mã phái sinh).
   - `congChiSo(nv, ma, delta)`, `datChiSo(nv, ma, gia_tri)`: kẹp theo `chi_so.json` và trần cứng; với Thiên phú, phần vượt trần bị bỏ (HS06 I.1).
   - Riêng `can_cot`: sau khi cộng, `can_cot_dinh = max(can_cot_dinh, can_cot)` (HS01 II.8).
   - `ngo_tinh` bị khóa nếu có Thiên phú `tu_chat_ngu_don` (HS01 III.2): mọi lần cộng bị bỏ qua. Kiểm qua mã `dac_biet` của thiên phú, không viết cứng tên.
4. `hang_so.ts`, `gia_dinh.ts`: tạo file với khối chú thích đầu. `gia_dinh.ts` mở đầu bằng:
   ```ts
   // ===================== GIẢ ĐỊNH (GDD chưa có số) =====================
   // Mỗi hằng số ghi mã lỗ hổng ở ke_hoach/05_LO_HONG_GDD.md và đã ghi "Còn mở" ở REVIEW.md.
   ```
5. `taoNhanVatRong(): NhanVat` và `taoTrangThaiRong(seed): TrangThaiGame` (mọi số 0, danh sách rỗng) để test dùng.

**Test bắt buộc:** cộng `can_cot` vượt 150 thì dừng ở 150; `can_cot_dinh` không giảm khi `can_cot` giảm; Hiệp nghĩa kẹp $[-1000, 1000]$; Danh vọng kẹp $[0, 1000]$; Ngộ tính không đổi khi có *Tư Chất Ngu Độn*.

**Xong khi:** test xanh; mọi mã trong `chi_so.json` có trường tương ứng trong `NhanVat` (viết 1 test so khóa).

---

### [x] M0-06 Kiểm định xác suất

**Phụ thuộc:** M0-05.
**Đọc:** HS06 I.2 (toàn bộ); `mo_phong.py` hàm `p_roll`; thiết kế mục 9.
**Tạo:** `game/src/luat/kiem_dinh.ts`, `game/test/kiem_dinh.test.ts`.

**Làm:**

1. `kepXacSuat(p)`: kẹp $[0{,}05; 0{,}95]$.
2. `pRoll(chiSo, nguong, phucDuyen, nguoc = false)`: đúng công thức HS06 I.2.2, khớp `p_roll`.
3. `pRollNhieu(ds, kieu: 'va' | 'hoac', phucDuyen)`: lấy hiệu thấp nhất / cao nhất rồi áp công thức (HS06 I.2 quy tắc bổ sung).
4. `nhanDoKho(p)`: `'hiem'` (< 0,25), `'kho'` (0,25 - 0,49), `'kha'` (0,50 - 0,74), `'de'` (≥ 0,75). Ranh giới đúng HS07 I.1.
5. `lanRoll(rng, p): boolean` = `rng.so() < p`.

**Test bắt buộc:** `pRoll(25, 25, 50) = 0.5`; `pRoll(0, 100, 50) = 0.05`; `pRoll(100, 0, 50) = 0.95`; Roll ngược đảo chiều; `va` dùng hiệu thấp nhất; nhãn đúng ở 0,2499 / 0,25 / 0,4999 / 0,5 / 0,7499 / 0,75.

**Xong khi:** test xanh.

---

### [x] M0-07 Vector đối chiếu từ Python

**Phụ thuộc:** M0-06.
**Đọc:** 01 mục 10.2, 10.3; `mo_phong/mo_phong.py` (khối GIẢ ĐỊNH đầu file, các hàm `p_roll`, `bonus_tuoi`, `ap_moi_nam`, `tien_do`, `ap_len_10`, `khac_che`, lớp `VoGia`, lớp `Doi` thuộc tính `age_max`, `tuoi_bat_dau_lao_hoa`, `thong_ke`, `MUC_SUC_MANH`). Dùng `grep -n` và Read theo đoạn, không đọc cả file.
**Tạo:** `mo_phong/xuat_vector.py`, `game/test/vector/*.json` (sinh ra), `game/test/vector.test.ts`.

**Làm:**

1. `xuat_vector.py` (chỉ thư viện chuẩn) `import mo_phong` rồi ghi các file JSON vào `game/test/vector/`:
   - `p_roll.json`: lưới `x` 0 - 150 bước 5, `n` 0 - 100 bước 5, `phuc_duyen` ∈ {0, 30, 50, 70, 100, 150}, `nguoc` ∈ {false, true}.
   - `bonus_tuoi.json`: tuổi 0 - 120.
   - `ap_moi_nam.json`: tuổi 0 - 100 × cảnh giới 0 - 10.
   - `tien_do.json`: Ngộ tính 0 - 150 bước 5 × cấp sư phụ 0 - 10 × tier 1 - 4; và `ap_len_10` cho Ngộ tính 10 - 100 bước 10 × cấp sư phụ {0, 6, 10} × tier 1 - 4.
   - `khac_che.json`: mọi cặp trong `duong`, `am`, `hoa`, `ngoai`.
   - `vo_gia.json`: 500 bộ tham số ngẫu nhiên (`random.Random(7)`) cho `VoGia`, ghi `hp_max`, `mp_max`, `vo_luc`, `chien_luc`.
   - `age_max.json`: lưới Căn cốt đỉnh × cảnh giới × Ám thương.
   - `tam_hiep_ti_le.json`: với mỗi cặp trong `MUC_SUC_MANH` (hoặc bảng cặp mà `bao_cao_tam_hiep` dùng), chạy `thong_ke` 20.000 trận, ghi tỷ lệ thắng / hòa / thua. Ghi kèm tham số đầu vào của hai bên.
2. Đầu file JSON ghi `"nguon": "mo_phong/xuat_vector.py"` và ngày sinh.
3. `vector.test.ts`: với từng file (trừ `tam_hiep_ti_le.json`), gọi hàm TypeScript tương ứng và so khớp tuyệt đối. Hàm chưa có (viết ở M1-04) thì dùng `it.todo` để test không đỏ; M1-04 sẽ bật lên.
4. Thêm vào `mo_phong/BAO_CAO.md`? **Không** (không đổi luật). Chỉ thêm 1 dòng vào docstring đầu `xuat_vector.py` giải thích cách chạy: `python mo_phong/xuat_vector.py`.

**Xong khi:** `python mo_phong/xuat_vector.py` chạy không lỗi; `npm run test` xanh (có `todo`).

---

### [x] M0-08 DSL điều kiện, hiệu ứng, văn bản

**Phụ thuộc:** M0-05, M0-06.
**Đọc:** 01 mục 7 (toàn bộ); HS06 I.2; HS01 II.2 (quy tắc đọc Hiệp nghĩa), II.3 (nhãn [Ám]).
**Tạo:** lược đồ `SuKien`, `DieuKien`, `HieuUng`, `KiemDinh` trong `luoc_do.ts`; `game/src/luat/dieu_kien.ts`, `hieu_ung.ts`, `van_ban.ts`; bổ sung `kiem_tra_ngu_nghia.ts`; `game/test/dieu_kien.test.ts`, `hieu_ung.test.ts`, `van_ban.test.ts`, `ngu_nghia.test.ts`; `game/test/mau_du_lieu/` (sự kiện mẫu đúng và sai).

**Làm:**

1. Lược đồ zod đúng 01 mục 7.1 - 7.3. Dùng `z.discriminatedUnion` cho `kiem_dinh.loai`. `HieuUng` là union các object 1 khóa.
2. `dieu_kien.ts`: `danhGia(dk, d, dl, bien): boolean` và `moTaThieu(dk, d, dl): string | null` (chuỗi "Cần Ngân lượng 50" cho nút xám, thiết kế mục 9). Dùng `docChiSo`.
3. `hieu_ung.ts`: `apHieuUng(hu, d, rng, dl, bien): DongBienNien[]`. Mỗi loại hiệu ứng một hàm nhỏ. Hiệu ứng của cột mốc sau (`hao_cam`, `cuu_gia`, `hiep_nghia` với `am`) ném `Error('chưa hỗ trợ: M2-06')` cho tới khi task đó làm, và `kiem_tra_ngu_nghia` báo lỗi nếu dữ liệu dùng chúng sớm.
   - `hiep_nghia` công khai: cộng cả `hiep_nghia` và `thanh_danh` (HS01 II.2).
   - `cong` với `ngan_luong` âm: nếu không đủ tiền và không có `no_neu_thieu` thì ném lỗi lập trình (dữ liệu sai: lựa chọn phải có Cổng tiền).
4. `van_ban.ts`: `dienMau(mau, d, dl, bien): string`; `bienTrongMau(mau): string[]` dùng cho kiểm tra ngữ nghĩa.
5. `kiem_tra_ngu_nghia.ts`: cài đủ 12 luật ở 01 mục 7.4.
6. `test/mau_du_lieu/`: 3 sự kiện đúng (1 có Roll, 1 có Cổng, 1 có Ngẫu nhiên) và 6 sự kiện sai (thiếu `that_bai`, `that_bai` rỗng, tổng `ti_le` 90, 5 lựa chọn, có em dash, `cong` trên `hiep_nghia`). Đây là dữ liệu test, không nằm trong `du_lieu/`.

**Test bắt buộc:** mỗi loại điều kiện đúng / sai; `va`, `hoac`, `khong` lồng nhau; mỗi loại hiệu ứng; Hiệp nghĩa công khai đổi cả Thanh danh; 6 sự kiện sai đều bị bắt, đúng thông điệp; mẫu `{gt:a|b}` theo giới tính.

**Xong khi:** test xanh.

---

### [x] M0-09 Động cơ, bất biến, lưu game

**Phụ thuộc:** M0-02, M0-08.
**Đọc:** 01 mục 5, 10.4, 10.5, 11.
**Tạo:** `game/src/luat/dong_co.ts`, `vong_nam.ts` (khung 15 bước, đa số rỗng), `bat_bien.ts`, `luu.ts`, `xem.ts` (khung); `game/test/dong_co.test.ts`, `luu.test.ts`.

**Làm:**

1. `dong_co.ts`: `apDung` đúng 01 mục 5.1, `switch` mọi loại `Lenh` (loại chưa làm trả `loi: 'chua_ho_tro'`).
2. Luật chung của `apDung`:
   - `ket_thuc !== null` → chỉ nhận `tiep_tuc`.
   - `cho !== null` → chỉ nhận lệnh trả lời đúng loại `cho` (và lệnh 0 AP được phép).
   - Thêm `dong_moi` vào cuối `bien_nien`, mỗi dòng gắn `tuoi`.
3. `vong_nam.ts`: hàm `quaNam(d, rng, dl)` gọi 15 hàm bước theo đúng thứ tự 01 mục 5.4, mỗi hàm có chú thích mục GDD và task phụ trách. Bước 8 (tăng tuổi) và bước 14 (đặt AP, tạm dùng hằng 2) làm thật ngay.
4. `bat_bien.ts`: `kiemTraBatBien(d, dl): string[]` theo 01 mục 10.4 (phần chưa có dữ liệu thì bỏ qua). `apDung` gọi nó khi `import.meta.env.DEV` hoặc `process.env.VITEST`; có vi phạm thì ném lỗi.
5. `luu.ts`: `tuanTuHoa(banLuu)`, `docBanLuu(chuoi)`, `CHUYEN_DOI`, hằng `PHIEN_BAN = 1`. Bản lưu gồm `{ phien_ban, trang_thai_dau, lenh: Lenh[], trang_thai }`.
6. `xem.ts`: khung, xuất `xemManHinh(d, dl)` trả object chỉ gồm những gì giao diện cần (tên, tuổi, AP, các dòng Biên Niên Sử...). Thêm dần ở task sau.

**Test bắt buộc:** lệnh sai lúc đang `cho` trả `loi` và trạng thái không đổi (cùng tham chiếu); `apDung` không sửa object đầu vào (đóng băng sâu đầu vào trong test); `qua_nam` tăng tuổi; replay 50 lệnh `qua_nam` từ cùng seed ra cùng trạng thái; lưu rồi đọc lại bằng nhau.

**Xong khi:** test xanh.

---

### [x] M0-10 Khung giao diện

**Phụ thuộc:** M0-09.
**Đọc:** 01 mục 12; `giao_dien/HE_THONG_THIET_KE.md` mục 1, 6, 7, 10; `giao_dien/mau.html` khung "Màn hình chính" (tìm bằng `grep -n "<figcaption>"`).
**Tạo:** `game/src/giao_dien/UngDung.tsx`, `ManHinh.tsx`, `ThanhTrangThai.tsx`, `BienNien.tsx`, `BanDieuKhien.tsx`, `dung_tro_choi.ts` (hook giữ trạng thái + `phat`).

**Làm:**

1. `dung_tro_choi.ts`: `useReducer` gọi `apDung`; tự lưu `localStorage` sau mỗi lệnh thành công; khi mở trang thì đọc bản lưu, không có thì tạo trạng thái mới.
2. Chép HTML khung "Màn hình chính" trong `mau.html` sang JSX, chia vào 4 component; giữ nguyên lớp `vk-*`, `data-*`, `aria-*`.
3. Đổ dữ liệu từ `xemManHinh`: tuổi, dòng Biên Niên Sử, số AP. Nút "+1 Tuổi" gọi `phat({ loai: 'qua_nam' })`.
4. Biên Niên Sử tự cuộn xuống dòng mới, có `aria-live="polite"`.

**Xong khi:** `npm run dev`, bấm "+1 Tuổi" thấy tuổi tăng và dòng mới; tải lại trang vẫn giữ tuổi; kiểm tra bằng mắt theo README mục 5 đạt.

---

## PHẦN M1 - CỘT MỐC 1

### [x] M1-01 Dữ liệu võ học và 4 môn phái

**Phụ thuộc:** M0-04.
**Đọc:** HS02 I.1 (A Thiếu Lâm, B Võ Đang, D Cái Bang), HS02 I.4 (Hoa Sơn), HS02 II.1, II.2; HS03 IV (võ học được dạy khi nhập môn); HS04 I.1 (bậc); `05_LO_HONG_GDD.md` G15, G16.
**Tạo:** lược đồ `VoHoc`, `MonPhai` trong `luoc_do.ts`; `du_lieu/vo_hoc/thieu_lam.json`, `vo_dang.json`, `hoa_son.json`, `cai_bang.json`, `tu_do.json`; `du_lieu/mon_phai/thieu_lam.json`, `vo_dang.json`, `hoa_son.json`, `cai_bang.json`.

**Làm:**

1. Lược đồ theo 01 mục 8.
2. Mỗi môn võ HS02 liệt kê của 4 phái thành 1 bản ghi: đúng tier theo nhóm (Nhập môn / Thượng thừa / Trấn phái), `tru_cot`, `loai_binh_khi`, `he_noi_luc` cho nội công (theo HS02 II.2; môn không được nhắc thì theo G16).
3. Mỗi phái cần ít nhất 1 Nội công Nhập môn và 1 Khinh công (theo G15).
4. `tu_do.json`: võ học xuất hiện trong kịch bản M1 (*Song Thủ Hỗ Bác*, *Không Minh Quyền*, *Hủ Thi Độc Chưởng* bản tàn quyển, *Thái Tổ Trường Quyền* nếu không thuộc phái nào...). Tra HS02 III để lấy tier; tàn quyển dùng `hoan_thien`.
5. Môn phái: `dieu_kien_gia_nhap` dịch đúng HS02 I (Thiếu Lâm chỉ Nam, Thanh danh ≥ 0, Căn cốt ≥ 50...). `vo_hoc_theo_bac` theo HS04 I.1 (Bậc 1 Nhập môn, Bậc 2 Thượng thừa, Bậc 3 Trấn phái; khớp `TIER_THEO_BAC` trong `mo_phong.py`). `cap_su_phu_theo_bac` lấy `SU_PHU_THEO_BAC` của `mo_phong.py` (là giả định đã dùng để cân bằng, ghi G17).
6. Mọi bản ghi có `nguon` và `nguon_ten`.

**Xong khi:** `npm run kiem-tra-du-lieu` xanh; đếm được đủ võ học HS02 liệt kê cho 4 phái (viết 1 test đếm theo danh sách tên copy từ HS02).

---

### [x] M1-02 Dữ liệu Gia cảnh, Thiên phú, Trạng thái, Nhãn

**Phụ thuộc:** M0-04.
**Đọc:** HS01 II.7, III; HS06 II.4; HS05 IV.1 (*Tiên Thiên Võ Thể*); HS03 (mọi Trạng thái và Nhãn được nhắc); `05_LO_HONG_GDD.md` G05, G06.
**Tạo:** lược đồ + `du_lieu/gia_canh.json`, `thien_phu.json`, `trang_thai.json`, `nhan.json`.

**Làm:**

1. `gia_canh.json`: 4 nhóm, tỷ lệ 35 / 35 / 20 / 10 (HS01 III.1), ngân lượng khởi đầu và thu nhập gia đình (HS06 II.4), khoảng chỉ số gốc (G06), cờ đặc biệt (Võ Lâm Thế Gia: võ công gia truyền năm 5 tuổi, kẻ thù truyền kiếp).
2. `thien_phu.json`: 3 thiên phú có trong HS01 III.2 + *Tiên Thiên Võ Thể*, dịch đúng hiệu ứng; thêm danh sách đề xuất của G05 (đánh dấu `nguon: "G05"`).
3. `trang_thai.json`, `nhan.json`: mọi Trạng thái và Nhãn xuất hiện trong HS03, HS04 II - III (grep `\[` trong 2 file). Hiệu ứng có số trong GDD thì ghi; không có số thì chỉ là cờ mô tả.

**Xong khi:** kiểm tra dữ liệu xanh; tổng tỷ lệ gia cảnh = 100.

---

### [x] M1-03 Dữ liệu vật phẩm và hành động

**Phụ thuộc:** M0-04.
**Đọc:** HS06 III (đan dược); HS06 II.1 - II.2 (thu nhập, chi tiêu); HS01 IV; HS03 I; HS04 I; `05_LO_HONG_GDD.md` G07, G08.
**Tạo:** lược đồ + `du_lieu/vat_pham/dan_duoc.json` (đủ 9 loại HS06 III, M1 chỉ bán ở chợ những loại `ban_o: "cho"`), `du_lieu/vat_pham/vat_pham_su_kien.json` (vật phẩm kịch bản: khăn lụa, lệnh bài...), `du_lieu/hanh_dong.json`.

**Làm:**

1. Đan dược: giá, công dụng đúng HS06 III; công dụng dịch sang `hieu_ung` khi biểu diễn được bằng DSL, còn lại dùng `dac_biet` (ví dụ `thien_vuong_bao_tam` cho hiệu ứng cứu mạng, làm ở M2-15).
2. `hanh_dong.json`: mọi hành động M1 kèm tuổi mở khóa, AP, `xu_ly`, nhóm Tab. Danh sách tối thiểu:
   - 0 - 5 tuổi: *Nằm nôi*, *Tập bò*, *Nghe kể chuyện*, *Lục lọi đồ đạc* (HS03 I).
   - 6 - 10 tuổi: *Đọc sách vỡ lòng*, *Rèn thể lực*, *Chơi cùng trẻ hàng xóm*, *Phụ giúp gia đình*, *Đi ăn trộm vặt* (M1 tạm là việc công khai nhỏ; thành [Ám] ở M2-06), *Học Tạp học* (HS03 I).
   - 11+: *Luyện công*, *Học Tạp học*, *Làm thuê vặt* (11 - 18), *Tiểu thương* (16+), *Áp tiêu*, *Săn tiền thưởng*, *Nhiệm vụ sư môn*, *Sai phái sư môn*, *Khám phá quanh vùng / Hành tẩu giang hồ*, *Trị thương / Nghỉ trọ*, *Bế quan* và *Dưỡng già* (71+, G32).
   - Miễn phí (tối đa 2 / năm, từ 11 tuổi): *Mua sắm ở chợ*; *Trò chuyện* để trống tới M2-03.
   - Không tính vào giới hạn: *Thay trang bị*, *Uống đan dược*, *Xem bảng tin* (HS01 IV ghi chú).
3. Hiệu ứng hành động trẻ em và hành động không có số trong GDD: theo bảng G08.

**Xong khi:** kiểm tra dữ liệu xanh.

---

### [x] M1-04 Công thức phái sinh

**Phụ thuộc:** M0-07, M1-01.
**Đọc:** HS06 I.1, I.5; HS01 II.4, IV; HS02 II.1 (số ô, trần Khinh công); HS04 III (lão hóa).
**Tạo:** `game/src/luat/cong_thuc.ts`, `game/test/cong_thuc.test.ts`; bật các `it.todo` trong `vector.test.ts`.

**Làm:** mỗi hàm một công thức, chú thích mục GDD, tên khớp hàm Python:

| Hàm TS | GDD | Python đối chiếu |
| :--- | :--- | :--- |
| `thuongHpTheoTuoi(tuoi)` | HS06 I.1 Bonus Độ Tuổi | `bonus_tuoi` |
| `hpMax(nv, dl)` | HS06 I.1 | `VoGia.hp_max` |
| `noiTucMax(nv, dl)` | HS06 I.1 | `VoGia.mp_max` |
| `tienDoMoiAp(ngoTinh, capSuPhu, tier, dacBiet)` | HS06 I.1 (kể cả Roll ngược Thái Huyền / Không Minh) | `tien_do` |
| `tuoiThoMax(nv, dl)` | HS06 I.1 (+ `tuoi_tho_cong_them`) | `Doi.age_max` |
| `voLuc(nv, dl)` | HS06 I.1 | `VoGia.vo_luc` |
| `chienLuc(nv, dl)` | HS06 I.5 | `VoGia.chien_luc` |
| `apMoiNam(tuoi, canhGioi)` | HS01 IV | `ap_moi_nam` |
| `tuoiBatDauLaoHoa(canhGioi, nv, dl)` | HS04 III (kể cả môn không lão hóa) | `tuoi_bat_dau_lao_hoa` |
| `canhGioiNoiCong(nv)`, `heNoiLuc(nv, dl)`, `capKhinhCong(nv)` | HS01 II.4 | |
| `soO(nv, truCot)` | HS02 II.1 | |
| `danhVongHienThi(nv)` | HS01 II.2 Danh vọng chức vị | `Doi.dv` |
| `pKyNgo(nv, dl)` | HS06 I.3 (chưa có Tuyệt Cảnh) | |

Nối các mã phái sinh vào `docChiSo` (thay chỗ `throw` ở M0-05).

**Test bắt buộc:** vector Python khớp 100%; các ví dụ số trong HS06 I.1 (Căn cốt 55, Cảnh giới 10 → 83 tuổi; Căn cốt 45, Cảnh giới 7 → 78) và HS06 I.5 (365, 405); số ô ở Ngộ tính 10 → 2, 100 → 6.

**Xong khi:** test xanh, không còn `todo` cho các hàm trên.

---

### [x] M1-05 Bộ chạy sự kiện

**Phụ thuộc:** M0-09, M1-04.
**Đọc:** 01 mục 5.3, 7; HS06 I.2; thiết kế mục 9.
**Tạo:** `game/src/luat/su_kien.ts` (phần chạy), `xem.ts` (`xemSuKien`), `game/test/su_kien_chay.test.ts`.

**Làm:**

1. `moSuKien(d, rng, dl, ma)`: gắn vai NPC (M1: tạo NPC tạm từ mẫu, lưu ở `the_gioi.npc_tam`), đặt `cho = { loai: 'su_kien', ma, bien }`.
2. `xemSuKien(d, dl)`: trả tiêu đề, mô tả đã điền mẫu, `loai_hien_thi`, và danh sách lựa chọn **đã lọc**:
   - `cong_an` không đạt → bỏ khỏi danh sách.
   - `cong` không đạt (kể cả `chi_phi`) → `bi_khoa: true`, `ly_do: "Cần ..."` từ `moTaThieu`.
   - Có `kiem_dinh` Roll / Giao chiến nhanh → `chi_so_hien` (tên chỉ số) và `do_kho` từ `nhanDoKho(p)`; không trả số %.
   - `tam_hiep` → nhãn "Giao chiến".
   - `nguy` → cờ cho lớp `--nguy`.
3. Lệnh `chon`: kiểm lựa chọn có trong danh sách hiện và không khóa; trừ `chi_phi`; chạy `kiem_dinh`:
   - Roll: tính `p` (đúng hàm đã dùng để hiện nhãn), `lanRoll`, áp `thanh_cong` / `that_bai`.
   - Giao chiến nhanh: `[Roll: Võ Lực vs N]` (HS06 I.2).
   - Tam Hiệp: chuyển `cho` sang `tam_hiep`, lưu nhánh thắng / thua để áp khi trận kết thúc (M1-11 nối).
   - Ngẫu nhiên: chọn nhánh theo `ti_le`, không dùng Phúc duyên.
4. Sau khi áp kết quả: ghi `su_kien_da_gap`; nếu có `tiep` thì mở ngay sự kiện đó; nếu không thì mở sự kiện kế trong `hang_doi_su_kien`; hết hàng đợi thì `cho = null`.
5. Mỗi kết quả sinh 1 dòng Biên Niên Sử (văn bản kết quả, `loai_hien_thi` của sự kiện) + 1 dòng tóm tắt thay đổi chỉ số (ví dụ "Căn cốt +5, Hiệp nghĩa +10") lấy từ `van_ban/he_thong.json`.

**Test bắt buộc:** dùng sự kiện mẫu trong `test/mau_du_lieu/`: Cổng ẩn không hiện; Cổng chưa đạt bị khóa, lệnh `chon` trả lỗi; nhãn độ khó khớp `pRoll`; 10.000 lần chọn Roll với `p = 0,7` cho tỷ lệ thành công $70\% \pm 1{,}5\%$; `tiep` mở đúng sự kiện; hết hàng đợi thì `cho = null`.

**Xong khi:** test xanh.

---

### [x] M1-06 Đầu thai (tạo kiếp)

**Phụ thuộc:** M1-02, M1-05.
**Đọc:** HS01 II.0, III; HS06 II.4; HS05 IV.1 (chỉ số bẩm sinh); `05_LO_HONG_GDD.md` G01, G06.
**Tạo:** `game/src/luat/dau_thai.ts`, `game/test/dau_thai.test.ts`.

**Làm:**

1. Lệnh `tao_kiep`: đặt seed, giới tính, tên (rỗng thì sinh tên ngẫu nhiên từ `npc/ten.json` - tạo file này với khoảng 30 họ, 60 tên nam, 60 tên nữ).
2. Quay gia cảnh theo tỷ lệ HS01 III.1; vùng khởi đầu theo G01 (M1: luôn Trung Nguyên).
3. Sinh 4 chỉ số gốc theo khoảng của gia cảnh (G06); Ngân lượng khởi đầu theo HS06 II.4.
4. Rút 3 Thiên phú khác nhau theo độ hiếm (G05), đặt `cho = { loai: 'chon_thien_phu', ... }`.
5. Lệnh `chon_thien_phu`: áp hiệu ứng tuổi 0; **sau đó** ghi `*_bam_sinh` (HS05 IV.1: bẩm sinh tính sau Gia cảnh và Thiên phú); đặt `can_cot_dinh`; HP, Nội tức đầy; ghi dòng Biên Niên Sử mở đầu ("Năm {nam}, bạn chào đời tại {vung} trong một gia đình {gia_canh}...").
6. Võ Lâm Thế Gia: hẹn sự kiện võ công gia truyền năm 5 tuổi (`len_lich`) và ghi kẻ thù truyền kiếp (cờ).
7. Áp ưu đãi Luân Hồi trong `uu_dai` (M1 chưa có cửa hàng: danh sách rỗng; để sẵn điểm gọi hàm).

**Test bắt buộc:** 10.000 kiếp: tỷ lệ gia cảnh đúng $\pm 1{,}5\%$; Hàn Vi luôn 0 lạng; bẩm sinh ghi sau Thiên phú (ví dụ *Đào Hoa Kiếp* cộng 25 Mị lực vào cả `mi_luc_bam_sinh`); 3 Thiên phú khác nhau.

**Xong khi:** test xanh.

---

### [x] M1-07 Vòng năm và AP

**Phụ thuộc:** M1-06.
**Đọc:** 01 mục 5.4; HS01 IV; HS01 II.8 (lão hóa); HS01 III.2 (*Tư Chất Ngu Độn*); HS06 I.1 (tuổi thọ, Trọng thương); `05_LO_HONG_GDD.md` G03.
**Tạo / sửa:** `vong_nam.ts` (bước 2, 8, 9, 11, 12, 14), `game/test/vong_nam.test.ts`.

**Làm:**

1. Bước 2: Trọng thương chưa chữa → dưỡng thương `[Roll: Căn cốt vs 50]` (dùng `pRoll`), thất bại `am_thuong += 5`, xóa cờ Trọng thương.
2. Bước 9: hiệu ứng mỗi năm của Thiên phú / Trạng thái theo `dac_biet` hoặc `hieu_ung_moi_nam`; lão hóa Căn cốt $-2$ từ `tuoiBatDauLaoHoa` (không xuống dưới 0).
3. Bước 11: `tuoi >= tuoiThoMax` → `ketThucKiep(..., 'tho_chung')` (M1-18 viết hàm; tạm đặt `ket_thuc` tối thiểu).
4. Bước 12: hồi theo G03.
5. Bước 14: AP theo `apMoiNam`, trừ `ap_bi_tru_nam_sau` rồi đặt lại 0; `viec_mien_phi_con_lai = tuoi >= 11 ? 2 : 0`.
6. Hàm `xemAp(d)` cho Dock: số AP còn, tổng AP năm, cờ "nên qua năm" khi hết AP.

**Test bắt buộc:** AP đúng bảng HS01 IV ở tuổi 10, 11, 30, 31, 51 (cảnh giới 7 và 8), 71; Căn cốt giảm từ 51 tuổi (cảnh giới < 8) và từ 61 (cảnh giới ≥ 8); *Tư Chất Ngu Độn* cộng đến 15 tuổi rồi dừng (tổng +32 / +48 khi bắt đầu từ 0); chết đúng năm `tuoi >= tuoiThoMax`.

**Xong khi:** test xanh; trên giao diện, AP đổi theo tuổi.

---

### [x] M1-08 Võ học: luyện, ô trang bị, cảnh giới

**Phụ thuộc:** M1-04.
**Đọc:** HS02 II.1, II.2 (Hệ, không gồm Tẩu hỏa); HS06 I.1 (Tiến độ); HS05 IV.2 (hoàn thiện → cấp tối đa); `mo_phong.py` hàm `luyen`, `mo_khoa_mon`.
**Tạo:** `game/src/luat/vo_hoc.ts`, `game/test/vo_hoc.test.ts`.

**Làm:**

1. `hocVoHoc(d, dl, ma, cap, hoanThien)`: thêm môn (cấp mặc định 1, HS06 I.1 "bắt đầu ở Cấp 1").
2. `luyenCong(d, dl, ma)`: 1 AP, cộng `tienDoMoiAp` (cấp sư phụ = cấp của sư phụ môn phái ở chính môn đó nếu môn do môn phái dạy, 0 nếu tự học); đủ 100% lên 1 cấp, phần dư giữ lại, tối đa 1 cấp mỗi AP; không vượt `hoan_thien / 10` và trần Khinh công theo tier.
3. Lệnh `trang_bi`: kiểm ô theo `soO`, đúng trụ cột, đúng điều kiện (Quỳ Hoa chỉ Nam...). Nội công đầu tiên luôn vào ô chủ đạo.
4. `capNhatO(d, dl)`: gọi sau mỗi thay đổi Ngộ tính / Căn cốt; mất ô thì tháo môn ở ô cuối (HS02 II.1), ghi Biên Niên Sử.
5. Dòng Biên Niên Sử khi lên cấp: "Bạn luyện {vo_hoc:ma} lên tầng thứ {cap}".

**Test bắt buộc:** số AP lên 10/10 khớp `ap_len_10` (dùng vector); lên tối đa 1 cấp mỗi AP kể cả Tiến độ 100%; bản 60% dừng ở cấp 6; Khinh công Nhập môn dừng ở 4; tháo ô khi Ngộ tính giảm.

**Xong khi:** test xanh.

---

### [x] M1-09 Hành động AP

**Phụ thuộc:** M1-03, M1-07, M1-08.
**Đọc:** HS01 II.5, IV; HS03 I; HS06 II.1 (làm thuê, tiểu thương); `05_LO_HONG_GDD.md` G07, G08.
**Tạo:** `game/src/luat/hanh_dong.ts`, `xem.ts` (`xemHanhDong`), `game/test/hanh_dong.test.ts`.

**Làm:**

1. Lệnh `hanh_dong`: tra `hanh_dong.json`, kiểm tuổi, điều kiện, AP (hoặc lượt miễn phí), rồi gọi hàm xử lý theo `xu_ly` qua một bảng `XU_LY: Record<string, (d, rng, dl, thamSo) => DongBienNien[]>`.
2. Xử lý M1: hành động trẻ em (G08), `luyen_cong` (gọi M1-08, `tham_so.vo_hoc`), `hoc_tap_hoc` (G07, cần thầy hoặc sách: M1 tạm cho phép khi gia cảnh Phú Thương / Thế Gia hoặc đang ở môn phái, theo HS03 I), `lam_thue_vat`, `tieu_thuong` (`[Roll: Ngộ tính vs 50]`, thất bại nửa tiền, HS06 II.5). Các xử lý kinh tế, môn phái, chiến đấu do M1-11 - M1-13 thêm vào cùng bảng.
3. `xemHanhDong(d, dl)`: danh sách nhóm theo Tab, mỗi dòng có tên, chi phí AP, `bi_khoa` + lý do, và nếu có Roll thì nhãn độ khó.

**Test bắt buộc:** hết AP thì lệnh trả lỗi; miễn phí không trừ AP và tối đa 2 / năm; Học Tạp học cộng đúng khoảng G07; hành động sai tuổi bị từ chối.

**Xong khi:** test xanh.

---

### [x] M1-10 Chọn sự kiện năm và kỳ ngộ

**Phụ thuộc:** M1-05, M1-07.
**Đọc:** 01 mục 5.6; HS06 I.3; HS01 II.7 (cấp kỳ ngộ); `05_LO_HONG_GDD.md` G04.
**Tạo / sửa:** `su_kien.ts` (phần chọn), `vong_nam.ts` bước 15, `game/test/su_kien_chon.test.ts`.

**Làm:**

1. `duDieuKien(sk, d, dl)`: tuổi, vùng, `dieu_kien`, `lap_lai` (đọc `su_kien_da_gap`), không phải `noi_tiep`.
2. `chonSuKienNam(d, rng, dl)`: đúng 6 bước của 01 mục 5.6, dùng `pKyNgo`.
3. `lich_hen`: sự kiện đến hạn vào hàng đợi; quá `han_nam` thì chạy nhánh hết hạn nếu sự kiện có khai báo `het_han` (ví dụ "Giải cứu Ca Nữ" quá 2 năm, HS04 II.1).

**Test bắt buộc:** với bộ sự kiện mẫu: sự kiện cố định luôn xuất hiện đúng tuổi; `mot_lan` không lặp; tỷ lệ kỳ ngộ với Phúc duyên 50 ở Trung Nguyên ≈ $2\% + 6\% = 8\%$ ($\pm 0{,}5\%$ trên 100.000 năm giả lập); tối đa 2 sự kiện cá nhân / năm.

**Xong khi:** test xanh.

---

### [x] M1-11 Chiến đấu: Giao chiến nhanh và Quyết Đấu Tam Hiệp

Task lớn, làm theo 4 phần, mỗi phần một commit.

**Phụ thuộc:** M1-05, M1-08.
**Đọc:** HS02 V (toàn bộ); HS06 I.3 (Tuyệt Cảnh), I.4; HS01 II.2 (Danh vọng thắng / thua); `mo_phong.py` hàm `sat_thuong`, `chon_ai`, `quyet_dau`, `npc_ngang`, `thua_tran_sinh_tu`, `trong_thuong` và khối GIẢ ĐỊNH (`BAO_KICH_CO_BAN`, `TIEU_HAO_MP_HIEP2`, `BIEN_THIEN_SAT_THUONG`, `TUYET_SAT`).

#### [x] M1-11a Toán chiến đấu và trận tự động

**Tạo:** `game/src/luat/tam_hiep/toan.ts`, `tu_dong.ts`, `ai.ts`; `giao_chien_nhanh.ts`; `game/test/tam_hiep_toan.test.ts`.

1. `VoGiaTran`: ảnh chụp một bên lúc vào trận (HP, Nội tức, tier, cấp võ cao nhất, uy lực, hệ, Căn cốt, Ngộ tính, Khinh công, Thần binh, bản mệnh, cờ đặc biệt). Hàm `tuNhanVat(nv, dl)` và `tuMauNpc(mau, rng)`.
2. `satThuong(...)`: đúng HS06 I.4 bốn lớp; bạo kích nền và tiêu hao Nội tức lấy từ HS06 I.4 (đã chốt G18, cùng giá trị với `mo_phong.py`) vào `hang_so.ts`.
3. `aiChonHiep1(npc, nguoiChoi, lichSu5Tran, rng)`: bảng HS02 V.1 + 3 điều chỉnh + sàn 10%.
4. `quyetDauTuDong(a, b, rng)`: chạy đủ 3 hiệp với AI hai bên, trả kết quả `{ thang, hoa, thua, hp_con }`. Logic bám `quyet_dau` của Python từng bước.
5. `giaoChienNhanh(d, rng, nguong)`: `[Roll: Võ Lực vs N]`.

**Test:** khớp vector `sat_thuong` (nếu xuất được); `tam_hiep_ti_le.json`: tỷ lệ thắng TS chênh Python ≤ 2 điểm % trên 20.000 trận mỗi cặp; mục tiêu cân bằng HS06 I.4 (bên yếu còn 20 - 31% HP sau Hiệp 2 khi ngang sức) đạt.

#### [x] M1-11b Trận tương tác (máy trạng thái)

**Tạo:** `tam_hiep/tran.ts`, `game/test/tam_hiep_tran.test.ts`; mở rộng `Lenh` với `BuocTamHiep`.

1. `TranDau` lưu trong `cho`: hai bên, `hiep` (1 / 2 / 3), `buoc` (`chon_huong`, `giua_hiep`, `chon_chieu`, `phan_dinh`, `xong`), nhật ký từng đòn, cờ cứu mạng đã dùng, chế độ (`ty_thi` / `sinh_tu` / `tru_vung`).
2. Bước người chơi:
   - Hiệp 1: `{ loai: 'huong', huong: 'tien_ha_thu' | 'an_binh' | 'than_phap' }`. AI chọn bí mật cùng lúc, giải theo ma trận HS02 V.1.
   - Giữa Hiệp 1 và 2: được dùng *Kim Sáng Dược* (HS06 III) hoặc bỏ qua (G12).
   - Hiệp 2: chọn 1 môn ngoại công / tuyệt kỹ đang trang bị (M1 chỉ khác nhau ở uy lực; cơ chế riêng của từng môn ở M3-05, M3-06).
   - Hiệp 3: theo HS02 V.3 (Áp đảo / Thất thế / Bất phân), chỉ hiện lựa chọn hợp lệ. M1 có: Tuyệt sát, Phế võ công, Thu kiếm, Hòa, Liều mạng đánh tiếp, Bỏ chạy, Đầu hàng, Nhảy vực (Tuyệt Cảnh HS06 I.3). Gieo Sinh Tử Phù, Tung ám khí, Tá Lực Đả Lực, Hút Nội Lực để M2 / M3 (ẩn khi chưa có).
3. Dùng chung hàm toán của M1-11a; **không** viết lại công thức.
4. `xemTranDau(d, dl)`: HP / Nội tức hai bên dạng phần trăm, hiệp hiện tại, lựa chọn hợp lệ kèm nhãn độ khó, nhật ký đòn đánh dạng câu văn (mẫu ở `van_ban/he_thong.json`).

**Test:** trận tương tác với lựa chọn cố định cho cùng kết quả như `quyetDauTuDong` khi ép cùng lựa chọn và cùng RNG; không lệnh sai bước nào được nhận.

#### [x] M1-11c Hậu quả trận và Quy tắc Cứu Mạng

**Tạo:** `tam_hiep/hau_qua.ts`, `game/test/tam_hiep_hau_qua.test.ts`.

1. Thắng / thua công khai cộng / trừ Danh vọng theo HS01 II.2 (theo hạng đối thủ).
2. Thua bị áp đảo trong trận `sinh_tu`: NPC Tuyệt sát theo bản mệnh (HS02 V.3); không Tuyệt sát thì Trọng thương; bị Tuyệt sát thì người chơi chọn lối thoát hoặc tử trận.
3. Nhảy vực: đúng 3 mức Phúc duyên HS06 I.3; mức $\ge 60$ đặt cờ cộng $+50\%$ $P_{KyNgo}$ cho lượt chọn sự kiện kế tiếp; mức $< 30$ chết với lý do `khong_coc_day_vuc` (kết cục #17).
4. Khung `kichHoatCuuMang(tran, d, dl)`: thứ tự ưu tiên HS02 V.4, tối đa 1 lần / trận; M1 chưa có hiệu ứng nào đủ điều kiện, nhưng khung và test với hiệu ứng giả phải có.
5. Kết thúc trận: áp nhánh `thanh_cong` / `that_bai` của sự kiện đã mở trận (M1-05), ghi thống kê đời (trận thắng, NPC đã giết).

**Test:** mỗi nhánh HS02 V.3; nhảy vực 3 mức; cứu mạng chỉ 1 lần / trận.

#### [x] M1-11d Giao diện Tam Hiệp

**Đọc:** `giao_dien/mau.html` khung "Thẻ quyết định - Tam Hiệp"; thiết kế mục 7 (`.vk-tam-hiep`, `.vk-hiep`).
**Tạo:** `game/src/giao_dien/BangTamHiep.tsx`.

1. Chép HTML mẫu sang JSX; đổ dữ liệu từ `xemTranDau`.
2. Bộ đếm Hiệp 1 / 2 / 3 có `aria-current="step"`; thanh HP đối phương; lựa chọn nguy hiểm có `--nguy`.
3. Nhật ký đòn đánh là dòng trong thẻ, khi trận xong mới ghi vào Biên Niên Sử (1 dòng tóm tắt + kết quả).

**Xong khi (cả M1-11):** test xanh; chơi thử 1 trận Tam Hiệp trên giao diện đủ 3 hiệp, kiểm bằng mắt đạt.

---

### [x] M1-12 Môn phái

**Phụ thuộc:** M1-01, M1-11.
**Đọc:** HS04 I.1 (toàn bộ); HS02 I (điều kiện 4 phái); HS06 II.1 (trợ cấp, Sai Phái), II.2 (sinh hoạt phí trong môn phái); HS01 II.6; `mo_phong.py` hàm `thang_cap`; `05_LO_HONG_GDD.md` G17, G19.
**Tạo:** `game/src/luat/mon_phai.ts`, `game/test/mon_phai.test.ts`.

**Làm:**

1. `giaNhap(d, dl, ma, bac)`: kiểm `dieu_kien_gia_nhap` (Thanh danh, không phải Hiệp nghĩa thật, HS02 I lưu ý), đặt `mon_phai`, dạy võ học Bậc tương ứng, ghi `lich_su_mon_phai`.
2. Hành động `nhiem_vu_su_mon`: $+50$ Cống hiến (HS04 I.1).
3. Hành động `sai_phai`: Bậc 2 - 4, thù lao và `[Giao chiến nhanh: 30 / 40 / 50]` theo bậc, thất bại chỉ mất thù lao.
4. Thăng cấp: đủ tuổi + Cống hiến theo bảng → mở sự kiện thử thách của bậc (dữ liệu sự kiện `thang_bac_2` ... `thang_bac_4`, viết ở M1-15); thắng $+100$ Cống hiến; thất bại 2 lần liên tiếp $-50$ Cống hiến (HS04 I.1). Bậc 5 (Chưởng môn) M1 chỉ qua sự kiện kế vị HS04 II.3 (M1-15), đủ luật Chưởng môn ở M2-08, M2-11.
5. Tự động mỗi năm (bước 3 của vòng năm): trợ cấp theo bậc; Ngoại môn quá 18 tuổi chưa lên Nội môn bị mời xuống núi (Tạp dịch được ở lại, HS04 I.1).
6. Tàng Kinh Các: đổi Cống hiến lấy võ học của môn phái ở bậc mình đã đạt (giá theo G19).
7. Rời phái (`tu_roi`, `truc_xuat`): Cống hiến về 0, mất Danh vọng chức vị (HS01 II.6, II.2).
8. Lãng khách: không có môn phái; sinh hoạt phí theo bảng đầy đủ.

**Test bắt buộc:** nữ không vào được Thiếu Lâm; đủ Cống hiến mà thiếu tuổi thì chưa mở thử thách; 1 AP sư môn mỗi năm từ 12 tuổi đạt 1.500 Cống hiến khoảng 35 - 36 tuổi (HS04 I.1); quá 18 tuổi Ngoại môn bị mời xuống núi.

**Xong khi:** test xanh.

---

### [x] M1-13 Kinh tế cơ bản và trị thương

**Phụ thuộc:** M1-09, M1-11, M1-12.
**Đọc:** HS06 II.1 (làm thuê, tiểu thương, áp tiêu, săn tiền thưởng), II.2 (sinh hoạt phí, phòng trọ), II.3 (Nợ), II.4; HS06 III (thuốc trị thương); HS06 I.1 ("Chữa kịp thời").
**Tạo:** `game/src/luat/kinh_te.ts`, `game/test/kinh_te.test.ts`; `game/src/giao_dien/` chưa cần.

**Làm:**

1. `thu(d, so, nguon)`: nếu có Nợ, chủ nợ thu trước 50% (HS06 II.3). Mọi khoản thu đi qua hàm này.
2. `chi(d, so, chuNo)`: đủ tiền thì trừ, thiếu thì phần thiếu thành Nợ của `chuNo`.
3. Vòng năm bước 3 - 5: thu nhập gia đình (≤ 15 tuổi), sinh hoạt phí (≥ 16, trần 50 khi ở môn phái), lãi Nợ 20%, quá hạn 3 năm hẹn sự kiện đòi nợ (`[Giao chiến nhanh: 40]`), 5 năm báo quan (Thanh danh $-100$).
4. Hành động: `ap_tieu` (Cổng Căn cốt ≥ 50, `[Ngẫu nhiên: 35%]` gặp cướp, đền gấp đôi khi thua), `san_tien_thuong` (Cổng võ Thượng thừa; chọn hạng Yếu / Ngang / Mạnh; mở Tam Hiệp sinh tử với NPC tạm theo hạng; thắng Hiệp nghĩa $+40$), `nghi_tro` (20 lạng, hồi đầy).
5. Chợ (miễn phí, 0 AP theo HS01 IV): mua đan dược `ban_o: "cho"`; lệnh `mua`.
6. Lệnh `dung_vat_pham`: áp hiệu ứng; luật Kháng Thuốc HS06 III (lần 2 còn 50%, lần 3 vô tác dụng) cho đan dược tăng vĩnh viễn.
7. Trọng thương: dùng thuốc trị nội thương trong năm thì xóa cờ (chữa kịp thời, HS06 I.1).

**Test bắt buộc:** thiếu tiền thành Nợ đúng chủ; lãi 20%; thu khi có Nợ chỉ nhận 50%; Kháng Thuốc 100 / 50 / 0; áp tiêu thua đền gấp đôi và thiếu thì ghi Nợ; sinh hoạt phí theo Danh vọng.

**Xong khi:** test xanh.

---

### [x] M1-14 Nội dung 0 - 15 tuổi (Trung Nguyên)

**Phụ thuộc:** M1-05, M1-06, M1-10, M1-12.
**Đọc:** HS03 (toàn bộ); Phụ lục A file này; `ho_so_08_luoc_do_du_lieu.md`.
**Tạo:** `du_lieu/su_kien/0_5/*.json`, `6_10/*.json`, `11_15/*.json`.

**Làm:**

1. **Chuyển nguyên văn** mọi sự kiện HS03 dùng được ở Trung Nguyên sang JSON: Thôi Nôi, Mùa Đông Khắc Nghiệt, Đêm Mưa Máu, Bát Cơm Chó, Quái Nhân Trong Hang Núi, Quỳ Trước Sơn Môn (Thiếu Lâm / Võ Đang), Tỷ Thí Nhập Môn (Hoa Sơn), Chén Cơm Thừa (Cái Bang), Lễ Thành Đinh tuổi 16 (HS03 V, dạng `chuyen_giai_doan`).
   - Giữ đúng số và ký hiệu. Nhánh "thử lại năm sau, ngưỡng giảm 5" dùng cờ đếm + `dieu_kien`.
   - Nhánh dẫn sang môn phái chưa có trong M1 (Tà phái, Hải Sa Bang, Ẩn Thế): giữ lựa chọn nhưng kết quả M1 là "Lãng khách" kèm cờ `muon_vao_ta_phai` để M2-04 / M3-02 nối tiếp. Ghi chú `"m2_noi_tiep": true` trong JSON.
2. **Viết mới** để đạt tối thiểu **35 sự kiện 0 - 15 tuổi**: 0 - 5 tuổi ≥ 8, 6 - 10 tuổi ≥ 12 (trong đó ≥ 3 kỳ ngộ), 11 - 15 tuổi ≥ 15 (trong đó ≥ 4 khảo nghiệm / bái sư). Theo Phụ lục A.
3. Mỗi gia cảnh có ≥ 2 sự kiện riêng (`dieu_kien` gia cảnh).

**Xong khi:** kiểm tra dữ liệu xanh; bot (M1-19 có thể chưa có: tạm chạy 200 kiếp bằng một test vòng `qua_nam` + chọn lựa chọn đầu tiên hợp lệ) đi qua 0 - 16 tuổi không lỗi; mỗi sự kiện mới xuất hiện ít nhất 1 lần trong 2.000 kiếp giả lập (test đếm, báo sự kiện "chết" không bao giờ gặp).

---

### [x] M1-15 Nội dung 16+ tuổi

**Phụ thuộc:** M1-14, M1-13.
**Đọc:** HS04 II.1 - II.3, III; HS04 I.1 (thử thách thăng cấp); Phụ lục A.
**Tạo:** `du_lieu/su_kien/16_30/*.json`, `31_50/*.json`, `51_plus/*.json`, `mon_phai/*.json`.

**Làm:**

1. Chuyển nguyên văn: Nhiệm Vụ Xuất Sơn Đầu Tiên (kèm nối tiếp "Giải cứu Ca Nữ" và biến thể Lãng khách không có sư môn, REVIEW mục 8), Cám Dỗ Tại Tàng Kinh Các (kèm "Bẫy Sư Thúc"; nhánh [Ám] [B] M1 tạm tính Hiệp nghĩa công khai nhỏ + cờ, M2-06 đổi sang [Ám] thật - ghi `"m2_noi_tiep": true`), Đại Biến Cố Kế Vị Chưởng Môn (người thắng thành Chưởng môn Bậc 5, luật Chưởng môn đầy đủ ở M2).
2. Thử thách thăng cấp Bậc 2 - 4 cho mỗi phái (HS04 I.1 cột "Sự kiện Thăng cấp"): ít nhất 1 sự kiện mỗi bậc dùng chung cho 4 phái, có biến thể tên theo phái bằng mẫu văn bản.
3. Viết mới để đạt tối thiểu **25 sự kiện 16+**: 16 - 30 ≥ 10, 31 - 50 ≥ 8, 51+ ≥ 7 (sự kiện tuổi già, bệnh tật, truyền dạy, hồi tưởng). Mỗi nhóm có biến thể cho Lãng khách.

**Xong khi:** kiểm tra dữ liệu xanh; tổng sự kiện M1 ≥ 60; test đếm sự kiện "chết" như M1-14 đạt.

---

### [x] M1-16 Giao diện màn hình chính, sự kiện, đầu thai

**Phụ thuộc:** M0-10, M1-05, M1-06, M1-09.
**Đọc:** HS07 I.1; thiết kế mục 4 - 7, 9, 10; `mau.html` khung "Màn hình chính" và các ô `.vk-lua-chon`, `.vk-huy-hieu[data-do-kho]`.
**Tạo:** `ThanhTrangThai.tsx` (đủ), `BienNien.tsx` (đủ), `TheQuyetDinh.tsx`, `ManDauThai.tsx`, `ChonThienPhu.tsx`.

**Làm:**

1. Header: tên, danh hiệu (G31), tuổi, mô tả tuổi thọ (G02), vùng, môn phái và bậc, thanh HP / Nội tức, ngân lượng. Chạm tên mở Sheet Bát Tự (M1-17); chạm vùng tạm hiện Popover tên vùng (bản đồ ở M3-01).
2. Biên Niên Sử: tiêu đề năm dính (`__nam`), dòng `__muc[data-loai]`, cuộn lại được tới Tuổi 0. Tên võ học trong câu là `.vk-lien-ket` mở `.vk-popover` (tier, cấp, mô tả 1 dòng).
3. Thẻ quyết định: tiêu đề, mô tả, 2 - 4 `.vk-lua-chon` theo `xemSuKien`; khóa có `aria-disabled` và dòng "Cần ..."; Roll có tên chỉ số + huy hiệu độ khó; `role="dialog"`, `aria-modal`, focus vào lựa chọn đầu tiên khi mở.
4. Màn đầu thai (toàn khung, thiết kế 6.2): chọn Nam / Nữ, ô tên (để trống = ngẫu nhiên), nút "Đầu thai"; sau đó màn chọn 1 trong 3 Thiên phú dùng `.vk-nhan[data-pham]`.
5. Dock: ngọc AP `data-sang`, nút "+1 Tuổi" `data-nhac="true"` khi hết AP; 5 Tab (Tab 5 `aria-disabled="true"` tới M2-14).

**Xong khi:** chơi từ đầu thai tới 16 tuổi chỉ bằng chạm; kiểm tra bằng mắt đạt; không lỗi console.

---

### [ ] M1-17 Giao diện 4 Tab và Bát Tự

**Phụ thuộc:** M1-16, M1-12, M1-13.
**Đọc:** HS07 I.2; thiết kế mục 6.2, 7; `mau.html` khung "Sheet nội dung Tab".
**Tạo:** `Sheet.tsx`, `TabTuLuyen.tsx`, `TabVoHoc.tsx`, `TabNhanMach.tsx`, `TabMonPhai.tsx`, `SheetBatTu.tsx`; hàm `xem.ts` tương ứng.

**Làm:**

1. Tab 1 Tu Luyện: `xemHanhDong` thành `.vk-danh-sach`, mỗi dòng có `.vk-chi-phi--ap`, dòng khóa `disabled` kèm lý do. Hành động cần chọn tham số (luyện môn nào, hạng truy nã nào) mở danh sách con trong Sheet.
2. Tab 2 Võ Học & Hành Trang: `.vk-o-luoi` theo 4 trụ cột và số ô thật; chạm ô để đổi môn (lệnh `trang_bi`); danh sách đan dược trong hành trang, nút "Dùng"; chợ (mua) ở cuối Tab.
3. Tab 3 Nhân Mạch: M1 chỉ có sư phụ và NPC đã gặp trong sự kiện (tên, vai, 1 dòng mô tả). Gia phả để M3-08.
4. Tab 4 Môn Phái: bậc, Cống hiến / mốc bậc kế (`.vk-thanh--tien-do`), Tàng Kinh Các (đổi Cống hiến). Khóa khi chưa có môn phái (đúng HS07 I.2: mở ngay khi gia nhập).
5. Sheet Bát Tự: mọi chỉ số `hien_thi = hien`; Phúc duyên chỉ hiện mô tả (G02); Thiên phú / Trạng thái / Nhãn bằng `.vk-nhan`.
6. Mỗi Sheet có `role="tabpanel"`, đóng bằng nút và phím Esc, về đúng chỗ cũ.

**Xong khi:** mọi hành động M1 làm được từ giao diện; kiểm tra bằng mắt đạt ở cả 4 Tab.

---

### [ ] M1-18 Cái chết, Kết cục, Văn bia, Điểm Luân Hồi

**Phụ thuộc:** M1-11, M1-07.
**Đọc:** HS07 II, IV (kết cục #13, #15, #17, #18); HS05 IV.2 trường hợp 2 (tuyệt tự, M1 mọi kiếp đều tuyệt tự); `mau.html` khung "Văn bia"; `05_LO_HONG_GDD.md` G09.
**Tạo:** `game/src/luat/ket_cuc.ts`, `luan_hoi.ts`; `du_lieu/ket_cuc.json` (đủ 18 kết cục, M1 bật 4 + mặc định), `du_lieu/van_ban/van_bia.json`; `game/src/giao_dien/VanBia.tsx`; test `ket_cuc.test.ts`.

**Làm:**

1. `ketThucKiep(d, rng, dl, lyDo)` đúng 01 mục 5.5. Mọi chỗ gây chết đã viết (M1-07, M1-11) chuyển sang gọi hàm này.
2. `xetKetCuc(d, dl)`: duyệt `ket_cuc.json` theo `thu_tu`, mỗi kết cục có `dieu_kien` là mã hàm trong `ket_cuc.ts` (`KIEM_TRA: Record<string, (d, dl) => boolean>`). Kết cục chưa làm có hàm trả `false` và chú thích task phụ trách. Không có gì đạt → kết cục mặc định G09.
3. `diemLuanHoi(d, ketCuc)`: đúng công thức HS07 II.1; +50 an ủi cho #18.
4. `vanBia(d, dl)`: 4 đoạn (xuất thân, võ học, ân oán, vẫn lạc) ghép từ `van_bia.json` theo các mốc trong `thong_ke` và Biên Niên Sử; năm sinh dạng Can Chi (Giáp Tý...) tính từ `nam_the_gioi` (G20).
5. Giao diện Văn bia: toàn khung `data-chu-de="tang"`, 4 đoạn, tên kết cục + huy hiệu tier, Điểm Luân Hồi; nút "Đầu thai kiếp mới" → lệnh `tiep_tuc` → màn đầu thai. Điểm Luân Hồi cộng vào `vkgh.meta`.

**Test bắt buộc:** chết ở 5 tuổi → #18 và +50; chết ở 22 tuổi có Thiên phú Đỏ → #15; nhảy vực Phúc duyên < 30 → #17; công thức điểm khớp tính tay 1 ví dụ.

**Xong khi:** test xanh; chơi tới chết thấy Văn bia đúng mẫu, kiểm tra bằng mắt đạt.

---

### [ ] M1-19 Bot, đối chiếu thống kê, sửa cân bằng nhỏ

**Phụ thuộc:** M1-18 (và mọi task M1 trước).
**Đọc:** 01 mục 10.3, 10.6; `mo_phong/BAO_CAO.md` mục vòng mới nhất (lấy số tuổi mất trung vị, tỷ lệ tử trận theo lối chơi).
**Tạo:** `game/cong_cu/bot.ts`, `game/cong_cu/mo_phong.ts`; script `"bot": "tsx cong_cu/bot.ts"`, `"mo-phong": "tsx cong_cu/mo_phong.ts"`.

**Làm:**

1. `bot.ts`: chạy N kiếp (mặc định 1.000) với chính sách ngẫu nhiên hợp lệ; mỗi lệnh chạy bất biến; in số kiếp, số lỗi, phân bố tuổi chết, phân bố kết cục, sự kiện chưa từng gặp.
2. `mo_phong.ts`: bot "lối chơi mẫu" bám chính sách Chính phái của `mo_phong.py` (`LOI_CHOI`), in tuổi mất trung vị, % tử trận, cấp võ học lúc 40 / 60 tuổi.
3. So với `mo_phong/BAO_CAO.md`. Chênh lớn (> 5 tuổi trung vị, > 5 điểm % tử trận): tìm nguyên nhân là **lỗi port** hay **khác biệt có chủ đích** (ví dụ sự kiện kịch bản thêm rủi ro). Lỗi port thì sửa. Khác biệt có chủ đích thì ghi vào `REVIEW.md` "Còn mở", không tự đổi số.

**Xong khi:** `npm run bot` 1.000 kiếp 0 lỗi; bảng so sánh ghi vào `ke_hoach/bao_cao_m1.md` (tạo mới).

---

### [ ] M1-20 Phát hành v0.1 "Nhất Kiếp"

**Phụ thuộc:** mọi task M1.

**Làm:**

1. `npm run kiem-tra`, `npm run bot`, `npm run build` đều xanh.
2. Chơi tay trọn 3 kiếp khác gia cảnh trên khung 390 × 844 và 1 lần trên màn desktop; ghi mọi lỗi vào `REVIEW.md` rồi sửa hết lỗi chặn.
3. Hỏi chủ dự án nơi đăng (GitHub Pages / máy chủ riêng) **trước khi** đăng bất cứ gì; nhận đồng ý mới đăng.
4. Gắn tag git `v0.1.0` (hỏi trước khi push tag).
5. Cập nhật đoạn trạng thái đầu `REVIEW.md`: "v0.1 phát hành ngày ..., phạm vi ...".

**Xong khi:** bản build chạy được từ địa chỉ đã đăng, chơi được một kiếp trọn vẹn.

---

## PHỤ LỤC A - CÁCH VIẾT MỘT SỰ KIỆN

Dùng cho M1-14, M1-15, M2-17, M3-13.
Chép vào HS08 ở M0-04.

### A.1. Quy trình

1. Đọc GDD của giai đoạn tuổi và vùng; chọn mô-típ Kim Dung phù hợp (HS03 và HS04 là giọng văn mẫu).
2. Tạo file `du_lieu/su_kien/<nhom>/<ma>.json`, `ma` trùng tên file.
3. Viết `mo_ta` 2 - 5 câu, ngôi "bạn", tình huống có xung đột rõ.
4. Viết 2 - 4 lựa chọn, mỗi lựa chọn là một **lối sống khác nhau** (chính trực / khôn ngoan / tàn nhẫn / liều lĩnh), không có lựa chọn trội tuyệt đối.
5. Mọi lựa chọn có kiểm định phải có nhánh thất bại **có hệ quả và mở hướng khác** (HS06 I.2, mẫu tốt: "Đại Hôn Đẫm Máu" [B] ở HS05 II.2).
6. Chạy `npm run kiem-tra-du-lieu`.

### A.2. Định mức hiệu ứng (G10)

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
Kiểm tra ngữ nghĩa (01 mục 7.4 luật 11) chặn kỳ ngộ vượt cấp.

### A.3. Danh sách tự kiểm trước khi nộp

- [ ] Đúng ký hiệu chuẩn, mọi Roll / Tam Hiệp có nhánh thất bại có hệ quả.
- [ ] Điều kiện do NPC phán xét dùng `thanh_danh`; điều kiện nội tâm dùng `hiep_nghia` (HS01 II.2).
- [ ] Việc ác làm lén có `am` (từ M2).
- [ ] Có biến thể cho người chơi nữ khi câu văn phụ thuộc giới tính (`{gt:..|..}`).
- [ ] Không nhắc tên võ học / vật phẩm trực tiếp, dùng `{vo_hoc:ma}`, `{vat_pham:ma}`.
- [ ] Nhân vật dưới 16 tuổi: lựa chọn tàn nhẫn chỉ mô tả ở mức hệ quả (REVIEW mục 6 đề xuất rating).
- [ ] Không em dash, không chữ Hán, mỗi câu kết thúc bằng dấu câu.
