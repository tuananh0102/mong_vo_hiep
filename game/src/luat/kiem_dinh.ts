// HS06 I.2: kiểm định xác suất mềm. Khớp p_roll ở mo_phong/mo_phong.py.
import type { Rng } from './rng'

export type NhanDoKho = 'hiem' | 'kho' | 'kha' | 'de'

/** HS06 I.2 quy tắc "5% - 95%": không có gì chắc chắn 100%. */
export function kepXacSuat(p: number): number {
  return Math.min(0.95, Math.max(0.05, p))
}

/** HS06 I.2.2: P = clamp(0,5 + hiệu x 2,5% + (Phúc duyên - 50) x 0,3%). Roll ngược đảo dấu hiệu. */
export function pRoll(chiSo: number, nguong: number, phucDuyen: number, nguoc = false): number {
  const hieu = nguoc ? nguong - chiSo : chiSo - nguong
  return kepXacSuat(0.5 + hieu * 0.025 + (phucDuyen - 50) * 0.003)
}

/** HS06 I.2 quy tắc bổ sung: `va` lấy hiệu thấp nhất, `hoac` lấy hiệu cao nhất. */
export function pRollNhieu(
  ds: { chiSo: number; nguong: number }[],
  kieu: 'va' | 'hoac',
  phucDuyen: number,
  nguoc = false,
): number {
  if (ds.length === 0) throw new Error('pRollNhieu: danh sách rỗng')
  const hieu = ds.map((d) => (nguoc ? d.nguong - d.chiSo : d.chiSo - d.nguong))
  const chon = kieu === 'va' ? Math.min(...hieu) : Math.max(...hieu)
  // Quy hiệu về chỉ số giả với ngưỡng 0 để dùng lại pRoll (đã kẹp 5% - 95%).
  return pRoll(chon, 0, phucDuyen)
}

/** HS06 I.2 nhãn tỷ lệ: Hiểm < 25%, Khó 25 - 49%, Khá 50 - 74%, Dễ >= 75%. */
export function nhanDoKho(p: number): NhanDoKho {
  if (p < 0.25) return 'hiem'
  if (p < 0.5) return 'kho'
  if (p < 0.75) return 'kha'
  return 'de'
}

export function lanRoll(rng: Rng, p: number): boolean {
  return rng.so() < p
}
