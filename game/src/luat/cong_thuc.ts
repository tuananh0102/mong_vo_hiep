// Công thức toán học cốt lõi và chỉ số phái sinh của "Vạn Kiếp Giang Hồ".
// Nguồn: HS06 I.1, I.3, I.4, I.5; HS01 II.2, II.4, IV; HS02 II.1; HS04 III.
// Đối chiếu hàm Python ở mo_phong/mo_phong.py.

import type { DuLieu } from '../du_lieu/luoc_do'
import {
  CAC_CAP_KHAC,
  CL_CAN_COT,
  CL_CANH_GIOI,
  CL_CAP,
  CL_KHINH_CONG,
  CL_THAN_BINH,
  CL_TIER,
  CL_TUOI,
  DANH_VONG_CHUC,
  KHAC_NGUOC,
  KHAC_THUAN,
  LAO_HOA_CAO,
  LAO_HOA_CANH_GIOI,
  LAO_HOA_THUONG,
  TIER_FACTOR,
  UY_LUC,
} from './hang_so'
import type { NhanVat } from './kieu'

// ======================================================================
// 1. Thưởng HP theo tuổi & Sinh Mệnh tối đa (HS06 I.1)
// ======================================================================

/**
 * HS06 I.1 Bonus Độ Tuổi:
 * +5/năm từ 1 - 30 tuổi; giữ nguyên 150 từ 31 - 50; -8/năm sau 50 tuổi.
 * Đối chiếu Python: bonus_tuoi(tuoi).
 */
export function thuongHpTheoTuoi(tuoi: number): number {
  if (tuoi <= 30) {
    return 5 * tuoi
  }
  if (tuoi <= 50) {
    return 150
  }
  return 150 - 8 * (tuoi - 50)
}

/**
 * HS06 I.1: Sinh Mệnh Tối Đa (HP_max).
 * HP_max = 100 + (Căn Cốt * 12) + (Cấp Nội Công * 80) + Bonus Độ Tuổi.
 * Đối chiếu Python: VoGia.hp_max.
 */
export function tinhHpMax(canCot: number, canhGioi: number, tuoi: number): number {
  return 100 + canCot * 12 + canhGioi * 80 + thuongHpTheoTuoi(tuoi)
}

/**
 * HS06 I.1: Sinh Mệnh Tối Đa (HP_max) của nhân vật.
 */
export function hpMax(nv: NhanVat, dl?: DuLieu): number {
  void dl
  return tinhHpMax(nv.can_cot, canhGioiNoiCong(nv), nv.tuoi)
}

// ======================================================================
// 2. Nội Tức tối đa (HS06 I.1)
// ======================================================================

/**
 * HS06 I.1: Nội Tức Tối Đa (MP_max).
 * MP_max = 50 + (Căn Cốt * 8) + (Cấp Nội Công * 150) + Điểm Kỳ Ngộ.
 * Đối chiếu Python: VoGia.mp_max.
 */
export function tinhNoiTucMax(canCot: number, canhGioi: number, diemKyNgo = 0): number {
  return 50 + canCot * 8 + canhGioi * 150 + diemKyNgo
}

/**
 * HS06 I.1: Nội Tức Tối Đa (MP_max) của nhân vật.
 */
export function noiTucMax(nv: NhanVat, dl?: DuLieu): number {
  void dl
  return tinhNoiTucMax(nv.can_cot, canhGioiNoiCong(nv), nv.noi_tuc_cong_them ?? 0)
}

// ======================================================================
// 3. Tiến độ lĩnh ngộ võ học & Số AP lên 10 (HS06 I.1)
// ======================================================================

export interface TuyChonTienDo {
  daoNguoc?: boolean
  hanNgocSang?: boolean
}

/**
 * HS06 I.1: Tốc Độ Lĩnh Ngộ Võ Học (% của 1 cấp võ học cho 1 AP).
 * Tiến độ (%) = min(100%, (Ngộ Tính * 1.2 + Cấp Sư Phụ * 2) / Tier Factor).
 * Riêng Thái Huyền Kinh / Không Minh Quyền đảo ngược tử số thành (100 - Ngộ Tính) * 1.5.
 * Hàn Ngọc Sàng nhân đôi tiến độ.
 * Đối chiếu Python: tien_do(ngo_tinh, cap_su_phu, tier).
 */
