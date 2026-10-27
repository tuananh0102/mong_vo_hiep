# 01 - KIẾN TRÚC VÀ QUY ƯỚC

File này là luật kỹ thuật chung.
Task trong các file cột mốc dẫn chiếu tới đây theo mục (ví dụ "01 mục 5.3").
Không tự ý đổi những gì đã chốt ở đây; muốn đổi thì sửa file này trước, trong một commit riêng, ghi lý do ở mục 13.

## 1. Công nghệ đã chốt

| Phần | Chọn | Lý do |
| :--- | :--- | :--- |
| Ngôn ngữ | **TypeScript 5**, `strict: true`, `noUncheckedIndexedAccess: true` | Kiểu chặt bắt lỗi sớm, agent yếu được trình biên dịch dẫn đường. |
| Môi trường | **Node 22 LTS** trở lên, **npm** | Phổ biến nhất. Máy hiện có Node 25, dùng được. |
| Đóng gói | **Vite** | Nhanh, cấu hình ít, nạp JSON sẵn. |
| Giao diện | **React 19** (hàm + hooks), không thư viện state, không router | Agent biết rõ nhất. Một màn hình nhiều lớp (HTML thiết kế mục 1) không cần router. |
| CSS | Dùng thẳng `giao_dien/tokens.css` và `giao_dien/thanh_phan.css` | Một nguồn sự thật cho giao diện. Không Tailwind, không CSS-in-JS. |
| Kiểm tra dữ liệu | **zod** | Một chỗ khai báo vừa sinh kiểu TypeScript vừa kiểm tra JSON. |
| Test | **Vitest** | Chạy chung cấu hình Vite. Đây là ngoại lệ có chủ đích với quy tắc 13 của `AGENTS.md`: game TypeScript nhiều module cần test runner. Ghi vào `AGENTS.md` ở task M0-01. |
| Chạy script TS | **tsx** | Chạy `cong_cu/*.ts` bằng Node, không build. |
| Lint | **ESLint** + `typescript-eslint` | Chặn `Math.random`, chặn import React trong `luat/`. |
| Font | `@fontsource/noto-serif` (có bộ chữ tiếng Việt) | Chạy offline, khớp `--font-than` trong `tokens.css`. |
| PWA | `vite-plugin-pwa` (Cột mốc 3) | Cài được lên màn hình chính, chơi offline. |

Không thêm thư viện ngoài bảng trên nếu task không ghi rõ.
Cần thêm thì ghi lý do ở mục 13 trước.

## 2. Cây thư mục

```
mong_vo_hiep/
├── ho_so_01 ... ho_so_07            GDD (nguồn sự thật luật và số)
├── ho_so_08_luoc_do_du_lieu.md       Mô tả lược đồ dữ liệu (tạo ở M0-04)
├── du_lieu/                          NỘI DUNG GAME (JSON), không có code
│   ├── chi_so.json                   danh sách mã chỉ số, nhãn hiển thị (theo HS01 II.8)
│   ├── vung.json                     5 khu vực
│   ├── gia_canh.json                 4 nhóm gia cảnh + trường hợp đặc biệt
│   ├── thien_phu.json  trang_thai.json  nhan.json
│   ├── mon_phai/<ma_mon_phai>.json   1 file / môn phái (điều kiện, bậc, võ học truyền)
│   ├── vo_hoc/<ma_mon_phai|tu_do>.json  võ học, nhóm theo nguồn
│   ├── vat_pham/dan_duoc.json  doc_duoc.json  binh_khi.json  ky_tran.json  di_thu.json
│   ├── hanh_dong.json                hành động tốn AP và miễn phí
│   ├── su_kien/<nhom>/<ma>.json      1 file / 1 sự kiện (xem 01 mục 7)
│   ├── dai_su_kien/<ma>.json         5 đại sự kiện, mỗi file 3 hồi
│   ├── npc/ten.json  npc/mau.json    tên họ, mẫu NPC
│   ├── ket_cuc.json  luan_hoi.json   18 kết cục, 5 gói Luân Hồi
│   ├── van_ban/he_thong.json         câu Biên Niên Sử chung do luật sinh ra
│   ├── van_ban/van_bia.json          mảnh ghép văn bia
│   └── ten_hien_thi.json             ánh xạ tên nguyên tác → tên hiển thị (mặc định rỗng)
├── game/                             ỨNG DỤNG
│   ├── package.json  tsconfig.json  vite.config.ts  eslint.config.js  index.html
│   ├── src/
│   │   ├── luat/                     LUẬT GAME THUẦN, không React, không DOM
│   │   │   ├── gia_dinh.ts           mọi hằng số GIẢ ĐỊNH (khối có nhãn, mã G..)
│   │   │   ├── hang_so.ts            hằng số lấy thẳng từ GDD, mỗi dòng trích mục
│   │   │   ├── kieu.ts               kiểu trạng thái game (mục 4)
│   │   │   ├── rng.ts                RNG có seed (mục 6)
│   │   │   ├── chi_so.ts             đọc / ghi / kẹp chỉ số theo mã
│   │   │   ├── cong_thuc.ts          HS06 I.1, I.5, HS01 IV: công thức phái sinh
│   │   │   ├── kiem_dinh.ts          HS06 I.2: Roll, Cổng, nhãn độ khó
│   │   │   ├── dieu_kien.ts          đánh giá DSL điều kiện (mục 7.2)
│   │   │   ├── hieu_ung.ts           áp DSL hiệu ứng (mục 7.3)
│   │   │   ├── van_ban.ts            điền mẫu văn bản (mục 7.5)
│   │   │   ├── su_kien.ts            chọn và chạy sự kiện (HS06 I.3)
│   │   │   ├── hanh_dong.ts          hành động AP
│   │   │   ├── vo_hoc.ts             luyện, ô trang bị, cảnh giới (HS02 II, HS06 I.1)
│   │   │   ├── tam_hiep.ts           Quyết Đấu Tam Hiệp (HS02 V, HS06 I.4)
│   │   │   ├── giao_chien_nhanh.ts
│   │   │   ├── kinh_te.ts            HS06 II
│   │   │   ├── mon_phai.ts           HS04 I.1
│   │   │   ├── am.ts                 [Ám] và bại lộ (HS01 II.3)
│   │   │   ├── the_gioi/             NPC, bảng xếp hạng, đại sự kiện (M2)
│   │   │   ├── ket_cuc.ts  luan_hoi.ts  truyen_thua.ts
│   │   │   ├── vong_nam.ts           pipeline "+1 Tuổi" (mục 5.4)
│   │   │   ├── dong_co.ts            apDung(): cửa vào duy nhất (mục 5)
│   │   │   ├── xem.ts                hàm chuẩn bị dữ liệu hiển thị cho giao diện
│   │   │   ├── bat_bien.ts           kiểm tra bất biến trạng thái (mục 10.4)
│   │   │   └── luu.ts                tuần tự hóa, phiên bản, chuyển đổi (mục 11)
│   │   ├── du_lieu/
│   │   │   ├── luoc_do.ts            lược đồ zod cho mọi file JSON
│   │   │   ├── nap.ts                nạp + kiểm tra + đóng băng dữ liệu
│   │   │   └── kiem_tra_ngu_nghia.ts kiểm tra chéo (id tồn tại, nhánh thất bại...)
│   │   ├── giao_dien/                React, chỉ hiển thị (mục 12)
│   │   └── main.tsx
│   ├── test/                         *.test.ts, vector/ (sinh từ Python)
│   └── cong_cu/                      script: kiem_tra_du_lieu.ts, bot.ts, mo_phong.ts
├── giao_dien/                        hệ thống thiết kế (đã có)
├── mo_phong/                         mô phỏng cân bằng Python (đã có) + xuat_vector.py
└── ke_hoach/                         bộ kế hoạch này
```

