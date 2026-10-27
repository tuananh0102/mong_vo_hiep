// HS02 II.1, II.2; HS06 I.1; HS05 IV.2: Võ học - học, luyện, ô trang bị và cảnh giới
import type { DuLieu, VoHoc } from '../du_lieu/luoc_do'
import { soO, tienDoMoiAp } from './cong_thuc'
import { danhGia } from './dieu_kien'
import { KHINH_CONG_TRAN, SU_PHU_THEO_BAC, TIER_THEO_BAC } from './hang_so'
import type { DongBienNien, MaO, NhanVat, TrangThaiGame } from './kieu'

/**
 * HS05 IV.2, HS02 II.1: Cấp tối đa của một môn võ học:
 * - Theo độ hoàn thiện bí kíp: Math.floor(hoan_thien / 10).
 * - Theo định nghĩa võ học (tran_cap).
 * - Theo trần Khinh công theo tier (HS02 II.1).
 */
export function capToiDaVoHoc(nv: NhanVat, dl: DuLieu, ma: string): number {
  const vh = dl.vo_hoc?.[ma]
  const daHoc = nv.vo_hoc[ma]
  if (!vh) return 10

  // 1. Trần cấp từ độ hoàn thiện của bí kíp (HS05 IV.2: hoàn thiện / 10)
  const tranHoanThien = daHoc ? Math.floor(daHoc.hoan_thien / 10) : 10

  // 2. Trần cấp từ định nghĩa võ học (mặc định 10)
  const tranDinhNghia = vh.tran_cap ?? 10

  // 3. Trần cấp Khinh công theo tier (HS02 II.1)
  const tranKhinhCong =
    vh.tru_cot === 'khinh_cong' ? (KHINH_CONG_TRAN[vh.tier] ?? 10) : 10

  return Math.min(tranHoanThien, tranDinhNghia, tranKhinhCong)
}

/**
 * HS02 dòng 20: Cấp võ học của sư phụ theo bậc đệ tử trong môn phái.
 * Sư phụ chỉ dạy nếu môn thuộc môn phái và tier <= tier sư phụ truyền ở bậc đó.
 * Tự học hoặc ngoài phái -> cấp sư phụ = 0.
 */
export function layCapSuPhu(d: TrangThaiGame, vh: VoHoc): number {
  if (!d.nhan_vat.mon_phai) return 0
  if (vh.mon_phai !== d.nhan_vat.mon_phai.ma) return 0

  const bac = d.nhan_vat.mon_phai.bac
  const tierChoPhep = TIER_THEO_BAC[bac] ?? 1
  if (vh.tier > tierChoPhep) return 0

  return SU_PHU_THEO_BAC[bac] ?? 0
}

/**
 * HS06 I.1: Học một môn võ công mới (mặc định cấp 1, hoàn thiện 100%).
 * HS02 II.1: Môn Nội công đầu tiên học được luôn tự động vào ô chủ đạo.
 */
export function hocVoHoc(
  d: TrangThaiGame,
  dl: DuLieu,
  ma: string,
  cap = 1,
  hoanThien = 100,
): DongBienNien[] {
  const vh = dl.vo_hoc?.[ma]
  if (!vh) return []

  const daCo = d.nhan_vat.vo_hoc[ma]
  if (daCo) {
    daCo.hoan_thien = Math.max(daCo.hoan_thien, hoanThien)
    daCo.cap = Math.max(daCo.cap, cap)
    return []
  }

  d.nhan_vat.vo_hoc[ma] = {
    cap,
    tien_do: 0,
    hoan_thien: hoanThien,
  }

  // HS02 II.1: Môn Nội công đầu tiên luôn tự động vào ô chủ đạo
  if (vh.tru_cot === 'noi_cong' && d.nhan_vat.trang_bi.noi_cong === null) {
    d.nhan_vat.trang_bi.noi_cong = ma
  }

  return [
    {
      tuoi: d.nhan_vat.tuoi,
      van_ban: `Bạn đã học được võ học ${vh.ten}.`,
      loai_hien_thi: 'thuong',
    },
  ]
}

/**
 * HS06 I.1: Luyện công tiêu tốn 1 AP.
 * - Cộng tiến độ mỗi AP theo tienDoMoiAp.
 * - Đủ 100% lên 1 cấp, phần dư giữ lại, tối đa 1 cấp mỗi AP.
 * - Không vượt capToiDa (hoan_thien / 10 và trần Khinh công theo tier).
 */
