// 01 mục 5.1: Chuẩn bị dữ liệu hiển thị cho giao diện từ trạng thái game thuần.
import type { DuLieu } from '../du_lieu/luoc_do'
import { docChiSo } from './chi_so'
import { danhVongHienThi, hpMax, noiTucMax, soO, tuoiThoMax } from './cong_thuc'
import { danhGia, moTaThieu } from './dieu_kien'
import { coThayTapHoc } from './hanh_dong'
import { BAC_CHUONG_MON, BAC_YEU_CAU, GIA_PHONG_TRO, SU_PHU_THEO_BAC, TIER_THEO_BAC, TRUY_NA } from './hang_so'
import type { NhanDoKho } from './kiem_dinh'
import { nhanDoKho, pRoll } from './kiem_dinh'
import type { Cho, DongBienNien, KetThuc, NhanVat, TrangThaiGame } from './kieu'
import { dungDuocNgoaiTran } from './kinh_te'
import { hangTangKinhCac } from './mon_phai'
import { tinhXacSuatKiemDinh } from './su_kien'
import { xemTranDau, type TranHienThi } from './tam_hiep/xem_tran'
import { dienMau } from './van_ban'
import { capToiDaVoHoc } from './vo_hoc'
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
  co_mon_phai: boolean
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
    co_mon_phai: nv.mon_phai !== null,
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

/** HS02 II: nhãn tier võ học dùng chung cho popover và các Tab. */
export const TEN_TIER: Record<1 | 2 | 3 | 4, string> = {
  1: 'Nhập môn',
  2: 'Thượng thừa',
  3: 'Trấn phái',
  4: 'Thần công',
}

/** HS04 I.1: tên bậc hiển thị; phái Tà ở Bậc 5 gọi là Giáo chủ (HS01 II.6). */
export function tenBacMonPhai(ma: string, bac: number, dl: DuLieu): string {
  const phai = dl.mon_phai?.[ma]
  if (bac >= 5 && phai?.phe === 'ta') return 'Giáo chủ'
  return TEN_BAC_MON_PHAI[bac] ?? `Bậc ${bac}`
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
  return `${ten} · ${tenBacMonPhai(mp.ma, mp.bac, dl)}`
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

export interface LuaChonThamSoHienThi {
  ma: string
  nhan: string
  phu: string
  bi_khoa: boolean
  ly_do: string | null
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
  trong_tuoi: boolean
  /** Hành động cần chọn tham số (luyện môn nào, hạng truy nã nào) mở danh sách con. */
  nhan_chon: string | null
  khoa_tham_so: string | null
  tham_so: LuaChonThamSoHienThi[] | null
}

export interface NhomHanhDongHienThi {
  nhom: string
  ten: string
  hanh_dong: HanhDongHienThi[]
}

/** Nhãn hạng truy nã (mã lấy từ TRUY_NA, HS06 II.1). */
const TEN_HANG_TRUY_NA: Record<string, string> = {
  yeu: 'Hạng Yếu',
  ngang: 'Hạng Ngang',
  manh: 'Hạng Mạnh',
}

/**
 * HS01 IV, HS06 I.2: Danh sách hành động nhóm theo Tab.
 * Mỗi dòng có tên, chi phí AP, bi_khoa + lý do, và nếu có Roll thì nhãn độ khó.
 * Hành động cần chọn tham số thì kèm danh sách lựa chọn con.
 */
export function xemHanhDong(
  d: TrangThaiGame,
  dl: DuLieu,
): Record<string, HanhDongHienThi[]> {
  const ketQua: Record<string, HanhDongHienThi[]> = {}

  if (!dl.hanh_dong) return ketQua

  for (const [ma, hd] of Object.entries(dl.hanh_dong)) {
    const trongTuoi = d.nhan_vat.tuoi >= hd.tuoi[0] && d.nhan_vat.tuoi <= hd.tuoi[1]
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

    // 4. Điều kiện riêng của hàm xử lý (cùng nguồn với hanh_dong.ts, để nút không bấm vào rồi mới báo lỗi)
    if (!biKhoa) {
      lyDo = lyDoKhoaRieng(ma, d)
      biKhoa = lyDo !== null
    }

    // 5. Tham số của hành động
    const thamSo = xemThamSoHanhDong(d, dl, ma)
    if (!biKhoa && thamSo) {
      if (thamSo.lua_chon.length === 0) {
        biKhoa = true
        lyDo = thamSo.ly_do_rong
      } else if (thamSo.lua_chon.every((lc) => lc.bi_khoa)) {
        biKhoa = true
        lyDo = thamSo.lua_chon[0]?.ly_do ?? 'Không có lựa chọn'
      }
    }

    // 6. Kiểm định Roll (nếu có, ví dụ tiểu thương)
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
      trong_tuoi: trongTuoi,
      nhan_chon: thamSo?.nhan ?? null,
      khoa_tham_so: thamSo?.khoa ?? null,
      tham_so: thamSo?.lua_chon ?? null,
    }

    if (!ketQua[hd.nhom_tab]) {
      ketQua[hd.nhom_tab] = []
    }
    ketQua[hd.nhom_tab]!.push(item)
  }

  return ketQua
}

