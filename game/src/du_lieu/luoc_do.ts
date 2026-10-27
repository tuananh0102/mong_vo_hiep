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

export interface DuLieu {
  vung: Record<string, Vung>
}