Quy tắc đặt file:

- Một module luật một chủ đề.
  File vượt khoảng 400 dòng thì tách theo chủ đề con (ví dụ `tam_hiep/hiep1.ts`, `tam_hiep/hiep2.ts`).
- Test đặt ở `game/test/<ten_module>.test.ts`, trùng tên module.

## 3. Tầng và chiều phụ thuộc

```
du_lieu/*.json ──nạp, kiểm tra──▶ src/du_lieu ──DuLieu (đóng băng)──▶ src/luat ◀── src/giao_dien
                                                                        │              (chỉ gọi apDung + xem.ts)
                                                                        └── trạng thái mới + dòng Biên Niên Sử
```

- `luat/` chỉ import `luat/` và kiểu từ `du_lieu/luoc_do.ts`.
- `giao_dien/` chỉ import `luat/dong_co.ts`, `luat/xem.ts`, `luat/kieu.ts`, `luat/luu.ts`. Không import hàm luật lẻ.
- Giao diện **không bao giờ** tính luật: không tự tính xác suất, không tự cộng chỉ số, không tự xét điều kiện. Cần hiển thị gì thì thêm một hàm vào `xem.ts`.

## 4. Trạng thái game

Toàn bộ trạng thái là **một object JSON thuần** (không class, không Map, không Date, không hàm), để lưu và so sánh được.
Tên trường dữ liệu dùng `snake_case` không dấu, đúng cột "Mã dữ liệu" ở HS01 II.8 (quy tắc 5 `AGENTS.md`).
Tên hàm và biến cục bộ dùng `camelCase`, tên kiểu dùng `PascalCase`.

### 4.1. Phác thảo kiểu (đặt ở `luat/kieu.ts`, M0-05 viết đầy đủ)

