// 01 mục 5.4: Pipeline "+1 Tuổi" gồm 15 bước theo đúng thứ tự cố định.
import type { DuLieu } from '../du_lieu/luoc_do'
import type { DongBienNien, TrangThaiGame } from './kieu'
import type { Rng } from './rng'

type HamBuoc = (d: TrangThaiGame, rng: Rng, dl: DuLieu) => DongBienNien[]

// --- A. Khép lại năm cũ (tuổi T) ---

// Bước 1: Gộp việc [Ám] vặt của năm thành 1 việc (HS01 II.3). (M2-06)
const b1_gopViecAm: HamBuoc = () => []

// Bước 2: Trọng thương chưa chữa trong năm: dưỡng thương [Roll: Căn cốt vs 50], thất bại am_thuong += 5 (HS06 I.1). (M1-15)
const b2_duongThuong: HamBuoc = () => []

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

// --- B. Sang năm mới (tuổi T + 1) ---

// Bước 8: Tăng tuổi và năm thế giới (HS01 IV). Làm thật ngay (M0-09).
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

// Bước 9: Hiệu ứng theo năm của Thiên phú, Trạng thái, lão hóa Căn cốt (HS01 II.8, HS01 III.2, HS04 III, HS05 II.2). (M1-17)
const b9_hieuUngNam: HamBuoc = () => []

// Bước 10: Danh vọng ẩn cư / bế quan -5 (HS01 II.2). (M2)
const b10_danhVongAnCu: HamBuoc = () => []

// Bước 11: Chết vì hết tuổi thọ: tuoi >= tuoiThoMax(nv) (HS06 I.1). (M1-18)
const b11_hetTuoiTho: HamBuoc = () => []

// Bước 12: Hồi HP và Nội tức đầu năm (HS06 I.1, lỗ hổng G03). (M1-18)
const b12_hoiHpNoiTuc: HamBuoc = () => []

// Bước 13: Thế giới chạy 1 năm: NPC, xếp hạng, lịch Đại sự kiện, Hoa Sơn (HS01 V, HS05 I). (M2)
const b13_theGioiChay: HamBuoc = () => []

// Bước 14: Đặt AP năm mới = apMoiNam(tuoi, canh_gioi) - ap_bi_tru_nam_sau (HS01 IV). Tạm dùng hằng 2 (M0-09).
const b14_datApNamMoi: HamBuoc = (d) => {
  const apGoc = 2 // M0-09 tạm dùng 2; M1-04 thay bằng apMoiNam
  d.nhan_vat.ap_con_lai = Math.max(0, apGoc - d.nhan_vat.ap_bi_tru_nam_sau)
  d.nhan_vat.ap_bi_tru_nam_sau = 0
  d.nhan_vat.viec_mien_phi_con_lai = 2
  return []
}

// Bước 15: Chọn sự kiện năm mới (01 mục 5.6, HS06 I.3). (M1-18)
const b15_chonSuKienNam: HamBuoc = () => []

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
