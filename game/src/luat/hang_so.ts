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