export function luyenCong(
  d: TrangThaiGame,
  dl: DuLieu,
  ma: string,
  tuyChon?: { capSuPhu?: number; daTruAp?: boolean },
): DongBienNien[] {
  const daHoc = d.nhan_vat.vo_hoc[ma]
  const vh = dl.vo_hoc?.[ma]
  if (!daHoc || !vh) return []

  const capToiDa = capToiDaVoHoc(d.nhan_vat, dl, ma)
  if (daHoc.cap >= capToiDa) {
    return [
      {
        tuoi: d.nhan_vat.tuoi,
        van_ban: `${vh.ten} đã đạt đến cảnh giới cao nhất hiện tại, không thể tăng tiến thêm.`,
        loai_hien_thi: 'thuong',
      },
    ]
  }

  // Trừ 1 AP (nếu chưa trừ trước đó)
  if (!tuyChon?.daTruAp) {
    d.nhan_vat.ap_con_lai = Math.max(0, d.nhan_vat.ap_con_lai - 1)
  }

  // Tính tiến độ nhận được cho 1 AP
  const capSuPhu = tuyChon?.capSuPhu ?? layCapSuPhu(d, vh)
  const daoNguoc =
    vh.dac_biet.includes('dao_nguoc') ||
    ma === 'thai_huyen_kinh' ||
    ma === 'khong_minh_quyen'
  const hanNgocSang =
    Boolean(d.nhan_vat.co_su_kien?.han_ngoc_sang) ||
    Boolean(d.nhan_vat.hanh_trang['han_ngoc_sang'])

  const td = tienDoMoiAp(d.nhan_vat.ngo_tinh, capSuPhu, vh.tier, {
    daoNguoc,
    hanNgocSang,
  })

  daHoc.tien_do += td

  // HS06 I.1: Đủ 100% lên 1 cấp, phần dư giữ lại, tối đa 1 cấp mỗi AP
  if (daHoc.tien_do >= 100) {
    daHoc.tien_do -= 100
    daHoc.cap += 1

    // Nếu đã chạm trần cấp sau khi tăng, dọn sạch tiến độ dư thừa
    if (daHoc.cap >= capToiDa) {
      daHoc.tien_do = 0
    }

    return [
      {
        tuoi: d.nhan_vat.tuoi,
        van_ban: `Bạn luyện ${vh.ten} lên tầng thứ ${daHoc.cap}.`,
        loai_hien_thi: 'thuong',
      },
    ]
  }

  return [
    {
      tuoi: d.nhan_vat.tuoi,
      van_ban: `Bạn chăm chỉ tu luyện ${vh.ten}, tiến độ tăng thêm ${td.toFixed(1)}%.`,
      loai_hien_thi: 'thuong',
    },
  ]
}

/**
 * HS02 II.1: Cập nhật ô trang bị sau mỗi thay đổi Ngộ tính / Căn cốt.
 * Mất ô thì tháo môn ở ô cuối (giữ nguyên cấp võ học, chỉ tháo trang bị).
 */
export function capNhatO(d: TrangThaiGame, dl: DuLieu): DongBienNien[] {
  const cacDong: DongBienNien[] = []

  // 1. Ô Ngoại Công (HS02 II.1)
  const oNgoaiCongToiDa = soO(d.nhan_vat, 'ngoai_cong', dl)
  while (d.nhan_vat.trang_bi.ngoai_cong.length > oNgoaiCongToiDa) {
    const monThao = d.nhan_vat.trang_bi.ngoai_cong.pop()!
    const tenMon = dl.vo_hoc?.[monThao]?.ten ?? monThao
    cacDong.push({
      tuoi: d.nhan_vat.tuoi,
      van_ban: `Do ngộ tính suy giảm, ô Ngoại công bị thu hẹp, môn ${tenMon} đã bị tháo khỏi ô trang bị.`,
      loai_hien_thi: 'thuong',
    })
  }

  // 2. Ô Tuyệt Kỹ (HS02 II.1)
  const oTuyetKyToiDa = soO(d.nhan_vat, 'tuyet_ky', dl)
  while (d.nhan_vat.trang_bi.tuyet_ky.length > oTuyetKyToiDa) {
    const monThao = d.nhan_vat.trang_bi.tuyet_ky.pop()!
    const tenMon = dl.vo_hoc?.[monThao]?.ten ?? monThao
    cacDong.push({
      tuoi: d.nhan_vat.tuoi,
      van_ban: `Do căn cốt suy giảm, ô Tuyệt kỹ bị thu hẹp, môn ${tenMon} đã bị tháo khỏi ô trang bị.`,
      loai_hien_thi: 'thuong',
    })
  }

  return cacDong
}

