// M0-04: ví dụ trong ho_so_08_luoc_do_du_lieu.md phải qua lược đồ zod.
// Mới có lược đồ cho vung.json; ví dụ loại khác thêm vào đây khi task tương ứng thêm lược đồ.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'

const hs08 = readFileSync(new URL('../../ho_so_08_luoc_do_du_lieu.md', import.meta.url), 'utf8')

/** Lấy khối json đầu tiên sau tiêu đề mục. */
function khoiJson(tieuDe: string): unknown {
  const sau = hs08.slice(hs08.indexOf(tieuDe))
  const m = /```json\r?\n([\s\S]*?)```/.exec(sau)
  if (!m?.[1]) throw new Error(`không có khối json sau "${tieuDe}"`)
  return JSON.parse(m[1])
}

describe('ví dụ HS08', () => {
  it('II.1 vung.json qua lược đồ', () => {
    const dl = napDuLieu({ 'vung.json': khoiJson('### II.1.') })
    expect(Object.keys(dl.vung)).toEqual(['trung_nguyen', 'giang_nam'])
  })

  it('II.2 chi_so.json qua lược đồ', () => {
    const dl = napDuLieu({ 'chi_so.json': khoiJson('### II.2.') })
    expect(dl.chi_so['hp_max']?.phai_sinh).toBe(true)
    expect(dl.chi_so['can_cot']?.tran_cung).toBe(150)
  })

  it('không có dấu gạch dài', () => {
    expect(hs08).not.toContain('—')
  })
})
