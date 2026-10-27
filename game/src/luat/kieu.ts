// 01 mục 4.1: kiểu trạng thái game. Trạng thái là object JSON thuần (không class, Map, Date, hàm).
// Tên trường đúng cột "Mã dữ liệu" ở HS01 II.8 (quy tắc 5 AGENTS.md).
import type { TrangThaiRng } from './rng'

export type MaGiaCanh = string
export type MaVung = string
export type MaVoHoc = string
export type MaVatPham = string
export type MaThienPhu = string
export type MaTrangThai = string
export type MaNhan = string
export type MaNpc = string
export type MaMonPhai = string
export type MaGoiLuanHoi = string
export type MaHanhDong = string
export type MaO = 'noi_cong' | 'khinh_cong' | 'ngoai_cong' | 'tuyet_ky' | 'binh_khi' | 'giap'
export type HuongTamHiep = 'tien_ha_thu' | 'an_binh' | 'than_phap'
export type LuaChonPhanDinh =
  | 'tuyet_sat'
  | 'phe_vo_cong'
  | 'thu_kiem'
  | 'hoa'
  | 'lieu_mang'
  | 'bo_chay'
  | 'dau_hang'
  | 'nhay_vuc'
/** HS02 V: một bước người chơi trong Quyết Đấu Tam Hiệp (máy trạng thái ở luat/tam_hiep/tran.ts). */
export type BuocTamHiep =
  | { loai: 'huong'; huong: HuongTamHiep }
  | { loai: 'vat_pham'; ma: 'kim_sang_duoc' }
  | { loai: 'bo_qua' }
  | { loai: 'chieu'; ma: string }
  | { loai: 'phan_dinh'; ma: LuaChonPhanDinh }

/** 01 mục 5.2: Lệnh gửi vào động cơ apDung. */
export type Lenh =
  | { loai: 'tao_kiep'; seed: number; gioi_tinh: 'nam' | 'nu'; ten: string; uu_dai: MaGoiLuanHoi[] }
  | { loai: 'chon_thien_phu'; ma: MaThienPhu }
  | { loai: 'hanh_dong'; ma: MaHanhDong; tham_so?: Record<string, string | number> }
  | { loai: 'qua_nam' }
  | { loai: 'chon'; ma_lua_chon: string }
  | { loai: 'tam_hiep'; buoc: BuocTamHiep }
  | { loai: 'trang_bi'; o: MaO; ma: string | null }
  | { loai: 'dung_vat_pham'; ma: MaVatPham }
  | { loai: 'mua'; ma: MaVatPham; so_luong: number }
  | { loai: 'tiep_tuc' }

/** HS06 II.3: nợ theo từng chủ nợ, lãi 20%/năm. */
export interface KhoanNo {
  goc: number
  nam_vay: number
}

/** HS02 II: cấp 1 - 10, tiến độ luyện, độ hoàn thiện (bản thiếu < 100). */
export interface VoHocDaHoc {
  cap: number
  tien_do: number
  hoan_thien: number
}

/** HS02 II.1: ô trang bị theo 4 trụ cột. */
export interface TrangBiVoHoc {
  noi_cong: MaVoHoc | null
  ngoai_cong: MaVoHoc[]
  khinh_cong: MaVoHoc | null
  tuyet_ky: MaVoHoc[]
}

/** HS04 I.1: thành viên môn phái. */
export interface ThanhVienMonPhai {
  ma: MaMonPhai
  bac: number
  cong_hien: number
  tu_tuoi: number
}

/** Kết cục #16 đếm số lần phản môn. */
export interface LichSuMonPhai {
  ma: MaMonPhai
  tu_tuoi: number
  den_tuoi: number
  cach_roi: 'tu_roi' | 'truc_xuat' | 'phan_mon'
}

/** HS01 II.3: việc [Ám] chưa bại lộ (M2). */
export interface ViecAm {
  muc: 'vat' | 'lon'
  tuoi: number
  nan_nhan: MaNpc | null
}

/** Đếm cho Văn bia và Kết cục. */
export interface ThongKeDoi {
  tran_thang: number
  tran_thua: number
  npc_da_giet: number
  [moc: string]: number
}