/**
 * Điều kiện riêng nằm trong hàm xử lý chứ không có trong `dieu_kien` của JSON:
 * - Học Tạp học cần thầy hoặc sách (HS03 I, G07).
 * - Nghỉ trọ cần đủ 20 lạng (HS06 II.2).
 */
function lyDoKhoaRieng(ma: string, d: TrangThaiGame): string | null {
  if (ma === 'hoc_tap_hoc' && !coThayTapHoc(d)) return 'Cần thầy hoặc sách'
  // `tri_thuong` là mã hành động, hàm xử lý là `nghi_tro` (HS01 IV, HS06 II.2)
  if (ma === 'tri_thuong' && d.nhan_vat.ngan_luong < GIA_PHONG_TRO) {
    return `Cần ${GIA_PHONG_TRO} lạng`
  }
  return null
}

interface ThamSoHanhDongHienThi {
  /** Khóa trong `tham_so` của lệnh `hanh_dong`. */
  khoa: string
  nhan: string
  lua_chon: LuaChonThamSoHienThi[]
  ly_do_rong: string
}

/** Danh sách con cho hành động cần chọn tham số; null nếu hành động chạy thẳng. */
function xemThamSoHanhDong(
  d: TrangThaiGame,
  dl: DuLieu,
  ma: string,
): ThamSoHanhDongHienThi | null {
  switch (ma) {
    case 'luyen_cong': {
      const luaChon: LuaChonThamSoHienThi[] = []
      for (const [maVh, daHoc] of Object.entries(d.nhan_vat.vo_hoc)) {
        const vh = dl.vo_hoc?.[maVh]
        if (!vh) continue
        const toiDa = capToiDaVoHoc(d.nhan_vat, dl, maVh)
        const day = daHoc.cap >= toiDa
        luaChon.push({
          ma: maVh,
          nhan: vh.ten,
          phu: `${TEN_TIER[vh.tier]} · cấp ${daHoc.cap}/${toiDa}`,
          bi_khoa: day,
          ly_do: day ? 'Đã đạt cảnh giới cao nhất hiện tại' : null,
        })
      }
      // Môn đã tới hạn xuống cuối danh sách để môn còn luyện được lên trước
      luaChon.sort((a, b) => Number(a.bi_khoa) - Number(b.bi_khoa))
      return { khoa: 'vo_hoc', nhan: 'Chọn môn võ để luyện', lua_chon: luaChon, ly_do_rong: 'Chưa học môn võ nào' }
    }

    case 'hoc_tap_hoc': {
      const luaChon = Object.values(dl.chi_so)
        .filter((cs) => cs.nhom === 'tap_hoc')
        .map((cs) => ({
          ma: cs.ma,
          nhan: cs.ten,
          phu: `Hiện tại ${docChiSo(dl, d.nhan_vat, cs.ma)}`,
          bi_khoa: false,
          ly_do: null,
        }))
      return { khoa: 'tap_hoc', nhan: 'Chọn môn tạp học', lua_chon: luaChon, ly_do_rong: 'Không có môn tạp học' }
    }

    case 'san_tien_thuong': {
      const luaChon = Object.entries(TRUY_NA).map(([maHang, hang]) => ({
        ma: maHang,
        nhan: TEN_HANG_TRUY_NA[maHang] ?? maHang,
        phu: `Thưởng ${hang.thuong[0]} - ${hang.thuong[1]} lạng`,
        bi_khoa: false,
        ly_do: null,
      }))
      return { khoa: 'hang', nhan: 'Chọn hạng truy nã', lua_chon: luaChon, ly_do_rong: 'Không có hạng truy nã' }
    }

    default:
      return null
  }
}