```ts
export interface TrangThaiGame {
  phien_ban: number;            // phiên bản định dạng lưu (mục 11)
  seed: number;                 // seed của kiếp hiện tại
  rng: [number, number, number, number]; // trạng thái RNG (mục 6)
  nam_the_gioi: number;         // lịch thế giới; Hoa Sơn ở năm tận cùng 0 (HS01 V)
  nhan_vat: NhanVat;
  the_gioi: TheGioi;            // NPC, xếp hạng, đại sự kiện, môn phái (M1 gần rỗng)
  cho: Cho | null;              // quyết định đang chờ người chơi (mục 5.3)
  hang_doi_su_kien: string[];   // sự kiện năm nay còn chờ mở
  lich_hen: LichHen[];          // sự kiện hẹn năm sau ("trong 2 năm tới", "sau 5 năm")
  bien_nien: DongBienNien[];    // toàn bộ Biên Niên Sử kiếp này
  ket_thuc: KetThuc | null;     // khác null khi nhân vật đã chết
  dong_toc: DongToc;            // các đời đã qua (M3), Tàng Kinh Các gia tộc
}

export interface NhanVat {
  ten: string;
  gioi_tinh: 'nam' | 'nu';
  tuoi: number;
  gia_canh: MaGiaCanh;
  vung: MaVung;
  // Thiên phú (HS01 II.1, II.8): hiện tại, đỉnh, bẩm sinh
  can_cot: number; can_cot_dinh: number; ngo_tinh: number; phuc_duyen: number; mi_luc: number;
  can_cot_bam_sinh: number; ngo_tinh_bam_sinh: number; mi_luc_bam_sinh: number;
  // Xã hội
  ngan_luong: number;
  no: Record<string, KhoanNo>;  // theo chủ nợ (HS06 II.3)
  hiep_nghia: number; thanh_danh: number;
  danh_vong: number;            // phần cá nhân; Danh vọng hiển thị = phần này + chức vị (hàm danhVongHienThi)
  // Sinh tồn và chiến đấu (giá trị "max" là hàm phái sinh, không lưu)
  hp: number; noi_tuc: number;
  noi_tuc_cong_them: number;    // "Điểm Kỳ Ngộ" trong công thức MP_max (HS06 I.1)
  am_thuong: number; khang_doc: number; khang_han: number;
  tuoi_tho_cong_them: number;   // đan dược, kỳ ngộ kéo dài tuổi thọ
  trong_thuong: boolean;        // bị Trọng thương năm nay, chưa chữa
  // Võ học
  vo_hoc: Record<MaVoHoc, VoHocDaHoc>;   // { cap, tien_do, hoan_thien }
  trang_bi: TrangBiVoHoc;                 // ô theo 4 trụ cột (HS02 II.1)
  binh_khi: MaVatPham | null; giap: MaVatPham | null;
  hanh_trang: Record<MaVatPham, number>;
  // Tạp học (HS01 II.5)
  y_thuat: number; doc_thuat: number; ky_mon: number; cam: number; co: number; thi: number; hoa: number;
  // Phân loại (HS01 II.7)
  thien_phu: MaThienPhu[];
  trang_thai: Record<MaTrangThai, { tu_tuoi: number; den_tuoi?: number }>;
  nhan: MaNhan[];
  // Tổ chức
  mon_phai: ThanhVienMonPhai | null;      // { ma, bac, cong_hien, tu_tuoi, ... }
  lich_su_mon_phai: LichSuMonPhai[];      // để đếm phản môn (kết cục #16)
  // Năm hiện tại
  ap_con_lai: number; viec_mien_phi_con_lai: number; ap_bi_tru_nam_sau: number;
  // Cốt truyện
  co: Record<string, boolean | number | string>;  // cờ sự kiện
  su_kien_da_gap: Record<string, number>;          // mã sự kiện → số lần
  viec_am_chua_lo: ViecAm[];                       // M2
  hao_cam: Record<MaNpc, number>;                  // M2
  thong_ke: ThongKeDoi;  // đếm cho Văn bia và Kết cục: trận thắng, NPC đã giết, mốc đời...
}
```

Quy tắc trạng thái:

- Chỉ số phái sinh (`hp_max`, `noi_tuc_max`, `vo_luc`, `chien_luc`, `tuoi_tho_max`, `canh_gioi_noi_cong`, `he_noi_luc`, `cap_khinh_cong`, Danh vọng hiển thị) **không lưu**, luôn tính bằng hàm trong `cong_thuc.ts` khi cần.
- Mọi ghi chỉ số đi qua `chi_so.ts` (hàm `congChiSo`, `datChiSo`), để kẹp đúng thang và trần cứng 150 (HS01 II.8, HS06 I.1) ở **một chỗ**.
- Thêm trường mới vào `NhanVat`: phải có trong HS01 II.8 trước (quy tắc 5 `AGENTS.md`), trừ trường kỹ thuật (cờ, đếm, lịch).
- Thêm trường mới vào trạng thái: tăng `phien_ban` và viết hàm chuyển đổi (mục 11).

## 5. Động cơ: một cửa vào duy nhất

### 5.1. Hàm chính

```ts
// luat/dong_co.ts
export function apDung(s: TrangThaiGame, lenh: Lenh, dl: DuLieu): KetQuaLenh;

export interface KetQuaLenh {
  trang_thai: TrangThaiGame;      // trạng thái mới (object mới, không đụng object cũ)
  dong_moi: DongBienNien[];       // các dòng Biên Niên Sử sinh ra bởi lệnh này
  loi: string | null;             // khóa lỗi nếu lệnh không hợp lệ; khi đó trang_thai === s
}
```

Cách viết bên trong:

1. `const d = structuredClone(s)` một lần ở đầu `apDung`.
2. Tạo `rng` từ `d.rng`. Mọi hàm luật bên trong nhận `(d, rng, dl, ...)` và **được phép sửa `d` tại chỗ**.
3. Cuối `apDung`: ghi trạng thái RNG trở lại `d.rng`, chạy `kiemTraBatBien(d)` (chỉ khi dev / test), trả `d`.

Nhờ vậy bên ngoài `apDung` là hàm thuần (quy tắc 10 `AGENTS.md`), còn bên trong code đơn giản, không phải copy từng tầng.
Lệnh không hợp lệ (hết AP, điều kiện không đạt, đang chờ quyết định khác) trả `loi` và **không ném lỗi**.
Chỉ ném lỗi khi là lỗi lập trình (dữ liệu sai lược đồ, trạng thái vi phạm bất biến).

### 5.2. Lệnh

```ts
export type Lenh =
  | { loai: 'tao_kiep'; seed: number; gioi_tinh: 'nam' | 'nu'; ten: string; uu_dai: MaGoiLuanHoi[] }
  | { loai: 'chon_thien_phu'; ma: MaThienPhu }          // 1 trong 3 lúc Tuổi 0
  | { loai: 'hanh_dong'; ma: MaHanhDong; tham_so?: Record<string, string | number> }
  | { loai: 'qua_nam' }                                  // nút "+1 Tuổi"
  | { loai: 'chon'; ma_lua_chon: string }                // trả lời Cho loại 'su_kien'
  | { loai: 'tam_hiep'; buoc: BuocTamHiep }              // trả lời Cho loại 'tam_hiep'
  | { loai: 'trang_bi'; o: MaO; ma: MaVoHoc | MaVatPham | null }
  | { loai: 'dung_vat_pham'; ma: MaVatPham }
  | { loai: 'mua'; ma: MaVatPham; so_luong: number }
  | { loai: 'tiep_tuc' };                                // đóng màn chuyển giai đoạn (Tuổi 16, Văn bia...)
```