export function tienDoMoiAp(
  ngoTinh: number,
  capSuPhu: number,
  tier: number,
  dacBiet?: TuyChonTienDo,
): number {
  const heSoTier = TIER_FACTOR[tier] ?? 1.0
  const tuSo = dacBiet?.daoNguoc
    ? (100 - ngoTinh) * 1.5 + capSuPhu * 2
    : ngoTinh * 1.2 + capSuPhu * 2
  let ketQua = tuSo / heSoTier
  if (dacBiet?.hanNgocSang) {
    ketQua *= 2
  }
  return Math.min(100.0, ketQua)
}

/**
 * HS06 I.1: Số AP để luyện 1 môn từ cấp 1 lên cấp 10 (9 lần lên cấp = 900% tiến độ).
 * Đối chiếu Python: ap_len_10(ngo_tinh, cap_su_phu, tier).
 */
export function apLen10(
  ngoTinh: number,
  capSuPhu: number,
  tier: number,
  dacBiet?: TuyChonTienDo,
): number {
  const td = tienDoMoiAp(ngoTinh, capSuPhu, tier, dacBiet)
  let tong = 0.0
  let ap = 0
  while (tong < 900) {
    tong += td
    ap += 1
  }
  return ap
}

// ======================================================================
// 4. Khắc chế hệ nội lực (HS06 I.4)
// ======================================================================

/**
 * HS06 I.4: Hệ số khắc chế giữa 2 hệ nội lực (dương, âm, hoa, ngoai).
 * Khắc thuận: 1.05; Khắc ngược: 0.95; Không khắc: 1.0.
 * Đối chiếu Python: khac_che(he_a, he_b).
 */
export function khacChe(heA: string, heB: string): number {
  const laKhacThuan = CAC_CAP_KHAC.some(([a, b]) => a === heA && b === heB)
  if (laKhacThuan) return KHAC_THUAN
  const laKhacNguoc = CAC_CAP_KHAC.some(([a, b]) => a === heB && b === heA)
  if (laKhacNguoc) return KHAC_NGUOC
  return 1.0
}

// ======================================================================
// 5. Tuổi thọ tối đa (HS06 I.1)
// ======================================================================

/**
 * HS06 I.1: Tuổi Thọ Tối Đa (Age_max).
 * Age_max = 65 + floor(min(Căn Cốt Đỉnh, 100) * 0.15) + Cảnh Giới Nội Công - Điểm Ám Thương + Tuổi Thọ Cộng Thêm.
 * Đối chiếu Python: Doi.age_max.
 */
export function tinhTuoiThoMax(
  canCotDinh: number,
  canhGioi: number,
  amThuong: number,
  tuoiThoCongThem = 0,
): number {
  return 65 + Math.floor(Math.min(canCotDinh, 100) * 0.15) + canhGioi - amThuong + tuoiThoCongThem
}

/**
 * HS06 I.1: Tuổi Thọ Tối Đa của nhân vật.
 */
export function tuoiThoMax(nv: NhanVat, dl?: DuLieu): number {
  void dl
  return tinhTuoiThoMax(
    nv.can_cot_dinh,
    canhGioiNoiCong(nv),
    nv.am_thuong,
    nv.tuoi_tho_cong_them ?? 0,
  )
}

// ======================================================================
// 6. Cảnh giới Nội công, Hệ nội lực & Cấp Khinh công (HS01 II.4)
// ======================================================================

/**
 * HS01 II.4: Cảnh Giới Nội Công (Cấp 0 - 10).
 * Cấp của môn Tâm pháp chủ đạo đang trang bị (0 nếu chưa có).
 */
export function canhGioiNoiCong(nv: NhanVat): number {
  const ma = nv.trang_bi.noi_cong
  if (!ma) return 0
  return nv.vo_hoc[ma]?.cap ?? 0
}

/**
 * HS01 II.4: Hệ Nội Lực (Chí Dương, Chí Âm, Trung Hòa, Ngoại công).
 * Thuộc tính của Tâm pháp chủ đạo đang trang bị; không trang bị thì là 'ngoai'.
 */
export function heNoiLuc(nv: NhanVat, dl?: DuLieu): 'duong' | 'am' | 'hoa' | 'ngoai' {
  const ma = nv.trang_bi.noi_cong
  if (!ma || !dl?.vo_hoc) return 'ngoai'
  const vh = dl.vo_hoc[ma]
  return vh?.he_noi_luc ?? 'ngoai'
}

