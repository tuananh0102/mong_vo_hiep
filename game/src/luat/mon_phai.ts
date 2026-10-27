// HS04 I.1; HS02 I (G17, G19); HS06 II.1; HS01 II.2, II.6: Môn phái - gia nhập, bậc, Cống hiến, Tàng Kinh Các
import type { DuLieu } from '../du_lieu/luoc_do'
import { congChiSo } from './chi_so'
import { danhGia, moTaThieu } from './dieu_kien'
import { giaoChienNhanh } from './giao_chien_nhanh'
import { DANH_VONG_THANG_CAP } from './gia_dinh'
import {
  BAC_CHUONG_MON,
  BAC_YEU_CAU,
  CONG_HIEN_THANG_CAP,
  CONG_HIEN_TRUOT_2_LAN,
  GIA_TANG_KINH_CAC,
  SAI_PHAI,
  TIER_THEO_BAC,
  TRO_CAP,
  TUOI_NGOAI_MON_TOI_DA,
} from './hang_so'
import type { DongBienNien, LichSuMonPhai, TrangThaiGame } from './kieu'
import type { Rng } from './rng'
import { hocVoHoc } from './vo_hoc'

/** Cờ: Ngoại môn làm Tạp dịch thì ở lại trọn đời (HS04 I.1). Do sự kiện khảo nghiệm đặt (`dat_co`). */
export const CO_TAP_DICH = 'tap_dich'
/** Cờ: thử thách Bậc 4 thất bại, trợ cấp lần tới bằng 0 (HS04 I.1). */
const CO_MAT_TRO_CAP = 'tro_cap_bang_0'

const dong = (d: TrangThaiGame, van_ban: string): DongBienNien => ({
  tuoi: d.nhan_vat.tuoi,
  van_ban,
  loai_hien_thi: 'thuong',
})

const tenPhai = (dl: DuLieu, ma: string): string => dl.mon_phai?.[ma]?.ten ?? ma

/** HS04 I.1, G17: sư phụ truyền miễn phí võ học của Bậc `bac` khi gia nhập / lên bậc. */
function truyenVoHoc(d: TrangThaiGame, dl: DuLieu, bac: number): DongBienNien[] {
  const mp = d.nhan_vat.mon_phai
  if (!mp) return []
  return (dl.mon_phai?.[mp.ma]?.vo_hoc_theo_bac[String(bac)] ?? []).flatMap((ma) =>
    hocVoHoc(d, dl, ma),
  )
}

/** Đặt thành viên môn phái và truyền võ học, không kiểm điều kiện (sự kiện đã tự kiểm). */
export function datMonPhai(d: TrangThaiGame, dl: DuLieu, ma: string, bac = 1): DongBienNien[] {
  d.nhan_vat.mon_phai = { ma, bac, cong_hien: 0, tu_tuoi: d.nhan_vat.tuoi }
  return [dong(d, `Bạn gia nhập ${tenPhai(dl, ma)}.`), ...truyenVoHoc(d, dl, bac)]
}

/**
 * HS02 I: Gia nhập môn phái. Điều kiện do sư môn phán xét nên xét theo Thanh danh (HS01 II.2),
 * dữ liệu `dieu_kien_gia_nhap` đã dùng `thanh_danh`.
 */
export function giaNhap(
  d: TrangThaiGame,
  dl: DuLieu,
  ma: string,
  bac = 1,
): { dong_moi: DongBienNien[]; loi: string | null } {
  const mp = dl.mon_phai?.[ma]
  if (!mp) return { dong_moi: [], loi: 'mon_phai_khong_ton_tai' }
  if (d.nhan_vat.mon_phai) return { dong_moi: [], loi: 'dang_o_mon_phai' }
  if (!danhGia(mp.dieu_kien_gia_nhap, d, dl)) {
    return { dong_moi: [], loi: moTaThieu(mp.dieu_kien_gia_nhap, d, dl) ?? 'khong_du_dieu_kien' }
  }
  return { dong_moi: datMonPhai(d, dl, ma, bac), loi: null }
}

/** Đặt thẳng bậc (hiệu ứng `thang_bac`) và truyền võ học của bậc mới. */
export function datBac(d: TrangThaiGame, dl: DuLieu, bac: number): DongBienNien[] {
  const mp = d.nhan_vat.mon_phai
  if (!mp) return []
  mp.bac = bac
  return truyenVoHoc(d, dl, bac)
}

/**
 * HS01 II.6, II.2: Rời phái - Cống hiến về 0 (bản ghi thành viên bị xóa) và mất Danh vọng chức vị
 * (`danhVongHienThi` chỉ cộng khi còn giữ chức).
 */
