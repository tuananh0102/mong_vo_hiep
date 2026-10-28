// 01 mục 5.1: Chuẩn bị dữ liệu hiển thị cho giao diện từ trạng thái game thuần.
import type { DuLieu } from '../du_lieu/luoc_do'
import { danhVongHienThi, hpMax, noiTucMax, tuoiThoMax } from './cong_thuc'
import { danhGia, moTaThieu } from './dieu_kien'
import type { NhanDoKho } from './kiem_dinh'
import { nhanDoKho, pRoll } from './kiem_dinh'
import type { Cho, DongBienNien, KetThuc, NhanVat, TrangThaiGame } from './kieu'
import { tinhXacSuatKiemDinh } from './su_kien'
import { xemTranDau, type TranHienThi } from './tam_hiep/xem_tran'
import { dienMau } from './van_ban'
import { xemAp } from './vong_nam'

export interface LuaChonHienThi {
  ma: string
  nhan: string
  bi_khoa: boolean
  ly_do: string | null
  chi_so_hien?: string
  do_kho?: NhanDoKho
  la_tam_hiep?: boolean
  nguy?: boolean
  chi_phi?: { ap?: number; ngan_luong?: number }
}

export interface SuKienHienThi {
  ma: string
  tieu_de: string
  mo_ta: string
  loai_hien_thi: 'thuong' | 'giao-chien' | 'tinh-duyen' | 'ky-ngo' | 'dao-gia'
  lua_chon: LuaChonHienThi[]
}

/** Màn hình gốc mà giao diện phải hiển thị (M1-16, thiết kế mục 6.2). */
export type ManHienThi = 'dau_thai' | 'chon_thien_phu' | 'choi' | 'ket_thuc'

export interface ThienPhuChonHienThi {
  ma: string
  ten: string
  do_hiem: 1 | 2 | 3 | 4
  mo_ta: string
}

/** Võ học đã học, đủ dữ liệu cho `.vk-lien-ket` + `.vk-popover` trong Biên Niên Sử. */
export interface VoHocHienThi {
  ma: string
  ten: string
  tier: 1 | 2 | 3 | 4
  cap: number
  tran_cap: number
  mo_ta: string
}

export interface DuLieuManHinh {
  man: ManHienThi
  ten: string
  tuoi: number
  gioi_tinh: 'nam' | 'nu'
  danh_hieu: string
  tuoi_tho: string
  vung: string
  mon_phai: string
  ap: number
  tong_ap: number
  nen_qua_nam: boolean
  hp: number
  hp_max: number
  noi_tuc: number
  noi_tuc_max: number
  ngan_luong: number
  bien_nien: DongBienNien[]
  cho: Cho | null
  ket_thuc: KetThuc | null
  thien_phu_chon: ThienPhuChonHienThi[]
  vo_hoc: VoHocHienThi[]
  su_kien?: SuKienHienThi | null
  tam_hiep?: TranHienThi | null
}

/**
 * 01 mục 5.3, HS06 I.2: Trích xuất thông tin hiển thị sự kiện đang chờ người chơi:
 * - Điền mẫu văn bản tiêu đề và mô tả.
 * - Cổng ẩn chưa đạt: không hiển thị trong danh sách.
 * - Cổng hoặc chi phí chưa đạt: bị khóa kèm lý do.
 * - Kiểm định: cung cấp tên chỉ số và nhãn độ khó (Hiểm, Khó, Khá, Dễ); không lộ % chính xác.
 */
export function xemSuKien(d: TrangThaiGame, dl: DuLieu): SuKienHienThi | null {
  if (d.cho?.loai !== 'su_kien') return null

  const { ma, bien } = d.cho
  const sk = dl.su_kien?.[ma]
  if (!sk) return null

  const tieuDe = dienMau(sk.ten, d, dl, bien)
  const moTa = dienMau(sk.mo_ta, d, dl, bien)
  const loaiHienThi = sk.loai_hien_thi ?? 'thuong'
  const dsLuaChon: LuaChonHienThi[] = []

  for (const lc of sk.lua_chon) {
    // 1. Cổng ẩn không đạt: bỏ qua khỏi danh sách
    if (lc.cong_an && !danhGia(lc.cong_an, d, dl, bien)) {
      continue
    }

    // 2. Cổng cứng và chi phí: xét trạng thái khóa
    let biKhoa = false
    let lyDo: string | null = null

    if (lc.cong && !danhGia(lc.cong, d, dl, bien)) {
      biKhoa = true
      lyDo = moTaThieu(lc.cong, d, dl)
    } else if (lc.chi_phi) {
      if (lc.chi_phi.ap && d.nhan_vat.ap_con_lai < lc.chi_phi.ap) {
        biKhoa = true
        lyDo = `Cần ${lc.chi_phi.ap} AP`
      } else if (lc.chi_phi.ngan_luong && d.nhan_vat.ngan_luong < lc.chi_phi.ngan_luong) {
        biKhoa = true
        lyDo = `Cần Ngân lượng ${lc.chi_phi.ngan_luong}`
      }
    }

    // 3. Kiểm định
    let chiSoHien: string | undefined
    let doKho: NhanDoKho | undefined
    let laTamHiep = false

    if (lc.kiem_dinh) {
      if (lc.kiem_dinh.loai === 'tam_hiep') {
        laTamHiep = true
      } else if (lc.kiem_dinh.loai !== 'ngau_nhien') {
        const kqXs = tinhXacSuatKiemDinh(lc.kiem_dinh, d, dl, bien)
        if (kqXs) {
          chiSoHien = kqXs.chiSoHien
          doKho = nhanDoKho(kqXs.p)
        }
      }
    }

    dsLuaChon.push({
      ma: lc.ma,
      nhan: dienMau(lc.nhan, d, dl, bien),
      bi_khoa: biKhoa,
      ly_do: lyDo,
      chi_so_hien: chiSoHien,
      do_kho: doKho,
      la_tam_hiep: laTamHiep,
      nguy: Boolean(lc.nguy),
      chi_phi: lc.chi_phi,
    })
  }

  return {
    ma,
    tieu_de: tieuDe,
    mo_ta: moTa,
    loai_hien_thi: loaiHienThi,
    lua_chon: dsLuaChon,
  }
}