/** Nhóm hành động hiển thị ở Tab 1 (HS07 I.2), theo đúng thứ tự. `khac` là chức năng của Tab khác. */
const THU_TU_NHOM_HANH_DONG = ['sinh_hoat', 'tu_luyen', 'giang_ho', 'mon_phai']
const TEN_NHOM_HANH_DONG: Record<string, string> = {
  sinh_hoat: 'Sinh hoạt',
  tu_luyen: 'Tu luyện',
  giang_ho: 'Giang hồ',
  mon_phai: 'Môn phái',
}
/** Hành động thuộc Tab Môn Phái (đổi Cống hiến, rời phái) nên không lặp ở Tab 1. */
const HANH_DONG_TAB_MON_PHAI = new Set(['tang_kinh_cac', 'roi_mon_phai'])

/**
 * HS07 I.2 Tab 1: việc làm theo độ tuổi.
 * Bỏ hành động ngoài khoảng tuổi (danh sách "theo độ tuổi") và các việc thuộc Tab Môn Phái.
 */
export function xemTabTuLuyen(d: TrangThaiGame, dl: DuLieu): NhomHanhDongHienThi[] {
  const theoNhom = xemHanhDong(d, dl)
  const ketQua: NhomHanhDongHienThi[] = []
  for (const nhom of THU_TU_NHOM_HANH_DONG) {
    const ten = TEN_NHOM_HANH_DONG[nhom]
    if (!ten) continue
    const hanhDong = (theoNhom[nhom] ?? []).filter(
      (hd) => hd.trong_tuoi && !HANH_DONG_TAB_MON_PHAI.has(hd.ma),
    )
    if (hanhDong.length > 0) ketQua.push({ nhom, ten, hanh_dong: hanhDong })
  }
  return ketQua
}

// ======================================================================
// Tab 2 - Võ Học & Hành Trang (HS02 II.1, HS06 II.2, HS06 III)
// ======================================================================

export type TruCot = 'noi_cong' | 'ngoai_cong' | 'khinh_cong' | 'tuyet_ky'

const TRU_COT: ReadonlyArray<{ ma: TruCot; ten: string }> = [
  { ma: 'noi_cong', ten: 'Nội công' },
  { ma: 'ngoai_cong', ten: 'Ngoại công' },
  { ma: 'khinh_cong', ten: 'Khinh công' },
  { ma: 'tuyet_ky', ten: 'Tuyệt kỹ' },
]

/** HS02 II.1: số ô thật của trụ cột (Nội công chủ đạo 1 ô, Ngoại công 2 - 6, Khinh công 1, Tuyệt kỹ 1 - 3). */
function soOTruCot(nv: NhanVat, dl: DuLieu, truCot: TruCot): number {
  switch (truCot) {
    case 'noi_cong':
      return soO(nv, 'noi_cong_chu_dao', dl)
    case 'ngoai_cong':
      return soO(nv, 'ngoai_cong', dl)
    case 'khinh_cong':
      return soO(nv, 'khinh_cong', dl)
    case 'tuyet_ky':
      return soO(nv, 'tuyet_ky', dl)
  }
}

/** Danh sách môn đang trang bị ở trụ cột; chỉ đọc, không sửa mảng của trạng thái. */
function dsDangTrangBi(nv: NhanVat, truCot: TruCot): readonly string[] {
  switch (truCot) {
    case 'noi_cong':
      return nv.trang_bi.noi_cong ? [nv.trang_bi.noi_cong] : []
    case 'ngoai_cong':
      return nv.trang_bi.ngoai_cong
    case 'khinh_cong':
      return nv.trang_bi.khinh_cong ? [nv.trang_bi.khinh_cong] : []
    case 'tuyet_ky':
      return nv.trang_bi.tuyet_ky
  }
}