/**
 * HS01 II.4: Cấp Khinh Công (Cấp 0 - 10).
 * Cấp của môn Khinh công đang trang bị (0 nếu chưa có).
 */
export function capKhinhCong(nv: NhanVat): number {
  const ma = nv.trang_bi.khinh_cong
  if (!ma) return 0
  return nv.vo_hoc[ma]?.cap ?? 0
}

// ======================================================================
// 7. Võ Lực & Chiến Lực (HS06 I.1, HS06 I.5)
// ======================================================================

/**
 * Tìm môn ngoại công tốt nhất và cấp của nó để tính Võ Lực / Chiến Lực.
 * Tiêu chí HS06 I.4, I.5: uy lực chiêu thức UY_LUC[tier] * (1 + cap / 5) lớn nhất.
 */
function timMonNgoaiCongTotNhat(
  nv: NhanVat,
  dl?: DuLieu,
): { ma: string | null; tier: number; capVo: number } {
  const dsNgoaiCong = nv.trang_bi.ngoai_cong.length > 0
    ? nv.trang_bi.ngoai_cong
    : Object.keys(nv.vo_hoc).filter((ma) => dl?.vo_hoc?.[ma]?.tru_cot === 'ngoai_cong')

  const monDau = dsNgoaiCong[0]
  if (!monDau) {
    const tatCaMon = Object.keys(nv.vo_hoc)
    const maDau = tatCaMon[0]
    if (maDau) {
      const vh = dl?.vo_hoc?.[maDau]
      return { ma: maDau, tier: vh?.tier ?? 1, capVo: nv.vo_hoc[maDau]?.cap ?? 1 }
    }
    return { ma: null, tier: 1, capVo: 0 }
  }

  let monTotNhat: string = monDau
  let uyLucCaoNhat = -1
  let tierTotNhat = 1
  let capTotNhat = 1

  for (const ma of dsNgoaiCong) {
    const vh = dl?.vo_hoc?.[ma]
    const cap = nv.vo_hoc[ma]?.cap ?? 1
    let tier = vh?.tier ?? 1

    // Ma công Tà phái khi Hiệp nghĩa <= -300: tính như Thần công SSS (Tier 4)
    const laMaCong =
      nv.hiep_nghia <= -300 &&
      (vh?.dac_biet?.includes('ma_cong') ||
        (vh?.mon_phai && dl?.mon_phai?.[vh.mon_phai]?.phe === 'ta' && vh.tier === 3))
    if (laMaCong) {
      tier = 4
    }

    const uyLucCoBan = UY_LUC[tier] ?? 210
    const uyLuc = uyLucCoBan * (1 + cap / 5)
    if (uyLuc > uyLucCaoNhat) {
      uyLucCaoNhat = uyLuc
      monTotNhat = ma
      tierTotNhat = tier
      capTotNhat = cap
    }
  }

  return { ma: monTotNhat, tier: tierTotNhat, capVo: capTotNhat }
}

/**
 * Trích xuất sát thương Thần binh từ trang bị binh khí của nhân vật (HS06 I.4, I.5).
 */
function laySatThuongThanBinh(nv: NhanVat, dl?: DuLieu): number {
  if (!nv.binh_khi || !dl?.vat_pham) return 0
  const vp = dl.vat_pham[nv.binh_khi]
  if (!vp) return 0

  for (const db of vp.dac_biet) {
    const khopThanBinh = db.match(/^(?:sat_thuong|than_binh)_(\d+)$/)
    if (khopThanBinh) {
      return Number(khopThanBinh[1])
    }
  }
  return 0
}

/**
 * HS06 I.1: Võ Lực (Thang 0 - 100).
 * Võ Lực = min(100, floor(Căn Cốt / 2) + Cấp Võ Học cao nhất * 5).
 * Đối chiếu Python: VoGia.vo_luc.
 */
export function tinhVoLuc(canCot: number, capVo: number): number {
  return Math.min(100, Math.floor(canCot / 2) + capVo * 5)
}

/**
 * HS06 I.1: Võ Lực của nhân vật.
 */