Thêm loại lệnh mới: thêm vào union này, thêm nhánh `switch` trong `apDung`, thêm test.
`switch` phải có `default: return assertKhongConLoai(lenh)` để TypeScript bắt thiếu nhánh.

### 5.3. Quyết định đang chờ (`cho`)

Khi `cho !== null`, chỉ lệnh trả lời đúng loại được chấp nhận (cùng các lệnh 0 AP như `trang_bi`, `dung_vat_pham` nếu `cho` cho phép).

```ts
export type Cho =
  | { loai: 'chon_thien_phu'; lua_chon: [MaThienPhu, MaThienPhu, MaThienPhu] }
  | { loai: 'su_kien'; ma: string; bien: Record<string, string> }  // bien: NPC gắn vai trong sự kiện
  | { loai: 'tam_hiep'; tran: TranDau }
  | { loai: 'chuyen_giai_doan'; ma: 'thanh_dinh' | 'van_bia' | 'chon_nguoi_ke_thua' | ... };
```

### 5.4. Pipeline "+1 Tuổi" (`vong_nam.ts`)

Thứ tự **cố định**, mỗi bước một hàm, mỗi hàm ghi mục GDD nguồn.
Bước nào thuộc cột mốc sau thì để hàm rỗng có chú thích `// M2-06` cho tới khi task đó làm.

**A. Khép lại năm cũ (tuổi T)**

1. Gộp việc [Ám] vặt của năm thành 1 việc (HS01 II.3). *(M2-06)*
2. Trọng thương chưa chữa trong năm: dưỡng thương `[Roll: Căn cốt vs 50]`, thất bại `am_thuong += 5` (HS06 I.1).
3. Thu nhập tự động: gia đình đến 15 tuổi (HS06 II.4), trợ cấp môn phái, bổng lộc, lợi tức sản nghiệp đã quản lý (HS06 II.1, II.5). Có Nợ thì chủ nợ thu trước 50% (HS06 II.3).
4. Chi tự động: sinh hoạt phí từ 16 tuổi (HS06 II.2), Hộ viện, bảo trì môn phái. Thiếu thì ghi Nợ.
5. Nợ: lãi 20%, tăng số năm quá hạn, hẹn sự kiện đòi nợ (HS06 II.3).
6. Tẩu hỏa nhập ma, Ma công phản phệ (HS06 I.4). *(M2-05)*
7. Bại lộ hàng năm, Đại Vạch Trần (HS01 II.3). *(M2-06, M2-07)*

**B. Sang năm mới (tuổi T + 1)**

8. `tuoi += 1`, `nam_the_gioi += 1`.
9. Hiệu ứng theo năm của Thiên phú, Trạng thái (ví dụ *Tư Chất Ngu Độn* HS01 III.2, *Tâm Ma Đứt Ruột* HS05 II.2), lão hóa Căn cốt (HS01 II.8, HS04 III), cập nhật `can_cot_dinh`.
10. Danh vọng ẩn cư / bế quan $-5$ (HS01 II.2). *(M2)*
11. Chết vì hết tuổi thọ: `tuoi >= tuoiThoMax(nv)` (HS06 I.1, khớp `mo_phong.py`). Chết thì chuyển sang mục 5.5 và dừng pipeline.
12. Hồi HP và Nội tức đầu năm (lỗ hổng G03).
13. Thế giới chạy 1 năm: NPC, xếp hạng, lịch Đại sự kiện, Hoa Sơn (HS01 V, HS05 I). *(M2)*
14. Đặt AP năm mới `= apMoiNam(tuoi, canh_gioi) - ap_bi_tru_nam_sau` (tối thiểu 0), `viec_mien_phi_con_lai = 2` (HS01 IV).
15. Chọn sự kiện năm mới (mục 5.6), đưa vào `hang_doi_su_kien`, mở sự kiện đầu tiên thành `cho`.

Mỗi bước sinh dòng Biên Niên Sử của nó (nếu có gì xảy ra).

### 5.5. Cái chết

Mọi nguồn gây chết (hết thọ, tử trận, Tẩu hỏa, đan dược, sự kiện) đều gọi **một** hàm `ketThucKiep(d, rng, dl, lyDo)` ở `ket_cuc.ts`:

1. Đặt `d.ket_thuc = { tuoi, ly_do, ... }`.
2. Xét kết cục (HS07 IV), tính Điểm Luân Hồi (HS07 II).
3. Đặt `cho = { loai: 'chuyen_giai_doan', ma: 'van_bia' }`.

Sau khi chết, chỉ còn lệnh `tiep_tuc` hợp lệ.

### 5.6. Chọn sự kiện năm (HS06 I.3)