export interface LuaChonVoHocHienThi {
  ma: string
  ten: string
  tier: 1 | 2 | 3 | 4
  chi_tiet: string
  dang_dung: boolean
  bi_khoa: boolean
  ly_do: string | null
}

export interface OVoHocHienThi {
  vi_tri: number
  ma: string | null
  ten: string
  chi_tiet: string | null
  tier: 1 | 2 | 3 | 4 | null
  trong: boolean
}

export interface TruCotHienThi {
  tru_cot: TruCot
  ten: string
  so_o: number
  o: OVoHocHienThi[]
  /** Lựa chọn để đổi môn vào trụ cột này (lệnh `trang_bi`). */
  lua_chon: LuaChonVoHocHienThi[]
  /** Trụ cột một ô: hiện dòng "Tháo ra" (trang_bi với ma null). */
  thao_duoc: boolean
}

export interface VatPhamHienThi {
  ma: string
  ten: string
  mo_ta: string
  so_luong: number
  dung_duoc: boolean
  ly_do: string | null
}

export interface HangChoHienThi {
  ma: string
  ten: string
  mo_ta: string
  gia: number
  mua_duoc: boolean
  ly_do: string | null
}

export interface DuLieuTabVoHoc {
  tru_cot: TruCotHienThi[]
  hanh_trang: VatPhamHienThi[]
  cho: HangChoHienThi[]
}

/** HS02 II.1: các trụ cột với số ô thật, môn đang trang bị và lựa chọn đổi môn. */
function xemTruCot(d: TrangThaiGame, dl: DuLieu, truCot: TruCot, ten: string): TruCotHienThi {
  const nv = d.nhan_vat
  const dangDung = dsDangTrangBi(nv, truCot)
  const so = soOTruCot(nv, dl, truCot)
  const laMotO = truCot === 'noi_cong' || truCot === 'khinh_cong'
  const hetO = !laMotO && dangDung.length >= so

  const o: OVoHocHienThi[] = []
  for (let viTri = 0; viTri < so; viTri++) {
    const ma = dangDung[viTri] ?? null
    const vh = ma ? dl.vo_hoc?.[ma] : undefined
    const daHoc = ma ? nv.vo_hoc[ma] : undefined
    o.push({
      vi_tri: viTri,
      ma,
      ten: vh?.ten ?? 'Chưa có',
      chi_tiet:
        ma && vh && daHoc
          ? `${TEN_TIER[vh.tier]} · ${daHoc.cap}/${capToiDaVoHoc(nv, dl, ma)}`
          : null,
      tier: vh?.tier ?? null,
      trong: ma === null,
    })
  }

  const luaChon: LuaChonVoHocHienThi[] = []
  for (const [maVh, daHoc] of Object.entries(nv.vo_hoc)) {
    const vh = dl.vo_hoc?.[maVh]
    if (!vh || vh.tru_cot !== truCot) continue
    const laDangDung = dangDung.includes(maVh)
    let biKhoa = false
    let lyDo: string | null = null
    if (!laDangDung && hetO) {
      biKhoa = true
      lyDo = 'Đã hết ô, tháo bớt một môn'
    } else if (vh.dieu_kien_hoc && !danhGia(vh.dieu_kien_hoc, d, dl)) {
      biKhoa = true
      lyDo = 'Không đủ điều kiện vận dụng'
    }
    luaChon.push({
      ma: maVh,
      ten: vh.ten,
      tier: vh.tier,
      chi_tiet: `${TEN_TIER[vh.tier]} · cấp ${daHoc.cap}/${capToiDaVoHoc(nv, dl, maVh)}`,
      dang_dung: laDangDung,
      bi_khoa: biKhoa,
      ly_do: lyDo,
    })
  }
  // Môn chưa dùng được xuống cuối
  luaChon.sort((a, b) => Number(a.bi_khoa) - Number(b.bi_khoa))

  return { tru_cot: truCot, ten, so_o: so, o, lua_chon: luaChon, thao_duoc: laMotO && dangDung.length > 0 }
}

