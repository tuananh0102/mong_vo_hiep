// 01 mục 5.4: Pipeline "+1 Tuổi" gồm 15 bước theo đúng thứ tự cố định.
import type { DuLieu } from '../du_lieu/luoc_do'
import {
  apMoiNam,
  canhGioiNoiCong,
  hpMax,
  noiTucMax,
  tuoiBatDauLaoHoa,
  tuoiThoMax,
} from './cong_thuc'
import { apHieuUng } from './hieu_ung'
import { lanRoll, pRoll } from './kiem_dinh'
import { chonSuKienNam } from './su_kien'
import type { DongBienNien, TrangThaiGame } from './kieu'
import type { Rng } from './rng'

type HamBuoc = (d: TrangThaiGame, rng: Rng, dl: DuLieu) => DongBienNien[]

// ======================================================================
// A. Khép lại năm cũ (tuổi T)
// ======================================================================

// Bước 1: Gộp việc [Ám] vặt của năm thành 1 việc (HS01 II.3). (M2-06)
const b1_gopViecAm: HamBuoc = () => []

/**
 * Bước 2: Trọng thương chưa chữa trong năm: dưỡng thương [Roll: Căn cốt vs 50],
 * thất bại am_thuong += 5 (HS06 I.1). Xóa cờ Trọng thương sau khi dưỡng thương.
 */
const b2_duongThuong: HamBuoc = (d, rng) => {
  if (!d.nhan_vat.trong_thuong) return []

  // Xóa cờ Trọng thương sau khi kết thúc năm
  d.nhan_vat.trong_thuong = false

  // Dưỡng thương: Roll Căn cốt vs 50
  const p = pRoll(d.nhan_vat.can_cot, 50, d.nhan_vat.phuc_duyen)
  const thanhCong = lanRoll(rng, p)

  if (!thanhCong) {
    d.nhan_vat.am_thuong += 5
    return [
      {
        tuoi: d.nhan_vat.tuoi,
        van_ban:
          'Trọng thương không chữa kịp, dưỡng thương thất bại, kinh mạch tổn hại (Ám thương +5).',
        loai_hien_thi: 'thuong',
      },
    ]
  }

  return [
    {
      tuoi: d.nhan_vat.tuoi,
      van_ban: 'Nằm tĩnh dưỡng chữa lành trọng thương, bảo toàn nguyên khí.',
      loai_hien_thi: 'thuong',
    },
  ]
}

// Bước 3: Thu nhập tự động: gia đình đến 15 tuổi (HS06 II.4), trợ cấp môn phái, bổng lộc, lợi tức sản nghiệp đã quản lý (HS06 II.1, II.5). (M1-16)
const b3_thuNhapTuDong: HamBuoc = () => []

// Bước 4: Chi tự động: sinh hoạt phí từ 16 tuổi (HS06 II.2), Hộ viện, bảo trì môn phái. Thiếu thì ghi Nợ. (M1-16)
const b4_chiTuDong: HamBuoc = () => []

// Bước 5: Nợ: lãi 20%, tăng số năm quá hạn, hẹn sự kiện đòi nợ (HS06 II.3). (M1-16)
const b5_laiNo: HamBuoc = () => []

// Bước 6: Tẩu hỏa nhập ma, Ma công phản phệ (HS06 I.4). (M2-05)
const b6_tauHoaNhapMa: HamBuoc = () => []

// Bước 7: Bại lộ hàng năm, Đại Vạch Trần (HS01 II.3). (M2-06, M2-07)
const b7_baiLoHangNam: HamBuoc = () => []

// ======================================================================
// B. Sang năm mới (tuổi T + 1)
// ======================================================================

/**
 * Bước 8: Tăng tuổi và năm thế giới (HS01 IV).
 */
const b8_tangTuoi: HamBuoc = (d) => {
  d.nhan_vat.tuoi += 1
  d.nam_the_gioi += 1
  return [
    {
      tuoi: d.nhan_vat.tuoi,
      van_ban: `Năm ${d.nhan_vat.tuoi} tuổi.`,
      loai_hien_thi: 'thuong',
    },
  ]
}