1. Sự kiện cố định đến tuổi (`loai: 'co_dinh'`) và sự kiện hẹn trong `lich_hen` đến hạn: luôn vào hàng đợi.
2. Hồi Đại sự kiện năm nay (M2): vào hàng đợi.
3. Quay $R$; nếu $R < P_{KyNgo}$ (HS06 I.3) thì chọn 1 kỳ ngộ đủ điều kiện theo trọng số. Không có kỳ ngộ nào đủ điều kiện thì bỏ qua bước này.
4. Nếu hàng đợi chưa có sự kiện cá nhân nào (bước 1 và 3): chọn 1 sự kiện thường đủ điều kiện theo trọng số.
5. Giới hạn: tối đa 2 sự kiện cá nhân mỗi năm (HS01 IV "1 - 2 đoạn"); xác suất có sự kiện thứ 2 là lỗ hổng G04.
6. Không có gì: 1 dòng "năm bình lặng" lấy ngẫu nhiên từ `van_ban/he_thong.json`.

"Đủ điều kiện" = khớp tuổi, vùng, `dieu_kien` (Cổng ẩn cấp sự kiện, HS06 I.2), quy tắc lặp lại.
Chọn theo trọng số dùng **một** hàm `chonTheoTrongSo(rng, ds)` ở `rng.ts`.

## 6. RNG

- Thuật toán **sfc32**, trạng thái 4 số nguyên 32-bit, khởi tạo từ seed bằng **splitmix32** (đều vài dòng, không thư viện).
- API ở `rng.ts`:
  - `taoRng(trangThai)`, `layTrangThai(rng)`, `rngTuSeed(seed)`.
  - `rng.so()` trả số thực $[0, 1)$; `rng.nguyen(a, b)` trả số nguyên $[a, b]$ gồm cả hai đầu; `rng.trung(p)` trả `true` với xác suất `p`.
  - `chonTheoTrongSo(rng, [{gia_tri, trong_so}])`.
- Mọi hàm luật cần ngẫu nhiên nhận `rng` làm tham số (quy tắc 11 `AGENTS.md`).
- Thế giới NPC dùng **luồng RNG riêng** tách từ seed (`seed ^ 0x9E3779B9`) và lưu riêng trong `the_gioi.rng`, để thêm một lựa chọn của người chơi không làm đổi toàn bộ thế giới.
- `Math.random` bị lint chặn trong `game/src/luat/`.

## 7. DSL sự kiện (nội dung dạng dữ liệu)

Đây là phần agent viết nội dung dùng nhiều nhất.
Lược đồ zod ở `du_lieu/luoc_do.ts` là sự thật; mục này là mô tả, `ho_so_08_luoc_do_du_lieu.md` là bản cho người viết nội dung.

### 7.1. Một sự kiện

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
| `loai_hien_thi` | `thuong` / `giao-chien` / `tinh-duyen` / `ky-ngo` / `dao-gia` | Đổ vào `data-loai` của Biên Niên Sử (thiết kế mục 4). |
| `tuoi` | `[min, max]` | Gồm cả hai đầu. |
| `vung` | danh sách mã vùng hoặc `null` (mọi vùng) | |
| `dieu_kien` | DieuKien hoặc `null` | Điều kiện kích hoạt = Cổng ẩn cấp sự kiện (HS06 I.2). |
| `trong_so` | số $\ge 0$ | Dùng khi quay ngẫu nhiên. |
| `lap_lai` | `mot_lan` / `moi_nam` / `{ "cach_nam": n }` / `{ "toi_da": n }` | |
| `vai` | tùy chọn: `{ "<ten_vai>": MauNpc }` | NPC xuất hiện trong sự kiện, gắn vào `cho.bien` (M2). |
| `mo_ta` | mẫu văn bản | Mục 7.5. |
| `lua_chon` | 2 đến 4 phần tử | HS07 I.1. Sự kiện chỉ có 1 hướng thì phải là dòng Biên Niên Sử, không phải Modal (thiết kế 6.2). |

Trường của một lựa chọn:

| Trường | Ký hiệu GDD | Ý nghĩa |
| :--- | :--- | :--- |
| `cong` | `[Cổng]` | Không đạt: nút xám, ghi điều kiện còn thiếu. |
| `cong_an` | `[Cổng ẩn]` | Không đạt: không hiện. |
| `kiem_dinh` | `[Roll]`, `[Roll ngược]`, `[Roll: X vs X địch]`, `[Giao chiến nhanh]`, `[Tam Hiệp]`, `[Ngẫu nhiên]` | Xem bảng dưới. |
| `nguy` | | `true` nếu có thể chết hoặc mất lớn (thêm `.vk-lua-chon--nguy`). |
| `ket_qua` | | Dùng khi **không** có `kiem_dinh`, hoặc `kiem_dinh` là `ngau_nhien` (khi đó bỏ trống, dùng `nhanh`). |
| `thanh_cong`, `that_bai` | | Bắt buộc khi có `kiem_dinh` khác `ngau_nhien` (quy tắc 7 `AGENTS.md`). |
| `chi_phi` | | `{ "ap": 1, "ngan_luong": 50 }`; tự sinh Cổng tương ứng. |

`kiem_dinh`:

```json
{ "loai": "roll", "chi_so": "can_cot", "nguong": 25 }
{ "loai": "roll_nguoc", "chi_so": "ngo_tinh", "nguong": 40 }
{ "loai": "roll", "va": [ { "chi_so": "ngo_tinh", "nguong": 50 }, { "chi_so": "mi_luc", "nguong": 50 } ] }
{ "loai": "roll", "hoac": [ { "chi_so": "ngo_tinh", "nguong": 75 }, { "chi_so": "ky_mon", "nguong": 50 } ] }
{ "loai": "roll_doi_khang", "chi_so": "ngo_tinh", "doi_thu": "nhi_su_thuc" }
{ "loai": "giao_chien_nhanh", "nguong": 40 }
{ "loai": "tam_hiep", "doi_thu": "dai_su_huynh", "che_do": "sinh_tu" }
{ "loai": "ngau_nhien", "nhanh": [ { "ti_le": 50, "ket_qua": { ... } }, { "ti_le": 50, "ket_qua": { ... } } ] }
```