/**
 * HS07 I.2 Tab 2: 4 trụ cột võ học, đan dược trong hành trang và chợ.
 * Chợ M1 chỉ bán đan dược; ô binh khí / giáp trụ vào ở M2-13.
 */
export function xemTabVoHoc(d: TrangThaiGame, dl: DuLieu): DuLieuTabVoHoc {
  const nv = d.nhan_vat

  const hanhTrang: VatPhamHienThi[] = []
  for (const [ma, soLuong] of Object.entries(nv.hanh_trang)) {
    const vp = dl.vat_pham?.[ma]
    if (!vp || vp.loai !== 'dan_duoc' || soLuong < 1) continue
    const dungDuoc = dungDuocNgoaiTran(vp)
    hanhTrang.push({
      ma,
      ten: vp.ten,
      mo_ta: vp.mo_ta,
      so_luong: soLuong,
      dung_duoc: dungDuoc,
      ly_do: dungDuoc ? null : 'Không dùng được ngoài trận',
    })
  }

  const cho: HangChoHienThi[] = []
  for (const vp of Object.values(dl.vat_pham ?? {})) {
    if (vp.ban_o !== 'cho' || vp.loai !== 'dan_duoc') continue
    const muaDuoc = nv.ngan_luong >= vp.gia
    cho.push({
      ma: vp.ma,
      ten: vp.ten,
      mo_ta: vp.mo_ta,
      gia: vp.gia,
      mua_duoc: muaDuoc,
      ly_do: muaDuoc ? null : `Thiếu ${vp.gia - nv.ngan_luong} lạng`,
    })
  }
  cho.sort((a, b) => a.gia - b.gia)

  return {
    tru_cot: TRU_COT.map((tc) => xemTruCot(d, dl, tc.ma, tc.ten)),
    hanh_trang: hanhTrang,
    cho,
  }
}

// ======================================================================
// Tab 3 - Nhân Mạch (HS05; dữ liệu NPC đầy đủ ở M2-01)
// ======================================================================

export interface NguoiHienThi {
  ma: string
  ten: string
  vai_tro: string
  mo_ta: string
}

function laVaiNguoi(v: unknown): v is { ten: string } {
  return typeof v === 'object' && v !== null && 'ten' in v && typeof v.ten === 'string'
}

/**
 * HS07 I.2 Tab 3: M1 chỉ có sư phụ và nhân vật đã gặp qua sự kiện (dữ liệu `vai` của sự kiện).
 * Hồng nhan, huynh đệ, cừu gia và Hảo cảm đầy đủ chờ M2-01 / M2-03.
 */
export function xemNhanMach(d: TrangThaiGame, dl: DuLieu): NguoiHienThi[] {
  const nv = d.nhan_vat
  const ds: NguoiHienThi[] = []

  const mp = nv.mon_phai
  if (mp) {
    const phai = dl.mon_phai?.[mp.ma]
    const capSuPhu = SU_PHU_THEO_BAC[mp.bac] ?? 0
    const tierSuPhu = TIER_THEO_BAC[mp.bac] ?? 1
    ds.push({
      ma: 'su_phu',
      ten: 'Sư phụ',
      vai_tro: phai?.ten ?? mp.ma,
      mo_ta: `Truyền võ học ${phai?.ten ?? mp.ma} tới ${TEN_TIER[tierSuPhu as 1 | 2 | 3 | 4]} (cấp sư phụ ${capSuPhu}).`,
    })
  }

  const daCo = new Set(ds.map((x) => x.ten))
  for (const [maSk, soLan] of Object.entries(nv.su_kien_da_gap)) {
    if (soLan < 1) continue
    const sk = dl.su_kien?.[maSk]
    if (!sk?.vai) continue
    for (const [maVai, vai] of Object.entries(sk.vai)) {
      if (!laVaiNguoi(vai) || daCo.has(vai.ten)) continue
      const laDoiThu = sk.lua_chon.some(
        (lc) => lc.kiem_dinh?.loai === 'tam_hiep' && lc.kiem_dinh.doi_thu === maVai,
      )
      daCo.add(vai.ten)
      ds.push({
        ma: `${maSk}:${maVai}`,
        ten: vai.ten,
        vai_tro: laDoiThu ? 'Đối thủ' : 'Người đã gặp',
        mo_ta: `Đã gặp trong: ${sk.ten}`,
      })
    }
  }

  return ds
}

