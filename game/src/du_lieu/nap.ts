// 01 mục 2, 7, 8: nạp + kiểm tra + đóng băng dữ liệu. Hàm thuần, không đọc đĩa.
import type { z } from 'zod'
import { kiemTraNguNghia } from './kiem_tra_ngu_nghia'
import { LuocDoVung, type DuLieu } from './luoc_do'

function dongBangSau<T>(v: T): T {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) {
    Object.freeze(v)
    for (const x of Object.values(v)) dongBangSau(x)
  }
  return v
}

function theoMa<T extends { ma: string }>(duong: string, ds: T[], loi: string[]): Record<string, T> {
  const kq: Record<string, T> = {}
  for (const x of ds) {
    if (x.ma in kq) loi.push(`${duong}: ma "${x.ma}" bị trùng`)
    kq[x.ma] = x
  }
  return kq
}

/** `tep`: đường dẫn tương đối từ du_lieu/ (dấu "/") → nội dung JSON đã parse. */
export function napDuLieu(tep: Record<string, unknown>): DuLieu {
  const loi: string[] = []
  const dl: DuLieu = { vung: {} }

  const doc = <T>(duong: string, noiDung: unknown, luocDo: z.ZodType<T>): T | null => {
    const kq = luocDo.safeParse(noiDung)
    if (kq.success) return kq.data
    for (const e of kq.error.issues) loi.push(`${duong}: ${e.path.join('.')} ${e.message}`)
    return null
  }

  for (const [duong, noiDung] of Object.entries(tep)) {
    if (duong === 'vung.json') {
      const ds = doc(duong, noiDung, LuocDoVung.array())
      if (ds) dl.vung = theoMa(duong, ds, loi)
    } else {
      loi.push(`${duong}: không có lược đồ cho đường dẫn này`)
    }
  }

  if (loi.length === 0) loi.push(...kiemTraNguNghia(dl))
  if (loi.length > 0) throw new Error(`Dữ liệu không hợp lệ:\n${loi.join('\n')}`)
  return dongBangSau(dl)
}