- `va` dùng hiệu thấp nhất, `hoac` dùng hiệu cao nhất (HS06 I.2 quy tắc bổ sung).
- `cap_khinh_cong` trong Roll tự nhân 10 (HS01 II.4).
- `tam_hiep.che_do`: `ty_thi` (không có Tuyệt sát, HS02 V.3) hoặc `sinh_tu`. Thêm `"thang_khi": "tru_vung"` cho trận chỉ cần trụ đủ 3 hiệp (HS04 II.2).
- `ngau_nhien`: tổng `ti_le` phải bằng 100; không chịu Phúc duyên (HS06 I.2).

### 7.2. Điều kiện (`DieuKien`)

```json
{ "so": "can_cot", "op": ">=", "gt": 50 }
{ "la": "gioi_tinh", "trong": ["nu"] }
{ "co": "gap_quai_nhan" }
{ "thien_phu": "tu_chat_ngu_don" }   { "trang_thai": "bach_doc_bat_xam" }   { "nhan": "nhan_nhin_tham_sau" }
{ "vo_hoc": "doc_co_cuu_kiem", "cap_toi_thieu": 1 }
{ "vat_pham": "khan_lua_mat_do" }
{ "va": [ ... ] }   { "hoac": [ ... ] }   { "khong": { ... } }
```

- `so`: mã chỉ số trong `du_lieu/chi_so.json` (theo HS01 II.8) cộng các mã phái sinh và kỹ thuật: `tuoi`, `vo_luc`, `chien_luc`, `canh_gioi_noi_cong`, `cap_khinh_cong`, `bac_mon_phai`, `cong_hien`, `danh_vong` (luôn là Danh vọng hiển thị).
- `op`: `>=`, `<=`, `>`, `<`, `==`, `!=`.
- `la`: trường liệt kê: `gioi_tinh`, `gia_canh`, `vung`, `mon_phai`, `he_noi_luc`, `chinh_ta` (phe của môn phái).
- Hiệp nghĩa: viết `hiep_nghia` (bản chất thật) hoặc `thanh_danh` đúng quy tắc HS01 II.2 (NPC phán xét → `thanh_danh`).
- Thêm loại điều kiện mới: sửa lược đồ zod, `dieu_kien.ts`, `kiem_tra_ngu_nghia.ts`, `xem.ts` (chữ "Cần ..."), thêm test, cập nhật HS08.

### 7.3. Hiệu ứng (`HieuUng`)

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
| `chet` | `{ "chet": "an_doc" }` | Gọi `ketThucKiep`. |
| `dong` | `{ "dong": { "van_ban": "...", "loai_hien_thi": "ky-ngo" } }` | Thêm 1 dòng Biên Niên Sử riêng. |

Thêm loại hiệu ứng mới: sửa lược đồ zod, `hieu_ung.ts`, `kiem_tra_ngu_nghia.ts`, thêm test, cập nhật HS08 và bảng này.

### 7.4. Kiểm tra ngữ nghĩa bắt buộc (`kiem_tra_ngu_nghia.ts`)

`npm run kiem-tra-du-lieu` báo lỗi (không phải cảnh báo) khi:

1. File không khớp lược đồ zod.
2. `ma` trùng, hoặc `ma` khác tên file.
3. Tham chiếu tới mã không tồn tại (võ học, vật phẩm, trạng thái, sự kiện `tiep` / `len_lich`, môn phái, vùng, chỉ số).
4. Lựa chọn có `kiem_dinh` (trừ `ngau_nhien`) mà thiếu `thanh_cong` hoặc `that_bai`.
5. Nhánh `that_bai` không có hiệu ứng nào (quy tắc "nhánh thất bại không được là không có gì", HS06 I.2).
6. `ngau_nhien` có tổng `ti_le` khác 100.
7. Sự kiện có ít hơn 2 hoặc nhiều hơn 4 lựa chọn.
8. `cong` trên `hiep_nghia` / `thanh_danh`.
9. Văn bản chứa dấu gạch dài (U+2014) hoặc chữ Hán (U+4E00 - U+9FFF).
10. Mẫu văn bản dùng biến không tồn tại (mục 7.5).
11. `loai = ky_ngo` thiếu `cap_ky_ngo`, hoặc phần thưởng vượt cấp (ví dụ cấp B mà cộng chỉ số > 10, HS01 II.7).
12. Thiếu `nguon`.

### 7.5. Mẫu văn bản

- Biến trong ngoặc nhọn: `{ten}`, `{tuoi}`, `{vung}`, `{mon_phai}`, `{su_phu}`, `{vai:truong_lao}` (tên NPC gắn vai), `{cha_me}`.
- Theo giới tính người chơi: `{gt:sư huynh|sư tỷ}` (vế trước cho nam, vế sau cho nữ).
- Theo giới tính NPC gắn vai: `{gt_vai:truong_lao:lão|bà}`.
- Hàm điền mẫu ở `van_ban.ts`, kiểm tra biến ở `kiem_tra_ngu_nghia.ts`.
- Ngôi thứ hai "bạn" ở Biên Niên Sử; "ngươi" chỉ trong lời thoại NPC (thiết kế mục 5).

### 7.6. Tên hiển thị và bản quyền

