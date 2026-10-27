// 01 mục 4: mọi ghi chỉ số đi qua đây để kẹp thang và trần cứng ở một chỗ (HS01 II.8, HS06 I.1).
// Hàm ở đây sửa `nv` tại chỗ (quy ước bên trong apDung, 01 mục 5.1).
import type { DinhNghiaChiSo, DuLieu } from '../du_lieu/luoc_do'
import { rngTuSeed } from './rng'
import type { NhanVat, TrangThaiGame } from './kieu'

/** Khóa của NhanVat có giá trị số (chỉ số lưu). */
export type KhoaChiSo = { [K in keyof NhanVat]: NhanVat[K] extends number ? K : never }[keyof NhanVat]

function dinhNghia(dl: DuLieu, ma: string): DinhNghiaChiSo {
  const d = dl.chi_so[ma]
  if (!d) throw new Error(`chỉ số không tồn tại: ${ma}`)
  return d
}

function dinhNghiaLuu(dl: DuLieu, ma: string): DinhNghiaChiSo {
  const d = dinhNghia(dl, ma)
  if (d.phai_sinh) throw new Error('M1-04') // phái sinh viết ở M1-04
  return d
}

/** Đọc chỉ số lưu; mã phái sinh chờ M1-04. */
export function docChiSo(dl: DuLieu, nv: NhanVat, ma: string): number {
  dinhNghiaLuu(dl, ma)
  return nv[ma as KhoaChiSo]
}

function kep(d: DinhNghiaChiSo, v: number): number {
  // Thiên phú: thang danh nghĩa 100 nhưng vượt được tới trần cứng 150; phần vượt trần bị bỏ.
  const tran = d.tran_cung ?? d.max ?? Infinity
  return Math.min(tran, Math.max(d.min, v))
}

/** Gán thô rồi kẹp. Không xét khóa Thiên phú (dùng khi đầu thai đặt giá trị gốc). */
export function datChiSo(dl: DuLieu, nv: NhanVat, ma: string, giaTri: number): void {
  const d = dinhNghiaLuu(dl, ma)
  const khoa = ma as KhoaChiSo
  nv[khoa] = kep(d, giaTri)
  // HS01 II.8: can_cot_dinh là giá trị cao nhất từng đạt
  if (ma === 'can_cot') nv.can_cot_dinh = Math.max(nv.can_cot_dinh, nv.can_cot)
}

/** Một chỉ số bị khóa khi có Thiên phú mang `dac_biet` = `khoa_<ma>` (HS01 III.2). */
export function biKhoa(dl: DuLieu, nv: NhanVat, ma: string): boolean {
  return nv.thien_phu.some((p) => dl.thien_phu[p]?.dac_biet.includes(`khoa_${ma}`))
}

/** Cộng delta (âm được). Chỉ số bị khóa thì bỏ qua mọi lần cộng. */
export function congChiSo(dl: DuLieu, nv: NhanVat, ma: string, delta: number): void {
  dinhNghiaLuu(dl, ma)
  if (biKhoa(dl, nv, ma)) return
  datChiSo(dl, nv, ma, nv[ma as KhoaChiSo] + delta)
}

/** Nhân vật rỗng: mọi số 0, danh sách rỗng (cho test). */
export function taoNhanVatRong(): NhanVat {
  return {
    ten: '', gioi_tinh: 'nam', tuoi: 0, gia_canh: '', vung: '',
    can_cot: 0, can_cot_dinh: 0, ngo_tinh: 0, phuc_duyen: 0, mi_luc: 0,
    can_cot_bam_sinh: 0, ngo_tinh_bam_sinh: 0, mi_luc_bam_sinh: 0,
    ngan_luong: 0, no: {}, hiep_nghia: 0, thanh_danh: 0, danh_vong: 0,
    hp: 0, noi_tuc: 0, noi_tuc_cong_them: 0, am_thuong: 0, khang_doc: 0, khang_han: 0,
    tuoi_tho_cong_them: 0, trong_thuong: false,
    vo_hoc: {}, trang_bi: { noi_cong: null, ngoai_cong: [], khinh_cong: null, tuyet_ky: [] },
    binh_khi: null, giap: null, hanh_trang: {},
    y_thuat: 0, doc_thuat: 0, ky_mon: 0, cam: 0, co: 0, thi: 0, hoa: 0,
    thien_phu: [], trang_thai: {}, nhan: [],
    mon_phai: null, lich_su_mon_phai: [],
    ap_con_lai: 0, viec_mien_phi_con_lai: 0, ap_bi_tru_nam_sau: 0,
    co_su_kien: {}, su_kien_da_gap: {}, viec_am_chua_lo: [], hao_cam: {},
    thong_ke: { tran_thang: 0, tran_thua: 0, npc_da_giet: 0 },
  }
}

export function taoTrangThaiRong(seed: number): TrangThaiGame {
  return {
    phien_ban: 1, seed, rng: rngTuSeed(seed).layTrangThai(), nam_the_gioi: 0,
    nhan_vat: taoNhanVatRong(), the_gioi: { npc: {} }, cho: null,
    hang_doi_su_kien: [], lich_hen: [], bien_nien: [], ket_thuc: null, dong_toc: { doi_truoc: [] },
  }
}