/** Trích xuất dữ liệu cần thiết cho giao diện từ trạng thái game. */
export function xemManHinh(d: TrangThaiGame, dl: DuLieu): DuLieuManHinh {
  const nv = d.nhan_vat
  const ap = xemAp(d)

  return {
    man: manHienThi(d),
    ten: nv.ten,
    tuoi: nv.tuoi,
    gioi_tinh: nv.gioi_tinh,
    danh_hieu: danhHieu(nv, dl),
    tuoi_tho: moTaTuoiTho(tuoiThoMax(nv, dl), nv.tuoi),
    vung: dl.vung[nv.vung]?.ten ?? nv.vung,
    mon_phai: tenMonPhai(nv, dl),
    ap: nv.ap_con_lai,
    tong_ap: ap.tong_ap_nam,
    nen_qua_nam: ap.nen_qua_nam,
    hp: nv.hp,
    hp_max: hpMax(nv, dl),
    noi_tuc: nv.noi_tuc,
    noi_tuc_max: noiTucMax(nv, dl),
    ngan_luong: nv.ngan_luong,
    bien_nien: d.bien_nien,
    cho: d.cho,
    ket_thuc: d.ket_thuc,
    thien_phu_chon:
      d.cho?.loai === 'chon_thien_phu'
        ? d.cho.lua_chon.map((ma) => {
            const tp = dl.thien_phu[ma]
            return {
              ma,
              ten: tp?.ten ?? ma,
              do_hiem: tp?.do_hiem ?? 1,
              mo_ta: tp?.mo_ta ?? '',
            }
          })
        : [],
    vo_hoc: xemVoHocDaHoc(nv, dl),
    su_kien: d.cho?.loai === 'su_kien' ? xemSuKien(d, dl) : null,
    tam_hiep:
      d.cho?.loai === 'tam_hiep'
        ? xemTranDau(d.cho.tran, dl, d.cho.tran.ngu_canh?.bien[d.cho.tran.ngu_canh.doi_thu] ?? 'Đối thủ')
        : null,
  }
}

/** M1-16: chọn màn hình gốc theo trạng thái (chưa đầu thai / đang chọn Thiên phú / đang chơi / đã chết). */
export function manHienThi(d: TrangThaiGame): ManHienThi {
  if (d.ket_thuc !== null) return 'ket_thuc'
  if (d.nhan_vat.ten === '') return 'dau_thai'
  if (d.cho?.loai === 'chon_thien_phu') return 'chon_thien_phu'
  return 'choi'
}

/** HS04 I.1: tên 5 bậc môn phái hiển thị ở Header. */
const TEN_BAC_MON_PHAI: Record<number, string> = {
  1: 'Ngoại môn',
  2: 'Nội môn',
  3: 'Chân truyền',
  4: 'Trưởng lão',
  5: 'Chưởng môn',
}

/**
 * G31: danh hiệu ở Header, lấy cái đầu tiên đạt:
 * Ngũ Tuyệt -> Võ Lâm Minh Chủ -> chức vị (Chưởng môn / Giáo chủ / Trưởng lão)
 * -> mức Thanh danh (Chính Nhân Quân Tử / Đại Ma Đầu) -> mức Danh vọng (Đại hiệp / Danh hiệp).
 * Danh hiệu Ngũ Tuyệt và Võ Lâm Minh Chủ thuộc M2, M3 nên chưa xét ở đây.
 */
export function danhHieu(nv: NhanVat, dl: DuLieu): string {
  const mp = nv.mon_phai
  if (mp) {
    if (mp.bac >= 5) return dl.mon_phai?.[mp.ma]?.phe === 'ta' ? 'Giáo chủ' : 'Chưởng môn'
    if (mp.bac === 4) return 'Trưởng lão'
  }

  // HS01 II.2: Thanh danh >= +300 là Chính Nhân Quân Tử, <= -300 là Đại Ma Đầu
  if (nv.thanh_danh >= 300) return 'Chính Nhân Quân Tử'
  if (nv.thanh_danh <= -300) return 'Đại Ma Đầu'

  const dv = danhVongHienThi(nv)
  if (dv >= 700) return 'Đại hiệp'
  if (dv >= 400) return 'Danh hiệp'
  return 'Vô danh tiểu tốt'
}

