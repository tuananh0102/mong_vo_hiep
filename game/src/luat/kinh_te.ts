// HS06 II.1 - II.4, III; HS06 I.1 (Chữa kịp thời): Kinh tế cơ bản, Nợ, chợ, đan dược trị thương
import type { DuLieu, HieuUng } from '../du_lieu/luoc_do'
import { congChiSo } from './chi_so'
import { danhVongHienThi, hpMax, noiTucMax } from './cong_thuc'
import { giaoChienNhanh } from './giao_chien_nhanh'
import {
  AP_TIEU,
  BAO_QUAN_THANH_DANH,
  DOI_NO_HP,
  DOI_NO_NGUONG,
  DOI_NO_THANH_DANH,
  GIA_PHONG_TRO,
  GIA_THUOC_NOI_THUONG,
  KHANG_HAN_NAM,
  KHANG_HAN_THUOC,
  KHANG_THUOC,
  KHAU_TRU_NO,
  LAI_NO,
  NO_QUA_HAN_BAO_QUAN,
  NO_QUA_HAN_DOI_NO,
  SINH_HOAT_PHI,
  SINH_HOAT_PHI_TRAN_MON_PHAI,
  TEN_CHU_NO,
  TRUY_NA,
  TUOI_SINH_HOAT_PHI,
  TUOI_THU_NHAP_GIA_DINH_MAX,
} from './hang_so'
import { apHieuUng } from './hieu_ung'
import type { DongBienNien, TrangThaiGame } from './kieu'
import type { Rng } from './rng'
import { moTranTuSuKien } from './tam_hiep/mo_tran'

/** Chủ nợ của sinh hoạt phí (HS06 II.2 "Không đủ tiền thì ghi thành Nợ"). */
export const CHU_NO_SINH_HOAT = 'chu_tro'
/** Chủ nợ của tiền đền khi mất tiêu (HS06 II.1 Áp Tiêu). */
export const CHU_NO_TIEU_CUC = 'tieu_cuc'

const dong = (d: TrangThaiGame, van_ban: string): DongBienNien => ({
  tuoi: d.nhan_vat.tuoi,
  van_ban,
  loai_hien_thi: 'thuong',
})

const tenChuNo = (ma: string): string => TEN_CHU_NO[ma] ?? ma

export const tongNo = (d: TrangThaiGame): number =>
  Object.values(d.nhan_vat.no).reduce((t, k) => t + k.goc, 0)

// ======================================================================
// Thu và chi (HS06 II.3)
// ======================================================================

/**
 * Mọi khoản thu đi qua đây. Còn Nợ thì chủ nợ thu trước 50% (làm tròn xuống), trả lần lượt theo thứ tự vay,
 * không trả quá số Nợ. `nguon` là tên nguồn thu để ghi vào Biên Niên Sử khi có khấu trừ.
 */
export function thu(
  d: TrangThaiGame,
  so: number,
  nguon: string,
): { nhan: number; tra_no: number; dong_moi: DongBienNien[] } {
  const nv = d.nhan_vat
  const cacDong: DongBienNien[] = []
  let traNo = 0
  let conPhaiTra = Math.min(Math.floor(so * KHAU_TRU_NO), tongNo(d))
  for (const [chu, kn] of Object.entries(nv.no)) {
    if (conPhaiTra <= 0) break
    const tra = Math.min(kn.goc, conPhaiTra)
    kn.goc -= tra
    conPhaiTra -= tra
    traNo += tra
    cacDong.push(dong(d, `${nguon}: ${tenChuNo(chu)} thu trước ${tra} lạng nợ.`))
    if (kn.goc <= 0) delete nv.no[chu]
  }
  const nhan = so - traNo
  nv.ngan_luong += nhan
  return { nhan, tra_no: traNo, dong_moi: cacDong }
}