/**
 * HS02 II.1: Lệnh trang bị võ học, binh khí, giáp:
 * - Kiểm tra số ô theo soO.
 * - Đúng trụ cột.
 * - Đúng điều kiện (dieu_kien_hoc).
 * - Nếu môn đã trang bị trong mảng ngoại công/tuyệt kỹ: tháo ra.
 * - ma === null: tháo trang bị ô đó.
 */
export function trangBi(
  d: TrangThaiGame,
  dl: DuLieu,
  o: MaO,
  ma: string | null,
): DongBienNien[] {
  // Tháo trang bị
  if (ma === null) {
    if (o === 'noi_cong') {
      d.nhan_vat.trang_bi.noi_cong = null
    } else if (o === 'khinh_cong') {
      d.nhan_vat.trang_bi.khinh_cong = null
    } else if (o === 'ngoai_cong') {
      d.nhan_vat.trang_bi.ngoai_cong.pop()
    } else if (o === 'tuyet_ky') {
      d.nhan_vat.trang_bi.tuyet_ky.pop()
    } else if (o === 'binh_khi') {
      d.nhan_vat.binh_khi = null
    } else if (o === 'giap') {
      d.nhan_vat.giap = null
    }
    return []
  }

  // Trang bị Binh khí / Giáp
  if (o === 'binh_khi' || o === 'giap') {
    const sl = d.nhan_vat.hanh_trang[ma] ?? 0
    if (sl <= 0) return []
    const vp = dl.vat_pham?.[ma]
    if (!vp || vp.loai !== o) return []
    if (o === 'binh_khi') d.nhan_vat.binh_khi = ma
    if (o === 'giap') d.nhan_vat.giap = ma
    return []
  }

  // Trang bị Võ học
  const daHoc = d.nhan_vat.vo_hoc[ma]
  const vh = dl.vo_hoc?.[ma]
  if (!daHoc || !vh) return []

  // Kiểm tra điều kiện học / trang bị (ví dụ Song Thủ Hỗ Bác Ngộ tính < 40)
  if (vh.dieu_kien_hoc && !danhGia(vh.dieu_kien_hoc, d, dl)) {
    return [
      {
        tuoi: d.nhan_vat.tuoi,
        van_ban: `Bạn không đủ điều kiện để vận dụng ${vh.ten}.`,
        loai_hien_thi: 'thuong',
      },
    ]
  }

  // Kiểm tra đúng trụ cột
  if (vh.tru_cot !== o) {
    return [
      {
        tuoi: d.nhan_vat.tuoi,
        van_ban: `${vh.ten} không thuộc trụ cột ${o}, không thể trang bị vào ô này.`,
        loai_hien_thi: 'thuong',
      },
    ]
  }

  if (o === 'noi_cong') {
    d.nhan_vat.trang_bi.noi_cong = ma
    return []
  }

  if (o === 'khinh_cong') {
    d.nhan_vat.trang_bi.khinh_cong = ma
    return []
  }

  if (o === 'ngoai_cong') {
    // Nếu đã trang bị thì tháo ra
    if (d.nhan_vat.trang_bi.ngoai_cong.includes(ma)) {
      d.nhan_vat.trang_bi.ngoai_cong = d.nhan_vat.trang_bi.ngoai_cong.filter((m) => m !== ma)
      return []
    }
    // Kiểm tra số ô
    const oToiDa = soO(d.nhan_vat, 'ngoai_cong', dl)
    if (d.nhan_vat.trang_bi.ngoai_cong.length >= oToiDa) {
      return [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: `Đã hết ô Ngoại công trống (tối đa ${oToiDa} ô).`,
          loai_hien_thi: 'thuong',
        },
      ]
    }
    d.nhan_vat.trang_bi.ngoai_cong.push(ma)
    return []
  }

  if (o === 'tuyet_ky') {
    // Nếu đã trang bị thì tháo ra
    if (d.nhan_vat.trang_bi.tuyet_ky.includes(ma)) {
      d.nhan_vat.trang_bi.tuyet_ky = d.nhan_vat.trang_bi.tuyet_ky.filter((m) => m !== ma)
      return []
    }
    // Kiểm tra số ô
    const oToiDa = soO(d.nhan_vat, 'tuyet_ky', dl)
    if (d.nhan_vat.trang_bi.tuyet_ky.length >= oToiDa) {
      return [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: `Đã hết ô Tuyệt kỹ trống (tối đa ${oToiDa} ô).`,
          loai_hien_thi: 'thuong',
        },
      ]
    }
    d.nhan_vat.trang_bi.tuyet_ky.push(ma)
    return []
  }

  return []
}