// ======================================================================
// Tab 4 - Môn Phái (HS04 I.1, HS02 I G19)
// ======================================================================

export interface MocBacHienThi {
  bac: number
  ten_bac: string
  tuoi: number
  cong_hien: number
  /** Bậc 5 chỉ đạt qua Đại Biến Cố Kế Vị (HS04 II.3), không qua thử thách thường. */
  qua_su_kien: boolean
}

export interface LuaChonTangKinhCac {
  ma: string
  ten: string
  tier: 1 | 2 | 3 | 4
  gia: number
  bi_khoa: boolean
  ly_do: string | null
}

export interface MonPhaiHienThi {
  co_mon_phai: boolean
  ten: string
  bac: number
  ten_bac: string
  cong_hien: number
  moc_ke: MocBacHienThi | null
  /** Phần trăm Cống hiến so với mốc bậc kế (0 - 100). */
  tien_do: number
  tang_kinh_cac: LuaChonTangKinhCac[]
  roi_duoc: boolean
}

/** HS04 I.1: bậc, Cống hiến / mốc bậc kế và hàng Tàng Kinh Các của môn phái hiện tại. */
export function xemMonPhai(d: TrangThaiGame, dl: DuLieu): MonPhaiHienThi {
  const nv = d.nhan_vat
  const mp = nv.mon_phai
  if (!mp) {
    return {
      co_mon_phai: false,
      ten: '',
      bac: 0,
      ten_bac: '',
      cong_hien: 0,
      moc_ke: null,
      tien_do: 0,
      tang_kinh_cac: [],
      roi_duoc: false,
    }
  }

  const phai = dl.mon_phai?.[mp.ma]
  const bacKe = mp.bac + 1
  const yeuCau = BAC_YEU_CAU[bacKe]
  const mocKe: MocBacHienThi | null = yeuCau
    ? {
        bac: bacKe,
        ten_bac: tenBacMonPhai(mp.ma, bacKe, dl),
        tuoi: yeuCau.tuoi,
        cong_hien: yeuCau.cong_hien,
        qua_su_kien: bacKe >= BAC_CHUONG_MON,
      }
    : null
  const tienDo = mocKe ? Math.min(100, Math.floor((mp.cong_hien / mocKe.cong_hien) * 100)) : 100

  const tangKinhCac: LuaChonTangKinhCac[] = hangTangKinhCac(d, dl).map((hang) => {
    const vh = dl.vo_hoc?.[hang.ma]
    const biKhoa = mp.cong_hien < hang.gia
    return {
      ma: hang.ma,
      ten: vh?.ten ?? hang.ma,
      tier: vh?.tier ?? 1,
      gia: hang.gia,
      bi_khoa: biKhoa,
      ly_do: biKhoa ? `Thiếu ${hang.gia - mp.cong_hien} Cống hiến` : null,
    }
  })

  return {
    co_mon_phai: true,
    ten: phai?.ten ?? mp.ma,
    bac: mp.bac,
    ten_bac: tenBacMonPhai(mp.ma, mp.bac, dl),
    cong_hien: mp.cong_hien,
    moc_ke: mocKe,
    tien_do: tienDo,
    tang_kinh_cac: tangKinhCac,
    roi_duoc: mp.bac < BAC_CHUONG_MON,
  }
}

// ======================================================================
// Sheet Bát Tự (HS01 II.8, G02)
// ======================================================================

const TEN_NHOM_CHI_SO: Record<string, string> = {
  nhan_than: 'Thân thế',
  thien_phu: 'Thiên phú',
  xa_hoi: 'Xã hội',
  noi_cong: 'Nội công',
  chien_dau: 'Chiến đấu',
  sinh_ton: 'Sinh tồn',
  tap_hoc: 'Tạp học',
}

export interface ChiSoBatTuHienThi {
  ma: string
  ten: string
  gia_tri: string
}

export interface NhomChiSoHienThi {
  nhom: string
  ten: string
  chi_so: ChiSoBatTuHienThi[]
}

export interface NhanBatTuHienThi {
  ma: string
  ten: string
  do_hiem?: 1 | 2 | 3 | 4
}