/** Chi tiền: đủ thì trừ, thiếu thì phần thiếu thành Nợ của `chuNo` (giữ năm vay cũ nếu đã nợ). */
export function chi(d: TrangThaiGame, so: number, chuNo: string): { tra: number; no_them: number } {
  const nv = d.nhan_vat
  const tra = Math.min(nv.ngan_luong, so)
  const thieu = so - tra
  nv.ngan_luong -= tra
  if (thieu > 0) {
    const cu = nv.no[chuNo]
    nv.no[chuNo] = { goc: (cu?.goc ?? 0) + thieu, nam_vay: cu?.nam_vay ?? nv.tuoi }
  }
  return { tra, no_them: thieu }
}

// ======================================================================
// Vòng năm bước 3 - 5
// ======================================================================

/** Bước 3 (HS06 II.4): thu nhập gia đình đến hết 15 tuổi. Cờ `gia_dao_suy_vi` cắt khoản này. */
export function thuNhapGiaDinh(d: TrangThaiGame, dl: DuLieu): DongBienNien[] {
  const nv = d.nhan_vat
  if (nv.tuoi > TUOI_THU_NHAP_GIA_DINH_MAX || nv.co_su_kien['gia_dao_suy_vi']) return []
  const so = dl.gia_canh?.[nv.gia_canh]?.thu_nhap_gia_dinh ?? 0
  if (so <= 0) return []
  const kq = thu(d, so, 'Gia đình')
  return [dong(d, `Gia đình cấp ${so} lạng trong năm.`), ...kq.dong_moi]
}

/** HS06 II.2: sinh hoạt phí theo Danh vọng hiển thị; còn ở môn phái thì trần 50. */
export function sinhHoatPhi(d: TrangThaiGame): number {
  const dv = danhVongHienThi(d.nhan_vat)
  const phi = SINH_HOAT_PHI.find((m) => dv >= m.danh_vong)?.phi ?? 0
  return d.nhan_vat.mon_phai ? Math.min(phi, SINH_HOAT_PHI_TRAN_MON_PHAI) : phi
}

/** Bước 4 (HS06 II.2): trừ sinh hoạt phí từ 16 tuổi, thiếu thì ghi Nợ. */
export function chiSinhHoat(d: TrangThaiGame): DongBienNien[] {
  if (d.nhan_vat.tuoi < TUOI_SINH_HOAT_PHI) return []
  const phi = sinhHoatPhi(d)
  const kq = chi(d, phi, CHU_NO_SINH_HOAT)
  const cacDong = [dong(d, `Sinh hoạt phí trong năm tốn ${phi} lạng.`)]
  if (kq.no_them > 0) cacDong.push(dong(d, `Không đủ tiền, thiếu ${kq.no_them} lạng ghi thành nợ.`))
  return cacDong
}

/**
 * Bước 5 (HS06 II.3): lãi 20% (không tính cho khoản vay trong chính năm nay), rồi chủ nợ quá hạn ra tay.
 * GIẢ ĐỊNH (M1-13): "quá hạn n năm" tính từ năm vay (`nam_vay`), không có kỳ hạn ân hạn.
 * Từ 3 năm: đòi nợ mỗi năm `[Giao chiến nhanh: 40]`, thua mất 30% HP tối đa và Thanh danh -30.
 * Đúng 5 năm: báo quan, Thanh danh -100 (một lần, cờ `bao_quan_<chủ nợ>`).
 */
