// Quy tắc Cứu Mạng (HS02 V.4): tối đa 1 hiệu ứng mỗi trận, theo thứ tự ưu tiên cố định.
// M1 chưa có hiệu ứng nào đủ điều kiện; khung này nhận danh sách hiệu ứng để M2 / M3 thêm vào.

import type { DuLieu } from '../../du_lieu/luoc_do'
import type { DongBienNien, TrangThaiGame } from '../kieu'
import type { Rng } from '../rng'
import type { TranDau } from './tran'

export interface HieuUngCuuMang {
  ma: string
  /** Thứ tự HS02 V.4: 1 Thần Chiếu Kinh, 2 Huynh đệ Cứu giá, 3 Thiên Vương Bảo Tâm Đan, 4 Dược Vương Cốc. */
  uu_tien: number
  /** Đủ điều kiện kích hoạt. Có thể gieo RNG (vd Huynh đệ Cứu giá `[Ngẫu nhiên: 50%]`), không đổi trạng thái. */
  du_dieu_kien: (d: TrangThaiGame, dl: DuLieu, rng: Rng) => boolean
  /** Áp hiệu ứng (hồi sinh, tiêu hao vật phẩm...). */
  ap: (d: TrangThaiGame, dl: DuLieu) => DongBienNien[]
}

/** Danh sách hiệu ứng thật. M1: rỗng. */
export const HIEU_UNG_CUU_MANG: readonly HieuUngCuuMang[] = []

export interface KetQuaCuuMang {
  ma: string | null
  dong_moi: DongBienNien[]
}

/**
 * Khi HP người chơi về 0: kích hoạt hiệu ứng đủ điều kiện đầu tiên theo ưu tiên.
 * Mỗi trận chỉ 1 lần (`tran.cuu_mang_da_dung`). `tat`: mã hiệu ứng tiêu hao người chơi đã tắt ở Hành Trang.
 */
export function kichHoatCuuMang(
  tran: TranDau,
  d: TrangThaiGame,
  dl: DuLieu,
  rng: Rng,
  danhSach: readonly HieuUngCuuMang[] = HIEU_UNG_CUU_MANG,
  tat: ReadonlySet<string> = new Set(),
): KetQuaCuuMang {
  if (tran.cuu_mang_da_dung) return { ma: null, dong_moi: [] }
  const theoUuTien = [...danhSach].sort((x, y) => x.uu_tien - y.uu_tien)
  for (const hu of theoUuTien) {
    if (tat.has(hu.ma)) continue
    if (!hu.du_dieu_kien(d, dl, rng)) continue
    tran.cuu_mang_da_dung = true
    return { ma: hu.ma, dong_moi: hu.ap(d, dl) }
  }
  return { ma: null, dong_moi: [] }
}