export function voLuc(nv: NhanVat, dl?: DuLieu): number {
  const { capVo } = timMonNgoaiCongTotNhat(nv, dl)
  return tinhVoLuc(nv.can_cot, capVo)
}

export interface ThamSoChienLuc {
  tier: number
  capVo: number
  canhGioi: number
  canCot: number
  tuoi: number
  khinhCong?: number
  thanBinh?: number
}

/**
 * HS06 I.5: Điểm Chiến Lực (Thiên Hạ Phong Vân Bảng).
 * Chiến Lực = Điểm Tier + 10 * Cấp Võ Học + 10 * Cảnh Giới + 2 * Căn Cốt
 *             + Thưởng HP theo tuổi / 10 + 5 * Cấp Khinh Công + Sát Thương Thần Binh / 5.
 * Đối chiếu Python: VoGia.chien_luc.
 */
export function tinhChienLuc(ts: ThamSoChienLuc): number {
  const diemTier = CL_TIER[ts.tier] ?? 0
  const khinhCong = ts.khinhCong ?? 0
  const thanBinh = ts.thanBinh ?? 0
  return (
    diemTier +
    CL_CAP * ts.capVo +
    CL_CANH_GIOI * ts.canhGioi +
    CL_CAN_COT * ts.canCot +
    thuongHpTheoTuoi(ts.tuoi) / CL_TUOI +
    CL_KHINH_CONG * khinhCong +
    thanBinh / CL_THAN_BINH
  )
}

/**
 * HS06 I.5: Điểm Chiến Lực của nhân vật.
 */
export function chienLuc(nv: NhanVat, dl?: DuLieu): number {
  const { tier, capVo } = timMonNgoaiCongTotNhat(nv, dl)
  const canhGioi = canhGioiNoiCong(nv)
  const khinhCong = capKhinhCong(nv)
  const thanBinh = laySatThuongThanBinh(nv, dl)
  return tinhChienLuc({
    tier,
    capVo,
    canhGioi,
    canCot: nv.can_cot,
    tuoi: nv.tuoi,
    khinhCong,
    thanBinh,
  })
}

// ======================================================================
// 8. AP mỗi năm theo độ tuổi & Cảnh giới (HS01 IV)
// ======================================================================

/**
 * HS01 IV: Điểm Hành Động (AP) mỗi năm.
 * 0 - 10 tuổi: 2 AP
 * 11 - 30 tuổi: 3 AP
 * 31 - 50 tuổi: 4 AP
 * 51 - 70 tuổi: 4 AP (nếu Cảnh giới >= 8) hoặc 3 AP
 * 71+ tuổi: 2 AP
 * Đối chiếu Python: ap_moi_nam(tuoi, canh_gioi).
 */
export function apMoiNam(tuoi: number, canhGioi: number): number {
  if (tuoi <= 10) {
    return 2
  }
  if (tuoi <= 30) {
    return 3
  }
  if (tuoi <= 50) {
    return 4
  }
  if (tuoi <= 70) {
    return canhGioi >= 8 ? 4 : 3
  }
  return 2
}

// ======================================================================
// 9. Tuổi bắt đầu lão hóa (HS04 III)
// ======================================================================

const CAC_MON_BAT_LAO = new Set([
  'dich_can_kinh',
  'cuu_duong_than_cong',
  'tien_thien_cong',
  'bat_hoang_luc_hop_duy_nga_doc_ton_cong',
  'bat_hoang_luc_hop_cong',
])

/**
 * HS04 III: Tuổi bắt đầu giảm Căn cốt do lão hóa (-2/năm).
 * Mặc định: sau 50 tuổi; Cảnh giới Nội công >= 8: sau 60 tuổi.
 * Không lão hóa nếu có Nội công Bất lão (Dịch Cân Kinh, Cửu Dương, Tiên Thiên, Bát Hoang).
 * Đối chiếu Python: tuoi_bat_dau_lao_hoa(canh_gioi).
 */
export function tinhTuoiBatDauLaoHoa(canhGioi: number): number {
  return canhGioi >= LAO_HOA_CANH_GIOI ? LAO_HOA_CAO : LAO_HOA_THUONG
}

/**
 * HS04 III: Tuổi bắt đầu lão hóa của nhân vật (xét cả môn không lão hóa).
 */
