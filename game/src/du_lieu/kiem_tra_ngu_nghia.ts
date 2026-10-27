// 01 mục 7.4: kiểm tra chéo sau khi từng file đã qua lược đồ zod.
// Luật 1 (lược đồ) và 2 (ma trùng / khác tên file) chạy ở nap.ts.
// Luật 3 - 8, 10, 11 cần lược đồ sự kiện, tham chiếu: thêm ở M0-08 và task dữ liệu,
// viết sẵn dạng chạy trên danh sách rỗng khi có kiểu.
import type { DuLieu } from './luoc_do'

const EM_DASH = /—/
const CHU_HAN = /[一-鿿]/

function duyetChuoi(v: unknown, duong: string, ra: (duong: string, s: string) => void): void {
  if (typeof v === 'string') ra(duong, v)
  else if (Array.isArray(v)) v.forEach((x, i) => duyetChuoi(x, `${duong}[${i}]`, ra))
  else if (v && typeof v === 'object')
    for (const [k, x] of Object.entries(v)) duyetChuoi(x, `${duong}.${k}`, ra)
}

export function kiemTraNguNghia(dl: DuLieu): string[] {
  const loi: string[] = []
  // Luật 9: không dấu gạch dài, không chữ Hán
  duyetChuoi(dl, 'du_lieu', (duong, s) => {
    if (EM_DASH.test(s)) loi.push(`${duong}: chứa dấu gạch dài`)
    if (CHU_HAN.test(s)) loi.push(`${duong}: chứa chữ Hán`)
  })
  // Luật 12: thiếu nguon đã bị lược đồ zod chặn (nguon: min(1)).
  return loi
}