export function roiPhai(d: TrangThaiGame, cach: LichSuMonPhai['cach_roi']): void {
  const mp = d.nhan_vat.mon_phai
  if (!mp) return
  d.nhan_vat.lich_su_mon_phai.push({
    ma: mp.ma,
    tu_tuoi: mp.tu_tuoi,
    den_tuoi: d.nhan_vat.tuoi,
    cach_roi: cach,
  })
  d.nhan_vat.mon_phai = null
  delete d.nhan_vat.co_su_kien[CO_TAP_DICH]
  delete d.nhan_vat.co_su_kien[CO_MAT_TRO_CAP]
}

// ======================================================================
// Thăng cấp (HS04 I.1)
// ======================================================================

const maThuThach = (bac: number): string => `thang_bac_${bac}`

/**
 * Sự kiện thử thách thăng cấp đến hạn mở trong năm, hoặc null.
 * Đủ tuổi + Cống hiến theo BAC_YEU_CAU, đã qua 1 năm kể từ lần thất bại gần nhất.
 * Bậc 5 chỉ qua sự kiện Kế Vị (HS04 II.3), không ở đây.
 */
export function suKienThuThach(d: TrangThaiGame, dl: DuLieu): string | null {
  const mp = d.nhan_vat.mon_phai
  if (!mp) return null
  const ke = mp.bac + 1
  const yc = BAC_YEU_CAU[ke]
  if (!yc || ke >= BAC_CHUONG_MON) return null
  if (d.nhan_vat.tuoi < yc.tuoi || mp.cong_hien < yc.cong_hien) return null
  if (mp.nam_truot !== undefined && d.nhan_vat.tuoi <= mp.nam_truot) return null
  const ma = maThuThach(ke)
  return dl.su_kien?.[ma] ? ma : null
}

/**
 * Ghi kết quả khi sự kiện `thang_bac_N` kết thúc: thắng khi bậc đã lên N (nhánh sự kiện đặt `thang_bac`).
 * Thắng: +100 Cống hiến, +Danh vọng. Thất bại: thử lại sau 1 năm; 2 lần liên tiếp -50 Cống hiến;
 * Bậc 4 thất bại thì trợ cấp lần tới bằng 0. (Hảo cảm đồng môn -10 và NPC tử trận chờ NPC ở M2.)
 */
export function ghiKetQuaThuThach(d: TrangThaiGame, dl: DuLieu, ma: string): DongBienNien[] {
  const m = /^thang_bac_(\d)$/.exec(ma)
  const mp = d.nhan_vat.mon_phai
  if (!m || !mp) return []
  const n = Number(m[1])

  if (mp.bac >= n) {
    mp.cong_hien += CONG_HIEN_THANG_CAP
    mp.truot_cap = 0
    delete mp.nam_truot
    congChiSo(dl, d.nhan_vat, 'danh_vong', DANH_VONG_THANG_CAP)
    return [dong(d, `Bạn vượt qua thử thách, thăng lên Bậc ${n} của ${tenPhai(dl, mp.ma)}.`)]
  }

  const cacDong: DongBienNien[] = [
    dong(d, 'Bạn chưa vượt qua thử thách thăng cấp, một năm nữa mới được thử lại.'),
  ]
  mp.nam_truot = d.nhan_vat.tuoi
  mp.truot_cap = (mp.truot_cap ?? 0) + 1
  if (mp.truot_cap >= 2) {
    mp.cong_hien = Math.max(0, mp.cong_hien - CONG_HIEN_TRUOT_2_LAN)
    mp.truot_cap = 0
    cacDong.push(dong(d, `Thất bại hai lần liên tiếp, đồng môn coi thường (Cống hiến -${CONG_HIEN_TRUOT_2_LAN}).`))
  }
  if (n === 4) {
    d.nhan_vat.co_su_kien[CO_MAT_TRO_CAP] = true
    cacDong.push(dong(d, 'Môn phái chịu thiệt hại vì bạn không giải cứu được nguy nan, trợ cấp sang năm bằng 0.'))
  }
  return cacDong
}

// ======================================================================
// Hành động và vòng năm
// ======================================================================