export function xuLyNo(d: TrangThaiGame, rng: Rng, dl: DuLieu): DongBienNien[] {
  const nv = d.nhan_vat
  const cacDong: DongBienNien[] = []
  for (const [chu, kn] of Object.entries(nv.no)) {
    if (kn.nam_vay < nv.tuoi) kn.goc = Math.round(kn.goc * (1 + LAI_NO))
    const quaHan = nv.tuoi - kn.nam_vay
    if (quaHan >= NO_QUA_HAN_DOI_NO) {
      if (giaoChienNhanh(d, rng, DOI_NO_NGUONG, dl)) {
        cacDong.push(dong(d, `Người của ${tenChuNo(chu)} đến đòi nợ, bạn đánh đuổi được chúng.`))
      } else {
        nv.hp = Math.max(1, nv.hp - Math.round(hpMax(nv, dl) * DOI_NO_HP))
        congChiSo(dl, nv, 'thanh_danh', -DOI_NO_THANH_DANH)
        cacDong.push(
          dong(d, `Người của ${tenChuNo(chu)} đến đòi nợ, bạn bị đánh trọng thương và mất mặt (Thanh danh -${DOI_NO_THANH_DANH}).`),
        )
      }
    }
    const co = `bao_quan_${chu}`
    if (quaHan >= NO_QUA_HAN_BAO_QUAN && !nv.co_su_kien[co]) {
      nv.co_su_kien[co] = true
      congChiSo(dl, nv, 'thanh_danh', -BAO_QUAN_THANH_DANH)
      cacDong.push(dong(d, `${tenChuNo(chu)} báo quan, bạn bị truy nã như kẻ quỵt nợ (Thanh danh -${BAO_QUAN_THANH_DANH}).`))
    }
  }
  return cacDong
}

// ======================================================================
// Hành động kiếm tiền (HS06 II.1)
// ======================================================================

type KetQuaHd = { dong_moi: DongBienNien[]; loi: string | null }

/** Áp Tiêu: thù lao 100 - 300; 35% gặp cướp `[Giao chiến nhanh: 50]`, thua mất thù lao và đền gấp đôi (thiếu ghi Nợ). */
export function apTieu(d: TrangThaiGame, rng: Rng, dl: DuLieu): KetQuaHd {
  const tien = rng.nguyen(AP_TIEU.thu_lao[0], AP_TIEU.thu_lao[1])
  if (!rng.trung(AP_TIEU.p_cuop)) {
    const kq = thu(d, tien, 'Áp tiêu')
    return { dong_moi: [dong(d, `Chuyến tiêu êm xuôi, nhận ${tien} lạng thù lao.`), ...kq.dong_moi], loi: null }
  }
  if (giaoChienNhanh(d, rng, AP_TIEU.nguong, dl)) {
    const kq = thu(d, tien, 'Áp tiêu')
    congChiSo(dl, d.nhan_vat, 'danh_vong', AP_TIEU.danh_vong)
    return {
      dong_moi: [
        dong(d, `Gặp sơn tặc cướp tiêu, bạn đánh lui chúng, giữ trọn ${tien} lạng thù lao (Danh vọng +${AP_TIEU.danh_vong}).`),
        ...kq.dong_moi,
      ],
      loi: null,
    }
  }
  const den = tien * AP_TIEU.den_gap
  const kq = chi(d, den, CHU_NO_TIEU_CUC)
  const cacDong = [dong(d, `Mất tiêu về tay sơn tặc, không có thù lao, lại phải đền ${den} lạng.`)]
  if (kq.no_them > 0) cacDong.push(dong(d, `Không đủ tiền đền, thiếu ${kq.no_them} lạng ghi thành nợ tiêu cục.`))
  return { dong_moi: cacDong, loi: null }
}

/** Nghỉ trọ (HS06 II.2): 20 lạng, hồi đầy HP và Nội tức. Không xóa Trọng thương (HS06 I.1: chỉ thuốc hoặc dưỡng thương). */
export function nghiTro(d: TrangThaiGame, dl: DuLieu): KetQuaHd {
  const nv = d.nhan_vat
  if (nv.ngan_luong < GIA_PHONG_TRO) return { dong_moi: [], loi: 'khong_du_ngan_luong' }
  nv.ngan_luong -= GIA_PHONG_TRO
  nv.hp = hpMax(nv, dl)
  nv.noi_tuc = noiTucMax(nv, dl)
  return { dong_moi: [dong(d, `Thuê phòng trọ thượng hạng nghỉ ngơi (${GIA_PHONG_TRO} lạng), thể lực hồi đầy.`)], loi: null }
}