export function tuoiBatDauLaoHoa(canhGioi: number, nv?: NhanVat, dl?: DuLieu): number {
  if (nv) {
    // Kiểm tra nhân vật có học môn bất lão nào không
    for (const ma of Object.keys(nv.vo_hoc)) {
      if (CAC_MON_BAT_LAO.has(ma)) {
        return Infinity
      }
      const vh = dl?.vo_hoc?.[ma]
      if (vh?.dac_biet?.includes('bat_lao') || vh?.dac_biet?.includes('khong_lao_hoa')) {
        return Infinity
      }
    }
  }
  return tinhTuoiBatDauLaoHoa(canhGioi)
}

// ======================================================================
// 10. Số ô trang bị theo trụ cột (HS02 II.1)
// ======================================================================

export type TruCotVoHoc = 'noi_cong_chu_dao' | 'noi_cong_phu' | 'ngoai_cong' | 'khinh_cong' | 'tuyet_ky'

/**
 * HS02 II.1: Số ô trang bị theo từng trụ cột võ học.
 * - Nội Công chủ đạo: 1
 * - Nội Công phụ trợ: 0 (Ngộ tính < 40), 1 (40 - 69), 2 (>= 70)
 * - Ngoại Công: 2 + floor(Ngộ Tính / 25), tối đa 6 (+1 nếu có Song Thủ Hỗ Bác)
 * - Khinh Công: 1
 * - Tuyệt Kỹ: 1 + floor(Căn Cốt / 50), tối đa 3
 */
export function soO(nv: NhanVat, truCot: TruCotVoHoc, dl?: DuLieu): number {
  void dl
  switch (truCot) {
    case 'noi_cong_chu_dao':
      return 1
    case 'noi_cong_phu':
      if (nv.ngo_tinh < 40) return 0
      if (nv.ngo_tinh < 70) return 1
      return 2
    case 'ngoai_cong': {
      const coSongThuHoBac =
        nv.thien_phu.includes('song_thu_ho_bac') ||
        nv.nhan.includes('song_thu_ho_bac') ||
        Boolean(nv.co_su_kien?.song_thu_ho_bac)
      const coBan = Math.min(6, 2 + Math.floor(nv.ngo_tinh / 25))
      return coBan + (coSongThuHoBac ? 1 : 0)
    }
    case 'khinh_cong':
      return 1
    case 'tuyet_ky':
      return Math.min(3, 1 + Math.floor(nv.can_cot / 50))
  }
}

// ======================================================================
// 11. Danh vọng hiển thị (HS01 II.2)
// ======================================================================

/**
 * HS01 II.2: Danh Vọng Hiển Thị.
 * Danh vọng hiển thị = min(1000, Danh vọng cá nhân + Danh vọng chức vị).
 * Trưởng lão (bậc 4): +150; Chưởng môn / Giáo chủ (bậc 5): +300.
 * Đối chiếu Python: Doi.dv.
 */
export function danhVongHienThi(nv: NhanVat): number {
  const bac = nv.mon_phai?.bac ?? (nv.co_su_kien?.tu_lap_mon_phai ? 5 : 0)
  const congThem = DANH_VONG_CHUC[bac] ?? 0
  return Math.min(1000, Math.max(0, nv.danh_vong + congThem))
}

// ======================================================================
// 12. Tỷ lệ xuất hiện Kỳ Ngộ (HS06 I.3)
// ======================================================================

/**
 * HS06 I.3: Tỷ lệ xuất hiện Kỳ Ngộ Hiếm (P_KyNgo).
 * P_KyNgo = 2% + (Phúc Duyên * 0.12%) + Hệ Số Vùng Đất + Trạng Thái Tuyệt Cảnh.
 * Hệ Số Vùng Đất: Trung Nguyên (+0%), Giang Nam (+1%), Tây Vực / Nam Cương / Bắc Cảnh (+4%).
 * (M1: chưa có Tuyệt Cảnh).
 */
export function pKyNgo(nv: NhanVat, dl?: DuLieu): number {
  void dl
  let heSoVung = 0.0
  if (nv.vung === 'giang_nam') {
    heSoVung = 0.01
  } else if (nv.vung === 'tay_vuc' || nv.vung === 'nam_cuong' || nv.vung === 'bac_canh') {
    heSoVung = 0.04
  }
  return 0.02 + nv.phuc_duyen * 0.0012 + heSoVung
}
