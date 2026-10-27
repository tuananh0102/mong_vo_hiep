// Hằng số lấy thẳng từ GDD. Mỗi dòng trích mục hồ sơ nguồn.
// Số chưa có trong GDD thì KHÔNG đặt ở đây, đặt ở gia_dinh.ts.

// HS06 I.1: Hệ số độ khó bí kíp (Tier factor)
export const TIER_FACTOR: Record<number, number> = {
  1: 1.0, // Nhập môn
  2: 2.0, // Thượng thừa
  3: 3.0, // Trấn phái
  4: 5.0, // Thần công SSS
}

// HS06 I.4: Khắc chế hệ nội lực
export const KHAC_THUAN = 1.05
export const KHAC_NGUOC = 0.95
export const CAC_CAP_KHAC: ReadonlyArray<readonly [string, string]> = [
  ['duong', 'am'],
  ['am', 'hoa'],
  ['hoa', 'duong'],
  ['am', 'ngoai'],
]

// HS06 I.4: Uy lực chiêu thức theo tier
export const UY_LUC: Record<number, number> = {
  1: 210, // Nhập môn
  2: 250, // Thượng thừa
  3: 280, // Trấn phái
  4: 320, // Thần công SSS
}

// HS06 I.5: Điểm Chiến Lực (Thiên Hạ Phong Vân Bảng)
export const CL_TIER: Record<number, number> = {
  1: 0,
  2: 20,
  3: 30,
  4: 45,
}
export const CL_CAP = 10
export const CL_CANH_GIOI = 10
export const CL_CAN_COT = 2
export const CL_TUOI = 10
export const CL_KHINH_CONG = 5
export const CL_THAN_BINH = 5

// HS01 II.2: Danh vọng chức vị (cộng thêm khi đang giữ chức)
export const DANH_VONG_CHUC: Record<number, number> = {
  4: 150, // Trưởng lão
  5: 300, // Chưởng môn / Giáo chủ
}

// HS04 III: Lão hóa
export const LAO_HOA_THUONG = 50
export const LAO_HOA_CAO = 60
export const LAO_HOA_CANH_GIOI = 8

// HS02 II.1: Trần cấp Khinh công theo tier
export const KHINH_CONG_TRAN: Record<number, number> = {
  1: 4,  // Nhập môn
  2: 6,  // Thượng thừa
  3: 8,  // Trấn phái
  4: 10, // Thần công SSS
}

// HS02 I: Cấp võ học của sư phụ theo bậc đệ tử trong môn phái
export const SU_PHU_THEO_BAC: Record<number, number> = {
  1: 6,
  2: 8,
  3: 10,
  4: 10,
  5: 10,
}

// HS02 I: Tier võ học tối đa sư phụ môn phái truyền theo bậc
export const TIER_THEO_BAC: Record<number, number> = {
  1: 1, // Nhập môn
  2: 2, // Thượng thừa
  3: 3, // Trấn phái
  4: 3,
  5: 3,
}

// HS06 I.4: Sát thương Quyết Đấu Tam Hiệp
export const HE_SO_THAM_DO = 1.0
export const HE_SO_NOI_TUC = 0.08
export const GIAM_TRU_MOI_CAN_COT = 0.003
export const GIAM_TRU_MOI_KHINH_CONG = 0.02
export const GIAM_TRU_TOI_DA = 0.50
export const BIEN_THIEN_SAT_THUONG = 0.10

// HS06 I.4 (chốt G18): Bạo kích và tiêu hao
export const BAO_KICH_CO_BAN = 0.10
export const BAO_KICH_HE_SO = 1.5
export const TIEU_HAO_MP_HIEP2 = 0.30

// HS02 V.1: Hệ số chiến thuật Hiệp 1
export const H1_TIEN_HA_THU = 1.1
export const H1_THUA_M1 = 0.9
export const H1_THUA_M2 = 1.0
export const H1_AN_BINH_GIAM_DICH = 0.95

// HS02 V.1: Khắc chế hướng tiếp cận Hiệp 1 (T: Tiên Hạ Thủ, Q: Án Binh, D: Thân Pháp)
export const KHAC_H1: Record<'T' | 'Q' | 'D', 'T' | 'Q' | 'D'> = {
  T: 'Q',
  Q: 'D',
  D: 'T',
}

// HS02 V.1: Trọng số AI chọn hướng tiếp cận Hiệp 1 theo bản mệnh
export const AI_H1: Record<string, { T: number; Q: number; D: number }> = {
  chinh_truc: { T: 34, Q: 33, D: 33 },
  nguy_quan_tu: { T: 20, Q: 50, D: 30 },
  ta_ac: { T: 50, Q: 20, D: 30 },
  ngong_cuong: { T: 45, Q: 30, D: 25 },
  si_tinh: { T: 30, Q: 30, D: 40 },
}

// HS02 V.3: Xác suất NPC chọn Tuyệt sát theo bản mệnh khi áp đảo người chơi trong trận sinh tử
export const TUYET_SAT: Record<string, number> = {
  ta_ac: 0.6,
  ngong_cuong: 0.3,
  nguy_quan_tu: 0.3,
  si_tinh: 0.1,
  chinh_truc: 0.0,
}