- Mọi võ học, vật phẩm, môn phái, NPC mẫu có trường `ten` (theo GDD) và `nguon_ten`: `nguyen_tac` / `phong_tac` (HS02 quy ước nguồn).
- Giao diện luôn lấy tên qua hàm `tenHienThi(ma)` ở `xem.ts`, hàm này tra `du_lieu/ten_hien_thi.json` trước.
- Khi chủ dự án quyết định đổi sang tên phóng tác (REVIEW mục 6), chỉ cần điền file ánh xạ này, không sửa kịch bản.
  Văn bản kịch bản nhắc tên võ học / vật phẩm phải dùng biến `{vo_hoc:ma}`, `{vat_pham:ma}` thay vì gõ thẳng tên, để ánh xạ có tác dụng.

## 8. Dữ liệu khác

Mỗi loại có lược đồ zod riêng ở `luoc_do.ts`, mô tả ở HS08.
Trường chung: `ma`, `ten`, `nguon`.
Số lấy đúng GDD; các lỗ hổng cũ (G01 - G33) nay đã nằm trong GDD, xem bảng đầu `05_LO_HONG_GDD.md`.

| File | Trường chính |
| :--- | :--- |
| `vo_hoc/*.json` | `tru_cot` (`noi_cong` / `ngoai_cong` / `khinh_cong` / `tuyet_ky`), `tier` (1 Nhập môn, 2 Thượng thừa, 3 Trấn phái, 4 SSS), `he_noi_luc` (chỉ nội công: `duong` / `am` / `hoa`), `loai_binh_khi` (`quyen_chuong`, `chi_trao`, `kiem`, `dao`, `bong`, `am_khi`), `uy_luc_lech` ($-0.1$ đến $+0.1$, HS06 I.4), `dieu_kien_hoc`, `dac_biet` (mã cơ chế riêng, ví dụ `ma_cong`, `thai_huyen`, `quy_hoa`), `mon_phai` |
| `mon_phai/*.json` | `phe` (`chinh` / `ta` / `trung_lap`), `vung`, `quy_mo`, `dieu_kien_gia_nhap` (DieuKien), `vo_hoc_theo_bac` (bậc → danh sách võ học được dạy), `cap_su_phu_theo_bac`, `khao_nghiem` (mã sự kiện), `dac_quyen` |
| `vat_pham/*.json` | `loai`, `gia`, `ban_o` (`cho` / `hac_thi` / `khong_ban`), `dung_trong_tran`, `hieu_ung` (danh sách HieuUng hoặc mã cơ chế), `khang_thuoc` (HS06 III) |
| `hanh_dong.json` | `ap`, `mien_phi`, `tuoi`, `dieu_kien`, `xu_ly` (mã hàm luật trong `hanh_dong.ts`), `nhom_tab` |
| `thien_phu.json` | `do_hiem` (1 - 4), `hieu_ung_tuoi_0`, `hieu_ung_moi_nam`, `dac_biet` |
| `ket_cuc.json` | `thu_tu`, `nhom`, `tier`, `diem`, `dieu_kien` (mã hàm xét ở `ket_cuc.ts`), `mo_ta` |

Luật có cơ chế riêng (Thái Huyền Kinh, Quỳ Hoa, Lục Mạch...) không viết bằng DSL: dữ liệu chỉ ghi `dac_biet: "<ma>"`, code luật có một `switch` theo mã đó.
Đây là ranh giới "code chỉ chứa luật, nội dung nằm ở JSON" (quy tắc 9 `AGENTS.md`).

## 9. Quy ước code

1. Mỗi công thức một hàm, chú thích dòng đầu trích mục GDD: `// HS06 I.1 Tuổi thọ tối đa`.
2. Không số ma thuật: số từ GDD vào `hang_so.ts` (kèm mục), số giả định mới (lỗ hổng từ G34 trở đi) vào `gia_dinh.ts` (kèm mã G..).
3. Hàm luật nhận `(d, rng, dl, ...)` theo thứ tự đó; hàm không cần ngẫu nhiên thì không nhận `rng`.
4. Không dùng `any`. Không dùng `as` ép kiểu trừ khi đọc JSON đã qua zod.
5. Không ném lỗi cho thao tác người chơi sai: trả khóa lỗi.
6. Không dùng class cho trạng thái. Có thể dùng class nội bộ cho RNG.
7. Xác suất luôn qua `kepXacSuat(p)` (5% - 95%, quy tắc 8 `AGENTS.md`), trừ `ngau_nhien` thuần.
8. Làm tròn: chỉ số nguyên dùng `Math.floor` ở đúng chỗ GDD ghi $\lfloor \rfloor$; còn lại giữ số thực trong tính toán, làm tròn khi ghi vào chỉ số nguyên bằng `Math.round`. Ghi rõ ở chú thích.
9. Văn bản tiếng Việt có dấu, không em dash.
10. Tên tệp, hàm, biến tiếng Việt không dấu, giống phong cách `mo_phong.py` và `giao_dien/`.

## 10. Kiểm thử

### 10.1. Test đơn vị (Vitest)

Mỗi hàm công thức, mỗi nhánh luật có ít nhất 1 test.
Test viết số mong đợi tính tay từ GDD, có chú thích mục GDD.

### 10.2. Vector đối chiếu Python (M0-07)

`mo_phong/mo_phong.py` là bản luật đã được cân bằng qua 18 vòng.
Script `mo_phong/xuat_vector.py` gọi chính các hàm Python (`p_roll`, `bonus_tuoi`, `ap_moi_nam`, `tien_do`, `ap_len_10`, `khac_che`, `VoGia.hp_max`, `VoGia.mp_max`, `VoGia.vo_luc`, `VoGia.chien_luc`, `Doi.age_max`, `tuoi_bat_dau_lao_hoa`...) trên một lưới đầu vào và ghi `game/test/vector/*.json`.
Test TypeScript đọc các file đó và đòi khớp **tuyệt đối** (sai số $10^{-9}$).
Khi GDD đổi công thức (quy tắc 3 `AGENTS.md`), sửa Python trước, chạy lại `xuat_vector.py`, rồi sửa TypeScript cho xanh.