/** HS04 I.1: Sai phái sư môn (Bậc 2 - 4), thất bại chỉ mất thù lao, không Trọng thương. */
export function saiPhaiSuMon(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
): { dong_moi: DongBienNien[]; loi: string | null } {
  const bac = d.nhan_vat.mon_phai?.bac ?? 0
  const cau = SAI_PHAI[bac]
  if (!cau) return { dong_moi: [], loi: 'khong_du_bac' }
  if (!giaoChienNhanh(d, rng, cau.nguong, dl)) {
    return { dong_moi: [dong(d, 'Việc sư môn giao không trọn, đồng môn đưa bạn về tay trắng.')], loi: null }
  }
  const tien = rng.nguyen(cau.thu_lao[0], cau.thu_lao[1])
  d.nhan_vat.ngan_luong += tien
  return { dong_moi: [dong(d, `Hoàn thành việc sư môn giao, nhận ${tien} lạng thù lao.`)], loi: null }
}

/** HS06 II.1: Trợ cấp đệ tử môn phái theo bậc (vòng năm bước 3). Chưởng môn hưởng Bổng lộc, không ở đây. */
export function troCapNam(d: TrangThaiGame): DongBienNien[] {
  const mp = d.nhan_vat.mon_phai
  const tro = mp ? TRO_CAP[mp.bac] : undefined
  if (!tro) return []
  if (d.nhan_vat.co_su_kien[CO_MAT_TRO_CAP]) {
    delete d.nhan_vat.co_su_kien[CO_MAT_TRO_CAP]
    return [dong(d, 'Năm nay môn phái khốn đốn, bạn không nhận được trợ cấp.')]
  }
  d.nhan_vat.ngan_luong += tro
  return [dong(d, `Nhận ${tro} lạng trợ cấp của môn phái.`)]
}

/**
 * HS04 I.1: Ngoại môn quá 18 tuổi chưa lên Nội môn bị mời xuống núi, riêng Tạp dịch ở lại.
 * Chạy ở vòng năm bước 3, trước khi tăng tuổi (bước 8), nên "sắp quá 18" là `tuoi + 1 > 18`.
 */
export function moiXuongNui(d: TrangThaiGame, dl: DuLieu): DongBienNien[] {
  const mp = d.nhan_vat.mon_phai
  if (!mp || mp.bac !== 1) return []
  if (d.nhan_vat.co_su_kien[CO_TAP_DICH]) return []
  if (d.nhan_vat.tuoi + 1 <= TUOI_NGOAI_MON_TOI_DA) return []
  const ten = tenPhai(dl, mp.ma)
  roiPhai(d, 'truc_xuat')
  return [dong(d, `Quá tuổi mà chưa lên Nội môn, bạn bị ${ten} mời xuống núi.`)]
}

// ======================================================================
// Tàng Kinh Các (HS02 I, G19)
// ======================================================================

/** Võ học bán ở Tàng Kinh Các: cùng phái, tier không quá bậc hiện tại, chưa có, không nằm trong phần sư phụ truyền. */
export function hangTangKinhCac(
  d: TrangThaiGame,
  dl: DuLieu,
): { ma: string; gia: number }[] {
  const mp = d.nhan_vat.mon_phai
  const phai = mp && dl.mon_phai?.[mp.ma]
  if (!mp || !phai) return []
  const tierToiDa = TIER_THEO_BAC[mp.bac] ?? 1
  const daTruyen = new Set<string>()
  for (let b = 1; b <= mp.bac; b++) for (const ma of phai.vo_hoc_theo_bac[String(b)] ?? []) daTruyen.add(ma)
  return Object.values(dl.vo_hoc ?? {})
    .filter(
      (vh) =>
        vh.mon_phai === mp.ma &&
        vh.tier <= tierToiDa &&
        !d.nhan_vat.vo_hoc[vh.ma] &&
        !daTruyen.has(vh.ma),
    )
    .map((vh) => ({ ma: vh.ma, gia: GIA_TANG_KINH_CAC[vh.tier] ?? 0 }))
}

/** Đổi Cống hiến lấy một võ học ở Tàng Kinh Các. */
export function doiTangKinhCac(
  d: TrangThaiGame,
  dl: DuLieu,
  ma: string,
): { dong_moi: DongBienNien[]; loi: string | null } {
  const mp = d.nhan_vat.mon_phai
  if (!mp) return { dong_moi: [], loi: 'chua_co_mon_phai' }
  const hang = hangTangKinhCac(d, dl).find((h) => h.ma === ma)
  if (!hang) return { dong_moi: [], loi: 'khong_ban_o_tang_kinh_cac' }
  if (mp.cong_hien < hang.gia) return { dong_moi: [], loi: 'khong_du_cong_hien' }
  mp.cong_hien -= hang.gia
  return { dong_moi: hocVoHoc(d, dl, ma), loi: null }
}