export interface NhanVat {
  ten: string
  gioi_tinh: 'nam' | 'nu'
  tuoi: number
  gia_canh: MaGiaCanh
  vung: MaVung
  // Thiên phú (HS01 II.1, II.8): hiện tại, đỉnh, bẩm sinh
  can_cot: number
  can_cot_dinh: number
  ngo_tinh: number
  phuc_duyen: number
  mi_luc: number
  can_cot_bam_sinh: number
  ngo_tinh_bam_sinh: number
  mi_luc_bam_sinh: number
  // Xã hội
  ngan_luong: number
  no: Record<string, KhoanNo> // theo chủ nợ (HS06 II.3)
  hiep_nghia: number
  thanh_danh: number
  danh_vong: number // phần cá nhân; hiển thị = phần này + chức vị
  // Sinh tồn và chiến đấu (giá trị "max" là phái sinh, không lưu)
  hp: number
  noi_tuc: number
  noi_tuc_cong_them: number // "Điểm Kỳ Ngộ" trong MP_max (HS06 I.1)
  am_thuong: number
  khang_doc: number
  khang_han: number
  tuoi_tho_cong_them: number
  trong_thuong: boolean // HS06 I.1
  // Võ học
  vo_hoc: Record<MaVoHoc, VoHocDaHoc>
  trang_bi: TrangBiVoHoc
  binh_khi: MaVatPham | null
  giap: MaVatPham | null
  hanh_trang: Record<MaVatPham, number>
  // Tạp học (HS01 II.5)
  y_thuat: number
  doc_thuat: number
  ky_mon: number
  cam: number
  co: number
  thi: number
  hoa: number
  // Phân loại (HS01 II.7)
  thien_phu: MaThienPhu[]
  trang_thai: Record<MaTrangThai, { tu_tuoi: number; den_tuoi?: number }>
  nhan: MaNhan[]
  // Tổ chức
  mon_phai: ThanhVienMonPhai | null
  lich_su_mon_phai: LichSuMonPhai[]
  // Năm hiện tại (HS01 IV)
  ap_con_lai: number
  viec_mien_phi_con_lai: number
  ap_bi_tru_nam_sau: number
  // Cốt truyện
  co_su_kien: Record<string, boolean | number | string> // cờ sự kiện (DSL `dat_co`)
  su_kien_da_gap: Record<string, number>
  viec_am_chua_lo: ViecAm[]
  hao_cam: Record<MaNpc, number>
  thong_ke: ThongKeDoi
}

/** Thế giới: M1 gần rỗng, M2 thêm NPC, xếp hạng, đại sự kiện. */
export interface TheGioi {
  npc: Record<MaNpc, unknown>
}

/** 5.3: quyết định đang chờ người chơi. `TranDau` và các giai đoạn chuyển viết ở task sau. */
export type Cho =
  | { loai: 'chon_thien_phu'; lua_chon: [MaThienPhu, MaThienPhu, MaThienPhu] }
  | { loai: 'su_kien'; ma: string; bien: Record<string, string> }
  | { loai: 'tam_hiep'; tran: unknown }
  | { loai: 'chuyen_giai_doan'; ma: string }

/** Sự kiện hẹn (DSL `len_lich`). */
export interface LichHen {
  su_kien: string
  nam_mo: number // tuổi mở sớm nhất
  han_nam: number // tuổi quá hạn thì bỏ
}

/** Dòng Biên Niên Sử (HS07). */
export interface DongBienNien {
  tuoi: number
  van_ban: string
  loai_hien_thi: 'thuong' | 'giao-chien' | 'tinh-duyen' | 'ky-ngo' | 'dao-gia'
}

export interface KetThuc {
  nguyen_nhan: string
  tuoi: number
}

/** Các đời đã qua (M3). */
export interface DongToc {
  doi_truoc: unknown[]
}

export interface TrangThaiGame {
  phien_ban: number // phiên bản định dạng lưu (mục 11)
  seed: number // seed của kiếp hiện tại
  rng: TrangThaiRng // mục 6
  nam_the_gioi: number // lịch thế giới (HS01 V)
  nhan_vat: NhanVat
  the_gioi: TheGioi
  cho: Cho | null
  hang_doi_su_kien: string[]
  lich_hen: LichHen[]
  bien_nien: DongBienNien[]
  ket_thuc: KetThuc | null
  dong_toc: DongToc
}
