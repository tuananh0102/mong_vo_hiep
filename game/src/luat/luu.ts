// 01 mục 11: Lưu game, tuần tự hóa, phiên bản và chuyển đổi.
import type { Lenh, TrangThaiGame } from './kieu'

export const PHIEN_BAN = 1

export interface BanLuu {
  phien_ban: number
  trang_thai_dau: TrangThaiGame
  lenh: Lenh[]
  trang_thai: TrangThaiGame
}

export type HamChuyenDoi = (banLuu: unknown) => unknown

export const CHUYEN_DOI: Record<number, HamChuyenDoi> = {}

/** Tuần tự hóa bản lưu thành chuỗi JSON. */
export function tuanTuHoa(banLuu: BanLuu): string {
  return JSON.stringify(banLuu)
}

/** Đọc chuỗi JSON và nâng cấp phiên bản nếu cần. */
export function docBanLuu(chuoi: string): BanLuu {
  let bl: unknown = JSON.parse(chuoi)
  if (!bl || typeof bl !== 'object') {
    throw new Error('Dữ liệu bản lưu không hợp lệ')
  }

  let obj = bl as { phien_ban?: number; [key: string]: unknown }
  const pbHienTai = obj.phien_ban ?? 0

  let v = pbHienTai
  while (v < PHIEN_BAN) {
    const fn = CHUYEN_DOI[v]
    if (!fn) {
      throw new Error(`Không có hàm chuyển đổi từ phiên bản ${v} lên ${v + 1}`)
    }
    bl = fn(bl)
    obj = bl as { phien_ban?: number; [key: string]: unknown }
    v = obj.phien_ban ?? v + 1
  }

  return bl as BanLuu
}
