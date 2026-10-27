// 01 mục 8: lược đồ zod cho mọi file JSON. Các lược đồ khác thêm dần ở task sau.
import { z } from 'zod'

// HS01 I (vùng), HS06 I.3 (hệ số vùng đất cộng vào P_KyNgo)
export const LuocDoVung = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  he_so_ky_ngo: z.number().min(0).max(1),
})
export type Vung = z.infer<typeof LuocDoVung>

// HS01 II.8: một dòng cho mỗi chỉ số số. `max` là thang danh nghĩa, `tran_cung` là trần thật (nếu có).
export const LuocDoChiSo = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nhom: z.enum(['nhan_than', 'thien_phu', 'xa_hoi', 'noi_cong', 'chien_dau', 'sinh_ton', 'tap_hoc']),
  min: z.number(),
  max: z.number().nullable(),
  tran_cung: z.number().nullable(),
  hien_thi: z.enum(['hien', 'ban_an', 'an']),
  phai_sinh: z.boolean().default(false),
  nguon: z.string().min(1),
})
export type DinhNghiaChiSo = z.infer<typeof LuocDoChiSo>

// Bản tối thiểu cho M0-05; M1-02 mở rộng (do_hiem, hieu_ung_tuoi_0...).
// `dac_biet`: mã cơ chế riêng; `khoa_<ma_chi_so>` khóa mọi lần cộng chỉ số đó (HS01 III.2).
export const LuocDoThienPhu = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  dac_biet: z.array(z.string()).default([]),
})
export type ThienPhuDuLieu = z.infer<typeof LuocDoThienPhu>

export interface DuLieu {
  vung: Record<string, Vung>
  chi_so: Record<string, DinhNghiaChiSo>
  thien_phu: Record<string, ThienPhuDuLieu>
}