// HS01 II.2: Danh vọng khi thắng Tam Hiệp công khai theo hạng đối thủ; thua công khai trừ một nửa.
// GIẢ ĐỊNH (M1-11c): chưa có dữ liệu NPC nên mặc định hạng 'truong_lao' (+20), khớp DANH_VONG_THANG_TRAN của mo_phong.py.
export const DANH_VONG_THANG_TRAN = {
  de_tu: 5,
  truong_lao: 20,
  chuong_mon: 50,
} as const
export const HANG_DOI_THU_MAC_DINH = 'truong_lao'

// HS06 I.3: Trạng Thái Tuyệt Cảnh (nhảy vực)
export const TUYET_CANH_PHUC_DUYEN_CAO = 60
export const TUYET_CANH_PHUC_DUYEN_THAP = 30
export const TUYET_CANH_SONG_TRAN = 0.95 // HS02 V.4: không lối thoát nào 100%
export const TUYET_CANH_NGUONG_ROLL = 45
export const TUYET_CANH_AM_THUONG = 5
export const TUYET_CANH_CONG_KY_NGO = 0.5


// HS04 I.1: Bậc môn phái - yêu cầu thăng bậc (tuổi tối thiểu, Cống hiến)
export const BAC_YEU_CAU: Record<number, { tuoi: number; cong_hien: number }> = {
  2: { tuoi: 16, cong_hien: 100 },
  3: { tuoi: 20, cong_hien: 300 },
  4: { tuoi: 28, cong_hien: 700 },
  5: { tuoi: 35, cong_hien: 1500 },
}
export const BAC_CHUONG_MON = 5
export const CONG_HIEN_NHIEM_VU = 50
export const CONG_HIEN_THANG_CAP = 100
export const CONG_HIEN_TRUOT_2_LAN = 50
export const TUOI_NGOAI_MON_TOI_DA = 18

// HS06 II.1: Trợ cấp đệ tử môn phái theo bậc (lạng/năm, tự động, 0 AP)
export const TRO_CAP: Record<number, number> = { 1: 10, 2: 30, 3: 50, 4: 200 }

// HS04 I.1: Sai phái sư môn - thù lao (lạng) và ngưỡng [Giao chiến nhanh] theo bậc
export const SAI_PHAI: Record<number, { thu_lao: [number, number]; nguong: number }> = {
  2: { thu_lao: [50, 150], nguong: 30 },
  3: { thu_lao: [100, 250], nguong: 40 },
  4: { thu_lao: [150, 350], nguong: 50 },
}

// HS02 I (G19): Giá Tàng Kinh Các (Cống hiến) theo tier võ học
export const GIA_TANG_KINH_CAC: Record<number, number> = { 1: 50, 2: 150, 3: 400 }

// HS06 II.3: Nợ
export const LAI_NO = 0.2
export const KHAU_TRU_NO = 0.5
export const NO_QUA_HAN_DOI_NO = 3
export const NO_QUA_HAN_BAO_QUAN = 5
export const DOI_NO_NGUONG = 40
export const DOI_NO_HP = 0.3
export const DOI_NO_THANH_DANH = 30
export const BAO_QUAN_THANH_DANH = 100

// HS06 II.2: Sinh hoạt phí hằng năm theo Danh vọng hiển thị (tăng dần theo mốc), trần khi còn ở môn phái
export const TUOI_SINH_HOAT_PHI = 16
export const SINH_HOAT_PHI: ReadonlyArray<{ danh_vong: number; phi: number }> = [
  { danh_vong: 700, phi: 300 },
  { danh_vong: 400, phi: 150 },
  { danh_vong: 100, phi: 50 },
  { danh_vong: 0, phi: 10 },
]
export const SINH_HOAT_PHI_TRAN_MON_PHAI = 50
export const GIA_PHONG_TRO = 20

// HS06 II.4: Thu nhập gia đình tự động đến hết 15 tuổi
export const TUOI_THU_NHAP_GIA_DINH_MAX = 15

// HS06 II.1: Áp Tiêu
export const AP_TIEU = { thu_lao: [100, 300], p_cuop: 0.35, nguong: 50, danh_vong: 20, den_gap: 2 } as const

// HS06 II.1: Săn Tiền Thưởng - hạng mục tiêu, tiền thưởng (lạng), hệ số Căn cốt / Ngộ tính so với người chơi
export const TUOI_SAN_TIEN_THUONG = 16
export const TIER_SAN_TIEN_THUONG = 2 // "Võ công Thượng thừa trở lên"
export const TRUY_NA_HIEP_NGHIA = 40
export const TRUY_NA: Record<string, { suc: number; cap_them: number; thuong: [number, number] }> = {
  yeu: { suc: 0.8, cap_them: 0, thuong: [150, 400] },
  ngang: { suc: 1, cap_them: 0, thuong: [250, 800] },
  manh: { suc: 1, cap_them: 1, thuong: [600, 1500] }, // "cao hơn 1 cấp võ học"
}

// HS06 III: Kháng Thuốc - hiệu quả đan dược tăng vĩnh viễn ở lần dùng thứ 1, 2, 3+
export const KHANG_THUOC: readonly number[] = [1, 0.5, 0]
// HS06 I.1 "Chữa kịp thời": thuốc trị nội thương là thuốc hồi HP giá từ 350 lạng (Bạch Vân Hùng Đảm Hoàn)
export const GIA_THUOC_NOI_THUONG = 350

/** Tên chủ nợ hiển thị trong Biên Niên Sử. */
export const TEN_CHU_NO: Record<string, string> = {
  chu_tro: 'chủ quán trọ',
  tieu_cuc: 'tiêu cục',
}