/**
 * Bước 9: Hiệu ứng theo năm của Thiên phú, Trạng thái, lão hóa Căn cốt (HS01 II.8, HS01 III.2, HS04 III).
 */
const b9_hieuUngNam: HamBuoc = (d, rng, dl) => {
  const cacDong: DongBienNien[] = []

  // 1. Hiệu ứng mỗi năm của Thiên phú
  for (const maTp of d.nhan_vat.thien_phu) {
    // HS01 III.2: Tư Chất Ngu Độn chỉ thưởng từ 0 đến 15 tuổi (16 năm, dừng sau 15 tuổi tức khi lên 17)
    if (maTp === 'tu_chat_ngu_don' && d.nhan_vat.tuoi > 16) {
      continue
    }

    const tp = dl.thien_phu[maTp]
    if (tp?.hieu_ung_moi_nam) {
      for (const hu of tp.hieu_ung_moi_nam) {
        const sinh = apHieuUng(hu, d, rng, dl)
        if (sinh.length > 0) cacDong.push(...sinh)
      }
    }
  }

  // 2. Hiệu ứng mỗi năm của Trạng thái & hết hạn trạng thái
  for (const [maTt, thongTin] of Object.entries(d.nhan_vat.trang_thai)) {
    if (thongTin.den_tuoi && d.nhan_vat.tuoi >= thongTin.den_tuoi) {
      delete d.nhan_vat.trang_thai[maTt]
      continue
    }

    const tt = dl.trang_thai?.[maTt]
    if (tt?.hieu_ung_moi_nam) {
      for (const hu of tt.hieu_ung_moi_nam) {
        const sinh = apHieuUng(hu, d, rng, dl)
        if (sinh.length > 0) cacDong.push(...sinh)
      }
    }
  }

  // 3. HS04 III: Lão hóa Căn cốt -2 mỗi năm từ sau tuoiBatDauLaoHoa (không xuống dưới 0)
  const mocLaoHoa = tuoiBatDauLaoHoa(canhGioiNoiCong(d.nhan_vat), d.nhan_vat, dl)
  if (d.nhan_vat.tuoi > mocLaoHoa) {
    d.nhan_vat.can_cot = Math.max(0, d.nhan_vat.can_cot - 2)
  }

  // Căn cốt đỉnh không giảm khi lão hóa, nhưng cập nhật nếu có hiệu ứng tăng
  d.nhan_vat.can_cot_dinh = Math.max(d.nhan_vat.can_cot_dinh, d.nhan_vat.can_cot)

  return cacDong
}

// Bước 10: Danh vọng ẩn cư / bế quan -5 (HS01 II.2). (M2)
const b10_danhVongAnCu: HamBuoc = () => []

/**
 * Bước 11: Chết vì hết tuổi thọ: tuoi >= tuoiThoMax(nv) (HS06 I.1).
 */
const b11_hetTuoiTho: HamBuoc = (d, _rng, dl) => {
  const maxTuoi = tuoiThoMax(d.nhan_vat, dl)
  if (d.nhan_vat.tuoi >= maxTuoi) {
    d.ket_thuc = { nguyen_nhan: 'tho_chung', tuoi: d.nhan_vat.tuoi }
    d.cho = { loai: 'chuyen_giai_doan', ma: 'van_bia' }
    return [
      {
        tuoi: d.nhan_vat.tuoi,
        van_ban: 'Tuổi thọ đã tận, bạn thanh thản tạ thế, kết thúc một đời phong vân.',
        loai_hien_thi: 'thuong',
      },
    ]
  }
  return []
}

/**
 * Bước 12: Hồi HP và Nội tức đầu năm (HS06 I.1, lỗ hổng G03).
 */