export interface BatTuHienThi {
  ten: string
  gioi_tinh: string
  tuoi: number
  gia_canh: string
  vung: string
  mon_phai: string
  danh_hieu: string
  nhom: NhomChiSoHienThi[]
  /** G02: chỉ hiện mô tả, không hiện số Phúc duyên (chỉ số bán ẩn). */
  phuc_duyen: string
  thien_phu: NhanBatTuHienThi[]
  trang_thai: NhanBatTuHienThi[]
  nhan: NhanBatTuHienThi[]
}

/** G02: 4 mức mô tả Phúc duyên theo ngưỡng 30 / 60 / 90 (HS01 II.8). */
export function moTaPhucDuyen(phucDuyen: number): string {
  if (phucDuyen < 30) return 'Bạc mệnh'
  if (phucDuyen < 60) return 'Bình thường'
  if (phucDuyen < 90) return 'Hồng phúc'
  return 'Thiên mệnh'
}

function dinhDangSo(v: number): string {
  return Math.round(v).toLocaleString('vi-VN')
}

/** HS07 I.1: Sheet Bát Tự & Thiên phú - mọi chỉ số `hien_thi = "hien"` cộng nhãn phân loại. */
export function xemBatTu(d: TrangThaiGame, dl: DuLieu): BatTuHienThi {
  const nv = d.nhan_vat
  const gom = new Map<string, ChiSoBatTuHienThi[]>()

  for (const cs of Object.values(dl.chi_so)) {
    if (cs.hien_thi !== 'hien') continue
    // HS01 II.2: hiển thị Danh vọng đã cộng Danh vọng chức vị
    const giaTri = cs.ma === 'danh_vong' ? danhVongHienThi(nv) : docChiSo(dl, nv, cs.ma)
    const dsNhom = gom.get(cs.nhom) ?? []
    dsNhom.push({ ma: cs.ma, ten: cs.ten, gia_tri: dinhDangSo(giaTri) })
    gom.set(cs.nhom, dsNhom)
  }

  const nhom: NhomChiSoHienThi[] = []
  for (const [ma, ds] of gom) {
    const ten = TEN_NHOM_CHI_SO[ma]
    if (ten) nhom.push({ nhom: ma, ten, chi_so: ds })
  }

  return {
    ten: nv.ten,
    gioi_tinh: nv.gioi_tinh === 'nam' ? 'Nam' : 'Nữ',
    tuoi: nv.tuoi,
    gia_canh: dl.gia_canh?.[nv.gia_canh]?.ten ?? nv.gia_canh,
    vung: dl.vung[nv.vung]?.ten ?? nv.vung,
    mon_phai: tenMonPhai(nv, dl),
    danh_hieu: danhHieu(nv, dl),
    nhom,
    phuc_duyen: moTaPhucDuyen(nv.phuc_duyen),
    thien_phu: nv.thien_phu.map((ma) => ({
      ma,
      ten: dl.thien_phu[ma]?.ten ?? ma,
      do_hiem: dl.thien_phu[ma]?.do_hiem ?? 1,
    })),
    trang_thai: Object.keys(nv.trang_thai).map((ma) => ({
      ma,
      ten: dl.trang_thai?.[ma]?.ten ?? ma,
    })),
    nhan: nv.nhan.map((ma) => ({ ma, ten: dl.nhan?.[ma]?.ten ?? ma })),
  }
}

export interface DuLieuTab {
  tu_luyen: NhomHanhDongHienThi[]
  vo_hoc: DuLieuTabVoHoc
  nhan_mach: NguoiHienThi[]
  mon_phai: MonPhaiHienThi
  bat_tu: BatTuHienThi
}

/** Gom mọi dữ liệu hiển thị của 4 Tab và Sheet Bát Tự (M1-17). */
export function xemTatCaTab(d: TrangThaiGame, dl: DuLieu): DuLieuTab {
  return {
    tu_luyen: xemTabTuLuyen(d, dl),
    vo_hoc: xemTabVoHoc(d, dl),
    nhan_mach: xemNhanMach(d, dl),
    mon_phai: xemMonPhai(d, dl),
    bat_tu: xemBatTu(d, dl),
  }
}