/** Săn Tiền Thưởng: mở Tam Hiệp sinh tử với tội phạm theo hạng. Tiền thưởng và Hiệp nghĩa +40 trả ở `ketThucTran`. */
export function sanTienThuong(d: TrangThaiGame, rng: Rng, dl: DuLieu, hang: string): KetQuaHd {
  const h = TRUY_NA[hang]
  if (!h) return { dong_moi: [], loi: 'hang_khong_hop_le' }
  d.cho = {
    loai: 'tam_hiep',
    tran: moTranTuSuKien(
      d,
      rng,
      dl,
      {
        su_kien: '',
        lua_chon: '',
        doi_thu: 'toi_pham',
        hang: 'truong_lao',
        bien: { toi_pham: 'Tội phạm truy nã' },
        truy_na: hang,
      },
      'sinh_tu',
      { suc: h.suc, cap_them: h.cap_them },
    ),
  }
  return { dong_moi: [dong(d, 'Bạn nhận lệnh truy nã của Lục Phiến Môn và lần theo dấu tội phạm.')], loi: null }
}

// ======================================================================
// Chợ và đan dược (HS06 III)
// ======================================================================

/** Lệnh `mua`: chợ miễn phí 0 AP, chỉ bán vật phẩm `ban_o: "cho"`, không đủ tiền thì không mua (không vay). */
export function mua(d: TrangThaiGame, dl: DuLieu, ma: string, soLuong: number): KetQuaHd {
  const vp = dl.vat_pham?.[ma]
  if (!vp || vp.ban_o !== 'cho') return { dong_moi: [], loi: 'khong_ban_o_cho' }
  if (!Number.isInteger(soLuong) || soLuong < 1) return { dong_moi: [], loi: 'so_luong_khong_hop_le' }
  const tong = vp.gia * soLuong
  if (d.nhan_vat.ngan_luong < tong) return { dong_moi: [], loi: 'khong_du_ngan_luong' }
  d.nhan_vat.ngan_luong -= tong
  d.nhan_vat.hanh_trang[ma] = (d.nhan_vat.hanh_trang[ma] ?? 0) + soLuong
  return { dong_moi: [dong(d, `Mua ${soLuong} ${vp.ten} ở chợ, tốn ${tong} lạng.`)], loi: null }
}

/** Hiệu ứng đan dược nhân hệ số Kháng Thuốc `f` (chỉ `cong`, `cong_phan_tram`). */
function nhanHieuUng(hu: HieuUng, f: number): HieuUng {
  const nhan = (m: Record<string, number>): Record<string, number> =>
    Object.fromEntries(Object.entries(m).map(([k, v]) => [k, Math.round(v * f)]))
  if ('cong' in hu) return { ...hu, cong: nhan(hu.cong) }
  if ('cong_phan_tram' in hu) return { ...hu, cong_phan_tram: nhan(hu.cong_phan_tram) }
  return hu
}

const CO_KHANG_HAN = 'khang_han_tam'
const CO_KHANG_HAN_HET = 'khang_han_tam_den_tuoi'

/** Hết hạn Kháng hàn tạm của thuốc (vòng năm bước 9, sau khi tăng tuổi). */
export function hetKhangHanTam(d: TrangThaiGame): void {
  const nv = d.nhan_vat
  const het = nv.co_su_kien[CO_KHANG_HAN_HET]
  if (typeof het !== 'number' || nv.tuoi < het) return
  const them = nv.co_su_kien[CO_KHANG_HAN]
  nv.khang_han = Math.max(0, nv.khang_han - (typeof them === 'number' ? them : 0))
  delete nv.co_su_kien[CO_KHANG_HAN]
  delete nv.co_su_kien[CO_KHANG_HAN_HET]
}