const b12_hoiHpNoiTuc: HamBuoc = (d, _rng, dl) => {
  const maxHp = hpMax(d.nhan_vat, dl)
  const maxMp = noiTucMax(d.nhan_vat, dl)

  // G03: Đang Trọng thương chưa chữa thì HP tối đa chỉ hồi 50%
  d.nhan_vat.hp = d.nhan_vat.trong_thuong ? Math.floor(maxHp * 0.5) : maxHp
  d.nhan_vat.noi_tuc = maxMp
  return []
}

// Bước 13: Thế giới chạy 1 năm: NPC, xếp hạng, lịch Đại sự kiện, Hoa Sơn (HS01 V, HS05 I). (M2)
const b13_theGioiChay: HamBuoc = () => []

/**
 * Bước 14: Đặt AP năm mới = apMoiNam(tuoi, canh_gioi) - ap_bi_tru_nam_sau (HS01 IV).
 * Hành động miễn phí (0 AP): 2 lần/năm từ 11 tuổi, 0 lần dưới 11 tuổi.
 */
const b14_datApNamMoi: HamBuoc = (d) => {
  const canhGioi = canhGioiNoiCong(d.nhan_vat)
  const apGoc = apMoiNam(d.nhan_vat.tuoi, canhGioi)
  d.nhan_vat.ap_con_lai = Math.max(0, apGoc - d.nhan_vat.ap_bi_tru_nam_sau)
  d.nhan_vat.ap_bi_tru_nam_sau = 0
  d.nhan_vat.viec_mien_phi_con_lai = d.nhan_vat.tuoi >= 11 ? 2 : 0
  return []
}

/**
 * Bước 15: Chọn sự kiện năm mới (01 mục 5.6, HS06 I.3).
 */
const b15_chonSuKienNam: HamBuoc = (d, rng, dl) => {
  return chonSuKienNam(d, rng, dl)
}

export interface ThongTinAp {
  ap_con_lai: number
  tong_ap_nam: number
  viec_mien_phi_con_lai: number
  nen_qua_nam: boolean
}

/**
 * Trích xuất thông tin AP cho Dock giao diện:
 * - Số AP còn lại.
 * - Tổng AP năm hiện tại.
 * - Số lượt hành động miễn phí (0 AP) còn lại.
 * - Cờ gợi ý "nên qua năm" khi đã dùng hết AP, hết việc miễn phí và không có quyết định chờ.
 */
export function xemAp(d: TrangThaiGame): ThongTinAp {
  const canhGioi = canhGioiNoiCong(d.nhan_vat)
  const tongAp = apMoiNam(d.nhan_vat.tuoi, canhGioi)
  const apConLai = d.nhan_vat.ap_con_lai
  const mienPhiConLai = d.nhan_vat.viec_mien_phi_con_lai
  const nenQuaNam = apConLai === 0 && mienPhiConLai === 0 && d.cho === null

  return {
    ap_con_lai: apConLai,
    tong_ap_nam: tongAp,
    viec_mien_phi_con_lai: mienPhiConLai,
    nen_qua_nam: nenQuaNam,
  }
}

/** Chạy pipeline qua năm gồm 15 bước theo thứ tự cố định. */
export function quaNam(d: TrangThaiGame, rng: Rng, dl: DuLieu): DongBienNien[] {
  const cacDong: DongBienNien[] = []
  const cacBuoc: HamBuoc[] = [
    b1_gopViecAm,
    b2_duongThuong,
    b3_thuNhapTuDong,
    b4_chiTuDong,
    b5_laiNo,
    b6_tauHoaNhapMa,
    b7_baiLoHangNam,
    b8_tangTuoi,
    b9_hieuUngNam,
    b10_danhVongAnCu,
    b11_hetTuoiTho,
    b12_hoiHpNoiTuc,
    b13_theGioiChay,
    b14_datApNamMoi,
    b15_chonSuKienNam,
  ]

  for (const buoc of cacBuoc) {
    const sinh = buoc(d, rng, dl)
    if (sinh.length > 0) cacDong.push(...sinh)
    // Nếu nhân vật chết ở bước 11 thì dừng pipeline
    if (d.ket_thuc !== null) break
  }

  return cacDong
}
