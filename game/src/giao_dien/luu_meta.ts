// 01 mục 11: `vkgh.meta` sống qua mọi kiếp (Điểm Luân Hồi, gói đã mua, kết cục đã mở).
export const KHOA_META = 'vkgh.meta'

export interface Meta {
  diem_luan_hoi: number
  ket_cuc_da_mo: string[]
}

export function docMeta(): Meta {
  const rong: Meta = { diem_luan_hoi: 0, ket_cuc_da_mo: [] }
  try {
    const m = JSON.parse(window.localStorage.getItem(KHOA_META) ?? 'null') as Partial<Meta> | null
    return { ...rong, ...m }
  } catch {
    return rong
  }
}

/** Cộng Điểm Luân Hồi của kiếp vừa khép và mở các kết cục đạt được. */
export function ghiKiepVaoMeta(diem: number, ketCuc: string[]): void {
  const m = docMeta()
  m.diem_luan_hoi += diem
  m.ket_cuc_da_mo = [...new Set([...m.ket_cuc_da_mo, ...ketCuc])]
  try {
    window.localStorage.setItem(KHOA_META, JSON.stringify(m))
  } catch {
    // Bỏ qua lỗi ghi localStorage
  }
}