### 10.3. Đối chiếu thống kê

Với phần có ngẫu nhiên (Tam Hiệp, cả đời mô phỏng), không khớp từng số được vì RNG khác.
So **tỷ lệ**: chạy 4.000 trận / 2.000 đời ở TypeScript, so với bảng trong `mo_phong/KET_QUA.md` (sinh lại bằng Python nếu cần), chênh tối đa 3 điểm phần trăm.
Script `game/cong_cu/mo_phong.ts` (M1-19, M2-18).

### 10.4. Bất biến

`luat/bat_bien.ts` kiểm sau mỗi lệnh (khi chạy test và dev):

- Mọi chỉ số trong thang (HS01 II.8), trần cứng 150.
- `ngan_luong >= 0`, Nợ $\ge 0$.
- `0 <= hp <= hp_max`, `0 <= noi_tuc <= noi_tuc_max`.
- Cấp võ học trong $[1, 10]$ và không vượt trần hoàn thiện; Khinh công không vượt trần tier.
- `ap_con_lai >= 0`.
- `ket_thuc !== null` thì `cho` là màn chuyển giai đoạn.
- `cho.loai = su_kien` thì sự kiện tồn tại trong dữ liệu.

### 10.5. Chơi lại (replay)

Lưu `seed` + danh sách lệnh.
Test: chạy lại danh sách lệnh từ đầu phải ra trạng thái **giống hệt** (so `JSON.stringify`).
Dùng cho cả báo lỗi: người chơi gửi file lưu là tái hiện được.

### 10.6. Bot chơi tự động

`game/cong_cu/bot.ts` chơi trọn kiếp với chính sách ngẫu nhiên hợp lệ (chọn lệnh ngẫu nhiên trong các lệnh `xem.ts` báo là bấm được).
Chạy 1.000 seed, đòi: không ném lỗi, không vi phạm bất biến, mọi kiếp đều kết thúc.
Đây là bài "E2E" chính của luật; giao diện thì kiểm bằng mắt (README mục 5).

## 11. Lưu game

- `localStorage` khóa `vkgh.kiep` (kiếp đang chơi: trạng thái + danh sách lệnh) và `vkgh.meta` (Điểm Luân Hồi, gói đã mua, kết cục đã mở - sống qua mọi kiếp).
- Lưu tự động sau mỗi lệnh thành công.
- Mỗi bản lưu có `phien_ban`.
  `luu.ts` có mảng `CHUYEN_DOI[n]` đổi từ phiên bản `n` lên `n + 1`.
  Mỗi lần đổi định dạng trạng thái: tăng phiên bản, viết hàm chuyển đổi, thêm test chuyển một bản lưu mẫu cũ (để ở `game/test/luu_mau/`).
- Có nút xuất / nhập bản lưu dạng chuỗi (để chuyển máy và báo lỗi).

## 12. Giao diện

- Dùng nguyên lớp CSS `vk-*` của `giao_dien/thanh_phan.css`; component React đặt tên theo khối: `ManHinh`, `ThanhTrangThai`, `BienNien`, `TheQuyetDinh`, `BangTamHiep`, `BanDieuKhien`, `Sheet`, `DanhSach`, `HuyHieu`...
- Muốn biết HTML chuẩn của một khối: copy từ `giao_dien/mau.html`, chuyển sang JSX, giữ nguyên lớp và thuộc tính `data-*`, `aria-*`.
- Thiếu thành phần: theo quy trình mục 11 của `giao_dien/HE_THONG_THIET_KE.md` (sửa `thanh_phan.css`, thêm vào `mau.html`, cập nhật tài liệu). Không viết CSS riêng trong component.
- Luồng dữ liệu: một `useReducer` ở gốc, giữ `TrangThaiGame`; mọi nút gọi `phat(lenh)`, reducer gọi `apDung`. Component chỉ đọc kết quả của hàm `xem.ts`.
- Hiệu ứng chuyển động chỉ dùng token `--tg-*`, tôn trọng `prefers-reduced-motion`.

## 13. Nhật ký quyết định kỹ thuật

| Ngày | Quyết định | Lý do |
| :--- | :--- | :--- |
| 2026-10-27 | Web PWA bằng TypeScript + React + Vite. | HS07 nhắm Mobile/Web; một mã nguồn chạy mọi nơi; giao diện tham chiếu đã là HTML + CSS thuần. |
| 2026-10-27 | Luật là `apDung(trạng thái, lệnh, dữ liệu)`; trạng thái là JSON thuần. | Hàm thuần theo quy tắc 10, chơi lại và lưu game miễn phí. |
| 2026-10-27 | Sự kiện viết bằng DSL JSON, cơ chế đặc biệt viết bằng mã `dac_biet`. | Quy tắc 9; agent viết nội dung không phải động vào code. |
| 2026-10-27 | `mo_phong.py` là chuẩn đối chiếu số; TypeScript phải khớp vector. | Bộ số đã cân bằng 18 vòng, tránh lệch khi port. |
| 2026-10-27 | NPC là "một đời mô phỏng" chạy bằng chính luật người chơi, không chia 2 lớp. | REVIEW mục 7, `mo_phong/BAO_CAO.md` mục 15. |