/** G02: mô tả tuổi thọ ẩn theo số năm còn lại. */
export function moTaTuoiTho(max: number, tuoi: number): string {
  const con = max - tuoi
  if (con >= 20) return 'Khí huyết dồi dào'
  if (con >= 10) return 'Thân thể vững vàng'
  if (con >= 5) return 'Tuổi xế chiều'
  return 'Đèn cạn dầu'
}

/** HS04 I.1, HS01 II.6: môn phái và bậc hiển thị ở Header. */
export function tenMonPhai(nv: NhanVat, dl: DuLieu): string {
  const mp = nv.mon_phai
  if (!mp) return 'Vô môn vô phái'
  const phai = dl.mon_phai?.[mp.ma]
  const ten = phai?.ten ?? mp.ma
  const bac = mp.bac >= 5 && phai?.phe === 'ta' ? 'Giáo chủ' : (TEN_BAC_MON_PHAI[mp.bac] ?? `Bậc ${mp.bac}`)
  return `${ten} · ${bac}`
}

/** Danh sách võ học đã học kèm tier, cấp hiện tại và mô tả 1 dòng (cho popover Biên Niên Sử). */
export function xemVoHocDaHoc(nv: NhanVat, dl: DuLieu): VoHocHienThi[] {
  const ds: VoHocHienThi[] = []
  for (const [ma, daHoc] of Object.entries(nv.vo_hoc)) {
    const vh = dl.vo_hoc?.[ma]
    if (!vh) continue
    ds.push({
      ma,
      ten: vh.ten,
      tier: vh.tier,
      cap: daHoc.cap,
      tran_cap: vh.tran_cap,
      mo_ta: vh.mo_ta,
    })
  }
  return ds
}

export interface HanhDongHienThi {
  ma: string
  ten: string
  ap: number
  nhom_tab: string
  bi_khoa: boolean
  ly_do: string | null
  do_kho?: NhanDoKho
  mo_ta: string
}

/**
 * HS01 IV, HS06 I.2: Danh sách hành động nhóm theo Tab.
 * Mỗi dòng có tên, chi phí AP, bi_khoa + lý do, và nếu có Roll thì nhãn độ khó.
 */
export function xemHanhDong(
  d: TrangThaiGame,
  dl: DuLieu,
): Record<string, HanhDongHienThi[]> {
  const ketQua: Record<string, HanhDongHienThi[]> = {}

  if (!dl.hanh_dong) return ketQua

  for (const [ma, hd] of Object.entries(dl.hanh_dong)) {
    let biKhoa = false
    let lyDo: string | null = null

    // 1. Kiểm tra tuổi
    if (d.nhan_vat.tuoi < hd.tuoi[0]) {
      biKhoa = true
      lyDo = `Chưa đủ tuổi (cần ${hd.tuoi[0]} tuổi)`
    } else if (d.nhan_vat.tuoi > hd.tuoi[1]) {
      biKhoa = true
      lyDo = `Đã quá tuổi (chỉ từ ${hd.tuoi[0]} đến ${hd.tuoi[1]} tuổi)`
    } else if (hd.dieu_kien && !danhGia(hd.dieu_kien, d, dl)) {
      // 2. Kiểm tra điều kiện
      biKhoa = true
      lyDo = moTaThieu(hd.dieu_kien, d, dl) ?? 'Không đủ điều kiện'
    } else if (hd.ap > 0 && d.nhan_vat.ap_con_lai < hd.ap) {
      // 3. Kiểm tra AP
      biKhoa = true
      lyDo = 'Hết AP'
    } else if (
      hd.ap === 0 &&
      hd.mien_phi &&
      !hd.khong_tinh_gioi_han &&
      d.nhan_vat.viec_mien_phi_con_lai < 1
    ) {
      biKhoa = true
      lyDo = 'Hết lượt miễn phí năm nay'
    }

    // 4. Kiểm định Roll (nếu có, ví dụ tiểu thương)
    let doKho: NhanDoKho | undefined
    if (hd.xu_ly === 'tieu_thuong') {
      const p = pRoll(d.nhan_vat.ngo_tinh, 50, d.nhan_vat.phuc_duyen)
      doKho = nhanDoKho(p)
    }

    const item: HanhDongHienThi = {
      ma,
      ten: hd.ten,
      ap: hd.ap,
      nhom_tab: hd.nhom_tab,
      bi_khoa: biKhoa,
      ly_do: lyDo,
      do_kho: doKho,
      mo_ta: hd.mo_ta,
    }

    if (!ketQua[hd.nhom_tab]) {
      ketQua[hd.nhom_tab] = []
    }
    ketQua[hd.nhom_tab]!.push(item)
  }

  return ketQua
}
