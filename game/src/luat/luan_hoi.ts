// HS07 II.1: Điểm Luân Hồi của một kiếp.
import type { KetCucDuLieu } from '../du_lieu/luoc_do'
import type { TrangThaiGame } from './kieu'

export interface DongDiem {
  nhan: string
  diem: number
}

/** Khóa `thong_ke` mà M2 ghi khi vượt Đại sự kiện (HS01 V). */
export const THONG_KE_DAI_SU_KIEN = 'dai_su_kien_vuot_qua'

/** HS07 II.1 Bảng chấm điểm: từng khoản của Điểm Luân Hồi, theo thứ tự công thức. */
export function chiTietDiemLuanHoi(d: TrangThaiGame, ketCuc: Pick<KetCucDuLieu, 'diem'>): DongDiem[] {
  const nv = d.nhan_vat
  const tuoi = d.ket_thuc?.tuoi ?? nv.tuoi
  const monCap10 = Object.values(nv.vo_hoc).filter((v) => v.cap >= 10).length
  const daiSuKien = nv.thong_ke[THONG_KE_DAI_SU_KIEN] ?? 0
  return [
    { nhan: 'Tuổi thọ × 2', diem: Math.floor(tuoi * 2) },
    { nhan: 'Hiệp nghĩa ÷ 5', diem: Math.floor(Math.abs(nv.hiep_nghia) / 5) },
    { nhan: 'Võ công cấp 10 × 50', diem: monCap10 * 50 },
    { nhan: 'Đại sự kiện × 100', diem: daiSuKien * 100 },
    { nhan: 'Kết cục', diem: ketCuc.diem },
  ]
}

/** HS07 II.1 Tổng Điểm Luân Hồi. */
export function diemLuanHoi(d: TrangThaiGame, ketCuc: Pick<KetCucDuLieu, 'diem'>): number {
  return chiTietDiemLuanHoi(d, ketCuc).reduce((t, x) => t + x.diem, 0)
}