const khoaDaDung = (ma: string): string => `da_dung_${ma}`
const DAC_BIET_CHUA_CO = new Set(['chua_tan_phe', 'thien_vuong_bao_tam'])

/**
 * Lệnh `dung_vat_pham` cho đan dược ngoài trận. Kháng Thuốc (HS06 III) cho món `khang_thuoc`: lần 1 trọn,
 * lần 2 còn 50%, từ lần 3 vô tác dụng (vẫn mất thuốc). Thuốc hồi HP giá từ 350 lạng là thuốc trị nội thương: xóa Trọng thương.
 * Chưa có hiệu ứng ở M1: hóa giải độc, chữa tàn phế (M2), Thiên Vương Bảo Tâm Đan (mang theo, tự kích hoạt trong trận).
 */
export function dungVatPham(d: TrangThaiGame, dl: DuLieu, rng: Rng, ma: string): KetQuaHd {
  const nv = d.nhan_vat
  const vp = dl.vat_pham?.[ma]
  if (!vp || vp.loai !== 'dan_duoc') return { dong_moi: [], loi: 'khong_dung_duoc' }
  if ((nv.hanh_trang[ma] ?? 0) < 1) return { dong_moi: [], loi: 'khong_co_vat_pham' }
  if (vp.hieu_ung.length === 0 && vp.dac_biet.every((x) => DAC_BIET_CHUA_CO.has(x))) {
    return { dong_moi: [], loi: 'khong_dung_duoc' }
  }

  const lan = nv.co_su_kien[khoaDaDung(ma)]
  const soLan = typeof lan === 'number' ? lan : 0
  const f = vp.khang_thuoc ? (KHANG_THUOC[soLan] ?? 0) : 1
  if (vp.khang_thuoc) nv.co_su_kien[khoaDaDung(ma)] = soLan + 1
  nv.hanh_trang[ma] = (nv.hanh_trang[ma] ?? 0) - 1
  if (nv.hanh_trang[ma] <= 0) delete nv.hanh_trang[ma]

  if (f === 0) {
    return { dong_moi: [dong(d, `Bạn uống ${vp.ten} nhưng cơ thể đã quen thuốc, không còn tác dụng.`)], loi: null }
  }

  const cacDong: DongBienNien[] = []
  const hoiHp = vp.hieu_ung.some((hu) => 'cong_phan_tram' in hu && (hu.cong_phan_tram['hp'] ?? 0) > 0)
  for (const hu of vp.hieu_ung) cacDong.push(...apHieuUng(nhanHieuUng(hu, f), d, rng, dl))
  for (const tag of vp.dac_biet) {
    const m = /^tang_noi_tuc_max_(\d+)$/.exec(tag)
    if (m) nv.noi_tuc_cong_them += Math.round(Number(m[1]) * f)
    else if (tag === 'xoa_toan_bo_am_thuong') nv.am_thuong = 0
    else if (tag === 'keo_dai_tuoi_tho_10') nv.tuoi_tho_cong_them += 10
    else if (tag === 'khang_han_30_10_nam') {
      // HS06 III: +30% Kháng hàn trong 10 năm; dùng tiếp thì cộng dồn và gia hạn
      const them = Math.round(KHANG_HAN_THUOC * f)
      nv.khang_han += them
      const cu = nv.co_su_kien[CO_KHANG_HAN]
      nv.co_su_kien[CO_KHANG_HAN] = (typeof cu === 'number' ? cu : 0) + them
      nv.co_su_kien[CO_KHANG_HAN_HET] = nv.tuoi + KHANG_HAN_NAM
    }
  }
  if (hoiHp && vp.gia >= GIA_THUOC_NOI_THUONG) nv.trong_thuong = false
  const moTa = f < 1 ? ` (hiệu quả còn ${Math.round(f * 100)}% vì đã quen thuốc)` : ''
  cacDong.unshift(dong(d, `Bạn uống ${vp.ten}${moTa}.`))
  return { dong_moi: cacDong, loi: null }
}
