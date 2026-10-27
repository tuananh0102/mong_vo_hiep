// 01 mục 2, 7, 8: nạp + kiểm tra + đóng băng dữ liệu. Hàm thuần, không đọc đĩa.
import type { z } from 'zod'
import { kiemTraNguNghia } from './kiem_tra_ngu_nghia'
import {
  LuocDoChiSo,
  LuocDoGiaCanh,
  LuocDoHanhDong,
  LuocDoMonPhai,
  LuocDoNhan,
  LuocDoSuKien,
  LuocDoTenNpc,
  LuocDoThienPhu,
  LuocDoTrangThai,
  LuocDoVatPham,
  LuocDoVoHoc,
  LuocDoVung,
  type DuLieu,
} from './luoc_do'

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
  const dl: DuLieu = {
    vung: {},
    chi_so: {},
    gia_canh: {},
    thien_phu: {},
    trang_thai: {},
    nhan: {},
    vo_hoc: {},
    mon_phai: {},
    su_kien: {},
    vat_pham: {},
    hanh_dong: {},
  }

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
    } else if (duong === 'chi_so.json') {
      const ds = doc(duong, noiDung, LuocDoChiSo.array())
      if (ds) dl.chi_so = theoMa(duong, ds, loi)
    } else if (duong === 'gia_canh.json') {
      const ds = doc(duong, noiDung, LuocDoGiaCanh.array())
      if (ds) dl.gia_canh = theoMa(duong, ds, loi)
    } else if (duong === 'thien_phu.json') {
      const ds = doc(duong, noiDung, LuocDoThienPhu.array())
      if (ds) dl.thien_phu = theoMa(duong, ds, loi)
    } else if (duong === 'trang_thai.json') {
      const ds = doc(duong, noiDung, LuocDoTrangThai.array())
      if (ds) dl.trang_thai = theoMa(duong, ds, loi)
    } else if (duong === 'nhan.json') {
      const ds = doc(duong, noiDung, LuocDoNhan.array())
      if (ds) dl.nhan = theoMa(duong, ds, loi)
    } else if (duong.startsWith('vo_hoc/')) {
      const ds = doc(duong, noiDung, LuocDoVoHoc.array())
      if (ds) {
        if (!dl.vo_hoc) dl.vo_hoc = {}
        for (const vh of ds) {
          if (vh.ma in dl.vo_hoc) loi.push(`${duong}: ma "${vh.ma}" bị trùng`)
          dl.vo_hoc[vh.ma] = vh
        }
      }
    } else if (duong.startsWith('mon_phai/')) {
      const mp = doc(duong, noiDung, LuocDoMonPhai)
      if (mp) {
        if (!dl.mon_phai) dl.mon_phai = {}
        if (mp.ma in dl.mon_phai) loi.push(`${duong}: ma "${mp.ma}" bị trùng`)
        dl.mon_phai[mp.ma] = mp
      }
    } else if (duong.startsWith('vat_pham/')) {
      const ds = doc(duong, noiDung, LuocDoVatPham.array())
      if (ds) {
        if (!dl.vat_pham) dl.vat_pham = {}
        for (const vp of ds) {
          if (vp.ma in dl.vat_pham) loi.push(`${duong}: ma "${vp.ma}" bị trùng`)
          dl.vat_pham[vp.ma] = vp
        }
      }
    } else if (duong === 'hanh_dong.json') {
      const ds = doc(duong, noiDung, LuocDoHanhDong.array())
      if (ds) dl.hanh_dong = theoMa(duong, ds, loi)
    } else if (duong === 'npc/ten.json') {
      const tn = doc(duong, noiDung, LuocDoTenNpc)
      if (tn) dl.ten_npc = tn
    } else if (
      duong.startsWith('su_kien/') ||
      (typeof noiDung === 'object' && noiDung !== null && 'lua_chon' in noiDung)
    ) {
      const sk = doc(duong, noiDung, LuocDoSuKien)
      if (sk) {
        if (!dl.su_kien) dl.su_kien = {}
        if (sk.ma in dl.su_kien) loi.push(`${duong}: ma "${sk.ma}" bị trùng`)
        dl.su_kien[sk.ma] = sk
      }
    } else {
      loi.push(`${duong}: không có lược đồ cho đường dẫn này`)
    }
  }

  if (loi.length === 0) loi.push(...kiemTraNguNghia(dl))
  if (loi.length > 0) throw new Error(`Dữ liệu không hợp lệ:\n${loi.join('\n')}`)
  return dongBangSau(dl)
}
